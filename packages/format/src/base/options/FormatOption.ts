import { Base } from "../Base";
import mx from "@mxgraph-app/mx";
const { mxClient, mxEvent, mxUtils } = mx;

export class FormatOption extends Base {
  /**
   * Adds the given option.
   */
  createOption(label, isCheckedFn, setCheckedFn, listener) {
    var div = document.createElement("div");
    div.style.padding = "6px 0px 1px 0px";
    div.style.whiteSpace = "nowrap";
    div.style.overflow = "hidden";
    div.style.width = "200px";
    div.style.height = mxClient.IS_QUIRKS ? "27px" : "18px";

    var cb = document.createElement("input");
    cb.setAttribute("type", "checkbox");
    cb.style.margin = "0px 6px 0px 0px";
    div.appendChild(cb);

    var span = document.createElement("span");
    mxUtils.write(span, label);
    div.appendChild(span);

    var applying = false;
    var value = isCheckedFn();

    var apply = function (newValue) {
      if (!applying) {
        applying = true;

        if (newValue) {
          cb.setAttribute("checked", "checked");
          cb.defaultChecked = true;
          cb.checked = true;
        } else {
          cb.removeAttribute("checked");
          cb.defaultChecked = false;
          cb.checked = false;
        }

        if (value != newValue) {
          value = newValue;

          // Checks if the color value needs to be updated in the model
          if (isCheckedFn() != value) {
            setCheckedFn(value);
          }
        }

        applying = false;
      }
    };

    mxEvent.addListener(div, "click", function (evt) {
      if (cb.getAttribute("disabled") != "disabled") {
        // Toggles checkbox state for click on label
        var source = mxEvent.getSource(evt);

        if (source == div || source == span) {
          cb.checked = !cb.checked;
        }

        apply(cb.checked);
      }
    });

    apply(value);

    if (listener) {
      listener.install(apply);
      this.listeners.push(listener);
    }

    return div;
  }
}
