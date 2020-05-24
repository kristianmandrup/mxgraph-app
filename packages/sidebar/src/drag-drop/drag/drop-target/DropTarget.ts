import mx from "@mxgraph-app/mx";
const { mxRectangle, mxPoint, mxEvent, mxConstants, mxUtils } = mx;

export class DropTarget {
  editorUi: any;
  cells: any;
  updateThread: any;
  dropTargetDelay: any;
  dropStyleEnabled: any;
  dragSource: any;

  constructor(editorUi) {
    this.editorUi = editorUi;
  }

  // Allows drop into cell only if target is a valid root
  getDropTarget = (graph, x, y, evt) => {
    const { cells, updateThread, dropTargetDelay, dragSource } = this;
    // Alt means no targets at all
    // LATER: Show preview where result will go
    var cell =
      !mxEvent.isAltDown(evt) && cells != null ? graph.getCellAt(x, y) : null;

    // Uses connectable parent vertex if one exists
    if (cell != null && !graph.isCellConnectable(cell)) {
      var parent = graph.getModel().getParent(cell);

      if (
        graph.getModel().isVertex(parent) &&
        graph.isCellConnectable(parent)
      ) {
        cell = parent;
      }
    }

    // Ignores locked cells
    if (graph.isCellLocked(cell)) {
      cell = null;
    }

    var state = graph.view.getState(cell);
    var activeArrow: any;
    var bbox: any;
    var startTime = new Date().getTime();
    var timeOnTarget = 0;
    var prev = null;

    // Time on target
    if (prev != state) {
      prev = state;
      startTime = new Date().getTime();
      timeOnTarget = 0;

      if (updateThread != null) {
        window.clearTimeout(updateThread);
      }

      if (state != null) {
        this.updateThread = window.setTimeout(() => {
          if (activeArrow == null) {
            prev = state;
            dragSource.getDropTarget(graph, x, y, evt);
          }
        }, dropTargetDelay + 10);
      }
    } else {
      timeOnTarget = new Date().getTime() - startTime;
    }

    dragArrow.direction = mxConstants.DIRECTION_NORTH;

    if (activeArrow == arrowRight) {
      dragArrow.direction = mxConstants.DIRECTION_EAST;
    } else if (activeArrow == arrowDown || activeArrow == roundTarget) {
      dragArrow.direction = mxConstants.DIRECTION_SOUTH;
    } else if (activeArrow == arrowLeft) {
      dragArrow.direction = mxConstants.DIRECTION_WEST;
    }

    if (currentStyleTarget != null && activeArrow == styleTarget) {
      state = currentStyleTarget;
    }

    var validTarget =
      (firstVertex == null || graph.isCellConnectable(cells[firstVertex])) &&
      ((graph.model.isEdge(cell) && firstVertex != null) ||
        (graph.model.isVertex(cell) && graph.isCellConnectable(cell)));

    // Drop arrows shown after this.dropTargetDelay, hidden after 5 secs, switches arrows after 500ms
    if (this.shouldDisplayDropArrows()) {
      activeTarget = false;
      currentTargetState =
        (timeOnTarget < 5000 && timeOnTarget > this.dropTargetDelay) ||
        graph.model.isEdge(cell)
          ? state
          : null;

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
              Math.floor(p0.x - this.roundDrop.width / 2) + "px";
            roundSource.style.top =
              Math.floor(p0.y - this.roundDrop.height / 2) + "px";

            roundTarget.style.left =
              Math.floor(pe.x - this.roundDrop.width / 2) + "px";
            roundTarget.style.top =
              Math.floor(pe.y - this.roundDrop.height / 2) + "px";

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

          bds.grow(this.graph.tolerance);
          bds.grow(HoverIcons.prototype.arrowSpacing);

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
            Math.floor(state.getCenterX() - this.triangleUp.width / 2) + "px";
          arrowUp.style.top = Math.floor(bds.y - this.triangleUp.height) + "px";

          arrowRight.style.left = Math.floor(bds.x + bds.width) + "px";
          arrowRight.style.top =
            Math.floor(state.getCenterY() - this.triangleRight.height / 2) +
            "px";

          arrowDown.style.left = arrowUp.style.left;
          arrowDown.style.top = Math.floor(bds.y + bds.height) + "px";

          arrowLeft.style.left =
            Math.floor(bds.x - this.triangleLeft.width) + "px";
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
          currentStateHandle = graph.selectionCellsHandler.getHandler(
            state.cell
          );

          if (
            currentStateHandle != null &&
            currentStateHandle.setHandlesVisible != null
          ) {
            currentStateHandle.setHandlesVisible(false);
          }
        }

        activeTarget = true;
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

    if (!activeTarget && currentStateHandle != null) {
      currentStateHandle.setHandlesVisible(true);
    }

    // Handles drop target
    var target =
      (!mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt)) &&
      !(currentStyleTarget != null && activeArrow == styleTarget)
        ? mxDragSource.prototype.getDropTarget.apply(this, [graph, x, y, evt])
        : null;
    var model = graph.getModel();

    if (target != null) {
      if (activeArrow != null || !graph.isSplitTarget(target, cells, evt)) {
        // Selects parent group as drop target
        while (
          target != null &&
          !graph.isValidDropTarget(target, cells, evt) &&
          model.isVertex(model.getParent(target))
        ) {
          target = model.getParent(target);
        }

        if (
          target != null &&
          (graph.view.currentRoot == target ||
            (!graph.isValidRoot(target) &&
              graph.getModel().getChildCount(target) == 0) ||
            graph.isCellLocked(target) ||
            model.isEdge(target) ||
            !graph.isValidDropTarget(target, cells, evt))
        ) {
          target = null;
        }
      }
    }

    return target;
  };
}
