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

  addItem(fontsize) {
    const { menu, graph } = this
    this.styleChange(menu, fontsize, [mxConstants.STYLE_FONTSIZE], [fontsize], null, parent, () => {
      if (graph.cellEditor.textarea != null) {
        // Creates an element with arbitrary size 3
        document.execCommand('fontSize', false, '3')

        // Changes the css font size of the first font element inside the in-place editor with size 3
        // hopefully the above element that we've just created. LATER: Check for new element using
        // previous result of getElementsByTagName (see other actions)
        var elts = graph.cellEditor.textarea.getElementsByTagName('font')

        for (var i = 0; i < elts.length; i++) {
          if (elts[i].getAttribute('size') == '3') {
            elts[i].removeAttribute('size')
            elts[i].style.fontSize = fontsize + 'px'

            break
          }
        }
      }
    })
  }
}
