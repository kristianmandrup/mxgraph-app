import { Base } from "./Base";

export class ToolbarItemAdder extends Base {
  constructor(editorUi, container) {
    super(editorUi, container);
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
}
