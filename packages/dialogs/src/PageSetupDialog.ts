import mx from "@mxgraph-app/mx";
import { Dialog } from "./Dialog";
import { ChangePageSetup } from "./ChangePageSetup";
const { mxRectangle, mxEvent, mxUtils, mxResources, mxConstants } = mx;

/**
 * Constructs a new page setup dialog.
 */
export class PageSetupDialog {
  newBackgroundColor: any;
  backgroundButton: any;
  newBackgroundImage: any;
  changeImageLink: any;
  container: any;
  gridSizeInput: any;

  graph: any;
  onePageCheckBox: any;
  pageCountCheckBox: any;
  pageScaleInput: any;
  pageCountInput: any;

  static formats: any;
  static customSize: any;
  static currentPageFormat: any;
  static portraitCheckBox: any;
  static pageFormatListener: any;
  static formatDiv: any;
  static customDiv: any;
  static widthInput: any;
  static heightInput: any;
  static landscapeCheckBox: any;
  static paperSizeSelect: any;
  static pageFormat: any;
  static pf: any;

  constructor(editorUi) {
    var graph = editorUi.editor.graph;
    var row, td;

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.height = "100%";
    var tbody = document.createElement("tbody");

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.verticalAlign = "top";
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("paperSize") + ":");

    row.appendChild(td);

    td = document.createElement("td");
    td.style.verticalAlign = "top";
    td.style.fontSize = "10pt";

    var accessor = PageSetupDialog.addPageFormatPanel(
      td,
      "pagesetupdialog",
      graph.pageFormat,
      undefined
    );

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    mxUtils.write(td, mxResources.get("background") + ":");

    row.appendChild(td);

    td = document.createElement("td");
    td.style.whiteSpace = "nowrap";

    var backgroundInput = document.createElement("input");
    backgroundInput.setAttribute("type", "text");
    var backgroundButton = document.createElement("button");

    backgroundButton.style.width = "18px";
    backgroundButton.style.height = "18px";
    backgroundButton.style.marginRight = "20px";
    backgroundButton.style.backgroundPosition = "center center";
    backgroundButton.style.backgroundRepeat = "no-repeat";

    var newBackgroundColor = graph.background;
    this.newBackgroundColor = newBackgroundColor;

    this.updateBackgroundColor();

    mxEvent.addListener(backgroundButton, "click", (evt) => {
      editorUi.pickColor(newBackgroundColor || "none", (color) => {
        newBackgroundColor = color;
        this.updateBackgroundColor();
      });
      mxEvent.consume(evt);
    });

    td.appendChild(backgroundButton);

    mxUtils.write(td, mxResources.get("gridSize") + ":");

    var gridSizeInput = document.createElement("input");
    gridSizeInput.setAttribute("type", "number");
    gridSizeInput.setAttribute("min", "0");
    gridSizeInput.style.width = "40px";
    gridSizeInput.style.marginLeft = "6px";

    gridSizeInput.value = graph.getGridSize();
    this.gridSizeInput = gridSizeInput;
    td.appendChild(gridSizeInput);

    mxEvent.addListener(gridSizeInput, "change", () => {
      var value = parseInt(gridSizeInput.value);
      this.gridSizeInput.value = Math.max(
        1,
        isNaN(value) ? graph.getGridSize() : value
      );
    });

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement("tr");
    td = document.createElement("td");

    mxUtils.write(td, mxResources.get("image") + ":");

    row.appendChild(td);
    td = document.createElement("td");

    const changeImageLink = document.createElement("a");
    changeImageLink.style.textDecoration = "underline";
    changeImageLink.style.cursor = "pointer";
    changeImageLink.style.color = "#a0a0a0";

    const newBackgroundImage = graph.backgroundImage;
    this.newBackgroundImage = newBackgroundImage;

    mxEvent.addListener(changeImageLink, "click", (evt) => {
      editorUi.showBackgroundImageDialog((image) => {
        this.newBackgroundImage = image;
        this.updateBackgroundImage();
      });

      mxEvent.consume(evt);
    });

    this.updateBackgroundImage();

    td.appendChild(changeImageLink);

    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement("tr");
    td = document.createElement("td");
    td.colSpan = 2;
    td.style.paddingTop = "16px";
    td.setAttribute("align", "right");

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
    }

    var applyBtn = mxUtils.button(mxResources.get("apply"), () => {
      editorUi.hideDialog();

      if (graph.gridSize !== gridSizeInput.value) {
        graph.setGridSize(parseInt(gridSizeInput.value));
      }

      var change = new ChangePageSetup(
        editorUi,
        newBackgroundColor,
        newBackgroundImage,
        accessor.get()
      );

      change.ignoreColor = graph.background == newBackgroundColor;

      var oldSrc =
        graph.backgroundImage != null ? graph.backgroundImage.src : null;
      var newSrc = newBackgroundImage != null ? newBackgroundImage.src : null;

      change.ignoreImage = oldSrc === newSrc;

      if (
        graph.pageFormat.width != change.previousFormat.width ||
        graph.pageFormat.height != change.previousFormat.height ||
        !change.ignoreColor ||
        !change.ignoreImage
      ) {
        graph.model.execute(change);
      }
    });
    applyBtn.className = "geBtn gePrimaryBtn";
    td.appendChild(applyBtn);

    if (!editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);

    table.appendChild(tbody);
    this.container = table;
  }

  updateBackgroundColor() {
    const { newBackgroundColor, backgroundButton } = this;
    if (newBackgroundColor == null || newBackgroundColor == mxConstants.NONE) {
      backgroundButton.style.backgroundColor = "";
      backgroundButton.style.backgroundImage =
        "url('" + Dialog.prototype.noColorImage + "')";
    } else {
      backgroundButton.style.backgroundColor = newBackgroundColor;
      backgroundButton.style.backgroundImage = "";
    }
  }

  updateBackgroundImage() {
    const { newBackgroundImage, changeImageLink } = this;
    if (newBackgroundImage == null) {
      changeImageLink.removeAttribute("title");
      changeImageLink.style.fontSize = "";
      changeImageLink.innerHTML = mxResources.get("change") + "...";
    } else {
      changeImageLink.setAttribute("title", newBackgroundImage.src);
      changeImageLink.style.fontSize = "11px";
      changeImageLink.innerHTML =
        newBackgroundImage.src.substring(0, 42) + "...";
    }
  }

  /**
   *
   */
  static getFormats() {
    return [
      {
        key: "letter",
        title: 'US-Letter (8,5" x 11")',
        format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT,
      },
      {
        key: "legal",
        title: 'US-Legal (8,5" x 14")',
        format: new mxRectangle(0, 0, 850, 1400),
      },
      {
        key: "tabloid",
        title: 'US-Tabloid (11" x 17")',
        format: new mxRectangle(0, 0, 1100, 1700),
      },
      {
        key: "executive",
        title: 'US-Executive (7" x 10")',
        format: new mxRectangle(0, 0, 700, 1000),
      },
      {
        key: "a0",
        title: "A0 (841 mm x 1189 mm)",
        format: new mxRectangle(0, 0, 3300, 4681),
      },
      {
        key: "a1",
        title: "A1 (594 mm x 841 mm)",
        format: new mxRectangle(0, 0, 2339, 3300),
      },
      {
        key: "a2",
        title: "A2 (420 mm x 594 mm)",
        format: new mxRectangle(0, 0, 1654, 2336),
      },
      {
        key: "a3",
        title: "A3 (297 mm x 420 mm)",
        format: new mxRectangle(0, 0, 1169, 1654),
      },
      {
        key: "a4",
        title: "A4 (210 mm x 297 mm)",
        format: mxConstants.PAGE_FORMAT_A4_PORTRAIT,
      },
      {
        key: "a5",
        title: "A5 (148 mm x 210 mm)",
        format: new mxRectangle(0, 0, 583, 827),
      },
      {
        key: "a6",
        title: "A6 (105 mm x 148 mm)",
        format: new mxRectangle(0, 0, 413, 583),
      },
      {
        key: "a7",
        title: "A7 (74 mm x 105 mm)",
        format: new mxRectangle(0, 0, 291, 413),
      },
      {
        key: "b4",
        title: "B4 (250 mm x 353 mm)",
        format: new mxRectangle(0, 0, 980, 1390),
      },
      {
        key: "b5",
        title: "B5 (176 mm x 250 mm)",
        format: new mxRectangle(0, 0, 690, 980),
      },
      {
        key: "16-9",
        title: "16:9 (1600 x 900)",
        format: new mxRectangle(0, 0, 1600, 900),
      },
      {
        key: "16-10",
        title: "16:10 (1920 x 1200)",
        format: new mxRectangle(0, 0, 1920, 1200),
      },
      {
        key: "4-3",
        title: "4:3 (1600 x 1200)",
        format: new mxRectangle(0, 0, 1600, 1200),
      },
      { key: "custom", title: mxResources.get("custom"), format: null },
    ];
  }

  /**
   *
   */
  static addPageFormatPanel(div, namePostfix, pageFormat, pageFormatListener) {
    var formatName = "format-" + namePostfix;

    var portraitCheckBox = document.createElement("input");
    portraitCheckBox.setAttribute("name", formatName);
    portraitCheckBox.setAttribute("type", "radio");
    portraitCheckBox.setAttribute("value", "portrait");

    var landscapeCheckBox = document.createElement("input");
    landscapeCheckBox.setAttribute("name", formatName);
    landscapeCheckBox.setAttribute("type", "radio");
    landscapeCheckBox.setAttribute("value", "landscape");

    var paperSizeSelect = document.createElement("select");
    paperSizeSelect.style.marginBottom = "8px";
    paperSizeSelect.style.width = "202px";

    var formatDiv = document.createElement("div");
    formatDiv.style.marginLeft = "4px";
    formatDiv.style.width = "210px";
    formatDiv.style.height = "24px";

    portraitCheckBox.style.marginRight = "6px";
    formatDiv.appendChild(portraitCheckBox);

    var portraitSpan = document.createElement("span");
    portraitSpan.style.maxWidth = "100px";
    mxUtils.write(portraitSpan, mxResources.get("portrait"));
    formatDiv.appendChild(portraitSpan);

    landscapeCheckBox.style.marginLeft = "10px";
    landscapeCheckBox.style.marginRight = "6px";
    formatDiv.appendChild(landscapeCheckBox);

    var landscapeSpan = document.createElement("span");
    landscapeSpan.style.width = "100px";
    mxUtils.write(landscapeSpan, mxResources.get("landscape"));
    formatDiv.appendChild(landscapeSpan);

    var customDiv = document.createElement("div");
    customDiv.style.marginLeft = "4px";
    customDiv.style.width = "210px";
    customDiv.style.height = "24px";

    var widthInput = document.createElement("input");
    widthInput.setAttribute("size", "7");
    widthInput.style.textAlign = "right";
    customDiv.appendChild(widthInput);
    mxUtils.write(customDiv, " in x ");

    var heightInput = document.createElement("input");
    heightInput.setAttribute("size", "7");
    heightInput.style.textAlign = "right";
    customDiv.appendChild(heightInput);
    mxUtils.write(customDiv, " in");

    formatDiv.style.display = "none";
    customDiv.style.display = "none";

    var pf = new Object();
    var formats = PageSetupDialog.getFormats();

    for (var i = 0; i < formats.length; i++) {
      var f = formats[i];
      pf[f.key] = f;

      var paperSizeOption = document.createElement("option");
      paperSizeOption.setAttribute("value", f.key);
      mxUtils.write(paperSizeOption, f.title);
      paperSizeSelect.appendChild(paperSizeOption);
    }

    var customSize = false;

    this.listener();

    div.appendChild(paperSizeSelect);
    mxUtils.br(div);

    div.appendChild(formatDiv);
    div.appendChild(customDiv);

    var currentPageFormat = pageFormat;

    const { update } = this;

    mxEvent.addListener(portraitSpan, "click", function (evt) {
      portraitCheckBox.checked = true;
      update(evt);
      mxEvent.consume(evt);
    });

    mxEvent.addListener(landscapeSpan, "click", function (evt) {
      landscapeCheckBox.checked = true;
      update(evt);
      mxEvent.consume(evt);
    });

    mxEvent.addListener(widthInput, "blur", update);
    mxEvent.addListener(widthInput, "click", update);
    mxEvent.addListener(heightInput, "blur", update);
    mxEvent.addListener(heightInput, "click", update);
    mxEvent.addListener(landscapeCheckBox, "change", update);
    mxEvent.addListener(portraitCheckBox, "change", update);
    mxEvent.addListener(paperSizeSelect, "change", function (evt) {
      // Handles special case where custom was chosen
      customSize = paperSizeSelect.value == "custom";
      update(evt, true);
    });

    this.update();

    return {
      set: (value) => {
        pageFormat = value;
        this.listener(null, null, true);
      },
      get: () => {
        return currentPageFormat;
      },
      widthInput,
      heightInput,
    };
  }

  static update(evt?, selectChanged?) {
    const {
      formatDiv,
      customDiv,
      widthInput,
      landscapeCheckBox,
      pf,
      pageFormat,
      heightInput,
      paperSizeSelect,
      customSize,
      currentPageFormat,
      pageFormatListener,
    } = this;

    var f = pf[paperSizeSelect.value];

    if (f.format != null) {
      widthInput.value = f.format.width / 100;
      heightInput.value = f.format.height / 100;
      customDiv.style.display = "none";
      formatDiv.style.display = "";
    } else {
      formatDiv.style.display = "none";
      customDiv.style.display = "";
    }

    var wi = parseFloat(widthInput.value);

    if (isNaN(wi) || wi <= 0) {
      widthInput.value = pageFormat.width / 100;
    }

    var hi = parseFloat(heightInput.value);

    if (isNaN(hi) || hi <= 0) {
      heightInput.value = pageFormat.height / 100;
    }

    var newPageFormat = new mxRectangle(
      0,
      0,
      Math.floor(parseFloat(widthInput.value) * 100),
      Math.floor(parseFloat(heightInput.value) * 100)
    );

    if (paperSizeSelect.value != "custom" && landscapeCheckBox.checked) {
      newPageFormat = new mxRectangle(
        0,
        0,
        newPageFormat.height,
        newPageFormat.width
      );
    }

    // Initial select of custom should not update page format to avoid update of combo
    if (
      (!selectChanged || !customSize) &&
      (newPageFormat.width != currentPageFormat.width ||
        newPageFormat.height != currentPageFormat.height)
    ) {
      this.currentPageFormat = newPageFormat;

      // Updates page format and reloads format panel
      if (pageFormatListener != null) {
        pageFormatListener(currentPageFormat);
      }
    }
  }

  static listener(sender?, evt?, force?) {
    const {
      widthInput,
      heightInput,
      formats,
      customSize,
      paperSizeSelect,
      pageFormat,
      portraitCheckBox,
      landscapeCheckBox,
      formatDiv,
      customDiv,
    } = this;
    if (
      force ||
      (widthInput != document.activeElement &&
        heightInput != document.activeElement)
    ) {
      var detected = false;

      for (var i = 0; i < formats.length; i++) {
        var f = formats[i];

        // Special case where custom was chosen
        if (customSize) {
          if (f.key == "custom") {
            paperSizeSelect.value = f.key;
            this.customSize = false;
          }
        } else if (f.format != null) {
          // Fixes wrong values for previous A4 and A5 page sizes
          if (f.key == "a4") {
            if (pageFormat.width == 826) {
              this.pageFormat = mxRectangle.fromRectangle(pageFormat);
              pageFormat.width = 827;
            } else if (pageFormat.height == 826) {
              this.pageFormat = mxRectangle.fromRectangle(pageFormat);
              pageFormat.height = 827;
            }
          } else if (f.key == "a5") {
            if (pageFormat.width == 584) {
              this.pageFormat = mxRectangle.fromRectangle(pageFormat);
              pageFormat.width = 583;
            } else if (pageFormat.height == 584) {
              this.pageFormat = mxRectangle.fromRectangle(pageFormat);
              pageFormat.height = 583;
            }
          }

          if (
            pageFormat.width == f.format.width &&
            pageFormat.height == f.format.height
          ) {
            paperSizeSelect.value = f.key;
            portraitCheckBox.setAttribute("checked", "checked");
            portraitCheckBox.defaultChecked = true;
            portraitCheckBox.checked = true;
            landscapeCheckBox.removeAttribute("checked");
            landscapeCheckBox.defaultChecked = false;
            landscapeCheckBox.checked = false;
            detected = true;
          } else if (
            pageFormat.width == f.format.height &&
            pageFormat.height == f.format.width
          ) {
            paperSizeSelect.value = f.key;
            portraitCheckBox.removeAttribute("checked");
            portraitCheckBox.defaultChecked = false;
            portraitCheckBox.checked = false;
            landscapeCheckBox.setAttribute("checked", "checked");
            landscapeCheckBox.defaultChecked = true;
            landscapeCheckBox.checked = true;
            detected = true;
          }
        }
      }

      // Selects custom format which is last in list
      if (!detected) {
        widthInput.value = pageFormat.width / 100;
        heightInput.value = pageFormat.height / 100;
        portraitCheckBox.setAttribute("checked", "checked");
        paperSizeSelect.value = "custom";
        formatDiv.style.display = "none";
        customDiv.style.display = "";
      } else {
        formatDiv.style.display = "";
        customDiv.style.display = "none";
      }
    }
  }
}
