import mx from "@mxgraph-app/mx";
import { BaseFormatPanel } from "../../BaseFormatPanel";
const { mxConstants, mxClient, mxResources } = mx;

export class FontColorPanel extends BaseFormatPanel {
  editorUi: any;
  currentFontColor: any;
  fontColorApply: any;
  bgPanel: any;
  borderPanel: any;

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
  }

  create() {
    const { graph } = this;
    const panel = graph.cellEditor.isContentEditing()
      ? this.editFontColorOption()
      : this.fontColorOption();
    panel.style.fontWeight = "bold";
    return panel;
  }

  editFontColorOption() {
    const { currentFontColor, graph, fontColorApply } = this;
    return this.createColorOption(
      mxResources.get("fontColor"),
      () => {
        return currentFontColor;
      },
      (color) => {
        if (mxClient.IS_FF) {
          // Workaround for Firefox that adds the font element around
          // anchor elements which ignore inherited colors is to move
          // the font element inside anchor elements
          var tmp = graph.cellEditor.textarea.getElementsByTagName("font");
          var oldFonts: any[] = [];

          for (var i = 0; i < tmp.length; i++) {
            oldFonts.push({
              node: tmp[i],
              color: tmp[i].getAttribute("color"),
            });
          }

          document.execCommand(
            "forecolor",
            false,
            color != mxConstants.NONE ? color : "transparent"
          );

          // Finds the new or changed font element
          var newFonts = graph.cellEditor.textarea.getElementsByTagName("font");

          for (var i = 0; i < newFonts.length; i++) {
            if (
              i >= oldFonts.length ||
              newFonts[i] != oldFonts[i].node ||
              (newFonts[i] == oldFonts[i].node &&
                newFonts[i].getAttribute("color") != oldFonts[i].color)
            ) {
              var child = newFonts[i].firstChild;

              // Moves the font element to inside the anchor element and adopts all children
              if (
                child != null &&
                child.nodeName == "A" &&
                child.nextSibling == null &&
                child.firstChild != null
              ) {
                var parent = newFonts[i].parentNode;
                parent.insertBefore(child, newFonts[i]);
                var tmp = child.firstChild;

                while (tmp != null) {
                  var next = tmp.nextSibling;
                  newFonts[i].appendChild(tmp);
                  tmp = next;
                }

                child.appendChild(newFonts[i]);
              }

              break;
            }
          }
        } else {
          document.execCommand(
            "forecolor",
            false,
            color != mxConstants.NONE ? color : "transparent"
          );
        }
      },
      "#000000",
      {
        install: (apply) => {
          this.fontColorApply = apply;
        },
        destroy: () => {
          this.fontColorApply = null;
        },
      },
      null,
      true
    );
  }

  fontColorOption() {
    const { bgPanel, borderPanel, graph } = this;
    return this.createCellColorOption(
      mxResources.get("fontColor"),
      mxConstants.STYLE_FONTCOLOR,
      "#000000",
      (color) => {
        if (color == null || color == mxConstants.NONE) {
          bgPanel.style.display = "none";
        } else {
          bgPanel.style.display = "";
        }

        borderPanel.style.display = bgPanel.style.display;
      },
      (color) => {
        if (color == null || color == mxConstants.NONE) {
          graph.setCellStyles(
            mxConstants.STYLE_NOLABEL,
            "1",
            graph.getSelectionCells()
          );
        } else {
          graph.setCellStyles(
            mxConstants.STYLE_NOLABEL,
            null,
            graph.getSelectionCells()
          );
        }

        graph.updateLabelElements(graph.getSelectionCells(), function (elt) {
          elt.removeAttribute("color");
          elt.style.color = null;
        });
      }
    );
  }
}
