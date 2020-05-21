import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";

const { mxUtils, mxClient, mxResources } = mx;
const { IMAGE_PATH } = resources;

/**
 * Constructs a new about dialog.
 */
export class AboutDialog {
  container: any;

  constructor(editorUi) {
    var div = document.createElement("div");
    div.setAttribute("align", "center");
    var h3 = document.createElement("h3");
    mxUtils.write(h3, mxResources.get("about") + " GraphEditor");
    div.appendChild(h3);
    var img = document.createElement("img");
    img.style.border = "0px";
    img.setAttribute("width", "176");
    img.setAttribute("width", "151");
    img.setAttribute("src", IMAGE_PATH + "/logo.png");
    div.appendChild(img);
    mxUtils.br(div);
    mxUtils.write(div, "Powered by mxGraph " + mxClient.VERSION);
    mxUtils.br(div);
    var link = document.createElement("a");
    link.setAttribute("href", "http://www.jgraph.com/");
    link.setAttribute("target", "_blank");
    mxUtils.write(link, "www.jgraph.com");
    div.appendChild(link);
    mxUtils.br(div);
    mxUtils.br(div);
    var closeBtn = mxUtils.button(mxResources.get("close"), function () {
      editorUi.hideDialog();
    });
    closeBtn.className = "geBtn gePrimaryBtn";
    div.appendChild(closeBtn);

    this.container = div;
  }
}
