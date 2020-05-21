import { FilenameDialog } from "../../_imports";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

export class MenuItemAdder {
  editorUi: any;
  menu: any;
  graph: any;

  constructor(menu) {
    this.menu = menu;
  }

  addItem(item: any, submenu, fn, node) {
    this.menu.addItem(item, submenu, fn, node);
  }

  promptSpacing = (defaultValue, fn) => {
    var dlg: any = new FilenameDialog(
      this.editorUi,
      defaultValue,
      mxResources.get("apply"),
      (newValue) => {
        fn(parseFloat(newValue));
      },
      mxResources.get("spacing")
    );
    this.editorUi.showDialog(dlg.container, 300, 80, true, true);
    dlg.init();
  };
}
