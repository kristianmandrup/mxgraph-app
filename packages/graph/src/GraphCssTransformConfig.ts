import mx from "@mxgraph-app/mx";
const {
  mxGraph,
  mxCellHighlight,
  mxUtils,
  mxConstants,
  mxGraphView,
  mxClient,
  mxRectangle,
  mxPoint,
} = mx;
import resources from "@mxgraph-app/resources";
const { urlParams } = resources;

/**
 * Implements zoom and offset via CSS transforms. This is currently only used
 * in read-only as there are fewer issues with the mxCellState not being scaled
 * and translated.
 *
 * KNOWN ISSUES TO FIX:
 * - Apply CSS transforms to HTML labels in IE11
 */
export class GraphCssTransformConfig {
  graph: any;
  dialect: any;
  lightbox: any;
  getCurrentRoot: any; // () => void
  // getModel: any; // () => void
  // model: any;
  isCellVisible: any; // (cell) => boolean
  view: any;
  intersects: any; // (state, x, y) => any
  isSwimlane: any; // (cell) => boolean
  isCellCollapsed: any; // (cell) => boolean
  getCurrentCellStyle: any; // (cell) => any
  strokeWidth: any;
  graphBounds: any;

  getModel() {
    return this.graph.getModel();
  }

  get model() {
    return this.graph.model;
  }

  /**
   * Uses CSS transforms for scale and translate.
   */
  useCssTransforms = false;

  /**
   * Contains the scale.
   */
  currentScale = 1;

  /**
   * Contains the offset.
   */
  currentTranslate = new mxPoint(0, 0);

  /**
   * Returns true if fast zoom preview should be used.
   */
  isFastZoomEnabled() {
    return (
      urlParams["zoom"] != "nocss" &&
      !mxClient.NO_FO &&
      !mxClient.IS_EDGE &&
      !this.useCssTransforms &&
      this.isCssTransformsSupported()
    );
  }

  /**
   * Only foreignObject supported for now (no IE11). Safari disabled as it ignores
   * overflow visible on foreignObject in negative space (lightbox and viewer).
   */

  isCssTransformsSupported() {
    return (
      this.dialect == mxConstants.DIALECT_SVG &&
      !mxClient.NO_FO &&
      (!this.lightbox || !mxClient.IS_SF)
    );
  }

  /**
   * Function: getCellAt
   *
   * Needs to modify original method for recursive call.
   */

  getCellAt(x, y, parent, vertices, edges, ignoreFn) {
    if (this.useCssTransforms) {
      x = x / this.currentScale - this.currentTranslate.x;
      y = y / this.currentScale - this.currentTranslate.y;
    }

    return this.getScaledCellAt.apply(this, [
      x,
      y,
      parent,
      vertices,
      edges,
      ignoreFn,
    ]);
  }

  /**
   * Function: getScaledCellAt
   *
   * Overridden for recursion.
   */

  getScaledCellAt(x, y, parent, vertices, edges, ignoreFn) {
    vertices = vertices != null ? vertices : true;
    edges = edges != null ? edges : true;

    if (parent == null) {
      parent = this.getCurrentRoot();

      if (parent == null) {
        parent = this.getModel().getRoot();
      }
    }

    if (parent != null) {
      var childCount = this.model.getChildCount(parent);

      for (var i = childCount - 1; i >= 0; i--) {
        var cell = this.model.getChildAt(parent, i);
        var result = this.getScaledCellAt(
          x,
          y,
          cell,
          vertices,
          edges,
          ignoreFn
        );

        if (result != null) {
          return result;
        } else if (
          this.isCellVisible(cell) &&
          ((edges && this.model.isEdge(cell)) ||
            (vertices && this.model.isVertex(cell)))
        ) {
          var state = this.view.getState(cell);

          if (
            state != null &&
            (ignoreFn == null || !ignoreFn(state, x, y)) &&
            this.intersects(state, x, y)
          ) {
            return cell;
          }
        }
      }
    }

    return null;
  }
  /**
   * Returns if the child cells of the given vertex cell state should be resized.
   */

  isRecursiveVertexResize(state) {
    return (
      !this.isSwimlane(state.cell) &&
      this.model.getChildCount(state.cell) > 0 &&
      !this.isCellCollapsed(state.cell) &&
      mxUtils.getValue(state.style, "recursiveResize", "1") == "1" &&
      mxUtils.getValue(state.style, "childLayout", null) == null
    );
  }

  /**
   * Returns the first parent that is not a part.
   */
  isPart(cell) {
    return !this.model.isVertex(cell)
      ? false
      : mxUtils.getValue(this.getCurrentCellStyle(cell), "part", "0") == "1";
  }
  /**
   * Returns the first parent that is not a part.
   */

  getCompositeParent(cell) {
    while (this.isPart(cell)) {
      cell = this.model.getParent(cell);
    }

    return cell;
  }

  /**
   * Function: repaint
   *
   * Updates the highlight after a change of the model or view.
   */
  setStrokeWidthFn() {
    mxCellHighlight.prototype.getStrokeWidth(state);
    {
      var s = this.strokeWidth;

      if (this.graph.useCssTransforms) {
        s /= this.graph.currentScale;
      }

      return s;
    }
  }

  /**
   * Function: getGraphBounds
   *
   * Overrides getGraphBounds to use bounding box from SVG.
   */
  setGraphBoundsFn() {
    mxGraphView.prototype.getGraphBounds();
    {
      var b = this.graphBounds;

      if (this.graph.useCssTransforms) {
        var t = this.graph.currentTranslate;
        var s = this.graph.currentScale;

        b = new mxRectangle(
          (b.x + t.x) * s,
          (b.y + t.y) * s,
          b.width * s,
          b.height * s
        );
      }

      return b;
    }
  }

  /**
   * Function: viewStateChanged
   *
   * Overrides to bypass full cell tree validation.
   * TODO: Check if this improves performance
   */
  setStateViewChanged() {
    const proto = mxGraphView.prototype;
    mxGraphView.prototype["viewStateChanged"] = () => {
      if (this.graph.useCssTransforms) {
        proto.validate();
        this.graph.sizeDidChange();
      } else {
        proto.revalidate();
        this.graph.sizeDidChange();
      }
    };
  }

  /**
   * Function: validate
   *
   * Overrides validate to normalize validation view state and pass
   * current state to CSS transform.
   */
  setValidate() {
    var graphViewValidate = mxGraphView.prototype.validate;
    const proto = mxGraphView.prototype;

    mxGraphView.prototype.validate = (cell) => {
      const { scale, translate } = proto;
      if (this.graph.useCssTransforms) {
        this.graph.currentScale = scale;
        this.graph.currentTranslate.x = translate.x;
        this.graph.currentTranslate.y = translate.y;

        proto.scale = 1;
        proto.translate.x = 0;
        proto.translate.y = 0;
      }

      graphViewValidate.apply(this, [cell]);

      if (this.graph.useCssTransforms) {
        this.graph.updateCssTransform();

        proto.scale = this.graph.currentScale;
        proto.translate.x = this.graph.currentTranslate.x;
        proto.translate.y = this.graph.currentTranslate.y;
      }
    };
  }

  /**
   * Function: updateCssTransform
   *
   * Zooms out of the graph by <zoomFactor>.
   */

  updateCssTransform() {
    var temp = this.view.getDrawPane();

    if (temp != null) {
      var g = temp.parentNode;

      if (!this.useCssTransforms) {
        g.removeAttribute("transformOrigin");
        g.removeAttribute("transform");
      } else {
        var prev = g.getAttribute("transform");
        g.setAttribute("transformOrigin", "0 0");
        var s = Math.round(this.currentScale * 100) / 100;
        var dx = Math.round(this.currentTranslate.x * 100) / 100;
        var dy = Math.round(this.currentTranslate.y * 100) / 100;
        g.setAttribute(
          "transform",
          "scale(" + s + "," + s + ")" + "translate(" + dx + "," + dy + ")"
        );

        // Applies workarounds only if translate has changed
        if (prev != g.getAttribute("transform")) {
          try {
            // Applies transform to labels outside of the SVG DOM
            // Excluded via isCssTransformsSupported
            //					if (mxClient.NO_FO)
            //					{
            //						var transform = 'scale(' + this.currentScale + ')' + 'translate(' +
            //							this.currentTranslate.x + 'px,' + this.currentTranslate.y + 'px)';
            //
            //						this.view.states.visit(mxUtils.bind(this, function(cell, state)
            //						{
            //							if (state.text != null && state.text.node != null)
            //							{
            //								// Stores initial CSS transform that is used for the label alignment
            //								if (state.text.originalTransform == null)
            //								{
            //									state.text.originalTransform = state.text.node.style.transform;
            //								}
            //
            //								state.text.node.style.transform = transform + state.text.originalTransform;
            //							}
            //						}));
            //					}
            // Workaround for https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4320441/
            if (mxClient.IS_EDGE) {
              // Recommended workaround is to do this on all
              // foreignObjects, but this seems to be faster
              var val = g.style.display;
              g.style.display = "none";
              g.getBBox();
              g.style.display = val;
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }

  setValidateBackgroundPage() {
    var graphViewValidateBackgroundPage =
      mxGraphView.prototype.validateBackgroundPage;
    const proto = mxGraphView.prototype;
    mxGraphView.prototype.validateBackgroundPage = () => {
      var useCssTranforms = this.graph.useCssTransforms,
        scale = proto.scale,
        translate = proto.translate;

      if (useCssTranforms) {
        proto.scale = this.graph.currentScale;
        proto.translate = this.graph.currentTranslate;
      }

      graphViewValidateBackgroundPage.apply(this, []);

      if (useCssTranforms) {
        proto.scale = scale;
        proto.translate = translate;
      }
    };
  }

  setUpdatePageBreaks() {
    var graphUpdatePageBreaks = mxGraph.prototype.updatePageBreaks;

    mxGraph.prototype.updatePageBreaks = (visible, width, height) => {
      var useCssTranforms = this.useCssTransforms,
        scale = this.view.scale,
        translate = this.view.translate;

      if (useCssTranforms) {
        this.view.scale = 1;
        this.view.translate = new mxPoint(0, 0);
        this.useCssTransforms = false;
      }

      graphUpdatePageBreaks.apply(this, [visible, width, height]);

      if (useCssTranforms) {
        this.view.scale = scale;
        this.view.translate = translate;
        this.useCssTransforms = true;
      }
    };
  }
}
