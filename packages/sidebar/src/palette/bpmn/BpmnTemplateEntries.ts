import { AbstractPalette } from "../AbstractPalette";

export class BpmnTemplateEntries extends AbstractPalette {
  get templateEntries1() {
    return [
      this.bpmnCallActivity,
      this.bpmnTaskForce,
      this.bpmnTransaction,
      this.bpmnEventSubprocess,
    ];
  }

  get businessProcessModel() {
    return this.createVertexTemplateEntry(
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
    );
  }

  get scriptTask() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.script_task;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Script Task",
      null,
      null,
      this.getTagsForStencil("mxgraph.bpmn", "script_task").join(" ")
    );
  }

  get serviceTask() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.service_task;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Service Task",
      null,
      null,
      this.getTagsForStencil("mxgraph.bpmn", "service_task").join(" ")
    );
  }

  get businessRuleTask() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.business_rule_task;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Business Rule Task",
      null,
      null,
      this.getTagsForStencil("mxgraph.bpmn", "business_rule_task").join(" ")
    );
  }

  get manualTask() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.manual_task;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Manual Task",
      null,
      null,
      this.getTagsForStencil("mxgraph.bpmn", "user_task").join(" ")
    );
  }

  get userTask() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.user_task;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "User Task",
      null,
      null,
      this.getTagsForStencil("mxgraph.bpmn", "user_task").join(" ")
    );
  }

  get bpmnReceiveTask() {
    return this.createVertexTemplateEntry(
      "shape=message;whiteSpace=wrap;html=1;outlineConnect=0;",
      40,
      30,
      "",
      "Receive Task",
      null,
      null,
      "bpmn receive task"
    );
  }

  get bpmnSendTask() {
    return this.createVertexTemplateEntry(
      "shape=message;whiteSpace=wrap;html=1;outlineConnect=0;fillColor=#000000;strokeColor=#ffffff;strokeWidth=2;",
      40,
      30,
      "",
      "Send Task",
      null,
      null,
      "bpmn send task"
    );
  }

  get compensationMarker() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.compensation;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Compensation Marker",
      null,
      null,
      "bpmn compensation marker"
    );
  }

  get adhocMarker() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.ad_hoc;fillColor=#000000;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Ad Hoc Marker",
      null,
      null,
      "bpmn ad hoc marker"
    );
  }

  get sequentialMarker() {
    return this.createVertexTemplateEntry(
      "shape=parallelMarker;direction=south;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Sequential MI Marker",
      null,
      null,
      "bpmn sequential mi marker"
    );
  }

  get parallelMarker() {
    return this.createVertexTemplateEntry(
      "shape=parallelMarker;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Parallel MI Marker",
      null,
      null,
      "bpmn parallel mi marker"
    );
  }

  get loopMarker() {
    return this.createVertexTemplateEntry(
      "shape=mxgraph.bpmn.loop;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Loop Marker",
      null,
      null,
      "bpmn loop marker"
    );
  }

  get subprocess3xmarker() {
    return this.createVertexTemplateEntry(
      "shape=plus;html=1;outlineConnect=0;",
      14,
      14,
      "",
      "Sub-Process Marker",
      null,
      null,
      "bpmn subprocess sub process sub-process marker"
    );
  }

  get dataStore() {
    return this.createVertexTemplateEntry(
      "shape=datastore;whiteSpace=wrap;html=1;",
      60,
      60,
      "",
      "Data Store",
      null,
      null,
      "bpmn data store"
    );
  }

  get callConversation() {
    return this.createVertexTemplateEntry(
      "shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;strokeWidth=4;rounded=0;",
      60,
      50,
      "",
      "Call Conversation",
      null,
      null,
      "bpmn call conversation"
    );
  }

  get conversation() {
    return this.createVertexTemplateEntry(
      "shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;rounded=0;",
      60,
      50,
      "",
      "Conversation",
      null,
      null,
      "bpmn conversation"
    );
  }

  get lane() {
    return this.createVertexTemplateEntry(
      "swimlane;html=1;horizontal=0;swimlaneLine=0;",
      300,
      120,
      "Lane",
      "Lane",
      null,
      null,
      "bpmn lane"
    );
  }

  get pool() {
    return this.createVertexTemplateEntry(
      "swimlane;html=1;horizontal=0;startSize=20;",
      320,
      240,
      "Pool",
      "Pool",
      null,
      null,
      "bpmn pool"
    );
  }

  get bpmnCallActivity() {
    return this.createVertexTemplateEntry(
      "shape=ext;rounded=1;html=1;whiteSpace=wrap;strokeWidth=3;",
      120,
      80,
      "Call Activity",
      "Call Activity",
      null,
      null,
      "bpmn call activity"
    );
  }

  get bpmnTaskForce() {
    return this.createVertexTemplateEntry(
      "shape=ext;rounded=1;html=1;whiteSpace=wrap;",
      120,
      80,
      "Task",
      "Process",
      null,
      null,
      "bpmn task process"
    );
  }

  get bpmnTransaction() {
    return this.createVertexTemplateEntry(
      "shape=ext;rounded=1;html=1;whiteSpace=wrap;double=1;",
      120,
      80,
      "Transaction",
      "Transaction",
      null,
      null,
      "bpmn transaction"
    );
  }

  get bpmnEventSubprocess() {
    return this.createVertexTemplateEntry(
      "shape=ext;rounded=1;html=1;whiteSpace=wrap;dashed=1;dashPattern=1 4;",
      120,
      80,
      "Event\nSub-Process",
      "Event Sub-Process",
      null,
      null,
      "bpmn event subprocess sub process sub-process"
    );
  }

  get horizontalPools() {
    return [this.horizontalPool1, this.horizontalPool2];
  }

  get horizontalPool1() {
    return this.addDataEntry(
      "container swimlane pool horizontal",
      480,
      380,
      "Horizontal Pool 1",
      "zZRLbsIwEIZP4709TlHXhJYNSEicwCIjbNWJkWNKwumZxA6IlrRUaisWlmb+eX8LM5mXzdyrnV66Ai2TL0zm3rkQrbLJ0VoG3BRMzhgAp8fgdSQq+ijfKY9VuKcAYsG7snuMyso5G8U6tDaJ9cGUVlXkTXUoacuZIHOjjS0WqnX7blYd1OZt8KYea3PE1bCI+CAtVUMq7/o5b46uCmroSn18WFMm+XCdse5GpLq0OPqAzejxvZQun6MrMfiWUg6mCDpmZM8RENdotjqVyUFUdRS259oLSzISztto5Se0i44gcHEn3i9A/IQB3GbQpmi69DskAn4BSTaGBB4Jicj+k8nTGBP5SExg8odMyL38eH3s6kM8AQ=="
    );
  }

  get horizontalPool2() {
    return this.addDataEntry(
      "container swimlane pool horizontal",
      480,
      360,
      "Horizontal Pool 2",
      "zZTBbsIwDIafJvfU6dDOlI0LSEg8QUQtEi1tUBJGy9PPbcJQWTsxaZs4VLJ//07sT1WYKKpm6eRBrW2JhokXJgpnbYhR1RRoDAOuSyYWDIDTx+B1opr1VX6QDutwTwPEhndpjhiVjbUmij60Jon+pCsja8rmKlQ05SKjcKe0KVeytcfuLh/k7u2SzR16fcbNZZDsRlrLhlTenWedPts6SJMEOseFLTkph6Fj212RbGlwdAGbyeV7KW2+RFthcC1ZTroMKjry5wiIK9R7ldrELInSR2H/2XtlSUHCOY5WfEG76ggCz+7E+w2InzCAcQapIf0fAySzESQZ/AKSfAoJPCKS9mbzf0H0NIVIPDAiyP8QEaXX97CvDZ7LDw=="
    );
  }
}
