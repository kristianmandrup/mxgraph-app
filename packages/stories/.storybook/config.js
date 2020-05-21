import "storybook-chromatic";
import { addParameters, configure } from "@storybook/react";

addParameters({
  options: {
    name: "@mxgraph-app/mxgraph-app",
    url: "https://github.com/kristianmandrup/mxgraph-app",
    hierarchySeparator: "/",
    showAddonPanel: false,
  },
});

// Automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
