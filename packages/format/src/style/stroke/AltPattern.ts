import { BaseStyleFormat } from "../BaseStyleFormat";
import mx from "@mxgraph-app/mx";
const { mxResources, mxConstants } = mx;

export class AltPattern extends BaseStyleFormat {
  create() {
    const { altStylePanel } = this;
    return this.editorUi.toolbar.addMenuFunctionInContainer(
      altStylePanel,
      "geSprite-orthogonal",
      mxResources.get("pattern"),
      false,
      (menu) => {
        addItem(
          menu,
          33,
          "solid",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          [null, null],
        ).setAttribute("title", mxResources.get("solid"));
        addItem(
          menu,
          33,
          "dashed",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", null],
        ).setAttribute("title", mxResources.get("dashed"));
        addItem(
          menu,
          33,
          "dotted",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", "1 1"],
        ).setAttribute("title", mxResources.get("dotted") + " (1)");
        addItem(
          menu,
          33,
          "dotted",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", "1 2"],
        ).setAttribute("title", mxResources.get("dotted") + " (2)");
        addItem(
          menu,
          33,
          "dotted",
          [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
          ["1", "1 4"],
        ).setAttribute("title", mxResources.get("dotted") + " (3)");
      },
    );
  }
}
