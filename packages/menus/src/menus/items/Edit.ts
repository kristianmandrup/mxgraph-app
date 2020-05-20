import { MenuAdder } from '../MenuAdder'
import { Menu } from 'ui/menus/Menu'

export class Edit extends MenuAdder {
  add() {
    this.put(
      'edit',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, [
          'undo',
          'redo',
          '-',
          'cut',
          'copy',
          'paste',
          'delete',
          '-',
          'duplicate',
          '-',
          'editData',
          'editTooltip',
          'editStyle',
          '-',
          'edit',
          '-',
          'editLink',
          'openLink',
          '-',
          'selectVertices',
          'selectEdges',
          'selectAll',
          'selectNone',
          '-',
          'lockUnlock',
        ])
      })
    )
  }
}
