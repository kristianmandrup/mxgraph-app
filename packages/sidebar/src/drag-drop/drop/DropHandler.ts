import mx from "@mxgraph-app/mx";
const { mxEvent, mxEventObject } = mx;

export class DropHandler {
  container: any;
  editorUi: any;
  /**
   * Creates a drop handler for inserting the given cells.
   */
  create(cells, allowSplit, allowCellsInserted, bounds) {
    allowCellsInserted = allowCellsInserted != null ? allowCellsInserted : true;

    return (graph, evt, target, x, y, force) => {
      var elt = force
        ? null
        : mxEvent.isTouchEvent(evt) || mxEvent.isPenEvent(evt)
        ? document.elementFromPoint(
            mxEvent.getClientX(evt),
            mxEvent.getClientY(evt)
          )
        : mxEvent.getSource(evt);

      while (elt != null && elt != this.container) {
        elt = elt.parentNode;
      }

      if (elt == null && graph.isEnabled()) {
        cells = graph.getImportableCells(cells);

        if (cells.length > 0) {
          graph.stopEditing();

          // Holding alt while mouse is released ignores drop target
          var validDropTarget =
            target != null && !mxEvent.isAltDown(evt)
              ? graph.isValidDropTarget(target, cells, evt)
              : false;

          var select: any;

          if (target != null && !validDropTarget) {
            target = null;
          }

          if (!graph.isCellLocked(target || graph.getDefaultParent())) {
            graph.model.beginUpdate();
            try {
              x = Math.round(x);
              y = Math.round(y);

              // Splits the target edge or inserts into target group
              if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
                var clones = graph.cloneCells(cells);
                graph.splitEdge(
                  target,
                  clones,
                  null,
                  x - bounds.width / 2,
                  y - bounds.height / 2
                );
                select = clones;
              } else if (cells.length > 0) {
                select = graph.importCells(cells, x, y, target);
              }

              // Executes parent layout hooks for position/order
              if (graph.layoutManager != null) {
                var layout = graph.layoutManager.getLayout(target);

                if (layout != null) {
                  var s = graph.view.scale;
                  var tr = graph.view.translate;
                  var tx = (x + tr.x) * s;
                  var ty = (y + tr.y) * s;

                  for (var i = 0; i < select.length; i++) {
                    layout.moveCell(select[i], tx, ty);
                  }
                }
              }

              if (
                allowCellsInserted &&
                (evt == null || !mxEvent.isShiftDown(evt))
              ) {
                graph.fireEvent(
                  new mxEventObject("cellsInserted", "cells", select)
                );
              }
            } catch (e) {
              this.editorUi.handleError(e);
            } finally {
              graph.model.endUpdate();
            }

            if (select != null && select.length > 0) {
              graph.scrollCellToVisible(select[0]);
              graph.setSelectionCells(select);
            }

            if (
              graph.editAfterInsert &&
              evt != null &&
              mxEvent.isMouseEvent(evt) &&
              select != null &&
              select.length == 1
            ) {
              window.setTimeout(function () {
                graph.startEditing(select[0]);
              }, 0);
            }
          }
        }

        mxEvent.consume(evt);
      }
    };
  }
}
