import { AlignItem } from "./AlignItem";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class TopAlign extends AlignItem {
  align = {
    name: "topAlign",
    direction: mxConstants.ALIGN_TOP,
  };
}
