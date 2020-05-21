export class AbstractFontItem {
  menu: any;
  graph: any;
  menuStyler: any;

  constructor(menuStyler, menu, graph) {
    this.menuStyler = menuStyler;
  }

  // from Menus
  styleChange(menu, label, keys, values, sprite, parent, fn?, post?) {
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
}
