import mx from "mx";
import resources from "resources/resources";
import { EditorUI } from "ui/EditorUI";
import { FilenameDialog } from "sample/FilenameDialog";
import { Menus } from "ui/menus/menus/manager/Menus";
const { urlParams, IMAGE_PATH } = resources;
const { mxPopupMenu, mxConstants, mxUtils, mxEvent, mxResources, mxClient } =
  mx;
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new toolbar for the given editor.
 */
export class Toolbar {
  container: any;
  editorUi: any;
  staticElements = [];
  updateZoom: any;
  edgeShapeMenu: any;
  edgeStyleMenu: any;
  fontMenu: any;
  sizeMenu: any;
  currentElt: any;
  gestureHandler: any;

  constructor(editorUi, container) {
    this.editorUi = editorUi;
    this.container = container;
    this.init();

    // Global handler to hide the current menu
    this.gestureHandler = (evt) => {
      if (
        this.editorUi.currentMenu != null &&
        mxEvent.getSource(evt) != this.editorUi.currentMenu.div
      ) {
        this.hideMenu();
      }
    };

    mxEvent.addGestureListeners(document, this.gestureHandler, null, null);
  }

  /**
   * Image for the dropdown arrow.
   */

  dropdownImage = (!mxClient.IS_SVG)
    ? IMAGE_PATH + "/dropdown.gif"
    : "data:image/gif;base64,R0lGODlhDQANAIABAHt7e////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREM1NkJFMjE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREM1NkJFMzE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQzOUMzMjZCMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQzOUMzMjZDMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7";

  /**
   * Image element for the dropdown arrow.
   */
  dropdownImageHtml =
    '<img border="0" style="position:absolute;right:4px;top:' +
    ((!EditorUI.compactUi) ? 8 : 6) + 'px;" src="' + this.dropdownImage +
    '" valign="middle"/>';

  /**
   * Defines the background for selected buttons.
   */
  selectedBackground = "#d0d0d0";

  /**
   * Defines the background for selected buttons.
   */
  unselectedBackground = "none";

  /**
   * Adds the toolbar elements.
   */
  init() {}

  /**
   * Adds the toolbar elements.
   */
  addDropDownArrow(
    menu,
    sprite,
    width,
    atlasWidth,
    left,
    top,
    atlasDelta,
    atlasLeft,
  ) {
    atlasDelta = (atlasDelta != null) ? atlasDelta : 32;
    left = (EditorUI.compactUi) ? left : atlasLeft;

    menu.style.whiteSpace = "nowrap";
    menu.style.overflow = "hidden";
    menu.style.position = "relative";
    menu.innerHTML = '<div class="geSprite ' + sprite +
      '" style="margin-left:' +
      left + "px;margin-top:" + top + 'px;"></div>' +
      this.dropdownImageHtml;
    menu.style.width = (mxClient.IS_QUIRKS)
      ? atlasWidth + "px"
      : (atlasWidth - atlasDelta) + "px";

    if (mxClient.IS_QUIRKS) {
      menu.style.height = (EditorUI.compactUi) ? "24px" : "26px";
    }

    // Fix for item size in kennedy theme
    if (EditorUI.compactUi) {
      menu.getElementsByTagName("img")[0].style.left = "24px";
      menu.getElementsByTagName("img")[0].style.top = "5px";
      menu.style.width = (mxClient.IS_QUIRKS)
        ? width + "px"
        : (width - 10) + "px";
    }
  }

  /**
   * Sets the current font name.
   */
  setFontName(value) {
    if (this.fontMenu != null) {
      this.fontMenu.innerHTML =
        '<div style="width:60px;overflow:hidden;display:inline-block;">' +
        mxUtils.htmlEntities(value) + "</div>" + this.dropdownImageHtml;
    }
  }

  /**
   * Sets the current font name.
   */
  setFontSize(value) {
    if (this.sizeMenu != null) {
      this.sizeMenu.innerHTML =
        '<div style="width:24px;overflow:hidden;display:inline-block;">' +
        value + "</div>" + this.dropdownImageHtml;
    }
  }

  /**
   * Hides the current menu.
   */
  createTextToolbar() {
    var graph = this.editorUi.editor.graph;

    var styleElt = this.addMenu(
      "",
      mxResources.get("style"),
      true,
      "formatBlock",
    );
    styleElt.style.position = "relative";
    styleElt.style.whiteSpace = "nowrap";
    styleElt.style.overflow = "hidden";
    styleElt.innerHTML = mxResources.get("style") + this.dropdownImageHtml;

    if (EditorUI.compactUi) {
      styleElt.style.paddingRight = "18px";
      styleElt.getElementsByTagName("img")[0].style.right = "1px";
      styleElt.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.fontMenu = this.addMenu(
      "",
      mxResources.get("fontFamily"),
      true,
      "fontFamily",
    );
    this.fontMenu.style.position = "relative";
    this.fontMenu.style.whiteSpace = "nowrap";
    this.fontMenu.style.overflow = "hidden";
    this.fontMenu.style.width = (mxClient.IS_QUIRKS) ? "80px" : "60px";

    this.setFontName(Menus.prototype.defaultFont);

    if (EditorUI.compactUi) {
      this.fontMenu.style.paddingRight = "18px";
      this.fontMenu.getElementsByTagName("img")[0].style.right = "1px";
      this.fontMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.sizeMenu = this.addMenu(
      Menus.prototype.defaultFontSize,
      mxResources.get("fontSize"),
      true,
      "fontSize",
    );
    this.sizeMenu.style.position = "relative";
    this.sizeMenu.style.whiteSpace = "nowrap";
    this.sizeMenu.style.overflow = "hidden";
    this.sizeMenu.style.width = (mxClient.IS_QUIRKS) ? "44px" : "24px";

    this.setFontSize(Menus.prototype.defaultFontSize);

    if (EditorUI.compactUi) {
      this.sizeMenu.style.paddingRight = "18px";
      this.sizeMenu.getElementsByTagName("img")[0].style.right = "1px";
      this.sizeMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    var elts = this.addItems(
      ["-", "undo", "redo", "-", "bold", "italic", "underline"],
    );
    elts[1].setAttribute(
      "title",
      mxResources.get("undo") + " (" +
        this.editorUi.actions.get("undo").shortcut + ")",
    );
    elts[2].setAttribute(
      "title",
      mxResources.get("redo") + " (" +
        this.editorUi.actions.get("redo").shortcut + ")",
    );
    elts[4].setAttribute(
      "title",
      mxResources.get("bold") + " (" +
        this.editorUi.actions.get("bold").shortcut + ")",
    );
    elts[5].setAttribute(
      "title",
      mxResources.get("italic") + " (" +
        this.editorUi.actions.get("italic").shortcut + ")",
    );
    elts[6].setAttribute(
      "title",
      mxResources.get("underline") + " (" +
        this.editorUi.actions.get("underline").shortcut + ")",
    );

    // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
    // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
    var alignMenu = this.addMenuFunction(
      "",
      mxResources.get("align"),
      false,
      mxUtils.bind(this, function (menu) {
        elt = menu.addItem(
          "",
          null,
          (evt) => {
            graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
          },
          null,
          "geIcon geSprite geSprite-left",
        );
        elt.setAttribute("title", mxResources.get("left"));

        elt = menu.addItem(
          "",
          null,
          (evt) => {
            graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
          },
          null,
          "geIcon geSprite geSprite-center",
        );
        elt.setAttribute("title", mxResources.get("center"));

        elt = menu.addItem(
          "",
          null,
          (evt) => {
            graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
          },
          null,
          "geIcon geSprite geSprite-right",
        );
        elt.setAttribute("title", mxResources.get("right"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("justifyfull", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-justifyfull",
        );
        elt.setAttribute("title", mxResources.get("justifyfull"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("insertorderedlist", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-orderedlist",
        );
        elt.setAttribute("title", mxResources.get("numberedList"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("insertunorderedlist", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-unorderedlist",
        );
        elt.setAttribute("title", mxResources.get("bulletedList"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("outdent", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-outdent",
        );
        elt.setAttribute("title", mxResources.get("decreaseIndent"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("indent", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-indent",
        );
        elt.setAttribute("title", mxResources.get("increaseIndent"));
      }),
    );

    alignMenu.style.position = "relative";
    alignMenu.style.whiteSpace = "nowrap";
    alignMenu.style.overflow = "hidden";
    alignMenu.innerHTML =
      '<div class="geSprite geSprite-left" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    alignMenu.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";

    if (EditorUI.compactUi) {
      alignMenu.getElementsByTagName("img")[0].style.left = "22px";
      alignMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    var formatMenu = this.addMenuFunction(
      "",
      mxResources.get("format"),
      false,
      (menu) => {
        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("subscript").funct,
          null,
          "geIcon geSprite geSprite-subscript",
        );
        elt.setAttribute(
          "title",
          mxResources.get("subscript") + " (" + Editor.ctrlKey + "+,)",
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
          mxResources.get("superscript") + " (" + Editor.ctrlKey + "+.)",
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
          mxUtils.bind(this, function () {
            document.execCommand("removeformat", false, undefined);
          }),
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
    formatMenu.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";

    if (EditorUI.compactUi) {
      formatMenu.getElementsByTagName("img")[0].style.left = "22px";
      formatMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.addButton(
      "geIcon geSprite geSprite-code",
      mxResources.get("html"),
      function () {
        graph.cellEditor.toggleViewMode();

        if (
          graph.cellEditor.textarea.innerHTML.length > 0 &&
          (graph.cellEditor.textarea.innerHTML != "&nbsp;" ||
            !graph.cellEditor.clearOnChange)
        ) {
          window.setTimeout(function () {
            document.execCommand("selectAll", false, undefined);
          });
        }
      },
    );

    this.addSeparator();

    // FIXME: Uses geButton here and geLabel in main menu
    var insertMenu = this.addMenuFunction(
      "",
      mxResources.get("insert"),
      true,
      (menu) => {
        menu.addItem(
          mxResources.get("insertLink"),
          null,
          () => {
            this.editorUi.actions.get("link").funct();
          },
        );

        menu.addItem(
          mxResources.get("insertImage"),
          null,
          () => {
            this.editorUi.actions.get("image").funct();
          },
        );

        menu.addItem(
          mxResources.get("insertHorizontalRule"),
          null,
          mxUtils.bind(this, function () {
            document.execCommand("inserthorizontalrule", false, undefined);
          }),
        );
      },
    );

    insertMenu.style.whiteSpace = "nowrap";
    insertMenu.style.overflow = "hidden";
    insertMenu.style.position = "relative";
    insertMenu.innerHTML =
      '<div class="geSprite geSprite-plus" style="margin-left:-4px;margin-top:-3px;"></div>' +
      this.dropdownImageHtml;
    insertMenu.style.width = (mxClient.IS_QUIRKS) ? "36px" : "16px";

    // Fix for item size in kennedy theme
    if (EditorUI.compactUi) {
      insertMenu.getElementsByTagName("img")[0].style.left = "24px";
      insertMenu.getElementsByTagName("img")[0].style.top = "5px";
      insertMenu.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";
    }

    this.addSeparator();

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
                  graph.insertColumn(
                    table,
                    (cell != null) ? cell.cellIndex : 0,
                  ),
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
                    (cell != null) ? cell.cellIndex + 1 : -1,
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
                function ($0, $1, $2, $3) {
                  return "#" + ("0" + Number($1).toString(16)).substr(-2) +
                    ("0" + Number($2).toString(16)).substr(-2) +
                    ("0" + Number($3).toString(16)).substr(-2);
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
                ($0, $1, $2, $3) => {
                  return "#" + ("0" + Number($1).toString(16)).substr(-2) +
                    ("0" + Number($2).toString(16)).substr(-2) +
                    ("0" + Number($3).toString(16)).substr(-2);
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
                mxUtils.bind(this, function (newValue) {
                  if (newValue != null && newValue.length > 0) {
                    table.setAttribute("cellPadding", newValue);
                  } else {
                    table.removeAttribute("cellPadding");
                  }
                }),
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
            mxUtils.bind(this, function () {
              table.setAttribute("align", "left");
            }),
            null,
            "geIcon geSprite geSprite-left",
          );
          elt.setAttribute("title", mxResources.get("left"));

          elt = menu.addItem(
            "",
            null,
            mxUtils.bind(this, function () {
              table.setAttribute("align", "center");
            }),
            null,
            "geIcon geSprite geSprite-center",
          );
          elt.setAttribute("title", mxResources.get("center"));

          elt = menu.addItem(
            "",
            null,
            mxUtils.bind(this, function () {
              table.setAttribute("align", "right");
            }),
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
    elt.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";

    // Fix for item size in kennedy theme
    if (EditorUI.compactUi) {
      elt.getElementsByTagName("img")[0].style.left = "22px";
      elt.getElementsByTagName("img")[0].style.top = "5px";
    }
  }

  /**
   * Hides the current menu.
   */
  hideMenu() {
    this.editorUi.hideCurrentMenu();
  }

  /**
   * Adds a label to the toolbar.
   */
  addMenu(
    label,
    tooltip,
    showLabels,
    name,
    c?,
    showAll?,
    ignoreState?,
  ) {
    var menu = this.editorUi.menus.get(name);
    var elt: any = this.addMenuFunction(
      label,
      tooltip,
      showLabels,
      function () {
        menu.funct.apply(menu, arguments);
      },
      c,
      showAll,
    );

    if (!ignoreState) {
      menu.addListener("stateChanged", function () {
        elt.setEnabled(menu.enabled);
      });
    }

    return elt;
  }

  /**
   * Adds a label to the toolbar.
   */
  addMenuFunction(
    label,
    tooltip,
    showLabels,
    funct,
    c?,
    showAll?,
  ) {
    return this.addMenuFunctionInContainer(
      (c != null) ? c : this.container,
      label,
      tooltip,
      showLabels,
      funct,
      showAll,
    );
  }

  /**
   * Adds a label to the toolbar.
   */
  addMenuFunctionInContainer(
    container,
    label,
    tooltip,
    showLabels,
    funct,
    showAll,
  ) {
    var elt = (showLabels) ? this.createLabel(label) : this.createButton(label);
    this.initElement(elt, tooltip);
    this.addMenuHandler(elt, showLabels, funct, showAll);
    container.appendChild(elt);

    return elt;
  }

  /**
   * Adds a separator to the separator.
   */
  addSeparator(c?) {
    c = (c != null) ? c : this.container;
    var elt = document.createElement("div");
    elt.className = "geSeparator";
    c.appendChild(elt);

    return elt;
  }

  /**
   * Adds given action item
   */
  addItems(keys, c?, ignoreDisabled?) {
    var items: any[] = [];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key == "-") {
        items.push(this.addSeparator(c));
      } else {
        items.push(
          this.addItem("geSprite-" + key.toLowerCase(), key, c, ignoreDisabled),
        );
      }
    }

    return items;
  }

  /**
   * Adds given action item
   */
  addItem(sprite, key, c, ignoreDisabled) {
    var action = this.editorUi.actions.get(key);
    var elt: any;

    if (action != null) {
      var tooltip = action.label;

      if (action.shortcut != null) {
        tooltip += " (" + action.shortcut + ")";
      }

      elt = this.addButton(sprite, tooltip, action.funct, c);

      if (!ignoreDisabled) {
        elt.setEnabled(action.enabled);

        action.addListener("stateChanged", function () {
          elt.setEnabled(action.enabled);
        });
      }
    }

    return elt;
  }

  /**
   * Adds a button to the toolbar.
   */
  addButton(classname, tooltip, funct, c?) {
    var elt = this.createButton(classname);
    c = (c != null) ? c : this.container;

    this.initElement(elt, tooltip);
    this.addClickHandler(elt, funct);
    c.appendChild(elt);

    return elt;
  }

  /**
   * Initializes the given toolbar element.
   */
  initElement(elt, tooltip) {
    // Adds tooltip
    if (tooltip != null) {
      elt.setAttribute("title", tooltip);
    }

    this.addEnabledState(elt);
  }

  /**
   * Adds enabled state with setter to DOM node (avoids JS wrapper).
   */
  addEnabledState(elt) {
    var classname = elt.className;

    elt.setEnabled = (value) => {
      elt.enabled = value;

      if (value) {
        elt.className = classname;
      } else {
        elt.className = classname + " mxDisabled";
      }
    };

    elt.setEnabled(true);
  }

  /**
   * Adds enabled state with setter to DOM node (avoids JS wrapper).
   */
  addClickHandler(elt, funct) {
    if (funct != null) {
      mxEvent.addListener(elt, "click", function (evt) {
        if (elt.enabled) {
          funct(evt);
        }

        mxEvent.consume(evt);
      });

      // Prevents focus
      mxEvent.addListener(
        elt,
        (mxClient.IS_POINTER) ? "pointerdown" : "mousedown",
        mxUtils.bind(this, function (evt) {
          evt.preventDefault();
        }),
      );
    }
  }

  /**
   * Creates and returns a new button.
   */
  createButton(classname) {
    var elt = document.createElement("a");
    elt.className = "geButton";

    var inner = document.createElement("div");

    if (classname != null) {
      inner.className = "geSprite " + classname;
    }

    elt.appendChild(inner);

    return elt;
  }

  /**
   * Creates and returns a new button.
   */
  createLabel(label, tooltip?) {
    var elt = document.createElement("a");
    elt.className = "geLabel";
    mxUtils.write(elt, label);

    return elt;
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  addMenuHandler(elt, showLabels, funct, showAll) {
    if (funct != null) {
      var graph = this.editorUi.editor.graph;
      var menu: any;
      var show = true;

      mxEvent.addListener(
        elt,
        "click",
        (evt) => {
          if (show && (elt.enabled == null || elt.enabled)) {
            graph.popupMenuHandler.hideMenu();
            menu = new mxPopupMenu(funct);
            menu.div.className += " geToolbarMenu";
            menu.showDisabled = showAll;
            menu.labels = showLabels;
            menu.autoExpand = true;

            var offset = mxUtils.getOffset(elt);
            menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
            this.editorUi.setCurrentMenu(menu, elt);

            // Workaround for scrollbar hiding menu items
            if (!showLabels && menu.div.scrollHeight > menu.div.clientHeight) {
              menu.div.style.width = "40px";
            }

            menu.hideMenu = () => {
              mxPopupMenu.prototype.hideMenu.apply(menu, []);
              this.editorUi.resetCurrentMenu();
              menu.destroy();
            };

            // Extends destroy to reset global state
            menu.addListener(
              mxEvent.HIDE,
              () => {
                this.currentElt = null;
              },
            );
          }

          show = true;
          mxEvent.consume(evt);
        },
      );

      // Hides menu if already showing and prevents focus
      mxEvent.addListener(
        elt,
        (mxClient.IS_POINTER) ? "pointerdown" : "mousedown",
        (evt) => {
          show = this.currentElt != elt;
          evt.preventDefault();
        },
      );
    }
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  destroy() {
    if (this.gestureHandler != null) {
      mxEvent.removeGestureListeners(document, this.gestureHandler, null, null);
      this.gestureHandler = null;
    }
  }
}
