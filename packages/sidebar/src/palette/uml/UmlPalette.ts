import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "../AbstractPalette";
import { UmlTemplateEntries } from "./UmlTemplateEntries";
import { UmlEntries } from "./UmlEntries";
const { mxCell, mxGeometry, mxResources } = mx;

export class UmlPalette extends AbstractPalette {
  gearImage: any;

  _divider: any;
  _field: any;

  /**
   * Adds the general palette to the sidebar.
   */
  addUmlPalette(expand) {
    // Avoids having to bind all functions to "this"

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
      lifeline,
      activityStateEnd,
      actorLifeline,
      boundaryLifeline,
      controlLifeline,
      entityLifeline,
      frame,
      dispatchMessage,
      dispatchMessage1,
      dispatchMessage2,
      sequenceActivation,
      note,
      aggregation2,
      association2,
      association3,
      composition2,
      dependencyUse,
      generalization,
      implementation,
      innerClass,
      destruction,
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
      objectInterface2,
      lollipopNotation,
      activityStartState,
      activityCompositeState,
      activityCondition,
      activityJoinFork,
      activityState,
      callActivation,
      delegationCallbackActivation,
      delegationSyncInvocation,
      recursionDelegationActivation,
      relation,
      relation2,
      aggregation,
      association,
      composition,
      returnMessage,
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
      objectInterface2,
      requiredInterfaceLollipop,
      lollipopNotation,
      boundaryObject,
      entityObject,
      controlObject,
      actor,
      useCase,
      destruction,
      activityStartState,
      activityCompositeState,
      activityCondition,
      activityJoinFork,
      activityState,
      lifeline,
      activityStateEnd,
      actorLifeline,
      boundaryLifeline,
      controlLifeline,
      entityLifeline,
      frame,
      callActivation,
      delegationCallbackActivation,
      delegationSyncInvocation,
      recursionDelegationActivation,
      dispatchMessage,
      dispatchMessage1,
      dispatchMessage2,
      sequenceActivation,
      note,
      relation,
      relation2,
      aggregation,
      association,
      composition,
      returnMessage,
      aggregation2,
      association2,
      association3,
      composition2,
      dependencyUse,
      generalization,
      implementation,
      innerClass,
      ,
    ];

    this.addPaletteFunctions(
      "uml",
      mxResources.get("uml"),
      expand || false,
      fns,
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
      "text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;",
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
      "line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;",
    );
    divider.vertex = true;
    return divider;
  }

  // Default tags
  dt = "uml static class ";
}
