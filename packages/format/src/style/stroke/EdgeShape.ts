import mx from "@mxgraph-app/mx";
import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
const { mxResources, mxConstants } = mx;

export class EdgeShape extends AbstractStrokeFormat {
  create() {
    const { altStylePanel } = this;
    return this.editorUi.toolbar.addMenuFunctionInContainer(
      altStylePanel,
      "geSprite-connection",
      mxResources.get("connection"),
      false,
      (menu) => {
        this.editorUi.menus
          .styleChange(
            menu,
            "",
            [
              mxConstants.STYLE_SHAPE,
              mxConstants.STYLE_STARTSIZE,
              mxConstants.STYLE_ENDSIZE,
              "width",
            ],
            [null, null, null, null],
            "geIcon geSprite geSprite-connection",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("line"));
        this.editorUi.menus
          .styleChange(
            menu,
            "",
            [
              mxConstants.STYLE_SHAPE,
              mxConstants.STYLE_STARTSIZE,
              mxConstants.STYLE_ENDSIZE,
              "width",
            ],
            ["link", null, null, null],
            "geIcon geSprite geSprite-linkedge",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("link"));
        this.editorUi.menus
          .styleChange(
            menu,
            "",
            [
              mxConstants.STYLE_SHAPE,
              mxConstants.STYLE_STARTSIZE,
              mxConstants.STYLE_ENDSIZE,
              "width",
            ],
            ["flexArrow", null, null, null],
            "geIcon geSprite geSprite-arrow",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("arrow"));
        this.editorUi.menus
          .styleChange(
            menu,
            "",
            [
              mxConstants.STYLE_SHAPE,
              mxConstants.STYLE_STARTSIZE,
              mxConstants.STYLE_ENDSIZE,
              "width",
            ],
            ["arrow", null, null, null],
            "geIcon geSprite geSprite-simplearrow",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("simpleArrow"));
      },
    );
  }
}
