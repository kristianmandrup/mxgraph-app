import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "../AbstractPalette";
import { GeneralEntries } from "./GeneralEntries";
import { GeneralTemplateEntries } from "./GeneralTemplateEntries";
const { mxResources } = mx;

export class GeneralPalette extends AbstractPalette {
  entries = new GeneralEntries();
  templateEntries = new GeneralTemplateEntries();

  lineTags =
    "line lines connector connectors connection connections arrow arrows ";

  /**
   * Adds the general palette to the sidebar.
   */
  addGeneralPalette(expand) {
    const { entries, templateEntries } = this;
    const {
      callout,
      card,
      circle,
      cloud,
      cube,
      cylinder,
      diamond,
      hexagon,
      dataStorage,
      document,
      ellipse,
      humanStickman,
      internalStorage,
      logicAnd,
      logicOr,
      note,
      parallelogram,
      rectangle,
      roundedRectangle,
      process,
      square,
      step,
      tape,
      text,
      textbox,
      trapezoid,
      triangle,
      bidirectionalArrow,
      bidirectionalConnector,
      dashedLine,
      directedArrow,
      directionalConnector,
      line,
      link,
    } = templateEntries;
    const { curve } = entries;

    var fns = [
      callout,
      card,
      circle,
      cloud,
      cube,
      cylinder,
      diamond,
      hexagon,
      dataStorage,
      document,
      ellipse,
      humanStickman,
      internalStorage,
      logicAnd,
      logicOr,
      note,
      parallelogram,
      rectangle,
      roundedRectangle,
      process,
      square,
      step,
      tape,
      text,
      textbox,
      trapezoid,
      triangle,
      curve,
      bidirectionalArrow,
      bidirectionalConnector,
      dashedLine,
      directedArrow,
      directionalConnector,
      line,
      link,
    ];

    this.addPaletteFunctions(
      "general",
      mxResources.get("general"),
      expand != null ? expand : true,
      fns,
    );
  }
}
