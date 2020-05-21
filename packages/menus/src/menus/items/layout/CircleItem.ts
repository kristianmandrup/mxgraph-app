import { MenuItemAdder } from "../MenuItemAdder";
import mx from "@mxgraph-app/mx";
const { mxResources, mxCircleLayout } = mx;

export class CircleItem extends MenuItemAdder {
  add() {
    const { graph } = this;
    this.addItem(
      mxResources.get("circle"),
      null,
      () => {
        var layout = new mxCircleLayout(graph);

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
      },
      parent
    );
  }
}
