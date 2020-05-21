import { MenuItemAdder } from "@mxgraph-app/menus";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

type Flip = {
  name: string;
  direction: string;
};

export class DirectionItem extends MenuItemAdder {
  flip: Flip = {
    name: "",
    direction: "",
  };

  add() {
    const { graph, flip } = this;
    this.addItem(
      mxResources.get(flip.name),
      null,
      function () {
        graph.alignCells(flip.direction);
      },
      parent
    );
  }
}
