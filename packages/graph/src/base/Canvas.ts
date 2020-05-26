import mx from "@mxgraph-app/mx";
const { mxSvgCanvas2D } = mx;

export class Canvas2D {
  static configure() {
    // Alternative text for unsupported foreignObjects
    mxSvgCanvas2D.prototype.foAltText = "[Not supported by viewer]";
  }
}
