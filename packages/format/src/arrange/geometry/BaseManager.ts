import { GeometryHandler } from "./GeometryHandler";
import mx from "@mxgraph-app/mx";
const {
  mxEventObject,
  mxCellRenderer,
  mxUtils,
  mxEvent,
  mxResources,
  mxConstants,
} = mx;

export class BaseManager extends GeometryHandler {
  width: any;
  height: any;
  panel: any;

  get rect() {
    return this.format.getSelectionState();
  }

  get opt() {
    var opt = this.createCellOption(
      mxResources.get("constrainProportions"),
      mxConstants.STYLE_ASPECT,
      null,
      "fixed",
      "null",
    );
    opt.style.width = "100%";
    return opt;
  }

  get constrainCheckbox() {
    const { opt } = this;
    return opt.getElementsByTagName("input")[0];
  }

  get heightUpdate(): any {
    const { height, panel, constrainCheckbox } = this;
    return this.addGeometryHandler(height, (geo, value) => {
      if (geo.height > 0) {
        value = Math.max(1, panel.fromUnit(value));

        if (constrainCheckbox.checked) {
          geo.width = Math.round((geo.width * value * 100) / geo.height) / 100;
        }

        geo.height = value;
      }
    });
  }

  widthUpdate = (evt?) => {
    const { width, graph, ui, rect } = this;
    // Maximum stroke width is 999
    var value = parseInt(width.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (
      value !=
        mxUtils.getValue(
          rect.style,
          "width",
          mxCellRenderer.defaultShapes["flexArrow"].prototype.defaultWidth,
        )
    ) {
      graph.setCellStyles("width", value, graph.getSelectionCells());
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          ["width"],
          "values",
          [value],
          "cells",
          graph.getSelectionCells(),
        ),
      );
    }

    width.value = value + " pt";
    mxEvent.consume(evt);
  };
}
