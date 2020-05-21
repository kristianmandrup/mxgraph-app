import { FilenameDialog } from "../../_imports";
import mx from "@mxgraph-app/mx";
const { mxResources, mxUtils } = mx;

export class MenuPrompt {
  editorUi: any;
  /**
   * Adds a style change item with a prompt to the given menu.
   */
  promptChange(
    menu,
    label,
    hint,
    defaultValue,
    key,
    parent,
    enabled,
    fn,
    sprite,
  ) {
    return menu.addItem(
      label,
      null,
      () => {
        var graph = this.editorUi.editor.graph;
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
          mxResources.get("enterValue") + (hint.length > 0 ? " " + hint : ""),
        );
        this.editorUi.showDialog(dlg.container, 300, 80, true, true);
        dlg.init();
      },
      parent,
      sprite,
      enabled,
    );
  }
}
