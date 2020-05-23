import mx from "@mxgraph-app/mx";
import { ToolbarMenuAdder } from "../../ToolbarMenuAdder";
const {
  mxClient,
  mxResources,
} = mx;

export class InsertMenu extends ToolbarMenuAdder {
  create() {
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
    if (this.compactUi) {
      insertMenu.getElementsByTagName("img")[0].style.left = "24px";
      insertMenu.getElementsByTagName("img")[0].style.top = "5px";
      insertMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";
    }
  }
}
