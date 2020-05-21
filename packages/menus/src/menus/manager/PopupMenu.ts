import mx from "@mxgraph-app/mx";
import { AbstractMenuItemAdder } from "../AbstractMenuItemAdder";
const { mxResources, mxMouseEvent, mxUtils, mxConstants, mxEdgeHandler } = mx;

export class PopupMenu extends AbstractMenuItemAdder {
  editorUi: any;
  addMenuItems: any;

  constructor(editorUi: any) {
    super(editorUi);
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  createPopupMenu(menu, cell, evt) {
    menu.smartSeparators = true;

    this.addPopupMenuHistoryItems(menu, cell, evt);
    this.addPopupMenuEditItems(menu, cell, evt);
    this.addPopupMenuStyleItems(menu, cell, evt);
    this.addPopupMenuArrangeItems(menu, cell, evt);
    this.addPopupMenuCellItems(menu, cell, evt);
    this.addPopupMenuSelectionItems(menu, cell, evt);
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuHistoryItems(menu, _cell, evt) {
    if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ["undo", "redo"], null, evt);
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuEditItems(menu, _cell, evt) {
    if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ["pasteHere"], null, evt);
    } else {
      this.addMenuItems(
        menu,
        ["delete", "-", "cut", "copy", "-", "duplicate"],
        null,
        evt
      );
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuStyleItems(menu, _cell, evt) {
    if (this.editorUi.editor.graph.getSelectionCount() == 1) {
      this.addMenuItems(menu, ["-", "setAsDefaultStyle"], null, evt);
    } else if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ["-", "clearDefaultStyle"], null, evt);
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuArrangeItems(menu, cell, evt) {
    var graph = this.editorUi.editor.graph;

    if (!graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ["-", "toFront", "toBack"], null, evt);
    }

    if (graph.getSelectionCount() > 1) {
      this.addMenuItems(menu, ["-", "group"], null, evt);
    } else if (
      graph.getSelectionCount() == 1 &&
      !graph.getModel().isEdge(cell) &&
      !graph.isSwimlane(cell) &&
      graph.getModel().getChildCount(cell) > 0
    ) {
      this.addMenuItems(menu, ["-", "ungroup"], null, evt);
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuCellItems(menu, cell, evt) {
    var graph = this.editorUi.editor.graph;
    cell = graph.getSelectionCell();
    var state = graph.view.getState(cell);
    menu.addSeparator();

    if (state != null) {
      var hasWaypoints = false;

      if (
        graph.getModel().isEdge(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_EDGE, null) !=
          "entityRelationEdgeStyle" &&
        mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) != "arrow"
      ) {
        var handler = graph.selectionCellsHandler.getHandler(cell);
        var isWaypoint = false;

        if (
          handler instanceof mxEdgeHandler &&
          handler.bends != null &&
          handler.bends.length > 2
        ) {
          var index = handler.getHandleForEvent(
            graph.updateMouseEvent(new mxMouseEvent(evt))
          );

          // Configures removeWaypoint action before execution
          // Using trigger parameter is cleaner but have to find waypoint here anyway.
          var rmWaypointAction = this.editorUi.actions.get("removeWaypoint");
          rmWaypointAction.handler = handler;
          rmWaypointAction.index = index;

          isWaypoint = index > 0 && index < handler.bends.length - 1;
        }

        menu.addSeparator();
        this.addMenuItem(
          menu,
          "turn",
          null,
          evt,
          null,
          mxResources.get("reverse")
        );
        this.addMenuItems(
          menu,
          [isWaypoint ? "removeWaypoint" : "addWaypoint"],
          null,
          evt
        );

        // Adds reset waypoints option if waypoints exist
        var geo = graph.getModel().getGeometry(cell);
        hasWaypoints =
          geo != null && geo.points != null && geo.points.length > 0;
      }

      if (
        graph.getSelectionCount() == 1 &&
        (hasWaypoints ||
          (graph.getModel().isVertex(cell) &&
            graph.getModel().getEdgeCount(cell) > 0))
      ) {
        this.addMenuItems(menu, ["-", "clearWaypoints"], null, evt);
      }
    }

    if (graph.getSelectionCount() == 1) {
      this.addMenuItems(menu, ["-", "editData", "editLink"], null, evt);

      // Shows edit image action if there is an image in the style
      if (
        graph.getModel().isVertex(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) != null
      ) {
        menu.addSeparator();
        this.addMenuItem(
          menu,
          "image",
          null,
          evt
        ).firstChild.nextSibling.innerHTML =
          mxResources.get("editImage") + "...";
      }
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuSelectionItems(menu, _cell, evt) {
    if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(
        menu,
        ["-", "selectVertices", "selectEdges", "selectAll"],
        null,
        evt
      );
    }
  }
}
