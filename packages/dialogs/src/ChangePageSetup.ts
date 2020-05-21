import mx from "@mxgraph-app/mx";
const { mxObjectCodec, mxCodecRegistry } = mx;

/**
 * Change types
 */
export class ChangePageSetup {
  ui: any;
  color: any;
  image: any;
  format: any;
  pageScale: any;
  previousColor: any;
  previousImage: any;
  previousFormat: any;
  previousPageScale: any;
  ignoreColor: boolean = false;
  ignoreImage: boolean = false;

  foldingEnabled?: boolean;

  constructor(
    ui?: any,
    color?: any,
    image?: any,
    format?: any,
    pageScale?: any
  ) {
    this.ui = ui;
    this.color = color;
    this.previousColor = color;
    this.image = image;
    this.previousImage = image;
    this.format = format;
    this.previousFormat = format;
    this.pageScale = pageScale;
    this.previousPageScale = pageScale;

    // Needed since null are valid values for color and image
    this.ignoreColor = false;
    this.ignoreImage = false;
  }

  /**
   * Implementation of the undoable page rename.
   */
  execute() {
    const { foldingEnabled } = this;

    var graph = this.ui.editor.graph;

    if (!this.ignoreColor) {
      this.color = this.previousColor;
      var tmp = graph.background;
      this.ui.setBackgroundColor(this.previousColor);
      this.previousColor = tmp;
    }

    if (!this.ignoreImage) {
      this.image = this.previousImage;
      var tmp = graph.backgroundImage;
      this.ui.setBackgroundImage(this.previousImage);
      this.previousImage = tmp;
    }

    if (this.previousFormat != null) {
      this.format = this.previousFormat;
      var tmp = graph.pageFormat;

      if (
        this.previousFormat.width != tmp.width ||
        this.previousFormat.height != tmp.height
      ) {
        this.ui.setPageFormat(this.previousFormat);
        this.previousFormat = tmp;
      }
    }

    if (
      this.foldingEnabled != null &&
      this.foldingEnabled != this.ui.editor.graph.foldingEnabled
    ) {
      this.ui.setFoldingEnabled(this.foldingEnabled);
      this.foldingEnabled = !this.foldingEnabled;
    }

    if (this.previousPageScale != null) {
      var currentPageScale = this.ui.editor.graph.pageScale;

      if (this.previousPageScale != currentPageScale) {
        this.ui.setPageScale(this.previousPageScale);
        this.previousPageScale = currentPageScale;
      }
    }
  }

  // Registers codec for ChangePageSetup
  static register() {
    var codec = new mxObjectCodec(new ChangePageSetup(), [
      "ui",
      "previousColor",
      "previousImage",
      "previousFormat",
      "previousPageScale",
    ]);

    codec.afterDecode = (dec, node, obj) => {
      obj.previousColor = obj.color;
      obj.previousImage = obj.image;
      obj.previousFormat = obj.format;
      obj.previousPageScale = obj.pageScale;

      if (obj.foldingEnabled != null) {
        obj.foldingEnabled = !obj.foldingEnabled;
      }

      return obj;
    };

    mxCodecRegistry.register(codec);
  }
}
