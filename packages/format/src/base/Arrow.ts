import mx from "@mxgraph-app/mx";
const { mxClient, mxUtils } = mx;
import resources from "@mxgraph-app/resources";
const { IMAGE_PATH } = resources;

export class Arrow {
  buttonBackgroundColor: any;

  /**
   *
   */
  add(elt, height?) {
    height = height != null ? height : 10;

    var arrow = document.createElement("div");
    arrow.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    arrow.style.padding = "6px";
    arrow.style.paddingRight = "4px";

    var m = 10 - height;

    if (m == 2) {
      arrow.style.paddingTop = 6 + "px";
    } else if (m > 0) {
      arrow.style.paddingTop = 6 - m + "px";
    } else {
      arrow.style.marginTop = "-2px";
    }

    arrow.style.height = height + "px";
    arrow.style.borderLeft = "1px solid #a0a0a0";
    arrow.innerHTML = '<img border="0" src="' +
      (mxClient.IS_SVG
        ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII="
        : IMAGE_PATH + "/dropdown.png") +
      '" style="margin-bottom:4px;">';
    mxUtils.setOpacity(arrow, 70);

    var symbol = elt.getElementsByTagName("div")[0];

    if (symbol != null) {
      symbol.style.paddingRight = "6px";
      symbol.style.marginLeft = "4px";
      symbol.style.marginTop = "-1px";
      symbol.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
      mxUtils.setOpacity(symbol, 60);
    }

    mxUtils.setOpacity(elt, 100);
    elt.style.border = "1px solid #a0a0a0";
    elt.style.backgroundColor = this.buttonBackgroundColor;
    elt.style.backgroundImage = "none";
    elt.style.width = "auto";
    elt.className += " geColorBtn";
    mxUtils.setPrefixedStyle(elt.style, "borderRadius", "3px");

    elt.appendChild(arrow);

    return symbol;
  }
}
