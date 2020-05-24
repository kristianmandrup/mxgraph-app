import mx from "@mxgraph-app/mx";
import { TextToolbar } from "./text/TextToolbar";
import { ToolbarMenuAdder } from "./ToolbarMenuAdder";
const {
  mxEvent,
} = mx;

/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new toolbar for the given editor.
 */
export class Toolbar extends ToolbarMenuAdder {
  container: any;
  editorUi: any;
  staticElements = [];
  updateZoom: any;
  edgeShapeMenu: any;
  edgeStyleMenu: any;
  fontMenu: any;
  sizeMenu: any;
  currentElt: any;
  gestureHandler: any;
  ctrlKey: any; // Editor.ctrlKey

  fontManager: any;
  dropdownArrow: any;

  constructor(editorUi, container) {
    super(editorUi, container);
    this.init();

    mxEvent.addGestureListeners(document, this.gestureHandler, null, null);
  }

  /**
   * Adds the toolbar elements.
   */
  init() {}

  /**
   * Hides the current menu.
   */
  createTextToolbar() {
    return new TextToolbar(this.editorUi, this.container).create();
  }

  /**
   * Hides the current menu.
   */
  hideMenu() {
    this.editorUi.hideCurrentMenu();
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  destroy() {
    if (this.gestureHandler != null) {
      mxEvent.removeGestureListeners(document, this.gestureHandler, null, null);
      this.gestureHandler = null;
    }
  }
}
