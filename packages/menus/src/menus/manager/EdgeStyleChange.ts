import mx from "@mxgraph-app/mx";
const { mxEventObject } = mx;

export class EdgeStyleChange {
  editorUi: any;

  constructor(editorUi: any) {
    this.editorUi = editorUi;
  }

  /**
   * Adds a style change item to the given menu.
   */
  add(menu, label, keys, values, sprite, parent, reset) {
    return menu.addItem(
      label,
      null,
      () => {
        var graph = this.editorUi.editor.graph;
        graph.stopEditing(false);

        graph.getModel().beginUpdate();
        try {
          var cells = graph.getSelectionCells();
          var edges: any[] = [];

          for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];

            if (graph.getModel().isEdge(cell)) {
              if (reset) {
                var geo = graph.getCellGeometry(cell);

                // Resets all edge points
                if (geo != null) {
                  geo = geo.clone();
                  geo.points = null;
                  graph.getModel().setGeometry(cell, geo);
                }
              }

              for (var j = 0; j < keys.length; j++) {
                graph.setCellStyles(keys[j], values[j], [cell]);
              }

              edges.push(cell);
            }
          }

          this.editorUi.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              keys,
              "values",
              values,
              "cells",
              edges
            )
          );
        } finally {
          graph.getModel().endUpdate();
        }
      },
      parent,
      sprite
    );
  }
}
