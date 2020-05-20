import { MenuItemAdder } from '../../MenuItemAdder'
import mx from 'mx'
const { mxConstants } = mx

export class Middle extends MenuItemAdder {
  align = {
    name: 'middle',
    direction: mxConstants.ALIGN_MIDDLE,
  }
}
