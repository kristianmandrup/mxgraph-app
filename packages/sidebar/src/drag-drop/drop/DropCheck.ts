import { DropBase } from "../drag/drop-target/DropBase";
import mx from "@mxgraph-app/mx";
const { mxUtils, mxConstants } = mx;

export class DropCheck extends DropBase {
  editorUi: any;

  constructor(editorUi) {
    super(editorUi);
  }
  /**
   * Limits drop style to non-transparent source shapes.
   */
  isDropStyleEnabled(cells, firstVertex) {
    const { graph } = this;
    var result = true;

    if (firstVertex != null && cells.length == 1) {
      var vstyle = graph.getCellStyle(cells[firstVertex]);

      if (vstyle != null) {
        result =
          mxUtils.getValue(
            vstyle,
            mxConstants.STYLE_STROKECOLOR,
            mxConstants.NONE
          ) != mxConstants.NONE ||
          mxUtils.getValue(
            vstyle,
            mxConstants.STYLE_FILLCOLOR,
            mxConstants.NONE
          ) != mxConstants.NONE;
      }
    }

    return result;
  }

  /**
   * Ignores swimlanes as drop style targets.
   */
  isDropStyleTargetIgnored(state) {
    return this.graph.isSwimlane(state.cell);
  }
}
