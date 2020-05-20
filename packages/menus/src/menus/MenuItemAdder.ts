import { FilenameDialog } from 'sample/FilenameDialog'
import mx from 'mx'
const { mxResources } = mx

export class MenuItemAdder {
  editorUi: any
  menu: any
  graph: any

  constructor(menu) {
    this.menu = menu
  }

  addItem(item: any, submenu, fn, node) {}

  promptSpacing = (defaultValue, fn) => {
    var dlg = new FilenameDialog(
      this.editorUi,
      defaultValue,
      mxResources.get('apply'),
      function (newValue) {
        fn(parseFloat(newValue))
      },
      mxResources.get('spacing')
    )
    this.editorUi.showDialog(dlg.container, 300, 80, true, true)
    dlg.init()
  }
}
