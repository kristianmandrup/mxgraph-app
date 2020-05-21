import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
const { mxClient } = mx;
const { OPEN_FORM } = resources;
/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new open dialog.
 */
export class OpenDialog {
  documentMode: any;
  container: any;
  useLocalStorage: any; // Editor.useLocalStorage

  constructor({ documentMode }) {
    this.documentMode = documentMode;
    var iframe: any = document.createElement("iframe");
    iframe.style.backgroundColor = "transparent";
    iframe.allowTransparency = "true";
    iframe.style.borderStyle = "none";
    iframe.style.borderWidth = "0px";
    iframe.style.overflow = "hidden";
    iframe.frameBorder = "0";

    // Adds padding as a workaround for box model in older IE versions
    var dx =
      mxClient.IS_VML && (documentMode == null || documentMode < 8) ? 20 : 0;

    iframe.setAttribute(
      "width",
      (this.useLocalStorage ? 640 : 320) + dx + "px"
    );
    iframe.setAttribute(
      "height",
      (this.useLocalStorage ? 480 : 220) + dx + "px"
    );
    iframe.setAttribute("src", OPEN_FORM);

    this.container = iframe;
  }
}
