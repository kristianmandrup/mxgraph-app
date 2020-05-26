import { BaseListener } from "./BaseListener";

export class MouseDown extends BaseListener {
  handler = (_sender, me) => {
    const { ctx, graph, currentLink } = this;

    ctx.startX = me.getGraphX();
    ctx.startY = me.getGraphY();
    ctx.scrollLeft = graph.container.scrollLeft;
    ctx.scrollTop = graph.container.scrollTop;

    if (currentLink == null && graph.container.style.overflow == "auto") {
      graph.container.style.cursor = "move";
    }

    this.updateCurrentState(me);
  };
}
