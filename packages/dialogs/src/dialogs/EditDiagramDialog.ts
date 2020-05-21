import mx from "@mxgraph-app/mx";
const { mxUtils, mxResources, mxGraphModel, mxCodec } = mx;
const Graph: any = {};

/**
 * Constructs a new edit file dialog.
 */
export class EditDiagramDialog {
  container: any;
  init: () => void;

  constructor(editorUi) {
    var div = document.createElement("div");
    div.style.textAlign = "right";
    var textarea: any = document.createElement("textarea");
    textarea.setAttribute("wrap", "off");
    textarea.setAttribute("spellcheck", "false");
    textarea.setAttribute("autocorrect", "off");
    textarea.setAttribute("autocomplete", "off");
    textarea.setAttribute("autocapitalize", "off");
    textarea.style.overflow = "auto";
    textarea.style.resize = "none";
    textarea.style.width = "600px";
    textarea.style.height = "360px";
    textarea.style.marginBottom = "16px";

    textarea.value = mxUtils.getPrettyXml(editorUi.editor.getGraphXml());
    div.appendChild(textarea);

    this.init = function () {
      textarea.focus();
    };

    // Enables dropping files
    if (Graph.fileSupport) {
      function handleDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        if (evt.dataTransfer.files.length > 0) {
          var file = evt.dataTransfer.files[0];
          var reader = new FileReader();

          reader.onload = (e: any) => {
            textarea.value = e.target.result;
          };

          reader.readAsText(file);
        } else {
          textarea.value = editorUi.extractGraphModelFromEvent(evt);
        }
      }

      function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }

      // Setup the dnd listeners.
      textarea.addEventListener("dragover", handleDragOver, false);
      textarea.addEventListener("drop", handleDrop, false);
    }

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      div.appendChild(cancelBtn);
    }

    var select = document.createElement("select");
    select.style.width = "180px";
    select.className = "geBtn";

    if (editorUi.editor.graph.isEnabled()) {
      var replaceOption = document.createElement("option");
      replaceOption.setAttribute("value", "replace");
      mxUtils.write(replaceOption, mxResources.get("replaceExistingDrawing"));
      select.appendChild(replaceOption);
    }

    var newOption = document.createElement("option");
    newOption.setAttribute("value", "new");
    mxUtils.write(newOption, mxResources.get("openInNewWindow"));

    if (EditDiagramDialog.showNewWindowOption) {
      select.appendChild(newOption);
    }

    if (editorUi.editor.graph.isEnabled()) {
      var importOption = document.createElement("option");
      importOption.setAttribute("value", "import");
      mxUtils.write(importOption, mxResources.get("addToExistingDrawing"));
      select.appendChild(importOption);
    }

    div.appendChild(select);

    var okBtn = mxUtils.button(mxResources.get("ok"), function () {
      // Removes all illegal control characters before parsing
      var data = Graph.zapGremlins(mxUtils.trim(textarea.value));
      var error: any;

      if (select.value == "new") {
        editorUi.hideDialog();
        editorUi.editor.editAsNew(data);
      } else if (select.value == "replace") {
        editorUi.editor.graph.model.beginUpdate();
        try {
          editorUi.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
          // LATER: Why is hideDialog between begin-/endUpdate faster?
          editorUi.hideDialog();
        } catch (e) {
          error = e;
        } finally {
          editorUi.editor.graph.model.endUpdate();
        }
      } else if (select.value == "import") {
        editorUi.editor.graph.model.beginUpdate();
        try {
          var doc = mxUtils.parseXml(data);
          var model = new mxGraphModel();
          var codec = new mxCodec(doc);
          codec.decode(doc.documentElement, model);

          var children = model.getChildren(
            model.getChildAt(model.getRoot(), 0)
          );
          editorUi.editor.graph.setSelectionCells(
            editorUi.editor.graph.importCells(children)
          );

          // LATER: Why is hideDialog between begin-/endUpdate faster?
          editorUi.hideDialog();
        } catch (e) {
          error = e;
        } finally {
          editorUi.editor.graph.model.endUpdate();
        }
      }

      if (error != null) {
        mxUtils.alert(error.message);
      }
    });
    okBtn.className = "geBtn gePrimaryBtn";
    div.appendChild(okBtn);

    if (!editorUi.editor.cancelFirst) {
      div.appendChild(cancelBtn);
    }

    this.container = div;
  }

  /**
   *
   */
  static showNewWindowOption = true;
}
