import { storiesOf } from "@storybook/react";
// import { withInfo } from "@storybook/addon-info";
import * as React from "react";
import { Menus } from "@mxgraph-app/menus";
import { editorUi } from "./mocks";

storiesOf("@mxgraph-app/menus/1. Menus", module).add("menus", () => {
  const menus = new Menus(editorUi);
  return <div>Nothing here</div>;
});
