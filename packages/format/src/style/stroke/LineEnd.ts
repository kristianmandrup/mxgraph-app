import mx from "@mxgraph-app/mx";
import { AbstractStrokeFormat } from "./AbstractStrokeFormat";
const { mxResources, mxConstants, mxUtils } = mx;

export class LineEnd extends AbstractStrokeFormat {
  create() {
    const { stylePanel2, ss } = this;
    return this.editorUi.toolbar.addMenuFunctionInContainer(
      stylePanel2,
      "geSprite-endclassic",
      mxResources.get("lineend"),
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
            [mxConstants.STYLE_ENDARROW, "endFill"],
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
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_CLASSIC, 1],
                "geIcon geSprite geSprite-endclassic",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("classic"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_CLASSIC_THIN, 1],
              "geIcon geSprite geSprite-endclassicthin",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_OPEN, 0],
                "geIcon geSprite geSprite-endopen",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("openArrow"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_OPEN_THIN, 0],
              "geIcon geSprite geSprite-endopenthin",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["openAsync", 0],
              "geIcon geSprite geSprite-endopenasync",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_BLOCK, 1],
                "geIcon geSprite geSprite-endblock",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("block"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_BLOCK_THIN, 1],
              "geIcon geSprite geSprite-endblockthin",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["async", 1],
              "geIcon geSprite geSprite-endasync",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_OVAL, 1],
                "geIcon geSprite geSprite-endoval",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("oval"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_DIAMOND, 1],
                "geIcon geSprite geSprite-enddiamond",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamond"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_DIAMOND_THIN, 1],
                "geIcon geSprite geSprite-endthindiamond",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamondThin"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_CLASSIC, 0],
                "geIcon geSprite geSprite-endclassictrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("classic"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_CLASSIC_THIN, 0],
              "geIcon geSprite geSprite-endclassicthintrans",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_BLOCK, 0],
                "geIcon geSprite geSprite-endblocktrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("block"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              [mxConstants.ARROW_BLOCK_THIN, 0],
              "geIcon geSprite geSprite-endblockthintrans",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["async", 0],
              "geIcon geSprite geSprite-endasynctrans",
              null,
              false,
            );
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_OVAL, 0],
                "geIcon geSprite geSprite-endovaltrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("oval"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_DIAMOND, 0],
                "geIcon geSprite geSprite-enddiamondtrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamond"));
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW, "endFill"],
                [mxConstants.ARROW_DIAMOND_THIN, 0],
                "geIcon geSprite geSprite-endthindiamondtrans",
                null,
                false,
              )
              .setAttribute("title", mxResources.get("diamondThin"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["box", 0],
              "geIcon geSprite geSvgSprite geFlipSprite geSprite-box",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["halfCircle", 0],
              "geIcon geSprite geSvgSprite geFlipSprite geSprite-halfCircle",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["dash", 0],
              "geIcon geSprite geSprite-enddash",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["cross", 0],
              "geIcon geSprite geSprite-endcross",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["circlePlus", 0],
              "geIcon geSprite geSprite-endcircleplus",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["circle", 1],
              "geIcon geSprite geSprite-endcircle",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["ERone", 0],
              "geIcon geSprite geSprite-enderone",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["ERmandOne", 0],
              "geIcon geSprite geSprite-enderonetoone",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["ERmany", 0],
              "geIcon geSprite geSprite-endermany",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["ERoneToMany", 0],
              "geIcon geSprite geSprite-enderonetomany",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["ERzeroToOne", 1],
              "geIcon geSprite geSprite-enderoneopt",
              null,
              false,
            );
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_ENDARROW, "endFill"],
              ["ERzeroToMany", 1],
              "geIcon geSprite geSprite-endermanyopt",
              null,
              false,
            );
          } else {
            this.editorUi.menus
              .edgeStyleChange(
                menu,
                "",
                [mxConstants.STYLE_ENDARROW],
                [mxConstants.ARROW_BLOCK],
                "geIcon geSprite geSprite-endblocktrans",
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
