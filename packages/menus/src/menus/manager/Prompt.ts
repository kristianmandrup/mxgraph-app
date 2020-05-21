import { FilenameDialog } from "../../_imports";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

export class MenuPrompt {
  editorUi: any;
  defaultValue: any = "x";
  hint: any;
  key: any;
  fn: any;

  constructor(editorUi, { defaultValue }) {
    this.editorUi = editorUi;
    this.defaultValue = defaultValue;
  }
  /**
   * Adds a style change item with a prompt to the given menu.
   */
  promptChange(menu, label, hint: string, opts: any = {}) {
    const { defaultValue, key, parent, enabled = true, fn, sprite } = opts;
    this.hint = hint || this.hint;
    this.defaultValue = defaultValue || this.defaultValue;
    this.key = key || this.key;
    this.fn = fn || this.fn;

    return menu.addItem(label, this.add, null, parent, sprite, enabled);
  }

  get graph() {
    return this.editorUi.editor.graph;
  }

  add = () => {
    const { defaultValue, graph, key, fn, hint } = this;
    var value = defaultValue;
    var state = graph.getView().getState(graph.getSelectionCell());

    if (state != null) {
      value = state.style[key] || value;
    }

    var dlg: any = new FilenameDialog(
      this.editorUi,
      value,
      mxResources.get("apply"),
      (newValue) => {
        if (newValue != null && newValue.length > 0) {
          graph.getModel().beginUpdate();
          try {
            graph.stopEditing(false);
            graph.setCellStyles(key, newValue);
          } finally {
            graph.getModel().endUpdate();
          }

          if (fn != null) {
            fn(newValue);
          }
        }
      },
      mxResources.get("enterValue") + (hint.length > 0 ? " " + hint : "")
    );
    this.editorUi.showDialog(dlg.container, 300, 80, true, true);
    dlg.init();
  };
}
