import { BaseEventer } from "../BaseEventer";

export class Activate extends BaseEventer {
  handler = (state) => {
    const { highlight, graph } = this;
    this.currentLink = graph.getAbsoluteUrl(graph.getLinkForCell(state.cell));

    if (this.currentLink != null) {
      graph.container.style.cursor = "pointer";

      if (highlight) {
        highlight.highlight(state);
      }
    }
  };
}
