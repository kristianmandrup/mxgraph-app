export class BaseFormatListener {
  format: any;
  editorUi: any;
  container: any;
  listeners: any[] = [];

  documentMode: any;
  selection: any;

  constructor(format, editorUi, container) {
    this.format = format;
    this.editorUi = editorUi;
    this.container = container;
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
