import { MenuItems } from "../menus/MenuItems";

export class MenuInitializer {
  editorUi: any;
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

  constructor(editorUi: any, menuItems?: MenuItems) {
    this.editorUi = editorUi;
    this.menuItems = menuItems || this.createMenuItems();
  }

  createMenuItems() {
    return new MenuItems();
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
