import { MenuItemAdder } from "@mxgraph-app/menus";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class Center extends MenuItemAdder {
  align = {
    name: "center",
    direction: mxConstants.ALIGN_CENTER,
  };
}
