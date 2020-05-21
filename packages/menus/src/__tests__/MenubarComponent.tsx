import { Menubar } from "../menubar/Menubar";
import React, {
  // createRef,
  useRef,
} from "react";

const editorUi: any = {};

export const MenubarComponent = () => {
  const container = useRef(null);
  const menubar = new Menubar(editorUi, container);
  menubar.addMenu("x", () => {});
  // menubar.addMenuHandler(container, () => {});

  return <div ref={container}></div>;
};
