import { UmlPalette } from "./UmlPalette";
import mx from "@mxgraph-app/mx";
const { mxPoint, mxCell, mxGeometry } = mx;

export class UmlEntries extends UmlPalette {
  get objectInstanceEntry() {
    const { dt, field, divider, sb } = this;
    return this.addEntry(dt + "object instance", function () {
      var cell = new mxCell(
        "Classname",
        new mxGeometry(0, 0, 160, 90),
        "swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
      );
      cell.vertex = true;
      cell.insert(field.clone());
      cell.insert(divider.clone());
      const cloned = sb.cloneCell(field, "+ method(type): type");
      cell.insert(cloned);

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Class"
      );
    });
  }

  get sectionSubsection() {
    const { dt, field, sb } = this;
    return this.addEntry(dt + "section subsection", function () {
      var cell = new mxCell(
        "Classname",
        new mxGeometry(0, 0, 140, 110),
        "swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
      );
      cell.vertex = true;
      cell.insert(field.clone());
      cell.insert(field.clone());
      cell.insert(field.clone());

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Class 2"
      );
    });
  }

  get itemMemberMethod1() {
    const { dt, field, sb } = this;
    return this.addEntry(
      dt + "item member method function variable field attribute label",
      function () {
        return sb.createVertexTemplateFromCells(
          [sb.cloneCell(field, "+ item: attribute")],
          field.geometry.width,
          field.geometry.height,
          "Item 1"
        );
      }
    );
  }

  get itemMemberMethod2() {
    const { dt, field, sb } = this;
    return this.addEntry(
      dt + "item member method function variable field attribute label",
      function () {
        var cell = new mxCell(
          "item: attribute",
          new mxGeometry(0, 0, 120, field.geometry.height),
          "label;fontStyle=0;strokeColor=none;fillColor=none;align=left;verticalAlign=top;overflow=hidden;" +
            "spacingLeft=28;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;imageWidth=16;imageHeight=16;image=" +
            sb.gearImage
        );
        cell.vertex = true;

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "Item 2"
        );
      }
    );
  }

  get dividerHlineSeparator() {
    const { dt, divider, sb } = this;
    return this.addEntry(dt + "divider hline line separator", function () {
      return sb.createVertexTemplateFromCells(
        [divider.clone()],
        divider.geometry.width,
        divider.geometry.height,
        "Divider"
      );
    });
  }

  get spacerSpaceGapSeparator() {
    const { dt, sb } = this;
    return this.addEntry(dt + "spacer space gap separator", function () {
      var cell = new mxCell(
        "",
        new mxGeometry(0, 0, 20, 14),
        "text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=4;spacingRight=4;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;"
      );
      cell.vertex = true;

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        "Spacer"
      );
    });
  }

  get component() {
    const { dt, sb } = this;
    return this.addEntry(dt + "component", function () {
      var cell = new mxCell(
        "&laquo;Annotation&raquo;<br/><b>Component</b>",
        new mxGeometry(0, 0, 180, 90),
        "html=1;dropTarget=0;"
      );
      cell.vertex = true;

      var symbol = new mxCell(
        "",
        new mxGeometry(1, 0, 20, 20),
        "shape=component;jettyWidth=8;jettyHeight=4;"
      );
      symbol.vertex = true;
      symbol.geometry.relative = true;
      symbol.geometry.offset = new mxPoint(-27, 7);
      cell.insert(symbol);

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Component"
      );
    });
  }

  get componentWithAttributtes() {
    const { dt, sb } = this;
    return this.addEntry(dt + "component", function () {
      var cell = new mxCell(
        '<p style="margin:0px;margin-top:6px;text-align:center;"><b>Component</b></p>' +
          '<hr/><p style="margin:0px;margin-left:8px;">+ Attribute1: Type<br/>+ Attribute2: Type</p>',
        new mxGeometry(0, 0, 180, 90),
        "align=left;overflow=fill;html=1;dropTarget=0;"
      );
      cell.vertex = true;

      var symbol = new mxCell(
        "",
        new mxGeometry(1, 0, 20, 20),
        "shape=component;jettyWidth=8;jettyHeight=4;"
      );
      symbol.vertex = true;
      symbol.geometry.relative = true;
      symbol.geometry.offset = new mxPoint(-24, 4);
      cell.insert(symbol);

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Component with Attributes"
      );
    });
  }

  get objectInstanceClass3() {
    const { dt, sb } = this;
    return this.addEntry(dt + "object instance", function () {
      var cell = new mxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          "<b>Class</b></p>" +
          '<hr size="1"/><div style="height:2px;"></div>',
        new mxGeometry(0, 0, 140, 60),
        "verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;"
      );
      cell.vertex = true;

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        "Class 3"
      );
    });
  }

  get objectInstanceClass4() {
    const { dt, sb } = this;
    return this.addEntry(dt + "object instance", function () {
      var cell = new mxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          "<b>Class</b></p>" +
          '<hr size="1"/><div style="height:2px;"></div><hr size="1"/><div style="height:2px;"></div>',
        new mxGeometry(0, 0, 140, 60),
        "verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;"
      );
      cell.vertex = true;

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        "Class 4"
      );
    });
  }
  get objectInstanceClass5() {
    const { dt, sb } = this;
    return this.addEntry(dt + "object instance", function () {
      var cell = new mxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          "<b>Class</b></p>" +
          '<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field: Type</p><hr size="1"/>' +
          '<p style="margin:0px;margin-left:4px;">+ method(): Type</p>',
        new mxGeometry(0, 0, 160, 90),
        "verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;"
      );
      cell.vertex = true;

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        "Class 5"
      );
    });
  }

  get objectInstanceInterface2() {
    const { dt, sb } = this;
    return this.addEntry(dt + "object instance", function () {
      var cell = new mxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          "<i>&lt;&lt;Interface&gt;&gt;</i><br/><b>Interface</b></p>" +
          '<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field1: Type<br/>' +
          "+ field2: Type</p>" +
          '<hr size="1"/><p style="margin:0px;margin-left:4px;">' +
          "+ method1(Type): Type<br/>" +
          "+ method2(Type, Type): Type</p>",
        new mxGeometry(0, 0, 190, 140),
        "verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;"
      );
      cell.vertex = true;

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        "Interface 2"
      );
    });
  }

  get lollipopNotation() {
    const { sb } = this;
    return this.addEntry(
      "uml lollipop notation provided required interface",
      function () {
        return sb.createVertexTemplateFromData(
          "zVTBrptADPyavVYEkt4b0uQd3pMq5dD2uAUD27dgZJwE8vX1spsQlETtpVWRIjFjex3PmFVJWvc70m31hjlYlXxWSUqI7N/qPgVrVRyZXCUbFceR/FS8fRJdjNGo1QQN/0lB7AuO2h7AM57oeLCBIDw0Obj8SCVrJK6wxEbbV8RWyIWQP4F52Juzq9AHRqEqrm2IQpN/IsKTwAYb8MzWWBuO9B0hL2E2BGsqIQyxvJ9rzApD7QBrYBokhcBqNsf5UbrzsLzmXUu/oJET42jwGat5QYcHyiDkTDLKy03TiRrFfSx08m+FrrQtUkOZvZdbFKThmwMfVhf4fQ43/W3uZriiPPT+KKhjwnf4anKuQv//wsg+NPJ7/9d9Xf7eVykwbeeMOFWGYd/qzEVO8tHP/Suw4a2ujXV/+gXsEdhkOgSC8os44BQt0tggicZHeG1N2QiXibhAV48epRayEDd8MT7Ct06TUaXVWq027tCuhcx5VZjebeeaoDNn/WMcb/p+j0AM/dNr6InLl4Lgzylsk6OCgRWYsuI592gNZh5OhgmcblPv7+1l+ws=",
          40,
          10,
          "Lollipop Notation"
        );
      }
    );
  }
}
