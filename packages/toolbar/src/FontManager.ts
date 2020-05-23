import { FormatMenu } from "./text/format/FormatMenu";
import { AbstractToolbar } from "./AbstractToolbar";
import { SizeMenu } from "./text/size/SizeMenu";

export class FontManager extends AbstractToolbar {
  fontMenu: any;
  sizeMenu: any;

  constructor(editorUi, container) {
    super(editorUi, container);
    this.fontMenu = new FormatMenu(editorUi, container).create();
    this.sizeMenu = new SizeMenu(editorUi, container).create();
  }

  /**
   * Sets the current font name.
   */
  setFontSize(value) {
    if (this.sizeMenu != null) {
      this.sizeMenu.innerHTML =
        '<div style="width:24px;overflow:hidden;display:inline-block;">' +
        value +
        "</div>" +
        this.dropdownImageHtml;
    }
  }
}
