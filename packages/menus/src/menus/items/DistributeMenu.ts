import { MenuAdder } from "./MenuAdder";
import { Menu } from "../../Menu";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

export class DistributeMenu extends MenuAdder {
  add() {
    this.put("distribute", new Menu(this.menuFunct));
  }

  menuFunct = (menu, parent) => {
    const { graph } = this;
    menu.addItem(
      mxResources.get("horizontal"),
      null,
      () => {
        graph.distributeCells(true);
      },
      parent
    );
    menu.addItem(
      mxResources.get("vertical"),
      null,
      () => {
        graph.distributeCells(false);
      },
      parent
    );
  };
}
