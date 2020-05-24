import { ToolbarMenuAdder } from "../ToolbarMenuAdder";
import mx from "@mxgraph-app/mx";
import { MenuHandler } from "./MenuHandler";
const {
  mxResources,
  mxClient,
} = mx;

export class TableElement extends ToolbarMenuAdder {
  create() {
    // KNOWN: All table stuff does not work with undo/redo
    // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
    // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
    var elt = this.addMenuFunction(
      "geIcon geSprite geSprite-table",
      mxResources.get("table"),
      false,
      this.menuFunct,
    );

    elt.style.position = "relative";
    elt.style.whiteSpace = "nowrap";
    elt.style.overflow = "hidden";
    elt.innerHTML =
      '<div class="geSprite geSprite-table" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    elt.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";

    // Fix for item size in kennedy theme
    if (this.compactUi) {
      elt.getElementsByTagName("img")[0].style.left = "22px";
      elt.getElementsByTagName("img")[0].style.top = "5px";
    }
  }

  menuFunct = (menu) => {
    const { graph } = this;
    var elt = graph.getSelectedElement();
    var cell = graph.getParentByNames(
      elt,
      ["TD", "TH"],
      graph.cellEditor.text2,
    );
    var row = graph.getParentByName(elt, "TR", graph.cellEditor.text2);

    if (row == null) {
      // const createTable = (rows, cols) => {
      //   var html = ["<table>"];

      //   for (var i = 0; i < rows; i++) {
      //     html.push("<tr>");

      //     for (var j = 0; j < cols; j++) {
      //       html.push("<td><br></td>");
      //     }

      //     html.push("</tr>");
      //   }

      //   html.push("</table>");

      //   return html.join("");
      // };

      this.editorUi.menus.addInsertTableItem(menu);
    } else {
      var table = graph.getParentByName(
        row,
        "TABLE",
        graph.cellEditor.text2,
      );
      table;
      new MenuHandler(this.editorUi, { menu, table, row, cell, graph });
    }
  };
}
