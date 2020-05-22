import { BaseFormatHandler } from "./BaseFormatHandler";
import mx from "@mxgraph-app/mx";
const { mxConstants, mxClient, mxUtils } = mx;

export class InputHandler extends BaseFormatHandler {
  input: any;
  installInputHandler: any;
  defaultFontSize: any;
  pendingFontSize: any;

  create() {
    const { graph, input } = this;
    return this.installInputHandler(
      input,
      mxConstants.STYLE_FONTSIZE,
      this.defaultFontSize,
      1,
      999,
      " pt",
      (fontSize) => {
        // IE does not support containsNode
        // KNOWN: Fixes font size issues but bypasses undo
        if (window.getSelection && !mxClient.IS_IE && !mxClient.IS_IE11) {
          var selection: any = window.getSelection();
          var container = selection.rangeCount > 0
            ? selection.getRangeAt(0).commonAncestorContainer
            : graph.cellEditor.textarea;

          function updateSize(elt, ignoreContains?) {
            if (
              graph.cellEditor.textarea != null &&
              elt != graph.cellEditor.textarea &&
              graph.cellEditor.textarea.contains(elt) &&
              (ignoreContains || selection.containsNode(elt, true))
            ) {
              if (elt.nodeName == "FONT") {
                elt.removeAttribute("size");
                elt.style.fontSize = fontSize + "px";
              } else {
                var css = mxUtils.getCurrentStyle(elt);

                if (css.fontSize != fontSize + "px") {
                  if (
                    mxUtils.getCurrentStyle(elt.parentNode).fontSize !=
                      fontSize + "px"
                  ) {
                    elt.style.fontSize = fontSize + "px";
                  } else {
                    elt.style.fontSize = "";
                  }
                }
              }
            }
          } // Wraps text node or mixed selection with leading text in a font element

          if (
            container == graph.cellEditor.textarea ||
            container.nodeType != mxConstants.NODETYPE_ELEMENT
          ) {
            document.execCommand("fontSize", false, "1");
          }

          if (container != graph.cellEditor.textarea) {
            container = container.parentNode;
          }

          if (
            container != null &&
            container.nodeType == mxConstants.NODETYPE_ELEMENT
          ) {
            var elts = container.getElementsByTagName("*");
            updateSize(container);

            for (var i = 0; i < elts.length; i++) {
              updateSize(elts[i]);
            }
          }

          input.value = fontSize + " pt";
        } else if (window.getSelection || this.selection) {
          // Checks selection
          var par = null;

          if (this.selection) {
            par = this.selection.createRange().parentElement();
          } else {
            selection = window.getSelection();

            if (selection.rangeCount > 0) {
              par = selection.getRangeAt(0).commonAncestorContainer;
            }
          }

          // Node.contains does not work for text nodes in IE11
          function isOrContains(container, node) {
            while (node != null) {
              if (node === container) {
                return true;
              }

              node = node.parentNode;
            }

            return false;
          }

          if (par != null && isOrContains(graph.cellEditor.textarea, par)) {
            this.pendingFontSize = fontSize;

            // Workaround for can't set font size in px is to change font size afterwards
            document.execCommand("fontSize", false, "4");
            var elts = graph.cellEditor.textarea.getElementsByTagName("font");

            for (var i = 0; i < elts.length; i++) {
              if (elts[i].getAttribute("size") == "4") {
                elts[i].removeAttribute("size");
                elts[i].style.fontSize = this.pendingFontSize + "px";

                // Overrides fontSize in input with the one just assigned as a workaround
                // for potential fontSize values of parent elements that don't match
                window.setTimeout(() => {
                  input.value = this.pendingFontSize + " pt";
                  this.pendingFontSize = null;
                }, 0);

                break;
              }
            }
          }
        }
      },
      true,
    );
  }
}
