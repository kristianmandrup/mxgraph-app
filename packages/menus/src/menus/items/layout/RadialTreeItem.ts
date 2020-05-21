import { MenuItemAdder } from "../MenuItemAdder";
import mx from "@mxgraph-app/mx";
const { mxResources, mxRadialTreeLayout } = mx;

export class RadialTreeItem extends MenuItemAdder {
  add() {
    const { graph } = this;
    this.addItem(
      mxResources.get("radialTree"),
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
          var layout: any = new mxRadialTreeLayout(graph);
          layout.levelDistance = 80;
          layout.autoRadius = true;

          this.promptSpacing(layout.levelDistance, (newValue) => {
            layout.levelDistance = newValue;

            this.editorUi.executeLayout(function () {
              layout.execute(graph.getDefaultParent(), tmp);

              if (!graph.isSelectionEmpty()) {
                tmp = graph.getModel().getParent(tmp);

                if (graph.getModel().isVertex(tmp)) {
                  graph.updateGroupBounds([tmp], graph.gridSize * 2, true);
                }
              }
            }, true);
          });
        }
      },
      parent
    );
  }
}
