import { DropConnect } from "./DropConnect";
import { DropConnectGeo } from "./DropConnectGeo";

export class DropConnector {
  editorUi: any;
  dropConnect: any;
  dropConnectGeo: any;

  constructor(editorUi, { dropConnect, dropConnectGeo }: any = {}) {
    this.editorUi = editorUi;
    this.dropConnect = dropConnect || new DropConnect(editorUi);
    this.dropConnectGeo = dropConnectGeo || new DropConnectGeo(editorUi);
  }

  /**
   * Creates a drag source for the given element.
   */
  dropAndConnect(source, targets, direction, dropCellIndex, evt) {
    this.dropConnect.dropAndConnect(
      source,
      targets,
      direction,
      dropCellIndex,
      evt
    );
  }

  /**
   * Creates a drag source for the given element.
   */
  getDropAndConnectGeometry(source, target, direction, targets) {
    this.dropConnectGeo.getDropAndConnectGeometry(
      source,
      target,
      direction,
      targets
    );
  }
}
