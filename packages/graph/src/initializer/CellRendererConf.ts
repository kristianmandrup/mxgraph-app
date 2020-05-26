import mx from "@mxgraph-app/mx";
const { mxCellRenderer, mxUtils } = mx;

export class CellRendererConfig {
  cellRenderer: any;

  config() {
    // HTML entities are displayed as plain text in wrapped plain text labels
    this.cellRenderer.getLabelValue = (state) => {
      var result = mxCellRenderer.prototype.getLabelValue.apply(this, [state]);

      if (state.view.graph.isHtmlLabel(state.cell)) {
        if (state.style["html"] != 1) {
          result = mxUtils.htmlEntities(result, false);
        } else {
          result = state.view.graph.sanitizeHtml(result);
        }
      }

      return result;
    };
  }
}
