import { Menu, MenuAdder } from "@mxgraph-app/menus";

export class ExtrasMenu extends MenuAdder {
  add() {
    this.put(
      "extras",
      new Menu((menu, _parent) => {
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
