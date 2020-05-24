import mx from "@mxgraph-app/mx";
import { DropBase } from "./DropBase";
const { mxPoint, mxUtils, mxRectangle, mxEvent } = mx;

export class DropTargetEnabler extends DropBase {
  currentStyleTarget: any;
  timeOnTarget: any;
  evt: any;
  x: any;
  y: any;
  styleTargetParent: any;
  styleTarget: any;
  dragArrow: any;
  dropArrow: any;
  refreshTarget: any;

  enable() {
    const {
      refreshTarget,
      evt,
      x,
      y,
      timeOnTarget,
      currentStyleTarget,
      styleTargetParent,
      styleTarget,
      dragArrow,
      graph,
      dropArrow,
    } = this;
    const { checkArrow } = dropArrow;

    // Does not reset on ignored edges
    if (
      currentStyleTarget == null ||
      !mxUtils.contains(currentStyleTarget, x, y) ||
      (timeOnTarget > 1500 && !mxEvent.isShiftDown(evt))
    ) {
      this.currentStyleTarget = null;

      if (styleTargetParent != null) {
        styleTarget.parentNode.removeChild(styleTarget);
        dragArrow.styleTargetParent = null;
      }
    } else if (currentStyleTarget != null && styleTargetParent != null) {
      // Sets active Arrow as side effect
      var tmp = graph.model.isEdge(currentStyleTarget.cell)
        ? graph.view.getPoint(currentStyleTarget)
        : new mxPoint(
            currentStyleTarget.getCenterX(),
            currentStyleTarget.getCenterY()
          );
      tmp = new mxRectangle(
        tmp.x - refreshTarget.width / 2,
        tmp.y - refreshTarget.height / 2,
        refreshTarget.width,
        refreshTarget.height
      );
      checkArrow(x, y, tmp, styleTarget);
    }
  }
}
