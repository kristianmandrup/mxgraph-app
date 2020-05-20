import mx from 'mx'
import { MenuAdder } from '../../../MenuAdder'
const { mxEventObject, mxConstants } = mx

export class FontItem {
  menu: any
  graph: any

  // from Menus
  styleChange(menu, label, keys, values, sprite, parent, fn?, post?) {}

  constructor(graph: any, menu: any) {
    this.graph = graph
    this.menu = menu
  }

  addItem(fontname) {
    const { graph, menu } = this
    var tr: any = this.styleChange(
      menu,
      fontname,
      [mxConstants.STYLE_FONTFAMILY],
      [fontname],
      null,
      parent,
      () => {
        document.execCommand('fontname', false, fontname)
      },
      () => {
        graph.updateLabelElements(graph.getSelectionCells(), function (elt) {
          elt.removeAttribute('face')
          elt.style.fontFamily = null

          if (elt.nodeName == 'PRE') {
            graph.replaceElement(elt, 'div')
          }
        })
      }
    )
    tr.firstChild.nextSibling.style.fontFamily = fontname
  }
}
