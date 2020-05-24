import mx from "@mxgraph-app/mx";
import { DropBase } from "./DropBase";
import { DropArrows } from "./DropArrows";
const { mxDragSource, mxEvent, mxConstants } = mx;

export class DropTarget extends DropBase {
  editorUi: any;
  cells: any;
  updateThread: any;
  dropTargetDelay: any;
  dropStyleEnabled: any;
  dragSource: any;
  dragArrow: any;
  currentStyleTarget: any;
  firstVertex: any;
  activeTarget: any;
  activeArrow: any;
  styleTarget: any;
  currentStateHandle: any;
  dropArrows: any;

  constructor(editorUi) {
    super(editorUi);
    this.dropArrows = new DropArrows(editorUi);
  }

  // Allows drop into cell only if target is a valid root
  getDropTarget = (graph, x, y, evt) => {
    const {
      dragArrow,
      updateThread,
      dropTargetDelay,
      dragSource,
      currentStyleTarget,
      activeTarget,
      styleTarget,
      currentStateHandle,
    } = this;

    const { arrowLeft, arrowDown, arrowRight, roundTarget } = dragArrow;
    const pos = { x, y };
    const cell = this.createCell(evt, pos);

    var state = graph.view.getState(cell);
    var activeArrow: any;
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

    this.createValidTarget(cell);

    // Drop arrows shown after this.dropTargetDelay, hidden after 5 secs, switches arrows after 500ms
    this.dropArrows.display();

    if (!activeTarget && currentStateHandle != null) {
      currentStateHandle.setHandlesVisible(true);
    }
    // Handles drop target
    var target = this.createTarget(evt, pos);
    target = this.selectParentGroupAsDropTarget(target, evt);

    return target;
  };

  selectParentGroupAsDropTarget(target, evt) {
    const { model, graph, activeArrow, cells } = this;
    if (!target || !activeArrow) return target;
    if (graph.isSplitTarget(target, cells, evt)) return;

    // Selects parent group as drop target
    while (
      target != null &&
      !graph.isValidDropTarget(target, cells, evt) &&
      model.isVertex(model.getParent(target))
    ) {
      target = model.getParent(target);
    }

    if (!target) return target;
    if (this.shouldIgnoreTarget(target, evt)) {
      return null;
    }
    return target;
  }

  get model() {
    return this.graph.getModel();
  }

  shouldIgnoreTarget(target, evt) {
    const { graph, model, cells } = this;
    return (
      graph.view.currentRoot == target ||
      (!graph.isValidRoot(target) &&
        graph.getModel().getChildCount(target) == 0) ||
      graph.isCellLocked(target) ||
      model.isEdge(target) ||
      !graph.isValidDropTarget(target, cells, evt)
    );
  }

  createTarget(evt, { x, y }) {
    const { graph, currentStyleTarget, activeArrow, styleTarget } = this;
    return (!mxEvent.isAltDown(evt) || mxEvent.isShiftDown(evt)) &&
      !(currentStyleTarget != null && activeArrow == styleTarget)
      ? mxDragSource.prototype.getDropTarget.apply(this, [graph, x, y, evt])
      : null;
  }

  createValidTarget(cell) {
    const { firstVertex, graph, cells } = this;
    return (
      (firstVertex == null || graph.isCellConnectable(cells[firstVertex])) &&
      ((graph.model.isEdge(cell) && firstVertex != null) ||
        (graph.model.isVertex(cell) && graph.isCellConnectable(cell)))
    );
  }

  getCell(evt, { x, y }) {
    const { cells, graph } = this;
    return !mxEvent.isAltDown(evt) && cells != null
      ? graph.getCellAt(x, y)
      : null;
  }

  createCell(evt, pos) {
    const { graph } = this;
    // Alt means no targets at all
    // LATER: Show preview where result will go
    let cell = this.getCell(evt, pos);

    // Uses connectable parent vertex if one exists
    if (cell != null && !graph.isCellConnectable(cell)) {
      const parent = graph.getModel().getParent(cell);

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
    return cell;
  }
}
