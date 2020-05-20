import mx from "mx";
import resources from "resources/resources";
import { EditorUI } from "ui/EditorUI";
const { urlParams } = resources;
const { mxConstants, mxEvent, mxResources, mxClient } = mx;

export class ToolbarInitializer {
  container: any;
  editorUi: any;
  staticElements = [];
  updateZoom: any;
  edgeShapeMenu: any;
  edgeStyleMenu: any;
  fontMenu: any;
  sizeMenu: any;
  currentElt: any;
  gestureHandler: any;

  dropdownImageHtml: any;

  addDropDownArrow: any; // fn
  addMenu: any; // fn
  addSeparator: any; // fn
  addItems: any; // fn
  addMenuFunction: any; // fn

  init() {
    var sw = screen.width;

    // Takes into account initial compact mode
    sw -= (screen.height > 740) ? 56 : 0;

    if (sw >= 700) {
      var formatMenu = this.addMenu(
        "",
        mxResources.get("view") + " (" + mxResources.get("panTooltip") + ")",
        true,
        "viewPanels",
        null,
        true,
      );
      this.addDropDownArrow(
        formatMenu,
        "geSprite-formatpanel",
        38,
        50,
        -4,
        -3,
        36,
        -8,
      );
      this.addSeparator();
    }

    var viewMenu: any = this.addMenu(
      "",
      mxResources.get("zoom") + " (Alt+Mousewheel)",
      true,
      "viewZoom",
      null,
      true,
    );
    viewMenu.showDisabled = true;
    viewMenu.style.whiteSpace = "nowrap";
    viewMenu.style.position = "relative";
    viewMenu.style.overflow = "hidden";

    if (EditorUI.compactUi) {
      viewMenu.style.width = (mxClient.IS_QUIRKS) ? "58px" : "50px";
    } else {
      viewMenu.style.width = (mxClient.IS_QUIRKS) ? "62px" : "36px";
    }

    if (sw >= 420) {
      this.addSeparator();
      var elts = this.addItems(["zoomIn", "zoomOut"]);
      elts[0].setAttribute(
        "title",
        mxResources.get("zoomIn") + " (" +
          this.editorUi.actions.get("zoomIn").shortcut + ")",
      );
      elts[1].setAttribute(
        "title",
        mxResources.get("zoomOut") + " (" +
          this.editorUi.actions.get("zoomOut").shortcut + ")",
      );
    }

    // Updates the label if the scale changes
    this.updateZoom = () => {
      viewMenu.innerHTML =
        Math.round(this.editorUi.editor.graph.view.scale * 100) + "%" +
        this.dropdownImageHtml;

      if (EditorUI.compactUi) {
        viewMenu.getElementsByTagName("img")[0].style.right = "1px";
        viewMenu.getElementsByTagName("img")[0].style.top = "5px";
      }
    };

    this.editorUi.editor.graph.view.addListener(
      mxEvent.SCALE,
      this.updateZoom,
    );
    this.editorUi.editor.addListener("resetGraphView", this.updateZoom);

    var elts = this.addItems(["-", "undo", "redo"]);
    elts[1].setAttribute(
      "title",
      mxResources.get("undo") + " (" +
        this.editorUi.actions.get("undo").shortcut + ")",
    );
    elts[2].setAttribute(
      "title",
      mxResources.get("redo") + " (" +
        this.editorUi.actions.get("redo").shortcut + ")",
    );

    if (sw >= 320) {
      var elts = this.addItems(["-", "delete"]);
      elts[1].setAttribute(
        "title",
        mxResources.get("delete") + " (" +
          this.editorUi.actions.get("delete").shortcut + ")",
      );
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
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_SHAPE, "width"],
              [null, null],
              "geIcon geSprite geSprite-connection",
              null,
              true,
            ).setAttribute("title", mxResources.get("line"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_SHAPE, "width"],
              ["link", null],
              "geIcon geSprite geSprite-linkedge",
              null,
              true,
            ).setAttribute("title", mxResources.get("link"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_SHAPE, "width"],
              ["flexArrow", null],
              "geIcon geSprite geSprite-arrow",
              null,
              true,
            ).setAttribute("title", mxResources.get("arrow"));
            this.editorUi.menus.edgeStyleChange(
              menu,
              "",
              [mxConstants.STYLE_SHAPE, "width"],
              ["arrow", null],
              "geIcon geSprite geSprite-simplearrow",
              null,
              true,
            ).setAttribute("title", mxResources.get("simpleArrow"));
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
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("straight"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("orthogonal"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("simple"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("simple"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("isometric"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("isometric"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("curved"));
          this.editorUi.menus.edgeStyleChange(
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
          ).setAttribute("title", mxResources.get("entityRelation"));
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

    this.addSeparator();

    var insertMenu = this.addMenu(
      "",
      mxResources.get("insert") + " (" + mxResources.get("doubleClickTooltip") +
        ")",
      true,
      "insert",
      null,
      true,
    );
    this.addDropDownArrow(insertMenu, "geSprite-plus", 38, 48, -4, -3, 36, -8);

    if (urlParams["dev"] == "1") {
      this.addSeparator();

      // KNOWN: All table stuff does not work with undo/redo
      // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
      // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
      var elt = this.addMenuFunction(
        "geIcon geSprite geSprite-table",
        mxResources.get("table"),
        false,
        (menu) => {
          var graph = this.editorUi.editor.graph;
          var cell = graph.getSelectionCell();

          if (
            !graph.isTableCell(cell) && !graph.isTableRow(cell) &&
            !graph.isTable(cell)
          ) {
            this.editorUi.menus.addInsertTableItem(
              menu,
              (evt, rows, cols) => {
                var table = (mxEvent.isShiftDown(evt))
                  ? graph.createCrossFunctionalSwimlane(rows, cols)
                  : graph.createTable(rows, cols);
                var pt = (mxEvent.isAltDown(evt))
                  ? graph.getFreeInsertPoint()
                  : graph.getCenterInsertPoint(
                    graph.getBoundingBoxFromGeometry([table], true),
                  );
                var select = graph.importCells([table], pt.x, pt.y);

                if (select != null && select.length > 0) {
                  graph.scrollCellToVisible(select[0]);
                  graph.setSelectionCells(select);
                }
              },
            );
          } else {
            elt = menu.addItem(
              "",
              null,
              () => {
                try {
                  graph.insertTableColumn(cell, true);
                } catch (e) {
                  this.editorUi.handleError(e);
                }
              },
              null,
              "geIcon geSprite geSprite-insertcolumnbefore",
            );
            elt.setAttribute("title", mxResources.get("insertColumnBefore"));

            elt = menu.addItem(
              "",
              null,
              () => {
                try {
                  graph.insertTableColumn(cell, false);
                } catch (e) {
                  this.editorUi.handleError(e);
                }
              },
              null,
              "geIcon geSprite geSprite-insertcolumnafter",
            );
            elt.setAttribute("title", mxResources.get("insertColumnAfter"));

            elt = menu.addItem(
              "Delete column",
              null,
              () => {
                if (cell != null) {
                  try {
                    graph.deleteTableColumn(cell);
                  } catch (e) {
                    this.editorUi.handleError(e);
                  }
                }
              },
              null,
              "geIcon geSprite geSprite-deletecolumn",
            );
            elt.setAttribute("title", mxResources.get("deleteColumn"));

            elt = menu.addItem(
              "",
              null,
              () => {
                try {
                  graph.insertTableRow(cell, true);
                } catch (e) {
                  this.editorUi.handleError(e);
                }
              },
              null,
              "geIcon geSprite geSprite-insertrowbefore",
            );
            elt.setAttribute("title", mxResources.get("insertRowBefore"));

            elt = menu.addItem(
              "",
              null,
              () => {
                try {
                  graph.insertTableRow(cell, false);
                } catch (e) {
                  this.editorUi.handleError(e);
                }
              },
              null,
              "geIcon geSprite geSprite-insertrowafter",
            );
            elt.setAttribute("title", mxResources.get("insertRowAfter"));

            elt = menu.addItem(
              "",
              null,
              () => {
                try {
                  graph.deleteTableRow(cell);
                } catch (e) {
                  this.editorUi.handleError(e);
                }
              },
              null,
              "geIcon geSprite geSprite-deleterow",
            );
            elt.setAttribute("title", mxResources.get("deleteRow"));
          }
        },
      );

      elt.style.position = "relative";
      elt.style.whiteSpace = "nowrap";
      elt.style.overflow = "hidden";
      elt.innerHTML =
        '<div class="geSprite geSprite-table" style="margin-left:-2px;"></div>' +
        this.dropdownImageHtml;
      elt.style.width = (mxClient.IS_QUIRKS) ? "50px" : "30px";

      // Fix for item size in kennedy theme
      if (EditorUI.compactUi) {
        elt.getElementsByTagName("img")[0].style.left = "22px";
        elt.getElementsByTagName("img")[0].style.top = "5px";
      }
    }
  }
}
