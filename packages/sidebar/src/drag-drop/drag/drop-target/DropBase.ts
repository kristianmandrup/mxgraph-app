export class DropBase {
  editorUi: any;

  constructor(editorUi) {
    this.editorUi = editorUi;
  }

  get ui() {
    return this.editorUi;
  }

  get graph() {
    return this.ui.editor.graph;
  }
}
