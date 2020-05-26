import { UmlPalette } from "./UmlPalette";

export class UmlTemplateEntries extends UmlPalette {
  get objectInstance() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "html=1;",
      110,
      50,
      "Object",
      "Object",
      null,
      null,
      dt + "object instance",
    );
  }

  get interfaceObjectInstance() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "html=1;",
      110,
      50,
      "&laquo;interface&raquo;<br><b>Name</b>",
      "Interface",
      null,
      null,
      dt + "interface object instance annotated annotation",
    );
  }

  get titleLabel() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "text;align=center;fontStyle=1;verticalAlign=middle;spacingLeft=3;spacingRight=3;strokeColor=none;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;",
      80,
      26,
      "Title",
      "Title",
      null,
      null,
      dt + "title label",
    );
  }

  get block() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "verticalAlign=top;align=left;spacingTop=8;spacingLeft=2;spacingRight=12;shape=cube;size=10;direction=south;fontStyle=4;html=1;",
      180,
      120,
      "Block",
      "Block",
      null,
      null,
      dt + "block",
    );
  }

  get moduleComponent() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "shape=module;align=left;spacingLeft=20;align=center;verticalAlign=top;",
      100,
      50,
      "Module",
      "Module",
      null,
      null,
      dt + "module component",
    );
  }

  get $package() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "shape=folder;fontStyle=1;spacingTop=10;tabWidth=40;tabHeight=14;tabPosition=left;html=1;",
      70,
      50,
      "package",
      "Package",
      null,
      null,
      dt + "package",
    );
  }

  get objectInstance3() {
    const { dt } = this;
    return this.createVertexTemplateEntry(
      "verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;",
      160,
      90,
      '<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;"><b>Object:Type</b></p><hr/>' +
        '<p style="margin:0px;margin-left:8px;">field1 = value1<br/>field2 = value2<br>field3 = value3</p>',
      "Object",
      null,
      null,
      dt + "object instance",
    );
  }
  get erEntityTabel() {
    return this.createVertexTemplateEntry(
      "verticalAlign=top;align=left;overflow=fill;html=1;",
      180,
      90,
      '<div style="box-sizing:border-box;width:100%;background:#e4e4e4;padding:2px;">Tablename</div>' +
        '<table style="width:100%;font-size:1em;" cellpadding="2" cellspacing="0">' +
        "<tr><td>PK</td><td>uniqueId</td></tr><tr><td>FK1</td><td>" +
        "foreignKey</td></tr><tr><td></td><td>fieldname</td></tr></table>",
      "Entity",
      null,
      null,
      "er entity table",
    );
  }

  get requiredInterfaceLollipop() {
    return this.createVertexTemplateEntry(
      "shape=providedRequiredInterface;html=1;verticalLabelPosition=bottom;",
      20,
      20,
      "",
      "Provided/Required Interface",
      null,
      null,
      "uml provided required interface lollipop notation",
    );
  }

  get boundaryObject() {
    return this.createVertexTemplateEntry(
      "shape=umlBoundary;whiteSpace=wrap;html=1;",
      100,
      80,
      "Boundary Object",
      "Boundary Object",
      null,
      null,
      "uml boundary object",
    );
  }
  get entityObject() {
    return this.createVertexTemplateEntry(
      "ellipse;shape=umlEntity;whiteSpace=wrap;html=1;",
      80,
      80,
      "Entity Object",
      "Entity Object",
      null,
      null,
      "uml entity object",
    );
  }
  get controlObject() {
    return this.createVertexTemplateEntry(
      "ellipse;shape=umlControl;whiteSpace=wrap;html=1;",
      70,
      80,
      "Control Object",
      "Control Object",
      null,
      null,
      "uml control object",
    );
  }

  get actor() {
    return this.createVertexTemplateEntry(
      "shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;",
      30,
      60,
      "Actor",
      "Actor",
      false,
      null,
      "uml actor",
    );
  }

  get useCase() {
    return this.createVertexTemplateEntry(
      "ellipse;whiteSpace=wrap;html=1;",
      140,
      70,
      "Use Case",
      "Use Case",
      null,
      null,
      "uml use case usecase",
    );
  }

  get activityStateEnd() {
    return this.createVertexTemplateEntry(
      "ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#ff0000;",
      30,
      30,
      "",
      "End",
      null,
      null,
      "uml activity state end",
    );
  }

  get lifeline() {
    return this.createVertexTemplateEntry(
      "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;",
      100,
      300,
      ":Object",
      "Lifeline",
      null,
      null,
      "uml sequence participant lifeline",
    );
  }

  get actorLifeline() {
    return this.createVertexTemplateEntry(
      "shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
      20,
      300,
      "",
      "Actor Lifeline",
      null,
      null,
      "uml sequence participant lifeline actor",
    );
  }

  get boundaryLifeline() {
    return this.createVertexTemplateEntry(
      "shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
      50,
      300,
      "",
      "Boundary Lifeline",
      null,
      null,
      "uml sequence participant lifeline boundary",
    );
  }

  get entityLifeline() {
    return this.createVertexTemplateEntry(
      "shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
      40,
      300,
      "",
      "Entity Lifeline",
      null,
      null,
      "uml sequence participant lifeline entity",
    );
  }

  get controlLifeline() {
    return this.createVertexTemplateEntry(
      "shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;",
      40,
      300,
      "",
      "Control Lifeline",
      null,
      null,
      "uml sequence participant lifeline control",
    );
  }

  get frame() {
    return this.createVertexTemplateEntry(
      "shape=umlFrame;whiteSpace=wrap;html=1;",
      300,
      200,
      "frame",
      "Frame",
      null,
      null,
      "uml sequence frame",
    );
  }

  get destruction() {
    return this.createVertexTemplateEntry(
      "shape=umlDestroy;whiteSpace=wrap;html=1;strokeWidth=3;",
      30,
      30,
      "",
      "Destruction",
      null,
      null,
      "uml sequence destruction destroy",
    );
  }

  get note() {
    return this.createVertexTemplateEntry(
      "shape=note;whiteSpace=wrap;html=1;size=14;verticalAlign=top;align=left;spacingTop=-6;",
      100,
      70,
      "Note",
      "Note",
      null,
      null,
      "uml note",
    );
  }

  get sequenceActivation() {
    return this.createVertexTemplateEntry(
      "html=1;points=[];perimeter=orthogonalPerimeter;",
      10,
      80,
      "",
      "Activation",
      null,
      null,
      "uml sequence activation",
    );
  }

  get dispatchMessage1() {
    return this.createEdgeTemplateEntry(
      "html=1;verticalAlign=bottom;startArrow=oval;startFill=1;endArrow=block;startSize=8;",
      60,
      0,
      "dispatch",
      "Found Message 1",
      null,
      "uml sequence message call invoke dispatch",
    );
  }

  get dispatchMessage2() {
    return this.createEdgeTemplateEntry(
      "html=1;verticalAlign=bottom;startArrow=circle;startFill=1;endArrow=open;startSize=6;endSize=8;",
      80,
      0,
      "dispatch",
      "Found Message 2",
      null,
      "uml sequence message call invoke dispatch",
    );
  }

  get dispatchMessage() {
    return this.createEdgeTemplateEntry(
      "html=1;verticalAlign=bottom;endArrow=block;",
      80,
      0,
      "dispatch",
      "Message",
      null,
      "uml sequence message call invoke dispatch",
    );
  }

  get dependencyUse() {
    return this.createEdgeTemplateEntry(
      "endArrow=open;endSize=12;dashed=1;html=1;",
      160,
      0,
      "Use",
      "Dependency",
      null,
      "uml dependency use",
    );
  }

  get generalization() {
    return this.createEdgeTemplateEntry(
      "endArrow=block;endSize=16;endFill=0;html=1;",
      160,
      0,
      "Extends",
      "Generalization",
      null,
      "uml generalization extend",
    );
  }

  get association2() {
    return this.createEdgeTemplateEntry(
      "endArrow=block;startArrow=block;endFill=1;startFill=1;html=1;",
      160,
      0,
      "",
      "Association 2",
      null,
      "uml association",
    );
  }

  get innerClass() {
    return this.createEdgeTemplateEntry(
      "endArrow=open;startArrow=circlePlus;endFill=0;startFill=0;endSize=8;html=1;",
      160,
      0,
      "",
      "Inner Class",
      null,
      "uml inner class",
    );
  }

  get terminate() {
    return this.createEdgeTemplateEntry(
      "endArrow=open;startArrow=cross;endFill=0;startFill=0;endSize=8;startSize=10;html=1;",
      160,
      0,
      "",
      "Terminate",
      null,
      "uml terminate",
    );
  }

  get implementation() {
    return this.createEdgeTemplateEntry(
      "endArrow=block;dashed=1;endFill=0;endSize=12;html=1;",
      160,
      0,
      "",
      "Implementation",
      null,
      "uml realization implementation",
    );
  }

  get aggregation2() {
    return this.createEdgeTemplateEntry(
      "endArrow=diamondThin;endFill=0;endSize=24;html=1;",
      160,
      0,
      "",
      "Aggregation 2",
      null,
      "uml aggregation",
    );
  }

  get composition2() {
    return this.createEdgeTemplateEntry(
      "endArrow=diamondThin;endFill=1;endSize=24;html=1;",
      160,
      0,
      "",
      "Composition 2",
      null,
      "uml composition",
    );
  }

  get association3() {
    return this.createEdgeTemplateEntry(
      "endArrow=open;endFill=1;endSize=12;html=1;",
      160,
      0,
      "",
      "Association 3",
      null,
      "uml association",
    );
  }
}
