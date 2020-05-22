export class Base {
  format: any;
  editorUi: any;
  container: any;
  listeners: any[] = [];
  documentMode: any;

  constructor(format, editorUi, container) {
    this.format = format;
    this.editorUi = editorUi;
    this.container = container;
    this.listeners = [];
  }

  /**
   * Adds the given option.
   */
  createPanel() {
    var div = document.createElement("div");
    div.className = "geFormatSection";
    div.style.padding = "12px 0px 12px 18px";

    return div;
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
