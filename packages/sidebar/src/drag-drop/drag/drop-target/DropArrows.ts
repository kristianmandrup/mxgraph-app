import mx from "@mxgraph-app/mx";
import { DropBase } from "./DropBase";
const { mxUtils, mxRectangle } = mx;

export class DropArrows extends DropBase {
  activeTarget: any;
  timeOnTarget: any;
  currentTargetState: any;
  validTarget: any;
  dropArrow: any;
  cell: any;
  state: any;
  currentStateHandle: any;
  bbox: any;
  dropTargetDelay: any;
  // arrowSpacing: any // HoverIcons.prototype

  display(pos) {
    if (!this.shouldDisplayDropArrows(pos)) return;
    const { validTarget, dropArrow } = this;
    this.activeTarget = false;
    this.currentTargetState = this.getCurrentTargetState();
    const { currentStateHandle, currentTargetState, graph, cell, state } = this;

    const {
      arrowSpacing,
      triangleUp,
      triangleRight,
      triangleLeft,
      roundDrop,
      roundSource,
      roundTarget,
      arrowUp,
      arrowRight,
      arrowDown,
      arrowLeft,
    } = dropArrow;

    if (currentTargetState != null && validTarget) {
      var elts: any[] = [
        roundSource,
        roundTarget,
        arrowUp,
        arrowRight,
        arrowDown,
        arrowLeft,
      ];

      for (var i = 0; i < elts.length; i++) {
        if (elts[i].parentNode != null) {
          elts[i].parentNode.removeChild(elts[i]);
        }
      }

      if (graph.model.isEdge(cell)) {
        var pts = state.absolutePoints;

        if (pts != null) {
          var p0 = pts[0];
          var pe = pts[pts.length - 1];
          // var tol = graph.tolerance;
          // var box = new mxRectangle(x - tol, y - tol, 2 * tol, 2 * tol);

          roundSource.style.left =
            Math.floor(p0.x - roundDrop.width / 2) + "px";
          roundSource.style.top =
            Math.floor(p0.y - roundDrop.height / 2) + "px";

          roundTarget.style.left =
            Math.floor(pe.x - roundDrop.width / 2) + "px";
          roundTarget.style.top =
            Math.floor(pe.y - roundDrop.height / 2) + "px";

          if (graph.model.getTerminal(cell, true) == null) {
            graph.container.appendChild(roundSource);
          }

          if (graph.model.getTerminal(cell, false) == null) {
            graph.container.appendChild(roundTarget);
          }
        }
      } else {
        var bds = mxRectangle.fromRectangle(state);

        // Uses outer bounding box to take rotation into account
        if (state.shape != null && state.shape.boundingBox != null) {
          bds = mxRectangle.fromRectangle(state.shape.boundingBox);
        }

        bds.grow(graph.tolerance);
        bds.grow(arrowSpacing);

        var handler = this.graph.selectionCellsHandler.getHandler(state.cell);

        if (handler != null) {
          bds.x -= handler.horizontalOffset / 2;
          bds.y -= handler.verticalOffset / 2;
          bds.width += handler.horizontalOffset;
          bds.height += handler.verticalOffset;

          // Adds bounding box of rotation handle to avoid overlap
          if (
            handler.rotationShape != null &&
            handler.rotationShape.node != null &&
            handler.rotationShape.node.style.visibility != "hidden" &&
            handler.rotationShape.node.style.display != "none" &&
            handler.rotationShape.boundingBox != null
          ) {
            bds.add(handler.rotationShape.boundingBox);
          }
        }

        arrowUp.style.left =
          Math.floor(state.getCenterX() - triangleUp.width / 2) + "px";
        arrowUp.style.top = Math.floor(bds.y - triangleUp.height) + "px";

        arrowRight.style.left = Math.floor(bds.x + bds.width) + "px";
        arrowRight.style.top =
          Math.floor(state.getCenterY() - triangleRight.height / 2) + "px";

        arrowDown.style.left = arrowUp.style.left;
        arrowDown.style.top = Math.floor(bds.y + bds.height) + "px";

        arrowLeft.style.left = Math.floor(bds.x - triangleLeft.width) + "px";
        arrowLeft.style.top = arrowRight.style.top;

        if (state.style["portConstraint"] != "eastwest") {
          graph.container.appendChild(arrowUp);
          graph.container.appendChild(arrowDown);
        }

        graph.container.appendChild(arrowRight);
        graph.container.appendChild(arrowLeft);
      }

      // Hides handle for cell under mouse
      if (state != null) {
        this.currentStateHandle = graph.selectionCellsHandler.getHandler(
          state.cell
        );

        if (
          currentStateHandle != null &&
          currentStateHandle.setHandlesVisible != null
        ) {
          currentStateHandle.setHandlesVisible(false);
        }
      }

      this.activeTarget = true;
    } else {
      var elts = [
        roundSource,
        roundTarget,
        arrowUp,
        arrowRight,
        arrowDown,
        arrowLeft,
      ];

      for (var i = 0; i < elts.length; i++) {
        if (elts[i].parentNode != null) {
          elts[i].parentNode.removeChild(elts[i]);
        }
      }
    }
  }

  shouldDisplayDropArrows({ x, y }) {
    const {
      dropArrow,
      currentTargetState,
      timeOnTarget,
      state,
      bbox,
      validTarget,
    } = this;
    const { activeArrow } = dropArrow;
    return (
      (currentTargetState != null && timeOnTarget >= 5000) ||
      (currentTargetState != state &&
        (bbox == null ||
          !mxUtils.contains(bbox, x, y) ||
          (timeOnTarget > 500 && activeArrow == null && validTarget)))
    );
  }

  getCurrentTargetState() {
    const { timeOnTarget, dropTargetDelay, graph, state, cell } = this;
    return (timeOnTarget < 5000 && timeOnTarget > dropTargetDelay) ||
      graph.model.isEdge(cell)
      ? state
      : null;
  }
}
