import mx from "mx";
const { mxClient } = mx;

export class Refresher {
  editor: any;
  container: any;
  documentMode: any;
  hsplitPosition: any;
  splitSize: any;
  menubar: any;
  menubarContainer: any;
  menubarHeight: any;
  toolbar: any;
  toolbarContainer: any;
  toolbarHeight: any;
  sidebarFooterContainer: any;
  sidebarContainer: any;
  footerHeight: any;
  sidebarFooterHeight: any;
  formatContainer;
  format: any;
  formatWidth: any;
  diagramContainer: any;
  footerContainer: any;
  tabContainer: any;
  hsplit: any;

  getDiagramContainerOffset: any; // fn
  /**
   * Refreshes the viewport.
   */
  refresh(sizeDidChange) {
    const { documentMode } = this;
    sizeDidChange = (sizeDidChange != null) ? sizeDidChange : true;

    var quirks = mxClient.IS_IE &&
      (documentMode == null || documentMode == 5);
    var w = this.container.clientWidth;
    var h = this.container.clientHeight;

    if (this.container == document.body) {
      w = document.body.clientWidth || document.documentElement.clientWidth;
      h = (quirks)
        ? document.body.clientHeight || document.documentElement.clientHeight
        : document.documentElement.clientHeight;
    }

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    // FIXME: Fix if footer visible
    var off = 0;

    if (mxClient.IS_IOS && !window.navigator["standalone"]) {
      if (window.innerHeight != document.documentElement.clientHeight) {
        off = document.documentElement.clientHeight - window.innerHeight;
        window.scrollTo(0, 0);
      }
    }

    var effHsplitPosition = Math.max(
      0,
      Math.min(this.hsplitPosition, w - this.splitSize - 20),
    );
    var tmp = 0;

    if (this.menubar != null) {
      this.menubarContainer.style.height = this.menubarHeight + "px";
      tmp += this.menubarHeight;
    }

    if (this.toolbar != null) {
      this.toolbarContainer.style.top = this.menubarHeight + "px";
      this.toolbarContainer.style.height = this.toolbarHeight + "px";
      tmp += this.toolbarHeight;
    }

    if (tmp > 0 && !mxClient.IS_QUIRKS) {
      tmp += 1;
    }

    var sidebarFooterHeight = 0;

    if (this.sidebarFooterContainer != null) {
      var bottom = this.footerHeight + off;
      sidebarFooterHeight = Math.max(
        0,
        Math.min(h - tmp - bottom, this.sidebarFooterHeight),
      );
      this.sidebarFooterContainer.style.width = effHsplitPosition + "px";
      this.sidebarFooterContainer.style.height = sidebarFooterHeight + "px";
      this.sidebarFooterContainer.style.bottom = bottom + "px";
    }

    var fw = (this.format != null) ? this.formatWidth : 0;
    this.sidebarContainer.style.top = tmp + "px";
    this.sidebarContainer.style.width = effHsplitPosition + "px";
    this.formatContainer.style.top = tmp + "px";
    this.formatContainer.style.width = fw + "px";
    this.formatContainer.style.display = (this.format != null) ? "" : "none";

    var diagContOffset = this.getDiagramContainerOffset();
    var contLeft = (this.hsplit.parentNode != null)
      ? (effHsplitPosition + this.splitSize)
      : 0;
    this.diagramContainer.style.left = (contLeft + diagContOffset.x) + "px";
    this.diagramContainer.style.top = (tmp + diagContOffset.y) + "px";
    this.footerContainer.style.height = this.footerHeight + "px";
    this.hsplit.style.top = this.sidebarContainer.style.top;
    this.hsplit.style.bottom = (this.footerHeight + off) + "px";
    this.hsplit.style.left = effHsplitPosition + "px";
    this.footerContainer.style.display = (this.footerHeight == 0) ? "none" : "";

    if (this.tabContainer != null) {
      this.tabContainer.style.left = contLeft + "px";
    }

    if (quirks) {
      this.menubarContainer.style.width = w + "px";
      this.toolbarContainer.style.width = this.menubarContainer.style.width;
      var sidebarHeight = Math.max(
        0,
        h - this.footerHeight - this.menubarHeight - this.toolbarHeight,
      );
      this.sidebarContainer.style.height =
        (sidebarHeight - sidebarFooterHeight) + "px";
      this.formatContainer.style.height = sidebarHeight + "px";
      this.diagramContainer.style.width = (this.hsplit.parentNode != null)
        ? Math.max(0, w - effHsplitPosition - this.splitSize - fw) + "px"
        : w + "px";
      this.footerContainer.style.width = this.menubarContainer.style.width;
      var diagramHeight = Math.max(
        0,
        h - this.footerHeight - this.menubarHeight - this.toolbarHeight,
      );

      if (this.tabContainer != null) {
        this.tabContainer.style.width = this.diagramContainer.style.width;
        this.tabContainer.style.bottom = (this.footerHeight + off) + "px";
        diagramHeight -= this.tabContainer.clientHeight;
      }

      this.diagramContainer.style.height = diagramHeight + "px";
      this.hsplit.style.height = diagramHeight + "px";
    } else {
      if (this.footerHeight > 0) {
        this.footerContainer.style.bottom = off + "px";
      }

      this.diagramContainer.style.right = fw + "px";
      var th = 0;

      if (this.tabContainer != null) {
        this.tabContainer.style.bottom = (this.footerHeight + off) + "px";
        this.tabContainer.style.right = this.diagramContainer.style.right;
        th = this.tabContainer.clientHeight;
      }

      this.sidebarContainer.style.bottom =
        (this.footerHeight + sidebarFooterHeight + off) + "px";
      this.formatContainer.style.bottom = (this.footerHeight + off) + "px";
      this.diagramContainer.style.bottom = (this.footerHeight + off + th) +
        "px";
    }

    if (sizeDidChange) {
      this.editor.graph.sizeDidChange();
    }
  }
}
