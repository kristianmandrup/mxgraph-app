import mx from "@mxgraph-app/mx";
const { mxClient, mxEvent, mxResources, mxUtils } = mx;

const Graph: any = {};
/**
 * Constructs a new filename dialog.
 */
export class FilenameDialog {
  label: any;
  content: any;
  nameInput: any;
  documentMode: any;
  table: any;
  editorUi: any;
  genericBtn: any;
  container: any;

  static helpImage: any; // Editor.helpImage

  constructor(
    editorUi,
    filename,
    buttonText,
    fn,
    label,
    validateFn?,
    content?,
    helpLink?,
    closeOnBtn?,
    cancelFn?,
    hints?,
    w?
  ) {
    closeOnBtn = closeOnBtn != null ? closeOnBtn : true;
    var row, td;

    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    table.style.marginTop = "8px";

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.whiteSpace = "nowrap";
    td.style.fontSize = "10pt";
    td.style.width = "120px";
    mxUtils.write(td, (label || mxResources.get("filename")) + ":");

    row.appendChild(td);

    var nameInput = document.createElement("input");
    nameInput.setAttribute("value", filename || "");
    nameInput.style.marginLeft = "4px";
    nameInput.style.width = w != null ? w + "px" : "180px";

    var genericBtn = mxUtils.button(buttonText, function () {
      if (validateFn == null || validateFn(nameInput.value)) {
        if (closeOnBtn) {
          editorUi.hideDialog();
        }

        fn(nameInput.value);
      }
    });
    genericBtn.className = "geBtn gePrimaryBtn";

    td = document.createElement("td");
    td.style.whiteSpace = "nowrap";
    td.appendChild(nameInput);
    row.appendChild(td);

    if (label != null || content == null) {
      tbody.appendChild(row);

      if (hints != null) {
        td.appendChild(
          FilenameDialog.createTypeHint(editorUi, nameInput, hints)
        );
      }
    }

    if (content != null) {
      row = document.createElement("tr");
      td = document.createElement("td");
      td.colSpan = 2;
      td.appendChild(content);
      row.appendChild(td);
      tbody.appendChild(row);
    }

    row = document.createElement("tr");
    td = document.createElement("td");
    td.colSpan = 2;
    td.style.paddingTop = "20px";
    td.style.whiteSpace = "nowrap";
    td.setAttribute("align", "right");

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();

      if (cancelFn != null) {
        cancelFn();
      }
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
    }

    if (helpLink != null) {
      var helpBtn = mxUtils.button(mxResources.get("help"), function () {
        editorUi.editor.graph.openLink(helpLink);
      });

      helpBtn.className = "geBtn";
      td.appendChild(helpBtn);
    }

    mxEvent.addListener(nameInput, "keypress", function (e) {
      if (e.keyCode == 13) {
        genericBtn.click();
      }
    });

    td.appendChild(genericBtn);

    if (!editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);

    this.container = table;
  }

  /**
   *
   */
  static filenameHelpLink = null;

  /**
   *
   */
  static createTypeHint(ui, nameInput, hints) {
    var hint = document.createElement("img");
    hint.style.cssText =
      "vertical-align:top;height:16px;width:16px;margin-left:4px;background-repeat:no-repeat;background-position:center bottom;cursor:pointer;";
    mxUtils.setOpacity(hint, 70);

    var nameChanged = () => {
      hint.setAttribute("src", this.helpImage);
      hint.setAttribute("title", mxResources.get("help"));

      for (var i = 0; i < hints.length; i++) {
        if (
          hints[i].ext.length > 0 &&
          nameInput.value.substring(
            nameInput.value.length - hints[i].ext.length - 1
          ) ==
            "." + hints[i].ext
        ) {
          hint.setAttribute("src", mxClient.imageBasePath + "/warning.png");
          hint.setAttribute("title", mxResources.get(hints[i].title));
          break;
        }
      }
    };

    mxEvent.addListener(nameInput, "keyup", nameChanged);
    mxEvent.addListener(nameInput, "change", nameChanged);
    mxEvent.addListener(hint, "click", (evt) => {
      var title = hint.getAttribute("title");

      if (hint.getAttribute("src") == this.helpImage) {
        ui.editor.graph.openLink(FilenameDialog.filenameHelpLink);
      } else if (title != "") {
        ui.showError(
          null,
          title,
          mxResources.get("help"),
          function () {
            ui.editor.graph.openLink(FilenameDialog.filenameHelpLink);
          },
          null,
          mxResources.get("ok"),
          null,
          null,
          null,
          340,
          90
        );
      }

      mxEvent.consume(evt);
    });

    nameChanged();

    return hint;
  }

  init() {
    const {
      editorUi,
      genericBtn,
      label,
      content,
      nameInput,
      documentMode,
      table,
    } = this;
    if (label == null && content != null) {
      return;
    }

    nameInput.focus();

    if (
      mxClient.IS_GC ||
      mxClient.IS_FF ||
      documentMode >= 5 ||
      mxClient.IS_QUIRKS
    ) {
      nameInput.select();
    } else {
      document.execCommand("selectAll", false, undefined);
    }

    // Installs drag and drop handler for links
    if (Graph.fileSupport) {
      // Setup the dnd listeners
      var dlg = table.parentNode;

      if (dlg != null) {
        var graph = editorUi.editor.graph;
        var dropElt: any = null;

        mxEvent.addListener(dlg, "dragleave", function (evt) {
          if (dropElt != null) {
            dropElt.style.backgroundColor = "";
            dropElt = null;
          }

          evt.stopPropagation();
          evt.preventDefault();
        });

        mxEvent.addListener(dlg, "dragover", (evt) => {
          // IE 10 does not implement pointer-events so it can't have a drop highlight
          if (dropElt == null && (!mxClient.IS_IE || documentMode > 10)) {
            dropElt = nameInput;
            dropElt.style.backgroundColor = "#ebf2f9";
          }

          evt.stopPropagation();
          evt.preventDefault();
        });

        mxEvent.addListener(dlg, "drop", (evt) => {
          if (dropElt != null) {
            dropElt.style.backgroundColor = "";
            dropElt = null;
          }

          if (mxUtils.indexOf(evt.dataTransfer.types, "text/uri-list") >= 0) {
            nameInput.value = decodeURIComponent(
              evt.dataTransfer.getData("text/uri-list")
            );
            genericBtn.click();
          }

          evt.stopPropagation();
          evt.preventDefault();
        });
      }
    }
  }
}
