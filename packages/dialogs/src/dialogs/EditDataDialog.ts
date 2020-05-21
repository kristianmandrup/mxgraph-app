import mx from "@mxgraph-app/mx";
import { Dialog } from "../Dialog";
const { mxEvent, mxForm, mxClient, mxUtils, mxResources } = mx;

/**
 * Constructs a new metadata dialog.
 */
export class EditDataDialog {
  container: any;
  helpImage: any; // Editor.helpImage
  init: () => void;

  constructor(ui, cell) {
    var div = document.createElement("div");
    var graph = ui.editor.graph;

    var value = graph.getModel().getValue(cell);

    // Converts the value to an XML node
    if (!mxUtils.isNode(value, null)) {
      var doc = mxUtils.createXmlDocument();
      var obj = doc.createElement("object");
      obj.setAttribute("label", value || "");
      value = obj;
    }

    // Creates the dialog contents
    var form: any = new mxForm("properties");
    form.table.style.width = "100%";

    var attrs = value.attributes;
    var names: any[] = [];
    var texts: any[] = [];
    var count: number = 0;

    var id =
      EditDataDialog.getDisplayIdForCell != null
        ? EditDataDialog.getDisplayIdForCell(ui, cell)
        : null;

    var addRemoveButton = function (text, name) {
      var wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.paddingRight = "20px";
      wrapper.style.boxSizing = "border-box";
      wrapper.style.width = "100%";

      var removeAttr = document.createElement("a");
      var img = mxUtils.createImage(Dialog.prototype.closeImage);
      img.style.height = "9px";
      img.style.fontSize = "9px";
      img.style.marginBottom = mxClient.IS_IE11 ? "-1px" : "5px";

      removeAttr.className = "geButton";
      removeAttr.setAttribute("title", mxResources.get("delete"));
      removeAttr.style.position = "absolute";
      removeAttr.style.top = "4px";
      removeAttr.style.right = "0px";
      removeAttr.style.margin = "0px";
      removeAttr.style.width = "9px";
      removeAttr.style.height = "9px";
      removeAttr.style.cursor = "pointer";
      removeAttr.appendChild(img);

      var removeAttrFn = (function (name) {
        return function () {
          var count = 0;

          for (var j = 0; j < names.length; j++) {
            if (names[j] == name) {
              texts[j] = null;
              form.table.deleteRow(count + (id != null ? 1 : 0));

              break;
            }

            if (texts[j] != null) {
              count++;
            }
          }
        };
      })(name);

      mxEvent.addListener(removeAttr, "click", removeAttrFn);

      var parent = text.parentNode;
      wrapper.appendChild(text);
      wrapper.appendChild(removeAttr);
      parent.appendChild(wrapper);
    };

    var addTextArea = (index, name, value) => {
      names[index] = name;
      texts[index] = form.addTextarea(names[count] + ":", value, 2);
      texts[index].style.width = "100%";

      if (value.indexOf("\n") > 0) {
        texts[index].setAttribute("rows", "2");
      }

      addRemoveButton(texts[index], name);
    };

    var temp: any[] = [];
    var isLayer =
      graph.getModel().getParent(cell) == graph.getModel().getRoot();

    for (var i = 0; i < attrs.length; i++) {
      if (
        (isLayer || attrs[i].nodeName != "label") &&
        attrs[i].nodeName != "placeholders"
      ) {
        temp.push({ name: attrs[i].nodeName, value: attrs[i].nodeValue });
      }
    }

    // Sorts by name
    temp.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });

    if (id != null) {
      var text = document.createElement("div");
      text.style.width = "100%";
      text.style.fontSize = "11px";
      text.style.textAlign = "center";
      mxUtils.write(text, id);

      form.addField(mxResources.get("id") + ":", text);
    }

    for (var i = 0; i < temp.length; i++) {
      addTextArea(count, temp[i].name, temp[i].value);
      count++;
    }

    var top = document.createElement("div");
    top.style.cssText =
      "position:absolute;left:30px;right:30px;overflow-y:auto;top:30px;bottom:80px;";
    top.appendChild(form.table);

    var newProp = document.createElement("div");
    newProp.style.boxSizing = "border-box";
    newProp.style.paddingRight = "160px";
    newProp.style.whiteSpace = "nowrap";
    newProp.style.marginTop = "6px";
    newProp.style.width = "100%";

    var nameInput = document.createElement("input");
    nameInput.setAttribute("placeholder", mxResources.get("enterPropertyName"));
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute(
      "size",
      mxClient.IS_IE || mxClient.IS_IE11 ? "36" : "40"
    );
    nameInput.style.boxSizing = "border-box";
    nameInput.style.marginLeft = "2px";
    nameInput.style.width = "100%";

    newProp.appendChild(nameInput);
    top.appendChild(newProp);
    div.appendChild(top);

    var addBtn = mxUtils.button(mxResources.get("addProperty"), function () {
      var name = nameInput.value;

      // Avoid ':' in attribute names which seems to be valid in Chrome
      if (
        name.length > 0 &&
        name != "label" &&
        name != "placeholders" &&
        name.indexOf(":") < 0
      ) {
        try {
          var idx = mxUtils.indexOf(names, name);

          if (idx >= 0 && texts[idx] != null) {
            texts[idx].focus();
          } else {
            // Checks if the name is valid
            var clone = value.cloneNode(false);
            clone.setAttribute(name, "");

            if (idx >= 0) {
              names.splice(idx, 1);
              texts.splice(idx, 1);
            }

            names.push(name);
            var text = form.addTextarea(name + ":", "", 2);
            text.style.width = "100%";
            texts.push(text);
            addRemoveButton(text, name);

            text.focus();
          }

          addBtn.setAttribute("disabled", "disabled");
          nameInput.value = "";
        } catch (e) {
          mxUtils.alert(e);
        }
      } else {
        mxUtils.alert(mxResources.get("invalidName"));
      }
    });

    this.init = function () {
      if (texts.length > 0) {
        texts[0].focus();
      } else {
        nameInput.focus();
      }
    };

    addBtn.setAttribute("title", mxResources.get("addProperty"));
    addBtn.setAttribute("disabled", "disabled");
    addBtn.style.textOverflow = "ellipsis";
    addBtn.style.position = "absolute";
    addBtn.style.overflow = "hidden";
    addBtn.style.width = "144px";
    addBtn.style.right = "0px";
    addBtn.className = "geBtn";
    newProp.appendChild(addBtn);

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      ui.hideDialog.apply(ui, arguments);
    });

    cancelBtn.className = "geBtn";

    var applyBtn = mxUtils.button(mxResources.get("apply"), function () {
      try {
        ui.hideDialog.apply(ui, arguments);

        // Clones and updates the value
        value = value.cloneNode(true);
        var removeLabel = false;

        for (var i = 0; i < names.length; i++) {
          if (texts[i] == null) {
            value.removeAttribute(names[i]);
          } else {
            value.setAttribute(names[i], texts[i].value);
            removeLabel =
              removeLabel ||
              (names[i] == "placeholder" &&
                value.getAttribute("placeholders") == "1");
          }
        }

        // Removes label if placeholder is assigned
        if (removeLabel) {
          value.removeAttribute("label");
        }

        // Updates the value of the cell (undoable)
        graph.getModel().setValue(cell, value);
      } catch (e) {
        mxUtils.alert(e);
      }
    });
    applyBtn.className = "geBtn gePrimaryBtn";

    function updateAddBtn() {
      if (nameInput.value.length > 0) {
        addBtn.removeAttribute("disabled");
      } else {
        addBtn.setAttribute("disabled", "disabled");
      }
    }

    mxEvent.addListener(nameInput, "keyup", updateAddBtn);

    // Catches all changes that don't fire a keyup (such as paste via mouse)
    mxEvent.addListener(nameInput, "change", updateAddBtn);

    var buttons = document.createElement("div");
    buttons.style.cssText =
      "position:absolute;left:30px;right:30px;text-align:right;bottom:30px;height:40px;";

    if (
      ui.editor.graph.getModel().isVertex(cell) ||
      ui.editor.graph.getModel().isEdge(cell)
    ) {
      var replace = document.createElement("span");
      replace.style.marginRight = "10px";
      var input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.style.marginRight = "6px";

      if (value.getAttribute("placeholders") == "1") {
        input.setAttribute("checked", "checked");
        input.defaultChecked = true;
      }

      mxEvent.addListener(input, "click", function () {
        if (value.getAttribute("placeholders") == "1") {
          value.removeAttribute("placeholders");
        } else {
          value.setAttribute("placeholders", "1");
        }
      });

      replace.appendChild(input);
      mxUtils.write(replace, mxResources.get("placeholders"));

      if (EditDataDialog.placeholderHelpLink != null) {
        var link = document.createElement("a");
        link.setAttribute("href", EditDataDialog.placeholderHelpLink);
        link.setAttribute("title", mxResources.get("help"));
        link.setAttribute("target", "_blank");
        link.style.marginLeft = "8px";
        link.style.cursor = "help";

        var icon = document.createElement("img");
        mxUtils.setOpacity(icon, 50);
        icon.style.height = "16px";
        icon.style.width = "16px";
        icon.setAttribute("border", "0");
        icon.setAttribute("valign", "middle");
        icon.style.marginTop = mxClient.IS_IE11 ? "0px" : "-4px";
        icon.setAttribute("src", this.helpImage);
        link.appendChild(icon);

        replace.appendChild(link);
      }

      buttons.appendChild(replace);
    }

    if (ui.editor.cancelFirst) {
      buttons.appendChild(cancelBtn);
      buttons.appendChild(applyBtn);
    } else {
      buttons.appendChild(applyBtn);
      buttons.appendChild(cancelBtn);
    }

    div.appendChild(buttons);
    this.container = div;
  }

  /**
   * Optional help link.
   */
  static getDisplayIdForCell = function (ui, cell) {
    var id = null;

    if (ui.editor.graph.getModel().getParent(cell) != null) {
      id = cell.getId();
    }

    return id;
  };

  /**
   * Optional help link.
   */
  static placeholderHelpLink: any = null;
}
