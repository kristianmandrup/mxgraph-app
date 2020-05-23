import mx from "@mxgraph-app/mx";
import { Unit } from "./Unit";
const {
  mxConstants,
  mxEvent,
  mxUtils,
} = mx;

/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
export class Format extends Unit {
  editorUi: any;
  container: any;
  documentMode: any;
  selectionState: any;
  panels: any;

  constructor(editorUi, container) {
    super(editorUi, container);
  }

  /**
   * Returns information about the current selection.
   */
  labelIndex = 0;

  /**
   * Returns information about the current selection.
   */
  currentIndex = 0;

  /**
   * Returns information about the current selection.
   */
  showCloseButton = true;

  /**
   * Background color for inactive tabs.
   */
  inactiveTabBackgroundColor = "#f1f3f4";

  /**
   * Background color for inactive tabs.
   */
  roundableShapes = [
    "label",
    "rectangle",
    "internalStorage",
    "corner",
    "parallelogram",
    "swimlane",
    "triangle",
    "trapezoid",
    "ext",
    "step",
    "tee",
    "process",
    "link",
    "rhombus",
    "offPageConnector",
    "loopLimit",
    "hexagon",
    "manualInput",
    "curlyBracket",
    "singleArrow",
    "callout",
    "doubleArrow",
    "flexArrow",
    "card",
    "umlLifeline",
  ];

  update(_sender?, _evt?) {
    this.clearSelectionState();
    this.refresh();
  }

  refresh() {
    // use refresher?
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
    graph.addListener(mxEvent.EDITING_STARTED, this.update);
    graph.addListener(mxEvent.EDITING_STOPPED, this.update);
    graph.getModel().addListener(mxEvent.CHANGE, this.update);
    graph.addListener(mxEvent.ROOT, () => {
      this.refresh();
    });

    editor.addListener("autosaveChanged", () => {
      this.refresh();
    });

    this.refresh();
  }

  /**
   * Returns information about the current selection.
   */
  clearSelectionState() {
    this.selectionState = null;
  }

  /**
   * Returns information about the current selection.
   */
  getSelectionState() {
    if (this.selectionState == null) {
      this.selectionState = this.createSelectionState();
    }

    return this.selectionState;
  }

  /**
   * Returns information about the current selection.
   */
  createSelectionState() {
    var cells = this.editorUi.editor.graph.getSelectionCells();
    var result = this.initSelectionState();

    for (var i = 0; i < cells.length; i++) {
      this.updateSelectionStateForCell(result, cells[i], cells);
    }

    return result;
  }

  /**
   * Returns information about the current selection.
   */
  initSelectionState() {
    return {
      vertices: [],
      edges: [],
      x: null,
      y: null,
      width: null,
      height: null,
      style: {},
      containsImage: false,
      containsLabel: false,
      fill: true,
      glass: true,
      rounded: true,
      comic: true,
      autoSize: false,
      image: true,
      shadow: true,
      lineJumps: true,
    };
  }

  /**
   * Returns information about the current selection.
   */
  updateSelectionStateForCell(result, cell, _cells?) {
    var graph = this.editorUi.editor.graph;

    if (graph.getModel().isVertex(cell)) {
      result.vertices.push(cell);
      var geo = graph.getCellGeometry(cell);

      if (geo != null) {
        if (geo.width > 0) {
          if (result.width == null) {
            result.width = geo.width;
          } else if (result.width != geo.width) {
            result.width = "";
          }
        } else {
          result.containsLabel = true;
        }

        if (geo.height > 0) {
          if (result.height == null) {
            result.height = geo.height;
          } else if (result.height != geo.height) {
            result.height = "";
          }
        } else {
          result.containsLabel = true;
        }

        if (!geo.relative || geo.offset != null) {
          var x = (geo.relative) ? geo.offset.x : geo.x;
          var y = (geo.relative) ? geo.offset.y : geo.y;

          if (result.x == null) {
            result.x = x;
          } else if (result.x != x) {
            result.x = "";
          }

          if (result.y == null) {
            result.y = y;
          } else if (result.y != y) {
            result.y = "";
          }
        }
      }
    } else if (graph.getModel().isEdge(cell)) {
      result.edges.push(cell);
    }

    var state = graph.view.getState(cell);

    if (state != null) {
      result.autoSize = result.autoSize || this.isAutoSizeState(state);
      result.glass = result.glass && this.isGlassState(state);
      result.rounded = result.rounded && this.isRoundedState(state);
      result.lineJumps = result.lineJumps && this.isLineJumpState(state);
      result.comic = result.comic && this.isComicState(state);
      result.image = result.image && this.isImageState(state);
      result.shadow = result.shadow && this.isShadowState(state);
      result.fill = result.fill && this.isFillState(state);

      var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
      result.containsImage = result.containsImage || shape == "image";

      for (var key in state.style) {
        var value = state.style[key];

        if (value != null) {
          if (result.style[key] == null) {
            result.style[key] = value;
          } else if (result.style[key] != value) {
            result.style[key] = "";
          }
        }
      }
    }
  }

  /**
   * Returns information about the current selection.
   */
  isFillState(state) {
    return state.view.graph.model.isVertex(state.cell) ||
      mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) ==
        "arrow" ||
      mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) ==
        "filledEdge" ||
      mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) ==
        "flexArrow";
  }

  /**
   * Returns information about the current selection.
   */
  isGlassState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

    return (shape == "label" || shape == "rectangle" ||
      shape == "internalStorage" ||
      shape == "ext" || shape == "umlLifeline" || shape == "swimlane" ||
      shape == "process");
  }

  /**
   * Returns information about the current selection.
   */
  isRoundedState(state) {
    return (state.shape != null) ? state.shape.isRoundable() : mxUtils.indexOf(
      this.roundableShapes,
      mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null),
    ) >= 0;
  }

  /**
   * Returns information about the current selection.
   */
  isLineJumpState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
    var curved = mxUtils.getValue(state.style, mxConstants.STYLE_CURVED, false);

    return !curved && (shape == "connector" || shape == "filledEdge");
  }

  /**
   * Returns information about the current selection.
   */
  isComicState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

    return mxUtils.indexOf(
      [
        "label",
        "rectangle",
        "internalStorage",
        "corner",
        "parallelogram",
        "note",
        "collate",
        "swimlane",
        "triangle",
        "trapezoid",
        "ext",
        "step",
        "tee",
        "process",
        "link",
        "rhombus",
        "offPageConnector",
        "loopLimit",
        "hexagon",
        "manualInput",
        "singleArrow",
        "doubleArrow",
        "flexArrow",
        "filledEdge",
        "card",
        "umlLifeline",
        "connector",
        "folder",
        "component",
        "sortShape",
        "cross",
        "umlFrame",
        "cube",
        "isoCube",
        "isoRectangle",
        "partialRectangle",
      ],
      shape,
    ) >= 0;
  }

  /**
   * Returns information about the current selection.
   */
  isAutoSizeState(state) {
    return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) ==
      "1";
  }

  /**
   * Returns information about the current selection.
   */
  isImageState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

    return (shape == "label" || shape == "image");
  }

  /**
   * Returns information about the current selection.
   */
  isShadowState(state) {
    var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

    return (shape != "image");
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  clear() {
    this.container.innerHTML = "";

    // Destroy existing panels
    if (this.panels) {
      for (var i = 0; i < this.panels.length; i++) {
        this.panels[i].destroy();
      }
    }

    this.panels = [];
  }
}
