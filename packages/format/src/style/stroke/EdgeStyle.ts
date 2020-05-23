import mx from "@mxgraph-app/mx";
import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
const { mxResources, mxConstants } = mx;

export class EdgeStyle extends AbstractStrokeFormat {
  create() {
    const { stylePanel2, ss } = this;
    return this.editorUi.toolbar.addMenuFunctionInContainer(
      stylePanel2,
      "geSprite-orthogonal",
      mxResources.get("waypoints"),
      false,
      (menu) => {
        if (ss.style.shape != "arrow") {
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

          if (ss.style.shape == "connector") {
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
          }

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
        }
      },
    );
  }
}
