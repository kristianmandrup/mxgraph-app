import { MenuAdder } from '../../../MenuAdder'
import { Menu } from 'ui/menus/Menu'
import mx from 'mx'
import { FontItem } from './FontItem'
const { mxUtils, mxEventObject, mxConstants, mxResources } = mx

export class FontFamilyMenu extends MenuAdder {
  add() {
    const { graph } = this
    this.put(
      'fontFamily',
      new Menu((menu, parent) => {
        const createAddItem = (menu) => {
          const fontSizeItem = new FontItem(graph, menu)
          return (item) => {
            fontSizeItem.addItem(item)
          }
        }
        const addItem = createAddItem(menu)

        for (var i = 0; i < this.defaultFonts.length; i++) {
          addItem(this.defaultFonts[i])
        }

        menu.addSeparator(parent)

        if (this.customFonts.length > 0) {
          for (var i = 0; i < this.customFonts.length; i++) {
            addItem(this.customFonts[i])
          }

          menu.addSeparator(parent)

          menu.addItem(
            mxResources.get('reset'),
            null,
            () => {
              this.customFonts = []
              this.editorUi.fireEvent(new mxEventObject('customFontsChanged'))
            },
            parent
          )

          menu.addSeparator(parent)
        }

        this.promptChange(
          menu,
          mxResources.get('custom') + '...',
          '',
          mxConstants.DEFAULT_FONTFAMILY,
          mxConstants.STYLE_FONTFAMILY,
          parent,
          true,
          (newValue) => {
            if (mxUtils.indexOf(this.customFonts, newValue) < 0) {
              this.customFonts.push(newValue)
              this.editorUi.fireEvent(new mxEventObject('customFontsChanged'))
            }
          }
        )
      })
    )
  }
}
