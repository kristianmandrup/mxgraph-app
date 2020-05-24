import mx from "@mxgraph-app/mx";
const { mxConstants, mxPoint } = mx;

export class DropConnectGeo {
  editorUi: any;

  constructor(editorUi) {
    this.editorUi = editorUi;
  }

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
          graph.model.isEdge(target) &&
          geo2.getTerminalPoint(true) != null &&
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
              false
            );
          } else if (direction == mxConstants.DIRECTION_SOUTH) {
            geo2.height = length;
            geo2.y = geo.y + geo.height;
            geo2.setTerminalPoint(
              new mxPoint(geo2.x, geo2.y + geo2.height),
              false
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
            !keepSize &&
            geo2.width > 45 &&
            geo2.height > 45 &&
            geo.width > 45 &&
            geo.height > 45
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
            graph.model.isEdge(target) &&
            geo2.getTerminalPoint(true) != null &&
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
