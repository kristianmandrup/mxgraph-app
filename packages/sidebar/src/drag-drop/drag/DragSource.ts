import mx from "@mxgraph-app/mx";
import { DragSourceCreator } from "./DragSourceCreator";
import { DragArrow } from "./DragArrow";
import { DropTarget } from "./drop-target/DropTarget";
import { DropCheck } from "../drop/DropCheck";

const { mxDragSource, mxClient, mxEvent } = mx;

export class DragSource {
  editorUi: any;
  updateThread: any;
  dropStyleEnabled: any;
  triangleUp: any;
  triangleDown: any;
  triangleLeft: any;
  triangleRight: any;
  updateShapes: any;
  refreshTarget: any;
  dropAndConnect: any;
  previewElement: any;
  previewElementWidth: any;
  previewElementHeight: any;
  currentGuide: any;
  getDropAndConnectGeometry: any;
  dropTargetDelay: any;
  isDropStyleTargetIgnored: any;
  roundDrop: any;
  freeSourceEdge: any;
  firstVertex: any;

  dragArrow: any;
  dropTarget: any;
  dropCheck: any;

  constructor(editorUi) {
    this.editorUi = editorUi;
    this.dropTarget = new DropTarget(editorUi);
    this.dropCheck = new DropCheck(editorUi);
  }

  isDropStyleEnabled(cells, firstVertex) {
    return this.dropCheck.isDropStyleEnabled(cells, firstVertex);
  }

  get ui() {
    return this.editorUi;
  }

  get graph() {
    return this.ui.editor.graph;
  }

  get sidebar() {
    return this;
  }

  /**
   * Creates a drag source for the given element.
   */
  create(elt, dropHandler, preview, cells, bounds) {
    // Checks if the cells contain any vertices
    const { ui, graph, sidebar, firstVertex, freeSourceEdge } = this;

    for (var i = 0; i < cells.length; i++) {
      if (firstVertex == null && graph.model.isVertex(cells[i])) {
        this.firstVertex = i;
      } else if (
        freeSourceEdge == null &&
        graph.model.isEdge(cells[i]) &&
        graph.model.getTerminal(cells[i], true) == null
      ) {
        this.freeSourceEdge = i;
      }

      if (firstVertex != null && freeSourceEdge != null) {
        break;
      }
    }

    const dragSource = new DragSourceCreator(this.editorUi).create({
      elt,
      dropHandler,
      preview,
      cells,
    });

    this.dropStyleEnabled = this.isDropStyleEnabled(cells, firstVertex);

    // Stops dragging if cancel is pressed
    graph.addListener(mxEvent.ESCAPE, (_sender, _evt) => {
      if (dragSource.isActive()) {
        dragSource.reset();
      }
    });

    // Overrides mouseDown to ignore popup triggers
    var mouseDown = dragSource.mouseDown;

    dragSource.mouseDown = (evt) => {
      if (!mxEvent.isPopupTrigger(evt) && !mxEvent.isMultiTouchEvent(evt)) {
        graph.stopEditing();
        mouseDown.apply(this, arguments);
      }
    }; // Workaround for event redirection via image tag in quirks and IE8

    var currentTargetState: any;
    var currentStateHandle: any;
    var currentStyleTarget: any;

    const dragArrow = new DragArrow();
    this.dragArrow = dragArrow;
    const {
      arrowUp,
      arrowRight,
      arrowLeft,
      arrowDown,
      activeArrow,
      styleTarget,
      direction,
      roundSource,
      roundTarget,
    } = dragArrow;

    var dsCreatePreviewElement = dragSource.createPreviewElement;

    // Stores initial size of preview element
    dragSource.createPreviewElement = (_graph) => {
      var elt = dsCreatePreviewElement.apply(this, arguments);

      // Pass-through events required to tooltip on replace shape
      if (mxClient.IS_SVG) {
        elt.style.pointerEvents = "none";
      }

      this.previewElementWidth = elt.style.width;
      this.previewElementHeight = elt.style.height;

      return elt;
    }; // Shows/hides hover icons

    var dragEnter = dragSource.dragEnter;
    dragSource.dragEnter = (_graph, _evt) => {
      if (ui.hoverIcons != null) {
        ui.hoverIcons.setDisplay("none");
      }

      dragEnter.apply(this, arguments);
    };

    var dragExit = dragSource.dragExit;
    dragSource.dragExit = (_graph, _evt) => {
      if (ui.hoverIcons != null) {
        ui.hoverIcons.setDisplay("");
      }

      dragExit.apply(this, arguments);
    };

    dragSource.dragOver = (graph, evt) => {
      mxDragSource.prototype.dragOver.apply(this, [graph, evt]);

      if (this.currentGuide != null && activeArrow != null) {
        this.currentGuide.hide();
      }

      if (this.previewElement != null) {
        var view = graph.view;

        if (currentStyleTarget != null && activeArrow == styleTarget) {
          this.previewElement.style.display = graph.model.isEdge(
            currentStyleTarget.cell
          )
            ? "none"
            : "";

          this.previewElement.style.left = currentStyleTarget.x + "px";
          this.previewElement.style.top = currentStyleTarget.y + "px";
          this.previewElement.style.width = currentStyleTarget.width + "px";
          this.previewElement.style.height = currentStyleTarget.height + "px";
        } else if (currentTargetState != null && activeArrow != null) {
          var index =
            graph.model.isEdge(currentTargetState.cell) ||
            freeSourceEdge == null
              ? firstVertex
              : freeSourceEdge;
          var geo = sidebar.getDropAndConnectGeometry(
            currentTargetState.cell,
            cells[index],
            direction,
            cells
          );
          var geo2 = !graph.model.isEdge(currentTargetState.cell)
            ? graph.getCellGeometry(currentTargetState.cell)
            : null;
          var geo3 = graph.getCellGeometry(cells[index]);
          var parent = graph.model.getParent(currentTargetState.cell);
          var dx = view.translate.x * view.scale;
          var dy = view.translate.y * view.scale;

          if (
            geo2 != null &&
            !geo2.relative &&
            graph.model.isVertex(parent) &&
            parent != view.currentRoot
          ) {
            var pState = view.getState(parent);

            dx = pState.x;
            dy = pState.y;
          }

          var dx2 = geo3.x;
          var dy2 = geo3.y;

          // Ignores geometry of edges
          if (graph.model.isEdge(cells[index])) {
            dx2 = 0;
            dy2 = 0;
          }

          // Shows preview at drop location
          this.previewElement.style.left =
            (geo.x - dx2) * view.scale + dx + "px";
          this.previewElement.style.top =
            (geo.y - dy2) * view.scale + dy + "px";

          if (cells.length == 1) {
            this.previewElement.style.width = geo.width * view.scale + "px";
            this.previewElement.style.height = geo.height * view.scale + "px";
          }

          this.previewElement.style.display = "";
        } else if (
          dragSource.currentHighlight.state != null &&
          graph.model.isEdge(dragSource.currentHighlight.state.cell)
        ) {
          // Centers drop cells when splitting edges
          this.previewElement.style.left =
            Math.round(
              parseInt(this.previewElement.style.left) -
                (bounds.width * view.scale) / 2
            ) + "px";
          this.previewElement.style.top =
            Math.round(
              parseInt(this.previewElement.style.top) -
                (bounds.height * view.scale) / 2
            ) + "px";
        } else {
          this.previewElement.style.width = this.previewElementWidth;
          this.previewElement.style.height = this.previewElementHeight;
          this.previewElement.style.display = "";
        }
      }
    };

    dragSource.getDropTarget = (graph, x, y, evt) => {
      this.dropTarget.getDropTarget(graph, x, y, evt);
    };

    dragSource.stopDrag = () => {
      mxDragSource.prototype.stopDrag.apply(this, []);

      var elts = [
        roundSource,
        roundTarget,
        styleTarget,
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

      if (currentTargetState != null && currentStateHandle != null) {
        currentStateHandle.reset();
      }

      currentStateHandle = null;
      currentTargetState = null;
      currentStyleTarget = null;
      dragArrow.styleTargetParent = null;
      dragArrow.activeArrow = null;
    };

    return dragSource;
  }
}
