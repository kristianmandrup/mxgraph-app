import { FilenameDialog } from "@mxgraph-app/dialogs";
import mx from "@mxgraph-app/mx";
const {
  mxConstants,
  mxResources,
} = mx;

export class MenuHandler {
  editorUi: any;
  menu: any;
  table: any;
  cell: any;
  row: any;
  graph: any;

  constructor(editorUi, opts: any) {
    const { menu, graph, cell, row, table } = opts;
    this.editorUi = editorUi;
    this.menu = menu;
    this.graph = graph;
    this.cell = cell;
    this.row = row;
    this.table = table;
  }

  create() {
    this.deleteRow();
    this.deleteRow();
  }

  deleteRow() {
    const { menu, graph, table, row } = this;
    const elt = menu.addItem(
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
    return this;
  }

  alignLeft() {
    const { menu, table } = this;
    const elt = menu.addItem(
      "",
      null,
      () => {
        table.setAttribute("align", "left");
      },
      null,
      "geIcon geSprite geSprite-left",
    );
    elt.setAttribute("title", mxResources.get("left"));
    return this;
  }

  alignCenter() {
    const { menu, table } = this;
    const elt = menu.addItem(
      "",
      null,
      () => {
        table.setAttribute("align", "center");
      },
      null,
      "geIcon geSprite geSprite-center",
    );
    elt.setAttribute("title", mxResources.get("center"));
  }

  alignRight() {
    const { menu, table } = this;
    const elt = menu.addItem(
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

  insertColumnBefore(menu) {
    const { graph, table, cell } = this;
    const elt = menu.addItem(
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
  }

  insertColumnAfter(menu) {
    const { graph, table, cell } = this;
    const elt = menu.addItem(
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
  }

  deleteColumn(menu) {
    const { cell, table, graph } = this;
    const elt = menu.addItem(
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
  }

  borderColor(menu) {
    const { table } = this;
    const elt = menu.addItem(
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
  }

  backgroundColor(menu) {
    const { table } = this;
    const elt = menu.addItem(
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
  }

  cellPadding(menu) {
    const { table } = this;
    const elt = menu.addItem(
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
  }

  insertRowBefore(menu) {
    const { table, row, graph } = this;
    const elt = menu.addItem(
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
  }

  insertRowAfter(menu) {
    const { table, row, graph } = this;
    const elt = menu.addItem(
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
  }
}
