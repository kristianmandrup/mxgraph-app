import mx from "@mxgraph-app/mx";
import { AbstractPalette } from "./AbstractPalette";
import { Dialog } from "@mxgraph-app/dialogs";
const { mxEvent, mxUtils, mxClient, mxResources } = mx;

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

  /**
   * Adds shape search UI.
   */
  create(expand) {
    var elt = document.createElement("div");
    elt.style.visibility = "hidden";
    this.container.appendChild(elt);

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

    var inner = document.createElement("div");
    inner.style.whiteSpace = "nowrap";
    inner.style.textOverflow = "clip";
    inner.style.paddingBottom = "8px";
    inner.style.cursor = "default";

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
    inner.appendChild(input);

    var cross = document.createElement("img");
    cross.setAttribute("src", this.searchImage);
    cross.setAttribute("title", mxResources.get("search"));
    cross.style.position = "relative";
    cross.style.left = "-18px";

    if (mxClient.IS_QUIRKS) {
      input.style.height = "28px";
      cross.style.top = "-4px";
    } else {
      cross.style.top = "1px";
    }

    // Needed to block event transparency in IE
    cross.style.background =
      "url('" + this.editorUi.editor.transparentImage + "')";

    var find;

    inner.appendChild(cross);
    div.appendChild(inner);

    var center = document.createElement("center");
    var button = mxUtils.button(mxResources.get("moreResults"), function () {
      find();
    });
    button.style.display = "none";

    // Workaround for inherited line-height in quirks mode
    button.style.lineHeight = "normal";
    button.style.marginTop = "4px";
    button.style.marginBottom = "8px";
    center.style.paddingTop = "4px";
    center.style.paddingBottom = "4px";

    center.appendChild(button);
    div.appendChild(center);

    var searchTerm = "";
    var active = false;
    var complete = false;
    var page = 0;
    var hash = new Object();

    // Count is dynamically updated below
    var count = 12;

    var clearDiv = () => {
      active = false;
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

    mxEvent.addListener(cross, "click", () => {
      if (cross.getAttribute("src") == Dialog.prototype.closeImage) {
        cross.setAttribute("src", this.searchImage);
        cross.setAttribute("title", mxResources.get("search"));
        button.style.display = "none";
        input.value = "";
        searchTerm = "";
        clearDiv();
      }

      input.focus();
    });

    find = () => {
      // Shows 4 rows (minimum 4 results)
      count =
        4 *
        Math.max(
          1,
          Math.floor(this.container.clientWidth / (this.thumbWidth + 10))
        );
      this.hideTooltip();

      if (input.value != "") {
        if (center.parentNode != null) {
          if (searchTerm != input.value) {
            clearDiv();
            searchTerm = input.value;
            hash = new Object();
            complete = false;
            page = 0;
          }

          if (!active && !complete) {
            button.setAttribute("disabled", "true");
            button.style.display = "";
            button.style.cursor = "wait";
            button.innerHTML = mxResources.get("loading") + "...";
            active = true;

            // Ignores old results
            var current = new Object();
            this.currentSearch = current;

            this.searchEntries(
              searchTerm,
              count,
              page,
              (results, len, more, terms) => {
                if (this.currentSearch == current) {
                  results = results != null ? results : [];
                  active = false;
                  page++;
                  this.insertSearchHint(
                    div,
                    searchTerm,
                    count,
                    page,
                    results,
                    len,
                    more,
                    terms
                  );

                  // Allows to repeat the search
                  if (results.length == 0 && page == 1) {
                    searchTerm = "";
                  }

                  if (center.parentNode != null) {
                    center.parentNode.removeChild(center);
                  }

                  for (var i = 0; i < results.length; i++) {
                    try {
                      var elt = results[i]();

                      // Avoids duplicates in results
                      if (hash[elt.innerHTML] == null) {
                        hash[elt.innerHTML] = "1";
                        div.appendChild(elt);
                      }
                    } catch (e) {
                      // ignore
                    }
                  }

                  if (more) {
                    button.removeAttribute("disabled");
                    button.innerHTML = mxResources.get("moreResults");
                  } else {
                    button.innerHTML = mxResources.get("reset");
                    button.style.display = "none";
                    complete = true;
                  }

                  button.style.cursor = "";
                  div.appendChild(center);
                }
              },
              () => {
                // TODO: Error handling
                button.style.cursor = "";
              }
            );
          }
        }
      } else {
        clearDiv();
        input.value = "";
        searchTerm = "";
        hash = new Object();
        button.style.display = "none";
        complete = false;
        input.focus();
      }
    };

    mxEvent.addListener(input, "keydown", (evt) => {
      if (evt.keyCode == 13 /* Enter */) {
        find();
        mxEvent.consume(evt);
      }
    });

    mxEvent.addListener(input, "keyup", (_evt) => {
      if (input.value == "") {
        cross.setAttribute("src", this.searchImage);
        cross.setAttribute("title", mxResources.get("search"));
      } else {
        cross.setAttribute("src", Dialog.prototype.closeImage);
        cross.setAttribute("title", mxResources.get("reset"));
      }

      if (input.value == "") {
        complete = true;
        button.style.display = "none";
      } else if (input.value != searchTerm) {
        button.style.display = "none";
        complete = false;
      } else if (!active) {
        if (complete) {
          button.style.display = "none";
        } else {
          button.style.display = "";
        }
      }
    });

    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, "mousedown", (evt) => {
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }

      evt.cancelBubble = true;
    });

    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, "selectstart", (evt) => {
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }

      evt.cancelBubble = true;
    });

    var outer = document.createElement("div");
    outer.appendChild(div);
    this.container.appendChild(outer);

    // Keeps references to the DOM nodes
    this.palettes["search"] = [elt, outer];
  }
}
