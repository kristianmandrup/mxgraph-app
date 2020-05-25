import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "../AbstractPalette";
import { UmlTemplateEntries } from "./UmlTemplateEntries";
import { UmlEntries } from "./UmlEntries";
const { mxPoint, mxCell, mxGeometry, mxResources } = mx;

export class UmlPalette extends AbstractPalette {
  gearImage: any;

  _divider: any;
  _field: any;

  /**
   * Adds the general palette to the sidebar.
   */
  addUmlPalette(expand) {
    // Avoids having to bind all functions to "this"
    var sb = this;

    const templateEntries = new UmlTemplateEntries();
    const entries = new UmlEntries();

    const {
      objectInstance,
      interfaceObjectInstance,
      titleLabel,
      block,
      moduleComponent,
      $package,
      objectInstance3,
      erEntityTabel,
      requiredInterfaceLollipop,
      boundaryObject,
      entityObject,
      controlObject,
      actor,
      useCase,
    } = templateEntries;

    const {
      objectInstanceEntry,
      sectionSubsection,
      itemMemberMethod1,
      itemMemberMethod2,
      dividerHlineSeparator,
      spacerSpaceGapSeparator,
      component,
      componentWithAttributtes,
      objectInstanceClass3,
      objectInstanceClass4,
      objectInstanceClass5,
      objectInstanceInterface2,
      lollipopNotation,
    } = entries;

    var fns = [
      objectInstance,
      interfaceObjectInstance,
      objectInstanceEntry,
      sectionSubsection,
      itemMemberMethod1,
      itemMemberMethod2,
      dividerHlineSeparator,
      spacerSpaceGapSeparator,
      titleLabel,
      component,
      componentWithAttributtes,
      block,
      moduleComponent,
      $package,
      objectInstance3,
      erEntityTabel,
      objectInstanceClass3,
      objectInstanceClass4,
      objectInstanceClass5,
      objectInstanceInterface2,
      requiredInterfaceLollipop,
      lollipopNotation,
      boundaryObject,
      entityObject,
      controlObject,
      actor,
      useCase,
      this.addEntry("uml activity state start", function () {
        var cell = new mxCell(
          "",
          new mxGeometry(0, 0, 30, 30),
          "ellipse;html=1;shape=startState;fillColor=#000000;strokeColor=#ff0000;"
        );
        cell.vertex = true;

        var edge = new mxCell(
          "",
          new mxGeometry(0, 0, 0, 0),
          "edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(15, 90), false);
        edge.geometry.relative = true;
        edge.edge = true;

        cell.insertEdge(edge, true);

        return sb.createVertexTemplateFromCells([cell, edge], 30, 90, "Start");
      }),
      this.addEntry("uml activity state", function () {
        var cell = new mxCell(
          "Activity",
          new mxGeometry(0, 0, 120, 40),
          "rounded=1;whiteSpace=wrap;html=1;arcSize=40;fontColor=#000000;fillColor=#ffffc0;strokeColor=#ff0000;"
        );
        cell.vertex = true;

        var edge = new mxCell(
          "",
          new mxGeometry(0, 0, 0, 0),
          "edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(60, 100), false);
        edge.geometry.relative = true;
        edge.edge = true;

        cell.insertEdge(edge, true);

        return sb.createVertexTemplateFromCells(
          [cell, edge],
          120,
          100,
          "Activity"
        );
      }),
      this.addEntry("uml activity composite state", function () {
        var cell = new mxCell(
          "Composite State",
          new mxGeometry(0, 0, 160, 60),
          "swimlane;html=1;fontStyle=1;align=center;verticalAlign=middle;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=0;resizeLast=1;container=0;fontColor=#000000;collapsible=0;rounded=1;arcSize=30;strokeColor=#ff0000;fillColor=#ffffc0;swimlaneFillColor=#ffffc0;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "Subtitle",
          new mxGeometry(0, 0, 200, 26),
          "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;fontColor=#000000;"
        );
        cell1.vertex = true;
        cell.insert(cell1);

        var edge = new mxCell(
          "",
          new mxGeometry(0, 0, 0, 0),
          "edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(80, 120), false);
        edge.geometry.relative = true;
        edge.edge = true;

        cell.insertEdge(edge, true);

        return sb.createVertexTemplateFromCells(
          [cell, edge],
          160,
          120,
          "Composite State"
        );
      }),
      this.addEntry("uml activity condition", function () {
        var cell = new mxCell(
          "Condition",
          new mxGeometry(0, 0, 80, 40),
          "rhombus;whiteSpace=wrap;html=1;fillColor=#ffffc0;strokeColor=#ff0000;"
        );
        cell.vertex = true;

        var edge1 = new mxCell(
          "no",
          new mxGeometry(0, 0, 0, 0),
          "edgeStyle=orthogonalEdgeStyle;html=1;align=left;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;"
        );
        edge1.geometry.setTerminalPoint(new mxPoint(180, 20), false);
        edge1.geometry.relative = true;
        edge1.geometry.x = -1;
        edge1.edge = true;

        cell.insertEdge(edge1, true);

        var edge2 = new mxCell(
          "yes",
          new mxGeometry(0, 0, 0, 0),
          "edgeStyle=orthogonalEdgeStyle;html=1;align=left;verticalAlign=top;endArrow=open;endSize=8;strokeColor=#ff0000;"
        );
        edge2.geometry.setTerminalPoint(new mxPoint(40, 100), false);
        edge2.geometry.relative = true;
        edge2.geometry.x = -1;
        edge2.edge = true;

        cell.insertEdge(edge2, true);

        return sb.createVertexTemplateFromCells(
          [cell, edge1, edge2],
          180,
          100,
          "Condition"
        );
      }),
      this.addEntry("uml activity fork join", function () {
        var cell = new mxCell(
          "",
          new mxGeometry(0, 0, 200, 10),
          "shape=line;html=1;strokeWidth=6;strokeColor=#ff0000;"
        );
        cell.vertex = true;

        var edge = new mxCell(
          "",
          new mxGeometry(0, 0, 0, 0),
          "edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(100, 80), false);
        edge.geometry.relative = true;
        edge.edge = true;

        cell.insertEdge(edge, true);

        return sb.createVertexTemplateFromCells(
          [cell, edge],
          200,
          80,
          "Fork/Join"
        );
      }),
      this.createVertexTemplateEntry(
        "ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#ff0000;",
        30,
        30,
        "",
        "End",
        null,
        null,
        "uml activity state end"
      ),
      this.createVertexTemplateEntry(
        "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;",
        100,
        300,
        ":Object",
        "Lifeline",
        null,
        null,
        "uml sequence participant lifeline"
      ),
      this.createVertexTemplateEntry(
        "shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
        20,
        300,
        "",
        "Actor Lifeline",
        null,
        null,
        "uml sequence participant lifeline actor"
      ),
      this.createVertexTemplateEntry(
        "shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
        50,
        300,
        "",
        "Boundary Lifeline",
        null,
        null,
        "uml sequence participant lifeline boundary"
      ),
      this.createVertexTemplateEntry(
        "shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
        40,
        300,
        "",
        "Entity Lifeline",
        null,
        null,
        "uml sequence participant lifeline entity"
      ),
      this.createVertexTemplateEntry(
        "shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
        40,
        300,
        "",
        "Control Lifeline",
        null,
        null,
        "uml sequence participant lifeline control"
      ),
      this.createVertexTemplateEntry(
        "shape=umlFrame;whiteSpace=wrap;html=1;",
        300,
        200,
        "frame",
        "Frame",
        null,
        null,
        "uml sequence frame"
      ),
      this.createVertexTemplateEntry(
        "shape=umlDestroy;whiteSpace=wrap;html=1;strokeWidth=3;",
        30,
        30,
        "",
        "Destruction",
        null,
        null,
        "uml sequence destruction destroy"
      ),
      this.createVertexTemplateEntry(
        "shape=note;whiteSpace=wrap;html=1;size=14;verticalAlign=top;align=left;spacingTop=-6;",
        100,
        70,
        "Note",
        "Note",
        null,
        null,
        "uml note"
      ),
      this.addEntry(
        "uml sequence invoke invocation call activation",
        function () {
          var cell = new mxCell(
            "",
            new mxGeometry(0, 0, 10, 80),
            "html=1;points=[];perimeter=orthogonalPerimeter;"
          );
          cell.vertex = true;

          var edge = new mxCell(
            "dispatch",
            new mxGeometry(0, 0, 0, 0),
            "html=1;verticalAlign=bottom;startArrow=oval;endArrow=block;startSize=8;"
          );
          edge.geometry.setTerminalPoint(new mxPoint(-60, 0), true);
          edge.geometry.relative = true;
          edge.edge = true;

          cell.insertEdge(edge, false);

          return sb.createVertexTemplateFromCells(
            [cell, edge],
            10,
            80,
            "Found Message"
          );
        }
      ),
      this.addEntry(
        "uml sequence invoke call delegation synchronous invocation activation",
        function () {
          var cell = new mxCell(
            "",
            new mxGeometry(0, 0, 10, 80),
            "html=1;points=[];perimeter=orthogonalPerimeter;"
          );
          cell.vertex = true;

          var edge1 = new mxCell(
            "dispatch",
            new mxGeometry(0, 0, 0, 0),
            "html=1;verticalAlign=bottom;endArrow=block;entryX=0;entryY=0;"
          );
          edge1.geometry.setTerminalPoint(new mxPoint(-70, 0), true);
          edge1.geometry.relative = true;
          edge1.edge = true;

          cell.insertEdge(edge1, false);

          var edge2 = new mxCell(
            "return",
            new mxGeometry(0, 0, 0, 0),
            "html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;exitX=0;exitY=0.95;"
          );
          edge2.geometry.setTerminalPoint(new mxPoint(-70, 76), false);
          edge2.geometry.relative = true;
          edge2.edge = true;

          cell.insertEdge(edge2, true);

          return sb.createVertexTemplateFromCells(
            [cell, edge1, edge2],
            10,
            80,
            "Synchronous Invocation"
          );
        }
      ),
      this.addEntry(
        "uml sequence self call recursion delegation activation",
        function () {
          var cell = new mxCell(
            "",
            new mxGeometry(0, 20, 10, 40),
            "html=1;points=[];perimeter=orthogonalPerimeter;"
          );
          cell.vertex = true;

          var edge = new mxCell(
            "self call",
            new mxGeometry(0, 0, 0, 0),
            "edgeStyle=orthogonalEdgeStyle;html=1;align=left;spacingLeft=2;endArrow=block;rounded=0;entryX=1;entryY=0;"
          );
          edge.geometry.setTerminalPoint(new mxPoint(5, 0), true);
          edge.geometry.points = [new mxPoint(30, 0)];
          edge.geometry.relative = true;
          edge.edge = true;

          cell.insertEdge(edge, false);

          return sb.createVertexTemplateFromCells(
            [cell, edge],
            10,
            60,
            "Self Call"
          );
        }
      ),
      this.addEntry(
        "uml sequence invoke call delegation callback activation",
        function () {
          // TODO: Check if more entries should be converted to compressed XML
          return sb.createVertexTemplateFromData(
            "xZRNT8MwDIZ/Ta6oaymD47rBTkiTuMAxW6wmIm0q19s6fj1OE3V0Y2iCA4dK8euP2I+riGxedUuUjX52CqzIHkU2R+conKpuDtaKNDFKZAuRpgl/In264J303qSRCDVdk5CGhJ20WwhKEFo62ChoqritxURkReNMTa2X80LkC68AmgoIkEWHpF3pamlXR7WIFwASdBeb7KXY4RIc5+KBQ/ZGkY4RYY5Egyl1zLqLmmyDXQ6Zx4n5EIf+HkB2BmAjrV3LzftPIPw4hgNn1pQ1a2tH5Cp2QK1miG7vNeu4iJe4pdeY2BtvbCQDGlAljMCQxBJotJ8rWCFYSWY3LvUdmZi68rvkkLiU6QnL1m1xAzHoBOdw61WEb88II9AW67/ydQ2wq1Cy1aAGvOrFfPh6997qDA3g+dxzv3nIL6MPU/8T+kMw8+m4QPgdfrEJNo8PSQj/+s58Ag==",
            10,
            60,
            "Callback"
          );
        }
      ),
      this.createVertexTemplateEntry(
        "html=1;points=[];perimeter=orthogonalPerimeter;",
        10,
        80,
        "",
        "Activation",
        null,
        null,
        "uml sequence activation"
      ),
      this.createEdgeTemplateEntry(
        "html=1;verticalAlign=bottom;startArrow=oval;startFill=1;endArrow=block;startSize=8;",
        60,
        0,
        "dispatch",
        "Found Message 1",
        null,
        "uml sequence message call invoke dispatch"
      ),
      this.createEdgeTemplateEntry(
        "html=1;verticalAlign=bottom;startArrow=circle;startFill=1;endArrow=open;startSize=6;endSize=8;",
        80,
        0,
        "dispatch",
        "Found Message 2",
        null,
        "uml sequence message call invoke dispatch"
      ),
      this.createEdgeTemplateEntry(
        "html=1;verticalAlign=bottom;endArrow=block;",
        80,
        0,
        "dispatch",
        "Message",
        null,
        "uml sequence message call invoke dispatch"
      ),
      this.addEntry("uml sequence return message", function () {
        var edge = new mxCell(
          "return",
          new mxGeometry(0, 0, 0, 0),
          "html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(80, 0), true);
        edge.geometry.setTerminalPoint(new mxPoint(0, 0), false);
        edge.geometry.relative = true;
        edge.edge = true;

        return sb.createEdgeTemplateFromCells([edge], 80, 0, "Return");
      }),
      this.addEntry("uml relation", function () {
        var edge = new mxCell(
          "name",
          new mxGeometry(0, 0, 0, 0),
          "endArrow=block;endFill=1;html=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=top;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        edge.geometry.relative = true;
        edge.geometry.x = -1;
        edge.edge = true;

        var cell = new mxCell(
          "1",
          new mxGeometry(-1, 0, 0, 0),
          "resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;"
        );
        cell.geometry.relative = true;
        cell.setConnectable(false);
        cell.vertex = true;
        edge.insert(cell);

        return sb.createEdgeTemplateFromCells([edge], 160, 0, "Relation 1");
      }),
      this.addEntry("uml association", function () {
        var edge = new mxCell(
          "",
          new mxGeometry(0, 0, 0, 0),
          "endArrow=none;html=1;edgeStyle=orthogonalEdgeStyle;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        edge.geometry.relative = true;
        edge.edge = true;

        var cell1 = new mxCell(
          "parent",
          new mxGeometry(-1, 0, 0, 0),
          "resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;"
        );
        cell1.geometry.relative = true;
        cell1.setConnectable(false);
        cell1.vertex = true;
        edge.insert(cell1);

        var cell2 = new mxCell(
          "child",
          new mxGeometry(1, 0, 0, 0),
          "resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;"
        );
        cell2.geometry.relative = true;
        cell2.setConnectable(false);
        cell2.vertex = true;
        edge.insert(cell2);

        return sb.createEdgeTemplateFromCells([edge], 160, 0, "Association 1");
      }),
      this.addEntry("uml aggregation", function () {
        var edge = new mxCell(
          "1",
          new mxGeometry(0, 0, 0, 0),
          "endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        edge.geometry.relative = true;
        edge.geometry.x = -1;
        edge.geometry.y = 3;
        edge.edge = true;

        return sb.createEdgeTemplateFromCells([edge], 160, 0, "Aggregation 1");
      }),
      this.addEntry("uml composition", function () {
        var edge = new mxCell(
          "1",
          new mxGeometry(0, 0, 0, 0),
          "endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        edge.geometry.relative = true;
        edge.geometry.x = -1;
        edge.geometry.y = 3;
        edge.edge = true;

        return sb.createEdgeTemplateFromCells([edge], 160, 0, "Composition 1");
      }),
      this.addEntry("uml relation", function () {
        var edge = new mxCell(
          "Relation",
          new mxGeometry(0, 0, 0, 0),
          "endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;"
        );
        edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
        edge.geometry.setTerminalPoint(new mxPoint(160, 0), false);
        edge.geometry.relative = true;
        edge.edge = true;

        var cell1 = new mxCell(
          "0..n",
          new mxGeometry(-1, 0, 0, 0),
          "resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10;"
        );
        cell1.geometry.relative = true;
        cell1.setConnectable(false);
        cell1.vertex = true;
        edge.insert(cell1);

        var cell2 = new mxCell(
          "1",
          new mxGeometry(1, 0, 0, 0),
          "resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10;"
        );
        cell2.geometry.relative = true;
        cell2.setConnectable(false);
        cell2.vertex = true;
        edge.insert(cell2);

        return sb.createEdgeTemplateFromCells([edge], 160, 0, "Relation 2");
      }),
      this.createEdgeTemplateEntry(
        "endArrow=open;endSize=12;dashed=1;html=1;",
        160,
        0,
        "Use",
        "Dependency",
        null,
        "uml dependency use"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=block;endSize=16;endFill=0;html=1;",
        160,
        0,
        "Extends",
        "Generalization",
        null,
        "uml generalization extend"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=block;startArrow=block;endFill=1;startFill=1;html=1;",
        160,
        0,
        "",
        "Association 2",
        null,
        "uml association"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=open;startArrow=circlePlus;endFill=0;startFill=0;endSize=8;html=1;",
        160,
        0,
        "",
        "Inner Class",
        null,
        "uml inner class"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=open;startArrow=cross;endFill=0;startFill=0;endSize=8;startSize=10;html=1;",
        160,
        0,
        "",
        "Terminate",
        null,
        "uml terminate"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=block;dashed=1;endFill=0;endSize=12;html=1;",
        160,
        0,
        "",
        "Implementation",
        null,
        "uml realization implementation"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=diamondThin;endFill=0;endSize=24;html=1;",
        160,
        0,
        "",
        "Aggregation 2",
        null,
        "uml aggregation"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=diamondThin;endFill=1;endSize=24;html=1;",
        160,
        0,
        "",
        "Composition 2",
        null,
        "uml composition"
      ),
      this.createEdgeTemplateEntry(
        "endArrow=open;endFill=1;endSize=12;html=1;",
        160,
        0,
        "",
        "Association 3",
        null,
        "uml association"
      ),
    ];

    this.addPaletteFunctions(
      "uml",
      mxResources.get("uml"),
      expand || false,
      fns
    );
  }

  get field() {
    this._field = this._field || this.createField();
    return this._field;
  }

  // Reusable cells
  createField() {
    var field = new mxCell(
      "+ field: type",
      new mxGeometry(0, 0, 100, 26),
      "text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;"
    );
    field.vertex = true;
    return field;
  }

  get divider() {
    this._divider = this._divider || this.createDivider();
    return this._divider;
  }

  createDivider() {
    var divider = new mxCell(
      "",
      new mxGeometry(0, 0, 40, 8),
      "line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;"
    );
    divider.vertex = true;
    return divider;
  }

  // Default tags
  dt = "uml static class ";
}
