import { storiesOf } from "@storybook/react";
// import { withInfo } from "@storybook/addon-info";
import * as React from "react";
import { MenuPrompt } from "@mxgraph-app/menus";
import { editorUi } from "./mocks";

storiesOf("@mxgraph-app/menus/1. Prompt", module).add("prompt", () => {
  const menuPrompt = new MenuPrompt(editorUi);

  const menu = {};
  const label = "x";
  const hint = "x";
  const defaultValue = "x";
  const key = "x";
  const parent = {};
  menuPrompt.promptChange(menu, label, hint, defaultValue, key, parent);
  return <div>Nothing here</div>;
});
