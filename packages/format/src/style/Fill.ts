import mx from "@mxgraph-app/mx";
import { BaseStyleFormat } from "./BaseStyleFormat";
const { mxResources, mxConstants, mxClient, mxEvent, mxUtils } = mx;

export class Fill extends BaseStyleFormat {
  /**
   * Adds the label menu items to the given menu and parent.
   */
  addFill() {
    const { ui, graph, ss, container } = this;
    container.style.paddingTop = "6px";
    container.style.paddingBottom = "6px";

    // Adds gradient direction option
    var gradientSelect = document.createElement("select");
    gradientSelect.style.position = "absolute";
    gradientSelect.style.marginTop = "-2px";
    gradientSelect.style.right = mxClient.IS_QUIRKS ? "52px" : "72px";
    gradientSelect.style.width = "70px";

    // Stops events from bubbling to color option event handler
    mxEvent.addListener(gradientSelect, "click", function (evt) {
      mxEvent.consume(evt);
    });

    var gradientPanel: any = this.createCellColorOption(
      mxResources.get("gradient"),
      mxConstants.STYLE_GRADIENTCOLOR,
      "#ffffff",
      function (color) {
        if (color == null || color == mxConstants.NONE) {
          gradientSelect.style.display = "none";
        } else {
          gradientSelect.style.display = "";
        }
      },
    );

    var fillKey = ss.style.shape == "image"
      ? mxConstants.STYLE_IMAGE_BACKGROUND
      : mxConstants.STYLE_FILLCOLOR;
    var label = ss.style.shape == "image"
      ? mxResources.get("background")
      : mxResources.get("fill");

    var fillPanel: any = this.createCellColorOption(label, fillKey, "#ffffff");
    fillPanel.style.fontWeight = "bold";

    var tmpColor = mxUtils.getValue(ss.style, fillKey, null);
    gradientPanel.style.display = tmpColor != null &&
      tmpColor != mxConstants.NONE &&
      ss.fill &&
      ss.style.shape != "image"
      ? ""
      : "none";

    var directions = [
      mxConstants.DIRECTION_NORTH,
      mxConstants.DIRECTION_EAST,
      mxConstants.DIRECTION_SOUTH,
      mxConstants.DIRECTION_WEST,
    ];

    for (var i = 0; i < directions.length; i++) {
      var gradientOption = document.createElement("option");
      gradientOption.setAttribute("value", directions[i]);
      mxUtils.write(gradientOption, mxResources.get(directions[i]));
      gradientSelect.appendChild(gradientOption);
    }

    gradientPanel.appendChild(gradientSelect);

    var listener = () => {
      const { ss } = this;
      var value = mxUtils.getValue(
        ss.style,
        mxConstants.STYLE_GRADIENT_DIRECTION,
        mxConstants.DIRECTION_SOUTH,
      );

      // Handles empty string which is not allowed as a value
      if (value == "") {
        value = mxConstants.DIRECTION_SOUTH;
      }

      gradientSelect.value = value;
      container.style.display = ss.fill ? "" : "none";

      var fillColor = mxUtils.getValue(
        ss.style,
        mxConstants.STYLE_FILLCOLOR,
        null,
      );

      if (
        !ss.fill ||
        ss.containsImage ||
        fillColor == null ||
        fillColor == mxConstants.NONE ||
        ss.style.shape == "filledEdge"
      ) {
        gradientPanel.style.display = "none";
      } else {
        gradientPanel.style.display = "";
      }
    };

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();

    mxEvent.addListener(gradientSelect, "change", function (evt) {
      graph.setCellStyles(
        mxConstants.STYLE_GRADIENT_DIRECTION,
        gradientSelect.value,
        graph.getSelectionCells(),
      );
      mxEvent.consume(evt);
    });

    container.appendChild(fillPanel);
    container.appendChild(gradientPanel);

    // Adds custom colors
    var custom: any = this.getCustomColors();

    for (var i = 0; i < custom.length; i++) {
      container.appendChild(
        this.createCellColorOption(
          custom[i].title,
          custom[i].key,
          custom[i].defaultValue,
        ),
      );
    }

    return container;
  }

  protected getCustomColors() {
    var ss = this.format.getSelectionState();
    var result: any[] = [];

    if (ss.style.shape == "swimlane") {
      result.push({
        title: mxResources.get("laneColor"),
        key: "swimlaneFillColor",
        defaultValue: "#ffffff",
      });
    }

    return result;
  }
}
