import mx from "@mxgraph-app/mx";
import { MenuItems } from ".";
import { InsertTableItem } from "./manager/InsertTableItem";
import { EdgeStyleChange } from "./manager/EdgeStyleChange";
import { BaseMenuAdder } from "./BaseMenuAdder";
const { mxClient, mxResources, mxUtils } = mx;

/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
export class MenuManager extends BaseMenuAdder {
  editorUi: any;
  menus: any;
  checkmarkImage: any; // Editor.checkmarkImage
  customFonts: any[] = [];
  customFontSizes: any[] = [];
  documentMode: any;

  constructor(editorUi, menus: any = {}) {
    super(menus);
    this.editorUi = editorUi;
    this.init();

    // Pre-fetches checkmark image
    if (!mxClient.IS_SVG) {
      new Image().src = this.checkmarkImage;
    }
  }

  get menuItems() {
    return new MenuItems(this.editorUi, this.menus);
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    this.menuItems.addToMenu();
  }

  /**
   * Adds a menu item to insert a table.
   */
  addInsertTableItem(menu, insertFn) {
    new InsertTableItem(this.editorUi).add(menu, insertFn);
  }

  /**
   * Adds a style change item to the given menu.
   */
  edgeStyleChange(menu, label, keys, values, sprite, parent, reset) {
    new EdgeStyleChange(this.editorUi).add(
      menu,
      label,
      keys,
      values,
      sprite,
      parent,
      reset
    );
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

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addMenu(name, popupMenu, parent) {
    var menu = this.get(name);

    if (menu != null && (popupMenu.showDisabled || menu.isEnabled())) {
      this.get(name).execute(popupMenu, parent);
    }
  }

  /**
   * Adds the given submenu.
   */
  addSubmenu(name, menu, parent, label = name) {
    var entry = this.get(name);

    if (entry != null) {
      var enabled = entry.isEnabled();

      if (menu.showDisabled || enabled) {
        var submenu = menu.addItem(
          label || mxResources.get(name),
          null,
          null,
          parent,
          null,
          enabled
        );
        this.addMenu(name, menu, submenu);
      }
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addMenuItems(menu, keys, parent, trigger?, sprites?) {
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == "-") {
        menu.addSeparator(parent);
      } else {
        this.addMenuItem(
          menu,
          keys[i],
          parent,
          trigger,
          sprites != null ? sprites[i] : null
        );
      }
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addMenuItem(menu, key, parent, trigger, sprite?, label?) {
    var action = this.editorUi.actions.get(key);

    if (
      action != null &&
      (menu.showDisabled || action.isEnabled()) &&
      action.visible
    ) {
      var item = menu.addItem(
        label || action.label,
        null,
        function () {
          action.funct(trigger);
        },
        parent,
        sprite,
        action.isEnabled()
      );

      // Adds checkmark image
      if (action.toggleAction && action.isSelected()) {
        menu.addCheckmark(item, this.checkmarkImage);
      }

      this.addShortcut(item, action);

      return item;
    }

    return null;
  }

  /**
   * Adds a checkmark to the given menuitem.
   */
  addShortcut(item, action) {
    if (action.shortcut != null) {
      var td = item.firstChild.nextSibling.nextSibling;
      var span = document.createElement("span");
      span.style.color = "gray";
      mxUtils.write(span, action.shortcut);
      td.appendChild(span);
    }
  }
}
