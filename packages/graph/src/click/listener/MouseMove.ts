import { BaseListener } from "./BaseListener";

export class MouseMove extends BaseListener {
  handler = (_sender, me) => {
    const { graph, ctx } = this;
    if (graph.isMouseDown) {
      if (this.currentLink != null) {
        var dx = Math.abs(ctx.startX - me.getGraphX());
        var dy = Math.abs(ctx.startY - me.getGraphY());

        if (dx > tol || dy > tol) {
          this.clear();
        }
      }
    } else {
      // Checks for parent link
      var linkNode = me.getSource();

      while (linkNode != null && linkNode.nodeName.toLowerCase() != "a") {
        linkNode = linkNode.parentNode;
      }

      if (linkNode != null) {
        this.clear();
      } else {
        if (
          graph.tooltipHandler != null &&
          this.currentLink != null &&
          this.currentState != null
        ) {
          graph.tooltipHandler.reset(me, true, this.currentState);
        }

        if (
          this.currentState != null &&
          (me.getState() == this.currentState || me.sourceState == null) &&
          graph.intersects(this.currentState, me.getGraphX(), me.getGraphY())
        ) {
          return;
        }

        this.updateCurrentState(me);
      }
    }
  };
}
