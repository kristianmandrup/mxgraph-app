import mx from "@mxgraph-app/mx";
import { AbstractManager } from "./AbstractManager";
const {
  mxCellRenderer,
  mxUtils,
} = mx;

export class EdgeListener extends AbstractManager {
  handler = (_sender?, _evt?, force?) => {
    const { div, rect, graph, width, xs, ys, divs, divt, xt, yt } = this;
    var cell = graph.getSelectionCell();

    if (rect.style.shape == "link" || rect.style.shape == "flexArrow") {
      div.style.display = "";

      if (force || document.activeElement != width) {
        var value = mxUtils.getValue(
          rect.style,
          "width",
          mxCellRenderer.defaultShapes["flexArrow"].prototype.defaultWidth,
        );
        width.value = value + " pt";
      }
    } else {
      div.style.display = "none";
    }

    if (graph.getSelectionCount() == 1 && graph.model.isEdge(cell)) {
      var geo = graph.model.getGeometry(cell);

      if (
        geo.sourcePoint != null &&
        graph.model.getTerminal(cell, true) == null
      ) {
        xs.value = geo.sourcePoint.x;
        ys.value = geo.sourcePoint.y;
      } else {
        divs.style.display = "none";
      }

      if (
        geo.targetPoint != null &&
        graph.model.getTerminal(cell, false) == null
      ) {
        xt.value = geo.targetPoint.x;
        yt.value = geo.targetPoint.y;
      } else {
        divt.style.display = "none";
      }
    } else {
      divs.style.display = "none";
      divt.style.display = "none";
    }
  };
}
