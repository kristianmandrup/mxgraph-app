export class ToolbarFormatButtons {
  addAll() {
    this.addBtns();
    this.addBtns1();
    this.addBtns2();
    this.addBtns3();
  }

  addBtns() {
    var insertBtns = this.editorUi.toolbar.addItems(
      ["link", "image"],
      insertPanel,
      true
    );
    this.styleButtons(insertBtns);
  }

  addBtns1() {
    const btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-horizontalrule",
        mxResources.get("insertHorizontalRule"),
        function () {
          document.execCommand("inserthorizontalrule", false);
        },
        insertPanel
      ),
      this.editorUi.toolbar.addMenuFunctionInContainer(
        insertPanel,
        "geSprite-table",
        mxResources.get("table"),
        false,
        (menu) => {
          this.editorUi.menus.addInsertTableItem(menu);
        }
      ),
    ];

    this.styleButtons(btns);
    return this;
  }

  addBtns2() {
    const btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-insertcolumnbefore",
        mxResources.get("insertColumnBefore"),
        () => {
          try {
            if (currentTable != null) {
              graph.insertColumn(
                currentTable,
                tableCell != null ? tableCell.cellIndex : 0
              );
            }
          } catch (e) {
            this.editorUi.handleError(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-insertcolumnafter",
        mxResources.get("insertColumnAfter"),
        () => {
          try {
            if (currentTable != null) {
              graph.insertColumn(
                currentTable,
                tableCell != null ? tableCell.cellIndex + 1 : -1
              );
            }
          } catch (e) {
            this.editorUi.handleError(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-deletecolumn",
        mxResources.get("deleteColumn"),
        () => {
          try {
            if (currentTable != null && tableCell != null) {
              graph.deleteColumn(currentTable, tableCell.cellIndex);
            }
          } catch (e) {
            this.editorUi.handleError(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-insertrowbefore",
        mxResources.get("insertRowBefore"),
        () => {
          try {
            if (currentTable != null && tableRow != null) {
              graph.insertRow(currentTable, tableRow.sectionRowIndex);
            }
          } catch (e) {
            this.editorUi.handleError(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-insertrowafter",
        mxResources.get("insertRowAfter"),
        () => {
          try {
            if (currentTable != null && tableRow != null) {
              graph.insertRow(currentTable, tableRow.sectionRowIndex + 1);
            }
          } catch (e) {
            this.editorUi.handleError(e);
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-deleterow",
        mxResources.get("deleteRow"),
        () => {
          try {
            if (currentTable != null && tableRow != null) {
              graph.deleteRow(currentTable, tableRow.sectionRowIndex);
            }
          } catch (e) {
            this.editorUi.handleError(e);
          }
        },
        tablePanel
      ),
    ];
    this.styleButtons(btns);
    btns[2].style.marginRight = "9px";
    return this;
  }

  addBtns3() {
    var btns = [
      this.editorUi.toolbar.addButton(
        "geSprite-strokecolor",
        mxResources.get("borderColor"),
        (evt) => {
          if (currentTable != null) {
            // Converts rgb(r,g,b) values
            var color = currentTable.style.borderColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function (_$0, $1, $2, $3) {
                return (
                  "#" +
                  ("0" + Number($1).toString(16)).substr(-2) +
                  ("0" + Number($2).toString(16)).substr(-2) +
                  ("0" + Number($3).toString(16)).substr(-2)
                );
              }
            );
            this.editorUi.pickColor(color, function (newColor) {
              var targetElt =
                tableCell != null && (evt == null || !mxEvent.isShiftDown(evt))
                  ? tableCell
                  : currentTable;

              graph.processElements(targetElt, function (elt) {
                elt.style.border = null;
              });

              if (newColor == null || newColor == mxConstants.NONE) {
                targetElt.removeAttribute("border");
                targetElt.style.border = "";
                targetElt.style.borderCollapse = "";
              } else {
                targetElt.setAttribute("border", "1");
                targetElt.style.border = "1px solid " + newColor;
                targetElt.style.borderCollapse = "collapse";
              }
            });
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-fillcolor",
        mxResources.get("backgroundColor"),
        (evt) => {
          // Converts rgb(r,g,b) values
          if (currentTable != null) {
            var color = currentTable.style.backgroundColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function (_$0, $1, $2, $3) {
                return (
                  "#" +
                  ("0" + Number($1).toString(16)).substr(-2) +
                  ("0" + Number($2).toString(16)).substr(-2) +
                  ("0" + Number($3).toString(16)).substr(-2)
                );
              }
            );
            this.editorUi.pickColor(color, function (newColor) {
              var targetElt =
                tableCell != null && (evt == null || !mxEvent.isShiftDown(evt))
                  ? tableCell
                  : currentTable;

              graph.processElements(targetElt, function (elt) {
                elt.style.backgroundColor = null;
              });

              if (newColor == null || newColor == mxConstants.NONE) {
                targetElt.style.backgroundColor = "";
              } else {
                targetElt.style.backgroundColor = newColor;
              }
            });
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-fit",
        mxResources.get("spacing"),
        function () {
          if (currentTable != null) {
            var value = currentTable.getAttribute("cellPadding") || 0;

            var dlg = new FilenameDialog(
              ui,
              value,
              mxResources.get("apply"),
              (newValue) => {
                if (newValue != null && newValue.length > 0) {
                  currentTable.setAttribute("cellPadding", newValue);
                } else {
                  currentTable.removeAttribute("cellPadding");
                }
              },
              mxResources.get("spacing")
            );
            ui.showDialog(dlg.container, 300, 80, true, true);
            dlg.init();
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-left",
        mxResources.get("left"),
        function () {
          if (currentTable != null) {
            currentTable.setAttribute("align", "left");
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-center",
        mxResources.get("center"),
        () => {
          if (currentTable != null) {
            currentTable.setAttribute("align", "center");
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        "geSprite-right",
        mxResources.get("right"),
        () => {
          if (currentTable != null) {
            currentTable.setAttribute("align", "right");
          }
        },
        tablePanel2
      ),
    ];
    this.styleButtons(btns);
    btns[2].style.marginRight = "9px";
    return this;
  }
}
