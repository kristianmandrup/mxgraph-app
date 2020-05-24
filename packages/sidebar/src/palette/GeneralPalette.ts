import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "./AbstractPalette";
const { mxCell, mxGeometry, mxPoint, mxResources } = mx;

export class GeneralPalette extends AbstractPalette {
  /**
   * Adds the general palette to the sidebar.
   */
  addGeneralPalette(expand) {
    var lineTags =
      "line lines connector connectors connection connections arrow arrows ";

    var fns = [
      this.createVertexTemplateEntry(
        "rounded=0;whiteSpace=wrap;html=1;",
        120,
        60,
        "",
        "Rectangle",
        null,
        null,
        "rect rectangle box"
      ),
      this.createVertexTemplateEntry(
        "rounded=1;whiteSpace=wrap;html=1;",
        120,
        60,
        "",
        "Rounded Rectangle",
        null,
        null,
        "rounded rect rectangle box"
      ),
      // Explicit strokecolor/fillcolor=none is a workaround to maintain transparent background regardless of current style
      this.createVertexTemplateEntry(
        "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;",
        40,
        20,
        "Text",
        "Text",
        null,
        null,
        "text textbox textarea label"
      ),
      this.createVertexTemplateEntry(
        "text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;",
        190,
        120,
        "<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
        "Textbox",
        null,
        null,
        "text textbox textarea"
      ),
      this.createVertexTemplateEntry(
        "ellipse;whiteSpace=wrap;html=1;",
        120,
        80,
        "",
        "Ellipse",
        null,
        null,
        "oval ellipse state"
      ),
      this.createVertexTemplateEntry(
        "whiteSpace=wrap;html=1;aspect=fixed;",
        80,
        80,
        "",
        "Square",
        null,
        null,
        "square"
      ),
      this.createVertexTemplateEntry(
        "ellipse;whiteSpace=wrap;html=1;aspect=fixed;",
        80,
        80,
        "",
        "Circle",
        null,
        null,
        "circle"
      ),
      this.createVertexTemplateEntry(
        "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;",
        120,
        60,
        "",
        "Process",
        null,
        null,
        "process task"
      ),
      this.createVertexTemplateEntry(
        "rhombus;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Diamond",
        null,
        null,
        "diamond rhombus if condition decision conditional question test"
      ),
      this.createVertexTemplateEntry(
        "shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;",
        120,
        60,
        "",
        "Parallelogram"
      ),
      this.createVertexTemplateEntry(
        "shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;",
        120,
        80,
        "",
        "Hexagon",
        null,
        null,
        "hexagon preparation"
      ),
      this.createVertexTemplateEntry(
        "triangle;whiteSpace=wrap;html=1;",
        60,
        80,
        "",
        "Triangle",
        null,
        null,
        "triangle logic inverter buffer"
      ),
      this.createVertexTemplateEntry(
        "shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;",
        60,
        80,
        "",
        "Cylinder",
        null,
        null,
        "cylinder data database"
      ),
      this.createVertexTemplateEntry(
        "ellipse;shape=cloud;whiteSpace=wrap;html=1;",
        120,
        80,
        "",
        "Cloud",
        null,
        null,
        "cloud network"
      ),
      this.createVertexTemplateEntry(
        "shape=document;whiteSpace=wrap;html=1;boundedLbl=1;",
        120,
        80,
        "",
        "Document"
      ),
      this.createVertexTemplateEntry(
        "shape=internalStorage;whiteSpace=wrap;html=1;backgroundOutline=1;",
        80,
        80,
        "",
        "Internal Storage"
      ),
      this.createVertexTemplateEntry(
        "shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;",
        120,
        80,
        "",
        "Cube"
      ),
      this.createVertexTemplateEntry(
        "shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;",
        120,
        80,
        "",
        "Step"
      ),
      this.createVertexTemplateEntry(
        "shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;",
        120,
        60,
        "",
        "Trapezoid"
      ),
      this.createVertexTemplateEntry(
        "shape=tape;whiteSpace=wrap;html=1;",
        120,
        100,
        "",
        "Tape"
      ),
      this.createVertexTemplateEntry(
        "shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;",
        80,
        100,
        "",
        "Note"
      ),
      this.createVertexTemplateEntry(
        "shape=card;whiteSpace=wrap;html=1;",
        80,
        100,
        "",
        "Card"
      ),
      this.createVertexTemplateEntry(
        "shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;",
        120,
        80,
        "",
        "Callout",
        null,
        null,
        "bubble chat thought speech message"
      ),
      this.createVertexTemplateEntry(
        "shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;outlineConnect=0;",
        30,
        60,
        "Actor",
        "Actor",
        false,
        null,
        "user person human stickman"
      ),
      this.createVertexTemplateEntry(
        "shape=xor;whiteSpace=wrap;html=1;",
        60,
        80,
        "",
        "Or",
        null,
        null,
        "logic or"
      ),
      this.createVertexTemplateEntry(
        "shape=or;whiteSpace=wrap;html=1;",
        60,
        80,
        "",
        "And",
        null,
        null,
        "logic and"
      ),
      this.createVertexTemplateEntry(
        "shape=dataStorage;whiteSpace=wrap;html=1;",
        100,
        80,
        "",
        "Data Storage"
      ),
      this.addEntry("curve", () => {
        var cell = new mxCell(
          "",
          new mxGeometry(0, 0, 50, 50),
          "curved=1;endArrow=classic;html=1;"
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
          "Curve"
        );
      }),
      this.createEdgeTemplateEntry(
        "shape=flexArrow;endArrow=classic;startArrow=classic;html=1;",
        50,
        50,
        "",
        "Bidirectional Arrow",
        null,
        lineTags + "bidirectional"
      ),
      this.createEdgeTemplateEntry(
        "shape=flexArrow;endArrow=classic;html=1;",
        50,
        50,
        "",
        "Arrow",
        null,
        lineTags + "directional directed"
      ),
      this.createEdgeTemplateEntry(
        "shape=link;html=1;",
        50,
        50,
        "",
        "Link",
        null,
        lineTags + "link"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=none;dashed=1;html=1;",
        50,
        50,
        "",
        "Dashed Line",
        null,
        lineTags + "dashed undirected no"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=none;html=1;",
        50,
        50,
        "",
        "Line",
        null,
        lineTags + "simple undirected plain blank no"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=classic;startArrow=classic;html=1;",
        50,
        50,
        "",
        "Bidirectional Connector",
        null,
        lineTags + "bidirectional"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=classic;html=1;",
        50,
        50,
        "",
        "Directional Connector",
        null,
        lineTags + "directional directed"
      ),
    ];

    this.addPaletteFunctions(
      "general",
      mxResources.get("general"),
      expand != null ? expand : true,
      fns
    );
  }
}
