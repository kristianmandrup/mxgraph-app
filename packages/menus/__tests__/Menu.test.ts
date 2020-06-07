import { MenuManager } from "../src";
import // getByLabelText,
// getByText,
// getByTestId,
// queryByTestId,
// Tip: all queries are also exposed on an object
// called "queries" which you could import here as well
// waitFor,
"@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom/extend-expect";

test("examples of some things", async () => {
  const menuElem = document.createElement("menu");
  const menus = {};
  const menu = new MenuManager({}, menus);
  menu.init();
  menu.addMenu("x", undefined, menuElem);
  // jest snapshots work great with regular DOM nodes!
  expect(menuElem).toMatchSnapshot();
});
