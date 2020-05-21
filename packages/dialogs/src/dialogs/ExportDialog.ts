import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
const {
  mxConstants,
  mxXmlRequest,
  mxXmlCanvas2D,
  mxEvent,
  mxClient,
  mxUtils,
  mxResources,
  mxImageExport,
} = mx;
const { MAX_REQUEST_SIZE, SAVE_URL, MAX_AREA, EXPORT_URL } = resources;
/**
 * Constructs a new export dialog.
 */
export class ExportDialog {
  container: any;
  value: any;
  style: any;
  lastBorderValue: any; // ExportDialog.lastBorderValue

  constructor(editorUi) {
    var graph = editorUi.editor.graph;
    var bounds = graph.getGraphBounds();
    var scale = graph.view.scale;

    var width: any = Math.ceil(bounds.width / scale);
    var height: any = Math.ceil(bounds.height / scale);

    var row, td;

    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    table.setAttribute("cellpadding", mxClient.IS_SF ? "0" : "2");

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    td.style.width = "100px";
    mxUtils.write(td, mxResources.get("filename") + ":");

    row.appendChild(td);

    var nameInput = document.createElement("input");
    nameInput.setAttribute("value", editorUi.editor.getOrCreateFilename());
    nameInput.style.width = "180px";

    td = document.createElement("td");
    td.appendChild(nameInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("format") + ":");

    row.appendChild(td);

    var imageFormatSelect = document.createElement("select");
    imageFormatSelect.style.width = "180px";

    var pngOption = document.createElement("option");
    pngOption.setAttribute("value", "png");
    mxUtils.write(pngOption, mxResources.get("formatPng"));
    imageFormatSelect.appendChild(pngOption);

    var gifOption = document.createElement("option");

    if (ExportDialog.showGifOption) {
      gifOption.setAttribute("value", "gif");
      mxUtils.write(gifOption, mxResources.get("formatGif"));
      imageFormatSelect.appendChild(gifOption);
    }

    var jpgOption = document.createElement("option");
    jpgOption.setAttribute("value", "jpg");
    mxUtils.write(jpgOption, mxResources.get("formatJpg"));
    imageFormatSelect.appendChild(jpgOption);

    var pdfOption = document.createElement("option");
    pdfOption.setAttribute("value", "pdf");
    mxUtils.write(pdfOption, mxResources.get("formatPdf"));
    imageFormatSelect.appendChild(pdfOption);

    var svgOption = document.createElement("option");
    svgOption.setAttribute("value", "svg");
    mxUtils.write(svgOption, mxResources.get("formatSvg"));
    imageFormatSelect.appendChild(svgOption);

    if (ExportDialog.showXmlOption) {
      var xmlOption = document.createElement("option");
      xmlOption.setAttribute("value", "xml");
      mxUtils.write(xmlOption, mxResources.get("formatXml"));
      imageFormatSelect.appendChild(xmlOption);
    }

    td = document.createElement("td");
    td.appendChild(imageFormatSelect);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("zoom") + " (%):");

    row.appendChild(td);

    var zoomInput: any = document.createElement("input");
    zoomInput.setAttribute("type", "number");
    zoomInput.setAttribute("value", "100");
    zoomInput.style.width = "180px";

    td = document.createElement("td");
    td.appendChild(zoomInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("width") + ":");

    row.appendChild(td);

    var widthInput: any = document.createElement("input");
    widthInput.setAttribute("value", width);
    widthInput.style.width = "180px";

    td = document.createElement("td");
    td.appendChild(widthInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("height") + ":");

    row.appendChild(td);

    var heightInput: any = document.createElement("input");
    heightInput.setAttribute("value", height);
    heightInput.style.width = "180px";

    td = document.createElement("td");
    td.appendChild(heightInput);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("dpi") + ":");

    row.appendChild(td);

    var dpiSelect = document.createElement("select");
    dpiSelect.style.width = "180px";

    var dpi100Option = document.createElement("option");
    dpi100Option.setAttribute("value", "100");
    mxUtils.write(dpi100Option, "100dpi");
    dpiSelect.appendChild(dpi100Option);

    var dpi200Option = document.createElement("option");
    dpi200Option.setAttribute("value", "200");
    mxUtils.write(dpi200Option, "200dpi");
    dpiSelect.appendChild(dpi200Option);

    var dpi300Option = document.createElement("option");
    dpi300Option.setAttribute("value", "300");
    mxUtils.write(dpi300Option, "300dpi");
    dpiSelect.appendChild(dpi300Option);

    var dpi400Option = document.createElement("option");
    dpi400Option.setAttribute("value", "400");
    mxUtils.write(dpi400Option, "400dpi");
    dpiSelect.appendChild(dpi400Option);

    var dpiCustOption = document.createElement("option");
    dpiCustOption.setAttribute("value", "custom");
    mxUtils.write(dpiCustOption, mxResources.get("custom"));
    dpiSelect.appendChild(dpiCustOption);

    var customDpi = document.createElement("input");
    customDpi.style.width = "180px";
    customDpi.style.display = "none";
    customDpi.setAttribute("value", "100");
    customDpi.setAttribute("type", "number");
    customDpi.setAttribute("min", "50");
    customDpi.setAttribute("step", "50");

    var zoomUserChanged = false;

    mxEvent.addListener(dpiSelect, "change", () => {
      if (this.value == "custom") {
        this.style.display = "none";
        customDpi.style.display = "";
        customDpi.focus();
      } else {
        customDpi.value = this.value;

        if (!zoomUserChanged) {
          zoomInput.value = this.value;
        }
      }
    });

    mxEvent.addListener(customDpi, "change", () => {
      var dpi = parseInt(customDpi.value);

      if (isNaN(dpi) || dpi <= 0) {
        customDpi.style.backgroundColor = "red";
      } else {
        customDpi.style.backgroundColor = "";

        if (!zoomUserChanged) {
          zoomInput.value = dpi;
        }
      }
    });

    td = document.createElement("td");
    td.appendChild(dpiSelect);
    td.appendChild(customDpi);
    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("background") + ":");

    row.appendChild(td);

    var transparentCheckbox = document.createElement("input");
    transparentCheckbox.setAttribute("type", "checkbox");
    transparentCheckbox.checked =
      graph.background == null || graph.background == mxConstants.NONE;

    td = document.createElement("td");
    td.appendChild(transparentCheckbox);
    mxUtils.write(td, mxResources.get("transparent"));

    row.appendChild(td);

    tbody.appendChild(row);

    row = document.createElement("tr");

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    mxUtils.write(td, mxResources.get("borderWidth") + ":");

    row.appendChild(td);

    var borderInput = document.createElement("input");
    borderInput.setAttribute("type", "number");
    borderInput.setAttribute("value", this.lastBorderValue);
    borderInput.style.width = "180px";

    td = document.createElement("td");
    td.appendChild(borderInput);
    row.appendChild(td);

    tbody.appendChild(row);
    table.appendChild(tbody);

    // Handles changes in the export format
    function formatChanged() {
      var name = nameInput.value;
      var dot = name.lastIndexOf(".");

      if (dot > 0) {
        nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
      } else {
        nameInput.value = name + "." + imageFormatSelect.value;
      }

      if (imageFormatSelect.value === "xml") {
        zoomInput.setAttribute("disabled", "true");
        widthInput.setAttribute("disabled", "true");
        heightInput.setAttribute("disabled", "true");
        borderInput.setAttribute("disabled", "true");
      } else {
        zoomInput.removeAttribute("disabled");
        widthInput.removeAttribute("disabled");
        heightInput.removeAttribute("disabled");
        borderInput.removeAttribute("disabled");
      }

      if (
        imageFormatSelect.value === "png" ||
        imageFormatSelect.value === "svg"
      ) {
        transparentCheckbox.removeAttribute("disabled");
      } else {
        transparentCheckbox.setAttribute("disabled", "disabled");
      }

      if (imageFormatSelect.value === "png") {
        dpiSelect.removeAttribute("disabled");
        customDpi.removeAttribute("disabled");
      } else {
        dpiSelect.setAttribute("disabled", "disabled");
        customDpi.setAttribute("disabled", "disabled");
      }
    }

    mxEvent.addListener(imageFormatSelect, "change", formatChanged);
    formatChanged();

    const checkValues = () => {
      if (
        widthInput.value * heightInput.value > MAX_AREA ||
        widthInput.value <= 0
      ) {
        widthInput.style.backgroundColor = "red";
      } else {
        widthInput.style.backgroundColor = "";
      }

      if (
        widthInput.value * heightInput.value > MAX_AREA ||
        heightInput.value <= 0
      ) {
        heightInput.style.backgroundColor = "red";
      } else {
        heightInput.style.backgroundColor = "";
      }
    };

    mxEvent.addListener(zoomInput, "change", function () {
      zoomUserChanged = true;
      var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
      zoomInput.value = parseFloat((s * 100).toFixed(2));

      if (width > 0) {
        widthInput.value = Math.floor(width * s);
        heightInput.value = Math.floor(height * s);
      } else {
        zoomInput.value = "100";
        widthInput.value = width;
        heightInput.value = height;
      }

      checkValues();
    });

    mxEvent.addListener(widthInput, "change", function () {
      var s = parseInt(widthInput.value) / width;

      if (s > 0) {
        zoomInput.value = parseFloat((s * 100).toFixed(2));
        heightInput.value = Math.floor(height * s);
      } else {
        zoomInput.value = "100";
        widthInput.value = width;
        heightInput.value = height;
      }

      checkValues();
    });

    mxEvent.addListener(heightInput, "change", function () {
      var s = parseInt(heightInput.value) / height;

      if (s > 0) {
        zoomInput.value = parseFloat((s * 100).toFixed(2));
        widthInput.value = Math.floor(width * s);
      } else {
        zoomInput.value = "100";
        widthInput.value = width;
        heightInput.value = height;
      }

      checkValues();
    });

    row = document.createElement("tr");
    td = document.createElement("td");
    td.setAttribute("align", "right");
    td.style.paddingTop = "22px";
    td.colSpan = 2;

    var saveBtn = mxUtils.button(mxResources.get("export"), () => {
      if (parseInt(zoomInput.value) <= 0) {
        mxUtils.alert(mxResources.get("drawingEmpty"));
      } else {
        var name = nameInput.value;
        var format = imageFormatSelect.value;
        var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
        var b = Math.max(0, parseInt(borderInput.value));
        var bg = graph.background;
        var dpi = Math.max(1, parseInt(customDpi.value));

        if (
          (format == "svg" || format == "png") &&
          transparentCheckbox.checked
        ) {
          bg = null;
        } else if (bg == null || bg == mxConstants.NONE) {
          bg = "#ffffff";
        }

        ExportDialog.lastBorderValue = b;
        ExportDialog.exportFile(editorUi, name, format, bg, s, b, dpi);
      }
    });
    saveBtn.className = "geBtn gePrimaryBtn";

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
      td.appendChild(saveBtn);
    } else {
      td.appendChild(saveBtn);
      td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);
    table.appendChild(tbody);
    this.container = table;
  }

  /**
   * Remembers last value for border.
   */
  static lastBorderValue = 0;

  /**
   * Global switches for the export dialog.
   */
  static showGifOption = true;

  /**
   * Global switches for the export dialog.
   */
  static showXmlOption = true;

  /**
   * Hook for getting the export format. Returns null for the default
   * intermediate XML export format or a function that returns the
   * parameter and value to be used in the request in the form
   * key=value, where value should be URL encoded.
   */
  static exportFile(editorUi, name, format, bg, s, b, dpi) {
    var graph = editorUi.editor.graph;

    if (format == "xml") {
      ExportDialog.saveLocalFile(
        editorUi,
        mxUtils.getXml(editorUi.editor.getGraphXml()),
        name,
        format
      );
    } else if (format == "svg") {
      ExportDialog.saveLocalFile(
        editorUi,
        mxUtils.getXml(graph.getSvg(bg, s, b)),
        name,
        format
      );
    } else {
      var bounds = graph.getGraphBounds();

      // New image export
      var xmlDoc = mxUtils.createXmlDocument();
      var root = xmlDoc.createElement("output");
      xmlDoc.appendChild(root);

      // Renders graph. Offset will be multiplied with state's scale when painting state.
      var xmlCanvas = new mxXmlCanvas2D(root);
      xmlCanvas.translate(
        Math.floor((b / s - bounds.x) / graph.view.scale),
        Math.floor((b / s - bounds.y) / graph.view.scale)
      );
      xmlCanvas.scale(s / graph.view.scale);

      var imgExport = new mxImageExport();
      imgExport.drawState(
        graph.getView().getState(graph.model.root),
        xmlCanvas
      );

      // Puts request data together
      var param = "xml=" + encodeURIComponent(mxUtils.getXml(root));
      var w = Math.ceil((bounds.width * s) / graph.view.scale + 2 * b);
      var h = Math.ceil((bounds.height * s) / graph.view.scale + 2 * b);

      // Requests image if request is valid
      if (param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA) {
        editorUi.hideDialog();
        const paramStr =
          "format=" +
          format +
          "&filename=" +
          encodeURIComponent(name) +
          "&bg=" +
          (bg != null ? bg : "none") +
          "&w=" +
          w +
          "&h=" +
          h +
          "&" +
          param +
          "&dpi=" +
          dpi;
        var req = new mxXmlRequest(
          EXPORT_URL,
          paramStr,
          null,
          null,
          null,
          null
        );
        req.simulate(document, "_blank");
      } else {
        mxUtils.alert(mxResources.get("drawingTooLarge"));
      }
    }
  }
  /**
   * Hook for getting the export format. Returns null for the default
   * intermediate XML export format or a function that returns the
   * parameter and value to be used in the request in the form
   * key=value, where value should be URL encoded.
   */
  static saveLocalFile(editorUi, data, filename, format) {
    if (data.length < MAX_REQUEST_SIZE) {
      editorUi.hideDialog();
      const paramStr =
        "xml=" +
        encodeURIComponent(data) +
        "&filename=" +
        encodeURIComponent(filename) +
        "&format=" +
        format;

      var req = new mxXmlRequest(SAVE_URL, paramStr, null, null, null, null);
      req.simulate(document, "_blank");
    } else {
      var xml = mxUtils.getXml(editorUi.editor.getGraphXml());
      mxUtils.alert(mxResources.get("drawingTooLarge"));
      mxUtils.popup(xml);
    }
  }
}
