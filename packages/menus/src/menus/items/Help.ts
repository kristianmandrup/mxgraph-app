import { MenuAdder } from "../MenuAdder";
import { Menu } from "../../Menu";

export class HelpMenu extends MenuAdder {
  add() {
    this.put("help", new Menu(this.menuFunct));
  }

  menuFunct = (menu, _parent) => {
    this.addMenuItems(menu, ["help", "-", "about"]);
  };
}
