import { MenuAdder } from '../MenuAdder'
import { Menu } from 'ui/menus/Menu'

export class ArrangeMenu extends MenuAdder {
  add() {
    const menu: any = this.put(
      'arrange',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent)
        this.addSubmenu('direction', menu, parent)
        this.addMenuItems(menu, ['turn', '-'], parent)
        this.addSubmenu('align', menu, parent)
        this.addSubmenu('distribute', menu, parent)
        menu.addSeparator(parent)
        this.addSubmenu('navigation', menu, parent)
        this.addSubmenu('insert', menu, parent)
        this.addSubmenu('layout', menu, parent)
        this.addMenuItems(
          menu,
          ['-', 'group', 'ungroup', 'removeFromGroup', '-', 'clearWaypoints', 'autosize'],
          parent
        )
      })
    )
    menu.isEnabled = this.isGraphEnabled
  }
}
