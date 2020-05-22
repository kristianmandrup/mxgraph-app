import mx from "@mxgraph-app/mx";
const { mxUtils } = mx;

export class Buttons {
  /**
   *
   */
  style(elts) {
    for (var i = 0; i < elts.length; i++) {
      mxUtils.setPrefixedStyle(elts[i].style, "borderRadius", "3px");
      mxUtils.setOpacity(elts[i], 100);
      elts[i].style.border = "1px solid #a0a0a0";
      elts[i].style.padding = "4px";
      elts[i].style.paddingTop = "3px";
      elts[i].style.paddingRight = "1px";
      elts[i].style.margin = "1px";
      elts[i].style.width = "24px";
      elts[i].style.height = "20px";
      elts[i].className += " geColorBtn";
    }
  }
}
