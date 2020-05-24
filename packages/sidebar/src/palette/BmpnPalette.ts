import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "./AbstractPalette";
const { mxCell, mxGeometry, mxPoint, mxResources } = mx;

export class BpmnPalette extends AbstractPalette {
  getTagsForStencil: any;
  addDataEntry: any;

  /**
   * Adds the BPMN library to the sidebar.
   */
  addBpmnPalette(_dir, _expand) {
    // Avoids having to bind all functions to "this"
    var sb = this;

    var fns = [
      this.createVertexTemplateEntry(
        "shape=ext;rounded=1;html=1;whiteSpace=wrap;",
        120,
        80,
        "Task",
        "Process",
        null,
        null,
        "bpmn task process"
      ),
      this.createVertexTemplateEntry(
        "shape=ext;rounded=1;html=1;whiteSpace=wrap;double=1;",
        120,
        80,
        "Transaction",
        "Transaction",
        null,
        null,
        "bpmn transaction"
      ),
      this.createVertexTemplateEntry(
        "shape=ext;rounded=1;html=1;whiteSpace=wrap;dashed=1;dashPattern=1 4;",
        120,
        80,
        "Event\nSub-Process",
        "Event Sub-Process",
        null,
        null,
        "bpmn event subprocess sub process sub-process"
      ),
      this.createVertexTemplateEntry(
        "shape=ext;rounded=1;html=1;whiteSpace=wrap;strokeWidth=3;",
        120,
        80,
        "Call Activity",
        "Call Activity",
        null,
        null,
        "bpmn call activity"
      ),
      this.addEntry("bpmn subprocess sub process sub-process", function () {
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
      }),
      this.addEntry(
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
      ),
      this.addEntry("bpmn receive task", function () {
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
      }),
      this.addEntry(
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
      ),
      this.addEntry(
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
      ),
      this.addEntry(
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
      ),
      this.createVertexTemplateEntry(
        "swimlane;html=1;horizontal=0;startSize=20;",
        320,
        240,
        "Pool",
        "Pool",
        null,
        null,
        "bpmn pool"
      ),
      this.createVertexTemplateEntry(
        "swimlane;html=1;horizontal=0;swimlaneLine=0;",
        300,
        120,
        "Lane",
        "Lane",
        null,
        null,
        "bpmn lane"
      ),
      this.createVertexTemplateEntry(
        "shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;rounded=0;",
        60,
        50,
        "",
        "Conversation",
        null,
        null,
        "bpmn conversation"
      ),
      this.createVertexTemplateEntry(
        "shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;strokeWidth=4;rounded=0;",
        60,
        50,
        "",
        "Call Conversation",
        null,
        null,
        "bpmn call conversation"
      ),
      this.addEntry(
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
      ),
      this.addEntry("bpmn data object", function () {
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
      }),
      this.createVertexTemplateEntry(
        "shape=datastore;whiteSpace=wrap;html=1;",
        60,
        60,
        "",
        "Data Store",
        null,
        null,
        "bpmn data store"
      ),
      this.createVertexTemplateEntry(
        "shape=plus;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Sub-Process Marker",
        null,
        null,
        "bpmn subprocess sub process sub-process marker"
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.loop;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Loop Marker",
        null,
        null,
        "bpmn loop marker"
      ),
      this.createVertexTemplateEntry(
        "shape=parallelMarker;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Parallel MI Marker",
        null,
        null,
        "bpmn parallel mi marker"
      ),
      this.createVertexTemplateEntry(
        "shape=parallelMarker;direction=south;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Sequential MI Marker",
        null,
        null,
        "bpmn sequential mi marker"
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.ad_hoc;fillColor=#000000;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Ad Hoc Marker",
        null,
        null,
        "bpmn ad hoc marker"
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.compensation;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Compensation Marker",
        null,
        null,
        "bpmn compensation marker"
      ),
      this.createVertexTemplateEntry(
        "shape=message;whiteSpace=wrap;html=1;outlineConnect=0;fillColor=#000000;strokeColor=#ffffff;strokeWidth=2;",
        40,
        30,
        "",
        "Send Task",
        null,
        null,
        "bpmn send task"
      ),
      this.createVertexTemplateEntry(
        "shape=message;whiteSpace=wrap;html=1;outlineConnect=0;",
        40,
        30,
        "",
        "Receive Task",
        null,
        null,
        "bpmn receive task"
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.user_task;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "User Task",
        null,
        null,
        this.getTagsForStencil("mxgraph.bpmn", "user_task").join(" ")
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.manual_task;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Manual Task",
        null,
        null,
        this.getTagsForStencil("mxgraph.bpmn", "user_task").join(" ")
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.business_rule_task;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Business Rule Task",
        null,
        null,
        this.getTagsForStencil("mxgraph.bpmn", "business_rule_task").join(" ")
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.service_task;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Service Task",
        null,
        null,
        this.getTagsForStencil("mxgraph.bpmn", "service_task").join(" ")
      ),
      this.createVertexTemplateEntry(
        "shape=mxgraph.bpmn.script_task;html=1;outlineConnect=0;",
        14,
        14,
        "",
        "Script Task",
        null,
        null,
        this.getTagsForStencil("mxgraph.bpmn", "script_task").join(" ")
      ),
      this.createVertexTemplateEntry(
        "html=1;shape=mxgraph.flowchart.annotation_2;align=left;labelPosition=right;",
        50,
        100,
        "",
        "Annotation",
        null,
        null,
        this.getTagsForStencil(
          "bpmn",
          "annotation_1",
          "bpmn business process model "
        ).join(" ")
      ),
      this.addDataEntry(
        "container swimlane pool horizontal",
        480,
        380,
        "Horizontal Pool 1",
        "zZRLbsIwEIZP4709TlHXhJYNSEicwCIjbNWJkWNKwumZxA6IlrRUaisWlmb+eX8LM5mXzdyrnV66Ai2TL0zm3rkQrbLJ0VoG3BRMzhgAp8fgdSQq+ijfKY9VuKcAYsG7snuMyso5G8U6tDaJ9cGUVlXkTXUoacuZIHOjjS0WqnX7blYd1OZt8KYea3PE1bCI+CAtVUMq7/o5b46uCmroSn18WFMm+XCdse5GpLq0OPqAzejxvZQun6MrMfiWUg6mCDpmZM8RENdotjqVyUFUdRS259oLSzISztto5Se0i44gcHEn3i9A/IQB3GbQpmi69DskAn4BSTaGBB4Jicj+k8nTGBP5SExg8odMyL38eH3s6kM8AQ=="
      ),
      this.addDataEntry(
        "container swimlane pool horizontal",
        480,
        360,
        "Horizontal Pool 2",
        "zZTBbsIwDIafJvfU6dDOlI0LSEg8QUQtEi1tUBJGy9PPbcJQWTsxaZs4VLJ//07sT1WYKKpm6eRBrW2JhokXJgpnbYhR1RRoDAOuSyYWDIDTx+B1opr1VX6QDutwTwPEhndpjhiVjbUmij60Jon+pCsja8rmKlQ05SKjcKe0KVeytcfuLh/k7u2SzR16fcbNZZDsRlrLhlTenWedPts6SJMEOseFLTkph6Fj212RbGlwdAGbyeV7KW2+RFthcC1ZTroMKjry5wiIK9R7ldrELInSR2H/2XtlSUHCOY5WfEG76ggCz+7E+w2InzCAcQapIf0fAySzESQZ/AKSfAoJPCKS9mbzf0H0NIVIPDAiyP8QEaXX97CvDZ7LDw=="
      ),
      this.createVertexTemplateEntry(
        "swimlane;startSize=20;horizontal=0;",
        320,
        120,
        "Lane",
        "Horizontal Swimlane",
        null,
        null,
        "swimlane lane pool"
      ),
      this.addDataEntry(
        "container swimlane pool horizontal",
        360,
        480,
        "Vertical Pool 1",
        "xZRBbsIwEEVP4709ThFrQssGJKSewCIjbNXGyDEl4fSdxKa0NJFQVTULSzP/e+T5b2EmS9esgjrqja/QMvnMZBm8j6lyTYnWMuCmYnLJADgdBi8jruhdflQBD/GRAUgD78qeMClb720S69jaLNZn46w6ULfQ0dGWS0HlThtbrVXrT91bdVS7t2u3CFibC26vi4g7aaMaUjmpNBbiKxnUQyfkjTBEbEZT9VKOtELvMIaWrpxNFXW6IWcpOddo9jqPFfMsqjoJ+8/ZGyQqMqdhZvIHs3WHBrh4kNvvIsNw5Da7OdgXAgKGCMz+gEAxRgCmINDcxZ2CyNMYETkhESj+jwi1t1+r9759ah8="
      ),
      this.addDataEntry(
        "container swimlane pool vertical",
        380,
        480,
        "Vertical Pool 2",
        "xZTPbsIwDMafJvf86dDOlI0LSEg8QUQtEi1pUBJGy9PPbdJ1G1TqhXGoZH/219g/RSGitM3ay5PaugoMEW9ElN65mCLblGAM4VRXRKwI5xQ/wt8nqqyv0pP0UMc5Bp4Mn9KcISk750wSQ2xNFsNFWyNrzJYqWpxyxTA8KG2qjWzduTsrRHn4GLKlh6CvsBsGYX+krWxQpaiizcc9FjDnnaCc11dXR2lyxyjsuyPy3/Lg4CM0k8v3Ut58Dc5C9C22XHQVVeoQrwkQVaCPKtuKQZQhCcdv78gSg4zzPlpxg3bTEeSUzcR7Q2bWyvz+ytmQr8NPAow/ikAxRYA/kQAr/hPByxQC8cxLsHggAkzH56uv/XrdvgA="
      ),
      this.createVertexTemplateEntry(
        "swimlane;startSize=20;",
        120,
        320,
        "Lane",
        "Vertical Swimlane",
        null,
        null,
        "swimlane lane pool"
      ),
      this.createVertexTemplateEntry(
        "rounded=1;arcSize=10;dashed=1;strokeColor=#000000;fillColor=none;gradientColor=none;dashPattern=8 3 1 3;strokeWidth=2;",
        200,
        200,
        "",
        "Group",
        null,
        null,
        this.getTagsForStencil(
          "bpmn",
          "group",
          "bpmn business process model "
        ).join(" ")
      ),
      this.createEdgeTemplateEntry(
        "endArrow=block;endFill=1;endSize=6;html=1;",
        100,
        0,
        "",
        "Sequence Flow",
        null,
        "bpmn sequence flow"
      ),
      this.createEdgeTemplateEntry(
        "startArrow=dash;startSize=8;endArrow=block;endFill=1;endSize=6;html=1;",
        100,
        0,
        "",
        "Default Flow",
        null,
        "bpmn default flow"
      ),
      this.createEdgeTemplateEntry(
        "startArrow=diamondThin;startFill=0;startSize=14;endArrow=block;endFill=1;endSize=6;html=1;",
        100,
        0,
        "",
        "Conditional Flow",
        null,
        "bpmn conditional flow"
      ),
      this.createEdgeTemplateEntry(
        "startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1;html=1;",
        100,
        0,
        "",
        "Message Flow 1",
        null,
        "bpmn message flow"
      ),
      this.addEntry("bpmn message flow", function () {
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
      }),
      this.createEdgeTemplateEntry(
        "shape=link;html=1;",
        100,
        0,
        "",
        "Link",
        null,
        "bpmn link"
      ),
    ];

    this.addPaletteFunctions(
      "bpmn",
      "BPMN " + mxResources.get("general"),
      false,
      fns
    );
  }
}
