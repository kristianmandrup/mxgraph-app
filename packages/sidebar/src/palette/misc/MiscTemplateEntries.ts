import { MiscPalette } from "./MiscPalette";

export class MiscTemplateEntries extends MiscPalette {
  get textHeadingTitle() {
    return this.createVertexTemplateEntry(
      "text;strokeColor=none;fillColor=none;html=1;fontSize=24;fontStyle=1;verticalAlign=middle;align=center;",
      100,
      40,
      "Title",
      "Title",
      null,
      null,
      "text heading title",
    );
  }

  get unorderedList() {
    return this.createVertexTemplateEntry(
      "text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;",
      100,
      80,
      "<ul><li>Value 1</li><li>Value 2</li><li>Value 3</li></ul>",
      "Unordered List",
    );
  }

  get orderedList() {
    return this.createVertexTemplateEntry(
      "text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;",
      100,
      80,
      "<ol><li>Value 1</li><li>Value 2</li><li>Value 3</li></ol>",
      "Ordered List",
    );
  }

  get table1() {
    return this.createVertexTemplateEntry(
      "text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;",
      280,
      160,
      '<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr style="background-color:#A7C942;color:#ffffff;border:1px solid #98bf21;"><th align="left">Title 1</th><th align="left">Title 2</th><th align="left">Title 3</th></tr>' +
        '<tr style="border:1px solid #98bf21;"><td>Value 1</td><td>Value 2</td><td>Value 3</td></tr>' +
        '<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 4</td><td>Value 5</td><td>Value 6</td></tr>' +
        '<tr style="border:1px solid #98bf21;"><td>Value 7</td><td>Value 8</td><td>Value 9</td></tr>' +
        '<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 10</td><td>Value 11</td><td>Value 12</td></tr></table>',
      "Table 1",
    );
  }

  get table2() {
    return this.createVertexTemplateEntry(
      "text;html=1;strokeColor=#c0c0c0;fillColor=none;overflow=fill;",
      180,
      140,
      '<table border="0" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
        '<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
        '<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>',
      "Table 2",
    );
  }

  get table3() {
    return this.createVertexTemplateEntry(
      "text;html=1;strokeColor=none;fillColor=none;overflow=fill;",
      180,
      140,
      '<table border="1" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
        '<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
        '<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>',
      "Table 3",
    );
  }

  get table4() {
    return this.createVertexTemplateEntry(
      "text;html=1;strokeColor=none;fillColor=none;overflow=fill;",
      160,
      140,
      '<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr><th align="center"><b>Title</b></th></tr>' +
        '<tr><td align="center">Section 1.1\nSection 1.2\nSection 1.3</td></tr>' +
        '<tr><td align="center">Section 2.1\nSection 2.2\nSection 2.3</td></tr></table>',
      "Table 4",
    );
  }

  get doubleRect() {
    return this.createVertexTemplateEntry(
      "shape=ext;double=1;rounded=0;whiteSpace=wrap;html=1;",
      120,
      80,
      "",
      "Double Rectangle",
      null,
      null,
      "rect rectangle box double",
    );
  }

  get roundedRectDouble() {
    return this.createVertexTemplateEntry(
      "shape=ext;double=1;rounded=1;whiteSpace=wrap;html=1;",
      120,
      80,
      "",
      "Double Rounded Rectangle",
      null,
      null,
      "rounded rect rectangle box double",
    );
  }

  get doubleEllipsis() {
    return this.createVertexTemplateEntry(
      "ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;",
      100,
      60,
      "",
      "Double Ellipse",
      null,
      null,
      "oval ellipse start end state double",
    );
  }

  get doubleSquare() {
    return this.createVertexTemplateEntry(
      "shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;",
      80,
      80,
      "",
      "Double Square",
      null,
      null,
      "double square",
    );
  }

  get doubleCircle() {
    return this.createVertexTemplateEntry(
      "ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;",
      80,
      80,
      "",
      "Double Circle",
      null,
      null,
      "double circle",
    );
  }

  get comicArrow() {
    return this.createEdgeTemplateEntry(
      "rounded=0;comic=1;strokeWidth=2;endArrow=blockThin;html=1;fontFamily=Comic Sans MS;fontStyle=1;",
      50,
      50,
      "",
      "Comic Arrow",
    );
  }

  get comicRectangle() {
    return this.createVertexTemplateEntry(
      "html=1;whiteSpace=wrap;comic=1;strokeWidth=2;fontFamily=Comic Sans MS;fontStyle=1;",
      120,
      60,
      "RECTANGLE",
      "Comic Rectangle",
      true,
      null,
      "comic rectangle rect box text retro",
    );
  }
  get comicDiamond() {
    return this.createVertexTemplateEntry(
      "rhombus;html=1;align=center;whiteSpace=wrap;comic=1;strokeWidth=2;fontFamily=Comic Sans MS;fontStyle=1;",
      100,
      100,
      "DIAMOND",
      "Comic Diamond",
      true,
      null,
      "comic diamond rhombus if condition decision conditional question test retro",
    );
  }
  get isometricSquare() {
    return this.createVertexTemplateEntry(
      "html=1;whiteSpace=wrap;aspect=fixed;shape=isoRectangle;",
      150,
      90,
      "",
      "Isometric Square",
      true,
      null,
      "rectangle rect box iso isometric",
    );
  }
  get cubeBoxIsometric() {
    return this.createVertexTemplateEntry(
      "html=1;whiteSpace=wrap;aspect=fixed;shape=isoCube;backgroundOutline=1;",
      90,
      100,
      "",
      "Isometric Cube",
      true,
      null,
      "cube box iso isometric",
    );
  }
  get isometricEdge1() {
    return this.createEdgeTemplateEntry(
      "edgeStyle=isometricEdgeStyle;endArrow=none;html=1;",
      50,
      100,
      "",
      "Isometric Edge 1",
    );
  }
  get isometricEdge2() {
    return this.createEdgeTemplateEntry(
      "edgeStyle=isometricEdgeStyle;endArrow=none;html=1;elbow=vertical;",
      50,
      100,
      "",
      "Isometric Edge 2",
    );
  }
  get curlyBracket() {
    return this.createVertexTemplateEntry(
      "shape=curlyBracket;whiteSpace=wrap;html=1;rounded=1;",
      20,
      120,
      "",
      "Curly Bracket",
    );
  }
  get horizontalLine() {
    return this.createVertexTemplateEntry(
      "line;strokeWidth=2;html=1;",
      160,
      10,
      "",
      "Horizontal Line",
    );
  }
  get verticalLine() {
    return this.createVertexTemplateEntry(
      "line;strokeWidth=2;direction=south;html=1;",
      10,
      160,
      "",
      "Vertical Line",
    );
  }
  get horizontalBackbone() {
    return this.createVertexTemplateEntry(
      "line;strokeWidth=4;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;",
      160,
      10,
      "",
      "Horizontal Backbone",
      false,
      null,
      "backbone bus network",
    );
  }
  get verticalBackbone() {
    return this.createVertexTemplateEntry(
      "line;strokeWidth=4;direction=south;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;",
      10,
      160,
      "",
      "Vertical Backbone",
      false,
      null,
      "backbone bus network",
    );
  }
  get crossbar() {
    return this.createVertexTemplateEntry(
      "shape=crossbar;whiteSpace=wrap;html=1;rounded=1;",
      120,
      20,
      "",
      "Crossbar",
      false,
      null,
      "crossbar distance measure dimension unit",
    );
  }
  get fixedImage() {
    return this.createVertexTemplateEntry(
      "shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=1;aspect=fixed;image=" +
        this.gearImage,
      52,
      61,
      "",
      "Image (Fixed Aspect)",
      false,
      null,
      "fixed image icon symbol",
    );
  }
  get stretchedImage() {
    return this.createVertexTemplateEntry(
      "shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=0;image=" +
        this.gearImage,
      50,
      60,
      "",
      "Image (Variable Aspect)",
      false,
      null,
      "strechted image icon symbol",
    );
  }
  get iconImageSymbol() {
    return this.createVertexTemplateEntry(
      "icon;html=1;image=" + this.gearImage,
      60,
      60,
      "Icon",
      "Icon",
      false,
      null,
      "icon image symbol",
    );
  }
  get imageIconLabel1() {
    return this.createVertexTemplateEntry(
      "label;whiteSpace=wrap;html=1;image=" + this.gearImage,
      140,
      60,
      "Label",
      "Label 1",
      null,
      null,
      "label image icon symbol",
    );
  }
  get imageIconLabel2() {
    return this.createVertexTemplateEntry(
      "label;whiteSpace=wrap;html=1;align=center;verticalAlign=bottom;spacingLeft=0;spacingBottom=4;imageAlign=center;imageVerticalAlign=top;image=" +
        this.gearImage,
      120,
      80,
      "Label",
      "Label 2",
      null,
      null,
      "label image icon symbol",
    );
  }

  get partialRectangle1() {
    return this.createVertexTemplateEntry(
      "shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;fillColor=none;",
      120,
      60,
      "",
      "Partial Rectangle 1",
    );
  }
  get partialRectangle2() {
    return this.createVertexTemplateEntry(
      "shape=partialRectangle;whiteSpace=wrap;html=1;bottom=1;right=1;left=1;top=0;fillColor=none;routingCenterX=-0.5;",
      120,
      60,
      "",
      "Partial Rectangle 2",
    );
  }
  get manualLine() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "edgeStyle=segmentEdgeStyle;endArrow=classic;html=1;",
      50,
      50,
      "",
      "Manual Line",
      null,
      lineTags + "manual",
    );
  }
  get filledEdge() {
    return this.createEdgeTemplateEntry(
      "shape=filledEdge;rounded=0;fixDash=1;endArrow=none;strokeWidth=10;fillColor=#ffffff;edgeStyle=orthogonalEdgeStyle;",
      60,
      40,
      "",
      "Filled Edge",
    );
  }
  get horizontalElbow() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "edgeStyle=elbowEdgeStyle;elbow=horizontal;endArrow=classic;html=1;",
      50,
      50,
      "",
      "Horizontal Elbow",
      null,
      lineTags + "elbow horizontal",
    );
  }
  get verticalElbow() {
    const { lineTags } = this;
    return this.createEdgeTemplateEntry(
      "edgeStyle=elbowEdgeStyle;elbow=vertical;endArrow=classic;html=1;",
      50,
      50,
      "",
      "Vertical Elbow",
      null,
      lineTags + "elbow vertical",
    );
  }
}
