import mx from "@mxgraph-app/mx";
import Base64 from "Base64";
const {
  mxCellMarker,
  mxConnectionHandler,
  mxPolyline,
  mxPopupMenu,
  mxPoint,
  mxRectangle,
  mxGraphHandler,
  mxGraph,
  mxRectangleShape,
  mxMouseEvent,
  mxConstants,
  mxGraphView,
  mxPopupMenuHandler,
  mxClient,
  mxEvent,
  mxUtils,
} = mx;

export class StaticOverrides {
  graph: any;
  backgroundPageShape: any;

  proto = {
    graphView: mxGraphView.prototype,
  };

  /**
   * Static overrides
   */
  setValidateBackgroundPage() {
    const proto: any = mxGraphView.prototype;
    // Uses HTML for background pages (to support grid background image)
    mxGraphView.prototype.validateBackgroundPage = () => {
      var graph = this.graph;
      if (graph.container != null && !graph.transparentBackground) {
        if (graph.pageVisible) {
          var bounds = proto.getBackgroundPageBounds();

          if (this.backgroundPageShape == null) {
            // Finds first element in graph container
            var firstChild = graph.container.firstChild;

            while (
              firstChild != null &&
              firstChild.nodeType != mxConstants.NODETYPE_ELEMENT
            ) {
              firstChild = firstChild.nextSibling;
            }

            if (firstChild != null) {
              this.backgroundPageShape = proto.createBackgroundPageShape(
                bounds
              );
              this.backgroundPageShape.scale = 1;

              // Shadow filter causes problems in outline window in quirks mode. IE8 standards
              // also has known rendering issues inside mxWindow but not using shadow is worse.
              this.backgroundPageShape.isShadow = !mxClient.IS_QUIRKS;
              this.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
              this.backgroundPageShape.init(graph.container);

              // Required for the browser to render the background page in correct order
              firstChild.style.position = "absolute";
              graph.container.insertBefore(
                this.backgroundPageShape.node,
                firstChild
              );
              this.backgroundPageShape.redraw();

              this.backgroundPageShape.node.className = "geBackgroundPage";

              // Adds listener for double click handling on background
              mxEvent.addListener(
                this.backgroundPageShape.node,
                "dblclick",
                (evt) => {
                  graph.dblClick(evt);
                }
              );

              // Adds basic listeners for graph event dispatching outside of the
              // container and finishing the handling of a single gesture
              mxEvent.addGestureListeners(
                this.backgroundPageShape.node,
                (evt) => {
                  graph.fireMouseEvent(
                    mxEvent.MOUSE_DOWN,
                    new mxMouseEvent(evt)
                  );
                },
                (evt) => {
                  // Hides the tooltip if mouse is outside container
                  if (
                    graph.tooltipHandler != null &&
                    graph.tooltipHandler.isHideOnHover()
                  ) {
                    graph.tooltipHandler.hide();
                  }

                  if (graph.isMouseDown && !mxEvent.isConsumed(evt)) {
                    graph.fireMouseEvent(
                      mxEvent.MOUSE_MOVE,
                      new mxMouseEvent(evt)
                    );
                  }
                },
                (evt) => {
                  graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
                }
              );
            }
          } else {
            this.backgroundPageShape.scale = 1;
            this.backgroundPageShape.bounds = bounds;
            this.backgroundPageShape.redraw();
          }
        } else if (this.backgroundPageShape != null) {
          this.backgroundPageShape.destroy();
          this.backgroundPageShape = null;
        }

        proto.validateBackgroundStyles();
      }
    };
  }

  setValidateBackgroundStyles() {
    // Updates the CSS of the background to draw the grid
    const proto: any = mxGraphView.prototype;
    proto.validateBackgroundStyles = () => {
      var graph = this.graph;
      var color =
        graph.background == null || graph.background == mxConstants.NONE
          ? graph.defaultPageBackgroundColor
          : graph.background;
      var gridColor =
        color != null && proto.gridColor != color.toLowerCase()
          ? proto.gridColor
          : "#ffffff";
      var image = "none";
      var position = "";

      if (graph.isGridEnabled()) {
        var phase = 10;

        if (mxClient.IS_SVG) {
          // Generates the SVG required for drawing the dynamic grid
          image = unescape(encodeURIComponent(proto.createSvgGrid(gridColor)));
          image = window.btoa ? btoa(image) : Base64.encode(image, true);
          image = "url(" + "data:image/svg+xml;base64," + image + ")";
          phase = graph.gridSize * proto.scale * proto.gridSteps;
        } else {
          // Fallback to grid wallpaper with fixed size
          image = "url(" + proto.gridImage + ")";
        }

        var x0 = 0;
        var y0 = 0;

        if (graph.view.backgroundPageShape != null) {
          var bds = proto.getBackgroundPageBounds();

          x0 = 1 + bds.x;
          y0 = 1 + bds.y;
        }

        // Computes the offset to maintain origin for grid
        position =
          -Math.round(
            phase - mxUtils.mod(proto.translate.x * proto.scale - x0, phase)
          ) +
          "px " +
          -Math.round(
            phase - mxUtils.mod(proto.translate.y * proto.scale - y0, phase)
          ) +
          "px";
      }

      var canvas = graph.view.canvas;

      if (canvas.ownerSVGElement != null) {
        canvas = canvas.ownerSVGElement;
      }

      if (graph.view.backgroundPageShape != null) {
        graph.view.backgroundPageShape.node.style.backgroundPosition = position;
        graph.view.backgroundPageShape.node.style.backgroundImage = image;
        graph.view.backgroundPageShape.node.style.backgroundColor = color;
        graph.container.className = "geDiagramContainer geDiagramBackdrop";
        canvas.style.backgroundImage = "none";
        canvas.style.backgroundColor = "";
      } else {
        graph.container.className = "geDiagramContainer";
        canvas.style.backgroundPosition = position;
        canvas.style.backgroundColor = color;
        canvas.style.backgroundImage = image;
      }
    };
  }

  setCreateSvgGrid() {
    // Returns the SVG required for painting the background grid.
    const proto: any = mxGraphView.prototype;
    proto.createSvgGrid = function (color) {
      var tmp = this.graph.gridSize * this.scale;

      while (tmp < this.minGridSize) {
        tmp *= 2;
      }

      var tmp2 = this.gridSteps * tmp;

      // Small grid lines
      var d = [];

      for (var i = 1; i < this.gridSteps; i++) {
        var tmp3 = i * tmp;
        const txt =
          "M 0 " +
          tmp3 +
          " L " +
          tmp2 +
          " " +
          tmp3 +
          " M " +
          tmp3 +
          " 0 L " +
          tmp3 +
          " " +
          tmp2;
        this.addToArr(d, txt);
      }

      // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
      // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
      var size = tmp2;
      var svg =
        '<svg width="' +
        size +
        '" height="' +
        size +
        '" xmlns="' +
        mxConstants.NS_SVG +
        '">' +
        '<defs><pattern id="grid" width="' +
        tmp2 +
        '" height="' +
        tmp2 +
        '" patternUnits="userSpaceOnUse">' +
        '<path d="' +
        d.join(" ") +
        '" fill="none" stroke="' +
        color +
        '" opacity="0.2" stroke-width="1"/>' +
        '<path d="M ' +
        tmp2 +
        " 0 L 0 0 0 " +
        tmp2 +
        '" fill="none" stroke="' +
        color +
        '" stroke-width="1"/>' +
        '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';

      return svg;
    };
  }

  addToArr(arr, item) {
    arr.push(item);
  }

  setPanGraph() {
    // Adds panning for the grid with no page view and disabled scrollbars
    const proto: any = mxGraph.prototype;
    var mxGraphPanGraph = proto.panGraph;
    proto.panGraph = (dx, dy) => {
      mxGraphPanGraph.apply(this, arguments);

      if (proto.shiftPreview1 != null) {
        var canvas = proto.view.canvas;

        if (proto.ownerSVGElement != null) {
          canvas = canvas.ownerSVGElement;
        }

        var phase = proto.gridSize * proto.view.scale * proto.view.gridSteps;
        var position =
          -Math.round(
            phase -
              mxUtils.mod(proto.view.translate.x * proto.view.scale + dx, phase)
          ) +
          "px " +
          -Math.round(
            phase -
              mxUtils.mod(proto.view.translate.y * proto.view.scale + dy, phase)
          ) +
          "px";
        canvas.style.backgroundPosition = position;
      }
    };
  }

  setUpdatePageBreaks() {
    // Draws page breaks only within the page
    const proto: any = mxGraph.prototype;
    proto.updatePageBreaks = (visible, width, height) => {
      var scale = proto.view.scale;
      var tr = proto.view.translate;
      var fmt = proto.pageFormat;
      var ps = scale * proto.pageScale;

      var bounds2 = proto.view.getBackgroundPageBounds();

      width = bounds2.width;
      height = bounds2.height;
      var bounds = new mxRectangle(
        scale * tr.x,
        scale * tr.y,
        fmt.width * ps,
        fmt.height * ps
      );

      // Does not show page breaks if the scale is too small
      visible =
        visible &&
        Math.min(bounds.width, bounds.height) > proto.minPageBreakDist;

      var horizontalCount = visible ? Math.ceil(height / bounds.height) - 1 : 0;
      var verticalCount = visible ? Math.ceil(width / bounds.width) - 1 : 0;
      var right = bounds2.x + width;
      var bottom = bounds2.y + height;

      if (proto.horizontalPageBreaks == null && horizontalCount > 0) {
        proto.horizontalPageBreaks = [];
      }

      if (proto.verticalPageBreaks == null && verticalCount > 0) {
        proto.verticalPageBreaks = [];
      }

      var drawPageBreaks = (breaks) => {
        if (breaks != null) {
          var count =
            breaks == proto.horizontalPageBreaks
              ? horizontalCount
              : verticalCount;

          for (var i = 0; i <= count; i++) {
            var pts =
              breaks == proto.horizontalPageBreaks
                ? [
                    new mxPoint(
                      Math.round(bounds2.x),
                      Math.round(bounds2.y + (i + 1) * bounds.height)
                    ),
                    new mxPoint(
                      Math.round(right),
                      Math.round(bounds2.y + (i + 1) * bounds.height)
                    ),
                  ]
                : [
                    new mxPoint(
                      Math.round(bounds2.x + (i + 1) * bounds.width),
                      Math.round(bounds2.y)
                    ),
                    new mxPoint(
                      Math.round(bounds2.x + (i + 1) * bounds.width),
                      Math.round(bottom)
                    ),
                  ];

            if (breaks[i] != null) {
              breaks[i].points = pts;
              breaks[i].redraw();
            } else {
              var pageBreak = new mxPolyline(pts, proto.pageBreakColor);
              pageBreak.dialect = proto.dialect;
              pageBreak.isDashed = proto.pageBreakDashed;
              pageBreak.pointerEvents = false;
              pageBreak.init(proto.view.backgroundPane);
              pageBreak.redraw();

              breaks[i] = pageBreak;
            }
          }

          for (var i = count; i < breaks.length; i++) {
            breaks[i].destroy();
          }

          breaks.splice(count, breaks.length - count);
        }
      };

      drawPageBreaks(proto.horizontalPageBreaks);
      drawPageBreaks(proto.verticalPageBreaks);
    };
  }

  setShouldRemoveCellsFromParent() {
    // Disables removing relative children from parents
    var mxGraphHandlerShouldRemoveCellsFromParent =
      mxGraphHandler.prototype.shouldRemoveCellsFromParent;
    mxGraphHandler.prototype.shouldRemoveCellsFromParent = (
      parent,
      cells,
      evt
    ) => {
      for (var i = 0; i < cells.length; i++) {
        if (this.graph.getModel().isVertex(cells[i])) {
          var geo = this.graph.getCellGeometry(cells[i]);
          if (geo != null && geo.relative) {
            return false;
          }
        }
      }
      return mxGraphHandlerShouldRemoveCellsFromParent.apply(this, [
        parent,
        cells,
        evt,
      ]);
    };
  }

  setCreateMarker() {
    // Overrides to ignore hotspot only for target terminal
    var mxConnectionHandlerCreateMarker =
      mxConnectionHandler.prototype.createMarker;
    const proto: any = mxConnectionHandler.prototype;
    proto.createMarker = () => {
      var marker = mxConnectionHandlerCreateMarker.apply(this);

      marker.intersects = (state, evt) => {
        if (proto.isConnecting()) {
          return true;
        }
        return mxCellMarker.prototype.intersects.apply(marker, [state, evt]);
      };

      return marker;
    };
  }

  setCreateBackgroundPageShape() {
    // Creates background page shape
    const proto: any = mxGraphView.prototype;
    proto.createBackgroundPageShape = (bounds) => {
      return new mxRectangleShape(
        bounds,
        "#ffffff",
        proto.graph.defaultPageBorderColor
      );
    };
  }

  setGetBackgroundPageBounds() {
    // Fits the number of background pages to the graph
    const proto: any = mxGraphView.prototype;
    proto.getBackgroundPageBounds = () => {
      var gb = proto.getGraphBounds();

      // Computes unscaled, untranslated graph bounds
      var x = gb.width > 0 ? gb.x / proto.scale - proto.translate.x : 0;
      var y = gb.height > 0 ? gb.y / proto.scale - proto.translate.y : 0;
      var w = gb.width / proto.scale;
      var h = gb.height / proto.scale;

      var fmt = this.graph.pageFormat;
      var ps = this.graph.pageScale;

      var pw = fmt.width * ps;
      var ph = fmt.height * ps;

      var x0 = Math.floor(Math.min(0, x) / pw);
      var y0 = Math.floor(Math.min(0, y) / ph);
      var xe = Math.ceil(Math.max(1, x + w) / pw);
      var ye = Math.ceil(Math.max(1, y + h) / ph);

      var rows = xe - x0;
      var cols = ye - y0;

      var bounds = new mxRectangle(
        proto.scale * (proto.translate.x + x0 * pw),
        proto.scale * (proto.translate.y + y0 * ph),
        proto.scale * rows * pw,
        proto.scale * cols * ph
      );

      return bounds;
    };
  }

  setPanGraphVML() {
    // Add panning for background page in VML
    var graphPanGraph = mxGraph.prototype.panGraph;
    const proto: any = mxGraph.prototype;
    mxGraph.prototype.panGraph = (dx, dy) => {
      graphPanGraph.call(this, dx, dy);
      if (
        proto.dialect != mxConstants.DIALECT_SVG &&
        proto.view.backgroundPageShape != null &&
        (!proto.useScrollbarsForPanning ||
          !mxUtils.hasScrollbars(proto.container))
      ) {
        proto.view.backgroundPageShape.node.style.marginLeft = dx + "px";
        proto.view.backgroundPageShape.node.style.marginTop = dy + "px";
      }
    };
  }

  setAddItem() {
    /**
     * Consumes click events for disabled menu items.
     */
    var mxPopupMenuAddItem = mxPopupMenu.prototype.addItem;
    mxPopupMenu.prototype.addItem = (
      title,
      image,
      funct,
      parent,
      iconCls,
      enabled
    ) => {
      var result = mxPopupMenuAddItem.apply(this, [
        title,
        image,
        funct,
        parent,
        iconCls,
        enabled,
      ]);
      if (enabled != null && !enabled) {
        mxEvent.addListener(result, "mousedown", (evt) => {
          mxEvent.consume(evt);
        });
      }
      return result;
    };
  }

  setGetInitialCellForEvent() {
    // Selects ancestors before descendants
    var graphHandlerGetInitialCellForEvent =
      mxGraphHandler.prototype.getInitialCellForEvent;
    mxGraphHandler.prototype.getInitialCellForEvent = (me) => {
      var model = this.graph.getModel();
      var psel = model.getParent(this.graph.getSelectionCell());
      var cell = graphHandlerGetInitialCellForEvent.apply(this, [me]);
      var parent = model.getParent(cell);

      if (psel == null || (psel != cell && psel != parent)) {
        while (
          !this.graph.isCellSelected(cell) &&
          !this.graph.isCellSelected(parent) &&
          model.isVertex(parent) &&
          !this.graph.isContainer(parent)
        ) {
          cell = parent;
          parent = this.graph.getModel().getParent(cell);
        }
      }
      return cell;
    };
  }

  setIsDelayedSelection() {
    // Selection is delayed to mouseup if ancestor is selected
    var graphHandlerIsDelayedSelection =
      mxGraphHandler.prototype.isDelayedSelection;
    mxGraphHandler.prototype.isDelayedSelection = (cell, me) => {
      var result = graphHandlerIsDelayedSelection.apply(this, [cell, me]);
      if (!result) {
        var model = this.graph.getModel();
        var parent = model.getParent(cell);

        while (parent != null) {
          // Inconsistency for unselected parent swimlane is intended for easier moving
          // of stack layouts where the container title section is too far away
          if (this.graph.isCellSelected(parent) && model.isVertex(parent)) {
            result = true;
            break;
          }
          parent = model.getParent(parent);
        }
      }
      return result;
    };
  }

  setSelectDelayed() {
    // Delayed selection of parent group
    const proto: any = mxGraphHandler.prototype;
    proto.selectDelayed = (me) => {
      if (!this.graph.popupMenuHandler.isPopupTrigger(me)) {
        var cell = me.getCell();
        if (cell == null) {
          cell = proto.cell;
        }

        // Selects folded cell for hit on folding icon
        var state = this.graph.view.getState(cell);

        if (state != null && me.isSource(state.control)) {
          this.graph.selectCellForEvent(cell, me.getEvent());
        } else {
          var model = this.graph.getModel();
          var parent = model.getParent(cell);

          while (!this.graph.isCellSelected(parent) && model.isVertex(parent)) {
            cell = parent;
            parent = model.getParent(cell);
          }

          this.graph.selectCellForEvent(cell, me.getEvent());
        }
      }
    };
  }

  setGetCellForPopupEvent() {
    // Returns last selected ancestor
    const proto: any = mxPopupMenuHandler.prototype;
    proto.getCellForPopupEvent = (me) => {
      var cell = me.getCell();
      var model = this.graph.getModel();
      var parent = model.getParent(cell);

      while (model.isVertex(parent) && !this.graph.isContainer(parent)) {
        if (this.graph.isCellSelected(parent)) {
          cell = parent;
        }
        parent = model.getParent(parent);
      }

      return cell;
    };
  }
}
