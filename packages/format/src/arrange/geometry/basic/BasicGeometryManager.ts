import { AbstractManager } from "./AbstractManager";
import mx from "@mxgraph-app/mx";
const {
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class BasicGeometryManager extends AbstractManager {
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

    var leftUpdate, topUpdate;
    const { width, height, autosizeBtn, wrapper, listener } = this;

    div.appendChild(autosizeBtn);
    this.addLabel(div, mxResources.get("width"), 84);
    this.addLabel(div, mxResources.get("height"), 20);
    mxUtils.br(div);

    div.appendChild(wrapper);

    this.addKeyHandler(width, listener);
    this.addKeyHandler(height, listener);

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
      this.isFloatUnit(),
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
      this.isFloatUnit(),
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
}
