import mx from "@mxgraph-app/mx";
import { Base } from "./Base";
const {
  mxClient,
} = mx;

export class DropdownArrow extends Base {
  compactUi: any; // EditorUI.compactUi
  dropdownImageHtml: any;

  add(
    menu,
    sprite,
    width,
    atlasWidth,
    left,
    top,
    atlasDelta,
    atlasLeft,
  ) {
    atlasDelta = atlasDelta != null ? atlasDelta : 32;
    left = this.compactUi ? left : atlasLeft;

    menu.style.whiteSpace = "nowrap";
    menu.style.overflow = "hidden";
    menu.style.position = "relative";
    menu.innerHTML = '<div class="geSprite ' +
      sprite +
      '" style="margin-left:' +
      left +
      "px;margin-top:" +
      top +
      'px;"></div>' +
      this.dropdownImageHtml;
    menu.style.width = mxClient.IS_QUIRKS
      ? atlasWidth + "px"
      : atlasWidth - atlasDelta + "px";

    if (mxClient.IS_QUIRKS) {
      menu.style.height = this.compactUi ? "24px" : "26px";
    }

    // Fix for item size in kennedy theme
    if (this.compactUi) {
      menu.getElementsByTagName("img")[0].style.left = "24px";
      menu.getElementsByTagName("img")[0].style.top = "5px";
      menu.style.width = mxClient.IS_QUIRKS ? width + "px" : width - 10 + "px";
    }
  }
}
