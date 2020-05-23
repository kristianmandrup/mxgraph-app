import mx from "@mxgraph-app/mx";
import { ToolbarMenuAdder } from "../../ToolbarMenuAdder";
const {
  mxClient,
  mxResources,
} = mx;

export class SizeMenu extends ToolbarMenuAdder {
  create() {
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
}
