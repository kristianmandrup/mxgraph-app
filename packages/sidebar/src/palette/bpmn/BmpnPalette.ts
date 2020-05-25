import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "../AbstractPalette";
import { BpmnEntries } from "./BpmnEntries";
import { BpmnTemplateEntries } from "./BpmnTemplateEntries";
const { mxResources } = mx;

export class BpmnPalette extends AbstractPalette {
  entries = new BpmnEntries();
  templateEntries = new BpmnTemplateEntries();

  /**
   * Adds the BPMN library to the sidebar.
   */
  addBpmnPalette(_dir, _expand) {
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
      this.swimlanePool,
      this.verticalPools,
      this.businessProcessModel2,
      this.sequenceFlow,
      this.defaultFlow,
      this.conditionalFlow,
      this.messageFlow,
      this.messageFlow2,
      this.bpmnLink,
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

  get swimlanePool() {
    return this.templateEntries.swimlanePool;
  }

  get swimlanePool2() {
    return this.templateEntries.swimlanePool2;
  }

  get verticalPools() {
    return this.templateEntries.verticalPools;
  }

  get businessProcessModel2() {
    return this.templateEntries.businessProcessModel2;
  }

  get sequenceFlow() {
    return this.templateEntries.sequenceFlow;
  }

  get defaultFlow() {
    return this.templateEntries.defaultFlow;
  }

  get conditionalFlow() {
    return this.templateEntries.conditionalFlow;
  }

  get messageFlow() {
    return this.templateEntries.messageFlow;
  }

  get messageFlow2() {
    return this.entries.messageFlow2;
  }

  get bpmnLink() {
    return this.templateEntries.bpmnLink;
  }
}
