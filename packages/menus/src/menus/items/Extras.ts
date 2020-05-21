import { MenuAdder } from "../MenuAdder";
import { Menu } from "../../Menu";

export class Extras extends MenuAdder {
  add() {
    this.put(
      "extras",
      new Menu((menu, parent) => {
        this.addMenuItems(menu, [
          "copyConnect",
          "collapseExpand",
          "-",
          "editDiagram",
        ]);
      })
    );
  }
}
