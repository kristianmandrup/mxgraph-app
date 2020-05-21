import { AlignItem } from "./AlignItem";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class BottomAlign extends AlignItem {
  align = {
    name: "bottomAlign",
    direction: mxConstants.ALIGN_BOTTOM,
  };
}
