import mx from 'mx'
import pako from 'pako'
import { Graph } from './Graph'
const {
  mxPoint,
  mxShape,
  mxConnector,
  mxStencil,
  mxConstants,
  mxUtils,
  mxGraphView,
  mxCellRenderer,
} = mx

export class GraphConfiguration {
  // graph: any

  configure() {
    this.setResetValidationState()
    this.setValidateCellState()
  }
  /**
   * Reset the list of processed edges.
   */
  setResetValidationState() {
    var mxGraphViewResetValidationState = mxGraphView.prototype.resetValidationState
    let proto = mxGraphView.prototype
    mxGraphView.prototype.resetValidationState = () => {
      mxGraphViewResetValidationState.apply(this, [])

      proto['validEdges'] = []
    }
  }

  setValidateCellState() {
    /**
     * Updates jumps for valid edges and repaints if needed.
     */
    var mxGraphViewValidateCellState = mxGraphView.prototype.validateCellState
    const proto = mxGraphView.prototype
    mxGraphView.prototype.validateCellState = (cell, recurse) => {
      recurse = recurse != null ? recurse : true
      var state = proto.getState(cell)

      const { graph } = proto

      // Forces repaint if jumps change on a valid edge
      if (
        state != null &&
        recurse &&
        graph.model.isEdge(state.cell) &&
        state.style != null &&
        state.style[mxConstants.STYLE_CURVED] != 1 &&
        !state.invalid &&
        proto['updateLineJumps'](state)
      ) {
        graph.cellRenderer.redraw(state, false, proto.isRendering())
      }

      state = mxGraphViewValidateCellState.apply(this, [cell, recurse])

      // Adds to the list of edges that may intersect with later edges
      if (
        state != null &&
        recurse &&
        graph.model.isEdge(state.cell) &&
        state.style != null &&
        state.style[mxConstants.STYLE_CURVED] != 1
      ) {
        // LATER: Reuse jumps for valid edges
        this['validEdges'].push(state)
      }

      return state
    }
  }

  /**
   * Forces repaint if routed points have changed.
   */
  setIsShapeInvalid() {
    var mxCellRendererIsShapeInvalid = mxCellRenderer.prototype.isShapeInvalid

    mxCellRenderer.prototype.isShapeInvalid = (state, shape) => {
      return (
        mxCellRendererIsShapeInvalid.apply(this, [state, shape]) ||
        (state.routedPoints != null &&
          shape.routedPoints != null &&
          !mxUtils.equalPoints(shape.routedPoints, state.routedPoints))
      )
    }
  }

  /**
   * Updates jumps for invalid edges.
   */
  setUpdateCellState() {
    var mxGraphViewUpdateCellState = mxGraphView.prototype.updateCellState
    const proto = mxGraphView.prototype
    mxGraphView.prototype.updateCellState = (state) => {
      mxGraphViewUpdateCellState.apply(this, [state])
      const { graph } = proto

      // Updates jumps on invalid edge before repaint
      if (graph.model.isEdge(state.cell) && state.style[mxConstants.STYLE_CURVED] != 1) {
        this['updateLineJumps'](state)
      }
    }
  }

  /**
   * Overrides painting the actual shape for taking into account jump style.
   */
  setPaintLine() {
    var mxConnectorPaintLine = mxConnector.prototype.paintLine
    const proto = mxConnector.prototype
    const { state, style, strokewidth, scale } = proto
    mxConnector.prototype.paintLine = (c, absPts, rounded) => {
      const stRp = state['routedPoints']
      // Required for checking dirty state
      proto['routedPoints'] = state ? stRp : null

      if (proto.outline || state == null || style == null || stRp == null || stRp.length == 0) {
        mxConnectorPaintLine.apply(this, [c, absPts, rounded])
      } else {
        var arcSize =
          mxUtils.getValue(style, mxConstants.STYLE_ARCSIZE, mxConstants.LINE_ARCSIZE) / 2
        var size =
          (parseInt(mxUtils.getValue(style, 'jumpSize', Graph.defaultJumpSize)) - 2) / 2 +
          strokewidth
        var style = mxUtils.getValue(style, 'jumpStyle', 'none')
        var moveTo: any
        var last: any
        var len: any
        var pts: any[] = []
        var n: any
        c.begin()

        for (var i = 0; i < stRp.length; i++) {
          var rpt = stRp[i]
          var pt = new mxPoint(rpt.x / scale, rpt.y / scale)

          // Takes first and last point from passed-in array
          if (i == 0) {
            pt = absPts[0]
          } else if (i == stRp.length - 1) {
            pt = absPts[absPts.length - 1]
          }

          var done = false

          // Type 1 is an intersection
          if (last != null && rpt.type == 1) {
            // Checks if next/previous points are too close
            var next = stRp[i + 1]
            var dx = next.x / scale - pt.x
            var dy = next.y / scale - pt.y
            var dist = dx * dx + dy * dy

            if (n == null) {
              n = new mxPoint(pt.x - last.x, pt.y - last.y)
              len = Math.sqrt(n.x * n.x + n.y * n.y)

              if (len > 0) {
                n.x = (n.x * size) / len
                n.y = (n.y * size) / len
              } else {
                n = null
              }
            }

            if (dist > size * size && len > 0) {
              var dx = last.x - pt.x
              var dy = last.y - pt.y
              var dist = dx * dx + dy * dy

              if (dist > size * size) {
                var p0 = new mxPoint(pt.x - n.x, pt.y - n.y)
                var p1 = new mxPoint(pt.x + n.x, pt.y + n.y)
                pts.push(p0)

                proto.addPoints(c, pts, rounded, arcSize, false, null, moveTo)

                var f =
                  Math.round(n.x) < 0 || (Math.round(n.x) == 0 && Math.round(n.y) <= 0) ? 1 : -1
                moveTo = false

                if (style == 'sharp') {
                  c.lineTo(p0.x - n.y * f, p0.y + n.x * f)
                  c.lineTo(p1.x - n.y * f, p1.y + n.x * f)
                  c.lineTo(p1.x, p1.y)
                } else if (style == 'arc') {
                  f *= 1.3
                  c.curveTo(
                    p0.x - n.y * f,
                    p0.y + n.x * f,
                    p1.x - n.y * f,
                    p1.y + n.x * f,
                    p1.x,
                    p1.y
                  )
                } else {
                  c.moveTo(p1.x, p1.y)
                  moveTo = true
                }

                pts = [p1]
                done = true
              }
            }
          } else {
            n = null
          }

          if (!done) {
            pts.push(pt)
            last = pt
          }
        }

        proto.addPoints(c, pts, rounded, arcSize, false, null, moveTo)
        c.stroke()
      }
    }
  }
  /**
   * Adds support for snapToPoint style.
   */
  setUpdateFloatingTerminalPoint() {
    var mxGraphViewUpdateFloatingTerminalPoint = mxGraphView.prototype.updateFloatingTerminalPoint
    const proto = mxGraphView.prototype
    mxGraphView.prototype.updateFloatingTerminalPoint = (edge, start, end, source) => {
      if (
        start != null &&
        edge != null &&
        (start.style['snapToPoint'] == '1' || edge.style['snapToPoint'] == '1')
      ) {
        start = proto.getTerminalPort(edge, start, source)
        var next = proto.getNextPoint(edge, end, source)

        var orth = proto.graph.isOrthogonal(edge)
        var alpha = mxUtils.toRadians(Number(start.style[mxConstants.STYLE_ROTATION] || '0'))
        var center = new mxPoint(start.getCenterX(), start.getCenterY())

        if (alpha != 0) {
          var cos = Math.cos(-alpha)
          var sin = Math.sin(-alpha)
          next = mxUtils.getRotatedPoint(next, cos, sin, center)
        }

        var border = parseFloat(edge.style[mxConstants.STYLE_PERIMETER_SPACING] || 0)
        border += parseFloat(
          edge.style[
            source
              ? mxConstants.STYLE_SOURCE_PERIMETER_SPACING
              : mxConstants.STYLE_TARGET_PERIMETER_SPACING
          ] || 0
        )
        var pt = proto.getPerimeterPoint(start, next, alpha == 0 && orth, border)

        if (alpha != 0) {
          var cos = Math.cos(alpha)
          var sin = Math.sin(alpha)
          pt = mxUtils.getRotatedPoint(pt, cos, sin, center)
        }

        edge.setAbsoluteTerminalPoint(
          proto['snapToAnchorPoint'](edge, start, end, source, pt),
          source
        )
      } else {
        mxGraphViewUpdateFloatingTerminalPoint.apply(this, [edge, start, end, source])
      }
    }
  }

  setSnapToAnchorPoint() {
    const proto = mxGraphView.prototype
    const { graph } = proto
    mxGraphView.prototype['snapToAnchorPoint'] = (edge, start, end, source, pt) => {
      if (start != null && edge != null) {
        var constraints = graph.getAllConnectionConstraints(start, null)
        var nearest: any
        var dist: any

        if (constraints != null) {
          for (var i = 0; i < constraints.length; i++) {
            var cp = graph.getConnectionPoint(start, constraints[i])

            if (cp != null) {
              var tmp = (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y)

              if (dist == null || tmp < dist) {
                nearest = cp
                dist = tmp
              }
            }
          }
        }

        if (nearest != null) {
          pt = nearest
        }
      }

      return pt
    }
  }

  /**
   * Adds support for placeholders in text elements of shapes.
   */
  setEvaluateTextAttribute() {
    var mxStencilEvaluateTextAttribute = mxStencil.prototype.evaluateTextAttribute

    mxStencil.prototype.evaluateTextAttribute = (node, attribute, shape) => {
      var result = mxStencilEvaluateTextAttribute.apply(this, [node, attribute, shape])
      var placeholders = node.getAttribute('placeholders')

      if (placeholders == '1' && shape.state != null) {
        result = shape.state.view.graph.replacePlaceholders(shape.state.cell, result)
      }

      return result
    }
  }

  /**
   * Adds custom stencils defined via shape=stencil(value) style. The value is a base64 encoded, compressed and
   * URL encoded XML definition of the shape according to the stencil definition language of mxstatic
   *
   * Needs to be in this file to make sure its part of the embed client code. Also the check for ZLib is
   * different than for the Editor code.
   */
  setCreateShape() {
    var mxCellRendererCreateShape = mxCellRenderer.prototype.createShape
    mxCellRenderer.prototype.createShape = (state) => {
      if (state.style != null && typeof pako !== 'undefined') {
        var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null)

        // Extracts and decodes stencil XML if shape has the form shape=stencil(value)
        if (shape != null && typeof shape === 'string' && shape.substring(0, 8) == 'stencil(') {
          try {
            var stencil = shape.substring(8, shape.length - 1)
            var doc = mxUtils.parseXml(Graph.decompress(stencil, null, null))

            return new mxShape(new mxStencil(doc.documentElement))
          } catch (e) {
            if (window.console != null) {
              console.log('Error in shape: ' + e)
            }
          }
        }
      }

      return mxCellRendererCreateShape.apply(this, [state])
    }
  }
}
