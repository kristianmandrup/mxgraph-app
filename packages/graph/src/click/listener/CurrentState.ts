import { BaseListener } from "./BaseListener";

export class CurrentState extends BaseListener {
  update = (me) => {
    const { graph } = this;

    var tmp = me.sourceState;

    // Gets topmost intersecting cell with link
    if (tmp == null || graph.getLinkForCell(tmp.cell) == null) {
      var cell = graph.getCellAt(
        me.getGraphX(),
        me.getGraphY(),
        null,
        null,
        null,
        function (state, _x, _y) {
          return graph.getLinkForCell(state.cell) == null;
        }
      );

      tmp = graph.view.getState(cell);
    }

    if (tmp != this.currentState) {
      if (this.currentState != null) {
        this.clear();
      }

      this.currentState = tmp;

      if (this.currentState != null) {
        this.activate(this.currentState);
      }
    }
  };
}
