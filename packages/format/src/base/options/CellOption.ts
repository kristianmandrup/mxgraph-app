import { FormatOption } from "./FormatOption";
import mx from "@mxgraph-app/mx";
const { mxEventObject, mxEvent, mxUtils } = mx;

export class CellOption extends FormatOption {
  /**
   * The string 'null' means use null in values.
   */
  createCellOption(
    label,
    key,
    defaultValue,
    enabledValue,
    disabledValue,
    fn?,
    action?,
    stopEditing?,
  ) {
    enabledValue = enabledValue != null
      ? enabledValue == "null" ? null : enabledValue
      : "1";
    disabledValue = disabledValue != null
      ? disabledValue == "null" ? null : disabledValue
      : "0";

    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    return this.createOption(
      label,
      function () {
        // Seems to be null sometimes, not sure why...
        var state = graph.view.getState(graph.getSelectionCell());

        if (state != null) {
          return (
            mxUtils.getValue(state.style, key, defaultValue) != disabledValue
          );
        }

        return null;
      },
      function (checked) {
        if (stopEditing) {
          graph.stopEditing();
        }

        if (action != null) {
          action.funct();
        } else {
          graph.getModel().beginUpdate();
          try {
            var value = checked ? enabledValue : disabledValue;
            graph.setCellStyles(key, value, graph.getSelectionCells());

            if (fn != null) {
              fn(graph.getSelectionCells(), value);
            }

            ui.fireEvent(
              new mxEventObject(
                "styleChanged",
                "keys",
                [key],
                "values",
                [value],
                "cells",
                graph.getSelectionCells(),
              ),
            );
          } finally {
            graph.getModel().endUpdate();
          }
        }
      },
      {
        install: function (apply) {
          this.listener = function () {
            // Seems to be null sometimes, not sure why...
            var state = graph.view.getState(graph.getSelectionCell());

            if (state != null) {
              apply(
                mxUtils.getValue(state.style, key, defaultValue) !=
                  disabledValue,
              );
            }
          };

          graph.getModel().addListener(mxEvent.CHANGE, this.listener);
        },
        destroy: function () {
          graph.getModel().removeListener(this.listener);
        },
      },
    );
  }
}
