import { ToolbarFormatButtons } from "../buttons/ToolbarFormatButtons";

export class ContainerPanel {
  toolbarFormatButtons: ToolbarFormatButtons;

  constructor() {
    this.toolbarFormatButtons = new ToolbarFormatButtons();
  }

  append() {
    if (!graph.cellEditor.isContentEditing()) {
      container.appendChild(extraPanel);
      container.appendChild(
        this.createRelativeOption(
          mxResources.get("opacity"),
          mxConstants.STYLE_TEXT_OPACITY
        )
      );
      container.appendChild(spacingPanel);
    } else {
      var selState: any;
      var lineHeightInput: any;

      container.appendChild(
        this.createRelativeOption(
          mxResources.get("lineheight"),
          null,
          null,
          function (input) {
            var value = input.value == "" ? 120 : parseInt(input.value);
            value = Math.max(0, isNaN(value) ? 120 : value);

            if (selState != null) {
              graph.cellEditor.restoreSelection(selState);
              selState = null;
            }

            var selectedElement = graph.getSelectedElement();
            var node = selectedElement;

            while (
              node != null &&
              node.nodeType != mxConstants.NODETYPE_ELEMENT
            ) {
              node = node.parentNode;
            }

            if (
              node != null &&
              node == graph.cellEditor.textarea &&
              graph.cellEditor.textarea.firstChild != null
            ) {
              if (graph.cellEditor.textarea.firstChild.nodeName != "P") {
                graph.cellEditor.textarea.innerHTML =
                  "<p>" + graph.cellEditor.textarea.innerHTML + "</p>";
              }

              node = graph.cellEditor.textarea.firstChild;
            }

            if (
              node != null &&
              graph.cellEditor.textarea != null &&
              node != graph.cellEditor.textarea &&
              graph.cellEditor.textarea.contains(node)
            ) {
              node.style.lineHeight = value + "%";
            }

            input.value = value + " %";
          },
          function (input) {
            // Used in CSS handler to update current value
            lineHeightInput = input;

            // KNOWN: Arrow up/down clear selection text in quirks/IE 8
            // Text size via arrow button limits to 16 in IE11. Why?
            mxEvent.addListener(input, "mousedown", function () {
              if (document.activeElement == graph.cellEditor.textarea) {
                selState = graph.cellEditor.saveSelection();
              }
            });

            mxEvent.addListener(input, "touchstart", function () {
              if (document.activeElement == graph.cellEditor.textarea) {
                selState = graph.cellEditor.saveSelection();
              }
            });

            input.value = "120 %";
          }
        )
      );

      var insertPanel: any = stylePanel.cloneNode(false);
      insertPanel.style.paddingLeft = "0px";

      this.addBtns();
      this.addBtns1();

      var wrapper2 = this.createPanel();
      wrapper2.style.paddingTop = "10px";
      wrapper2.style.paddingBottom = "10px";
      wrapper2.appendChild(this.createTitle(mxResources.get("insert")));
      wrapper2.appendChild(insertPanel);
      container.appendChild(wrapper2);

      if (mxClient.IS_QUIRKS) {
        wrapper2.style.height = "70";
      }

      var tablePanel: any = stylePanel.cloneNode(false);
      tablePanel.style.paddingLeft = "0px";

      this.addBtns2();

      var wrapper3 = this.createPanel();
      wrapper3.style.paddingTop = "10px";
      wrapper3.style.paddingBottom = "10px";
      wrapper3.appendChild(this.createTitle(mxResources.get("table")));
      wrapper3.appendChild(tablePanel);

      if (mxClient.IS_QUIRKS) {
        mxUtils.br(container);
        wrapper3.style.height = "70";
      }

      var tablePanel2: any = stylePanel.cloneNode(false);
      tablePanel2.style.paddingLeft = "0px";

      this.addBtns3();

      if (mxClient.IS_QUIRKS) {
        mxUtils.br(wrapper3);
        mxUtils.br(wrapper3);
      }

      wrapper3.appendChild(tablePanel2);
      container.appendChild(wrapper3);

      tableWrapper = wrapper3;
    }
  }

  addBtns() {
    this.toolbarFormatButtons.addBtns();
  }

  addBtns1() {
    this.toolbarFormatButtons.addBtns1();
  }

  addBtns2() {
    this.toolbarFormatButtons.addBtns2();
  }

  addBtns3() {
    this.toolbarFormatButtons.addBtns3();
  }
}
