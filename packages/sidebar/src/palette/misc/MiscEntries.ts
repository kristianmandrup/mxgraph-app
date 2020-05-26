import mx from "@mxgraph-app/mx";
const { mxGeometry, mxCell } = mx;
import { MiscPalette } from "./MiscPalette";

export class MiscEntries extends MiscPalette {
  get hyperLink() {
    return this.addEntry("link hyperlink", () => {
      var cell = new mxCell(
        "Link",
        new mxGeometry(0, 0, 60, 40),
        "text;html=1;strokeColor=none;fillColor=none;whiteSpace=wrap;align=center;verticalAlign=middle;fontColor=#0000EE;fontStyle=4;",
      );
      cell.vertex = true;
      this.graph.setLinkForCell(cell, "https://www.draw.io");

      return this.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Link",
      );
    });
  }

  get timestamp() {
    return this.addEntry("timestamp date time text label", () => {
      var cell = new mxCell(
        "%date{ddd mmm dd yyyy HH:MM:ss}%",
        new mxGeometry(0, 0, 160, 20),
        "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;",
      );
      cell.vertex = true;
      this.graph.setAttributeForCell(cell, "placeholders", "1");

      return this.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Timestamp",
      );
    });
  }

  get variable() {
    return this.addEntry(
      "variable placeholder metadata hello world text label",
      () => {
        var cell = new mxCell(
          "%name% Text",
          new mxGeometry(0, 0, 80, 20),
          "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;",
        );
        cell.vertex = true;
        this.graph.setAttributeForCell(cell, "placeholders", "1");
        this.graph.setAttributeForCell(cell, "name", "Variable");

        return this.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "Variable",
        );
      },
    );
  }

  get shapeGroup() {
    const { sb } = this;
    return this.addEntry("shape group container", () => {
      var cell = new mxCell(
        "Label",
        new mxGeometry(0, 0, 160, 70),
        "html=1;whiteSpace=wrap;container=1;recursiveResize=0;collapsible=0;",
      );
      cell.vertex = true;

      var symbol = new mxCell(
        "",
        new mxGeometry(20, 20, 20, 30),
        "triangle;html=1;whiteSpace=wrap;",
      );
      symbol.vertex = true;
      cell.insert(symbol);

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Shape Group",
      );
    });
  }
}
