import { AbstractManager } from "./AbstractManager";
import mx from "@mxgraph-app/mx";
const {
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class EdgeGeometryManager extends AbstractManager {
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
  addEdgeGeometry(container = this.container) {
    const { span, div, divs, graph } = this;
    // const { addKeyHandler, addLabel } = this;

    div.appendChild(span);

    const { width1, listener, widthUpdate } = this;

    mxUtils.br(div);
    this.addKeyHandler(width1, listener);

    mxEvent.addListener(width1, "blur", widthUpdate);
    mxEvent.addListener(width1, "change", widthUpdate);

    container.appendChild(div);

    divs.appendChild(span);

    const { xt, yt, xs, ys, divt, span1 } = this;

    mxUtils.br(divs);
    this.addLabel(divs, mxResources.get("left"), 84);
    this.addLabel(divs, mxResources.get("top"), 20);
    container.appendChild(divs);
    this.addKeyHandler(xs, listener);
    this.addKeyHandler(ys, listener);

    divt.appendChild(span1);

    mxUtils.br(divt);
    this.addLabel(divt, mxResources.get("left"), 84);
    this.addLabel(divt, mxResources.get("top"), 20);
    container.appendChild(divt);
    this.addKeyHandler(xt, listener);
    this.addKeyHandler(yt, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();
  }
}
