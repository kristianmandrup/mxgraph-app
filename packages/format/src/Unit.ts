import mx from "@mxgraph-app/mx";
const {
  mxConstants,
} = mx;

const POINTS = mxConstants["POINTS"];
const INCHES = mxConstants["INCHES"];
const MILLIMETERS = mxConstants["MILLIMETERS"];

const PIXELS_PER_INCH = mxConstants["PIXELS_PER_INCH"];
const PIXELS_PER_MM = mxConstants["PIXELS_PER_MM"];

export class Unit {
  editorUi: any;
  container: any;

  constructor(editorUi, container) {
    this.editorUi = editorUi;
    this.container = container;
  }

  getUnit() {
    var unit = this.editorUi.editor.graph.view.unit;

    switch (unit) {
      case POINTS:
        return "pt";
      case INCHES:
        return '"';
      case MILLIMETERS:
        return "mm";
      default:
        return "mm";
    }
  }

  inUnit(pixels) {
    return this.editorUi.editor.graph.view.formatUnitText(pixels);
  }

  fromUnit(value) {
    var unit = this.editorUi.editor.graph.view.unit;

    switch (unit) {
      case POINTS:
        return value;
      case INCHES:
        return value * PIXELS_PER_INCH;
      case MILLIMETERS:
        return value * PIXELS_PER_MM;
    }
  }

  isFloatUnit() {
    return this.editorUi.editor.graph.view.unit != POINTS;
  }

  getUnitStep() {
    var unit = this.editorUi.editor.graph.view.unit;

    switch (unit) {
      case POINTS:
        return 1;
      case INCHES:
        return 0.1;
      case MILLIMETERS:
        return 0.5;
      default:
        return 0.5;
    }
  }
}
