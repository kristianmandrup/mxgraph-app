import { ColorDialog } from "../../_imports";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class ColorPicker {
  editorUi: any;
  colorDialog?: ColorDialog;
  /**
   * Adds a handler for showing a menu in the given element.
   */
  pickColor(key, cmd, defaultValue) {
    const proto: any = ColorDialog.prototype;
    var graph = this.editorUi.editor.graph;
    var h =
      226 +
      (Math.ceil(proto.presetColors.length / 12) +
        Math.ceil(proto.defaultColors.length / 12)) *
        17;

    if (cmd != null && graph.cellEditor.isContentEditing()) {
      // Saves and restores text selection for in-place editor
      var selState = graph.cellEditor.saveSelection();

      var dlg: any = new ColorDialog(
        this.editorUi,
        defaultValue || "000000",
        (color) => {
          graph.cellEditor.restoreSelection(selState);
          document.execCommand(
            cmd,
            false,
            color != mxConstants.NONE ? color : "transparent"
          );
        },
        () => {
          graph.cellEditor.restoreSelection(selState);
        }
      );
      this.editorUi.showDialog(dlg.container, 230, h, true, true);
      dlg.init();
    } else {
      if (this.colorDialog == null) {
        this.colorDialog = new ColorDialog(this.editorUi);
      }

      this.colorDialog.currentColorKey = key;
      var state = graph.getView().getState(graph.getSelectionCell());
      var color = "none";

      if (state != null) {
        color = state.style[key] || color;
      }

      if (color == "none") {
        color = "ffffff";
        this.colorDialog.picker.fromString("ffffff");
        this.colorDialog.colorInput.value = "none";
      } else {
        this.colorDialog.picker.fromString(color);
      }

      this.editorUi.showDialog(this.colorDialog.container, 230, h, true, true);
      this.colorDialog.init();
    }
  }
}
