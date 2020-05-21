import { Menu, MenuAdder } from "@mxgraph-app/menus";

export class EditMenu extends MenuAdder {
  add() {
    this.put(
      "edit",
      new Menu((menu, _parent) => {
        this.addMenuItems(menu, this.menuItems);
      })
    );
  }

  get menuItems() {
    return [
      "undo",
      "redo",
      "-",
      "cut",
      "copy",
      "paste",
      "delete",
      "-",
      "duplicate",
      "-",
      "editData",
      "editTooltip",
      "editStyle",
      "-",
      "edit",
      "-",
      "editLink",
      "openLink",
      "-",
      "selectVertices",
      "selectEdges",
      "selectAll",
      "selectNone",
      "-",
      "lockUnlock",
    ];
  }
}
