import mx from "@mxgraph-app/mx";
const { mxEdgeHandler, mxRectangle, mxEdgeStyle, mxEvent, mxUtils } = mx;

export class MouseMove {
  selectionCellsHandler: any;
  setSelectionCell: any;
  isEnabled: any;
  isCellSelected: any;
  panningHandler: any;
  tolerance: any;
  start: any;
  graph: any;
  graphHandler: any;
  cursor: any;
  isOrthogonal: any;

  get model() {
    return this.graph.model;
  }

  get view() {
    return this.graph.view;
  }

  handler = (_sender, me) => {
    // Checks if any other handler is active
    const { start } = this;
    var handlerMap = this.selectionCellsHandler.handlers.map;

    for (var key in handlerMap) {
      if (handlerMap[key].index != null) {
        return;
      }
    }

    if (
      this.isEnabled() &&
      !this.panningHandler.isActive() &&
      !mxEvent.isControlDown(me.getEvent()) &&
      !mxEvent.isShiftDown(me.getEvent()) &&
      !mxEvent.isAltDown(me.getEvent())
    ) {
      var tol = this.tolerance;

      if (start.point != null && start.state != null && start.event != null) {
        var state = start.state;

        if (
          Math.abs(start.point.x - me.getGraphX()) > tol ||
          Math.abs(start.point.y - me.getGraphY()) > tol
        ) {
          // Lazy selection for edges inside groups
          if (!this.isCellSelected(state.cell)) {
            this.setSelectionCell(state.cell);
          }

          var handler = this.selectionCellsHandler.getHandler(state.cell);

          if (
            handler != null &&
            handler.bends != null &&
            handler.bends.length > 0
          ) {
            var handle = handler.getHandleForEvent(start.event);
            var edgeStyle = this.view.getEdgeStyle(state);
            var entity = edgeStyle == mxEdgeStyle.EntityRelation;

            // Handles special case where label was clicked on unselected edge in which
            // case the label will be moved regardless of the handle that is returned
            if (!start.selected && start.handle == mxEvent.LABEL_HANDLE) {
              handle = start.handle;
            }

            if (
              !entity ||
              handle == 0 ||
              handle == handler.bends.length - 1 ||
              handle == mxEvent.LABEL_HANDLE
            ) {
              // Source or target handle or connected for direct handle access or orthogonal line
              // with just two points where the central handle is moved regardless of mouse position
              if (
                handle == mxEvent.LABEL_HANDLE ||
                handle == 0 ||
                state.visibleSourceState != null ||
                handle == handler.bends.length - 1 ||
                state.visibleTargetState != null
              ) {
                if (!entity && handle != mxEvent.LABEL_HANDLE) {
                  var pts = state.absolutePoints;

                  // Default case where handles are at corner points handles
                  // drag of corner as drag of existing point
                  if (
                    pts != null &&
                    ((edgeStyle == null && handle == null) ||
                      edgeStyle == mxEdgeStyle.OrthConnector)
                  ) {
                    // Does not use handles if they were not initially visible
                    handle = start.handle;

                    if (handle == null) {
                      var box = new mxRectangle(start.point.x, start.point.y);
                      box.grow(mxEdgeHandler.prototype.handleImage.width / 2);

                      if (mxUtils.contains(box, pts[0].x, pts[0].y)) {
                        // Moves source terminal handle
                        handle = 0;
                      } else if (
                        mxUtils.contains(
                          box,
                          pts[pts.length - 1].x,
                          pts[pts.length - 1].y
                        )
                      ) {
                        // Moves target terminal handle
                        handle = handler.bends.length - 1;
                      } else {
                        // Checks if edge has no bends
                        var nobends =
                          edgeStyle != null &&
                          (pts.length == 2 ||
                            (pts.length == 3 &&
                              ((Math.round(pts[0].x - pts[1].x) == 0 &&
                                Math.round(pts[1].x - pts[2].x) == 0) ||
                                (Math.round(pts[0].y - pts[1].y) == 0 &&
                                  Math.round(pts[1].y - pts[2].y) == 0))));

                        if (nobends) {
                          // Moves central handle for straight orthogonal edges
                          handle = 2;
                        } else {
                          // Finds and moves vertical or horizontal segment
                          handle = mxUtils.findNearestSegment(
                            state,
                            start.point.x,
                            start.point.y
                          );

                          // Converts segment to virtual handle index
                          if (edgeStyle == null) {
                            handle = mxEvent.VIRTUAL_HANDLE - handle;
                          }
                          // Maps segment to handle
                          else {
                            handle += 1;
                          }
                        }
                      }
                    }
                  }

                  // Creates a new waypoint and starts moving it
                  if (handle == null) {
                    handle = mxEvent.VIRTUAL_HANDLE;
                  }
                }

                handler.start(me.getGraphX(), me.getGraphX(), handle);
                start.state = null;
                start.event = null;
                start.point = null;
                start.handle = null;
                start.selected = false;
                me.consume();

                // Removes preview rectangle in graph handler
                this.graphHandler.reset();
              }
            } else if (
              entity &&
              (state.visibleSourceState != null ||
                state.visibleTargetState != null)
            ) {
              // Disables moves on entity to make it consistent
              this.graphHandler.reset();
              me.consume();
            }
          }
        }
      } else {
        // Updates cursor for unselected edges under the mouse
        var state = me.getState();

        if (state != null) {
          // Checks if state was removed in call to stopEditing above
          if (this.model.isEdge(state.cell)) {
            var cursor = null;
            var pts = state.absolutePoints;

            if (pts != null) {
              var box = new mxRectangle(me.getGraphX(), me.getGraphY());
              box.grow(mxEdgeHandler.prototype.handleImage.width / 2);

              if (
                state.text != null &&
                state.text.boundingBox != null &&
                mxUtils.contains(
                  state.text.boundingBox,
                  me.getGraphX(),
                  me.getGraphY()
                )
              ) {
                this.cursor = "move";
              } else if (
                mxUtils.contains(box, pts[0].x, pts[0].y) ||
                mxUtils.contains(
                  box,
                  pts[pts.length - 1].x,
                  pts[pts.length - 1].y
                )
              ) {
                this.cursor = "pointer";
              } else if (
                state.visibleSourceState != null ||
                state.visibleTargetState != null
              ) {
                // Moving is not allowed for entity relation but still indicate hover state
                var tmp = this.view.getEdgeStyle(state);
                this.cursor = "crosshair";

                if (
                  tmp != mxEdgeStyle.EntityRelation &&
                  this.isOrthogonal(state)
                ) {
                  var idx = mxUtils.findNearestSegment(
                    state,
                    me.getGraphX(),
                    me.getGraphY()
                  );

                  if (idx < pts.length - 1 && idx >= 0) {
                    this.cursor =
                      Math.round(pts[idx].x - pts[idx + 1].x) == 0
                        ? "col-resize"
                        : "row-resize";
                  }
                }
              }
            }

            if (cursor != null) {
              state.setCursor(cursor);
            }
          }
        }
      }
    }
  };
}
