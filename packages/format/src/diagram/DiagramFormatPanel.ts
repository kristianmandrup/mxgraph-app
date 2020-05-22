import mx from "@mxgraph-app/mx";
import { ChangePageSetup, PageSetupDialog } from "@mxgraph-app/dialogs";
import { BaseFormatPanel } from "../base/BaseFormatPanel";
const {
  mxEventObject,
  mxResources,
  mxConstants,
  mxClient,
  mxEvent,
  mxUtils,
} = mx;
// const { IMAGE_PATH } = resources

export class DiagramFormatPanel {
  graph: any;
  editorUi: any;
  gridEnabledListener: any;
  input: any;
  fPanel: any;
  createTitle: any;
  createOption: any;
  getUnit: any;
  inUnit: any;
  createStepper: any;
  createColorOption: any;
  getUnitStep: any;
  isFloatUnit: any;
  listeners: any[] = [];
  addKeyHandler: any;
  format: any;
  container: any;

  constructor(format, editorUi, container) {
    this.format = format;
    this.editorUi = editorUi;
    this.container = container;
  }
  /**
   * Adds the label menu items to the given menu and parent.
   */
  addOptions(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    const { listener } = div;

    div.appendChild(this.createTitle(mxResources.get("options")));
    if (graph.isEnabled()) {
      // Connection arrows
      div.appendChild(
        this.createOption(
          mxResources.get("connectionArrows"),
          () => {
            return graph.connectionArrowsEnabled;
          },
          (_checked) => {
            ui.actions.get("connectionArrows").funct();
          },
          {
            install: (apply) => {
              div.listener = () => {
                apply(graph.connectionArrowsEnabled);
              };
              ui.addListener("connectionArrowsChanged", listener);
            },
            destroy: () => {
              ui.removeListener(listener);
            },
          },
        ),
      );

      // Connection points
      div.appendChild(
        this.createOption(
          mxResources.get("connectionPoints"),
          () => {
            return graph.connectionHandler.isEnabled();
          },
          (_checked) => {
            ui.actions.get("connectionPoints").funct();
          },
          {
            install: (apply) => {
              div.listener = () => {
                apply(graph.connectionHandler.isEnabled());
              };

              ui.addListener("connectionPointsChanged", listener);
            },
            destroy: () => {
              ui.removeListener(listener);
            },
          },
        ),
      );

      // Guides
      div.appendChild(
        this.createOption(
          mxResources.get("guides"),
          () => {
            return graph.graphHandler.guidesEnabled;
          },
          (_checked) => {
            ui.actions.get("guides").funct();
          },
          {
            install: (apply) => {
              div.listener = () => {
                apply(graph.graphHandler.guidesEnabled);
              };

              ui.addListener("guidesEnabledChanged", listener);
            },
            destroy: () => {
              ui.removeListener(listener);
            },
          },
        ),
      );
    }
    return div;
  }

  /**
   *
   */
  addGridOption(container) {
    var fPanel: any = this;
    var ui = this.editorUi;
    var graph = ui.editor.graph;

    var input = document.createElement("input");
    input.style.position = "absolute";
    input.style.textAlign = "right";
    input.style.width = "38px";
    input.value = this.inUnit(graph.getGridSize()) + " " + this.getUnit();

    var stepper = this.createStepper(
      input,
      this.update,
      this.getUnitStep(),
      null,
      null,
      null,
      this.isFloatUnit(),
    );
    input.style.display = graph.isGridEnabled() ? "" : "none";
    stepper.style.display = input.style.display;

    mxEvent.addListener(input, "keydown", function (e) {
      if (e.keyCode == 13) {
        graph.container.focus();
        mxEvent.consume(e);
      } else if (e.keyCode == 27) {
        input.value = graph.getGridSize();
        graph.container.focus();
        mxEvent.consume(e);
      }
    });

    mxEvent.addListener(input, "blur", this.update);
    mxEvent.addListener(input, "change", this.update);

    var unitChangeListener = function (_sender, _evt) {
      input.value = fPanel.inUnit(graph.getGridSize()) + " " + fPanel.getUnit();
      fPanel.format.refresh();
    };

    graph.view.addListener("unitChanged", unitChangeListener);
    this.listeners.push({
      destroy: function () {
        graph.view.removeListener(unitChangeListener);
      },
    });

    if (mxClient.IS_SVG) {
      input.style.marginTop = "-2px";
      input.style.right = "84px";
      stepper.style.marginTop = "-16px";
      stepper.style.right = "72px";

      var panel = this.createColorOption(
        mxResources.get("grid"),
        () => {
          var color = graph.view.gridColor;

          return graph.isGridEnabled() ? color : null;
        },
        (color) => {
          var enabled = graph.isGridEnabled();

          if (color == mxConstants.NONE) {
            graph.setGridEnabled(false);
          } else {
            graph.setGridEnabled(true);
            ui.setGridColor(color);
          }

          input.style.display = graph.isGridEnabled() ? "" : "none";
          stepper.style.display = input.style.display;

          if (enabled != graph.isGridEnabled()) {
            ui.fireEvent(new mxEventObject("gridEnabledChanged"));
          }
        },
        "#e0e0e0",
        {
          install: function (apply) {
            this.listener = function () {
              apply(graph.isGridEnabled() ? graph.view.gridColor : null);
            };

            ui.addListener("gridColorChanged", this.listener);
            ui.addListener("gridEnabledChanged", this.listener);
          },
          destroy: function () {
            ui.removeListener(this.listener);
          },
        },
      );

      panel.appendChild(input);
      panel.appendChild(stepper);
      container.appendChild(panel);
    } else {
      input.style.marginTop = "2px";
      input.style.right = "32px";
      stepper.style.marginTop = "2px";
      stepper.style.right = "20px";

      container.appendChild(input);
      container.appendChild(stepper);

      container.appendChild(
        this.createOption(
          mxResources.get("grid"),
          function () {
            return graph.isGridEnabled();
          },
          function (checked) {
            graph.setGridEnabled(checked);

            if (graph.isGridEnabled()) {
              graph.view.gridColor = "#e0e0e0";
            }

            ui.fireEvent(new mxEventObject("gridEnabledChanged"));
          },
          {
            install: function (apply) {
              this.listener = function () {
                input.style.display = graph.isGridEnabled() ? "" : "none";
                stepper.style.display = input.style.display;

                apply(graph.isGridEnabled());
              };

              ui.addListener("gridEnabledChanged", this.listener);
            },
            destroy: function () {
              ui.removeListener(this.listener);
            },
          },
        ),
      );
    }
  }

  update(evt) {
    const { fPanel, graph, input } = this;
    var value = fPanel.isFloatUnit()
      ? parseFloat(input.value)
      : parseInt(input.value);
    value = fPanel.fromUnit(
      Math.max(fPanel.inUnit(1), isNaN(value) ? fPanel.inUnit(10) : value),
    );

    if (value != graph.getGridSize()) {
      graph.setGridSize(value);
    }

    input.value = fPanel.inUnit(value) + " " + fPanel.getUnit();
    mxEvent.consume(evt);
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addDocumentProperties(div) {
    // Hook for subclassers
    div.appendChild(this.createTitle(mxResources.get("options")));

    return div;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addPaperSize(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    div.appendChild(this.createTitle(mxResources.get("paperSize")));

    var accessor = PageSetupDialog.addPageFormatPanel(
      div,
      "formatpanel",
      graph.pageFormat,
      function (pageFormat) {
        if (
          graph.pageFormat == null ||
          graph.pageFormat.width != pageFormat.width ||
          graph.pageFormat.height != pageFormat.height
        ) {
          var change = new ChangePageSetup(ui, null, null, pageFormat);
          change.ignoreColor = true;
          change.ignoreImage = true;

          graph.model.execute(change);
        }
      },
    );

    this.addKeyHandler(accessor.widthInput, function () {
      accessor.set(graph.pageFormat);
    });
    this.addKeyHandler(accessor.heightInput, function () {
      accessor.set(graph.pageFormat);
    });

    var listener = function () {
      accessor.set(graph.pageFormat);
    };

    ui.addListener("pageFormatChanged", listener);
    this.listeners.push({
      destroy: function () {
        ui.removeListener(listener);
      },
    });

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });

    return div;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addStyleOps(div) {
    var btn = mxUtils.button(mxResources.get("editData"), (_evt) => {
      this.editorUi.actions.get("editData").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("editData") +
        " (" +
        this.editorUi.actions.get("editData").shortcut +
        ")",
    );
    btn.style.width = "202px";
    btn.style.marginBottom = "2px";
    div.appendChild(btn);

    mxUtils.br(div);

    btn = mxUtils.button(mxResources.get("clearDefaultStyle"), (_evt) => {
      this.editorUi.actions.get("clearDefaultStyle").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("clearDefaultStyle") +
        " (" +
        this.editorUi.actions.get("clearDefaultStyle").shortcut +
        ")",
    );
    btn.style.width = "202px";
    div.appendChild(btn);

    return div;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  destroy() {
    BaseFormatPanel.prototype.destroy.apply(this, []);

    if (this.gridEnabledListener) {
      this.editorUi.removeListener(this.gridEnabledListener);
      this.gridEnabledListener = null;
    }
  }
}
