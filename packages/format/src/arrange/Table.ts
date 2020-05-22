import mx from "@mxgraph-app/mx";
import { Buttons } from "../base/Buttons";
const { mxResources, mxUtils } = mx;

export class Table {
  editorUi: any;
  format: any;
  buttons: any;

  constructor(editorUi, format) {
    this.editorUi = editorUi;
    this.format = format;
    this.buttons = new Buttons();
  }

  get ui() {
    return this.editorUi;
  }

  get ss() {
    return this.format.getSelectionState();
  }

  get editor() {
    return this.editorUi.editor;
  }

  get graph() {
    return this.editor.graph;
  }

  styleButtons(elts) {
    this.buttons.style(elts);
  }

  /**
   *
   */
  add(div) {
    const { ui, graph, ss } = this;
    div.style.paddingTop = "6px";
    div.style.paddingBottom = "10px";

    var span = document.createElement("div");
    span.style.marginTop = "2px";
    span.style.marginBottom = "8px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("table"));
    div.appendChild(span);

    var panel = document.createElement("div");
    panel.style.position = "relative";
    panel.style.paddingLeft = "0px";
    panel.style.borderWidth = "0px";
    panel.className = "geToolbarContainer";

    var btns = [
      ui.toolbar.addButton(
        "geSprite-insertcolumnbefore",
        mxResources.get("insertColumnBefore"),
        () => {
          try {
            graph.insertTableColumn(ss.vertices[0], true);
          } catch (e) {
            ui.handleError(e);
          }
        },
        panel,
      ),
      ui.toolbar.addButton(
        "geSprite-insertcolumnafter",
        mxResources.get("insertColumnAfter"),
        () => {
          try {
            graph.insertTableColumn(ss.vertices[0], false);
          } catch (e) {
            ui.handleError(e);
          }
        },
        panel,
      ),
      ui.toolbar.addButton(
        "geSprite-deletecolumn",
        mxResources.get("deleteColumn"),
        () => {
          try {
            graph.deleteTableColumn(ss.vertices[0]);
          } catch (e) {
            ui.handleError(e);
          }
        },
        panel,
      ),
      ui.toolbar.addButton(
        "geSprite-insertrowbefore",
        mxResources.get("insertRowBefore"),
        () => {
          try {
            graph.insertTableRow(ss.vertices[0], true);
          } catch (e) {
            ui.handleError(e);
          }
        },
        panel,
      ),
      ui.toolbar.addButton(
        "geSprite-insertrowafter",
        mxResources.get("insertRowAfter"),
        () => {
          try {
            graph.insertTableRow(ss.vertices[0], false);
          } catch (e) {
            ui.handleError(e);
          }
        },
        panel,
      ),
      ui.toolbar.addButton(
        "geSprite-deleterow",
        mxResources.get("deleteRow"),
        () => {
          try {
            graph.deleteTableRow(ss.vertices[0]);
          } catch (e) {
            ui.handleError(e);
          }
        },
        panel,
      ),
    ];
    this.styleButtons(btns);
    div.appendChild(panel);
    btns[2].style.marginRight = "9px";

    return div;
  }
}
