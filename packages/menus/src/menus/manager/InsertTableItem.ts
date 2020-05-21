import mx from "@mxgraph-app/mx";
const { mxClient, mxEvent } = mx;

export class InsertTableItem {
  editorUi: any;

  /**
   * Sets the default font size.
   */
  defaultFontSize = "12";

  constructor(editorUi: any) {
    this.editorUi = editorUi;
  }

  /**
   * Adds a menu item to insert a table.
   */
  add(menu, insertFn) {
    insertFn =
      insertFn != null
        ? insertFn
        : (evt, rows, cols) => {
            var graph = this.editorUi.editor.graph;
            var td = graph.getParentByName(mxEvent.getSource(evt), "TD");

            if (td != null && graph.cellEditor.textarea != null) {
              // var row2 = graph.getParentByName(td, "TR");

              // To find the new link, we create a list of all existing links first
              // LATER: Refactor for reuse with code for finding inserted image below
              var tmp: any = graph.cellEditor.textarea.getElementsByTagName(
                "table"
              );
              var oldTables: any[] = [];

              for (var i = 0; i < tmp.length; i++) {
                oldTables.push(tmp[i]);
              }

              // Finding the new table will work with insertHTML, but IE does not support that
              graph.container.focus();
              graph.pasteHtmlAtCaret(createTable(rows, cols));

              // Moves cursor to first table cell
              var newTables = graph.cellEditor.textarea.getElementsByTagName(
                "table"
              );

              if (newTables.length == oldTables.length + 1) {
                // Inverse order in favor of appended tables
                for (var i = newTables.length - 1; i >= 0; i--) {
                  if (i == 0 || newTables[i] != oldTables[i - 1]) {
                    graph.selectNode(newTables[i].rows[0].cells[0]);
                    break;
                  }
                }
              }
            }
          };

    // KNOWN: Does not work in IE8 standards and quirks
    var graph = this.editorUi.editor.graph;
    var row2: any;
    var td: any;

    function createTable(rows, cols) {
      var html = ["<table>"];

      for (var i = 0; i < rows; i++) {
        html.push("<tr>");

        for (var j = 0; j < cols; j++) {
          html.push("<td><br></td>");
        }

        html.push("</tr>");
      }

      html.push("</table>");

      return html.join("");
    }

    // Show table size dialog
    var elt2 = menu.addItem("", null, (evt) => {
      if (td != null && row2 != null) {
        insertFn(evt, row2.sectionRowIndex + 1, td.cellIndex + 1);
      }
    });

    // Quirks mode does not add cell padding if cell is empty, needs good old spacer solution
    var quirksCellHtml =
      '<img src="' +
      mxClient.imageBasePath +
      "/transparent.gif" +
      '" width="16" height="16"/>';

    function createPicker(rows, cols) {
      var table2 = document.createElement("table");
      table2.setAttribute("border", "1");
      table2.style.borderCollapse = "collapse";

      if (!mxClient.IS_QUIRKS) {
        table2.setAttribute("cellPadding", "8");
      }

      for (var i = 0; i < rows; i++) {
        var row = table2.insertRow(i);

        for (var j = 0; j < cols; j++) {
          var cell = row.insertCell(-1);

          if (mxClient.IS_QUIRKS) {
            cell.innerHTML = quirksCellHtml;
          }
        }
      }

      return table2;
    }

    function extendPicker(picker, rows, cols) {
      for (var i = picker.rows.length; i < rows; i++) {
        var row = picker.insertRow(i);

        for (var j = 0; j < picker.rows[0].cells.length; j++) {
          var cell = row.insertCell(-1);

          if (mxClient.IS_QUIRKS) {
            cell.innerHTML = quirksCellHtml;
          }
        }
      }

      for (var i: any = 0; i < picker.rows.length; i++) {
        var row = picker.rows[i];

        for (var j: number = row.cells.length; j < cols; j++) {
          var cell = row.insertCell(-1);

          if (mxClient.IS_QUIRKS) {
            cell.innerHTML = quirksCellHtml;
          }
        }
      }
    }

    elt2.firstChild.innerHTML = "";
    var picker = createPicker(5, 5);
    elt2.firstChild.appendChild(picker);

    var label = document.createElement("div");
    label.style.padding = "4px";
    label.style.fontSize = this.defaultFontSize + "px";
    label.innerHTML = "1x1";
    elt2.firstChild.appendChild(label);

    mxEvent.addListener(picker, "mouseover", function (e) {
      td = graph.getParentByName(mxEvent.getSource(e), "TD");

      if (td != null) {
        row2 = graph.getParentByName(td, "TR");
        extendPicker(
          picker,
          Math.min(20, row2.sectionRowIndex + 2),
          Math.min(20, td.cellIndex + 2)
        );
        label.innerHTML = td.cellIndex + 1 + "x" + (row2.sectionRowIndex + 1);

        for (var i = 0; i < picker.rows.length; i++) {
          var r = picker.rows[i];

          for (var j = 0; j < r.cells.length; j++) {
            var cell = r.cells[j];

            if (i <= row2.sectionRowIndex && j <= td.cellIndex) {
              cell.style.backgroundColor = "blue";
            } else {
              cell.style.backgroundColor = "white";
            }
          }
        }

        mxEvent.consume(e);
      }
    });
  }
}
