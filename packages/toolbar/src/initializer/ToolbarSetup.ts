import { AbstractInitializer } from "./AbstractInitializer";
import mx from "@mxgraph-app/mx";
const { mxConstants, mxResources } = mx;

export class ToolbarSetup extends AbstractInitializer {
  configureItems() {
    const { sw } = this;
    if (sw >= 320) {
      this.deleteElts;
    }

    if (sw >= 550) {
      this.addItems(["-", "toFront", "toBack"]);
    }

    if (sw >= 740) {
      this.addItems(["-", "fillColor"]);

      if (sw >= 780) {
        this.addItems(["strokeColor"]);

        if (sw >= 820) {
          this.addItems(["shadow"]);
        }
      }
    }

    if (sw >= 400) {
      this.addSeparator();

      if (sw >= 440) {
        this.edgeShapeMenu = this.addMenuFunction(
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
          this.edgeShapeMenu,
          "geSprite-connection",
          44,
          50,
          0,
          0,
          22,
          -4,
        );
      }

      this.edgeStyleMenu = this.addMenuFunction(
        "geSprite-orthogonal",
        mxResources.get("waypoints"),
        false,
        (menu) => {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              [null, null, null],
              "geIcon geSprite geSprite-straight",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("straight"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["orthogonalEdgeStyle", null, null],
              "geIcon geSprite geSprite-orthogonal",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("orthogonal"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_ELBOW,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["elbowEdgeStyle", null, null, null],
              "geIcon geSprite geSprite-horizontalelbow",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("simple"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_ELBOW,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["elbowEdgeStyle", "vertical", null, null],
              "geIcon geSprite geSprite-verticalelbow",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("simple"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_ELBOW,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["isometricEdgeStyle", null, null, null],
              "geIcon geSprite geSprite-horizontalisometric",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("isometric"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_ELBOW,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["isometricEdgeStyle", "vertical", null, null],
              "geIcon geSprite geSprite-verticalisometric",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("isometric"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["orthogonalEdgeStyle", "1", null],
              "geIcon geSprite geSprite-curved",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("curved"));
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              "",
              [
                mxConstants.STYLE_EDGE,
                mxConstants.STYLE_CURVED,
                mxConstants.STYLE_NOEDGESTYLE,
              ],
              ["entityRelationEdgeStyle", null, null],
              "geIcon geSprite geSprite-entity",
              null,
              true,
            )
            .setAttribute("title", mxResources.get("entityRelation"));
        },
      );

      this.addDropDownArrow(
        this.edgeStyleMenu,
        "geSprite-orthogonal",
        44,
        50,
        0,
        0,
        22,
        -4,
      );
    }
  }
}
