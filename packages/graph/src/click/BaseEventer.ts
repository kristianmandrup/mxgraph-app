import mx from "@mxgraph-app/mx";
const { mxCellHighlight, mxConstants } = mx;

export class BaseEventer {
  highlight: any;
  graph: any;
  currentLink: any;
  currentState: any;

  getHighlight() {
    const { hasHighlight } = this;
    return hasHighlight ? this.createHighlight() : null;
  }

  createHighlight() {
    const { highlight, graph } = this;
    return new mxCellHighlight(graph, highlight, 4);
  }

  get hasHighlight() {
    const { highlight } = this;
    return highlight && highlight != mxConstants.NONE;
  }
}
