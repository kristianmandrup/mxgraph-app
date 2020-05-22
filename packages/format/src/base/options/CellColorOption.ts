import mx from "@mxgraph-app/mx";
const { mxEventObject, mxConstants, mxEvent, mxUtils } = mx;
import { ColorOption } from "./ColorOption";

export class CellColorOption extends ColorOption {
  create(
    label,
    colorKey,
    defaultColor?,
    callbackFn?,
    setStyleFn?,
  ) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    return this.createColorOption(
      label,
      () => {
        // Seems to be null sometimes, not sure why...
        var state = graph.view.getState(graph.getSelectionCell());

        if (state != null) {
          return mxUtils.getValue(state.style, colorKey, null);
        }

        return null;
      },
      function (color) {
        graph.getModel().beginUpdate();
        try {
          if (setStyleFn != null) {
            setStyleFn(color);
          }

          graph.setCellStyles(colorKey, color, graph.getSelectionCells());
          ui.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              [colorKey],
              "values",
              [color],
              "cells",
              graph.getSelectionCells(),
            ),
          );
        } finally {
          graph.getModel().endUpdate();
        }
      },
      defaultColor || mxConstants.NONE,
      {
        install: function (apply) {
          this.listener = function () {
            // Seems to be null sometimes, not sure why...
            var state = graph.view.getState(graph.getSelectionCell());

            if (state != null) {
              apply(mxUtils.getValue(state.style, colorKey, null));
            }
          };

          graph.getModel().addListener(mxEvent.CHANGE, this.listener);
        },
        destroy: function () {
          graph.getModel().removeListener(this.listener);
        },
      },
      callbackFn,
    );
  }
}
