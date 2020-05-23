import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
// import { EditorUI } from "ui/EditorUI";
// import { MenuManager } from "@mxgraph-app/menus";
import { TextToolbar } from "./TextToolbar";
import { FontManager } from "./FontManager";
import { DropdownArrow } from "./DropDownArrow";
const { IMAGE_PATH } = resources;
const {
  mxPopupMenu,
  mxConstants,
  mxUtils,
  mxEvent,
  mxResources,
  mxClient,
} = mx;

const EditorUI: any = {};
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new toolbar for the given editor.
 */
export class Toolbar {
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
    this.editorUi = editorUi;
    this.container = container;
    this.init();

    mxEvent.addGestureListeners(document, this.gestureHandler, null, null);
    this.fontManager = new FontManager(editorUi, container);
    this.dropdownArrow = new DropdownArrow(this.editorUi, this.container);
  }

  /**
   * Adds the toolbar elements.
   */
  init() {}

  /**
   * Adds the toolbar elements.
   */
  addDropDownArrow(
    menu,
    sprite,
    width,
    atlasWidth,
    left,
    top,
    atlasDelta,
    atlasLeft,
  ) {
    this.dropdownArrow.add(
      menu,
      sprite,
      width,
      atlasWidth,
      left,
      top,
      atlasDelta,
      atlasLeft,
    );
  }

  setFontName(value) {
    this.fontManager.setFontName(value);
  }

  setFontSize(value) {
    this.fontManager.setFontSize(value);
  }

  /**
   * Hides the current menu.
   */
  createTextToolbar() {
    return new TextToolbar().create();
  }

  /**
   * Hides the current menu.
   */
  hideMenu() {
    this.editorUi.hideCurrentMenu();
  }

  /**
   * Adds a button to the toolbar.
   */
  addButton(classname, tooltip, funct, c?) {
    var elt = this.createButton(classname);
    c = c != null ? c : this.container;

    this.initElement(elt, tooltip);
    this.addClickHandler(elt, funct);
    c.appendChild(elt);

    return elt;
  }

  /**
   * Initializes the given toolbar element.
   */
  initElement(elt, tooltip) {
    // Adds tooltip
    if (tooltip != null) {
      elt.setAttribute("title", tooltip);
    }

    this.addEnabledState(elt);
  }

  /**
   * Adds enabled state with setter to DOM node (avoids JS wrapper).
   */
  addEnabledState(elt) {
    var classname = elt.className;

    elt.setEnabled = (value) => {
      elt.enabled = value;

      if (value) {
        elt.className = classname;
      } else {
        elt.className = classname + " mxDisabled";
      }
    };

    elt.setEnabled(true);
  }

  /**
   * Adds enabled state with setter to DOM node (avoids JS wrapper).
   */
  addClickHandler(elt, funct) {
    if (funct != null) {
      mxEvent.addListener(elt, "click", function (evt) {
        if (elt.enabled) {
          funct(evt);
        }

        mxEvent.consume(evt);
      });

      // Prevents focus
      mxEvent.addListener(
        elt,
        mxClient.IS_POINTER ? "pointerdown" : "mousedown",
        (evt) => {
          evt.preventDefault();
        },
      );
    }
  }

  /**
   * Creates and returns a new button.
   */
  createButton(classname) {
    var elt = document.createElement("a");
    elt.className = "geButton";

    var inner = document.createElement("div");

    if (classname != null) {
      inner.className = "geSprite " + classname;
    }

    elt.appendChild(inner);

    return elt;
  }

  /**
   * Creates and returns a new button.
   */
  createLabel(label, _tooltip?) {
    var elt = document.createElement("a");
    elt.className = "geLabel";
    mxUtils.write(elt, label);

    return elt;
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
