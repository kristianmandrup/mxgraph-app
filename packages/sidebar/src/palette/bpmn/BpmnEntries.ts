import { AbstractPalette } from "../AbstractPalette";
import mx from "@mxgraph-app/mx";
const { mxCell, mxGeometry, mxPoint } = mx;

export class BpmnEntries extends AbstractPalette {
  get timerEntries() {
    return [this.attachedTimerEvent1, this.attachedTimerEvent2];
  }

  get attachedTimerEvent2() {
    const { sb } = this;
    return this.addEntry(
      this.getTagsForStencil("mxgraph.bpmn", "timer_start", "attached").join(
        " "
      ),
      function () {
        var cell = new mxCell(
          "Process",
          new mxGeometry(0, 0, 120, 80),
          "html=1;whiteSpace=wrap;rounded=1;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "",
          new mxGeometry(1, 0, 30, 30),
          "shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;html=1;labelPosition=right;labelBackgroundColor=#ffffff;align=left;outlineConnect=0;"
        );
        cell1.vertex = true;
        cell1.geometry.relative = true;
        cell1.geometry.offset = new mxPoint(-15, 10);
        cell.insert(cell1);

        return sb.createVertexTemplateFromCells(
          [cell],
          135,
          80,
          "Attached Timer Event 2"
        );
      }
    );
  }

  get attachedTimerEvent1() {
    const { sb } = this;
    return this.addEntry(
      this.getTagsForStencil("mxgraph.bpmn", "timer_start", "attached").join(
        " "
      ),
      function () {
        var cell = new mxCell(
          "Process",
          new mxGeometry(0, 0, 120, 80),
          "html=1;whiteSpace=wrap;rounded=1;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "",
          new mxGeometry(1, 1, 30, 30),
          "shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;outlineConnect=0;"
        );
        cell1.vertex = true;
        cell1.geometry.relative = true;
        cell1.geometry.offset = new mxPoint(-40, -15);
        cell.insert(cell1);

        return sb.createVertexTemplateFromCells(
          [cell],
          120,
          95,
          "Attached Timer Event 1"
        );
      }
    );
  }

  get subprocess2xlooped() {
    const { sb } = this;
    return this.addEntry(
      this.getTagsForStencil(
        "mxgraph.bpmn",
        "loop",
        "subprocess sub process sub-process looped"
      ).join(" "),
      function () {
        var cell = new mxCell(
          "Looped\nSub-Process",
          new mxGeometry(0, 0, 120, 80),
          "html=1;whiteSpace=wrap;rounded=1;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "",
          new mxGeometry(0.5, 1, 14, 14),
          "html=1;shape=mxgraph.bpmn.loop;outlineConnect=0;"
        );
        cell1.vertex = true;
        cell1.geometry.relative = true;
        cell1.geometry.offset = new mxPoint(-15, -14);
        cell.insert(cell1);

        var cell2 = new mxCell(
          "",
          new mxGeometry(0.5, 1, 14, 14),
          "html=1;shape=plus;"
        );
        cell2.vertex = true;
        cell2.geometry.relative = true;
        cell2.geometry.offset = new mxPoint(1, -14);
        cell.insert(cell2);

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "Looped Sub-Process"
        );
      }
    );
  }

  get dataObject() {
    const { sb } = this;
    return this.addEntry("bpmn data object", function () {
      var cell = new mxCell(
        "",
        new mxGeometry(0, 0, 40, 60),
        "shape=note;whiteSpace=wrap;size=16;html=1;dropTarget=0;"
      );
      cell.vertex = true;

      var cell1 = new mxCell(
        "",
        new mxGeometry(0, 0, 14, 14),
        "html=1;shape=singleArrow;arrowWidth=0.4;arrowSize=0.4;outlineConnect=0;"
      );
      cell1.vertex = true;
      cell1.geometry.relative = true;
      cell1.geometry.offset = new mxPoint(2, 2);
      cell.insert(cell1);

      var cell2 = new mxCell(
        "",
        new mxGeometry(0.5, 1, 14, 14),
        "html=1;whiteSpace=wrap;shape=parallelMarker;outlineConnect=0;"
      );
      cell2.vertex = true;
      cell2.geometry.relative = true;
      cell2.geometry.offset = new mxPoint(-7, -14);
      cell.insert(cell2);

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Data Object"
      );
    });
  }

  get subConversation() {
    const { sb } = this;
    return this.addEntry(
      "bpmn subconversation sub conversation sub-conversation",
      function () {
        var cell = new mxCell(
          "",
          new mxGeometry(0, 0, 60, 50),
          "shape=hexagon;whiteSpace=wrap;html=1;perimeter=hexagonPerimeter;rounded=0;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "",
          new mxGeometry(0.5, 1, 14, 14),
          "html=1;shape=plus;"
        );
        cell1.vertex = true;
        cell1.geometry.relative = true;
        cell1.geometry.offset = new mxPoint(-7, -14);
        cell.insert(cell1);

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "Sub-Conversation"
        );
      }
    );
  }

  get subprocess3x() {
    const { sb } = this;
    return this.addEntry(
      "bpmn subprocess sub process sub-process",
      function () {
        var cell = new mxCell(
          "Sub-Process",
          new mxGeometry(0, 0, 120, 80),
          "html=1;whiteSpace=wrap;rounded=1;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "",
          new mxGeometry(0.5, 1, 14, 14),
          "html=1;shape=plus;outlineConnect=0;"
        );
        cell1.vertex = true;
        cell1.geometry.relative = true;
        cell1.geometry.offset = new mxPoint(-7, -14);
        cell.insert(cell1);

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "Sub-Process"
        );
      }
    );
  }

  get receiveTask() {
    const { sb } = this;
    return this.addEntry("bpmn receive task", function () {
      var cell = new mxCell(
        "Receive",
        new mxGeometry(0, 0, 120, 80),
        "html=1;whiteSpace=wrap;rounded=1;dropTarget=0;"
      );
      cell.vertex = true;

      var cell1 = new mxCell(
        "",
        new mxGeometry(0, 0, 20, 14),
        "html=1;shape=message;outlineConnect=0;"
      );
      cell1.vertex = true;
      cell1.geometry.relative = true;
      cell1.geometry.offset = new mxPoint(7, 7);
      cell.insert(cell1);

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        "Receive Task"
      );
    });
  }

  get userTask() {
    const { sb } = this;
    return this.addEntry(
      this.getTagsForStencil("mxgraph.bpmn", "user_task").join(" "),
      function () {
        var cell = new mxCell(
          "User",
          new mxGeometry(0, 0, 120, 80),
          "html=1;whiteSpace=wrap;rounded=1;dropTarget=0;"
        );
        cell.vertex = true;

        var cell1 = new mxCell(
          "",
          new mxGeometry(0, 0, 14, 14),
          "html=1;shape=mxgraph.bpmn.user_task;outlineConnect=0;"
        );
        cell1.vertex = true;
        cell1.geometry.relative = true;
        cell1.geometry.offset = new mxPoint(7, 7);
        cell.insert(cell1);

        var cell2 = new mxCell(
          "",
          new mxGeometry(0.5, 1, 14, 14),
          "html=1;shape=plus;outlineConnect=0;"
        );
        cell2.vertex = true;
        cell2.geometry.relative = true;
        cell2.geometry.offset = new mxPoint(-7, -14);
        cell.insert(cell2);

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "User Task"
        );
      }
    );
  }

  get messageFlow2() {
    const { sb } = this;
    return this.addEntry("bpmn message flow", function () {
      var edge = new mxCell(
        "",
        new mxGeometry(0, 0, 0, 0),
        "startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1;html=1;"
      );
      edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
      edge.geometry.setTerminalPoint(new mxPoint(100, 0), false);
      edge.geometry.relative = true;
      edge.edge = true;

      var cell = new mxCell(
        "",
        new mxGeometry(0, 0, 20, 14),
        "shape=message;html=1;outlineConnect=0;"
      );
      cell.geometry.relative = true;
      cell.vertex = true;
      cell.geometry.offset = new mxPoint(-10, -7);
      edge.insert(cell);

      return sb.createEdgeTemplateFromCells([edge], 100, 0, "Message Flow 2");
    });
  }
}
