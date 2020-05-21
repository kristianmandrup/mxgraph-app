export class ActionStateUpdater {
  editor: any;
  actions: any;
  menus: any;
  updatePasteActionStates: any; // fn

  /**
   * Updates the states of the given toolbar items based on the selection.
   */
  updateActionStates() {
    var graph = this.editor.graph;
    var selected = !graph.isSelectionEmpty();
    var vertexSelected = false;
    var edgeSelected = false;

    var cells = graph.getSelectionCells();

    if (cells) {
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (graph.getModel().isEdge(cell)) {
          edgeSelected = true;
        }

        if (graph.getModel().isVertex(cell)) {
          vertexSelected = true;
        }

        if (edgeSelected && vertexSelected) {
          break;
        }
      }
    }

    // Updates action states
    var actions = [
      "cut",
      "copy",
      "bold",
      "italic",
      "underline",
      "delete",
      "duplicate",
      "editStyle",
      "editTooltip",
      "editLink",
      "backgroundColor",
      "borderColor",
      "edit",
      "toFront",
      "toBack",
      "lockUnlock",
      "solid",
      "dashed",
      "pasteSize",
      "dotted",
      "fillColor",
      "gradientColor",
      "shadow",
      "fontColor",
      "formattedText",
      "rounded",
      "toggleRounded",
      "sharp",
      "strokeColor",
    ];

    for (var i = 0; i < actions.length; i++) {
      this.actions.get(actions[i]).setEnabled(selected);
    }

    this.actions
      .get("setAsDefaultStyle")
      .setEnabled(graph.getSelectionCount() == 1);
    this.actions.get("clearWaypoints").setEnabled(!graph.isSelectionEmpty());
    this.actions.get("copySize").setEnabled(graph.getSelectionCount() == 1);
    this.actions.get("turn").setEnabled(!graph.isSelectionEmpty());
    this.actions.get("curved").setEnabled(edgeSelected);
    this.actions.get("rotation").setEnabled(vertexSelected);
    this.actions.get("wordWrap").setEnabled(vertexSelected);
    this.actions.get("autosize").setEnabled(vertexSelected);
    var oneVertexSelected = vertexSelected && graph.getSelectionCount() == 1;
    this.actions
      .get("group")
      .setEnabled(
        graph.getSelectionCount() > 1 ||
          (oneVertexSelected && !graph.isContainer(graph.getSelectionCell()))
      );
    this.actions
      .get("ungroup")
      .setEnabled(
        graph.getSelectionCount() == 1 &&
          (graph.getModel().getChildCount(graph.getSelectionCell()) > 0 ||
            (oneVertexSelected && graph.isContainer(graph.getSelectionCell())))
      );
    this.actions
      .get("removeFromGroup")
      .setEnabled(
        oneVertexSelected &&
          graph
            .getModel()
            .isVertex(graph.getModel().getParent(graph.getSelectionCell()))
      );

    // Updates menu states
    // var state = graph.view.getState(graph.getSelectionCell());
    this.menus
      .get("navigation")
      .setEnabled(selected || graph.view.currentRoot != null);
    this.actions
      .get("collapsible")
      .setEnabled(
        vertexSelected &&
          (graph.isContainer(graph.getSelectionCell()) ||
            graph.model.getChildCount(graph.getSelectionCell()) > 0)
      );
    this.actions.get("home").setEnabled(graph.view.currentRoot != null);
    this.actions.get("exitGroup").setEnabled(graph.view.currentRoot != null);
    this.actions
      .get("enterGroup")
      .setEnabled(
        graph.getSelectionCount() == 1 &&
          graph.isValidRoot(graph.getSelectionCell())
      );
    var foldable =
      graph.getSelectionCount() == 1 &&
      graph.isCellFoldable(graph.getSelectionCell());
    this.actions.get("expand").setEnabled(foldable);
    this.actions.get("collapse").setEnabled(foldable);
    this.actions.get("editLink").setEnabled(graph.getSelectionCount() == 1);
    this.actions
      .get("openLink")
      .setEnabled(
        graph.getSelectionCount() == 1 &&
          graph.getLinkForCell(graph.getSelectionCell()) != null
      );
    this.actions.get("guides").setEnabled(graph.isEnabled());
    this.actions
      .get("grid")
      .setEnabled(!this.editor.chromeless || this.editor.editable);

    var unlocked =
      graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent());
    this.menus.get("layout").setEnabled(unlocked);
    this.menus.get("insert").setEnabled(unlocked);
    this.menus.get("direction").setEnabled(unlocked && vertexSelected);
    this.menus
      .get("align")
      .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1);
    this.menus
      .get("distribute")
      .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1);
    this.actions.get("selectVertices").setEnabled(unlocked);
    this.actions.get("selectEdges").setEnabled(unlocked);
    this.actions.get("selectAll").setEnabled(unlocked);
    this.actions.get("selectNone").setEnabled(unlocked);

    this.updatePasteActionStates();
  }
}
