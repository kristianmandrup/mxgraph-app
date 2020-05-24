export class DropTargetEnabler {
  enable() {
    // Does not reset on ignored edges
    if (
      currentStyleTarget == null ||
      !mxUtils.contains(currentStyleTarget, x, y) ||
      (timeOnTarget > 1500 && !mxEvent.isShiftDown(evt))
    ) {
      currentStyleTarget = null;

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
        tmp.x - this.refreshTarget.width / 2,
        tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width,
        this.refreshTarget.height
      );
      checkArrow(x, y, tmp, styleTarget);
    }
  }
}
