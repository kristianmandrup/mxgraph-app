// import { MenubarComponent } from "./MenubarComponent";
// import renderer from "react-test-renderer";
import { Menu } from "../Menu";

describe("Menu", () => {
  const create = (enabled) => new Menu(funct, false);
  const funct = () => {};
  const parent = {};

  describe("setEnabled", () => {
    const menu = create(false);
    menu.setEnabled(true);
  });

  describe("execute", () => {
    const menu = create(false);
    menu.execute(funct, parent);
  });
});
