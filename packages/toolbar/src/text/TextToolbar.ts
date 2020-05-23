import { ToolbarMenuAdder } from "../ToolbarMenuAdder";
import mx from "@mxgraph-app/mx";
import { defaults } from "@mxgraph-app/menus";
import { FontManager } from "../FontManager";
import { FormatMenu } from "./FormatMenu";
import { AlignMenu } from "./AlignMenu";
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
  sizeMenu: any;
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

    this.fontMenu = this.addMenu(
      "",
      mxResources.get("fontFamily"),
      true,
      "fontFamily",
    );
    this.fontMenu.style.position = "relative";
    this.fontMenu.style.whiteSpace = "nowrap";
    this.fontMenu.style.overflow = "hidden";
    this.fontMenu.style.width = mxClient.IS_QUIRKS ? "80px" : "60px";

    this.setFontName(font.family);

    if (this.compactUi) {
      this.fontMenu.style.paddingRight = "18px";
      this.fontMenu.getElementsByTagName("img")[0].style.right = "1px";
      this.fontMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.sizeMenu = this.addMenu(
      font.size,
      mxResources.get("fontSize"),
      true,
      "fontSize",
    );
    this.sizeMenu.style.position = "relative";
    this.sizeMenu.style.whiteSpace = "nowrap";
    this.sizeMenu.style.overflow = "hidden";
    this.sizeMenu.style.width = mxClient.IS_QUIRKS ? "44px" : "24px";

    this.setFontSize(font.size);

    const { formatMenu, alignMenu } = this;

    if (this.compactUi) {
      this.sizeMenu.style.paddingRight = "18px";
      this.sizeMenu.getElementsByTagName("img")[0].style.right = "1px";
      this.sizeMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    if (EditorUI.compactUi) {
      formatMenu.getElementsByTagName("img")[0].style.left = "22px";
      formatMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.elements.add();

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

    // FIXME: Uses geButton here and geLabel in main menu
    var insertMenu = this.addMenuFunction(
      "",
      mxResources.get("insert"),
      true,
      (menu) => {
        menu.addItem(mxResources.get("insertLink"), null, () => {
          this.editorUi.actions.get("link").funct();
        });

        menu.addItem(mxResources.get("insertImage"), null, () => {
          this.editorUi.actions.get("image").funct();
        });

        menu.addItem(mxResources.get("insertHorizontalRule"), null, () => {
          document.execCommand("inserthorizontalrule", false, undefined);
        });
      },
    );

    insertMenu.style.whiteSpace = "nowrap";
    insertMenu.style.overflow = "hidden";
    insertMenu.style.position = "relative";
    insertMenu.innerHTML =
      '<div class="geSprite geSprite-plus" style="margin-left:-4px;margin-top:-3px;"></div>' +
      this.dropdownImageHtml;
    insertMenu.style.width = mxClient.IS_QUIRKS ? "36px" : "16px";

    // Fix for item size in kennedy theme
    if (EditorUI.compactUi) {
      insertMenu.getElementsByTagName("img")[0].style.left = "24px";
      insertMenu.getElementsByTagName("img")[0].style.top = "5px";
      insertMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";
    }

    this.addSeparator();
    new TableElement.create();
  }

  get formatMenu() {
    return this.createFormatMenu();
  }

  createFormatMenu() {
    return new FormatMenu().create();
  }

  get alignMenu() {
  }

  createFormatMenu() {
    return new AlignMenu().create();
  }
}
