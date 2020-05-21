import {
  ViewZoomMenu,
  ViewPanelsMenu,
  ViewMenu,
  NavigationMenu,
  InsertMenu,
  HelpMenu,
} from "./items";

const menuItems = {
  help: HelpMenu,
  insert: InsertMenu,
  navigation: NavigationMenu,
  view: ViewMenu,
  viewPanels: ViewPanelsMenu,
  viewZoom: ViewZoomMenu,
};

const defaults = {
  menuItems,
};

export class MenuItems {
  editorUi: any;
  menus: any;
  menuItems = defaults.menuItems;

  addToMenu() {
    Object.entries(this.menuItems).map(([_name, menuClazz]) => {
      new menuClazz(this.editorUi, { menus: this.menus }).add();
    });
  }
}
