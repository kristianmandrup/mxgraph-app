export class BaseMenuAdder {
  menus: any = {};

  constructor(menus: any) {
    this.menus = menus;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  get(name) {
    return this.menus[name];
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  put(name, menu) {
    this.menus[name] = menu;

    return menu;
  }
}
