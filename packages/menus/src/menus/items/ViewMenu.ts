import { Menu, MenuAdder } from "@mxgraph-app/menus";

export class ViewMenu extends MenuAdder {
  add() {
    this.put(
      "view",
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          (this.editorUi.format != null ? ["formatPanel"] : []).concat(
            [
              "outline",
              "layers",
              "-",
              "pageView",
              "pageScale",
              "-",
              "scrollbars",
              "tooltips",
              "-",
              "grid",
              "guides",
              "-",
              "connectionArrows",
              "connectionPoints",
              "-",
              "resetView",
              "zoomIn",
              "zoomOut",
            ],
            parent
          )
        );
      })
    );
  }
}
