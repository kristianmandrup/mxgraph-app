import mx from "@mxgraph-app/mx";
import { SearchPalette } from "./SearchPalette";
import { Dialog } from "@mxgraph-app/dialogs";
const { mxEvent, mxResources } = mx;

export class EventListeners extends SearchPalette {
  addAll() {
    this.click().keydown().keyup().mousedown().selectstart();
  }

  click() {
    const { cross, button, input, clearDiv } = this;
    mxEvent.addListener(cross, "click", () => {
      if (cross.getAttribute("src") == Dialog.prototype.closeImage) {
        cross.setAttribute("src", this.searchImage);
        cross.setAttribute("title", mxResources.get("search"));
        button.style.display = "none";
        input.value = "";
        this.searchTerm = "";
        clearDiv();
      }

      input.focus();
    });
    return this;
  }

  keydown() {
    const { find, input } = this;
    mxEvent.addListener(input, "keydown", (evt) => {
      if (evt.keyCode == 13 /* Enter */) {
        find();
        mxEvent.consume(evt);
      }
    });
    return this;
  }

  keyup() {
    const { cross, input, button, searchTerm, active, complete } = this;
    mxEvent.addListener(input, "keyup", (_evt) => {
      if (input.value == "") {
        cross.setAttribute("src", this.searchImage);
        cross.setAttribute("title", mxResources.get("search"));
      } else {
        cross.setAttribute("src", Dialog.prototype.closeImage);
        cross.setAttribute("title", mxResources.get("reset"));
      }

      if (input.value == "") {
        this.complete = true;
        button.style.display = "none";
      } else if (input.value != searchTerm) {
        button.style.display = "none";
        this.complete = false;
      } else if (!active) {
        if (complete) {
          button.style.display = "none";
        } else {
          button.style.display = "";
        }
      }
    });
    return this;
  }

  mousedown() {
    const { input } = this;
    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, "mousedown", (evt) => {
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }

      evt.cancelBubble = true;
    });
    return this;
  }

  selectstart() {
    const { input } = this;
    // Workaround for blocked text selection in Editor
    mxEvent.addListener(input, "selectstart", (evt) => {
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }

      evt.cancelBubble = true;
    });
    return this;
  }
}
