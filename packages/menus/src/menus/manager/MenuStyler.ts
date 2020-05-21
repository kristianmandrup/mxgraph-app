import mx from "@mxgraph-app/mx";
const { mxEventObject, mxConstants } = mx;

export class MenuStyler {
  editorUi: any;

  constructor(editorUi: any) {
    this.editorUi = editorUi;
  }
  /**
   * Adds a style change item to the given menu.
   */
  styleChange(menu, label, keys, values, sprite, parent, fn, post) {
    var apply = this.createStyleChangeFunction(keys, values);

    return menu.addItem(
      label,
      null,
      () => {
        var graph = this.editorUi.editor.graph;

        if (fn != null && graph.cellEditor.isContentEditing()) {
          fn();
        } else {
          apply(post);
        }
      },
      parent,
      sprite
    );
  }

  /**
   *
   */
  createStyleChangeFunction(keys, values) {
    return (post) => {
      var graph = this.editorUi.editor.graph;
      graph.stopEditing(false);

      graph.getModel().beginUpdate();
      try {
        var cells = graph.getSelectionCells();

        for (var i = 0; i < keys.length; i++) {
          graph.setCellStyles(keys[i], values[i], cells);

          // Removes CSS alignment to produce consistent output
          if (keys[i] == mxConstants.STYLE_ALIGN) {
            graph.updateLabelElements(cells, function (elt) {
              elt.removeAttribute("align");
              elt.style.textAlign = null;
            });
          }

          // Updates autosize after font changes
          if (keys[i] == mxConstants.STYLE_FONTFAMILY) {
            for (var i = 0; i < cells.length; i++) {
              if (graph.model.getChildCount(cells[i]) == 0) {
                graph.autoSizeCell(cells[i], false);
              }
            }
          }
        }

        if (post != null) {
          post();
        }

        this.editorUi.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            keys,
            "values",
            values,
            "cells",
            cells
          )
        );
      } finally {
        graph.getModel().endUpdate();
      }
    };
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  toggleStyle(key, defaultValue) {
    var graph = this.editorUi.editor.graph;
    var value = graph.toggleCellStyles(key, defaultValue);
    this.editorUi.fireEvent(
      new mxEventObject(
        "styleChanged",
        "keys",
        [key],
        "values",
        [value],
        "cells",
        graph.getSelectionCells()
      )
    );
  }
}
