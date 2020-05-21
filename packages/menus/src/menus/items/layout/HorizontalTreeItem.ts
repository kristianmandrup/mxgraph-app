import { MenuItemAdder } from "../MenuItemAdder";
import mx from "@mxgraph-app/mx";
const { mxResources, mxCompactTreeLayout } = mx;

export class HorizontalTreeItem extends MenuItemAdder {
  add() {
    const { graph } = this;
    this.addItem(
      mxResources.get("horizontalTree"),
      null,
      () => {
        var tmp = graph.getSelectionCell();
        var roots: any;

        if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
          if (graph.getModel().getEdgeCount(tmp) == 0) {
            roots = graph.findTreeRoots(graph.getDefaultParent());
          }
        } else {
          roots = graph.findTreeRoots(tmp);
        }

        if (roots != null && roots.length > 0) {
          tmp = roots[0];
        }

        if (tmp != null) {
          var layout = new mxCompactTreeLayout(graph, true);
          layout.edgeRouting = false;
          layout.levelDistance = 30;

          this.promptSpacing(layout.levelDistance, (newValue) => {
            layout.levelDistance = newValue;

            this.editorUi.executeLayout(function () {
              layout.execute(graph.getDefaultParent(), tmp);
            }, true);
          });
        }
      },
      parent
    );
  }
}
