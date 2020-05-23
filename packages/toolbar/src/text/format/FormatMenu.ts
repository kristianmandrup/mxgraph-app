import { ToolbarMenuAdder } from "../ToolbarMenuAdder";

export class FormatMenu extends ToolbarMenuAdder {
  create() {
    var formatMenu = this.addMenuFunction(
      "",
      mxResources.get("format"),
      false,
      (menu) => {
        let elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("subscript").funct,
          null,
          "geIcon geSprite geSprite-subscript",
        );
        elt.setAttribute(
          "title",
          mxResources.get("subscript") + " (" + this.ctrlKey + "+,)",
        );

        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("superscript").funct,
          null,
          "geIcon geSprite geSprite-superscript",
        );
        elt.setAttribute(
          "title",
          mxResources.get("superscript") + " (" + this.ctrlKey + "+.)",
        );

        // KNOWN: IE+FF don't return keyboard focus after color dialog (calling focus doesn't help)
        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("fontColor").funct,
          null,
          "geIcon geSprite geSprite-fontcolor",
        );
        elt.setAttribute("title", mxResources.get("fontColor"));

        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("backgroundColor").funct,
          null,
          "geIcon geSprite geSprite-fontbackground",
        );
        elt.setAttribute("title", mxResources.get("backgroundColor"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("removeformat", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-removeformat",
        );
        elt.setAttribute("title", mxResources.get("removeFormat"));
      },
    );

    formatMenu.style.position = "relative";
    formatMenu.style.whiteSpace = "nowrap";
    formatMenu.style.overflow = "hidden";
    formatMenu.innerHTML =
      '<div class="geSprite geSprite-dots" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    formatMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";
    return formatMenu;
  }
}
