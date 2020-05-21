import { MenuItemAdder } from "../../MenuItemAdder";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class LeftAlign extends MenuItemAdder {
  align = {
    name: "leftAlign",
    direction: mxConstants.ALIGN_LEFT,
  };
}
