import { MenuItemAdder } from "../MenuItemAdder";
import mx from "@mxgraph-app/mx";
const { mxResources, mxFastOrganicLayout } = mx;

export class OrganicItem extends MenuItemAdder {
  add() {
    const { graph } = this;
    this.addItem(
      mxResources.get("organic"),
      null,
      () => {
        var layout = new mxFastOrganicLayout(graph);

        this.promptSpacing(layout.forceConstant, (newValue) => {
          layout.forceConstant = newValue;

          this.editorUi.executeLayout(function () {
            var tmp = graph.getSelectionCell();

            if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
              tmp = graph.getDefaultParent();
            }

            layout.execute(tmp);

            if (graph.getModel().isVertex(tmp)) {
              graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
            }
          }, true);
        });
      },
      parent
    );
  }
}
