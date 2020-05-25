import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "../AbstractPalette";
import { EventListeners } from "./EventListeners";
import { Finder } from "./Finder";
const { mxUtils, mxClient, mxResources } = mx;

export class SearchPalette extends AbstractPalette {
  container: any;
  editorUi: any;
  searchImage: any;
  currentSearch: any;
  thumbWidth: number = 16;
  hideTooltip: any; //() => void
  searchEntries: any; //fn
  palettes: any;
  insertSearchHint: any; // fn
  expand: any;
  active: boolean = false;
  searchTerm = "";
  complete: boolean = false;

  _elt: any;
  _div: any;
  _inner: any;
  _input: any;
  _cross: any;
  _center: any;
  _button: any;

  eventListeners = new EventListeners();
  finder = new Finder();

  find = this.finder.find;

  /**
   * Adds shape search UI.
   */
  create(expand) {
    this.expand = expand;
    const { elt, inner, input, div, cross, button, center } = this;
    this.container.appendChild(elt);

    inner.appendChild(input);

    if (mxClient.IS_QUIRKS) {
      input.style.height = "28px";
      cross.style.top = "-4px";
    } else {
      cross.style.top = "1px";
    }

    // Needed to block event transparency in IE
    cross.style.background =
      "url('" + this.editorUi.editor.transparentImage + "')";

    inner.appendChild(cross);
    div.appendChild(inner);

    center.appendChild(button);
    div.appendChild(center);

    this.eventListeners.addAll();

    var outer = document.createElement("div");
    outer.appendChild(div);
    this.container.appendChild(outer);

    // Keeps references to the DOM nodes
    this.palettes["search"] = [elt, outer];
  }

  clearDiv = () => {
    const { div, inner, center } = this;
    this.active = false;
    this.currentSearch = null;
    var child: any = div.firstChild;

    while (child != null) {
      var next = child.nextSibling;

      if (child != inner && child != center) {
        child.parentNode.removeChild(child);
      }

      child = next;
    }
  };

  get button() {
    this._button = this._button || this.createButton();
    return this._button;
  }

  createButton() {
    const { find } = this;
    var button = mxUtils.button(mxResources.get("moreResults"), function () {
      find();
    });
    button.style.display = "none";

    // Workaround for inherited line-height in quirks mode
    button.style.lineHeight = "normal";
    button.style.marginTop = "4px";
    button.style.marginBottom = "8px";
    return button;
  }

  get center() {
    this._center = this._center || this.createCenter();
    return this._center;
  }

  createCenter() {
    var center = document.createElement("center");
    center.style.paddingTop = "4px";
    center.style.paddingBottom = "4px";
    return center;
  }

  get elt() {
    this._elt = this._elt || this.createElt();
    return this._elt;
  }

  createElt() {
    var elt = document.createElement("div");
    elt.style.visibility = "hidden";
  }

  get div() {
    this._div = this._div || this.createDiv();
    return this._div;
  }

  createDiv() {
    const { expand } = this;
    var div = document.createElement("div");
    div.className = "geSidebar";
    div.style.boxSizing = "border-box";
    div.style.overflow = "hidden";
    div.style.width = "100%";
    div.style.padding = "8px";
    div.style.paddingTop = "14px";
    div.style.paddingBottom = "0px";

    if (!expand) {
      div.style.display = "none";
    }
    return div;
  }

  get inner() {
    this._inner = this._inner || this.createInner();
    return this._inner;
  }

  createInner() {
    var inner = document.createElement("div");
    inner.style.whiteSpace = "nowrap";
    inner.style.textOverflow = "clip";
    inner.style.paddingBottom = "8px";
    inner.style.cursor = "default";
    return inner;
  }

  get input() {
    this._input = this._input || this.createInput();
    return this._input;
  }

  createInput() {
    var input = document.createElement("input");
    input.setAttribute("placeholder", mxResources.get("searchShapes"));
    input.setAttribute("type", "text");
    input.style.fontSize = "12px";
    input.style.overflow = "hidden";
    input.style.boxSizing = "border-box";
    input.style.border = "solid 1px #d5d5d5";
    input.style.borderRadius = "4px";
    input.style.width = "100%";
    input.style.outline = "none";
    input.style.padding = "6px";
    input.style.paddingRight = "20px";
    return input;
  }

  get cross() {
    this._cross = this._cross || this.createCross();
    return this._cross;
  }

  createCross() {
    var cross = document.createElement("img");
    cross.setAttribute("src", this.searchImage);
    cross.setAttribute("title", mxResources.get("search"));
    cross.style.position = "relative";
    cross.style.left = "-18px";
    return cross;
  }
}
