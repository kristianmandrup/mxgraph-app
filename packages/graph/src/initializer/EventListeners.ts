import { MouseMove } from "./MouseMove";
import mx from "@mxgraph-app/mx";
const { mxPoint, mxEvent, mxUtils } = mx;

export class EventListeners {
  start: any;
  addListener: any;
  addMouseListener: any;
  graph: any;
  isEnabled: any;
  isCellSelected: any;
  selectionCellsHandler: any;

  addAll(start) {
    this.start = start;
  }

  get model() {
    return this.graph.model;
  }

  fireMouseEvent() {
    const { start } = this;
    // Uses this event to process mouseDown to check the selection state before it is changed
    this.addListener(mxEvent.FIRE_MOUSE_EVENT, (_sender, evt) => {
      if (evt.getProperty("eventName") == "mouseDown" && this.isEnabled()) {
        var me = evt.getProperty("event");

        if (
          !mxEvent.isControlDown(me.getEvent()) &&
          !mxEvent.isShiftDown(me.getEvent())
        ) {
          var state = me.getState();

          if (state != null) {
            // Checks if state was removed in call to stopEditing above
            if (this.model.isEdge(state.cell)) {
              start.point = new mxPoint(me.getGraphX(), me.getGraphY());
              start.selected = this.isCellSelected(state.cell);
              start.state = state;
              start.event = me;

              if (
                state.text != null &&
                state.text.boundingBox != null &&
                mxUtils.contains(
                  state.text.boundingBox,
                  me.getGraphX(),
                  me.getGraphY()
                )
              ) {
                start.handle = mxEvent.LABEL_HANDLE;
              } else {
                var handler = this.selectionCellsHandler.getHandler(state.cell);

                if (
                  handler != null &&
                  handler.bends != null &&
                  handler.bends.length > 0
                ) {
                  start.handle = handler.getHandleForEvent(me);
                }
              }
            }
          }
        }
      }
    });
  }

  mouseEvents() {
    const { mouseDown, mouseMove, mouseUp } = this;
    this.addMouseListener({
      mouseDown,
      mouseMove,
      mouseUp,
    });
  }

  mouseMove = new MouseMove().handler;

  mouseDown = (_sender, _me) => {};

  mouseUp = (_sender, _me) => {
    const { start } = this;
    start.state = null;
    start.event = null;
    start.point = null;
    start.handle = null;
  };
}
