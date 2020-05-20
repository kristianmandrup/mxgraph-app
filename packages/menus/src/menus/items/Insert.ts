import { MenuAdder } from "../MenuAdder";
import { Menu } from "../../Menu";

export class Insert extends MenuAdder {
  add() {
    this.put('insert', new Menu((menu, parent) =>{
      this.addMenuItems(menu, ['insertLink', 'insertImage'], parent);
    }));    
  }
}
