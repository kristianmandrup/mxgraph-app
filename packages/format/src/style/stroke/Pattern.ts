import mx from "@mxgraph-app/mx";
import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
const { mxResources, mxConstants } = mx;

export class Pattern extends AbstractStrokeFormat {
  create() {
    const { stylePanel, addItem } = this;
    return this.editorUi.toolbar.addMenuFunctionInContainer(
      stylePanel,
      "geSprite-orthogonal",
      mxResources.get("pattern"),
      false,
      (menu) => {
        addItem(
          menu,
          75,
          "solid",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          [null, null],
        ).setAttribute("title", mxResources.get("solid"));
        addItem(
          menu,
          75,
          "dashed",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", null],
        ).setAttribute("title", mxResources.get("dashed"));
        addItem(
          menu,
          75,
          "dotted",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", "1 1"],
        ).setAttribute("title", mxResources.get("dotted") + " (1)");
        addItem(
          menu,
          75,
          "dotted",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", "1 2"],
        ).setAttribute("title", mxResources.get("dotted") + " (2)");
        addItem(
          menu,
          75,
          "dotted",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", "1 4"],
        ).setAttribute("title", mxResources.get("dotted") + " (3)");
      },
    );
  }
}
