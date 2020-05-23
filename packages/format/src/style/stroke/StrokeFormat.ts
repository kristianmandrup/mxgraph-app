import mx from "@mxgraph-app/mx";
import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
const { mxResources, mxClient, mxEvent, mxUtils } = mx;

export class StrokeFormat extends AbstractStrokeFormat {
  format: any;
  editorUi: any;
  container: any;

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
  }
  /**
   * Adds the label menu items to the given menu and parent.
   */
  add() {
    const { graph, container, styleSelect, styles, listener } = this;
    container.style.paddingTop = "4px";
    container.style.paddingBottom = "4px";
    container.style.whiteSpace = "normal";

    // Adds gradient direction option

    for (var i = 0; i < styles.length; i++) {
      var styleOption = document.createElement("option");
      styleOption.setAttribute("value", styles[i]);
      mxUtils.write(styleOption, mxResources.get(styles[i]));
      styleSelect.appendChild(styleOption);
    }

    const { lineColor, colorPanel, stylePanel, update, altUpdate, altPattern } =
      this;
    lineColor.appendChild(styleSelect);
    colorPanel.appendChild(lineColor);

    const { input, altInput, stepper, altStepper, altStylePanel, stylePanel2 } =
      this;

    stylePanel.appendChild(input);
    altStylePanel.appendChild(altInput);

    stylePanel.appendChild(stepper);

    altStylePanel.appendChild(altStepper);

    this.configureInputs();

    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);

    mxEvent.addListener(altInput, "blur", altUpdate);
    mxEvent.addListener(altInput, "change", altUpdate);

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(stylePanel2);
      mxUtils.br(stylePanel2);
    }

    this.addArrows();

    var altSymbol = this.addArrow(altPattern, 9);
    altSymbol.className = "geIcon";
    altSymbol.style.width = "22px";

    const { solid, altSolid, symbol, pattern } = this;

    symbol.appendChild(solid);
    altSymbol.appendChild(altSolid);

    const { lineStart, lineEnd, edgeShape, edgeStyle } = this;

    pattern.style.height = "15px";
    altPattern.style.height = "15px";
    edgeShape.style.height = "15px";
    edgeStyle.style.height = "17px";
    lineStart.style.marginLeft = "3px";
    lineStart.style.height = "17px";
    lineEnd.style.marginLeft = "3px";
    lineEnd.style.height = "17px";

    this.appendPanelsToContainer();

    this.configurePerimeterPanel();

    this.appendToContainer();

    this.addKeyHandlers();

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();

    return container;
  }
}
