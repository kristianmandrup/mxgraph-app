export class FontStyleItems {
  add() {
    const elts = this.addItems([
      "-",
      "bold",
      "italic",
      "underline",
    ]);

    elts[4].setAttribute(
      "title",
      mxResources.get("bold") +
        " (" +
        this.editorUi.actions.get("bold").shortcut +
        ")",
    );
    elts[5].setAttribute(
      "title",
      mxResources.get("italic") +
        " (" +
        this.editorUi.actions.get("italic").shortcut +
        ")",
    );
    elts[6].setAttribute(
      "title",
      mxResources.get("underline") +
        " (" +
        this.editorUi.actions.get("underline").shortcut +
        ")",
    );
  }
}
