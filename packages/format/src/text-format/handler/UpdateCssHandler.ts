import { BaseFormatHandler } from "./BaseFormatHandler";
import mx from "@mxgraph-app/mx";
const { mxEvent, mxConstants, mxClient, mxUtils } = mx;

export class UpdateCssHandler extends BaseFormatHandler {
  setSelected: any;
  fontStyleItems: any;
  sup: any;
  sub: any;

  full: any;
  left: any;
  center: any;
  right: any;

  currentTable: any;
  tableRow: any;
  tableCell: any;
  tableWrapper: any;
  pendingFontSize: any;
  input: any;
  lineHeightInput: any;
  fontMenu: any;
  currentFontColor: any;
  fontColorApply: any;
  currentBgColor: any;
  bgColorApply: any;

  create() {
    const { graph } = this;
    if (graph.cellEditor.isContentEditing()) {
      const { updateCssHandler } = this;
      if (
        mxClient.IS_FF ||
        mxClient.IS_EDGE ||
        mxClient.IS_IE ||
        mxClient.IS_IE11
      ) {
        mxEvent.addListener(
          graph.cellEditor.textarea,
          "DOMSubtreeModified",
          updateCssHandler,
        );
      }

      mxEvent.addListener(graph.cellEditor.textarea, "input", updateCssHandler);
      mxEvent.addListener(
        graph.cellEditor.textarea,
        "touchend",
        updateCssHandler,
      );
      mxEvent.addListener(
        graph.cellEditor.textarea,
        "mouseup",
        updateCssHandler,
      );
      mxEvent.addListener(graph.cellEditor.textarea, "keyup", updateCssHandler);
      this.listeners.push({
        destroy: function () {
          // No need to remove listener since textarea is destroyed after edit
        },
      });
      this.updateCssHandler();
    }
  }

  updateCssHandler = () => {
    const { graph, setSelected, fontStyleItems, sup, sub, ss } = this;
    const {
      full,
      left,
      center,
      right,
    } = this;

    const {
      currentTable,
      tableWrapper,
      pendingFontSize,
      lineHeightInput,
      input,
      fontMenu,
      currentFontColor,
      fontColorApply,
      currentBgColor,
      bgColorApply,
    } = this;

    var updating = false;
    if (!updating) {
      updating = true;

      window.setTimeout(() => {
        var selectedElement = graph.getSelectedElement();
        var node = selectedElement;

        while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT) {
          node = node.parentNode;
        }

        if (node != null) {
          // Workaround for commonAncestor on range in IE11 returning parent of common ancestor
          if (
            node == graph.cellEditor.textarea &&
            graph.cellEditor.textarea.children.length == 1 &&
            graph.cellEditor.textarea.firstChild.nodeType ==
              mxConstants.NODETYPE_ELEMENT
          ) {
            node = graph.cellEditor.textarea.firstChild;
          }

          function getRelativeLineHeight(fontSize, css, elt) {
            if (elt.style != null && css != null) {
              var lineHeight: any = css.lineHeight;

              if (
                elt.style.lineHeight != null &&
                elt.style.lineHeight.substring(
                    elt.style.lineHeight.length - 1,
                  ) == "%"
              ) {
                return parseInt(elt.style.lineHeight) / 100;
              } else {
                return lineHeight.substring(lineHeight.length - 2) == "px"
                  ? parseFloat(lineHeight) / fontSize
                  : parseInt(lineHeight);
              }
            } else {
              return "";
            }
          }

          function getAbsoluteFontSize(css) {
            var fontSize = css != null ? css.fontSize : null;

            if (
              fontSize != null &&
              fontSize.substring(fontSize.length - 2) == "px"
            ) {
              return parseFloat(fontSize);
            } else {
              return mxConstants.DEFAULT_FONTSIZE;
            }
          }

          var css = mxUtils.getCurrentStyle(node);
          var fontSize = getAbsoluteFontSize(css);
          var lineHeight: any = getRelativeLineHeight(fontSize, css, node);

          // Finds common font size
          var elts = node.getElementsByTagName("*");

          // IE does not support containsNode
          if (
            elts.length > 0 &&
            window.getSelection &&
            !mxClient.IS_IE &&
            !mxClient.IS_IE11
          ) {
            var selection: any = window.getSelection();

            for (var i = 0; i < elts.length; i++) {
              if (selection.containsNode(elts[i], true)) {
                var temp = mxUtils.getCurrentStyle(elts[i]);
                fontSize = Math.max(getAbsoluteFontSize(temp), fontSize);
                var lh = getRelativeLineHeight(fontSize, temp, elts[i]);

                if (lh != lineHeight || isNaN(Number(lh))) {
                  lineHeight = "";
                }
              }
            }
          }

          function hasParentOrOnlyChild(name) {
            if (
              graph.getParentByName(node, name, graph.cellEditor.textarea) !=
                null
            ) {
              return true;
            } else {
              var child = node;

              while (child != null && child.childNodes.length == 1) {
                child = child.childNodes[0];

                if (child.nodeName == name) {
                  return true;
                }
              }
            }

            return false;
          }

          function isEqualOrPrefixed(str, value) {
            if (str != null && value != null) {
              if (str == value) {
                return true;
              } else if (str.length > value.length + 1) {
                return (
                  str.substring(str.length - value.length - 1, str.length) ==
                    "-" + value
                );
              }
            }

            return false;
          }

          if (css != null) {
            setSelected(
              fontStyleItems[0],
              css.fontWeight == "bold" ||
                css.fontWeight > 400 ||
                hasParentOrOnlyChild("B") ||
                hasParentOrOnlyChild("STRONG"),
            );
            setSelected(
              fontStyleItems[1],
              css.fontStyle == "italic" ||
                hasParentOrOnlyChild("I") ||
                hasParentOrOnlyChild("EM"),
            );
            setSelected(fontStyleItems[2], hasParentOrOnlyChild("U"));
            setSelected(sup, hasParentOrOnlyChild("SUP"));
            setSelected(sub, hasParentOrOnlyChild("SUB"));

            if (!graph.cellEditor.isTableSelected()) {
              var align = graph.cellEditor.align ||
                mxUtils.getValue(
                  ss.style,
                  mxConstants.STYLE_ALIGN,
                  mxConstants.ALIGN_CENTER,
                );

              if (isEqualOrPrefixed(css.textAlign, "justify")) {
                setSelected(full, isEqualOrPrefixed(css.textAlign, "justify"));
                setSelected(left, false);
                setSelected(center, false);
                setSelected(right, false);
              } else {
                setSelected(full, false);
                setSelected(left, align == mxConstants.ALIGN_LEFT);
                setSelected(center, align == mxConstants.ALIGN_CENTER);
                setSelected(right, align == mxConstants.ALIGN_RIGHT);
              }
            } else {
              setSelected(full, isEqualOrPrefixed(css.textAlign, "justify"));
              setSelected(left, isEqualOrPrefixed(css.textAlign, "left"));
              setSelected(center, isEqualOrPrefixed(css.textAlign, "center"));
              setSelected(right, isEqualOrPrefixed(css.textAlign, "right"));
            }

            this.currentTable = graph.getParentByName(
              node,
              "TABLE",
              graph.cellEditor.textarea,
            );
            this.tableRow = currentTable == null
              ? null
              : graph.getParentByName(node, "TR", currentTable);
            this.tableCell = currentTable == null
              ? null
              : graph.getParentByNames(node, ["TD", "TH"], currentTable);
            tableWrapper.style.display = currentTable != null ? "" : "none";

            if (document.activeElement != input) {
              if (
                node.nodeName == "FONT" &&
                node.getAttribute("size") == "4" &&
                pendingFontSize != null
              ) {
                node.removeAttribute("size");
                node.style.fontSize = pendingFontSize + " pt";
                this.pendingFontSize = null;
              } else {
                input.value = isNaN(fontSize) ? "" : fontSize + " pt";
              }

              lh = parseFloat(lineHeight);

              if (!isNaN(lh)) {
                lineHeightInput.value = Math.round(lh * 100) + " %";
              } else {
                lineHeightInput.value = "100 %";
              }
            }

            // Converts rgb(r,g,b) values
            var color = css.color.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function (_$0, $1, $2, $3) {
                return (
                  "#" +
                  ("0" + Number($1).toString(16)).substr(-2) +
                  ("0" + Number($2).toString(16)).substr(-2) +
                  ("0" + Number($3).toString(16)).substr(-2)
                );
              },
            );
            var color2 = css.backgroundColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function (_$0, $1, $2, $3) {
                return (
                  "#" +
                  ("0" + Number($1).toString(16)).substr(-2) +
                  ("0" + Number($2).toString(16)).substr(-2) +
                  ("0" + Number($3).toString(16)).substr(-2)
                );
              },
            );

            // Updates the color picker for the current font
            if (fontColorApply != null) {
              if (color.charAt(0) == "#") {
                this.currentFontColor = color;
              } else {
                this.currentFontColor = "#000000";
              }

              fontColorApply(currentFontColor, true);
            }

            if (bgColorApply != null) {
              if (color2.charAt(0) == "#") {
                this.currentBgColor = color2;
              } else {
                this.currentBgColor = null;
              }

              bgColorApply(currentBgColor, true);
            }

            // Workaround for firstChild is null or not an object
            // in the log which seems to be IE8- only / 29.01.15
            if (fontMenu.firstChild != null) {
              // Strips leading and trailing quotes
              var ff = css.fontFamily;

              if (ff.charAt(0) == "'") {
                ff = ff.substring(1);
              }

              if (ff.charAt(ff.length - 1) == "'") {
                ff = ff.substring(0, ff.length - 1);
              }

              if (ff.charAt(0) == '"') {
                ff = ff.substring(1);
              }

              if (ff.charAt(ff.length - 1) == '"') {
                ff = ff.substring(0, ff.length - 1);
              }

              fontMenu.firstChild.nodeValue = ff;
            }
          }
        }

        updating = false;
      }, 0);
    }
  };
}
