import { BaseFormatPanel } from "../base";

export class BaseArrangeFormat extends BaseFormatPanel {
  format: any;
  editorUi: any;
  container: any;
  listeners: any[] = [];
  documentMode: any;

  constructor(editorUi, format, container) {
    super(format, editorUi, container);
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
