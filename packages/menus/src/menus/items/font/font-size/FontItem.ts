import mx from "@mxgraph-app/mx";
import { AbstractFontItem } from "../AbstractFontItem";
const { mxConstants } = mx;

export class FontItem extends AbstractFontItem {
  menu: any;
  graph: any;

  constructor(menuStyler, graph: any, menu: any) {
    super(menuStyler, graph, menu);
  }

  addItem(fontsize) {
    const { menu, graph } = this;
    this.styleChange(
      menu,
      fontsize,
      [mxConstants.STYLE_FONTSIZE],
      [fontsize],
      null,
      parent,
      () => {
        if (graph.cellEditor.textarea != null) {
          // Creates an element with arbitrary size 3
          document.execCommand("fontSize", false, "3");

          // Changes the css font size of the first font element inside the in-place editor with size 3
          // hopefully the above element that we've just created. LATER: Check for new element using
          // previous result of getElementsByTagName (see other actions)
          var elts = graph.cellEditor.textarea.getElementsByTagName("font");

          for (var i = 0; i < elts.length; i++) {
            if (elts[i].getAttribute("size") == "3") {
              elts[i].removeAttribute("size");
              elts[i].style.fontSize = fontsize + "px";

              break;
            }
          }
        }
      }
    );
  }
}
