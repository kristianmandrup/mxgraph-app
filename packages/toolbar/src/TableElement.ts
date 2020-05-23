import { FilenameDialog } from "@mxgraph-app/dialogs";
export class TableElement {
  create() {
    // KNOWN: All table stuff does not work with undo/redo
    // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
    // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
    var elt = this.addMenuFunction(
      "geIcon geSprite geSprite-table",
      mxResources.get("table"),
      false,
      (menu) => {
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

          elt = menu.addItem(
            "",
            null,
            () => {
              try {
                graph.selectNode(
                  graph.insertColumn(table, cell != null ? cell.cellIndex : 0),
                );
              } catch (e) {
                this.editorUi.handleError(e);
              }
            },
            null,
            "geIcon geSprite geSprite-insertcolumnbefore",
          );
          elt.setAttribute("title", mxResources.get("insertColumnBefore"));

          elt = menu.addItem(
            "",
            null,
            () => {
              try {
                graph.selectNode(
                  graph.insertColumn(
                    table,
                    cell != null ? cell.cellIndex + 1 : -1,
                  ),
                );
              } catch (e) {
                this.editorUi.handleError(e);
              }
            },
            null,
            "geIcon geSprite geSprite-insertcolumnafter",
          );
          elt.setAttribute("title", mxResources.get("insertColumnAfter"));

          elt = menu.addItem(
            "Delete column",
            null,
            () => {
              if (cell != null) {
                try {
                  graph.deleteColumn(table, cell.cellIndex);
                } catch (e) {
                  this.editorUi.handleError(e);
                }
              }
            },
            null,
            "geIcon geSprite geSprite-deletecolumn",
          );
          elt.setAttribute("title", mxResources.get("deleteColumn"));

          elt = menu.addItem(
            "",
            null,
            () => {
              try {
                graph.selectNode(graph.insertRow(table, row.sectionRowIndex));
              } catch (e) {
                this.editorUi.handleError(e);
              }
            },
            null,
            "geIcon geSprite geSprite-insertrowbefore",
          );
          elt.setAttribute("title", mxResources.get("insertRowBefore"));

          elt = menu.addItem(
            "",
            null,
            () => {
              try {
                graph.selectNode(
                  graph.insertRow(table, row.sectionRowIndex + 1),
                );
              } catch (e) {
                this.editorUi.handleError(e);
              }
            },
            null,
            "geIcon geSprite geSprite-insertrowafter",
          );
          elt.setAttribute("title", mxResources.get("insertRowAfter"));

          elt = menu.addItem(
            "",
            null,
            () => {
              try {
                graph.deleteRow(table, row.sectionRowIndex);
              } catch (e) {
                this.editorUi.handleError(e);
              }
            },
            null,
            "geIcon geSprite geSprite-deleterow",
          );
          elt.setAttribute("title", mxResources.get("deleteRow"));

          elt = menu.addItem(
            "",
            null,
            () => {
              // Converts rgb(r,g,b) values
              var color = table.style.borderColor.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function (_$0, $1, $2, $3) {
                  return (
                    "#" +
                    ("0" + Number($1).toString(16)).substr(-2) +
                    ("0" + Number($2).toString(16)).substr(-2) +
                    ("0" + Number($3).toString(16)).substr(-2)
                  );
                },
              );
              this.editorUi.pickColor(color, function (newColor) {
                if (newColor == null || newColor == mxConstants.NONE) {
                  table.removeAttribute("border");
                  table.style.border = "";
                  table.style.borderCollapse = "";
                } else {
                  table.setAttribute("border", "1");
                  table.style.border = "1px solid " + newColor;
                  table.style.borderCollapse = "collapse";
                }
              });
            },
            null,
            "geIcon geSprite geSprite-strokecolor",
          );
          elt.setAttribute("title", mxResources.get("borderColor"));

          elt = menu.addItem(
            "",
            null,
            () => {
              // Converts rgb(r,g,b) values
              var color = table.style.backgroundColor.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                (_$0, $1, $2, $3) => {
                  return (
                    "#" +
                    ("0" + Number($1).toString(16)).substr(-2) +
                    ("0" + Number($2).toString(16)).substr(-2) +
                    ("0" + Number($3).toString(16)).substr(-2)
                  );
                },
              );
              this.editorUi.pickColor(color, (newColor) => {
                if (newColor == null || newColor == mxConstants.NONE) {
                  table.style.backgroundColor = "";
                } else {
                  table.style.backgroundColor = newColor;
                }
              });
            },
            null,
            "geIcon geSprite geSprite-fillcolor",
          );
          elt.setAttribute("title", mxResources.get("backgroundColor"));

          elt = menu.addItem(
            "",
            null,
            () => {
              var value = table.getAttribute("cellPadding") || 0;

              var dlg = new FilenameDialog(
                this.editorUi,
                value,
                mxResources.get("apply"),
                (newValue) => {
                  if (newValue != null && newValue.length > 0) {
                    table.setAttribute("cellPadding", newValue);
                  } else {
                    table.removeAttribute("cellPadding");
                  }
                },
                mxResources.get("spacing"),
              );
              this.editorUi.showDialog(dlg.container, 300, 80, true, true);
              dlg.init();
            },
            null,
            "geIcon geSprite geSprite-fit",
          );
          elt.setAttribute("title", mxResources.get("spacing"));

          elt = menu.addItem(
            "",
            null,
            () => {
              table.setAttribute("align", "left");
            },
            null,
            "geIcon geSprite geSprite-left",
          );
          elt.setAttribute("title", mxResources.get("left"));

          elt = menu.addItem(
            "",
            null,
            () => {
              table.setAttribute("align", "center");
            },
            null,
            "geIcon geSprite geSprite-center",
          );
          elt.setAttribute("title", mxResources.get("center"));

          elt = menu.addItem(
            "",
            null,
            () => {
              table.setAttribute("align", "right");
            },
            null,
            "geIcon geSprite geSprite-right",
          );
          elt.setAttribute("title", mxResources.get("right"));
        }
      },
    );

    elt.style.position = "relative";
    elt.style.whiteSpace = "nowrap";
    elt.style.overflow = "hidden";
    elt.innerHTML =
      '<div class="geSprite geSprite-table" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    elt.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";

    // Fix for item size in kennedy theme
    if (EditorUI.compactUi) {
      elt.getElementsByTagName("img")[0].style.left = "22px";
      elt.getElementsByTagName("img")[0].style.top = "5px";
    }
  }
}
