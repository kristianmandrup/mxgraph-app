import { AbstractInitializer } from "../AbstractInitializer";
import { EdgeShapeMenu } from "./EdgeShapeMenu";
import { EdgeStyleMenu } from "./EdgeStyleMenu";

export class ToolbarSetup extends AbstractInitializer {
  edgeShapeMenu: any;
  edgeStyleMenu: any;

  configureItems() {
    const { sw } = this;
    if (sw >= 320) {
      this.deleteElts;
    }

    if (sw >= 550) {
      this.addItems(["-", "toFront", "toBack"]);
    }

    if (sw >= 740) {
      this.addItems(["-", "fillColor"]);

      if (sw >= 780) {
        this.addItems(["strokeColor"]);

        if (sw >= 820) {
          this.addItems(["shadow"]);
        }
      }
    }

    if (sw >= 400) {
      this.addSeparator();

      if (sw >= 440) {
        this.edgeShapeMenu = this.createEdgeShapeMenu();
      }

      this.edgeStyleMenu = this.createEdgeStyleMenu();
    }
  }

  createEdgeStyleMenu() {
    return new EdgeStyleMenu(this.editorUi, this.container).create();
  }

  createEdgeShapeMenu() {
    return new EdgeShapeMenu(this.editorUi, this.container).create();
  }
}
