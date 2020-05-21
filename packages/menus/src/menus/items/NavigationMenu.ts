import { Menu, MenuAdder } from "@mxgraph-app/menus";

export class NavigationMenu extends MenuAdder {
  add() {
    this.put(
      "navigation",
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          [
            "home",
            "-",
            "exitGroup",
            "enterGroup",
            "-",
            "expand",
            "collapse",
            "-",
            "collapsible",
          ],
          parent
        );
      })
    );
  }
}
