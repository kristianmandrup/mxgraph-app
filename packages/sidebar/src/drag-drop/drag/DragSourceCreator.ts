import mx from "@mxgraph-app/mx";
const { mxUtils } = mx;

export class DragSourceCreator {
  editorUi: any;
  updateThread: any;
  elt: any;
  dropHandler: any;
  preview: any;
  cells: any;

  // ??
  currentStyleTarget: any;
  activeArrow: any;
  styleTarget: any;
  updateShapes: any;
  firstVertex: any;
  currentTargetState: any;
  freeSourceEdge: any;
  dropAndConnect: any;
  direction: any;

  constructor(editorUi, opts: any = {}) {
    const { elt, dropHandler, preview, cells } = opts;
    this.editorUi = editorUi;
    this.elt = elt;
    this.dropHandler = dropHandler;
    this.preview = preview;
    this.cells = cells;
  }

  get ui() {
    return this.editorUi;
  }

  get graph() {
    return this.ui.editor.graph;
  }

  create({ elt, dropHandler, preview, cells }: any = {}) {
    elt = elt || this.elt;
    dropHandler = dropHandler || this.dropHandler;
    preview = preview || this.preview;
    cells = cells || this.cells;

    const {
      graph,
      updateThread,
      currentStyleTarget,
      styleTarget,
      activeArrow,
      updateShapes,
      firstVertex,
      currentTargetState,
      freeSourceEdge,
      dropAndConnect,
      direction,
    } = this;

    return mxUtils.makeDraggable(
      elt,
      graph,
      (graph, evt, _target, _x, _y) => {
        if (updateThread != null) {
          window.clearTimeout(updateThread);
        }

        if (
          cells != null &&
          currentStyleTarget != null &&
          activeArrow == styleTarget
        ) {
          var tmp = graph.isCellSelected(currentStyleTarget.cell)
            ? graph.getSelectionCells()
            : [currentStyleTarget.cell];
          var updatedCells = updateShapes(
            graph.model.isEdge(currentStyleTarget.cell)
              ? cells[0]
              : cells[firstVertex],
            tmp
          );
          graph.setSelectionCells(updatedCells);
        } else if (
          cells != null &&
          activeArrow != null &&
          currentTargetState != null &&
          activeArrow != styleTarget
        ) {
          var index =
            graph.model.isEdge(currentTargetState.cell) ||
            freeSourceEdge == null
              ? firstVertex
              : freeSourceEdge;
          graph.setSelectionCells(
            dropAndConnect(
              currentTargetState.cell,
              cells,
              direction,
              index,
              evt
            )
          );
        } else {
          dropHandler.apply(this, arguments);
        }

        if (this.editorUi.hoverIcons != null) {
          this.editorUi.hoverIcons.update(
            graph.view.getState(graph.getSelectionCell())
          );
        }
      },
      preview,
      0,
      0,
      graph.autoscroll,
      true,
      true
    );
  }
}
