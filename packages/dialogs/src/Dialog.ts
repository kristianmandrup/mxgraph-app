import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";

type DialogOpts = {
  w?;
  h?;
  modal?;
  closable?;
  onClose?;
  noScroll?;
  transparent?;
  onResize?;
  ignoreBgClick?;
};

const {
  mxEventObject,
  mxEvent,
  mxResources,
  mxDivResizer,
  mxUtils,
  mxClient,
  mxPopupMenu,
} = mx;
const { IMAGE_PATH } = resources;

/**
 * Basic dialogs that are available in the viewer (print dialog).
 */
export class Dialog {
  /**
   *
   */
  static backdropColor = "white";

  documentMode: any;
  bg: any;
  dialogImg: any;
  onDialogClose: any;
  container: any;
  onResize: any;
  noScroll: any;
  elt: any;
  editorUi: any;

  w0: any;
  w: any;
  h0: any;

  dh: any;
  dx: any;
  left: any;
  top: any;
  h: any;
  div: any;

  getPosition(_left, _top, _w, _h): any {
    return {};
  }

  /**
   *
   */
  zIndex: any = mxPopupMenu.prototype.zIndex - 1;

  /**
   *
   */
  noColorImage = !mxClient.IS_SVG
    ? IMAGE_PATH + "/nocolor.png"
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRDlBMUUwODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRDlBMUUxODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNEOUExREU4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTNEOUExREY4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xh3fmAAAABlBMVEX////MzMw46qqDAAAAGElEQVR42mJggAJGKGAYIIGBth8KAAIMAEUQAIElnLuQAAAAAElFTkSuQmCC";

  /**
   *
   */
  closeImage = !mxClient.IS_SVG
    ? IMAGE_PATH + "/close.png"
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJAQMAAADaX5RTAAAABlBMVEV7mr3///+wksspAAAAAnRSTlP/AOW3MEoAAAAdSURBVAgdY9jXwCDDwNDRwHCwgeExmASygSL7GgB12QiqNHZZIwAAAABJRU5ErkJggg==";

  /**
   *
   */
  clearImage = !mxClient.IS_SVG
    ? IMAGE_PATH + "/clear.gif"
    : "data:image/gif;base64,R0lGODlhDQAKAIABAMDAwP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIzOEM1NzI4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzOEM1NzM4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjM4QzU3MDg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjM4QzU3MTg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAEALAAAAAANAAoAAAIXTGCJebD9jEOTqRlttXdrB32PJ2ncyRQAOw==";

  /**
   *
   */
  lockedImage = !mxClient.IS_SVG
    ? IMAGE_PATH + "/locked.png"
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCODExNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCODIxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3RjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI4MDE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvqMCFYAAAAVUExURZmZmb+/v7KysqysrMzMzLGxsf///4g8N1cAAAAHdFJOU////////wAaSwNGAAAAPElEQVR42lTMQQ4AIQgEwUa0//9kTQirOweYOgDqAMbZUr10AGlAwx4/BJ2QJ4U0L5brYjovvpv32xZgAHZaATFtMbu4AAAAAElFTkSuQmCC";

  /**
   *
   */
  unlockedImage = !mxClient.IS_SVG
    ? IMAGE_PATH + "/unlocked.png"
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCN0QxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCN0UxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3QjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI3QzE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkKMpVwAAAAYUExURZmZmbKysr+/v6ysrOXl5czMzLGxsf///zHN5lwAAAAIdFJOU/////////8A3oO9WQAAADxJREFUeNpUzFESACAEBNBVsfe/cZJU+8Mzs8CIABCidtfGOndnYsT40HDSiCcbPdoJo10o9aI677cpwACRoAF3dFNlswAAAABJRU5ErkJggg==";

  /**
   * Removes the dialog from the DOM.
   */
  bgOpacity = 80;

  constructor(editorUi, elt, opts: DialogOpts = {}) {
    let {
      w,
      h,
      modal,
      closable,
      onClose,
      noScroll,
      transparent,
      // onResize,
      ignoreBgClick,
    } = opts;
    var dx = 0;

    if (
      mxClient.IS_VML &&
      (this.documentMode == null || this.documentMode < 8)
    ) {
      // Adds padding as a workaround for box model in older IE versions
      // This needs to match the total padding of geDialog in CSS
      dx = 80;
    }

    w += dx;
    h += dx;

    // var w0 = w;
    // var h0 = h;

    var ds = mxUtils.getDocumentSize();

    // Workaround for print dialog offset in viewer lightbox
    if (window.innerHeight != null) {
      ds.height = window.innerHeight;
    }

    var dh = ds.height;
    var left = Math.max(1, Math.round((ds.width - w - 64) / 2));
    var top = Math.max(1, Math.round((dh - h - editorUi.footerHeight) / 3));

    // Keeps window size inside available space
    if (!mxClient.IS_QUIRKS) {
      elt.style.maxHeight = "100%";
    }

    w = document.body != null ? Math.min(w, document.body.scrollWidth - 64) : w;
    h = Math.min(h, dh - 64);

    // Increments zIndex to put subdialogs and background over existing dialogs and background
    if (editorUi.dialogs.length > 0) {
      this.zIndex += editorUi.dialogs.length * 2;
    }

    if (this.bg == null) {
      this.bg = editorUi.createDiv("background");
      this.bg.style.position = "absolute";
      this.bg.style.background = Dialog.backdropColor;
      this.bg.style.height = dh + "px";
      this.bg.style.right = "0px";
      this.bg.style.zIndex = this.zIndex - 2;

      mxUtils.setOpacity(this.bg, this.bgOpacity);

      if (mxClient.IS_QUIRKS) {
        new mxDivResizer(this.bg, null);
      }
    }

    var origin = mxUtils.getDocumentScrollOrigin(document);
    this.bg.style.left = origin.x + "px";
    this.bg.style.top = origin.y + "px";
    left += origin.x;
    top += origin.y;

    if (modal) {
      document.body.appendChild(this.bg);
    }

    var div = editorUi.createDiv(transparent ? "geTransDialog" : "geDialog");
    var pos = this.getPosition(left, top, w, h);
    left = pos.x;
    top = pos.y;

    div.style.width = w + "px";
    div.style.height = h + "px";
    div.style.left = left + "px";
    div.style.top = top + "px";
    div.style.zIndex = this.zIndex;

    div.appendChild(elt);
    document.body.appendChild(div);

    // Adds vertical scrollbars if needed
    if (!noScroll && elt.clientHeight > div.clientHeight - 64) {
      elt.style.overflowY = "auto";
    }

    if (closable) {
      var img = document.createElement("img");

      img.setAttribute("src", Dialog.prototype.closeImage);
      img.setAttribute("title", mxResources.get("close"));
      img.className = "geDialogClose";
      img.style.top = top + 14 + "px";
      img.style.left = left + w + 38 - dx + "px";
      img.style.zIndex = this.zIndex;

      mxEvent.addListener(img, "click", () => {
        editorUi.hideDialog(true);
      });

      document.body.appendChild(img);
      this.dialogImg = img;

      if (!ignoreBgClick) {
        var mouseDownSeen = false;

        mxEvent.addGestureListeners(
          this.bg,
          (_evt) => {
            mouseDownSeen = true;
          },
          undefined,
          undefined
        ),
          null,
          (_evt) => {
            if (mouseDownSeen) {
              editorUi.hideDialog(true);
              mouseDownSeen = false;
            }
          };
      }
    }

    mxEvent.addListener(window, "resize", this.resizeListener);

    this.onDialogClose = onClose;
    this.container = div;

    editorUi.editor.fireEvent(new mxEventObject("showDialog"));
  }

  resizeListener() {
    let {
      editorUi,
      onResize,
      w0,
      h0,
      dh,
      dx,
      left,
      top,
      w,
      h,
      div,
      noScroll,
      elt,
    } = this;
    if (onResize) {
      var newWH = onResize();

      if (newWH) {
        w0 = w = newWH.w;
        h0 = h = newWH.h;
      }
    }

    var ds = mxUtils.getDocumentSize();
    dh = ds.height;
    this.bg.style.height = dh + "px";

    left = Math.max(1, Math.round((ds.width - w - 64) / 2));
    top = Math.max(1, Math.round((dh - h - editorUi.footerHeight) / 3));
    w =
      document.body != null ? Math.min(w0, document.body.scrollWidth - 64) : w0;
    h = Math.min(h0, dh - 64);

    var pos = this.getPosition(left, top, w, h);
    left = pos.x;
    top = pos.y;

    div.style.left = left + "px";
    div.style.top = top + "px";
    div.style.width = w + "px";
    div.style.height = h + "px";

    // Adds vertical scrollbars if needed
    if (!noScroll && elt.clientHeight > div.clientHeight - 64) {
      elt.style.overflowY = "auto";
    }

    if (this.dialogImg) {
      this.dialogImg.style.top = top + 14 + "px";
      this.dialogImg.style.left = left + w + 38 - dx + "px";
    }
  }
}
