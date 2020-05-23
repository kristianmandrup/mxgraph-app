import mx from "@mxgraph-app/mx";
import { ToolbarMenuAdder } from "../ToolbarMenuAdder";
const { mxEvent, mxResources, mxClient } = mx;

export class InitTableElement extends ToolbarMenuAdder {
  create() {
    // KNOWN: All table stuff does not work with undo/redo
    // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
    // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
    var elt = this.addMenuFunction(
      "geIcon geSprite geSprite-table",
      mxResources.get("table"),
      false,
      (menu) => {
        var graph = this.editorUi.editor.graph;
        var cell = graph.getSelectionCell();

        if (
          !graph.isTableCell(cell) &&
          !graph.isTableRow(cell) &&
          !graph.isTable(cell)
        ) {
          this.editorUi.menus.addInsertTableItem(menu, (evt, rows, cols) => {
            var table = mxEvent.isShiftDown(evt)
              ? graph.createCrossFunctionalSwimlane(rows, cols)
              : graph.createTable(rows, cols);
            var pt = mxEvent.isAltDown(evt)
              ? graph.getFreeInsertPoint()
              : graph.getCenterInsertPoint(
                graph.getBoundingBoxFromGeometry([table], true),
              );
            var select = graph.importCells([table], pt.x, pt.y);

            if (select != null && select.length > 0) {
              graph.scrollCellToVisible(select[0]);
              graph.setSelectionCells(select);
            }
          });
        } else {
          elt = menu.addItem(
            "",
            null,
            () => {
              try {
                graph.insertTableColumn(cell, true);
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
                graph.insertTableColumn(cell, false);
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
                  graph.deleteTableColumn(cell);
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
                graph.insertTableRow(cell, true);
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
                graph.insertTableRow(cell, false);
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
                graph.deleteTableRow(cell);
              } catch (e) {
                this.editorUi.handleError(e);
              }
            },
            null,
            "geIcon geSprite geSprite-deleterow",
          );
          elt.setAttribute("title", mxResources.get("deleteRow"));
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
    if (this.compactUi) {
      elt.getElementsByTagName("img")[0].style.left = "22px";
      elt.getElementsByTagName("img")[0].style.top = "5px";
    }
    return elt;
  }
}
