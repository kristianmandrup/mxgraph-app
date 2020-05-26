import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
const { mxGraphView, mxClient } = mx;
const { IMAGE_PATH } = resources;

export class GridProperties {
  static configure() {
    // Defines grid properties
    const proto = mxGraphView.prototype;
    proto["gridImage"] = mxClient.IS_SVG
      ? "data:image/gif;base64,R0lGODlhCgAKAJEAAAAAAP///8zMzP///yH5BAEAAAMALAAAAAAKAAoAAAIJ1I6py+0Po2wFADs="
      : IMAGE_PATH + "/grid.gif";
    proto["gridSteps"] = 4;
    proto["minGridSize"] = 4;

    // UrlParams is null in embed mode
    proto["defaultGridColor"] = "#d0d0d0";
    proto["gridColor"] = proto["defaultGridColor"];
  }
}
