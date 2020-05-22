import mx from "@mxgraph-app/mx";
import { BaseStyleFormat } from "./BaseStyleFormat";
const { mxResources, mxEventObject, mxConstants, mxClient, mxEvent, mxUtils } =
  mx;

export class StrokeFormat extends BaseStyleFormat {
  format: any;
  editorUi: any;
  container: any;

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
  }
  /**
   * Adds the label menu items to the given menu and parent.
   */
  addStroke(container) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var ss = this.format.getSelectionState();

    container.style.paddingTop = "4px";
    container.style.paddingBottom = "4px";
    container.style.whiteSpace = "normal";

    var colorPanel = document.createElement("div");
    colorPanel.style.fontWeight = "bold";

    // Adds gradient direction option
    var styleSelect = document.createElement("select");
    styleSelect.style.position = "absolute";
    styleSelect.style.marginTop = "-2px";
    styleSelect.style.right = "72px";
    styleSelect.style.width = "80px";

    var styles = ["sharp", "rounded", "curved"];

    for (var i = 0; i < styles.length; i++) {
      var styleOption = document.createElement("option");
      styleOption.setAttribute("value", styles[i]);
      mxUtils.write(styleOption, mxResources.get(styles[i]));
      styleSelect.appendChild(styleOption);
    }

    mxEvent.addListener(styleSelect, "change", function (evt) {
      graph.getModel().beginUpdate();
      try {
        var keys = [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED];
        // Default for rounded is 1
        var values = ["0", null];

        if (styleSelect.value == "rounded") {
          values = ["1", null];
        } else if (styleSelect.value == "curved") {
          values = [null, "1"];
        }

        for (var i = 0; i < keys.length; i++) {
          graph.setCellStyles(keys[i], values[i], graph.getSelectionCells());
        }

        ui.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            keys,
            "values",
            values,
            "cells",
            graph.getSelectionCells(),
          ),
        );
      } finally {
        graph.getModel().endUpdate();
      }

      mxEvent.consume(evt);
    });

    // Stops events from bubbling to color option event handler
    mxEvent.addListener(styleSelect, "click", function (evt) {
      mxEvent.consume(evt);
    });

    var strokeKey = ss.style.shape == "image"
      ? mxConstants.STYLE_IMAGE_BORDER
      : mxConstants.STYLE_STROKECOLOR;
    var label = ss.style.shape == "image"
      ? mxResources.get("border")
      : mxResources.get("line");

    var lineColor = this.createCellColorOption(label, strokeKey, "#000000");
    lineColor.appendChild(styleSelect);
    colorPanel.appendChild(lineColor);

    // Used if only edges selected
    var stylePanel: any = colorPanel.cloneNode(false);
    stylePanel.style.fontWeight = "normal";
    stylePanel.style.whiteSpace = "nowrap";
    stylePanel.style.position = "relative";
    stylePanel.style.paddingLeft = "16px";
    stylePanel.style.marginBottom = "2px";
    stylePanel.style.marginTop = "2px";
    stylePanel.className = "geToolbarContainer";

    var addItem = (menu, width, cssName, keys, values) => {
      var item = this.editorUi.menus.styleChange(
        menu,
        "",
        keys,
        values,
        "geIcon",
        null,
      );

      var pat = document.createElement("div");
      pat.style.width = width + "px";
      pat.style.height = "1px";
      pat.style.borderBottom = "1px " + cssName + " " + this.defaultStrokeColor;
      pat.style.paddingTop = "6px";

      item.firstChild.firstChild.style.padding = "0px 4px 0px 4px";
      item.firstChild.firstChild.style.width = width + "px";
      item.firstChild.firstChild.appendChild(pat);

      return item;
    };

    var pattern = this.editorUi.toolbar.addMenuFunctionInContainer(
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

    // Used for mixed selection (vertices and edges)
    var altStylePanel = stylePanel.cloneNode(false);

    var edgeShape = this.editorUi.toolbar.addMenuFunctionInContainer(
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

    var altPattern = this.editorUi.toolbar.addMenuFunctionInContainer(
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

    var stylePanel2 = stylePanel.cloneNode(false);

    // Stroke width
    var input = document.createElement("input");
    input.style.textAlign = "right";
    input.style.marginTop = "2px";
    input.style.width = "41px";
    input.setAttribute("title", mxResources.get("linewidth"));

    stylePanel.appendChild(input);

    var altInput: any = input.cloneNode(true);
    altStylePanel.appendChild(altInput);

    function update(evt) {
      // Maximum stroke width is 999
      var value = parseInt(input.value);
      value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

      if (
        value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)
      ) {
        graph.setCellStyles(
          mxConstants.STYLE_STROKEWIDTH,
          value,
          graph.getSelectionCells(),
        );
        ui.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            [mxConstants.STYLE_STROKEWIDTH],
            "values",
            [value],
            "cells",
            graph.getSelectionCells(),
          ),
        );
      }

      input.value = value + " pt";
      mxEvent.consume(evt);
    }

    function altUpdate(evt) {
      // Maximum stroke width is 999
      var value = parseInt(altInput.value);
      value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

      if (
        value != mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1)
      ) {
        graph.setCellStyles(
          mxConstants.STYLE_STROKEWIDTH,
          value,
          graph.getSelectionCells(),
        );
        ui.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            [mxConstants.STYLE_STROKEWIDTH],
            "values",
            [value],
            "cells",
            graph.getSelectionCells(),
          ),
        );
      }

      altInput.value = value + " pt";
      mxEvent.consume(evt);
    }

    var stepper = this.createStepper(input, update, 1, 9);
    stepper.style.display = input.style.display;
    stepper.style.marginTop = "2px";
    stylePanel.appendChild(stepper);

    var altStepper = this.createStepper(altInput, altUpdate, 1, 9);
    altStepper.style.display = altInput.style.display;
    altStepper.style.marginTop = "2px";
    altStylePanel.appendChild(altStepper);

    if (!mxClient.IS_QUIRKS) {
      input.style.position = "absolute";
      input.style.right = "32px";
      input.style.height = "15px";
      stepper.style.right = "20px";

      altInput.style.position = "absolute";
      altInput.style.right = "32px";
      altInput.style.height = "15px";
      altStepper.style.right = "20px";
    } else {
      input.style.height = "17px";
      altInput.style.height = "17px";
    }

    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);

    mxEvent.addListener(altInput, "blur", altUpdate);
    mxEvent.addListener(altInput, "change", altUpdate);

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(stylePanel2);
      mxUtils.br(stylePanel2);
    }

    var edgeStyle = this.editorUi.toolbar.addMenuFunctionInContainer(
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

    var lineStart = this.editorUi.toolbar.addMenuFunctionInContainer(
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

    var lineEnd = this.editorUi.toolbar.addMenuFunctionInContainer(
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

    this.addArrow(edgeShape, 8);
    this.addArrow(edgeStyle);
    this.addArrow(lineStart);
    this.addArrow(lineEnd);

    var symbol = this.addArrow(pattern, 9);
    symbol.className = "geIcon";
    symbol.style.width = "84px";

    var altSymbol = this.addArrow(altPattern, 9);
    altSymbol.className = "geIcon";
    altSymbol.style.width = "22px";

    var solid = document.createElement("div");
    solid.style.width = "85px";
    solid.style.height = "1px";
    solid.style.borderBottom = "1px solid " + this.defaultStrokeColor;
    solid.style.marginBottom = "9px";
    symbol.appendChild(solid);

    var altSolid = document.createElement("div");
    altSolid.style.width = "23px";
    altSolid.style.height = "1px";
    altSolid.style.borderBottom = "1px solid " + this.defaultStrokeColor;
    altSolid.style.marginBottom = "9px";
    altSymbol.appendChild(altSolid);

    pattern.style.height = "15px";
    altPattern.style.height = "15px";
    edgeShape.style.height = "15px";
    edgeStyle.style.height = "17px";
    lineStart.style.marginLeft = "3px";
    lineStart.style.height = "17px";
    lineEnd.style.marginLeft = "3px";
    lineEnd.style.height = "17px";

    container.appendChild(colorPanel);
    container.appendChild(altStylePanel);
    container.appendChild(stylePanel);

    var arrowPanel: any = stylePanel.cloneNode(false);
    arrowPanel.style.paddingBottom = "6px";
    arrowPanel.style.paddingTop = "4px";
    arrowPanel.style.fontWeight = "normal";

    var span: any = document.createElement("div");
    span.style.position = "absolute";
    span.style.marginLeft = "3px";
    span.style.marginBottom = "12px";
    span.style.marginTop = "2px";
    span.style.fontWeight = "normal";
    span.style.width = "76px";

    mxUtils.write(span, mxResources.get("lineend"));
    arrowPanel.appendChild(span);

    var endSpacingUpdate, endSizeUpdate;
    var endSpacing = this.addUnitInput(arrowPanel, "pt", 74, 33, () => {
      endSpacingUpdate.apply(this, arguments);
    });
    var endSize = this.addUnitInput(arrowPanel, "pt", 20, 33, () => {
      endSizeUpdate.apply(this, arguments);
    });

    mxUtils.br(arrowPanel);

    var spacer = document.createElement("div");
    spacer.style.height = "8px";
    arrowPanel.appendChild(spacer);

    span = span.cloneNode(false);
    mxUtils.write(span, mxResources.get("linestart"));
    arrowPanel.appendChild(span);

    var startSpacingUpdate, startSizeUpdate;
    var startSpacing = this.addUnitInput(arrowPanel, "pt", 74, 33, () => {
      startSpacingUpdate.apply(this, []);
    });
    var startSize = this.addUnitInput(arrowPanel, "pt", 20, 33, () => {
      startSizeUpdate.apply(this, []);
    });

    mxUtils.br(arrowPanel);
    this.addLabel(arrowPanel, mxResources.get("spacing"), 74, 50);
    this.addLabel(arrowPanel, mxResources.get("size"), 20, 50);
    mxUtils.br(arrowPanel);

    var perimeterPanel: any = colorPanel.cloneNode(false);
    perimeterPanel.style.fontWeight = "normal";
    perimeterPanel.style.position = "relative";
    perimeterPanel.style.paddingLeft = "16px";
    perimeterPanel.style.marginBottom = "2px";
    perimeterPanel.style.marginTop = "6px";
    perimeterPanel.style.borderWidth = "0px";
    perimeterPanel.style.paddingBottom = "18px";

    var span: any = document.createElement("div");
    span.style.position = "absolute";
    span.style.marginLeft = "3px";
    span.style.marginBottom = "12px";
    span.style.marginTop = "1px";
    span.style.fontWeight = "normal";
    span.style.width = "120px";
    mxUtils.write(span, mxResources.get("perimeter"));
    perimeterPanel.appendChild(span);

    var perimeterUpdate;
    var perimeterSpacing = this.addUnitInput(
      perimeterPanel,
      "pt",
      20,
      41,
      () => {
        perimeterUpdate.apply(this, []);
      },
    );

    if (ss.edges.length == graph.getSelectionCount()) {
      container.appendChild(stylePanel2);

      if (mxClient.IS_QUIRKS) {
        mxUtils.br(container);
        mxUtils.br(container);
      }

      container.appendChild(arrowPanel);
    } else if (ss.vertices.length == graph.getSelectionCount()) {
      if (mxClient.IS_QUIRKS) {
        mxUtils.br(container);
      }

      container.appendChild(perimeterPanel);
    }

    var listener = (_sender?, _evt?, force?) => {
      ss = this.format.getSelectionState();
      // var color = mxUtils.getValue(ss.style, strokeKey, null);

      if (force || document.activeElement != input) {
        var tmp = parseInt(
          mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1),
        );
        input.value = isNaN(tmp) ? "" : tmp + " pt";
      }

      if (force || document.activeElement != altInput) {
        var tmp = parseInt(
          mxUtils.getValue(ss.style, mxConstants.STYLE_STROKEWIDTH, 1),
        );
        altInput.value = isNaN(tmp) ? "" : tmp + " pt";
      }

      styleSelect.style.visibility =
        ss.style.shape == "connector" || ss.style.shape == "filledEdge"
          ? ""
          : "hidden";

      if (mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == "1") {
        styleSelect.value = "curved";
      } else if (
        mxUtils.getValue(ss.style, mxConstants.STYLE_ROUNDED, null) == "1"
      ) {
        styleSelect.value = "rounded";
      }

      if (mxUtils.getValue(ss.style, mxConstants.STYLE_DASHED, null) == "1") {
        if (
          mxUtils.getValue(ss.style, mxConstants.STYLE_DASH_PATTERN, null) ==
            null
        ) {
          solid.style.borderBottom = "1px dashed " + this.defaultStrokeColor;
        } else {
          solid.style.borderBottom = "1px dotted " + this.defaultStrokeColor;
        }
      } else {
        solid.style.borderBottom = "1px solid " + this.defaultStrokeColor;
      }

      altSolid.style.borderBottom = solid.style.borderBottom;

      // Updates toolbar icon for edge style
      var edgeStyleDiv = edgeStyle.getElementsByTagName("div")[0];
      var es = mxUtils.getValue(ss.style, mxConstants.STYLE_EDGE, null);

      if (
        mxUtils.getValue(ss.style, mxConstants.STYLE_NOEDGESTYLE, null) == "1"
      ) {
        es = null;
      }

      if (
        es == "orthogonalEdgeStyle" &&
        mxUtils.getValue(ss.style, mxConstants.STYLE_CURVED, null) == "1"
      ) {
        edgeStyleDiv.className = "geSprite geSprite-curved";
      } else if (es == "straight" || es == "none" || es == null) {
        edgeStyleDiv.className = "geSprite geSprite-straight";
      } else if (es == "entityRelationEdgeStyle") {
        edgeStyleDiv.className = "geSprite geSprite-entity";
      } else if (es == "elbowEdgeStyle") {
        edgeStyleDiv.className = "geSprite " +
          (mxUtils.getValue(ss.style, mxConstants.STYLE_ELBOW, null) ==
            "vertical"
            ? "geSprite-verticalelbow"
            : "geSprite-horizontalelbow");
      } else if (es == "isometricEdgeStyle") {
        edgeStyleDiv.className = "geSprite " +
          (mxUtils.getValue(ss.style, mxConstants.STYLE_ELBOW, null) ==
            "vertical"
            ? "geSprite-verticalisometric"
            : "geSprite-horizontalisometric");
      } else {
        edgeStyleDiv.className = "geSprite geSprite-orthogonal";
      }

      // Updates icon for edge shape
      var edgeShapeDiv = edgeShape.getElementsByTagName("div")[0];

      if (ss.style.shape == "link") {
        edgeShapeDiv.className = "geSprite geSprite-linkedge";
      } else if (ss.style.shape == "flexArrow") {
        edgeShapeDiv.className = "geSprite geSprite-arrow";
      } else if (ss.style.shape == "arrow") {
        edgeShapeDiv.className = "geSprite geSprite-simplearrow";
      } else {
        edgeShapeDiv.className = "geSprite geSprite-connection";
      }

      if (ss.edges.length == graph.getSelectionCount()) {
        altStylePanel.style.display = "";
        stylePanel.style.display = "none";
      } else {
        altStylePanel.style.display = "none";
        stylePanel.style.display = "";
      }

      const updateArrow = (marker, fill, elt, prefix) => {
        var markerDiv = elt.getElementsByTagName("div")[0];

        markerDiv.className = ui.getCssClassForMarker(
          prefix,
          ss.style.shape,
          marker,
          fill,
        );

        if (markerDiv.className == "geSprite geSprite-noarrow") {
          markerDiv.innerHTML = mxUtils.htmlEntities(mxResources.get("none"));
          markerDiv.style.backgroundImage = "none";
          markerDiv.style.verticalAlign = "top";
          markerDiv.style.marginTop = "5px";
          markerDiv.style.fontSize = "10px";
          markerDiv.style.filter = "none";
          markerDiv.style.color = this.defaultStrokeColor;
          markerDiv.nextSibling.style.marginTop = "0px";
        }

        return markerDiv;
      };

      var sourceDiv = updateArrow(
        mxUtils.getValue(ss.style, mxConstants.STYLE_STARTARROW, null),
        mxUtils.getValue(ss.style, "startFill", "1"),
        lineStart,
        "start",
      );
      var targetDiv = updateArrow(
        mxUtils.getValue(ss.style, mxConstants.STYLE_ENDARROW, null),
        mxUtils.getValue(ss.style, "endFill", "1"),
        lineEnd,
        "end",
      );

      // Special cases for markers
      if (ss.style.shape == "arrow") {
        sourceDiv.className = "geSprite geSprite-noarrow";
        targetDiv.className = "geSprite geSprite-endblocktrans";
      } else if (ss.style.shape == "link") {
        sourceDiv.className = "geSprite geSprite-noarrow";
        targetDiv.className = "geSprite geSprite-noarrow";
      }

      mxUtils.setOpacity(edgeStyle, ss.style.shape == "arrow" ? 30 : 100);

      if (
        ss.style.shape != "connector" &&
        ss.style.shape != "flexArrow" &&
        ss.style.shape != "filledEdge"
      ) {
        mxUtils.setOpacity(lineStart, 30);
        mxUtils.setOpacity(lineEnd, 30);
      } else {
        mxUtils.setOpacity(lineStart, 100);
        mxUtils.setOpacity(lineEnd, 100);
      }

      if (force || document.activeElement != startSize) {
        var tmp = parseInt(
          mxUtils.getValue(
            ss.style,
            mxConstants.STYLE_STARTSIZE,
            mxConstants.DEFAULT_MARKERSIZE,
          ),
        );
        startSize.value = isNaN(tmp) ? "" : tmp + " pt";
      }

      if (force || document.activeElement != startSpacing) {
        var tmp = parseInt(
          mxUtils.getValue(
            ss.style,
            mxConstants.STYLE_SOURCE_PERIMETER_SPACING,
            0,
          ),
        );
        startSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
      }

      if (force || document.activeElement != endSize) {
        var tmp = parseInt(
          mxUtils.getValue(
            ss.style,
            mxConstants.STYLE_ENDSIZE,
            mxConstants.DEFAULT_MARKERSIZE,
          ),
        );
        endSize.value = isNaN(tmp) ? "" : tmp + " pt";
      }

      if (force || document.activeElement != startSpacing) {
        var tmp = parseInt(
          mxUtils.getValue(
            ss.style,
            mxConstants.STYLE_TARGET_PERIMETER_SPACING,
            0,
          ),
        );
        endSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
      }

      if (force || document.activeElement != perimeterSpacing) {
        var tmp = parseInt(
          mxUtils.getValue(ss.style, mxConstants.STYLE_PERIMETER_SPACING, 0),
        );
        perimeterSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
      }
    };

    startSizeUpdate = this.installInputHandler(
      startSize,
      mxConstants.STYLE_STARTSIZE,
      mxConstants.DEFAULT_MARKERSIZE,
      0,
      999,
      " pt",
    );
    startSpacingUpdate = this.installInputHandler(
      startSpacing,
      mxConstants.STYLE_SOURCE_PERIMETER_SPACING,
      0,
      -999,
      999,
      " pt",
    );
    endSizeUpdate = this.installInputHandler(
      endSize,
      mxConstants.STYLE_ENDSIZE,
      mxConstants.DEFAULT_MARKERSIZE,
      0,
      999,
      " pt",
    );
    endSpacingUpdate = this.installInputHandler(
      endSpacing,
      mxConstants.STYLE_TARGET_PERIMETER_SPACING,
      0,
      -999,
      999,
      " pt",
    );
    perimeterUpdate = this.installInputHandler(
      perimeterSpacing,
      mxConstants.STYLE_PERIMETER_SPACING,
      0,
      0,
      999,
      " pt",
    );

    this.addKeyHandler(input, listener);
    this.addKeyHandler(startSize, listener);
    this.addKeyHandler(startSpacing, listener);
    this.addKeyHandler(endSize, listener);
    this.addKeyHandler(endSpacing, listener);
    this.addKeyHandler(perimeterSpacing, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();

    return container;
  }
}
