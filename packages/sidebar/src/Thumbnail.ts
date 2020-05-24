import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
const { mxClient, mxUtils, mxConstants } = mx;
const {} = resources;

export class Thumbnail {
  editorUi: any;
  graph: any;
  documentMode: any;
  thumbBorder: any;
  thumbHeight: any;
  thumbPadding: any;
  sidebarTitles: any;
  sidebarTitleSize: any;
  originalNoForeignObject: any; // Editor.prototype.originalNoForeignObject
  /**
   * Creates a thumbnail for the given cells.
   */
  createThumb(
    cells,
    width,
    height,
    parent,
    title,
    showLabel,
    showTitle,
    _realWidth?,
    _realHeight?
  ) {
    this.graph.labelsVisible = showLabel == null || showLabel;
    var fo = mxClient.NO_FO;
    mxClient.NO_FO = this.originalNoForeignObject;
    this.graph.view.scaleAndTranslate(1, 0, 0);
    this.graph.addCells(cells);
    var bounds = this.graph.getGraphBounds();
    var s =
      Math.floor(
        Math.min(
          (width - 2 * this.thumbBorder) / bounds.width,
          (height - 2 * this.thumbBorder) / bounds.height
        ) * 100
      ) / 100;
    this.graph.view.scaleAndTranslate(
      s,
      Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
      Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
    );
    var node: any;

    // For supporting HTML labels in IE9 standards mode the container is cloned instead
    if (
      this.graph.dialect == mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      this.graph.view.getCanvas().ownerSVGElement != null
    ) {
      node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
    } // LATER: Check if deep clone can be used for quirks if container in DOM
    else {
      node = this.graph.container.cloneNode(false);
      node.innerHTML = this.graph.container.innerHTML;

      // Workaround for clipping in older IE versions
      if (mxClient.IS_QUIRKS || this.documentMode == 8) {
        node.firstChild.style.overflow = "visible";
      }
    }

    this.graph.getModel().clear();
    mxClient.NO_FO = fo;

    // Catch-all event handling
    if (mxClient.IS_IE6) {
      parent.style.backgroundImage =
        "url(" + this.editorUi.editor.transparentImage + ")";
    }

    node.style.position = "relative";
    node.style.overflow = "hidden";
    node.style.left = this.thumbBorder + "px";
    node.style.top = this.thumbBorder + "px";
    node.style.width = width + "px";
    node.style.height = height + "px";
    node.style.visibility = "";
    node.style.minWidth = "";
    node.style.minHeight = "";

    parent.appendChild(node);

    // Adds title for sidebar entries
    if (this.sidebarTitles && title != null && showTitle != false) {
      var border = mxClient.IS_QUIRKS ? 2 * this.thumbPadding + 2 : 0;
      parent.style.height =
        this.thumbHeight + border + this.sidebarTitleSize + 8 + "px";

      var div = document.createElement("div");
      div.style.fontSize = this.sidebarTitleSize + "px";
      div.style.color = "#303030";
      div.style.textAlign = "center";
      div.style.whiteSpace = "nowrap";

      if (mxClient.IS_IE) {
        div.style.height = this.sidebarTitleSize + 12 + "px";
      }

      div.style.paddingTop = "4px";
      mxUtils.write(div, title);
      parent.appendChild(div);
    }

    return bounds;
  }
}
