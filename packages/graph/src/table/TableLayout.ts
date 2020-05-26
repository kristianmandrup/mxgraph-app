import mx from "@mxgraph-app/mx";
const { mxGraphLayout } = mx;

/**
 * Table Layout
 */
export class TableLayout {
  graph: any;

  constructor(graph) {
    // inherits from mxGraphLayout
    // @ts-ignore
    mxGraphLayout.call(this, graph);
    this.graph = graph;
  }

  /**
   * Reorders rows.
   */
  moveCell(cell, x, y) {
    // TODO: Reorder rows
    console.log("tableLayout.moveCell", cell, x, y);
  }

  /**
   *
   */
  resizeCell(cell, geo, prev) {
    if (this.graph.isTable(cell)) {
      this.graph.tableResized(cell, geo, prev);
    } else if (this.graph.isTableRow(cell)) {
      this.graph.tableRowResized(cell, geo, prev);
    } else if (this.graph.isTableCell(cell)) {
      this.graph.tableCellResized(cell, geo, prev);
    }
  }
  /**
   * Updates column width and row height.
   */
  execute(table) {
    var off = this.graph.getActualStartSize(table, true);
    var model = this.graph.getModel();
    var y = off.y;
    var rows: any[] = [];
    var maxX = 0;
    var x = 0;
    for (var i = 0; i < model.getChildCount(table); i++) {
      var row = model.getChildAt(table, i);

      if (row != null && model.isVertex(row)) {
        var rowGeo = this.graph.getCellGeometry(row);

        if (rowGeo != null) {
          rowGeo = rowGeo.clone();
          var rowOff = this.graph.getActualStartSize(row, true);
          var childCount = model.getChildCount(row);
          x = rowOff.x;

          for (var j = 0; j < childCount; j++) {
            var cell = model.getChildAt(row, j);

            if (cell != null) {
              var geo = this.graph.getCellGeometry(cell);

              if (geo != null) {
                geo = geo.clone();

                rowGeo.height = geo.height + rowOff.y + rowOff.height;
                geo.x = x;
                geo.y = rowOff.y;
                model.setGeometry(cell, geo);

                x += geo.width;

                if (j == childCount - 1) {
                  rows.push([geo, rowGeo, rowOff]);
                  maxX = Math.max(x, maxX);
                }
              }
            }
          }

          rowGeo.width = x + rowOff.width;
          rowGeo.y = y;
          rowGeo.x = off.x;
          model.setGeometry(row, rowGeo);

          y += rowGeo.height;
        }
      }
    }

    // Updates table size
    var tableGeo = this.graph.getCellGeometry(table);

    if (tableGeo != null) {
      tableGeo = tableGeo.clone();
      tableGeo.width = x + off.x + off.width;
      tableGeo.height = y + off.height;
      model.setGeometry(table, tableGeo);

      for (var i = 0; i < rows.length; i++) {
        if (rows[i][1].width < maxX) {
          rows[i][0].width += maxX - rows[i][1].width;
          rows[i][1].width += maxX - rows[i][1].width;
        }
      }
    }
  }
}
