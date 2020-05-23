import mx from "@mxgraph-app/mx";
import { BaseStyleFormat } from "../BaseStyleFormat";
import { LineStart } from "./LineStart";
import { LineEnd } from "./LineEnd";
import { AltPattern } from "./AltPattern";
import { Pattern } from "./Pattern";
import { EdgeShape } from "./EdgeShape";
import { EdgeStyle } from "./EdgeStyle";
import { Listener } from "./Listener";
const { mxResources, mxEventObject, mxConstants, mxClient, mxEvent, mxUtils } =
  mx;

export class AbstractStrokeFormat extends BaseStyleFormat {
  format: any;
  editorUi: any;
  container: any;

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
  }

  // Used for mixed selection (vertices and edges)
  get altStylePanel() {
    return this.stylePanel.cloneNode(false);
  }

  get stylePanel2() {
    return this.stylePanel.cloneNode(false);
  }

  get altStepper() {
    return this.createAltStepper();
  }

  createAltStepper() {
    const { altInput, altUpdate } = this;
    var altStepper = this.createStepper(altInput, altUpdate, 1, 9);
    altStepper.style.display = altInput.style.display;
    altStepper.style.marginTop = "2px";
    return altStepper;
  }

  get stepper() {
    return this.createStepr();
  }

  createStepr() {
    const { input, update } = this;
    var stepper = this.createStepper(input, update, 1, 9);
    stepper.style.display = input.style.display;
    stepper.style.marginTop = "2px";
    return stepper;
  }

  get edgeStyle() {
    return new EdgeStyle(this.format, this.editorUi, this.container).create();
  }

  get edgeShape() {
    return new EdgeShape(this.format, this.editorUi, this.container).create();
  }

  get pattern() {
    return new Pattern(this.format, this.editorUi, this.container).create();
  }

  get altPattern() {
    return new AltPattern(this.format, this.editorUi, this.container).create();
  }

  get styles() {
    return ["sharp", "rounded", "curved"];
  }

  get strokeKey() {
    const { ss } = this;
    return ss.style.shape == "image"
      ? mxConstants.STYLE_IMAGE_BORDER
      : mxConstants.STYLE_STROKECOLOR;
  }

  get label() {
    const { ss } = this;
    return ss.style.shape == "image"
      ? mxResources.get("border")
      : mxResources.get("line");
  }

  get lineColor(): any {
    const { label, strokeKey } = this;
    return this.createCellColorOption(
      label,
      strokeKey,
      "#000000",
    );
  }

  get colorPanel() {
    return this.createColorPanel();
  }

  createColorPanel() {
    var colorPanel = document.createElement("div");
    colorPanel.style.fontWeight = "bold";
    return colorPanel;
  }

  get stylePanel() {
    return this.stylePanel();
  }

  createStylePanel() {
    const { colorPanel } = this;
    // Used if only edges selected
    var stylePanel: any = colorPanel.cloneNode(false);
    stylePanel.style.fontWeight = "normal";
    stylePanel.style.whiteSpace = "nowrap";
    stylePanel.style.position = "relative";
    stylePanel.style.paddingLeft = "16px";
    stylePanel.style.marginBottom = "2px";
    stylePanel.style.marginTop = "2px";
    stylePanel.className = "geToolbarContainer";
    return stylePanel;
  }

  get styleSelect() {
    return this.createStyleSelect();
  }

  createStyleSelect() {
    var styleSelect = document.createElement("select");
    styleSelect.style.position = "absolute";
    styleSelect.style.marginTop = "-2px";
    styleSelect.style.right = "72px";
    styleSelect.style.width = "80px";
    return styleSelect;
  }

  changeListener() {
    const { styleSelect, graph, ui } = this;
    mxEvent.addListener(styleSelect, "change", function (evt) {
      graph.getModel().beginUpdate();
      try {
        var keys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
        // Default for rounded is 1
        var values = ["0", null];

        if (styleSelect.value == "rounded") {
          values = ["1", null];
        } else if (styleSelect.value == "curved") {
          values = [null, "1"];
        }

        for (var i = 0; i < keys.length; i++) {
          graph.setCellStyles(keys[i], values[i], graph.getSelectionCells());
        }

        ui.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            keys,
            "values",
            values,
            "cells",
            graph.getSelectionCells(),
          ),
        );
      } finally {
        graph.getModel().endUpdate();
      }

      mxEvent.consume(evt);
    });
  }

  clickListener() {
    const { styleSelect } = this;
    // Stops events from bubbling to color option event handler
    mxEvent.addListener(styleSelect, "click", function (evt) {
      mxEvent.consume(evt);
    });
  }

  get altInput(): any {
    return this.input.cloneNode(true);
  }

  get input() {
    return this.createInput();
  }

  createInput() {
    var input = document.createElement("input");
    input.style.textAlign = "right";
    input.style.marginTop = "2px";
    input.style.width = "41px";
    input.setAttribute("title", mxResources.get("linewidth"));
    return input;
  }

  update = (evt) => {
    const { input, graph, ui, ss } = this;
    // Maximum stroke width is 999
    var value = parseInt(input.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (
      value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)
    ) {
      graph.setCellStyles(
        mxConstants.STYLE_STROKEWIDTH,
        value,
        graph.getSelectionCells(),
      );
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          [mxConstants.STYLE_STROKEWIDTH],
          "values",
          [value],
          "cells",
          graph.getSelectionCells(),
        ),
      );
    }

    input.value = value + " pt";
    mxEvent.consume(evt);
  };

  altUpdate = (evt) => {
    const { altInput, graph, ui, ss } = this;
    // Maximum stroke width is 999
    var value = parseInt(altInput.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (
      value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)
    ) {
      graph.setCellStyles(
        mxConstants.STYLE_STROKEWIDTH,
        value,
        graph.getSelectionCells(),
      );
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          [mxConstants.STYLE_STROKEWIDTH],
          "values",
          [value],
          "cells",
          graph.getSelectionCells(),
        ),
      );
    }

    altInput.value = value + " pt";
    mxEvent.consume(evt);
  };

  configureInputs() {
    const { input, altInput, stepper, altStepper } = this;
    if (!mxClient.IS_QUIRKS) {
      input.style.position = "absolute";
      input.style.right = "32px";
      input.style.height = "15px";
      stepper.style.right = "20px";

      altInput.style.position = "absolute";
      altInput.style.right = "32px";
      altInput.style.height = "15px";
      altStepper.style.right = "20px";
    } else {
      input.style.height = "17px";
      altInput.style.height = "17px";
    }
  }

  get symbol() {
    return this.createSymbol();
  }

  createSymbol() {
    const { pattern } = this;
    var symbol = this.addArrow(pattern, 9);
    symbol.className = "geIcon";
    symbol.style.width = "84px";
    return symbol;
  }

  configurePerimeterPanel() {
    const { arrowPanel, span } = this;
    var spacer = document.createElement("div");
    spacer.style.height = "8px";
    arrowPanel.appendChild(spacer);

    let $span = span.cloneNode(false);
    mxUtils.write(span, mxResources.get("linestart"));
    arrowPanel.appendChild($span);

    mxUtils.br(arrowPanel);
    this.addLabel(arrowPanel, mxResources.get("spacing"), 74, 50);
    this.addLabel(arrowPanel, mxResources.get("size"), 20, 50);
    mxUtils.br(arrowPanel);

    this.perimeterPanel.appendChild($span);
  }

  addItem = (menu, width, cssName, keys, values) => {
    var item = this.editorUi.menus.styleChange(
      menu,
      "",
      keys,
      values,
      "geIcon",
      null,
    );

    var pat = document.createElement("div");
    pat.style.width = width + "px";
    pat.style.height = "1px";
    pat.style.borderBottom = "1px " + cssName + " " + this.defaultStrokeColor;
    pat.style.paddingTop = "6px";

    item.firstChild.firstChild.style.padding = "0px 4px 0px 4px";
    item.firstChild.firstChild.style.width = width + "px";
    item.firstChild.firstChild.appendChild(pat);

    return item;
  };

  get lineEnd() {
    return this.createLineEnd();
  }

  createLineEnd() {
    return new LineEnd(this.format, this.editorUi, this.container).lineEnd();
  }

  get lineStart() {
    return this.createLineStart();
  }

  createLineStart() {
    return new LineStart(this.format, this.editorUi, this.container)
      .lineStart();
  }

  addArrows() {
    const { edgeShape, edgeStyle, lineStart, lineEnd } = this;
    this.addArrow(edgeShape, 8);
    this.addArrow(edgeStyle);
    this.addArrow(lineStart);
    this.addArrow(lineEnd);
  }

  get solid() {
    return this.createSolid();
  }

  createSolid() {
    var solid = document.createElement("div");
    solid.style.width = "85px";
    solid.style.height = "1px";
    solid.style.borderBottom = "1px solid " + this.defaultStrokeColor;
    solid.style.marginBottom = "9px";
    return solid;
  }

  get altSolid() {
    return this.createAltSolid();
  }

  createAltSolid() {
    var altSolid = document.createElement("div");
    altSolid.style.width = "23px";
    altSolid.style.height = "1px";
    altSolid.style.borderBottom = "1px solid " + this.defaultStrokeColor;
    altSolid.style.marginBottom = "9px";
    return altSolid;
  }

  appendPanelsToContainer() {
    const { container, colorPanel, altStylePanel, stylePanel } = this;
    container.appendChild(colorPanel);
    container.appendChild(altStylePanel);
    container.appendChild(stylePanel);
  }

  get arrowPanel(): any {
    return this.createArrowPanel();
  }

  createArrowPanel() {
    const { stylePanel } = this;
    var arrowPanel: any = stylePanel.cloneNode(false);
    arrowPanel.style.paddingBottom = "6px";
    arrowPanel.style.paddingTop = "4px";
    arrowPanel.style.fontWeight = "normal";

    let span = this.createSpanX();

    mxUtils.write(span, mxResources.get("lineend"));
    arrowPanel.appendChild(span);

    mxUtils.br(arrowPanel);
    return arrowPanel;
  }

  createSpanX() {
    var span: any = document.createElement("div");
    span.style.position = "absolute";
    span.style.marginLeft = "3px";
    span.style.marginBottom = "12px";
    span.style.marginTop = "2px";
    span.style.fontWeight = "normal";
    span.style.width = "76px";
    return span;
  }

  get endSpacing() {
    return this.createEndSpacing();
  }

  createEndSpacing() {
    const { arrowPanel } = this;
    var endSpacingUpdate;
    return this.addUnitInput(arrowPanel, "pt", 74, 33, () => {
      endSpacingUpdate.apply(this, arguments);
    });
  }

  get endSize() {
    return this.createEndSize();
  }

  createEndSize() {
    const { arrowPanel } = this;
    var endSizeUpdate;
    return this.addUnitInput(arrowPanel, "pt", 20, 33, () => {
      endSizeUpdate.apply(this, arguments);
    });
  }

  get startSpacing() {
    return this.createStartSpacing();
  }

  createStartSpacing() {
    const { arrowPanel } = this;
    var startSpacingUpdate;
    return this.addUnitInput(arrowPanel, "pt", 74, 33, () => {
      startSpacingUpdate.apply(this, []);
    });
  }

  get startSize() {
    return this.createStartSize();
  }

  createStartSize() {
    const { arrowPanel } = this;
    var startSizeUpdate;
    var startSize = this.addUnitInput(arrowPanel, "pt", 20, 33, () => {
      startSizeUpdate.apply(this, []);
    });
    return startSize;
  }

  get span() {
    return this.createSpan();
  }

  createSpan() {
    var span: any = document.createElement("div");
    span.style.position = "absolute";
    span.style.marginLeft = "3px";
    span.style.marginBottom = "12px";
    span.style.marginTop = "1px";
    span.style.fontWeight = "normal";
    span.style.width = "120px";
    mxUtils.write(span, mxResources.get("perimeter"));
    return span;
  }

  get perimeterPanel() {
    return this.createPerimeterPanel();
  }

  createPerimeterPanel() {
    const { colorPanel } = this;
    var perimeterPanel: any = colorPanel.cloneNode(false);
    perimeterPanel.style.fontWeight = "normal";
    perimeterPanel.style.position = "relative";
    perimeterPanel.style.paddingLeft = "16px";
    perimeterPanel.style.marginBottom = "2px";
    perimeterPanel.style.marginTop = "6px";
    perimeterPanel.style.borderWidth = "0px";
    perimeterPanel.style.paddingBottom = "18px";
    return perimeterPanel;
  }

  get perimeterSpacing() {
    const { perimeterPanel, perimeterUpdate } = this;

    return this.addUnitInput(
      perimeterPanel,
      "pt",
      20,
      41,
      () => {
        perimeterUpdate;
      },
    );
  }

  appendToContainer() {
    const { ss, stylePanel2, arrowPanel, perimeterPanel, container, graph } =
      this;
    if (ss.edges.length == graph.getSelectionCount()) {
      container.appendChild(stylePanel2);

      if (mxClient.IS_QUIRKS) {
        mxUtils.br(container);
        mxUtils.br(container);
      }

      container.appendChild(arrowPanel);
    } else if (ss.vertices.length == graph.getSelectionCount()) {
      if (mxClient.IS_QUIRKS) {
        mxUtils.br(container);
      }

      container.appendChild(perimeterPanel);
    }
  }

  listener = (sender?, evt?, force?) => {
    return new Listener(this.format, this.editorUi, this.container).handler(
      sender,
      evt,
      force,
    );
  };

  setStyleSelect() {
    const { ss } = this;
    const { styleSelect } = this;
    styleSelect.style.visibility =
      ss.style.shape == "connector" || ss.style.shape == "filledEdge"
        ? ""
        : "hidden";

    if (mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == "1") {
      styleSelect.value = "curved";
    } else if (
      mxUtils.getValue(ss.style, mxConstants.STYLE_ROUNDED, null) == "1"
    ) {
      styleSelect.value = "rounded";
    }
  }

  setSolidStyle() {
    const { ss, solid } = this;
    if (mxUtils.getValue(ss.style, mxConstants.STYLE_DASHED, null) == "1") {
      if (
        mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, null) ==
          null
      ) {
        solid.style.borderBottom = "1px dashed " + this.defaultStrokeColor;
      } else {
        solid.style.borderBottom = "1px dotted " + this.defaultStrokeColor;
      }
    } else {
      solid.style.borderBottom = "1px solid " + this.defaultStrokeColor;
    }
  }

  get edgeStyleDiv() {
    return this.createEdgeStyleDiv();
  }

  createEdgeStyleDiv() {
    const { edgeStyle, ss } = this;
    var edgeStyleDiv = edgeStyle.getElementsByTagName("div")[0];
    var es = mxUtils.getValue(ss.style, mxConstants.STYLE_EDGE, null);

    if (
      mxUtils.getValue(ss.style, mxConstants.STYLE_NOEDGESTYLE, null) == "1"
    ) {
      es = null;
    }

    if (
      es == "orthogonalEdgeStyle" &&
      mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == "1"
    ) {
      edgeStyleDiv.className = "geSprite geSprite-curved";
    } else if (es == "straight" || es == "none" || es == null) {
      edgeStyleDiv.className = "geSprite geSprite-straight";
    } else if (es == "entityRelationEdgeStyle") {
      edgeStyleDiv.className = "geSprite geSprite-entity";
    } else if (es == "elbowEdgeStyle") {
      edgeStyleDiv.className = "geSprite " +
        (mxUtils.getValue(ss.style, mxConstants.STYLE_ELBOW, null) ==
          "vertical"
          ? "geSprite-verticalelbow"
          : "geSprite-horizontalelbow");
    } else if (es == "isometricEdgeStyle") {
      edgeStyleDiv.className = "geSprite " +
        (mxUtils.getValue(ss.style, mxConstants.STYLE_ELBOW, null) ==
          "vertical"
          ? "geSprite-verticalisometric"
          : "geSprite-horizontalisometric");
    } else {
      edgeStyleDiv.className = "geSprite geSprite-orthogonal";
    }
    return edgeStyleDiv;
  }

  setSpecialMarkerCases() {
    const { sourceDiv, targetDiv, ss } = this;
    // Special cases for markers
    if (ss.style.shape == "arrow") {
      sourceDiv.className = "geSprite geSprite-noarrow";
      targetDiv.className = "geSprite geSprite-endblocktrans";
    } else if (ss.style.shape == "link") {
      sourceDiv.className = "geSprite geSprite-noarrow";
      targetDiv.className = "geSprite geSprite-noarrow";
    }
  }

  get sourceDiv() {
    const { lineStart, updateArrow, ss } = this;
    return updateArrow(
      mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, null),
      mxUtils.getValue(ss.style, "startFill", "1"),
      lineStart,
      "start",
    );
  }

  get targetDiv() {
    const { lineEnd, updateArrow, ss } = this;
    return updateArrow(
      mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, null),
      mxUtils.getValue(ss.style, "endFill", "1"),
      lineEnd,
      "end",
    );
  }

  // Updates icon for edge shape
  get edgeShapeDiv() {
    const { edgeShape, ss } = this;
    var edgeShapeDiv = edgeShape.getElementsByTagName("div")[0];
    if (ss.style.shape == "link") {
      edgeShapeDiv.className = "geSprite geSprite-linkedge";
    } else if (ss.style.shape == "flexArrow") {
      edgeShapeDiv.className = "geSprite geSprite-arrow";
    } else if (ss.style.shape == "arrow") {
      edgeShapeDiv.className = "geSprite geSprite-simplearrow";
    } else {
      edgeShapeDiv.className = "geSprite geSprite-connection";
    }
    return edgeShapeDiv;
  }

  addKeyHandlers() {
    const {
      listener,
      input,
      startSize,
      startSpacing,
      endSize,
      endSpacing,
      perimeterSpacing,
    } = this;
    this.addKeyHandler(input, listener);
    this.addKeyHandler(startSize, listener);
    this.addKeyHandler(startSpacing, listener);
    this.addKeyHandler(endSize, listener);
    this.addKeyHandler(endSpacing, listener);
    this.addKeyHandler(perimeterSpacing, listener);
  }

  updateArrow = (marker, fill, elt, prefix) => {
    const { ui, ss } = this;
    var markerDiv = elt.getElementsByTagName("div")[0];

    markerDiv.className = ui.getCssClassForMarker(
      prefix,
      ss.style.shape,
      marker,
      fill,
    );

    if (markerDiv.className == "geSprite geSprite-noarrow") {
      markerDiv.innerHTML = mxUtils.htmlEntities(mxResources.get("none"));
      markerDiv.style.backgroundImage = "none";
      markerDiv.style.verticalAlign = "top";
      markerDiv.style.marginTop = "5px";
      markerDiv.style.fontSize = "10px";
      markerDiv.style.filter = "none";
      markerDiv.style.color = this.defaultStrokeColor;
      markerDiv.nextSibling.style.marginTop = "0px";
    }

    return markerDiv;
  };

  /**
  * Adds the label menu items to the given menu and parent.
  */

  get startSizeUpdate() {
    const { startSize } = this;
    return this.installInputHandler(
      startSize,
      mxConstants.STYLE_STARTSIZE,
      mxConstants.DEFAULT_MARKERSIZE,
      0,
      999,
      " pt",
    );
  }
  get startSpacingUpdate() {
    const { startSpacing } = this;
    return this.installInputHandler(
      startSpacing,
      mxConstants.STYLE_SOURCE_PERIMETER_SPACING,
      0,
      -999,
      999,
      " pt",
    );
  }

  get endSizeUpdate() {
    const { endSize } = this;
    return this.installInputHandler(
      endSize,
      mxConstants.STYLE_ENDSIZE,
      mxConstants.DEFAULT_MARKERSIZE,
      0,
      999,
      " pt",
    );
  }

  get endSpacingUpdate() {
    const { endSpacing } = this;
    return this.installInputHandler(
      endSpacing,
      mxConstants.STYLE_TARGET_PERIMETER_SPACING,
      0,
      -999,
      999,
      " pt",
    );
  }

  perimeterUpdate = () => {
    const { perimeterSpacing } = this;
    return this.installInputHandler(
      perimeterSpacing,
      mxConstants.STYLE_PERIMETER_SPACING,
      0,
      0,
      999,
      " pt",
    );
  };
}
