import { BaseFormatPanel } from "../base/BaseFormatPanel";
import mx from "@mxgraph-app/mx";
import { StyleFormatPanel } from "../style/StyleFormatPanel";
import { GeometryManager } from "./geometry/GeometryManager";
import { Table } from "./Table";
const { mxConstants, mxClient, mxResources, mxEvent, mxUtils } = mx;

/**
 * Adds the label menu items to the given menu and parent.
 */
export class ArrangePanel extends BaseFormatPanel {
  editorUi: any;
  format: any;
  container: any;
  getUnit: any;
  getUnitStep: any;
  isFloatUnit: any;
  inUnit: any;
  geometryManager: GeometryManager;

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
    this.geometryManager = this.createGeometryManager();
    this.init();
  }

  createGeometryManager() {
    return new GeometryManager(this.editorUi);
  }

  addGeometry() {
    return this.geometryManager.addGeometry(this.container);
  }

  addEdgeGeometry() {
    return this.geometryManager.addGeometry(this.container);
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    var graph = this.editorUi.editor.graph;
    var ss = this.format.getSelectionState();

    this.container.appendChild(this.addLayerOps(this.createPanel()));
    // Special case that adds two panels
    this.addGeometry();
    this.addEdgeGeometry();

    if (!ss.containsLabel || ss.edges.length == 0) {
      this.container.appendChild(this.addAngle(this.createPanel()));
    }

    if (
      !ss.containsLabel &&
      ss.edges.length == 0 &&
      ss.style.shape != "rectangle" &&
      ss.style.shape != "label"
    ) {
      this.container.appendChild(this.addFlip(this.createPanel()));
    }

    if (ss.vertices.length > 1) {
      this.container.appendChild(this.addAlign(this.createPanel()));
      this.container.appendChild(this.addDistribute(this.createPanel()));
    } else if (
      ss.vertices.length == 1 &&
      ss.edges.length == 0 &&
      (graph.isTable(ss.vertices[0]) ||
        graph.isTableRow(ss.vertices[0]) ||
        graph.isTableCell(ss.vertices[0]))
    ) {
      this.container.appendChild(this.addTable(this.createPanel()));
    }

    this.container.appendChild(this.addGroupOps(this.createPanel()));

    if (ss.containsLabel) {
      // Adds functions from hidden style format panel
      var span = document.createElement("div");
      span.style.width = "100%";
      span.style.marginTop = "0px";
      span.style.fontWeight = "bold";
      span.style.padding = "10px 0 0 18px";
      mxUtils.write(span, mxResources.get("style"));
      this.container.appendChild(span);

      new StyleFormatPanel(this.format, this.editorUi, this.container);
    }
  }

  /**
   *
   */
  addTable(div) {
    this.createTable().add(div);
  }

  createTable() {
    return new Table(this.editorUi, this.format);
  }

  /**
   *
   */
  addLayerOps(div) {
    var ui = this.editorUi;

    var btn = mxUtils.button(mxResources.get("toFront"), (_evt) => {
      ui.actions.get("toFront").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("toFront") +
        " (" +
        this.editorUi.actions.get("toFront").shortcut +
        ")",
    );
    btn.style.width = "100px";
    btn.style.marginRight = "2px";
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get("toBack"), (_evt) => {
      ui.actions.get("toBack").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("toBack") +
        " (" +
        this.editorUi.actions.get("toBack").shortcut +
        ")",
    );
    btn.style.width = "100px";
    div.appendChild(btn);

    return div;
  }

  /**
   *
   */
  addGroupOps(div) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var cell = graph.getSelectionCell();
    var ss = this.format.getSelectionState();
    var count = 0;
    var btn: any = null;

    div.style.paddingTop = "8px";
    div.style.paddingBottom = "6px";

    if (graph.getSelectionCount() > 1) {
      btn = mxUtils.button(mxResources.get("group"), (_evt) => {
        ui.actions.get("group").funct();
      });

      btn.setAttribute(
        "title",
        mxResources.get("group") +
          " (" +
          this.editorUi.actions.get("group").shortcut +
          ")",
      );
      btn.style.width = "202px";
      btn.style.marginBottom = "2px";
      div.appendChild(btn);
      count++;
    } else if (
      graph.getSelectionCount() == 1 &&
      !graph.getModel().isEdge(cell) &&
      !graph.isSwimlane(cell) &&
      graph.getModel().getChildCount(cell) > 0
    ) {
      btn = mxUtils.button(mxResources.get("ungroup"), (_evt) => {
        ui.actions.get("ungroup").funct();
      });

      btn.setAttribute(
        "title",
        mxResources.get("ungroup") +
          " (" +
          this.editorUi.actions.get("ungroup").shortcut +
          ")",
      );
      btn.style.width = "202px";
      btn.style.marginBottom = "2px";
      div.appendChild(btn);
      count++;
    }

    if (ss.vertices.length > 0) {
      if (count > 0) {
        mxUtils.br(div);
        count = 0;
      }

      var btn = mxUtils.button(mxResources.get("copySize"), (_evt) => {
        ui.actions.get("copySize").funct();
      });

      btn.setAttribute(
        "title",
        mxResources.get("copySize") +
          " (" +
          this.editorUi.actions.get("copySize").shortcut +
          ")",
      );
      btn.style.width = "202px";
      btn.style.marginBottom = "2px";

      div.appendChild(btn);
      count++;

      if (ui.copiedSize != null) {
        var btn2 = mxUtils.button(mxResources.get("pasteSize"), function (
          _evt,
        ) {
          ui.actions.get("pasteSize").funct();
        });

        btn2.setAttribute(
          "title",
          mxResources.get("pasteSize") +
            " (" +
            this.editorUi.actions.get("pasteSize").shortcut +
            ")",
        );

        div.appendChild(btn2);
        count++;

        btn.style.width = "100px";
        btn.style.marginBottom = "2px";
        btn2.style.width = "100px";
        btn2.style.marginBottom = "2px";
      }
    }

    if (
      graph.getSelectionCount() == 1 &&
      graph.getModel().isVertex(cell) &&
      graph.getModel().isVertex(graph.getModel().getParent(cell))
    ) {
      if (count > 0) {
        mxUtils.br(div);
      }

      btn = mxUtils.button(mxResources.get("removeFromGroup"), (_evt) => {
        ui.actions.get("removeFromGroup").funct();
      });

      btn.setAttribute("title", mxResources.get("removeFromGroup"));
      btn.style.width = "202px";
      btn.style.marginBottom = "2px";
      div.appendChild(btn);
      count++;
    } else if (graph.getSelectionCount() > 0) {
      if (count > 0) {
        mxUtils.br(div);
      }

      btn = mxUtils.button(mxResources.get("clearWaypoints"), (_evt) => {
        this.editorUi.actions.get("clearWaypoints").funct();
      });

      btn.setAttribute(
        "title",
        mxResources.get("clearWaypoints") +
          " (" +
          this.editorUi.actions.get("clearWaypoints").shortcut +
          ")",
      );
      btn.style.width = "202px";
      btn.style.marginBottom = "2px";
      div.appendChild(btn);

      count++;
    }

    if (graph.getSelectionCount() == 1) {
      if (count > 0) {
        mxUtils.br(div);
      }

      btn = mxUtils.button(mxResources.get("editData"), (_evt) => {
        this.editorUi.actions.get("editData").funct();
      });

      btn.setAttribute(
        "title",
        mxResources.get("editData") +
          " (" +
          this.editorUi.actions.get("editData").shortcut +
          ")",
      );
      btn.style.width = "100px";
      btn.style.marginBottom = "2px";
      div.appendChild(btn);
      count++;

      btn = mxUtils.button(mxResources.get("editLink"), (_evt) => {
        this.editorUi.actions.get("editLink").funct();
      });

      btn.setAttribute("title", mxResources.get("editLink"));
      btn.style.width = "100px";
      btn.style.marginLeft = "2px";
      btn.style.marginBottom = "2px";
      div.appendChild(btn);
      count++;
    }

    if (count == 0) {
      div.style.display = "none";
    }

    return div;
  }

  /**
   * add alignment to div
   */
  addAlign(div) {
    var graph = this.editorUi.editor.graph;
    div.style.paddingTop = "6px";
    div.style.paddingBottom = "12px";
    div.appendChild(this.createTitle(mxResources.get("align")));

    var stylePanel = document.createElement("div");
    stylePanel.style.position = "relative";
    stylePanel.style.paddingLeft = "0px";
    stylePanel.style.borderWidth = "0px";
    stylePanel.className = "geToolbarContainer";

    if (mxClient.IS_QUIRKS) {
      div.style.height = "60px";
    }

    var left = this.editorUi.toolbar.addButton(
      "geSprite-alignleft",
      mxResources.get("left"),
      function () {
        graph.alignCells(mxConstants.ALIGN_LEFT);
      },
      stylePanel,
    );
    var center = this.editorUi.toolbar.addButton(
      "geSprite-aligncenter",
      mxResources.get("center"),
      function () {
        graph.alignCells(mxConstants.ALIGN_CENTER);
      },
      stylePanel,
    );
    var right = this.editorUi.toolbar.addButton(
      "geSprite-alignright",
      mxResources.get("right"),
      function () {
        graph.alignCells(mxConstants.ALIGN_RIGHT);
      },
      stylePanel,
    );

    var top = this.editorUi.toolbar.addButton(
      "geSprite-aligntop",
      mxResources.get("top"),
      function () {
        graph.alignCells(mxConstants.ALIGN_TOP);
      },
      stylePanel,
    );
    var middle = this.editorUi.toolbar.addButton(
      "geSprite-alignmiddle",
      mxResources.get("middle"),
      function () {
        graph.alignCells(mxConstants.ALIGN_MIDDLE);
      },
      stylePanel,
    );
    var bottom = this.editorUi.toolbar.addButton(
      "geSprite-alignbottom",
      mxResources.get("bottom"),
      function () {
        graph.alignCells(mxConstants.ALIGN_BOTTOM);
      },
      stylePanel,
    );

    this.styleButtons([left, center, right, top, middle, bottom]);
    right.style.marginRight = "6px";
    div.appendChild(stylePanel);

    return div;
  }

  /**
   *
   */
  addFlip(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    div.style.paddingTop = "6px";
    div.style.paddingBottom = "10px";

    var span = document.createElement("div");
    span.style.marginTop = "2px";
    span.style.marginBottom = "8px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("flip"));
    div.appendChild(span);

    var btn = mxUtils.button(mxResources.get("horizontal"), (_evt) => {
      graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
    });

    btn.setAttribute("title", mxResources.get("horizontal"));
    btn.style.width = "100px";
    btn.style.marginRight = "2px";
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get("vertical"), (_evt) => {
      graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
    });

    btn.setAttribute("title", mxResources.get("vertical"));
    btn.style.width = "100px";
    div.appendChild(btn);

    return div;
  }

  /**
   *
   */
  addDistribute(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    div.style.paddingTop = "6px";
    div.style.paddingBottom = "12px";

    div.appendChild(this.createTitle(mxResources.get("distribute")));

    var btn = mxUtils.button(mxResources.get("horizontal"), (_evt) => {
      graph.distributeCells(true);
    });

    btn.setAttribute("title", mxResources.get("horizontal"));
    btn.style.width = "100px";
    btn.style.marginRight = "2px";
    div.appendChild(btn);

    var btn = mxUtils.button(mxResources.get("vertical"), (_evt) => {
      graph.distributeCells(false);
    });

    btn.setAttribute("title", mxResources.get("vertical"));
    btn.style.width = "100px";
    div.appendChild(btn);

    return div;
  }

  /**
   *
   */
  addAngle(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();

    div.style.paddingBottom = "8px";

    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";

    var input: any;
    var update: any;
    var btn: any;

    if (ss.edges.length == 0) {
      mxUtils.write(span, mxResources.get("angle"));
      div.appendChild(span);

      input = this.addUnitInput(
        div,
        "°",
        20,
        44,
        () => {
          update.apply(this, arguments);
        },
        null,
        null,
        null,
        null,
      );

      mxUtils.br(div);
      div.style.paddingTop = "10px";
    } else {
      div.style.paddingTop = "8px";
    }

    if (!ss.containsLabel) {
      var label = mxResources.get("reverse");

      if (ss.vertices.length > 0 && ss.edges.length > 0) {
        label = mxResources.get("turn") + " / " + label;
      } else if (ss.vertices.length > 0) {
        label = mxResources.get("turn");
      }

      btn = mxUtils.button(label, (evt) => {
        ui.actions.get("turn").funct(evt);
      });

      btn.setAttribute(
        "title",
        label + " (" + this.editorUi.actions.get("turn").shortcut + ")",
      );
      btn.style.width = "202px";
      div.appendChild(btn);

      if (input) {
        btn.style.marginTop = "8px";
      }
    }

    if (input) {
      var listener = (_sender?, _evt?, force?) => {
        if (force || document.activeElement != input) {
          ss = this.format.getSelectionState();
          var tmp = parseFloat(
            mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0),
          );
          input.value = isNaN(tmp) ? "" : tmp + "°";
        }
      };

      update = this.installInputHandler(
        input,
        mxConstants.STYLE_ROTATION,
        0,
        0,
        360,
        "°",
        null,
        true,
      );
      this.addKeyHandler(input, listener);

      graph.getModel().addListener(mxEvent.CHANGE, listener);
      this.listeners.push({
        destroy: function () {
          graph.getModel().removeListener(listener);
        },
      });
      listener();
    }

    return div;
  }
}
