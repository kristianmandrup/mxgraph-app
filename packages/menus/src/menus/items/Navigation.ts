import { MenuAdder } from '../MenuAdder'
import { Menu } from 'ui/menus/Menu'

export class NavigationMenu extends MenuAdder {
  add() {
    this.put(
      'navigation',
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          ['home', '-', 'exitGroup', 'enterGroup', '-', 'expand', 'collapse', '-', 'collapsible'],
          parent
        )
      })
    )
  }
}
