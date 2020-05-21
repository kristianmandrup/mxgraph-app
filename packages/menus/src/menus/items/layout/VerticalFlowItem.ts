import mx from "@mxgraph-app/mx";
import { MenuItemAdder } from "../MenuItemAdder";
const { mxResources, mxConstants, mxHierarchicalLayout } = mx;

export class VerticalFlowItem extends MenuItemAdder {
  add() {
    const { graph } = this;
    this.addItem(
      mxResources.get("verticalFlow"),
      null,
      () => {
        var layout = new mxHierarchicalLayout(
          graph,
          mxConstants.DIRECTION_NORTH
        );

        this.editorUi.executeLayout(function () {
          var selectionCells = graph.getSelectionCells();
          layout.execute(
            graph.getDefaultParent(),
            selectionCells.length == 0 ? null : selectionCells
          );
        }, true);
      },
      parent
    );
  }
}
