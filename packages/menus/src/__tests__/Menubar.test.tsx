import { MenubarComponent } from "./MenubarComponent";
import renderer from "react-test-renderer";

describe("Menubar", () => {
  const component = renderer.create(<MenubarComponent></MenubarComponent>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
