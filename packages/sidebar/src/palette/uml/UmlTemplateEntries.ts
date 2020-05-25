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
      dt + "object instance"
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
      dt + "interface object instance annotated annotation"
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
      dt + "title label"
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
      dt + "block"
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
      dt + "module component"
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
      dt + "package"
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
      dt + "object instance"
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
      "er entity table"
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
      "uml provided required interface lollipop notation"
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
      "uml boundary object"
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
      "uml entity object"
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
      "uml control object"
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
      "uml actor"
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
      "uml use case usecase"
    );
  }
}
