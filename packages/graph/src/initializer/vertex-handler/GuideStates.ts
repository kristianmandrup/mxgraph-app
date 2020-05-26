import mx from "@mxgraph-app/mx";
const { mxRectangle } = mx;

export class GuideStates {
  graphHandler: any;
  graph: any;

  config() {
    // Adds page centers to the guides for moving cells
    var graphHandlerGetGuideStates = this.graphHandler.getGuideStates;
    this.graphHandler.getGuideStates = () => {
      var result = graphHandlerGetGuideStates.apply(this, arguments);

      // Create virtual cell state for page centers
      if (this.graph.pageVisible) {
        var guides: any[] = [];

        var pf = this.graph.pageFormat;
        var ps = this.graph.pageScale;
        var pw = pf.width * ps;
        var ph = pf.height * ps;
        var t = this.graph.view.translate;
        var s = this.graph.view.scale;

        var layout = this.graph.getPageLayout();

        for (var i = 0; i < layout.width; i++) {
          guides.push(
            new mxRectangle(
              ((layout.x + i) * pw + t.x) * s,
              (layout.y * ph + t.y) * s,
              pw * s,
              ph * s
            )
          );
        }

        for (var j = 1; j < layout.height; j++) {
          guides.push(
            new mxRectangle(
              (layout.x * pw + t.x) * s,
              ((layout.y + j) * ph + t.y) * s,
              pw * s,
              ph * s
            )
          );
        }

        // Page center guides have precedence over normal guides
        result = guides.concat(result);
      }

      return result;
    };
  }
}
