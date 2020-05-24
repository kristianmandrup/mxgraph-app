import mx from "@mxgraph-app/mx";
const { mxClient } = mx;

export class PaletteManager {
  container: any;
  palettes: any = {};
  createTitle: any; // fn
  addFoldingHandler: any; // fn
  /**
   * Removes the palette for the given ID.
   */
  removePalette(id) {
    var elts = this.palettes[id];

    if (elts != null) {
      this.palettes[id] = null;

      for (var i = 0; i < elts.length; i++) {
        this.container.removeChild(elts[i]);
      }

      return true;
    }

    return false;
  }

  /**
   * Adds the given palette.
   */
  addPaletteFunctions(id, title, expanded, fns) {
    this.addPalette(id, title, expanded, (content) => {
      for (var i = 0; i < fns.length; i++) {
        content.appendChild(fns[i](content));
      }
    });
  }

  /**
   * Adds the given palette.
   */
  addPalette(id, title, expanded, onInit) {
    var elt = this.createTitle(title);
    this.container.appendChild(elt);

    var div = document.createElement("div");
    div.className = "geSidebar";

    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER) {
      div.style.touchAction = "none";
    }

    if (expanded) {
      onInit(div);
      onInit = null;
    } else {
      div.style.display = "none";
    }

    this.addFoldingHandler(elt, div, onInit);

    var outer = document.createElement("div");
    outer.appendChild(div);
    this.container.appendChild(outer);

    // Keeps references to the DOM nodes
    if (id != null) {
      this.palettes[id] = [elt, outer];
    }

    return div;
  }
}
