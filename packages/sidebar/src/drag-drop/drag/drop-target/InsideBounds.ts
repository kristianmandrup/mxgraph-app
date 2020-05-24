import mx from "@mxgraph-app/mx";
import { DropBase } from "./DropBase";
const { mxRectangle, mxEvent } = mx;

export class InsideBounds extends DropBase {
  activeTarget: any;
  currentTargetState: any;
  activeArrow: any;
  evt: any;
  dropArrow: any;
  x: any;
  y: any;

  _bbox: any;
  _bds: any;

  constructor(editorUi, opts: any = {}) {
    super(editorUi);
    const { dropArrow } = opts;
    this.dropArrow = dropArrow;
  }

  get isInsideBounds() {
    const { evt, activeTarget, currentTargetState, activeArrow } = this;
    return (
      activeTarget &&
      currentTargetState != null &&
      !mxEvent.isAltDown(evt) &&
      activeArrow == null
    );
  }

  checkBounds() {
    const { currentTargetState, graph, dropArrow, x, y, bbox, bds } = this;
    const {
      checkArrow,
      roundSource,
      roundDrop,
      roundTarget,
      arrowSpacing,
    } = dropArrow;

    // Checks if inside bounds
    if (!this.isInsideBounds) return;
    // LATER: Use hit-detection for edges
    if (graph.model.isEdge(currentTargetState.cell)) {
      var pts = currentTargetState.absolutePoints;

      if (roundSource.parentNode != null) {
        var p0 = pts[0];
        bbox.add(
          checkArrow(
            x,
            y,
            new mxRectangle(
              p0.x - roundDrop.width / 2,
              p0.y - roundDrop.height / 2,
              roundDrop.width,
              roundDrop.height
            ),
            roundSource
          )
        );
      }

      if (roundTarget.parentNode != null) {
        var pe = pts[pts.length - 1];
        bbox.add(
          checkArrow(
            x,
            y,
            new mxRectangle(
              pe.x - roundDrop.width / 2,
              pe.y - roundDrop.height / 2,
              roundDrop.width,
              roundDrop.height
            ),
            roundTarget
          )
        );
      }
    } else {
      bds.grow(graph.tolerance);
      bds.grow(arrowSpacing);

      var handler = this.graph.selectionCellsHandler.getHandler(
        currentTargetState.cell
      );

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

      this.addBoxes();
    }

    // Adds tolerance
    if (bbox != null) {
      bbox.grow(10);
    }
  }

  get bbox() {
    this._bbox =
      this._bbox || mxRectangle.fromRectangle(this.currentTargetState);
    return this._bbox;
  }

  get bds() {
    this._bds = this._bds || this.createBds();
    return this._bds;
  }

  createBds() {
    const { currentTargetState } = this;
    var bds = mxRectangle.fromRectangle(currentTargetState);

    // Uses outer bounding box to take rotation into account
    if (
      currentTargetState.shape != null &&
      currentTargetState.shape.boundingBox != null
    ) {
      bds = mxRectangle.fromRectangle(currentTargetState.shape.boundingBox);
    }
    return bds;
  }

  addBoxes() {
    this.bboxDown();
    this.bboxLeft();
    this.bboxRight();
    this.bboxUp();
  }

  bboxUp() {
    const { dropArrow, bds, bbox, currentTargetState, x, y } = this;
    const { checkArrow, arrowUp, triangleUp } = dropArrow;

    bbox.add(
      checkArrow(
        x,
        y,
        new mxRectangle(
          currentTargetState.getCenterX() - triangleUp.width / 2,
          bds.y - triangleUp.height,
          triangleUp.width,
          triangleUp.height
        ),
        arrowUp
      )
    );
  }

  bboxRight() {
    const { dropArrow, bds, bbox, currentTargetState, x, y } = this;
    const { checkArrow, arrowRight, triangleRight } = dropArrow;

    bbox.add(
      checkArrow(
        x,
        y,
        new mxRectangle(
          bds.x + bds.width,
          currentTargetState.getCenterY() - triangleRight.height / 2,
          triangleRight.width,
          triangleRight.height
        ),
        arrowRight
      )
    );
  }

  bboxDown() {
    const { dropArrow, bds, bbox, currentTargetState, x, y } = this;
    const { checkArrow, arrowDown, triangleDown } = dropArrow;

    bbox.add(
      checkArrow(
        x,
        y,
        new mxRectangle(
          currentTargetState.getCenterX() - triangleDown.width / 2,
          bds.y + bds.height,
          triangleDown.width,
          triangleDown.height
        ),
        arrowDown
      )
    );
  }

  bboxLeft() {
    const { dropArrow, bds, bbox, currentTargetState, x, y } = this;
    const { checkArrow, arrowLeft, triangleLeft } = dropArrow;

    bbox.add(
      checkArrow(
        x,
        y,
        new mxRectangle(
          bds.x - triangleLeft.width,
          currentTargetState.getCenterY() - triangleLeft.height / 2,
          triangleLeft.width,
          triangleLeft.height
        ),
        arrowLeft
      )
    );
  }
}
