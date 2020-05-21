import { MenuItemAdder } from "@mxgraph-app/menus";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class Middle extends MenuItemAdder {
  align = {
    name: "middle",
    direction: mxConstants.ALIGN_MIDDLE,
  };
}
