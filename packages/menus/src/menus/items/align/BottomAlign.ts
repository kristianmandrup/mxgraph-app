import { AlignItem } from './AlignItem'
import mx from 'mx'
const { mxConstants } = mx

export class BottomAlign extends AlignItem {
  align = {
    name: 'bottomAlign',
    direction: mxConstants.ALIGN_BOTTOM,
  }
}
