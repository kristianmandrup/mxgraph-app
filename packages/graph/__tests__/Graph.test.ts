import { Graph } from "../src";
// import // getByLabelText,
// getByText,
// getByTestId,
// queryByTestId,
// Tip: all queries are also exposed on an object
// called "queries" which you could import here as well
// waitFor,
// "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom/extend-expect";

test("examples of some things", async () => {
  const containerElem = document.createElement("graph");
  const model = {};
  const graph = new Graph(containerElem, model, {});
  const { container } = graph;
  // getByTestId and queryByTestId are an escape hatch to get elements
  // by a test id (could also attempt to get this element by its text)
  expect(container).toBe(containerElem);
  // jest snapshots work great with regular DOM nodes!
  expect(container).toMatchSnapshot();
});
