import mx from "@mxgraph-app/mx";
const { mxShape } = mx;

export class Canvas2D {
  static configure() {
    // Hook for custom constraints
    mxShape.prototype["getConstraints"] = function () {
      return null;
    };
  }
}
