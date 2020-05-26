import { BaseListener } from "./BaseListener";

export class Clear extends BaseListener {
  handler = () => {
    const { graph, cursor } = this;
    if (graph.container != null) {
      graph.container.style.cursor = cursor;
    }

    this.currentState = null;
    this.currentLink = null;

    if (this.highlight != null) {
      this.highlight.hide();
    }

    if (graph.tooltipHandler != null) {
      graph.tooltipHandler.hide();
    }
  };
}
