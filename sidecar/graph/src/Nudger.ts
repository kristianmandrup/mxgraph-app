import mx from "mx";
const { mxUtils, mxStackLayout } = mx;

export class Nudger {
  graph: any;
  queue: any;
  thread: any;

  constructor() {
  }

  // Helper function to move cells with the cursor keys
  nudge(keyCode, stepSize, resize) {
    const { thread, queue, graph } = this;
    queue.push(() => {
      if (!graph.isSelectionEmpty() && graph.isEnabled()) {
        stepSize = (stepSize != null) ? stepSize : 1;

        if (resize) {
          // Resizes all selected vertices
          graph.getModel().beginUpdate();
          try {
            var cells = graph.getSelectionCells();

            for (var i = 0; i < cells.length; i++) {
              if (
                graph.getModel().isVertex(cells[i]) &&
                graph.isCellResizable(cells[i])
              ) {
                var geo = graph.getCellGeometry(cells[i]);

                if (geo != null) {
                  geo = geo.clone();

                  if (keyCode == 37) {
                    geo.width = Math.max(0, geo.width - stepSize);
                  } else if (keyCode == 38) {
                    geo.height = Math.max(0, geo.height - stepSize);
                  } else if (keyCode == 39) {
                    geo.width += stepSize;
                  } else if (keyCode == 40) {
                    geo.height += stepSize;
                  }

                  graph.getModel().setGeometry(cells[i], geo);
                }
              }
            }
          } finally {
            graph.getModel().endUpdate();
          }
        } else {
          // Moves vertices up/down in a stack layout
          var cell = graph.getSelectionCell();
          var parent = graph.model.getParent(cell);
          var layout: any;

          if (
            graph.getSelectionCount() == 1 && graph.model.isVertex(cell) &&
            graph.layoutManager != null && !graph.isCellLocked(cell)
          ) {
            layout = graph.layoutManager.getLayout(parent);
          }

          if (layout != null && layout.constructor == mxStackLayout) {
            var index = parent.getIndex(cell);
            if (keyCode == 37 || keyCode == 38) {
              graph.model.add(parent, cell, Math.max(0, index - 1));
            } else if (keyCode == 39 || keyCode == 40) {
              graph.model.add(
                parent,
                cell,
                Math.min(graph.model.getChildCount(parent), index + 1),
              );
            }
          } else {
            var cells = graph.getMovableCells(graph.getSelectionCells());
            var realCells: any[] = [];

            for (var i = 0; i < cells.length; i++) {
              // TODO: Use getCompositeParent
              var style = graph.getCurrentCellStyle(cells[i]);

              if (mxUtils.getValue(style, "part", "0") == "1") {
                var parent = graph.model.getParent(cells[i]);

                if (
                  graph.model.isVertex(parent) &&
                  mxUtils.indexOf(cells, parent) < 0
                ) {
                  realCells.push(parent);
                }
              } else {
                realCells.push(cells[i]);
              }

              if (realCells.length > 0) {
                cells = realCells;
                var dx = 0;
                var dy = 0;

                if (keyCode == 37) {
                  dx = -stepSize;
                } else if (keyCode == 38) {
                  dy = -stepSize;
                } else if (keyCode == 39) {
                  dx = stepSize;
                } else if (keyCode == 40) {
                  dy = stepSize;
                }
                graph.moveCells(cells, dx, dy);
              }
            }
          }
        }
      }
    });

    if (thread) {
      window.clearTimeout(thread);
    }

    this.thread = window.setTimeout(() => {
      if (queue.length > 0) {
        graph.getModel().beginUpdate();

        try {
          for (var i = 0; i < queue.length; i++) {
            queue[i]();
          }
          this.queue = [];
        } finally {
          graph.getModel().endUpdate();
        }
      }
    }, 200);
  }
}
