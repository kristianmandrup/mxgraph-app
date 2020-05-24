import mx from "@mxgraph-app/mx";
const { mxConstants, mxResources, mxClient, mxUtils } = mx;

export class DragArrow {
  triangleUp: any;
  triangleDown: any;
  triangleLeft: any;
  triangleRight: any;
  roundDrop: any;

  refreshTarget: any;

  get arrowUp() {
    return this.createArrow(this.triangleUp, mxResources.get("connect"));
  }

  get arrowRight() {
    return this.createArrow(this.triangleRight, mxResources.get("connect"));
  }
  get arrowDown() {
    return this.createArrow(this.triangleDown, mxResources.get("connect"));
  }

  get arrowLeft() {
    return this.createArrow(this.triangleLeft, mxResources.get("connect"));
  }

  get styleTarget() {
    return this.createArrow(this.refreshTarget, mxResources.get("replace"));
  }
  // Workaround for actual parentNode not being updated in old IE
  styleTargetParent = null;

  get roundSource() {
    return this.createArrow(this.roundDrop);
  }

  get roundTarget() {
    return this.createArrow(this.roundDrop);
  }

  direction = mxConstants.DIRECTION_NORTH;
  activeArrow = null;

  checkArrow = (x, y, bounds, arrow) => {
    const { styleTarget } = this;
    if (arrow.parentNode != null) {
      if (mxUtils.contains(bounds, x, y)) {
        mxUtils.setOpacity(arrow, 100);
        this.activeArrow = arrow;
      } else {
        mxUtils.setOpacity(arrow, arrow == styleTarget ? 30 : 20);
      }
    }

    return bounds;
  }; // Hides guides and preview if target is active

  createArrow = (img, tooltip?) => {
    const { refreshTarget } = this;
    var arrow: any;

    if (mxClient.IS_IE && !mxClient.IS_SVG) {
      // Workaround for PNG images in IE6
      if (mxClient.IS_IE6 && document.compatMode != "CSS1Compat") {
        arrow = document.createElement(mxClient.VML_PREFIX + ":image");
        arrow.setAttribute("src", img.src);
        arrow.style.borderStyle = "none";
      } else {
        arrow = document.createElement("div");
        arrow.style.backgroundImage = "url(" + img.src + ")";
        arrow.style.backgroundPosition = "center";
        arrow.style.backgroundRepeat = "no-repeat";
      }

      arrow.style.width = img.width + 4 + "px";
      arrow.style.height = img.height + 4 + "px";
      arrow.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    } else {
      arrow = mxUtils.createImage(img.src);
      arrow.style.width = img.width + "px";
      arrow.style.height = img.height + "px";
    }

    if (tooltip != null) {
      arrow.setAttribute("title", tooltip);
    }

    mxUtils.setOpacity(arrow, img == refreshTarget ? 30 : 20);
    arrow.style.position = "absolute";
    arrow.style.cursor = "crosshair";

    return arrow;
  };
}
