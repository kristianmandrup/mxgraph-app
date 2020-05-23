import mx from "@mxgraph-app/mx";
import { ToolbarMenuAdder } from "../../ToolbarMenuAdder";
const {
  mxResources,
} = mx;

export class UndoItems extends ToolbarMenuAdder {
  add() {
    var elts = this.addItems([
      "-",
      "undo",
      "redo",
    ]);
    elts[1].setAttribute(
      "title",
      mxResources.get("undo") +
        " (" +
        this.editorUi.actions.get("undo").shortcut +
        ")",
    );
    elts[2].setAttribute(
      "title",
      mxResources.get("redo") +
        " (" +
        this.editorUi.actions.get("redo").shortcut +
        ")",
    );
  }
}
