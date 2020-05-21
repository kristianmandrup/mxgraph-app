import {
  ViewZoomMenu,
  ViewPanelsMenu,
  ViewMenu,
  NavigationMenu,
  InsertMenu,
  HelpMenu,
  FormatBlockMenu,
  ExtrasMenu,
  EditMenu,
  DistributeMenu,
  ArrangeMenu,
  LayoutMenu,
  FontSizeMenu,
  FontFamilyMenu,
  DirectionMenu,
  AlignMenu,
} from "./items";

export const menuItems = {
  align: AlignMenu,
  direction: DirectionMenu,
  fontFamily: FontFamilyMenu,
  fontSize: FontSizeMenu,
  layout: LayoutMenu,
  arrange: ArrangeMenu,
  distribute: DistributeMenu,
  edit: EditMenu,
  extras: ExtrasMenu,
  formatBlock: FormatBlockMenu,
  help: HelpMenu,
  insert: InsertMenu,
  navigation: NavigationMenu,
  view: ViewMenu,
  viewPanels: ViewPanelsMenu,
  viewZoom: ViewZoomMenu,
};

export const items = [
  "align",
  "direction",
  "fontFamily",
  "fontSize",
  "layout",
  "arrange",
  "distribute",
  "edit",
  "extras",
  "formatBlock",
  "help",
  "insert",
  "navigation",
  "view",
  "viewPanels",
  "viewZoom",
];

const defaults = {
  menuItems,
  items,
};

type Opts = { items?: string[]; menuItems?: any };

export class MenuItems {
  editorUi: any;
  menus: any;
  items: string[] = defaults.items;
  menuItems = defaults.menuItems;

  constructor(editorUi, menus, opts: Opts = {}) {
    this.editorUi = editorUi;
    this.menus = menus;
    const { items, menuItems } = opts;
    this.menuItems = menuItems || this.menuItems;
    this.items = items || Object.keys(this.menuItems);
  }

  addToMenu() {
    Object.entries(this.menuItems).map(([_name, menuClazz]) => {
      new menuClazz(this.editorUi, { menus: this.menus }).add();
    });
  }
}
