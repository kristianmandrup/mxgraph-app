import { MenuItemAdder } from "../MenuItemAdder";
import mx from "@mxgraph-app/mx";
const { mxConstants, mxResources, mxHierarchicalLayout } = mx;

export class HorizontalFlowItem extends MenuItemAdder {
  add() {
    const { graph } = this;
    this.addItem(
      mxResources.get("horizontalFlow"),
      null,
      () => {
        var layout = new mxHierarchicalLayout(
          graph,
          mxConstants.DIRECTION_WEST
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
