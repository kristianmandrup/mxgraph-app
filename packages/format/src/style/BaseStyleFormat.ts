import { BaseFormatPanel } from "../BaseFormatPanel";

export class BaseStyleFormat extends BaseFormatPanel {
  /**
   *
   */
  defaultStrokeColor = "black";

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
  }
}
