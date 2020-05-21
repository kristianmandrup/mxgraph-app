import { MenuAdder } from "@mxgraph-app/menus";
import { Center } from "./Center";
import { BottomAlign } from "./BottomAlign";
import { LeftAlign } from "./LeftAlign";
import { Middle } from "./Middle";
import { RightAlign } from "./RightAlign";
import { TopAlign } from "./TopAlign";

const menuItems = {
  bottomAlign: BottomAlign,
  center: Center,
  leftAlign: LeftAlign,
  middle: Middle,
  rightAlign: RightAlign,
  topAlign: TopAlign,
};

const defaults = {
  menuItems,
};

export class AlignMenu extends MenuAdder {
  menuItems: any = defaults.menuItems;
  menuName = "layout";

  itemLayout = [
    "leftAlign",
    "center",
    "rightAlign",
    "-",
    "topAlign",
    "middle",
    "bottomAlign",
  ];
}
