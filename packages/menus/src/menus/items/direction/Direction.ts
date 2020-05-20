import { MenuAdder } from '../../MenuAdder'
import { Menu } from 'ui/menus/Menu'
import { FlipH } from './FlipH'
import { FlipV } from './FlipV'

export class DirectionMenu extends MenuAdder {
  menuName = 'direction'

  menuItems: any = {
    flipH: FlipH,
    flipV: FlipV,
  }
  itemLayout = ['flipH', 'flipV']

  extraItems(menu, parent) {
    this.addMenuItems(menu, ['-', 'rotation'], parent)
  }
}
