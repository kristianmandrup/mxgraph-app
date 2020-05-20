import { MenuItemAdder } from '../../MenuItemAdder'
import mx from 'mx'
const { mxConstants } = mx

export class Center extends MenuItemAdder {
  align = {
    name: 'center',
    direction: mxConstants.ALIGN_CENTER,
  }
}
