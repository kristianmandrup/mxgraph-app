import mx from "@mxgraph-app/mx";
const {
  mxRectangle,
  mxPrintPreview,
  mxEvent,
  mxUtils,
  mxResources,
  mxConstants,
  mxClient,
} = mx;

/**
 * Constructs a new print dialog.
 */
export class PrintDialog {
  graph: any;
  container: any;
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

  /**
   * Specifies if the preview button should be enabled. Default is true.
   */
  static previewEnabled = true;

  constructor(editorUi, title: string) {
    this.create(editorUi, title);
  }

  /**
   * Constructs a new print dialog.
   */
  create(editorUi, title) {
    var graph = editorUi.editor.graph;
    var row, td;

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.height = "100%";
    var tbody = document.createElement("tbody");

    row = document.createElement("tr");

    var onePageCheckBox = document.createElement("input");
    onePageCheckBox.setAttribute("type", "checkbox");
    this.onePageCheckBox = onePageCheckBox;

    td = document.createElement("td");
    td.setAttribute("colspan", "2");
    td.style.fontSize = "10pt";
    td.appendChild(onePageCheckBox);

    var span = document.createElement("span");
    mxUtils.write(span, " " + mxResources.get("fitPage"));
    td.appendChild(span);

    mxEvent.addListener(span, "click", function (evt) {
      onePageCheckBox.checked = !onePageCheckBox.checked;
      pageCountCheckBox.checked = !onePageCheckBox.checked;
      mxEvent.consume(evt);
    });

    mxEvent.addListener(onePageCheckBox, "change", function () {
      pageCountCheckBox.checked = !onePageCheckBox.checked;
    });

    row.appendChild(td);
    tbody.appendChild(row);

    row = row.cloneNode(false);

    var pageCountCheckBox = document.createElement("input");
    pageCountCheckBox.setAttribute("type", "checkbox");
    this.pageCountCheckBox = pageCountCheckBox;

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    td.appendChild(pageCountCheckBox);

    var span = document.createElement("span");
    mxUtils.write(span, " " + mxResources.get("posterPrint") + ":");
    td.appendChild(span);

    mxEvent.addListener(span, "click", function (evt) {
      pageCountCheckBox.checked = !pageCountCheckBox.checked;
      onePageCheckBox.checked = !pageCountCheckBox.checked;
      mxEvent.consume(evt);
    });

    row.appendChild(td);

    var pageCountInput = document.createElement("input");
    pageCountInput.setAttribute("value", "1");
    pageCountInput.setAttribute("type", "number");
    pageCountInput.setAttribute("min", "1");
    pageCountInput.setAttribute("size", "4");
    pageCountInput.setAttribute("disabled", "disabled");
    pageCountInput.style.width = "50px";

    // this.pageCountInput = pageCountInput

    td = document.createElement("td");
    td.style.fontSize = "10pt";
    td.appendChild(pageCountInput);
    mxUtils.write(td, " " + mxResources.get("pages") + " (max)");
    row.appendChild(td);
    tbody.appendChild(row);

    mxEvent.addListener(pageCountCheckBox, "change", function () {
      if (pageCountCheckBox.checked) {
        pageCountInput.removeAttribute("disabled");
      } else {
        pageCountInput.setAttribute("disabled", "disabled");
      }

      onePageCheckBox.checked = !pageCountCheckBox.checked;
    });

    row = row.cloneNode(false);

    td = document.createElement("td");
    mxUtils.write(td, mxResources.get("pageScale") + ":");
    row.appendChild(td);

    td = document.createElement("td");
    var pageScaleInput = document.createElement("input");
    pageScaleInput.setAttribute("value", "100 %");
    pageScaleInput.setAttribute("size", "5");
    pageScaleInput.style.width = "50px";

    td.appendChild(pageScaleInput);
    row.appendChild(td);
    tbody.appendChild(row);

    row = document.createElement("tr");
    td = document.createElement("td");
    td.colSpan = 2;
    td.style.paddingTop = "20px";
    td.setAttribute("align", "right");

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
    }

    const { preview } = this;

    if (PrintDialog.previewEnabled) {
      var previewBtn = mxUtils.button(mxResources.get("preview"), () => {
        editorUi.hideDialog();
        preview(false);
      });
      previewBtn.className = "geBtn";
      td.appendChild(previewBtn);
    }

    var printBtn = mxUtils.button(
      mxResources.get(!PrintDialog.previewEnabled ? "ok" : "print"),
      () => {
        editorUi.hideDialog();
        preview(true);
      }
    );
    printBtn.className = "geBtn gePrimaryBtn";
    td.appendChild(printBtn);

    if (!editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn);
    }

    row.appendChild(td);
    tbody.appendChild(row);

    table.appendChild(tbody);
    this.container = table;
  }

  // Overall scale for print-out to account for print borders in dialogs etc
  preview(print) {
    const {
      graph,
      pageCountCheckBox,
      onePageCheckBox,
      pageScaleInput,
      pageCountInput,
    } = this;
    var autoOrigin = onePageCheckBox.checked || pageCountCheckBox.checked;
    var printScale = parseInt(pageScaleInput.value) / 100;

    if (isNaN(printScale)) {
      printScale = 1;
      pageScaleInput.value = "100%";
    }

    // Workaround to match available paper size in actual print output
    printScale *= 0.75;

    var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
    var scale = 1 / graph.pageScale;

    if (autoOrigin) {
      var pageCount = onePageCheckBox.checked
        ? 1
        : parseInt(pageCountInput.value);

      if (!isNaN(pageCount)) {
        scale = mxUtils.getScaleForPageCount(pageCount, graph, pf, undefined);
      }
    }

    // Negative coordinates are cropped or shifted if page visible
    var gb = graph.getGraphBounds();
    var border = 0;
    var x0 = 0;
    var y0 = 0;

    // Applies print scale
    pf = mxRectangle.fromRectangle(pf);
    pf.width = Math.ceil(pf.width * printScale);
    pf.height = Math.ceil(pf.height * printScale);
    scale *= printScale;

    // Starts at first visible page
    if (!autoOrigin && graph.pageVisible) {
      var layout = graph.getPageLayout();
      x0 -= layout.x * pf.width;
      y0 -= layout.y * pf.height;
    } else {
      autoOrigin = true;
    }

    var preview = PrintDialog.createPrintPreview(
      graph,
      scale,
      pf,
      border,
      x0,
      y0,
      autoOrigin
    );
    preview.open();

    if (print) {
      PrintDialog.printPreview(preview);
    }
  }

  /**
   * Constructs a new print dialog.
   */
  static printPreview(preview) {
    try {
      if (preview.wnd != null) {
        var printFn = function () {
          preview.wnd.focus();
          preview.wnd.print();
          preview.wnd.close();
        };

        // Workaround for Google Chrome which needs a bit of a
        // delay in order to render the SVG contents
        // Needs testing in production
        if (mxClient.IS_GC) {
          window.setTimeout(printFn, 500);
        } else {
          printFn();
        }
      }
    } catch (e) {
      // ignores possible Access Denied
    }
  }

  /**
   * Constructs a new print dialog.
   */
  static createPrintPreview(graph, scale, pf, border, x0, y0, autoOrigin) {
    var preview: any = new mxPrintPreview(graph, scale, pf, border, x0, y0);
    preview.title = mxResources.get("preview");
    preview.printBackgroundImage = true;
    preview.autoOrigin = autoOrigin;
    var bg = graph.background;

    if (bg == null || bg == "" || bg == mxConstants.NONE) {
      bg = "#ffffff";
    }

    preview.backgroundColor = bg;

    var writeHead = preview.writeHead;

    // Adds a border in the preview
    preview.writeHead = function (doc) {
      writeHead.apply(this, arguments);

      doc.writeln('<style type="text/css">');
      doc.writeln("@media screen {");
      doc.writeln("  body > div { padding:30px;box-sizing:content-box; }");
      doc.writeln("}");
      doc.writeln("</style>");
    };

    return preview;
  }
}
