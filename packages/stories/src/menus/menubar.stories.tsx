import { storiesOf } from "@storybook/react";
// import { withInfo } from "@storybook/addon-info";
import React, {
  // createRef,
  useRef,
} from "react";
import { Menubar } from "@mxgraph-app/menus";
import { editorUi } from "./mocks";

storiesOf("@mxgraph-app/menus/Menubar", module).add("menubar", () => {
  const container = useRef(null);
  const menubar = new Menubar(editorUi, container);
  menubar.addMenu("x", () => {});
  // menubar.addMenuHandler(container, () => {});

  return <div ref={container}></div>;
});
