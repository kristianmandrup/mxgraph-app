import mx from "@mxgraph-app/mx";
const { mxGraph, mxConstants } = mx;

export class Constants {
  setGraph() {
    mxGraph.prototype.pageBreakColor = "#c0c0c0";
    mxGraph.prototype.pageScale = 1;
  }

  setConstants() {
    // Changes default colors
    /**
     * Measurements Units
     */
    mxConstants["POINTS"] = 1;
    mxConstants["MILLIMETERS"] = 2;
    mxConstants["INCHES"] = 3;
    /**
     * This ratio is with page scale 1
     */
    mxConstants["PIXELS_PER_MM"] = 3.937;
    mxConstants["PIXELS_PER_INCH"] = 100;

    mxConstants.SHADOW_OPACITY = 0.25;
    mxConstants.SHADOWCOLOR = "#000000";
    mxConstants.VML_SHADOWCOLOR = "#d0d0d0";
  }
}
