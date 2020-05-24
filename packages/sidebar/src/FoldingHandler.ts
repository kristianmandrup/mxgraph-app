import mx from "@mxgraph-app/mx";
const { mxClient, mxEvent, mxResources } = mx;

export class FoldingHandler {
  editorUi: any;
  graph: any;
  container: any;
  palettes = new Object();
  taglist = new Object();
  showTooltips = true;
  pointerUpHandler: any;
  pointerDownHandler: any;
  thread: any;
  currentElt: any;
  tooltip: any;
  tooltipTitle: any;
  graph2: any;
  roundDrop: any;
  triangleDown: any;
  currentSearch: any;
  entries: any;

  collapsedImage: any;
  expandedImage: any;
  documentMode: any;
  originalNoForeignObject: any; // Editor.prototype.originalNoForeignObject

  /**
   * Create the given title element.
   */
  add(title, content, funct) {
    var initialized = false;

    // Avoids mixed content warning in IE6-8
    if (!mxClient.IS_IE || this.documentMode >= 8) {
      title.style.backgroundImage =
        content.style.display == "none"
          ? "url('" + this.collapsedImage + "')"
          : "url('" + this.expandedImage + "')";
    }

    title.style.backgroundRepeat = "no-repeat";
    title.style.backgroundPosition = "0% 50%";

    mxEvent.addListener(title, "click", (evt) => {
      if (content.style.display == "none") {
        if (!initialized) {
          initialized = true;

          if (funct != null) {
            // Wait cursor does not show up on Mac
            title.style.cursor = "wait";
            var prev = title.innerHTML;
            title.innerHTML = mxResources.get("loading") + "...";

            window.setTimeout(
              () => {
                content.style.display = "block";
                title.style.cursor = "";
                title.innerHTML = prev;

                var fo = mxClient.NO_FO;
                mxClient.NO_FO = this.originalNoForeignObject;
                funct(content, title);
                mxClient.NO_FO = fo;
              },
              mxClient.IS_FF ? 20 : 0
            );
          } else {
            content.style.display = "block";
          }
        } else {
          content.style.display = "block";
        }

        title.style.backgroundImage = "url('" + this.expandedImage + "')";
      } else {
        title.style.backgroundImage = "url('" + this.collapsedImage + "')";
        content.style.display = "none";
      }

      mxEvent.consume(evt);
    });

    // Prevents focus
    if (!mxClient.IS_QUIRKS) {
      mxEvent.addListener(
        title,
        mxClient.IS_POINTER ? "pointerdown" : "mousedown",
        (evt) => {
          evt.preventDefault();
        }
      );
    }
  }
}
