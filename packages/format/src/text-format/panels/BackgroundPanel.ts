import mx from "@mxgraph-app/mx";
import { BaseFormatPanel } from "../../BaseFormatPanel";
const { mxConstants, mxResources } = mx;

export class BackgroundPanel extends BaseFormatPanel {
  currentBgColor: any;
  bgColorApply: any;

  create() {
    const { graph, currentBgColor } = this;
    const bgPanel = graph.cellEditor.isContentEditing()
      ? this.createColorOption(
          mxResources.get("backgroundColor"),
          () => {
            return currentBgColor;
          },
          (color) => {
            document.execCommand(
              "backcolor",
              false,
              color != mxConstants.NONE ? color : "transparent"
            );
          },
          "#ffffff",
          {
            install: (apply) => {
              this.bgColorApply = apply;
            },
            destroy: () => {
              this.bgColorApply = null;
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
