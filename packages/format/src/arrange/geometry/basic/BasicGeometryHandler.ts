import { AbstractManager } from "./AbstractManager";
import mx from "@mxgraph-app/mx";
const {
  mxEvent,
} = mx;

export class BasicGeometryHandler extends AbstractManager {
  initialValue: any;
  input: any;
  fn: any;
  /**
   *
   */
  addGeometryHandler(input, fn) {
    this.input = input;
    this.fn = fn;
    const { update } = this;
    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);
    mxEvent.addListener(input, "focus", () => {
      this.initialValue = input.value;
    });

    return update;
  }

  update = (evt) => {
    const panel: any = this;
    const { graph, input, fn, initialValue } = this;
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

        this.initialValue = value;
        input.value = value + " " + panel.getUnit();
      }
    }

    mxEvent.consume(evt);
  };
}
