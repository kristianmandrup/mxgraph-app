import mx from "@mxgraph-app/mx";
import { Base } from "../Base";
import { UnitInput } from "../UnitInput";
const { mxEvent, mxEventObject, mxUtils } = mx;

export class RelativeOption extends Base {
  /**
   *
   */
  create(label, key, width?, handler?, init?) {
    width = width != null ? width : 44;

    var graph = this.editorUi.editor.graph;
    var div = this.createPanel();
    div.style.paddingTop = "10px";
    div.style.paddingBottom = "10px";
    mxUtils.write(div, label);
    div.style.fontWeight = "bold";

    var update = (evt) => {
      if (handler != null) {
        handler(input);
      } else {
        var value: any = parseInt(input.value);
        value = Math.min(100, Math.max(0, isNaN(value) ? 100 : value));
        var state = graph.view.getState(graph.getSelectionCell());

        if (state != null && value != mxUtils.getValue(state.style, key, 100)) {
          // Removes entry in style (assumes 100 is default for relative values)
          if (value == 100) {
            value = null;
          }

          graph.setCellStyles(key, value, graph.getSelectionCells());
          this.editorUi.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              [key],
              "values",
              [value],
              "cells",
              graph.getSelectionCells(),
            ),
          );
        }

        input.value = (value != null ? value : "100") + " %";
      }

      mxEvent.consume(evt);
    };

    var input = this.addUnitInput(
      div,
      "%",
      20,
      width,
      update,
      10,
      -15,
      handler != null,
    );

    if (key != null) {
      var listener = (_sender?, _evt?, force?) => {
        if (force || input != document.activeElement) {
          var ss = this.format.getSelectionState();
          var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
          input.value = isNaN(tmp) ? "" : tmp + " %";
        }
      };

      mxEvent.addListener(input, "keydown", (e) => {
        if (e.keyCode == 13) {
          graph.container.focus();
          mxEvent.consume(e);
        } else if (e.keyCode == 27) {
          listener(null, null, true);
          graph.container.focus();
          mxEvent.consume(e);
        }
      });

      graph.getModel().addListener(mxEvent.CHANGE, listener);
      this.listeners.push({
        destroy: function () {
          graph.getModel().removeListener(listener);
        },
      });
      listener();
    }

    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);

    if (init != null) {
      init(input);
    }

    return div;
  }

  protected addUnitInput(
    container,
    unit,
    right,
    width,
    update,
    step?,
    marginTop?,
    disableFocus?,
    isFloat?,
  ) {
    return this.newUnitInput().add(
      container,
      unit,
      right,
      width,
      update,
      step,
      marginTop,
      disableFocus,
      isFloat,
    );
  }

  protected newUnitInput() {
    const { format, editorUi, container } = this;
    return new UnitInput(format, editorUi, container);
  }
}
