import mx from "@mxgraph-app/mx";
import { DropBase } from "./DropBase";
const { mxConstants, mxPoint, mxUtils, mxRectangle, mxEvent } = mx;

export class DropTargetDisabler extends DropBase {
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
  state: any;
  dropStyleEnabled: any;
  cells: any;
  dropTargetDelay: any;
  isDropStyleTargetIgnored: any;
  firstVertex: any;

  disable() {
    const {
      x,
      y,
      state,
      styleTargetParent,
      styleTarget,
      dragArrow,
      graph,
      dropArrow,
    } = this;
    const { checkArrow } = dropArrow;
    // Shift means disabled, delayed on cells with children, shows after this.dropTargetDelay, hides after 2500ms
    if (this.shouldDisable()) {
      this.currentStyleTarget = state;
      var tmp = graph.model.isEdge(state.cell)
        ? graph.view.getPoint(state)
        : new mxPoint(state.getCenterX(), state.getCenterY());
      tmp = new mxRectangle(
        tmp.x - this.refreshTarget.width / 2,
        tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width,
        this.refreshTarget.height
      );

      styleTarget.style.left = Math.floor(tmp.x) + "px";
      styleTarget.style.top = Math.floor(tmp.y) + "px";

      if (styleTargetParent == null) {
        graph.container.appendChild(styleTarget);
        dragArrow.styleTargetParent = styleTarget.parentNode;
      }

      checkArrow(x, y, tmp, styleTarget);
    }
  }

  shouldDisable() {
    const {
      isDropStyleTargetIgnored,
      dropTargetDelay,
      firstVertex,
      graph,
      dropStyleEnabled,
      cells,
      timeOnTarget,
      state,
      evt,
    } = this;
    // Gets source cell style to compare shape below
    var sourceCellStyle = this.editorUi.editor.graph.getCellStyle(cells[0]);
    return (
      dropStyleEnabled &&
      timeOnTarget < 2500 &&
      state != null &&
      !mxEvent.isShiftDown(evt) &&
      // If shape is equal or target has no stroke, fill and gradient then use longer delay except for images
      ((mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, undefined) !=
        mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE, undefined) &&
        (mxUtils.getValue(
          state.style,
          mxConstants.STYLE_STROKECOLOR,
          mxConstants.NONE
        ) != mxConstants.NONE ||
          mxUtils.getValue(
            state.style,
            mxConstants.STYLE_FILLCOLOR,
            mxConstants.NONE
          ) != mxConstants.NONE ||
          mxUtils.getValue(
            state.style,
            mxConstants.STYLE_GRADIENTCOLOR,
            mxConstants.NONE
          ) != mxConstants.NONE)) ||
        mxUtils.getValue(sourceCellStyle, mxConstants.STYLE_SHAPE, undefined) ==
          "image" ||
        timeOnTarget > 1500 ||
        graph.model.isEdge(state.cell)) &&
      timeOnTarget > dropTargetDelay &&
      !isDropStyleTargetIgnored(state) &&
      ((graph.model.isVertex(state.cell) && firstVertex != null) ||
        (graph.model.isEdge(state.cell) && graph.model.isEdge(cells[0])))
    );
  }
}
