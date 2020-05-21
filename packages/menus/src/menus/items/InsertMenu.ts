import { Menu, MenuAdder } from "@mxgraph-app/menus";

export class InsertMenu extends MenuAdder {
  add() {
    this.put(
      "insert",
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ["insertLink", "insertImage"], parent);
      })
    );
  }
}
