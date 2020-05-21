import { DirectionItem } from "./DirectionItem";
import mx from "@mxgraph-app/mx";
const { mxConstants } = mx;

export class FlipV extends DirectionItem {
  flip = {
    name: "flipV",
    direction: mxConstants.STYLE_FLIPV,
  };
}
