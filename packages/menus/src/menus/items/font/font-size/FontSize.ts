import { MenuAdder } from '../../../MenuAdder'
import { Menu } from 'ui/menus/Menu'
import { FontItem } from './FontItem'
import mx from 'mx'
const { mxConstants, mxResources } = mx

export class FontSizeMenu extends MenuAdder {
  add() {
    const { graph } = this
    this.put(
      'fontSize',
      new Menu((menu, parent) => {
        const createAddItem = (menu) => {
          const fontSizeItem = new FontItem(graph, menu)
          return (item) => {
            fontSizeItem.addItem(item)
          }
        }
        const addItem = createAddItem(menu)

        var sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72]

        for (var i = 0; i < sizes.length; i++) {
          addItem(sizes[i])
        }

        menu.addSeparator(parent)

        if (this.customFontSizes.length > 0) {
          for (var i = 0; i < this.customFontSizes.length; i++) {
            addItem(this.customFontSizes[i])
          }

          menu.addSeparator(parent)

          menu.addItem(
            mxResources.get('reset'),
            null,
            () => {
              this.customFontSizes = []
            },
            parent
          )

          menu.addSeparator(parent)
        }

        this.promptChange(
          menu,
          mxResources.get('custom') + '...',
          '(pt)',
          '12',
          mxConstants.STYLE_FONTSIZE,
          parent,
          true,
          (newValue) => {
            this.customFontSizes.push(newValue)
          }
        )
      })
    )
  }
}
