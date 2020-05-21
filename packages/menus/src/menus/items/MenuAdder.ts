import { Menu } from "../../Menu";
import { MenuPrompt } from "../manager";
import { MenuStyler } from "../manager";
import { MenuManager } from "../MenuManager";

export class MenuAdder {
  editorUi: any;
  graph: any;

  menus: MenuManager;
  menuStyler: MenuStyler;
  menuPrompt: MenuPrompt;
  menuItems: any = {};
  menuName = "no name";

  itemLayout: string[] = [];
  isGraphEnabled: boolean = true;

  customFonts: any;
  customFontSizes: any;

  constructor(editorUi, { graph, menus, menuStyler }: any = {}) {
    this.editorUi = editorUi;
    this.graph = graph || editorUi.editor.graph;
    this.menus = menus || this.createMenus();
    this.menuStyler = menuStyler || this.createMenuStyler();
    this.menuPrompt = this.createMenuPrompt();
  }

  createMenuPrompt() {
    return new MenuPrompt(this.editorUi);
  }

  createMenuStyler() {
    return new MenuStyler(this.editorUi);
  }

  createMenus() {
    return new MenuManager(this.editorUi);
  }

  styleChange(menu, label, keys, values, sprite?, parent?, fn?, post?) {
    this.menuStyler.styleChange(
      menu,
      label,
      keys,
      values,
      sprite,
      parent,
      fn,
      post
    );
  }

  // from Menus
  promptChange(menu, label, hint, opts: any = {}) {
    return new MenuPrompt(this.editorUi).promptChange(menu, label, hint, opts);
  }

  put(label: string, menu: any) {
    this.menus.put(label, menu);
  }

  addMenuItems(menu: any, items: any[], node?: any) {
    this.menus.addMenuItems(menu, items, node);
  }

  add() {
    this.put(this.menuName, this.createMenu());
  }

  addSubmenu(label: string, menu: any, node: any) {
    this.menus.addSubmenu(label, menu, node);
  }

  addMenuItem(menu, menuItemClass) {
    new menuItemClass(this.editorUi, this.graph, menu).add();
  }

  createMenu() {
    return new Menu(this.menuFunct);
  }

  menuFunct = (menu, parent) => {
    this.itemLayout.map((name) => {
      if (name == "-") {
        return menu.addSeparator(parent);
      }
      const menuItemClass = this.menuItems[name];
      this.addMenuItem(menu, menuItemClass);
    });

    this.extraItems(menu, parent);
  };

  extraItems(_menu, _parent) {}
}
