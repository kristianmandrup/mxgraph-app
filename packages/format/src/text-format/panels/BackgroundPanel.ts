export class BackgroundPanel {
  create() {
    const bgPanel = graph.cellEditor.isContentEditing()
      ? this.createColorOption(
          mxResources.get("backgroundColor"),
          function () {
            return currentBgColor;
          },
          function (color) {
            document.execCommand(
              "backcolor",
              false,
              color != mxConstants.NONE ? color : "transparent"
            );
          },
          "#ffffff",
          {
            install: function (apply) {
              bgColorApply = apply;
            },
            destroy: function () {
              bgColorApply = null;
            },
          },
          null,
          true
        )
      : this.createCellColorOption(
          mxResources.get("backgroundColor"),
          mxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
          "#ffffff",
          null,
          function (_color) {
            graph.updateLabelElements(graph.getSelectionCells(), function (
              elt
            ) {
              elt.style.backgroundColor = null;
            });
          }
        );
    bgPanel.style.fontWeight = "bold";
    return bgPanel;
  }
}
