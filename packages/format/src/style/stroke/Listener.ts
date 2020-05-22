import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
import mx from "@mxgraph-app/mx";
const { mxConstants, mxUtils } = mx;

export class Listener extends AbstractStrokeFormat {
  handler = (_sender?, _evt?, force?) => {
    const {
      ss,
      input,
      altInput,
      altSolid,
      solid,
      graph,
      altStylePanel,
      stylePanel,
      edgeStyle,
      lineStart,
      lineEnd,
    } = this;
    // var color = mxUtils.getValue(ss.style, strokeKey, null);

    if (force || document.activeElement != input) {
      var tmp = parseInt(
        mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1),
      );
      input.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != altInput) {
      var tmp = parseInt(
        mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1),
      );
      altInput.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    this.setStyleSelect();

    this.setSolidStyle();

    altSolid.style.borderBottom = solid.style.borderBottom;

    // Updates toolbar icon for edge style
    this.createEdgeStyleDiv();

    if (ss.edges.length == graph.getSelectionCount()) {
      altStylePanel.style.display = "";
      stylePanel.style.display = "none";
    } else {
      altStylePanel.style.display = "none";
      stylePanel.style.display = "";
    }

    this.setSpecialMarkerCases();

    this.onActiveElement(force);

    mxUtils.setOpacity(edgeStyle, ss.style.shape == "arrow" ? 30 : 100);

    if (
      ss.style.shape != "connector" &&
      ss.style.shape != "flexArrow" &&
      ss.style.shape != "filledEdge"
    ) {
      mxUtils.setOpacity(lineStart, 30);
      mxUtils.setOpacity(lineEnd, 30);
    } else {
      mxUtils.setOpacity(lineStart, 100);
      mxUtils.setOpacity(lineEnd, 100);
    }
  };

  onActiveElement(force) {
    const {
      ss,
      startSize,
      startSpacing,
      endSpacing,
      endSize,
      perimeterSpacing,
    } = this;

    if (force || document.activeElement != startSize) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_STARTSIZE,
          mxConstants.DEFAULT_MARKERSIZE,
        ),
      );
      startSize.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != startSpacing) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_SOURCE_PERIMETER_SPACING,
          0,
        ),
      );
      startSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != endSize) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_ENDSIZE,
          mxConstants.DEFAULT_MARKERSIZE,
        ),
      );
      endSize.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != startSpacing) {
      var tmp = parseInt(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_TARGET_PERIMETER_SPACING,
          0,
        ),
      );
      endSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != perimeterSpacing) {
      var tmp = parseInt(
        mxUtils.getValue(ss.style, mxConstants.STYLE_PERIMETER_SPACING, 0),
      );
      perimeterSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }
  }
}
