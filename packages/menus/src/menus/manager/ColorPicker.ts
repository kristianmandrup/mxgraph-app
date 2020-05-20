import { ColorDialog } from 'sample/dialogs'
import mx from 'mx'
const { mxConstants, mxUtils } = mx

export class ColorPicker {
  editorUi: any
  colorDialog?: ColorDialog
  /**
   * Adds a handler for showing a menu in the given element.
   */
  pickColor(key, cmd, defaultValue) {
    var graph = this.editorUi.editor.graph
    var h =
      226 +
      (Math.ceil(ColorDialog.prototype.presetColors.length / 12) +
        Math.ceil(ColorDialog.prototype.defaultColors.length / 12)) *
        17

    if (cmd != null && graph.cellEditor.isContentEditing()) {
      // Saves and restores text selection for in-place editor
      var selState = graph.cellEditor.saveSelection()

      var dlg = new ColorDialog(
        this.editorUi,
        defaultValue || '000000',
        mxUtils.bind(this, function (color) {
          graph.cellEditor.restoreSelection(selState)
          document.execCommand(cmd, false, color != mxConstants.NONE ? color : 'transparent')
        }),
        function () {
          graph.cellEditor.restoreSelection(selState)
        }
      )
      this.editorUi.showDialog(dlg.container, 230, h, true, true)
      dlg.init()
    } else {
      if (this.colorDialog == null) {
        this.colorDialog = new ColorDialog(this.editorUi)
      }

      this.colorDialog.currentColorKey = key
      var state = graph.getView().getState(graph.getSelectionCell())
      var color = 'none'

      if (state != null) {
        color = state.style[key] || color
      }

      if (color == 'none') {
        color = 'ffffff'
        this.colorDialog.picker.fromString('ffffff')
        this.colorDialog.colorInput.value = 'none'
      } else {
        this.colorDialog.picker.fromString(color)
      }

      this.editorUi.showDialog(this.colorDialog.container, 230, h, true, true)
      this.colorDialog.init()
    }
  }
}
