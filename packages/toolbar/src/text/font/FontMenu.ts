import mx from "@mxgraph-app/mx";
import { ToolbarMenuAdder } from "../../ToolbarMenuAdder";
const {
  mxClient,
  mxResources,
} = mx;

export class FontMenu extends ToolbarMenuAdder {
  create() {
    const { font } = this;
    const fontMenu = this.addMenu(
      "",
      mxResources.get("fontFamily"),
      true,
      "fontFamily",
    );
    fontMenu.style.position = "relative";
    fontMenu.style.whiteSpace = "nowrap";
    fontMenu.style.overflow = "hidden";
    fontMenu.style.width = mxClient.IS_QUIRKS ? "80px" : "60px";

    this.setFontName(font.family);

    if (this.compactUi) {
      fontMenu.style.paddingRight = "18px";
      fontMenu.getElementsByTagName("img")[0].style.right = "1px";
      fontMenu.getElementsByTagName("img")[0].style.top = "5px";
    }
    return fontMenu;
  }

  setFontName(value) {
    this.fontManager.setFontName(value);
  }
}
