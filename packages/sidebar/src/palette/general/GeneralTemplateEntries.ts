import { GeneralPalette } from "./GeneralPalette";

export class GeneralTemplateEntries extends GeneralPalette {
  get rectangle() {
    return this.createVertexTemplateEntry(
      "rounded=0;whiteSpace=wrap;html=1;",
      120,
      60,
      "",
      "Rectangle",
      null,
      null,
      "rect rectangle box",
    );
  }

  get roundedRectangle() {
    return this.createVertexTemplateEntry(
      "rounded=1;whiteSpace=wrap;html=1;",
      120,
      60,
      "",
      "Rounded Rectangle",
      null,
      null,
      "rounded rect rectangle box",
    );
  }

  get text() {
    return this.createVertexTemplateEntry(
      "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;",
      40,
      20,
      "Text",
      "Text",
      null,
      null,
      "text textbox textarea label",
    );
  }

  get textbox() {
    return this.createVertexTemplateEntry(
      "text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;",
      190,
      120,
      "<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
      "Textbox",
      null,
      null,
      "text textbox textarea",
    );
  }

  get ellipse() {
    return this.createVertexTemplateEntry(
      "ellipse;whiteSpace=wrap;html=1;",
      120,
      80,
      "",
      "Ellipse",
      null,
      null,
      "oval ellipse state",
    );
  }

  get square() {
    return this.createVertexTemplateEntry(
      "whiteSpace=wrap;html=1;aspect=fixed;",
      80,
      80,
      "",
      "Square",
      null,
      null,
      "square",
    );
  }

  get circle() {
    return this.createVertexTemplateEntry(
      "ellipse;whiteSpace=wrap;html=1;aspect=fixed;",
      80,
      80,
      "",
      "Circle",
      null,
      null,
      "circle",
    );
  }

  get process() {
    return this.createVertexTemplateEntry(
      "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;",
      120,
      60,
      "",
      "Process",
      null,
      null,
      "process task",
    );
  }

  get diamond() {
    return this.createVertexTemplateEntry(
      "rhombus;whiteSpace=wrap;html=1;",
      80,
      80,
      "",
      "Diamond",
      null,
      null,
      "diamond rhombus if condition decision conditional question test",
    );
  }

  get parallelogram() {
    return this.createVertexTemplateEntry(
      "shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;",
      120,
      60,
      "",
      "Parallelogram",
    );
  }

  get hexagon() {
    return this.createVertexTemplateEntry(
      "shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;",
      120,
      80,
      "",
      "Hexagon",
      null,
      null,
      "hexagon preparation",
    );
  }

  get triangle() {
    return this.createVertexTemplateEntry(
      "triangle;whiteSpace=wrap;html=1;",
      60,
      80,
      "",
      "Triangle",
      null,
      null,
      "triangle logic inverter buffer",
    );
  }

  get cylinder() {
    return this.createVertexTemplateEntry(
      "shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;",
      60,
      80,
      "",
      "Cylinder",
      null,
      null,
      "cylinder data database",
    );
  }

  get cloud() {
    return this.createVertexTemplateEntry(
      "ellipse;shape=cloud;whiteSpace=wrap;html=1;",
      120,
      80,
      "",
      "Cloud",
      null,
      null,
      "cloud network",
    );
  }

  get document() {
    return this.createVertexTemplateEntry(
      "shape=document;whiteSpace=wrap;html=1;boundedLbl=1;",
      120,
      80,
      "",
      "Document",
    );
  }

  get internalStorage() {
    return this.createVertexTemplateEntry(
      "shape=internalStorage;whiteSpace=wrap;html=1;backgroundOutline=1;",
      80,
      80,
      "",
      "Internal Storage",
    );
  }

  get cube() {
    return this.createVertexTemplateEntry(
      "shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;",
      120,
      80,
      "",
      "Cube",
    );
  }

  get step() {
    return this.createVertexTemplateEntry(
      "shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;",
      120,
      80,
      "",
      "Step",
    );
  }

  get trapezoid() {
    return this.createVertexTemplateEntry(
      "shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;",
      120,
      60,
      "",
      "Trapezoid",
    );
  }

  get tape() {
    return this.createVertexTemplateEntry(
      "shape=tape;whiteSpace=wrap;html=1;",
      120,
      100,
      "",
      "Tape",
    );
  }

  get note() {
    return this.createVertexTemplateEntry(
      "shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;",
      80,
      100,
      "",
      "Note",
    );
  }

  get card() {
    return this.createVertexTemplateEntry(
      "shape=card;whiteSpace=wrap;html=1;",
      80,
      100,
      "",
      "Card",
    );
  }

  get callout() {
    return this.createVertexTemplateEntry(
      "shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;",
      120,
      80,
      "",
      "Callout",
      null,
      null,
      "bubble chat thought speech message",
    );
  }

  get humanStickman() {
    return this.createVertexTemplateEntry(
      "shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;outlineConnect=0;",
      30,
      60,
      "Actor",
      "Actor",
      false,
      null,
      "user person human stickman",
    );
  }

  get logicOr() {
    return this.createVertexTemplateEntry(
      "shape=xor;whiteSpace=wrap;html=1;",
      60,
      80,
      "",
      "Or",
      null,
      null,
      "logic or",
    );
  }

  get logicAnd() {
    return this.createVertexTemplateEntry(
      "shape=or;whiteSpace=wrap;html=1;",
      60,
      80,
      "",
      "And",
      null,
      null,
      "logic and",
    );
  }

  get dataStorage() {
    return this.createVertexTemplateEntry(
      "shape=dataStorage;whiteSpace=wrap;html=1;",
      100,
      80,
      "",
      "Data Storage",
    );
  }

  get bidirectionalArrow() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "shape=flexArrow;endArrow=classic;startArrow=classic;html=1;",
      50,
      50,
      "",
      "Bidirectional Arrow",
      null,
      lineTags + "bidirectional",
    );
  }

  get directedArrow() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "shape=flexArrow;endArrow=classic;html=1;",
      50,
      50,
      "",
      "Arrow",
      null,
      lineTags + "directional directed",
    );
  }

  get link() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "shape=link;html=1;",
      50,
      50,
      "",
      "Link",
      null,
      lineTags + "link",
    );
  }

  get dashedLine() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "endArrow=none;dashed=1;html=1;",
      50,
      50,
      "",
      "Dashed Line",
      null,
      lineTags + "dashed undirected no",
    );
  }

  get line() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "endArrow=none;html=1;",
      50,
      50,
      "",
      "Line",
      null,
      lineTags + "simple undirected plain blank no",
    );
  }

  get bidirectionalConnector() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "endArrow=classic;startArrow=classic;html=1;",
      50,
      50,
      "",
      "Bidirectional Connector",
      null,
      lineTags + "bidirectional",
    );
  }

  get directionalConnector() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "endArrow=classic;html=1;",
      50,
      50,
      "",
      "Directional Connector",
      null,
      lineTags + "directional directed",
    );
  }
}
