import mx from "@mxgraph-app/mx";
import { Base } from "./Base";
const { mxEventObject, mxConstants, mxEvent, mxUtils } = mx;

export class InputHandlerInstaller extends Base {
  /**
   * Install input handler.
   */
  install(
    input,
    key,
    defaultValue,
    min,
    max,
    unit,
    textEditFallback?,
    isFloat?,
  ) {
    unit = unit != null ? unit : "";
    isFloat = isFloat != null ? isFloat : false;

    var ui = this.editorUi;
    var graph = ui.editor.graph;

    min = min != null ? min : 1;
    max = max != null ? max : 999;

    var selState = null;
    var updating = false;

    var update = (evt) => {
      var value = isFloat ? parseFloat(input.value) : parseInt(input.value);

      // Special case: angle mod 360
      if (!isNaN(value) && key == mxConstants.STYLE_ROTATION) {
        // Workaround for decimal rounding errors in floats is to
        // use integer and round all numbers to two decimal point
        value = mxUtils.mod(Math.round(value * 100), 36000) / 100;
      }

      value = Math.min(max, Math.max(min, isNaN(value) ? defaultValue : value));

      if (graph.cellEditor.isContentEditing() && textEditFallback) {
        if (!updating) {
          updating = true;

          if (selState != null) {
            graph.cellEditor.restoreSelection(selState);
            selState = null;
          }

          textEditFallback(value);
          input.value = value + unit;

          // Restore focus and selection in input
          updating = false;
        }
      } else if (
        value !=
          mxUtils.getValue(
            this.format.getSelectionState().style,
            key,
            defaultValue,
          )
      ) {
        if (graph.isEditing()) {
          graph.stopEditing(true);
        }

        graph.getModel().beginUpdate();
        try {
          var cells = graph.getSelectionCells();
          graph.setCellStyles(key, value, cells);

          // Handles special case for fontSize where HTML labels are parsed and updated
          if (key == mxConstants.STYLE_FONTSIZE) {
            graph.updateLabelElements(graph.getSelectionCells(), (elt) => {
              elt.style.fontSize = value + "px";
              elt.removeAttribute("size");
            });
          }

          for (var i = 0; i < cells.length; i++) {
            if (graph.model.getChildCount(cells[i]) == 0) {
              graph.autoSizeCell(cells[i], false);
            }
          }

          ui.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              [key],
              "values",
              [value],
              "cells",
              cells,
            ),
          );
        } finally {
          graph.getModel().endUpdate();
        }
      }

      input.value = value + unit;
      mxEvent.consume(evt);
    };

    if (textEditFallback && graph.cellEditor.isContentEditing()) {
      // KNOWN: Arrow up/down clear selection text in quirks/IE 8
      // Text size via arrow button limits to 16 in IE11. Why?
      mxEvent.addListener(input, "mousedown", function () {
        if (document.activeElement == graph.cellEditor.textarea) {
          selState = graph.cellEditor.saveSelection();
        }
      });

      mxEvent.addListener(input, "touchstart", function () {
        if (document.activeElement == graph.cellEditor.textarea) {
          selState = graph.cellEditor.saveSelection();
        }
      });
    }

    mxEvent.addListener(input, "change", update);
    mxEvent.addListener(input, "blur", update);

    return update;
  }
}
