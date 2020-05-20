import { MenuItemAdder } from '../../MenuItemAdder'
import mx from 'mx'
const { mxConstants } = mx

export class LeftAlign extends MenuItemAdder {
  align = {
    name: 'leftAlign',
    direction: mxConstants.ALIGN_LEFT,
  }
}
