import { MenuAdder } from "../MenuAdder";
import { HorizontalFlowItem } from "./HorizontalFlowItem";
import { VerticalFlowItem } from "./VerticalFlowItem";
import { RadialTreeItem } from "./RadialTreeItem";
import { OrganicItem } from "./OrganicItem";
import { HorizontalTreeItem } from "./HorizontalTreeItem";
import { VerticalTreeItem } from "./VerticalTreeItem";

const menuItems = {
  horizontalFlow: HorizontalFlowItem,
  verticalFlow: VerticalFlowItem,
  horizontalTree: HorizontalTreeItem,
  verticalTree: VerticalTreeItem,
  radialTree: RadialTreeItem,
  organic: OrganicItem,
};

const defaults = {
  menuItems,
};

export class LayoutMenu extends MenuAdder {
  menuItems: any = defaults.menuItems;
  menuName = "layout";

  itemLayout = [
    "horizontalFlow",
    "verticalFlow",
    "-",
    "horizontalTree",
    "verticalTree",
    "radialTree",
    "-",
    "organic",
    "circle",
  ];
}
