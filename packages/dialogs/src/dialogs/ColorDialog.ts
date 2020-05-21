import mx from "@mxgraph-app/mx";
import jscolor from "jscolor";
import { Dialog } from "../Dialog";
const { mxEventObject, mxResources, mxEvent, mxUtils, mxClient } = mx;

/**
 * Constructs a new color dialog.
 */
export class ColorDialog {
  editorUi: any;
  container: any;
  center: any;
  picker: any;
  colorInput: any;
  input: any;
  currentColorKey: any;

  init: () => void;

  constructor(editorUi, color?, apply?, cancelFn?) {
    this.editorUi = editorUi;

    var input: any = document.createElement("input");
    this.input = input;
    input.style.marginBottom = "10px";
    input.style.width = "216px";

    // Required for picker to render in IE
    if (mxClient.IS_IE) {
      input.style.marginTop = "10px";
      document.body.appendChild(input);
    }

    this.init = function () {
      if (!mxClient.IS_TOUCH) {
        input.focus();
      }
    };

    var picker = new jscolor.color(input);
    picker.pickerOnfocus = false;
    picker.showPicker();

    var div = document.createElement("div");
    jscolor.picker.box.style.position = "relative";
    jscolor.picker.box.style.width = "230px";
    jscolor.picker.box.style.height = "100px";
    jscolor.picker.box.style.paddingBottom = "10px";
    div.appendChild(jscolor.picker.box);

    var center: any = document.createElement("center");
    this.center = center;

    div.appendChild(input);
    mxUtils.br(div);

    // Adds recent colors
    this.createRecentColorTable();

    // Adds presets
    var table = this.addPresets(this.presetColors);
    table.style.marginBottom = "8px";
    table = this.addPresets(this.defaultColors);
    table.style.marginBottom = "16px";

    div.appendChild(center);

    var buttons = document.createElement("div");
    buttons.style.textAlign = "right";
    buttons.style.whiteSpace = "nowrap";

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();

      if (cancelFn != null) {
        cancelFn();
      }
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      buttons.appendChild(cancelBtn);
    }

    var applyFunction = apply != null ? apply : this.createApplyFunction();

    var applyBtn = mxUtils.button(mxResources.get("apply"), function () {
      var color = input.value;

      // Blocks any non-alphabetic chars in colors
      if (/(^#?[a-zA-Z0-9]*$)/.test(color)) {
        if (color != "none" && color.charAt(0) != "#") {
          color = "#" + color;
        }

        ColorDialog.addRecentColor(
          color != "none" ? color.substring(1) : color,
          12
        );
        applyFunction(color);
        editorUi.hideDialog();
      } else {
        editorUi.handleError({ message: mxResources.get("invalidInput") });
      }
    });
    applyBtn.className = "geBtn gePrimaryBtn";
    buttons.appendChild(applyBtn);

    if (!editorUi.editor.cancelFirst) {
      buttons.appendChild(cancelBtn);
    }

    if (color != null) {
      if (color == "none") {
        picker.fromString("ffffff");
        input.value = "none";
      } else {
        picker.fromString(color);
      }
    }

    div.appendChild(buttons);
    this.picker = picker;
    this.colorInput = input;

    // LATER: Only fires if input if focused, should always
    // fire if this dialog is showing.
    mxEvent.addListener(div, "keydown", function (e) {
      if (e.keyCode == 27) {
        editorUi.hideDialog();

        if (cancelFn != null) {
          cancelFn();
        }

        mxEvent.consume(e);
      }
    });

    this.container = div;
  }

  createRecentColorTable() {
    var table = this.addPresets(
      ColorDialog.recentColors.length == 0
        ? ["FFFFFF"]
        : ColorDialog.recentColors,
      11,
      "FFFFFF",
      true
    );
    table.style.marginBottom = "8px";

    return table;
  }

  addPresets(presets, rowLength?, defaultColor?, addResetOption?) {
    const { picker, input, center } = this;
    rowLength = rowLength != null ? rowLength : 12;
    var table: any = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.setAttribute("cellspacing", "0");
    table.style.marginBottom = "20px";
    table.style.cellSpacing = "0px";
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);

    var rows = presets.length / rowLength;

    for (var row = 0; row < rows; row++) {
      var tr: any = document.createElement("tr");

      for (var i = 0; i < rowLength; i++) {
        (function (clr) {
          var td = document.createElement("td");
          td.style.border = "1px solid black";
          td.style.padding = "0px";
          td.style.width = "16px";
          td.style.height = "16px";

          if (clr == null) {
            clr = defaultColor;
          }

          if (clr == "none") {
            td.style.background =
              "url('" + Dialog.prototype.noColorImage + "')";
          } else {
            td.style.backgroundColor = "#" + clr;
          }

          tr.appendChild(td);

          if (clr != null) {
            td.style.cursor = "pointer";

            mxEvent.addListener(td, "click", function () {
              if (clr == "none") {
                picker.fromString("ffffff");
                input.value = "none";
              } else {
                picker.fromString(clr);
              }
            });
          }
        })(presets[row * rowLength + i]);
      }

      tbody.appendChild(tr);
    }

    if (addResetOption) {
      var td = document.createElement("td");
      td.setAttribute("title", mxResources.get("reset"));
      td.style.border = "1px solid black";
      td.style.padding = "0px";
      td.style.width = "16px";
      td.style.height = "16px";
      td.style.backgroundImage = "url('" + Dialog.prototype.closeImage + "')";
      td.style.backgroundPosition = "center center";
      td.style.backgroundRepeat = "no-repeat";
      td.style.cursor = "pointer";

      tr.appendChild(td);

      mxEvent.addListener(td, "click", () => {
        ColorDialog.resetRecentColors();
        table.parentNode.replaceChild(this.createRecentColorTable(), table);
      });
    }

    center.appendChild(table);

    return table;
  }

  /**
   * Creates function to apply value
   */
  presetColors = [
    "E6D0DE",
    "CDA2BE",
    "B5739D",
    "E1D5E7",
    "C3ABD0",
    "A680B8",
    "D4E1F5",
    "A9C4EB",
    "7EA6E0",
    "D5E8D4",
    "9AC7BF",
    "67AB9F",
    "D5E8D4",
    "B9E0A5",
    "97D077",
    "FFF2CC",
    "FFE599",
    "FFD966",
    "FFF4C3",
    "FFCE9F",
    "FFB570",
    "F8CECC",
    "F19C99",
    "EA6B66",
  ];

  /**
   * Creates function to apply value
   */
  defaultColors = [
    "none",
    "FFFFFF",
    "E6E6E6",
    "CCCCCC",
    "B3B3B3",
    "999999",
    "808080",
    "666666",
    "4D4D4D",
    "333333",
    "1A1A1A",
    "000000",
    "FFCCCC",
    "FFE6CC",
    "FFFFCC",
    "E6FFCC",
    "CCFFCC",
    "CCFFE6",
    "CCFFFF",
    "CCE5FF",
    "CCCCFF",
    "E5CCFF",
    "FFCCFF",
    "FFCCE6",
    "FF9999",
    "FFCC99",
    "FFFF99",
    "CCFF99",
    "99FF99",
    "99FFCC",
    "99FFFF",
    "99CCFF",
    "9999FF",
    "CC99FF",
    "FF99FF",
    "FF99CC",
    "FF6666",
    "FFB366",
    "FFFF66",
    "B3FF66",
    "66FF66",
    "66FFB3",
    "66FFFF",
    "66B2FF",
    "6666FF",
    "B266FF",
    "FF66FF",
    "FF66B3",
    "FF3333",
    "FF9933",
    "FFFF33",
    "99FF33",
    "33FF33",
    "33FF99",
    "33FFFF",
    "3399FF",
    "3333FF",
    "9933FF",
    "FF33FF",
    "FF3399",
    "FF0000",
    "FF8000",
    "FFFF00",
    "80FF00",
    "00FF00",
    "00FF80",
    "00FFFF",
    "007FFF",
    "0000FF",
    "7F00FF",
    "FF00FF",
    "FF0080",
    "CC0000",
    "CC6600",
    "CCCC00",
    "66CC00",
    "00CC00",
    "00CC66",
    "00CCCC",
    "0066CC",
    "0000CC",
    "6600CC",
    "CC00CC",
    "CC0066",
    "990000",
    "994C00",
    "999900",
    "4D9900",
    "009900",
    "00994D",
    "009999",
    "004C99",
    "000099",
    "4C0099",
    "990099",
    "99004D",
    "660000",
    "663300",
    "666600",
    "336600",
    "006600",
    "006633",
    "006666",
    "003366",
    "000066",
    "330066",
    "660066",
    "660033",
    "330000",
    "331A00",
    "333300",
    "1A3300",
    "003300",
    "00331A",
    "003333",
    "001933",
    "000033",
    "190033",
    "330033",
    "33001A",
  ];

  /**
   * Creates function to apply value
   */
  createApplyFunction() {
    return (color) => {
      var graph = this.editorUi.editor.graph;

      graph.getModel().beginUpdate();
      try {
        graph.setCellStyles(this.currentColorKey, color);
        this.editorUi.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            [this.currentColorKey],
            "values",
            [color],
            "cells",
            graph.getSelectionCells()
          )
        );
      } finally {
        graph.getModel().endUpdate();
      }
    };
  }

  static resetRecentColors = () => {
    ColorDialog.recentColors = [];
  };

  /**
   *
   */
  static recentColors: string[] = [];

  /**
   * Adds recent color for later use.
   */
  static addRecentColor(color: string, max) {
    if (color) {
      mxUtils.remove(color, ColorDialog.recentColors);
      ColorDialog.recentColors.splice(0, 0, color);

      if (ColorDialog.recentColors.length >= max) {
        ColorDialog.recentColors.pop();
      }
    }
  }
}
