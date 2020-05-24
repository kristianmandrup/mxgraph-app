import mx from "@mxgraph-app/mx";
import { DropConnectGeo } from "./DropConnectGeo";
const { mxConstants, mxPoint, mxStackLayout, mxEvent, mxEventObject } = mx;

export class DropConnect {
  editorUi: any;
  dropConnect: any;
  dropConnectGeo: any;

  constructor(editorUi, { dropConnectGeo }: any = {}) {
    this.editorUi = editorUi;
    this.dropConnectGeo = dropConnectGeo || new DropConnectGeo(editorUi);
  }

  /**
   * Creates a drag source for the given element.
   */
  dropAndConnect(source, targets, direction, dropCellIndex, evt) {
    var geo = this.dropConnectGeo.getDropAndConnectGeometry(
      source,
      targets[dropCellIndex],
      direction,
      targets
    );

    // Targets without the new edge for selection
    var tmp: any = [];

    if (geo != null) {
      var graph = this.editorUi.editor.graph;
      var editingCell = null;

      graph.model.beginUpdate();
      try {
        var sourceGeo = graph.getCellGeometry(source);
        var geo2 = graph.getCellGeometry(targets[dropCellIndex]);

        // Handles special case where target should be ignored for stack layouts
        var targetParent = graph.model.getParent(source);
        var validLayout = true;

        // Ignores parent if it has a stack layout
        if (graph.layoutManager != null) {
          var layout = graph.layoutManager.getLayout(targetParent);

          // LATER: Use parent of parent if valid layout
          if (layout != null && layout.constructor == mxStackLayout) {
            validLayout = false;

            tmp = graph.view.getState(targetParent);

            // Offsets by parent position
            if (tmp) {
              var offset = new mxPoint(
                tmp.x / graph.view.scale - graph.view.translate.x,
                tmp.y / graph.view.scale - graph.view.translate.y
              );
              geo.x += offset.x;
              geo.y += offset.y;
              var pt = geo.getTerminalPoint(false);

              if (pt != null) {
                pt.x += offset.x;
                pt.y += offset.y;
              }
            }
          }
        }

        var dx = geo2.x;
        var dy = geo2.y;

        // Ignores geometry of edges
        if (graph.model.isEdge(targets[dropCellIndex])) {
          dx = 0;
          dy = 0;
        }

        var useParent =
          graph.model.isEdge(source) ||
          (sourceGeo != null && !sourceGeo.relative && validLayout);
        targets = graph.importCells(
          targets,
          geo.x - (useParent ? dx : 0),
          geo.y - (useParent ? dy : 0),
          useParent ? targetParent : null
        );
        tmp = targets;

        if (graph.model.isEdge(source)) {
          // Adds new terminal to edge
          // LATER: Push new terminal out radially from edge start point
          graph.model.setTerminal(
            source,
            targets[dropCellIndex],
            direction == mxConstants.DIRECTION_NORTH
          );
        } else if (graph.model.isEdge(targets[dropCellIndex])) {
          // Adds new outgoing connection to vertex and clears points
          graph.model.setTerminal(targets[dropCellIndex], source, true);
          var geo3 = graph.getCellGeometry(targets[dropCellIndex]);
          geo3.points = null;

          if (geo3.getTerminalPoint(false) != null) {
            geo3.setTerminalPoint(geo.getTerminalPoint(false), false);
          } else if (useParent && graph.model.isVertex(targetParent)) {
            // Adds parent offset to other nodes
            var tmpState = graph.view.getState(targetParent);
            var offset =
              tmpState.cell != graph.view.currentRoot
                ? new mxPoint(
                    tmpState.x / graph.view.scale - graph.view.translate.x,
                    tmpState.y / graph.view.scale - graph.view.translate.y
                  )
                : new mxPoint(0, 0);

            graph.cellsMoved(targets, offset.x, offset.y, null, null, true);
          }
        } else {
          geo2 = graph.getCellGeometry(targets[dropCellIndex]);
          dx = geo.x - Math.round(geo2.x);
          dy = geo.y - Math.round(geo2.y);
          geo.x = Math.round(geo2.x);
          geo.y = Math.round(geo2.y);
          graph.model.setGeometry(targets[dropCellIndex], geo);
          graph.cellsMoved(targets, dx, dy, null, null, true);
          tmp = targets.slice();
          editingCell = tmp.length == 1 ? tmp[0] : null;
          targets.push(
            graph.insertEdge(
              null,
              null,
              "",
              source,
              targets[dropCellIndex],
              graph.createCurrentEdgeStyle()
            )
          );
        }

        if (evt == null || !mxEvent.isShiftDown(evt)) {
          graph.fireEvent(new mxEventObject("cellsInserted", "cells", targets));
        }
      } catch (e) {
        this.editorUi.handleError(e);
      } finally {
        graph.model.endUpdate();
      }

      if (
        graph.editAfterInsert &&
        evt != null &&
        mxEvent.isMouseEvent(evt) &&
        editingCell != null
      ) {
        window.setTimeout(function () {
          graph.startEditing(editingCell);
        }, 0);
      }
    }

    return tmp;
  }
}
