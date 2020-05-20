import { MenuItemAdder } from '../../MenuItemAdder'
import mx from 'mx'
const { mxResources } = mx

type Align = {
  name: string
  direction: string
}

export class AlignItem extends MenuItemAdder {
  align: Align = {
    name: '',
    direction: '',
  }

  add() {
    const { graph, align } = this
    this.addItem(
      mxResources.get(align.name),
      null,
      function () {
        graph.alignCells(align.direction)
      },
      parent
    )
  }
}
