// import { MenubarComponent } from "./MenubarComponent";
// import renderer from "react-test-renderer";
import { Menus } from "../Menus";
import { editorUi, menus } from "./mocks";

describe("Menus", () => {
  const create = () => new Menus(editorUi, menus);

  describe("init", () => {
    const menus = create();
    menus.init();
  });
});
