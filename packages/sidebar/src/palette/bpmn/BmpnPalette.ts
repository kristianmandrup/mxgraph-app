import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "../AbstractPalette";
import { BpmnEntries } from "./BpmnEntries";
import { BpmnTemplateEntries } from "./BpmnTemplateEntries";
const { mxCell, mxGeometry, mxPoint, mxResources } = mx;

export class BpmnPalette extends AbstractPalette {
  entries = new BpmnEntries();
  templateEntries = new BpmnTemplateEntries();

  /**
   * Adds the BPMN library to the sidebar.
   */
  addBpmnPalette(_dir, _expand) {
    const { sb } = this;
    var fns = [
      ...this.templateEntries1,
      this.subprocess3x,
      this.subprocess2xlooped,
      this.receiveTask,
      this.userTask,
      ...this.timerEntries,
      this.pool,
      this.lane,
      this.conversation,
      this.callConversation,
      this.subConversation,
      this.dataObject,
      this.dataStore,
      this.subprocess3xmarker,
      this.loopMarker,
      this.parallelMarker,
      this.sequentialMarker,
      this.adhocMarker,
      this.compensationMarker,
      this.bpmnSendTask,
      this.bpmnReceiveTask,
      this.userTask2,
      this.manualTask,
      this.businessRuleTask,
      this.serviceTask,
      this.scriptTask,
      this.businessProcessModel,
      ...this.horizontalPools,
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

  get loopMarker() {
    return this.templateEntries.loopMarker;
  }

  get dataStore() {
    return this.templateEntries.dataStore;
  }

  get dataObject() {
    return this.entries.dataObject;
  }

  get subConversation() {
    return this.entries.subConversation;
  }

  get callConversation() {
    return this.templateEntries.callConversation;
  }

  get conversation() {
    return this.templateEntries.conversation;
  }

  get lane() {
    return this.templateEntries.lane;
  }

  get pool() {
    return this.templateEntries.pool;
  }

  get subprocess2xlooped() {
    return this.entries.subprocess2xlooped;
  }

  get subprocess3xmarker() {
    return this.templateEntries.subprocess3xmarker;
  }

  get subprocess3x() {
    return this.entries.subprocess3x;
  }

  get receiveTask() {
    return this.entries.receiveTask;
  }

  get userTask() {
    return this.entries.userTask;
  }

  get templateEntries1() {
    return this.templateEntries.templateEntries1;
  }

  get timerEntries() {
    return this.entries.timerEntries;
  }

  get parallelMarker() {
    return this.templateEntries.parallelMarker;
  }

  get sequentialMarker() {
    return this.templateEntries.sequentialMarker;
  }

  get adhocMarker() {
    return this.templateEntries.adhocMarker;
  }

  get compensationMarker() {
    return this.templateEntries.compensationMarker;
  }

  get bpmnSendTask() {
    return this.templateEntries.bpmnSendTask;
  }

  get bpmnReceiveTask() {
    return this.templateEntries.bpmnReceiveTask;
  }

  get userTask2() {
    return this.templateEntries.userTask;
  }

  get manualTask() {
    return this.templateEntries.manualTask;
  }

  get businessRuleTask() {
    return this.templateEntries.businessRuleTask;
  }

  get serviceTask() {
    return this.templateEntries.serviceTask;
  }

  get scriptTask() {
    return this.templateEntries.scriptTask;
  }

  get businessProcessModel() {
    return this.templateEntries.businessProcessModel;
  }

  get horizontalPools() {
    return this.templateEntries.horizontalPools;
  }
}
