import { Base } from "../Base";
import mx from "@mxgraph-app/mx";
const { mxClient, mxConstants, mxEvent, mxUtils } = mx;

export class ColorOption extends Base {
  createColorOption(
    label,
    getColorFn,
    setColorFn,
    defaultColor,
    listener,
    callbackFn?,
    hideCheckbox?,
  ) {
    var div = document.createElement("div");
    div.style.padding = "6px 0px 1px 0px";
    div.style.whiteSpace = "nowrap";
    div.style.overflow = "hidden";
    div.style.width = "200px";
    div.style.height = (mxClient.IS_QUIRKS) ? "27px" : "18px";

    var cb = document.createElement("input");
    cb.setAttribute("type", "checkbox");
    cb.style.margin = "0px 6px 0px 0px";

    if (!hideCheckbox) {
      div.appendChild(cb);
    }

    var span = document.createElement("span");
    mxUtils.write(span, label);
    div.appendChild(span);

    var value = getColorFn();
    var applying = false;
    var btn: any;

    var apply = (color, disableUpdate?, forceUpdate?) => {
      if (!applying) {
        applying = true;
        color = (/(^#?[a-zA-Z0-9]*$)/.test(color)) ? color : defaultColor;
        btn.innerHTML = '<div style="width:' + ((mxClient.IS_QUIRKS)
          ? "30"
          : "36") +
          "px;height:12px;margin:3px;border:1px solid black;background-color:" +
          mxUtils.htmlEntities(
            (color != null && color != mxConstants.NONE) ? color : defaultColor,
          ) + ';"></div>';

        // Fine-tuning in Firefox, quirks mode and IE8 standards
        if (mxClient.IS_QUIRKS || this.documentMode == 8) {
          btn.firstChild.style.margin = "0px";
        }

        if (color != null && color != mxConstants.NONE) {
          cb.setAttribute("checked", "checked");
          cb.defaultChecked = true;
          cb.checked = true;
        } else {
          cb.removeAttribute("checked");
          cb.defaultChecked = false;
          cb.checked = false;
        }

        btn.style.display = (cb.checked || hideCheckbox) ? "" : "none";

        if (callbackFn != null) {
          callbackFn(color);
        }

        if (!disableUpdate) {
          value = color;

          // Checks if the color value needs to be updated in the model
          if (forceUpdate || hideCheckbox || getColorFn() != value) {
            setColorFn(value);
          }
        }

        applying = false;
      }
    };

    btn = mxUtils.button(
      "",
      (evt) => {
        this.editorUi.pickColor(value, function (color) {
          apply(color, null, true);
        });
        mxEvent.consume(evt);
      },
    );
    btn.style.position = "absolute";
    btn.style.marginTop = "-4px";
    btn.style.right = mxClient.IS_QUIRKS ? "0px" : "20px";
    btn.style.height = "22px";
    btn.className = "geColorBtn";
    btn.style.display = cb.checked || hideCheckbox ? "" : "none";
    div.appendChild(btn);

    mxEvent.addListener(div, "click", (evt) => {
      var source = mxEvent.getSource(evt);

      if (source == cb || source.nodeName != "INPUT") {
        // Toggles checkbox state for click on label
        if (source != cb) {
          cb.checked = !cb.checked;
        }

        // Overrides default value with current value to make it easier
        // to restore previous value if the checkbox is clicked twice
        if (
          !cb.checked &&
          value != null &&
          value != mxConstants.NONE &&
          defaultColor != mxConstants.NONE
        ) {
          defaultColor = value;
        }

        apply(cb.checked ? defaultColor : mxConstants.NONE);
      }
    });

    apply(value, true);

    if (listener != null) {
      listener.install(apply);
      this.listeners.push(listener);
    }

    return div;
  }
}
