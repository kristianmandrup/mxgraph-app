import { MenuItems } from "../menus/MenuItems";
import { Menus } from "../menus";

export class MenuInitializer {
  editorUi: any;
  menus: Menus;
  // customFonts: any[] = [];
  // customFontSizes: any[] = [];
  // put: any;
  // defaultFonts: any;
  // styleChange: any;
  // promptChange: any;
  // addMenuItems: any;
  // addSubmenu: any;
  // menuStyler: any;
  menuItems: MenuItems;

  constructor(editorUi: any, menus: Menus, menuItems?: MenuItems) {
    this.editorUi = editorUi;
    this.menuItems = menuItems || this.createMenuItems();
    this.menus = menus;
  }

  createMenuItems() {
    return new MenuItems(this.editorUi, this.menus.menus);
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    // var graph = this.editorUi.editor.graph;
    // var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);

    // this.customFonts = [];
    // this.customFontSizes = [];

    // add menus
    this.menuItems.addToMenu();
  }
}
