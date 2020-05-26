import mx from "@mxgraph-app/mx";
const {
  mxEllipse,
  mxConstraintHandler,
  mxEvent,
  mxConnectionHandler,
  mxGuide,
  mxRubberband,
  mxGraphHandler,
  mxEdgeHandler,
  mxConstants,
  mxVertexHandler,
  mxCellState,
} = mx;

export class Overrides {
  graph: any;
  highlightColor: any;
  error: any;
  /**
   * These overrides are only added if mxVertexHandler is defined (ie. not in embedded graph)
   */
  configure() {
    if (typeof mxVertexHandler == "undefined") return;

    // Sets colors for handles
    mxConstants.HANDLE_FILLCOLOR = "#29b6f2";
    mxConstants.HANDLE_STROKECOLOR = "#0088cf";
    mxConstants.VERTEX_SELECTION_COLOR = "#00a8ff";
    mxConstants.OUTLINE_COLOR = "#00a8ff";
    mxConstants.OUTLINE_HANDLE_FILLCOLOR = "#99ccff";
    mxConstants.OUTLINE_HANDLE_STROKECOLOR = "#00a8ff";
    mxConstants.CONNECT_HANDLE_FILLCOLOR = "#cee7ff";
    mxConstants.EDGE_SELECTION_COLOR = "#00a8ff";
    mxConstants.DEFAULT_VALID_COLOR = "#00a8ff";
    mxConstants.LABEL_HANDLE_FILLCOLOR = "#cee7ff";
    mxConstants.GUIDE_COLOR = "#0088cf";
    mxConstants.HIGHLIGHT_OPACITY = 30;
    mxConstants.HIGHLIGHT_SIZE = 5;

    // Enables snapping to off-grid terminals for edge waypoints
    mxEdgeHandler.prototype.snapToTerminals = true;

    // Enables guides
    mxGraphHandler.prototype.guidesEnabled = true;

    // Removes parents where all child cells are moved out
    mxGraphHandler.prototype.removeEmptyParents = true;

    // Enables fading of rubberband
    mxRubberband.prototype.fadeOut = true;

    // Alt-move disables guides
    mxGuide.prototype.isEnabledForEvent = (evt) => {
      return !mxEvent.isAltDown(evt);
    }; // Extends connection handler to enable ctrl+drag for cloning source cell
    // since copyOnConnect is now disabled by default

    var mxConnectionHandlerCreateTarget =
      mxConnectionHandler.prototype.isCreateTarget;

    mxConnectionHandler.prototype.isCreateTarget = (evt) => {
      return (
        mxEvent.isControlDown(evt) ||
        mxConnectionHandlerCreateTarget.apply(this, [evt])
      );
    }; // Overrides highlight shape for connection points

    mxConstraintHandler.prototype.createHighlightShape = () => {
      var hl = new mxEllipse(null, this.highlightColor, this.highlightColor, 0);
      hl.opacity = mxConstants.HIGHLIGHT_OPACITY;

      return hl;
    }; // Overrides edge preview to use current edge shape and default style

    mxConnectionHandler.prototype.livePreview = true;
    mxConnectionHandler.prototype.cursor = "crosshair";

    // Uses current edge style for connect preview
    mxConnectionHandler.prototype.createEdgeState = (_me) => {
      var style = this.graph.createCurrentEdgeStyle();
      var edge = this.graph.createEdge(null, null, null, null, null, style);
      var state = new mxCellState(
        this.graph.view,
        edge,
        this.graph.getCellStyle(edge)
      );

      for (var key in this.graph.currentEdgeStyle) {
        state.style[key] = this.graph.currentEdgeStyle[key];
      }

      return state;
    }; // Overrides dashed state with current edge style

    var connectionHandlerCreateShape =
      mxConnectionHandler.prototype.createShape;
    mxConnectionHandler.prototype.createShape = () => {
      var shape = connectionHandlerCreateShape.apply(this, []);

      shape.isDashed =
        this.graph.currentEdgeStyle[mxConstants.STYLE_DASHED] == "1";

      return shape;
    };

    // Overrides live preview to keep current style
    mxConnectionHandler.prototype.updatePreview = (_valid) => {
      // do not change color of preview
    }; // Overrides connection handler to ignore edges instead of not allowing connections

    var mxConnectionHandlerCreateMarker =
      mxConnectionHandler.prototype.createMarker;
    mxConnectionHandler.prototype.createMarker = () => {
      var marker = mxConnectionHandlerCreateMarker.apply(this, []);
      var markerGetCell = marker.getCell;
      marker.getCell = (_me) => {
        var result = markerGetCell.apply(this, arguments);
        this.error = null;
        return result;
      };

      return marker;
    };
  }
}
