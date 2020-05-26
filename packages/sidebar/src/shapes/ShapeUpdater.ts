import mx from "@mxgraph-app/mx";
const { mxConstants, mxUtils } = mx;

export class ShapeUpdater {
  editorUi: any;

  constructor(editorUi?: any) {
    this.editorUi = editorUi;
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  updateShapes(source, targets) {
    var graph = this.editorUi.editor.graph;
    var sourceCellStyle = graph.getCellStyle(source);
    var result: any[] = [];

    graph.model.beginUpdate();
    try {
      var cellStyle = graph.getModel().getStyle(source);

      // Lists the styles to carry over from the existing shape
      var styles = [
        "shadow",
        "dashed",
        "dashPattern",
        "fontFamily",
        "fontSize",
        "fontColor",
        "align",
        "startFill",
        "startSize",
        "endFill",
        "endSize",
        "strokeColor",
        "strokeWidth",
        "fillColor",
        "gradientColor",
        "html",
        "part",
        "noEdgeStyle",
        "edgeStyle",
        "elbow",
        "childLayout",
        "recursiveResize",
        "container",
        "collapsible",
        "connectable",
      ];

      for (var i = 0; i < targets.length; i++) {
        var targetCell = targets[i];

        if (
          graph.getModel().isVertex(targetCell) ==
            graph.getModel().isVertex(source) ||
          graph.getModel().isEdge(targetCell) == graph.getModel().isEdge(source)
        ) {
          var style = graph.getCurrentCellStyle(targets[i]);
          graph.getModel().setStyle(targetCell, cellStyle);

          // Removes all children of composite cells
          if (mxUtils.getValue(style, "composite", "0") == "1") {
            var childCount = graph.model.getChildCount(targetCell);

            for (var j = childCount; j >= 0; j--) {
              graph.model.remove(graph.model.getChildAt(targetCell, j));
            }
          }

          // Replaces the participant style in the lifeline shape with the target shape
          if (
            style[mxConstants.STYLE_SHAPE] == "umlLifeline" &&
            sourceCellStyle[mxConstants.STYLE_SHAPE] != "umlLifeline"
          ) {
            graph.setCellStyles(mxConstants.STYLE_SHAPE, "umlLifeline", [
              targetCell,
            ]);
            graph.setCellStyles(
              "participant",
              sourceCellStyle[mxConstants.STYLE_SHAPE],
              [targetCell]
            );
          }

          for (var j: any = 0; j < styles.length; j++) {
            var value = style[styles[j]];

            if (value != null) {
              graph.setCellStyles(styles[j], value, [targetCell]);
            }
          }

          result.push(targetCell);
        }
      }
    } finally {
      graph.model.endUpdate();
    }

    return result;
  }
}
