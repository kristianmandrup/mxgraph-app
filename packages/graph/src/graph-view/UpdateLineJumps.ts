import mx from "@mxgraph-app/mx";
const { mxGraphView, mxPoint, mxUtils } = mx;

export class UpdateLineJumps {
  actual: any;
  scale: any;
  validEdges: any;

  setUpdateLineJumps() {
    /**
     * Updates the jumps between given state and processed edges.
     */
    const proto: any = mxGraphView.prototype;
    const { updateLineJumps } = this;
    proto.updateLineJumps = updateLineJumps;
  }

  updateLineJumps = (state) => {
    const proto: any = mxGraphView.prototype;
    const { addPoint, actual } = this;
    const { lineJumpsEnabled, validEdges, scale } = proto;
    var pts = state.absolutePoints;

    if (!lineJumpsEnabled) {
      return false;
    }
    let changed = !!state.routedPoints;
    if (
      pts != null &&
      validEdges != null &&
      mxUtils.getValue(state.style, "jumpStyle", "none") !== "none"
    ) {
      var thresh = 0.5 * scale;
      changed = false;
      this.actual = [];

      for (var i = 0; i < pts.length - 1; i++) {
        var p1 = pts[i + 1];
        var p0 = pts[i];
        var list: any[] = [];

        // Ignores waypoints on straight segments
        var pn = pts[i + 2];

        while (
          i < pts.length - 2 &&
          mxUtils.ptSegDistSq(p0.x, p0.y, pn.x, pn.y, p1.x, p1.y) <
            1 * this.scale * this.scale
        ) {
          p1 = pn;
          i++;
          pn = pts[i + 2];
        }

        changed = addPoint(0, p0.x, p0.y) || changed;

        // Processes all previous edges
        for (var e = 0; e < this.validEdges.length; e++) {
          var state2 = this.validEdges[e];
          var pts2 = state2.absolutePoints;

          if (
            pts2 != null &&
            mxUtils.intersects(state, state2) &&
            state2.style["noJump"] != "1"
          ) {
            // Compares each segment of the edge with the current segment
            for (var j = 0; j < pts2.length - 1; j++) {
              var p3 = pts2[j + 1];
              var p2 = pts2[j];

              // Ignores waypoints on straight segments
              pn = pts2[j + 2];

              while (
                j < pts2.length - 2 &&
                mxUtils.ptSegDistSq(p2.x, p2.y, pn.x, pn.y, p3.x, p3.y) <
                  1 * this.scale * this.scale
              ) {
                p3 = pn;
                j++;
                pn = pts2[j + 2];
              }

              var pt = mxUtils.intersection(
                p0.x,
                p0.y,
                p1.x,
                p1.y,
                p2.x,
                p2.y,
                p3.x,
                p3.y
              );

              // Handles intersection between two segments
              if (
                pt != null &&
                (Math.abs(pt.x - p0.x) > thresh ||
                  Math.abs(pt.y - p0.y) > thresh) &&
                (Math.abs(pt.x - p1.x) > thresh ||
                  Math.abs(pt.y - p1.y) > thresh) &&
                (Math.abs(pt.x - p2.x) > thresh ||
                  Math.abs(pt.y - p2.y) > thresh) &&
                (Math.abs(pt.x - p3.x) > thresh ||
                  Math.abs(pt.y - p3.y) > thresh)
              ) {
                var dx = pt.x - p0.x;
                var dy = pt.y - p0.y;
                var temp: any = {
                  distSq: dx * dx + dy * dy,
                  x: pt.x,
                  y: pt.y,
                };

                // Intersections must be ordered by distance from start of segment
                for (var t = 0; t < list.length; t++) {
                  if (list[t].distSq > temp.distSq) {
                    list.splice(t, 0, temp);
                    temp = null;
                    break;
                  }
                }

                // Ignores multiple intersections at segment joint
                if (
                  temp != null &&
                  (list.length == 0 ||
                    list[list.length - 1].x !== temp.x ||
                    list[list.length - 1].y !== temp.y)
                ) {
                  list.push(temp);
                }
              }
            }
          }
        }

        // Adds ordered intersections to routed points
        for (var j = 0; j < list.length; j++) {
          changed = addPoint(1, list[j].x, list[j].y) || changed;
        }
      }

      var pt = pts[pts.length - 1];
      changed = addPoint(0, pt.x, pt.y) || changed;
    }

    state.routedPoints = actual;

    return changed;
  };

  // Type 0 means normal waypoint, 1 means jump
  addPoint(type, x, y) {
    const { actual } = this;
    var rpt: any = new mxPoint(x, y);
    rpt.type = type;

    actual.push(rpt);
    var curr =
      state.routedPoints != null ? state.routedPoints[actual.length - 1] : null;

    return curr == null || curr.type != type || curr.x != x || curr.y != y;
  }
}
