import { lset } from "./lset";

export class PositionChangeListener {
  add() {
    mxEvent.addListener(positionSelect, "change", function (evt) {
      graph.getModel().beginUpdate();
      try {
        var vals = lset[positionSelect.value];

        if (vals != null) {
          graph.setCellStyles(
            mxConstants.STYLE_LABEL_POSITION,
            vals[0],
            graph.getSelectionCells()
          );
          graph.setCellStyles(
            mxConstants.STYLE_VERTICAL_LABEL_POSITION,
            vals[1],
            graph.getSelectionCells()
          );
          graph.setCellStyles(
            mxConstants.STYLE_ALIGN,
            vals[2],
            graph.getSelectionCells()
          );
          graph.setCellStyles(
            mxConstants.STYLE_VERTICAL_ALIGN,
            vals[3],
            graph.getSelectionCells()
          );
        }
      } finally {
        graph.getModel().endUpdate();
      }

      mxEvent.consume(evt);
    });
  }
}
