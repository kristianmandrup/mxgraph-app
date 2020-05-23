import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
import { AbstractInitializer } from "./AbstractInitializer";
import { ToolbarSetup } from "./setup/ToolbarSetup";
import { InitTableElement } from "./InitTableElement";
// import { EditorUI } from "ui/EditorUI";
const { urlParams } = resources;
const { mxEvent } = mx;

const EditorUI: any = {};

export class ToolbarInitializer extends AbstractInitializer {
  container: any;
  editorUi: any;
  staticElements = [];
  // updateZoom: any;
  edgeShapeMenu: any;
  edgeStyleMenu: any;
  fontMenu: any;
  sizeMenu: any;
  currentElt: any;
  gestureHandler: any;

  dropdownImageHtml: any;

  addDropDownArrow: any; // fn
  addMenu: any; // fn
  addSeparator: any; // fn
  addItems: any; // fn
  addMenuFunction: any; // fn

  init() {
    this.initialPageSetup();

    this.addListeners();

    this.zoomElts;
    this.undoElts;

    this.createToolbarSetup().configureItems();

    this.addSeparator();
    this.insertMenu;

    this.createTableElement();

    if (urlParams["dev"] == "1") {
      this.addSeparator();
    }
  }

  createTableElement() {
    return new InitTableElement(this.editorUi, this.container).create();
  }

  initialPageSetup() {
    const { sw, formatMenu } = this;
    if (sw >= 700) {
      this.addDropDownArrow(
        formatMenu,
        "geSprite-formatpanel",
        38,
        50,
        -4,
        -3,
        36,
        -8,
      );
      this.addSeparator();
    }
    if (sw >= 420) {
      this.addSeparator();
    }
  }

  addListeners() {
    this.editorUi.editor.graph.view.addListener(mxEvent.SCALE, this.updateZoom);
    this.editorUi.editor.addListener("resetGraphView", this.updateZoom);
  }

  // Updates the label if the scale changes
  updateZoom = () => {
    const { viewMenu } = this;
    viewMenu.innerHTML =
      Math.round(this.editorUi.editor.graph.view.scale * 100) +
      "%" +
      this.dropdownImageHtml;

    if (EditorUI.compactUi) {
      viewMenu.getElementsByTagName("img")[0].style.right = "1px";
      viewMenu.getElementsByTagName("img")[0].style.top = "5px";
    }
  };

  createToolbarSetup() {
    return new ToolbarSetup(this.editorUi, this.container);
  }
}
