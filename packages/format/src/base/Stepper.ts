import mx from "@mxgraph-app/mx";
import { Base } from "./Base";
const { mxClient, mxEvent, mxUtils } = mx;

export class Stepper extends Base {
  selection: any;

  /**
   *
   */
  create(
    input,
    update,
    step,
    height,
    disableFocus?,
    defaultValue?,
    isFloat?,
  ) {
    step = step != null ? step : 1;
    height = height != null ? height : 8;

    if (mxClient.IS_QUIRKS) {
      height = height - 2;
    } else if (mxClient.IS_MT || this.documentMode >= 8) {
      height = height + 1;
    }

    var stepper = document.createElement("div");
    mxUtils.setPrefixedStyle(stepper.style, "borderRadius", "3px");
    stepper.style.border = "1px solid rgb(192, 192, 192)";
    stepper.style.position = "absolute";

    var up = document.createElement("div");
    up.style.borderBottom = "1px solid rgb(192, 192, 192)";
    up.style.position = "relative";
    up.style.height = height + "px";
    up.style.width = "10px";
    up.className = "geBtnUp";
    stepper.appendChild(up);

    var down: any = up.cloneNode(false);
    down.style.border = "none";
    down.style.height = height + "px";
    down.className = "geBtnDown";
    stepper.appendChild(down);

    mxEvent.addListener(down, "click", function (evt) {
      if (input.value == "") {
        input.value = defaultValue || "2";
      }

      var val = isFloat ? parseFloat(input.value) : parseInt(input.value);

      if (!isNaN(val)) {
        input.value = val - step;

        if (update != null) {
          update(evt);
        }
      }

      mxEvent.consume(evt);
    });

    mxEvent.addListener(up, "click", function (evt) {
      if (input.value == "") {
        input.value = defaultValue || "0";
      }

      var val = isFloat ? parseFloat(input.value) : parseInt(input.value);

      if (!isNaN(val)) {
        input.value = val + step;

        if (update != null) {
          update(evt);
        }
      }

      mxEvent.consume(evt);
    });

    // Disables transfer of focus to DIV but also :active CSS
    // so it's only used for fontSize where the focus should
    // stay on the selected text, but not for any other input.
    if (disableFocus) {
      var currentSelection: any;

      mxEvent.addGestureListeners(
        stepper,
        (evt) => {
          // Workaround for lost current selection in page because of focus in IE
          if (mxClient.IS_QUIRKS || this.documentMode == 8) {
            currentSelection = this.selection.createRange();
          }

          mxEvent.consume(evt);
        },
        null,
        function (evt) {
          // Workaround for lost current selection in page because of focus in IE
          if (currentSelection) {
            try {
              currentSelection.select();
            } catch (e) {
              // ignore
            }

            currentSelection = null;
            mxEvent.consume(evt);
          }
        },
      );
    }

    return stepper;
  }
}
