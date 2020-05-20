import { MenuAdder } from '../MenuAdder'
import { Menu } from 'ui/menus/Menu'
import mx from 'mx'
const { mxResources } = mx

export class DistributeMenu extends MenuAdder {
  add() {
    const { graph } = this
    this.put(
      'distribute',
      new Menu((menu, parent) => {
        menu.addItem(
          mxResources.get('horizontal'),
          null,
          function () {
            graph.distributeCells(true)
          },
          parent
        )
        menu.addItem(
          mxResources.get('vertical'),
          null,
          function () {
            graph.distributeCells(false)
          },
          parent
        )
      })
    )
  }
}
