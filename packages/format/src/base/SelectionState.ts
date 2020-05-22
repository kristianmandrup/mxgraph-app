import { Base } from "./Base";
import mx from "@mxgraph-app/mx";
const { mxConstants, mxUtils } = mx;

export class SelectionState extends Base {
  /**
   * Adds the given color option.
   */
  getState() {
    var graph = this.editorUi.editor.graph;
    var cells = graph.getSelectionCells();
    var shape = null;

    for (var i = 0; i < cells.length; i++) {
      var state = graph.view.getState(cells[i]);

      if (state != null) {
        var tmp = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

        if (tmp != null) {
          if (shape == null) {
            shape = tmp;
          } else if (shape != tmp) {
            return null;
          }
        }
      }
    }
    return shape;
  }
}
