import mx from "@mxgraph-app/mx";
const { mxResources, mxConstants } = mx;
import { ToolbarMenuAdder } from "../../ToolbarMenuAdder";

export class EdgeShapeMenu extends ToolbarMenuAdder {
  create() {
    const edgeShapeMenu = this.addMenuFunction(
      "",
      mxResources.get("connection"),
      false,
      (menu) => {
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_SHAPE, "width"],
            [null, null],
            "geIcon geSprite geSprite-connection",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("line"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_SHAPE, "width"],
            ["link", null],
            "geIcon geSprite geSprite-linkedge",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("link"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_SHAPE, "width"],
            ["flexArrow", null],
            "geIcon geSprite geSprite-arrow",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("arrow"));
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_SHAPE, "width"],
            ["arrow", null],
            "geIcon geSprite geSprite-simplearrow",
            null,
            true,
          )
          .setAttribute("title", mxResources.get("simpleArrow"));
      },
    );

    this.addDropDownArrow(
      edgeShapeMenu,
      "geSprite-connection",
      44,
      50,
      0,
      0,
      22,
      -4,
    );

    return edgeShapeMenu;
  }
}
