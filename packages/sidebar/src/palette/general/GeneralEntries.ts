import { GeneralPalette } from "./GeneralPalette";
import mx from "@mxgraph-app/mx";
const { mxGeometry, mxCell, mxPoint } = mx;

export class GeneralEntries extends GeneralPalette {
  get curve() {
    return this.addEntry("curve", () => {
      var cell = new mxCell(
        "",
        new mxGeometry(0, 0, 50, 50),
        "curved=1;endArrow=classic;html=1;",
      );
      cell.geometry.setTerminalPoint(new mxPoint(0, 50), true);
      cell.geometry.setTerminalPoint(new mxPoint(50, 0), false);
      cell.geometry.points = [new mxPoint(50, 50), new mxPoint(0, 0)];
      cell.geometry.relative = true;
      cell.edge = true;

      return this.createEdgeTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Curve",
      );
    });
  }
}
