import mx from "@mxgraph-app/mx";
const { mxGraphModel, mxText, mxGraph, mxConstants } = mx;

export class PageSetup {
  // Letter page format is default in US, Canada and Mexico
  configure = () => {
    try {
      if (navigator != null && navigator.language != null) {
        var lang = navigator.language.toLowerCase();
        mxGraph.prototype.pageFormat =
          lang === "en-us" || lang === "en-ca" || lang === "es-mx"
            ? mxConstants.PAGE_FORMAT_LETTER_PORTRAIT
            : mxConstants.PAGE_FORMAT_A4_PORTRAIT;
      }
    } catch (e) {
      // ignore
    }

    // Matches label positions of mxGraph 1.x
    mxText.prototype.baseSpacingTop = 5;
    mxText.prototype.baseSpacingBottom = 1;

    // Keeps edges between relative child cells inside parent
    mxGraphModel.prototype.ignoreRelativeEdgeParent = false;
  };
}
