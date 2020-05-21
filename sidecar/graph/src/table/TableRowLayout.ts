import mx from "mx";
import { Graph } from "../Graph";
const { mxConstants, mxUtils, mxGraphLayout } = mx;

/**
 * Table Layout
 */
/**
 * Extends mxGraphLayout
 */
// TableRowLayout.prototype = new TableLayout();
// TableRowLayout.prototype.constructor = TableRowLayout;
export class TableRowLayout {
  graph: any;

  constructor(graph) {
    this.graph = graph;
    // @ts-ignore
    mxGraphLayout.call(this, graph);
  }

  /**
   * Reorders rows.
   */
  moveCell(cell, x, y) {
    // TODO: Reorder columns
    console.log("TableRowLayout.moveCell", cell, x, y);
  }

  /**
   * Updates row start sizes.
   */
  execute(row) {
    var off = this.graph.getActualStartSize(row, true);
    var off0 = this.graph.getActualStartSize(row);
    var style = this.graph.getCellStyle(row);
    var model = this.graph.getModel();
    var table = model.getParent(row);

    console.log("tableRowLayout.execute", row, off, off0);

    if (style != null && table != null) {
      var size = parseInt(
        mxUtils.getValue(
          style,
          mxConstants.STYLE_STARTSIZE,
          mxConstants.DEFAULT_STARTSIZE,
        ),
      );

      model.beginUpdate();
      try {
        // Swimlane rotation requires resize of last row element
        if (this.graph.isTableRow(row)) {
          if (off.width != off0.width || off.x != off0.x) {
            var cell = model.getChildAt(row, model.getChildCount(row) - 1);
            var geo = this.graph.getCellGeometry(cell);

            if (geo != null) {
              geo = geo.clone();
              geo.width += off0.width - off.width - off.x - off0.x;
              geo.width = Math.max(Graph.minTableColumnWidth, geo.width);
              model.setGeometry(cell, geo);
            }
          }
        }

        for (var i = 0; i < model.getChildCount(table); i++) {
          var current = model.getChildAt(table, i);

          if (current != row) {
            var temp = this.graph.getActualStartSize(current);

            // Checks if same side is offset
            if (
              (off.x > 0 && temp.x > 0) ||
              (off.y > 0 && temp.y > 0) ||
              (off.width > 0 && temp.width > 0) ||
              (off.height > 0 && temp.height > 0)
            ) {
              this.graph.setCellStyles(
                mxConstants.STYLE_STARTSIZE,
                size,
                [current],
              );
            }
          }
        }
      } finally {
        model.endUpdate();
      }
    }
  }
}
