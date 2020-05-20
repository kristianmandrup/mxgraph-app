import { AlignItem } from './AlignItem'
import mx from 'mx'
const { mxConstants } = mx

export class RightAlign extends AlignItem {
  align = {
    name: 'rightAlign',
    direction: mxConstants.ALIGN_RIGHT,
  }
}
