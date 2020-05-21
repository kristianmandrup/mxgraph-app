import { Menu } from "../../Menu";
import { MenuAdder } from "../MenuAdder";

export class FileMenu extends MenuAdder {
  add() {
    this.put(
      "file",
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          [
            "new",
            "open",
            "-",
            "save",
            "saveAs",
            "-",
            "import",
            "export",
            "-",
            "pageSetup",
            "print",
          ],
          parent
        );
      })
    );
  }
}
