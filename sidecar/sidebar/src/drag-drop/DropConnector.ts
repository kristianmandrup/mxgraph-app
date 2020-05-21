import mx from "mx";
const {
  mxConstants,
  mxPoint,
  mxStackLayout,
  mxEvent,
  mxEventObject,
} = mx;

export class DropConnector {
  editorUi: any;
  /**
 * Creates a drag source for the given element.
 */
  dropAndConnect(source, targets, direction, dropCellIndex, evt) {
    var geo = this.getDropAndConnectGeometry(
      source,
      targets[dropCellIndex],
      direction,
      targets,
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
                (tmp.x / graph.view.scale - graph.view.translate.x),
                (tmp.y / graph.view.scale - graph.view.translate.y),
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

        var useParent = graph.model.isEdge(source) ||
          (sourceGeo != null && !sourceGeo.relative && validLayout);
        targets = graph.importCells(
          targets,
          (geo.x - (useParent ? dx : 0)),
          (geo.y - (useParent ? dy : 0)),
          (useParent) ? targetParent : null,
        );
        tmp = targets;

        if (graph.model.isEdge(source)) {
          // Adds new terminal to edge
          // LATER: Push new terminal out radially from edge start point
          graph.model.setTerminal(
            source,
            targets[dropCellIndex],
            direction == mxConstants.DIRECTION_NORTH,
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
            var offset = (tmpState.cell != graph.view.currentRoot)
              ? new mxPoint(
                (tmpState.x / graph.view.scale - graph.view.translate.x),
                (tmpState.y / graph.view.scale - graph.view.translate.y),
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
          editingCell = (tmp.length == 1) ? tmp[0] : null;
          targets.push(
            graph.insertEdge(
              null,
              null,
              "",
              source,
              targets[dropCellIndex],
              graph.createCurrentEdgeStyle(),
            ),
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
        graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
        editingCell != null
      ) {
        window.setTimeout(function () {
          graph.startEditing(editingCell);
        }, 0);
      }
    }

    return tmp;
  }

  /**
  * Creates a drag source for the given element.
  */
  getDropAndConnectGeometry(source, target, direction, targets) {
    var graph = this.editorUi.editor.graph;
    var view = graph.view;
    var keepSize = targets.length > 1;
    var geo = graph.getCellGeometry(source);
    var geo2 = graph.getCellGeometry(target);

    if (geo != null && geo2 != null) {
      geo2 = geo2.clone();

      if (graph.model.isEdge(source)) {
        var state = graph.view.getState(source);
        var pts = state.absolutePoints;
        var p0 = pts[0];
        var pe = pts[pts.length - 1];

        if (direction == mxConstants.DIRECTION_NORTH) {
          geo2.x = p0.x / view.scale - view.translate.x - geo2.width / 2;
          geo2.y = p0.y / view.scale - view.translate.y - geo2.height / 2;
        } else {
          geo2.x = pe.x / view.scale - view.translate.x - geo2.width / 2;
          geo2.y = pe.y / view.scale - view.translate.y - geo2.height / 2;
        }
      } else {
        if (geo.relative) {
          var state = graph.view.getState(source);
          geo = geo.clone();
          geo.x = (state.x - view.translate.x) / view.scale;
          geo.y = (state.y - view.translate.y) / view.scale;
        }

        var length = graph.defaultEdgeLength;

        // Maintains edge length
        if (
          graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null &&
          geo2.getTerminalPoint(false) != null
        ) {
          var p0 = geo2.getTerminalPoint(true);
          var pe = geo2.getTerminalPoint(false);
          var dx = pe.x - p0.x;
          var dy = pe.y - p0.y;

          length = Math.sqrt(dx * dx + dy * dy);

          geo2.x = geo.getCenterX();
          geo2.y = geo.getCenterY();
          geo2.width = 1;
          geo2.height = 1;

          if (direction == mxConstants.DIRECTION_NORTH) {
            geo2.height = length;
            geo2.y = geo.y - length;
            geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
          } else if (direction == mxConstants.DIRECTION_EAST) {
            geo2.width = length;
            geo2.x = geo.x + geo.width;
            geo2.setTerminalPoint(
              new mxPoint(geo2.x + geo2.width, geo2.y),
              false,
            );
          } else if (direction == mxConstants.DIRECTION_SOUTH) {
            geo2.height = length;
            geo2.y = geo.y + geo.height;
            geo2.setTerminalPoint(
              new mxPoint(geo2.x, geo2.y + geo2.height),
              false,
            );
          } else if (direction == mxConstants.DIRECTION_WEST) {
            geo2.width = length;
            geo2.x = geo.x - length;
            geo2.setTerminalPoint(new mxPoint(geo2.x, geo2.y), false);
          }
        } else {
          // Try match size or ignore if width or height < 45 which
          // is considered special enough to be ignored here
          if (
            !keepSize && geo2.width > 45 && geo2.height > 45 &&
            geo.width > 45 && geo.height > 45
          ) {
            geo2.width = geo2.width * (geo.height / geo2.height);
            geo2.height = geo.height;
          }

          geo2.x = geo.x + geo.width / 2 - geo2.width / 2;
          geo2.y = geo.y + geo.height / 2 - geo2.height / 2;

          if (direction == mxConstants.DIRECTION_NORTH) {
            geo2.y = geo2.y - geo.height / 2 - geo2.height / 2 - length;
          } else if (direction == mxConstants.DIRECTION_EAST) {
            geo2.x = geo2.x + geo.width / 2 + geo2.width / 2 + length;
          } else if (direction == mxConstants.DIRECTION_SOUTH) {
            geo2.y = geo2.y + geo.height / 2 + geo2.height / 2 + length;
          } else if (direction == mxConstants.DIRECTION_WEST) {
            geo2.x = geo2.x - geo.width / 2 - geo2.width / 2 - length;
          }

          // Adds offset to match cells without connecting edge
          if (
            graph.model.isEdge(target) && geo2.getTerminalPoint(true) != null &&
            target.getTerminal(false) != null
          ) {
            var targetGeo = graph.getCellGeometry(target.getTerminal(false));

            if (targetGeo != null) {
              if (direction == mxConstants.DIRECTION_NORTH) {
                geo2.x -= targetGeo.getCenterX();
                geo2.y -= targetGeo.getCenterY() + targetGeo.height / 2;
              } else if (direction == mxConstants.DIRECTION_EAST) {
                geo2.x -= targetGeo.getCenterX() - targetGeo.width / 2;
                geo2.y -= targetGeo.getCenterY();
              } else if (direction == mxConstants.DIRECTION_SOUTH) {
                geo2.x -= targetGeo.getCenterX();
                geo2.y -= targetGeo.getCenterY() - targetGeo.height / 2;
              } else if (direction == mxConstants.DIRECTION_WEST) {
                geo2.x -= targetGeo.getCenterX() + targetGeo.width / 2;
                geo2.y -= targetGeo.getCenterY();
              }
            }
          }
        }
      }
    }

    return geo2;
  }
}
