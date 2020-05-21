import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
import { Dialog } from "../Dialog";
const { mxEvent, mxClient, mxUtils, mxResources } = mx;
const { IMAGE_PATH } = resources;
/**
 * Constructs a new link dialog.
 */
export class LinkDialog {
  container: any;
  init: () => void;
  documentMode: any;

  constructor(
    editorUi,
    initialValue,
    btnLabel,
    fn,
    { documentMode }: any = {}
  ) {
    this.documentMode = documentMode;
    var div = document.createElement("div");
    mxUtils.write(div, mxResources.get("editLink") + ":");

    var inner = document.createElement("div");
    inner.className = "geTitle";
    inner.style.backgroundColor = "transparent";
    inner.style.borderColor = "transparent";
    inner.style.whiteSpace = "nowrap";
    inner.style.textOverflow = "clip";
    inner.style.cursor = "default";

    if (!mxClient.IS_VML) {
      inner.style.paddingRight = "20px";
    }

    var linkInput = document.createElement("input");
    linkInput.setAttribute("value", initialValue);
    linkInput.setAttribute("placeholder", "http://www.example.com/");
    linkInput.setAttribute("type", "text");
    linkInput.style.marginTop = "6px";
    linkInput.style.width = "400px";
    linkInput.style.backgroundImage =
      "url('" + Dialog.prototype.clearImage + "')";
    linkInput.style.backgroundRepeat = "no-repeat";
    linkInput.style.backgroundPosition = "100% 50%";
    linkInput.style.paddingRight = "14px";

    var cross = document.createElement("div");
    cross.setAttribute("title", mxResources.get("reset"));
    cross.style.position = "relative";
    cross.style.left = "-16px";
    cross.style.width = "12px";
    cross.style.height = "14px";
    cross.style.cursor = "pointer";

    // Workaround for inline-block not supported in IE
    cross.style.display = mxClient.IS_VML ? "inline" : "inline-block";
    cross.style.top = (mxClient.IS_VML ? 0 : 3) + "px";

    // Needed to block event transparency in IE
    cross.style.background = "url(" + IMAGE_PATH + "/transparent.gif)";

    mxEvent.addListener(cross, "click", function () {
      linkInput.value = "";
      linkInput.focus();
    });

    inner.appendChild(linkInput);
    inner.appendChild(cross);
    div.appendChild(inner);

    this.init = function () {
      linkInput.focus();

      if (
        mxClient.IS_GC ||
        mxClient.IS_FF ||
        documentMode >= 5 ||
        mxClient.IS_QUIRKS
      ) {
        linkInput.select();
      } else {
        document.execCommand("selectAll", false);
      }
    };

    var btns = document.createElement("div");
    btns.style.marginTop = "18px";
    btns.style.textAlign = "right";

    mxEvent.addListener(linkInput, "keypress", function (e) {
      if (e.keyCode == 13) {
        editorUi.hideDialog();
        fn(linkInput.value);
      }
    });

    var cancelBtn = mxUtils.button(mxResources.get("cancel"), function () {
      editorUi.hideDialog();
    });
    cancelBtn.className = "geBtn";

    if (editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn);
    }

    var mainBtn = mxUtils.button(btnLabel, function () {
      editorUi.hideDialog();
      fn(linkInput.value);
    });
    mainBtn.className = "geBtn gePrimaryBtn";
    btns.appendChild(mainBtn);

    if (!editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn);
    }

    div.appendChild(btns);

    this.container = div;
  }
}
