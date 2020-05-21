import mx from "@mxgraph-app/mx";
const {
  mxCellRenderer,
  mxEventObject,
  mxConstants,
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class GeometryManager {
  editorUi: any;
  format: any;
  container: any;
  getUnit: any;
  getUnitStep: any;
  isFloatUnit: any;
  inUnit: any;
  createPanel: any; // fn
  addUnitInput: any; // fn
  addLabel: any; // fn
  createCellOption: any; //fn
  addKeyHandler: any; // fn
  fromUnit: any; //
  listeners: any; //

  constructor(editorUi: any) {
    this.editorUi = editorUi;
  }
  /**
   *
   */
  addGeometry(container) {
    var panel = this;
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var rect = this.format.getSelectionState();

    var div = this.createPanel();
    div.style.paddingBottom = "8px";

    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "50px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("size"));
    div.appendChild(span);

    var widthUpdate, heightUpdate, leftUpdate, topUpdate;
    var width = this.addUnitInput(
      div,
      this.getUnit(),
      84,
      44,
      () => {
        widthUpdate.apply(this, []);
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit()
    );
    var height = this.addUnitInput(
      div,
      this.getUnit(),
      20,
      44,
      () => {
        heightUpdate.apply(this, []);
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit()
    );

    var autosizeBtn = document.createElement("div");
    autosizeBtn.className = "geSprite geSprite-fit";
    autosizeBtn.setAttribute(
      "title",
      mxResources.get("autosize") +
        " (" +
        this.editorUi.actions.get("autosize").shortcut +
        ")"
    );
    autosizeBtn.style.position = "relative";
    autosizeBtn.style.cursor = "pointer";
    autosizeBtn.style.marginTop = "-3px";
    autosizeBtn.style.border = "0px";
    autosizeBtn.style.left = "52px";
    mxUtils.setOpacity(autosizeBtn, 50);

    mxEvent.addListener(autosizeBtn, "mouseenter", function () {
      mxUtils.setOpacity(autosizeBtn, 100);
    });

    mxEvent.addListener(autosizeBtn, "mouseleave", function () {
      mxUtils.setOpacity(autosizeBtn, 50);
    });

    mxEvent.addListener(autosizeBtn, "click", function () {
      ui.actions.get("autosize").funct();
    });

    div.appendChild(autosizeBtn);
    this.addLabel(div, mxResources.get("width"), 84);
    this.addLabel(div, mxResources.get("height"), 20);
    mxUtils.br(div);

    var wrapper = document.createElement("div");
    wrapper.style.paddingTop = "8px";
    wrapper.style.paddingRight = "20px";
    wrapper.style.whiteSpace = "nowrap";
    wrapper.style.textAlign = "right";
    var opt = this.createCellOption(
      mxResources.get("constrainProportions"),
      mxConstants.STYLE_ASPECT,
      null,
      "fixed",
      "null"
    );
    opt.style.width = "100%";
    wrapper.appendChild(opt);
    div.appendChild(wrapper);

    var listener = (_sender?, _evt?, force?) => {
      rect = this.format.getSelectionState();

      if (
        !rect.containsLabel &&
        rect.vertices.length == graph.getSelectionCount() &&
        rect.width != null &&
        rect.height != null
      ) {
        div.style.display = "";

        if (force || document.activeElement != width) {
          width.value =
            this.inUnit(rect.width) +
            (rect.width == "" ? "" : " " + this.getUnit());
        }

        if (force || document.activeElement != height) {
          height.value =
            this.inUnit(rect.height) +
            (rect.height == "" ? "" : " " + this.getUnit());
        }
      } else {
        div.style.display = "none";
      }

      if (
        rect.vertices.length == graph.getSelectionCount() &&
        rect.x != null &&
        rect.y != null
      ) {
        div2.style.display = "";

        if (force || document.activeElement != left) {
          left.value =
            this.inUnit(rect.x) + (rect.x == "" ? "" : " " + this.getUnit());
        }

        if (force || document.activeElement != top) {
          top.value =
            this.inUnit(rect.y) + (rect.y == "" ? "" : " " + this.getUnit());
        }
      } else {
        div2.style.display = "none";
      }
    };

    var constrainCheckbox = opt.getElementsByTagName("input")[0];
    this.addKeyHandler(width, listener);
    this.addKeyHandler(height, listener);

    widthUpdate = this.addGeometryHandler(width, (geo, value) => {
      if (geo.width > 0) {
        value = Math.max(1, panel.fromUnit(value));

        if (constrainCheckbox.checked) {
          geo.height = Math.round((geo.height * value * 100) / geo.width) / 100;
        }

        geo.width = value;
      }
    });
    heightUpdate = this.addGeometryHandler(height, (geo, value) => {
      if (geo.height > 0) {
        value = Math.max(1, panel.fromUnit(value));

        if (constrainCheckbox.checked) {
          geo.width = Math.round((geo.width * value * 100) / geo.height) / 100;
        }

        geo.height = value;
      }
    });

    container.appendChild(div);

    var div2 = this.createPanel();
    div2.style.paddingBottom = "30px";

    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("position"));
    div2.appendChild(span);

    var left = this.addUnitInput(
      div2,
      this.getUnit(),
      84,
      44,
      () => {
        leftUpdate.apply(this, arguments);
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit()
    );
    var top = this.addUnitInput(
      div2,
      this.getUnit(),
      20,
      44,
      () => {
        topUpdate.apply(this, arguments);
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit()
    );

    mxUtils.br(div2);
    this.addLabel(div2, mxResources.get("left"), 84);
    this.addLabel(div2, mxResources.get("top"), 20);

    this.addKeyHandler(left, listener);
    this.addKeyHandler(top, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();

    leftUpdate = this.addGeometryHandler(left, (geo, value) => {
      value = panel.fromUnit(value);

      if (geo.relative) {
        geo.offset.x = value;
      } else {
        geo.x = value;
      }
    });
    topUpdate = this.addGeometryHandler(top, (geo, value) => {
      value = panel.fromUnit(value);

      if (geo.relative) {
        geo.offset.y = value;
      } else {
        geo.y = value;
      }
    });

    container.appendChild(div2);
  }

  /**
   *
   */
  addGeometryHandler(input, fn) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var initialValue: any;
    var panel = this;

    const update = (evt) => {
      if (input.value != "") {
        var value = parseFloat(input.value);

        if (isNaN(value)) {
          input.value = initialValue + " " + panel.getUnit();
        } else if (value != initialValue) {
          graph.getModel().beginUpdate();
          try {
            var cells = graph.getSelectionCells();

            for (var i = 0; i < cells.length; i++) {
              if (graph.getModel().isVertex(cells[i])) {
                var geo = graph.getCellGeometry(cells[i]);

                if (geo != null) {
                  geo = geo.clone();
                  fn(geo, value);

                  var state = graph.view.getState(cells[i]);

                  if (state != null && graph.isRecursiveVertexResize(state)) {
                    graph.resizeChildCells(cells[i], geo);
                  }

                  graph.getModel().setGeometry(cells[i], geo);
                  graph.constrainChildCells(cells[i]);
                }
              }
            }
          } finally {
            graph.getModel().endUpdate();
          }

          initialValue = value;
          input.value = value + " " + panel.getUnit();
        }
      }

      mxEvent.consume(evt);
    };

    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);
    mxEvent.addListener(input, "focus", function () {
      initialValue = input.value;
    });

    return update;
  }

  addEdgeGeometryHandler(input, fn) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var initialValue: any;

    const update = (evt) => {
      if (input.value != "") {
        var value = parseFloat(input.value);

        if (isNaN(value)) {
          input.value = initialValue + " pt";
        } else if (value != initialValue) {
          graph.getModel().beginUpdate();
          try {
            var cells = graph.getSelectionCells();

            for (var i = 0; i < cells.length; i++) {
              if (graph.getModel().isEdge(cells[i])) {
                var geo = graph.getCellGeometry(cells[i]);

                if (geo != null) {
                  geo = geo.clone();
                  fn(geo, value);

                  graph.getModel().setGeometry(cells[i], geo);
                }
              }
            }
          } finally {
            graph.getModel().endUpdate();
          }

          initialValue = value;
          input.value = value + " pt";
        }
      }

      mxEvent.consume(evt);
    };

    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);
    mxEvent.addListener(input, "focus", function () {
      initialValue = input.value;
    });

    return update;
  }

  /**
   *
   */
  addEdgeGeometry(container) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var rect = this.format.getSelectionState();

    var div = this.createPanel();

    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("width"));
    div.appendChild(span);

    var xtUpdate, ytUpdate, xsUpdate, ysUpdate;
    var width = this.addUnitInput(div, "pt", 20, 44, (evt) => {
      widthUpdate.apply(this, evt);
    });

    var listener = (_sender?, _evt?, force?) => {
      rect = this.format.getSelectionState();
      var cell = graph.getSelectionCell();

      if (rect.style.shape == "link" || rect.style.shape == "flexArrow") {
        div.style.display = "";

        if (force || document.activeElement != width) {
          var value = mxUtils.getValue(
            rect.style,
            "width",
            mxCellRenderer.defaultShapes["flexArrow"].prototype.defaultWidth
          );
          width.value = value + " pt";
        }
      } else {
        div.style.display = "none";
      }

      if (graph.getSelectionCount() == 1 && graph.model.isEdge(cell)) {
        var geo = graph.model.getGeometry(cell);

        if (
          geo.sourcePoint != null &&
          graph.model.getTerminal(cell, true) == null
        ) {
          xs.value = geo.sourcePoint.x;
          ys.value = geo.sourcePoint.y;
        } else {
          divs.style.display = "none";
        }

        if (
          geo.targetPoint != null &&
          graph.model.getTerminal(cell, false) == null
        ) {
          xt.value = geo.targetPoint.x;
          yt.value = geo.targetPoint.y;
        } else {
          divt.style.display = "none";
        }
      } else {
        divs.style.display = "none";
        divt.style.display = "none";
      }
    };

    mxUtils.br(div);
    this.addKeyHandler(width, listener);

    const widthUpdate = (evt) => {
      // Maximum stroke width is 999
      var value = parseInt(width.value);
      value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

      if (
        value !=
        mxUtils.getValue(
          rect.style,
          "width",
          mxCellRenderer.defaultShapes["flexArrow"].prototype.defaultWidth
        )
      ) {
        graph.setCellStyles("width", value, graph.getSelectionCells());
        ui.fireEvent(
          new mxEventObject(
            "styleChanged",
            "keys",
            ["width"],
            "values",
            [value],
            "cells",
            graph.getSelectionCells()
          )
        );
      }

      width.value = value + " pt";
      mxEvent.consume(evt);
    };

    mxEvent.addListener(width, "blur", widthUpdate);
    mxEvent.addListener(width, "change", widthUpdate);

    container.appendChild(div);

    var divs = this.createPanel();
    divs.style.paddingBottom = "30px";

    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, "Start");
    divs.appendChild(span);

    var xs = this.addUnitInput(divs, "pt", 84, 44, () => {
      xsUpdate.apply(this, []);
    });
    var ys = this.addUnitInput(divs, "pt", 20, 44, () => {
      ysUpdate.apply(this, []);
    });

    mxUtils.br(divs);
    this.addLabel(divs, mxResources.get("left"), 84);
    this.addLabel(divs, mxResources.get("top"), 20);
    container.appendChild(divs);
    this.addKeyHandler(xs, listener);
    this.addKeyHandler(ys, listener);

    var divt = this.createPanel();
    divt.style.paddingBottom = "30px";

    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, "End");
    divt.appendChild(span);

    var xt = this.addUnitInput(divt, "pt", 84, 44, () => {
      xtUpdate.apply(this, []);
    });
    var yt = this.addUnitInput(divt, "pt", 20, 44, () => {
      ytUpdate.apply(this, []);
    });

    mxUtils.br(divt);
    this.addLabel(divt, mxResources.get("left"), 84);
    this.addLabel(divt, mxResources.get("top"), 20);
    container.appendChild(divt);
    this.addKeyHandler(xt, listener);
    this.addKeyHandler(yt, listener);

    xsUpdate = this.addEdgeGeometryHandler(xs, (geo, value) => {
      geo.sourcePoint.x = value;
    });

    ysUpdate = this.addEdgeGeometryHandler(ys, (geo, value) => {
      geo.sourcePoint.y = value;
    });

    xtUpdate = this.addEdgeGeometryHandler(xt, (geo, value) => {
      geo.targetPoint.x = value;
    });

    ytUpdate = this.addEdgeGeometryHandler(yt, (geo, value) => {
      geo.targetPoint.y = value;
    });

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();
  }
}
