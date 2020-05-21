import mx from "@mxgraph-app/mx";
import { MenuItems } from ".";
import { InsertTableItem } from "./manager/InsertTableItem";
import { EdgeStyleChange } from "./manager/EdgeStyleChange";
import { BaseMenuAdder } from "./BaseMenuAdder";
const { mxClient } = mx;

/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
export class MenusManager extends BaseMenuAdder {
  editorUi: any;
  menus: any;
  checkmarkImage: any; // Editor.checkmarkImage
  customFonts: any[] = [];
  customFontSizes: any[] = [];
  documentMode: any;

  constructor(editorUi, menus: any) {
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
   * Sets the default font family.
   */
  defaultFont = "Helvetica";

  /**
   * Sets the default font size.
   */
  defaultFontSize = "12";

  /**
   * Sets the default font size.
   */
  defaultMenuItems = ["file", "edit", "view", "arrange", "extras", "help"];

  /**
   * Adds the label menu items to the given menu and parent.
   */
  defaultFonts = [
    "Helvetica",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Lucida Console",
    "Tahoma",
  ];

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    // var graph = this.editorUi.editor.graph;
    // var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);

    // this.customFonts = [];
    // this.customFontSizes = [];

    // TODO: add menus
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
}
