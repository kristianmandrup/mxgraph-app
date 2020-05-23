import { AbstractManager } from "./AbstractManager";
import mx from "@mxgraph-app/mx";
const {
  mxEvent,
} = mx;

export class EdgeGeometryHandler extends AbstractManager {
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
}
