export class Base {
  format: any;
  editorUi: any;
  container: any;
  listeners: any[] = [];
  documentMode: any;
  compactUi: any;

  constructor(editorUi, container?) {
    this.editorUi = editorUi;
    container = container;
    this.listeners = [];
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
}
