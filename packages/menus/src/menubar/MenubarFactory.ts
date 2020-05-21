import { Menubar } from "./Menubar";
import mx from "@mxgraph-app/mx";
import { BaseMenuAdder } from "../menus/BaseMenuAdder";
const { mxResources } = mx;

export class MenubarFactory extends BaseMenuAdder {
  editorUi: any;
  container: any;
  documentMode: any;

  defaultMenuItems = ["file", "edit", "view", "arrange", "extras", "help"];

  constructor(editorUi, container, menus?: any) {
    super(menus);
    this.editorUi = editorUi;
    this.container = container;
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  createMenubar(container = this.container) {
    var menubar = new Menubar(this.editorUi, container);
    var menus = this.defaultMenuItems;

    for (var i = 0; i < menus.length; i++) {
      const addMenu = (menu) => {
        const menuResource = mxResources.get(menus[i]);
        var elt = menubar.addMenu(menuResource, () => {
          // Allows extensions of menu.funct
          menu.funct.apply(this, [menu]);
        });
        this.menuCreated(menu, elt);
      };
      addMenu(this.get(menus[i]));
    }

    return menubar;
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  menuCreated(menu, elt, className?) {
    if (elt != null) {
      className = className != null ? className : "geItem";
      const { documentMode } = this;
      menu.addListener("stateChanged", function () {
        elt.enabled = menu.enabled;

        if (!menu.enabled) {
          elt.className = className + " mxDisabled";

          if (documentMode == 8) {
            elt.style.color = "#c3c3c3";
          }
        } else {
          elt.className = className;

          if (documentMode == 8) {
            elt.style.color = "";
          }
        }
      });
    }
  }
}
