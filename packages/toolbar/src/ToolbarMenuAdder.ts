import mx from "@mxgraph-app/mx";
// import resources from "@mxgraph-app/resources";
import { Base } from "./Base";
import { ToolbarItemAdder } from "./ToolbarItemAdder";
// const { IMAGE_PATH } = resources;
const {
  mxPopupMenu,
  mxUtils,
  mxEvent,
  mxClient,
} = mx;

export class ToolbarMenuAdder extends Base {
  itemAdder: any;
  dropdownImageHtml: any;
  compactUi: any; // EditorUI.compactUi

  constructor(editorUi, container) {
    super(editorUi, container);
    this.itemAdder = new ToolbarItemAdder(editorUi, container);
  }

  /**
   * Adds a label to the toolbar.
   */
  addMenu(label, tooltip, showLabels, name, c?, showAll?, ignoreState?) {
    var menu = this.editorUi.menus.get(name);
    var elt: any = this.addMenuFunction(
      label,
      tooltip,
      showLabels,
      function () {
        menu.funct.apply(menu, arguments);
      },
      c,
      showAll,
    );

    if (!ignoreState) {
      menu.addListener("stateChanged", function () {
        elt.setEnabled(menu.enabled);
      });
    }

    return elt;
  }

  addItems(keys, c?, ignoreDisabled?) {
    this.itemAdder.addItems(keys, c, ignoreDisabled);
  }

  /**
   * Adds a label to the toolbar.
   */
  addMenuFunction(label, tooltip, showLabels, funct, c?, showAll?) {
    return this.addMenuFunctionInContainer(
      c != null ? c : this.container,
      label,
      tooltip,
      showLabels,
      funct,
      showAll,
    );
  }

  /**
   * Adds a label to the toolbar.
   */
  addMenuFunctionInContainer(
    container,
    label,
    tooltip,
    showLabels,
    funct,
    showAll,
  ) {
    var elt = showLabels ? this.createLabel(label) : this.createButton(label);
    this.initElement(elt, tooltip);
    this.addMenuHandler(elt, showLabels, funct, showAll);
    container.appendChild(elt);

    return elt;
  }

  /**
   * Adds a separator to the separator.
   */
  addSeparator(c?) {
    c = c != null ? c : this.container;
    var elt = document.createElement("div");
    elt.className = "geSeparator";
    c.appendChild(elt);

    return elt;
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  addMenuHandler(elt, showLabels, funct, showAll) {
    if (funct != null) {
      var graph = this.editorUi.editor.graph;
      var menu: any;
      var show = true;

      mxEvent.addListener(elt, "click", (evt) => {
        if (show && (elt.enabled == null || elt.enabled)) {
          graph.popupMenuHandler.hideMenu();
          menu = new mxPopupMenu(funct);
          menu.div.className += " geToolbarMenu";
          menu.showDisabled = showAll;
          menu.labels = showLabels;
          menu.autoExpand = true;

          var offset = mxUtils.getOffset(elt);
          menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
          this.editorUi.setCurrentMenu(menu, elt);

          // Workaround for scrollbar hiding menu items
          if (!showLabels && menu.div.scrollHeight > menu.div.clientHeight) {
            menu.div.style.width = "40px";
          }

          menu.hideMenu = () => {
            mxPopupMenu.prototype.hideMenu.apply(menu, []);
            this.editorUi.resetCurrentMenu();
            menu.destroy();
          };

          // Extends destroy to reset global state
          menu.addListener(mxEvent.HIDE, () => {
            this.currentElt = null;
          });
        }

        show = true;
        mxEvent.consume(evt);
      });

      // Hides menu if already showing and prevents focus
      mxEvent.addListener(
        elt,
        mxClient.IS_POINTER ? "pointerdown" : "mousedown",
        (evt) => {
          show = this.currentElt != elt;
          evt.preventDefault();
        },
      );
    }
  }
}
