import mx from "@mxgraph-app/mx";
const { mxConstants, mxGraphView, mxEventObject } = mx;

//Units
export class Units {
  static configure() {
    const proto = mxGraphView.prototype;
    proto["unit"] = mxConstants["POINTS"];
    proto["setUnit"] = function (unit) {
      if (this["unit"] != unit) {
        this["unit"] = unit;
        this.fireEvent(new mxEventObject("unitChanged", "unit", unit));
      }
    };
  }
}
