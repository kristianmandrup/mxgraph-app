import { ToolbarMenuAdder } from "../ToolbarMenuAdder";
import mx from "@mxgraph-app/mx";
import { defaults } from "@mxgraph-app/menus";
import { FontManager } from "../FontManager";
import { FormatMenu } from "./format/FormatMenu";
import { AlignMenu } from "./align/AlignMenu";
import { TableElement } from "../table/TableElement";
import { InsertMenu } from "./insert/InsertMenu";
const {
  mxResources,
  mxClient,
} = mx;

export class TextToolbar extends ToolbarMenuAdder {
  container: any;
  editorUi: any;
  staticElements = [];
  updateZoom: any;
  edgeShapeMenu: any;
  edgeStyleMenu: any;
  fontMenu: any;
  currentElt: any;
  gestureHandler: any;
  ctrlKey: any; // Editor.ctrlKey

  font = defaults.font;
  fontManager: any;

  constructor(editorUi, container) {
    super(editorUi, container);
    this.fontManager = new FontManager(editorUi, container);
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
  create() {
    const { font, graph } = this;

    var styleElt = this.addMenu(
      "",
      mxResources.get("style"),
      true,
      "formatBlock",
    );
    styleElt.style.position = "relative";
    styleElt.style.whiteSpace = "nowrap";
    styleElt.style.overflow = "hidden";
    styleElt.innerHTML = mxResources.get("style") + this.dropdownImageHtml;

    if (this.compactUi) {
      styleElt.style.paddingRight = "18px";
      styleElt.getElementsByTagName("img")[0].style.right = "1px";
      styleElt.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.fontMenu;

    this.addSeparator();

    this.setFontSize(font.size);

    const { formatMenu, alignMenu, sizeMenu, insertMenu } = this;

    formatMenu;
    alignMenu;
    sizeMenu;
    insertMenu;

    this.addSeparator();

    this.addButton(
      "geIcon geSprite geSprite-code",
      mxResources.get("html"),
      function () {
        graph.cellEditor.toggleViewMode();

        if (
          graph.cellEditor.textarea.innerHTML.length > 0 &&
          (graph.cellEditor.textarea.innerHTML != "&nbsp;" ||
            !graph.cellEditor.clearOnChange)
        ) {
          window.setTimeout(function () {
            document.execCommand("selectAll", false, undefined);
          });
        }
      },
    );

    this.addSeparator();

    this.addSeparator();
    this.createTableElement();
  }

  get insertMenu() {
    return new InsertMenu(this.editorUi, this.container).create();
  }

  get sizeMenu() {
    const { font } = this;
    const sizeMenu = this.addMenu(
      font.size,
      mxResources.get("fontSize"),
      true,
      "fontSize",
    );
    sizeMenu.style.position = "relative";
    sizeMenu.style.whiteSpace = "nowrap";
    sizeMenu.style.overflow = "hidden";
    sizeMenu.style.width = mxClient.IS_QUIRKS ? "44px" : "24px";

    if (this.compactUi) {
      sizeMenu.style.paddingRight = "18px";
      sizeMenu.getElementsByTagName("img")[0].style.right = "1px";
      sizeMenu.getElementsByTagName("img")[0].style.top = "5px";
    }
    return sizeMenu;
  }

  createTableElement() {
    return new TableElement(this.editorUi, this.container).create();
  }

  get formatMenu() {
    return this.createFormatMenu();
  }

  createFormatMenu() {
    return new FormatMenu(this.editorUi, this.container).create();
  }

  get alignMenu() {
    return this.createAlignMenu();
  }

  createAlignMenu() {
    return new AlignMenu(this.editorUi, this.container).create();
  }
}
