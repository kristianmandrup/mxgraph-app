import { Base } from "./Base";

export class FontManager extends Base {
  /**
   * Sets the current font name.
   */
  setFontName(value) {
    if (this.fontMenu != null) {
      this.fontMenu.innerHTML =
        '<div style="width:60px;overflow:hidden;display:inline-block;">' +
        mxUtils.htmlEntities(value) +
        "</div>" +
        this.dropdownImageHtml;
    }
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
