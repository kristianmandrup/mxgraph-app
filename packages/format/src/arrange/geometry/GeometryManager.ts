import { AbstractManager } from "./edge/AbstractManager";
import { EdgeGeometryManager } from "./edge/EdgeGeometryManager";
import { BasicGeometryManager } from "./basic/BasicGeometryManager";

export class GeometryManager extends AbstractManager {
  editorUi: any;
  format: any;
  getUnit: any;
  getUnitStep: any;
  isFloatUnit: any;
  inUnit: any;
  createPanel: any; // fn
  addUnitInput: any; // fn
  addLabel: any; // fn
  createCellOption: any; //fn
  addKeyHandler: any; // fn
  fromUnit: any; //
  listeners: any; //

  edgeGeometryManager: any;
  basicGeometryManager: any;

  constructor(editorUi: any, format: any) {
    super(editorUi, format);
    this.edgeGeometryManager = this.createEdgeGeometryManager();
    this.basicGeometryManager = this.createBasicGeometryManager();
  }

  createEdgeGeometryManager() {
    return new EdgeGeometryManager(
      this.editorUi,
      this.format,
    );
  }

  createBasicGeometryManager() {
    return new BasicGeometryManager(
      this.editorUi,
      this.format,
    );
  }

  addGeometry(container) {
    this.basicGeometryManager.addGeometry(container);
  }

  addGeometryHandler(input, fn) {
    this.basicGeometryManager.addGeometryHandler(input, fn);
  }

  addEdgeGeometryHandler(input, fn) {
    this.edgeGeometryManager.addEdgeGeometryHandler(input, fn);
  }

  addEdgeGeometry(container) {
    this.edgeGeometryManager.addEdgeGeometry(container);
  }
}
