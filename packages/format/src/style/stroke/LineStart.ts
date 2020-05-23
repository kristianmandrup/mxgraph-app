import mx from "@mxgraph-app/mx";
import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
const { mxResources, mxConstants, mxUtils } = mx;

export class LineStart extends AbstractStrokeFormat {
  create() {
    const { stylePanel2, ss } = this;
    return this.editorUi.toolbar.addMenuFunctionInContainer(
      stylePanel2,
      "geSprite-startclassic",
      mxResources.get("linestart"),
      false,
      (menu) => {
        if (
          ss.style.shape == "connector" ||
          ss.style.shape == "flexArrow" ||
          ss.style.shape == "filledEdge"
        ) {
          var item = this.editorUi.menus.edgeStyleChange(
            menu,
            "",
            [mxConstants.STYLE_STARTARROW, "startFill"],
            [mxConstants.NONE, 0],
            "geIcon",
            null,
            false,
          );
          item.setAttribute("title", mxResources.get("none"));
          item.firstChild.firstChild.innerHTML =
            '<font style="font-size:10px;">' +
            mxUtils.htmlEntities(mxResources.get("none")) +
            "</font>";

          if (ss.style.shape == "connector" || ss.style.shape == "filledEdge") {
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_CLASSIC, 1],
                "geIcon geSprite geSprite-startclassic",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("classic"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_CLASSIC_THIN, 1],
              "geIcon geSprite geSprite-startclassicthin",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_OPEN, 0],
                "geIcon geSprite geSprite-startopen",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("openArrow"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_OPEN_THIN, 0],
              "geIcon geSprite geSprite-startopenthin",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["openAsync", 0],
              "geIcon geSprite geSprite-startopenasync",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_BLOCK, 1],
                "geIcon geSprite geSprite-startblock",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("block"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_BLOCK_THIN, 1],
              "geIcon geSprite geSprite-startblockthin",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["async", 1],
              "geIcon geSprite geSprite-startasync",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_OVAL, 1],
                "geIcon geSprite geSprite-startoval",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("oval"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_DIAMOND, 1],
                "geIcon geSprite geSprite-startdiamond",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamond"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_DIAMOND_THIN, 1],
                "geIcon geSprite geSprite-startthindiamond",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamondThin"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_CLASSIC, 0],
                "geIcon geSprite geSprite-startclassictrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("classic"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_CLASSIC_THIN, 0],
              "geIcon geSprite geSprite-startclassicthintrans",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_BLOCK, 0],
                "geIcon geSprite geSprite-startblocktrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("block"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              [mxConstants.ARROW_BLOCK_THIN, 0],
              "geIcon geSprite geSprite-startblockthintrans",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["async", 0],
              "geIcon geSprite geSprite-startasynctrans",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_OVAL, 0],
                "geIcon geSprite geSprite-startovaltrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("oval"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_DIAMOND, 0],
                "geIcon geSprite geSprite-startdiamondtrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamond"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW, "startFill"],
                [mxConstants.ARROW_DIAMOND_THIN, 0],
                "geIcon geSprite geSprite-startthindiamondtrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamondThin"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["box", 0],
              "geIcon geSprite geSvgSprite geSprite-box",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["halfCircle", 0],
              "geIcon geSprite geSvgSprite geSprite-halfCircle",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["dash", 0],
              "geIcon geSprite geSprite-startdash",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["cross", 0],
              "geIcon geSprite geSprite-startcross",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["circlePlus", 0],
              "geIcon geSprite geSprite-startcircleplus",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["circle", 1],
              "geIcon geSprite geSprite-startcircle",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["ERone", 0],
              "geIcon geSprite geSprite-starterone",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["ERmandOne", 0],
              "geIcon geSprite geSprite-starteronetoone",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["ERmany", 0],
              "geIcon geSprite geSprite-startermany",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["ERoneToMany", 0],
              "geIcon geSprite geSprite-starteronetomany",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["ERzeroToOne", 1],
              "geIcon geSprite geSprite-starteroneopt",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_STARTARROW, "startFill"],
              ["ERzeroToMany", 1],
              "geIcon geSprite geSprite-startermanyopt",
              null,
              false,
            );
          } else {
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_STARTARROW],
                [mxConstants.ARROW_BLOCK],
                "geIcon geSprite geSprite-startblocktrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("block"));
          }
        }
      },
    );
  }
}
