import mx from "@mxgraph-app/mx";
import { Base } from "./Base";
import { DropdownArrow } from "./DropDownArrow";
import { defaults } from "@mxgraph-app/menus";
import { FontManager } from "./FontManager";
const {
  mxPopupMenu,
  mxUtils,
  mxEvent,
  mxClient,
} = mx;

export class ToolbarMenuAdder extends Base {
  itemAdder: any;
  dropdownImageHtml: any;
  currentElt: any;
  compactUi: any; // EditorUI.compactUi
  font = defaults.font;
  dropdownArrow: any;
  fontManager: any;

  constructor(editorUi, container) {
    super(editorUi, container);
    this.dropdownArrow = new DropdownArrow(this.editorUi, this.container);
    this.fontManager = new FontManager(editorUi, container);
  }

  setFontName(value) {
    this.fontManager.setFontName(value);
  }

  setFontSize(value) {
    this.fontManager.setFontSize(value);
  }

  /**
   * Initializes the given toolbar element.
   */
  initElement(elt, tooltip) {
    // Adds tooltip
    if (tooltip != null) {
      elt.setAttribute("title", tooltip);
    }

    this.addEnabledState(elt);
  }

  /**
   * Adds given action item
   */
  addItems(keys, c?, ignoreDisabled?) {
    var items: any[] = [];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key == "-") {
        items.push(this.addSeparator(c));
      } else {
        items.push(
          this.addItem("geSprite-" + key.toLowerCase(), key, c, ignoreDisabled),
        );
      }
    }

    return items;
  }

  /**
   * Adds given action item
   */
  addItem(sprite, key, c, ignoreDisabled) {
    var action = this.editorUi.actions.get(key);
    var elt: any;

    if (action != null) {
      var tooltip = action.label;

      if (action.shortcut != null) {
        tooltip += " (" + action.shortcut + ")";
      }

      elt = this.addButton(sprite, tooltip, action.funct, c);

      if (!ignoreDisabled) {
        elt.setEnabled(action.enabled);

        action.addListener("stateChanged", function () {
          elt.setEnabled(action.enabled);
        });
      }
    }

    return elt;
  }

  /**
   * Adds the toolbar elements.
   */
  addDropDownArrow(
    menu,
    sprite,
    width,
    atlasWidth,
    left,
    top,
    atlasDelta,
    atlasLeft,
  ) {
    this.dropdownArrow.add(
      menu,
      sprite,
      width,
      atlasWidth,
      left,
      top,
      atlasDelta,
      atlasLeft,
    );
  }

  /**
   * Adds enabled state with setter to DOM node (avoids JS wrapper).
   */
  addEnabledState(elt) {
    var classname = elt.className;

    elt.setEnabled = (value) => {
      elt.enabled = value;

      if (value) {
        elt.className = classname;
      } else {
        elt.className = classname + " mxDisabled";
      }
    };

    elt.setEnabled(true);
  }

  /**
   * Adds a button to the toolbar.
   */
  addButton(classname, tooltip, funct, c?) {
    var elt = this.createButton(classname);
    c = c != null ? c : this.container;

    this.initElement(elt, tooltip);
    this.addClickHandler(elt, funct);
    c.appendChild(elt);

    return elt;
  }

  /**
   * Adds enabled state with setter to DOM node (avoids JS wrapper).
   */
  addClickHandler(elt, funct) {
    if (funct != null) {
      mxEvent.addListener(elt, "click", function (evt) {
        if (elt.enabled) {
          funct(evt);
        }

        mxEvent.consume(evt);
      });

      // Prevents focus
      mxEvent.addListener(
        elt,
        mxClient.IS_POINTER ? "pointerdown" : "mousedown",
        (evt) => {
          evt.preventDefault();
        },
      );
    }
  }

  /**
   * Creates and returns a new button.
   */
  createButton(classname) {
    var elt = document.createElement("a");
    elt.className = "geButton";

    var inner = document.createElement("div");

    if (classname != null) {
      inner.className = "geSprite " + classname;
    }

    elt.appendChild(inner);

    return elt;
  }

  /**
   * Creates and returns a new button.
   */
  createLabel(label, _tooltip?) {
    var elt = document.createElement("a");
    elt.className = "geLabel";
    mxUtils.write(elt, label);

    return elt;
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
