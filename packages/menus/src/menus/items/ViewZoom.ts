import { MenuAdder } from '../MenuAdder'
import { Menu } from 'ui/menus/Menu'

export class ViewZoomMenu extends MenuAdder {
  add() {
    const { graph } = this
    this.put(
      'viewZoom',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['resetView', '-'], parent)
        var scales = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]

        for (var i = 0; i < scales.length; i++) {
          ;(function (scale) {
            menu.addItem(
              scale * 100 + '%',
              null,
              function () {
                graph.zoomTo(scale)
              },
              parent
            )
          })(scales[i])
        }

        this.addMenuItems(
          menu,
          ['-', 'fitWindow', 'fitPageWidth', 'fitPage', 'fitTwoPages', '-', 'customZoom'],
          parent
        )
      })
    )
  }
}
