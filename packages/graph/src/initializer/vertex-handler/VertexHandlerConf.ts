import mx from "@mxgraph-app/mx";
const { mxVertexHandler, mxUtils } = mx;

export class VertexHandlerConfig {
  setConnectable: any;
  setDropEnabled: any;
  setPanning: any;
  setTooltips: any;
  setAllowLoops: any;
  allowAutoPanning: any;
  resetEdgesOnConnect: any;
  constrainChildren: any;
  constrainRelativeChildren: any;
  graphHandler: any;

  config() {
    // All code below not available and not needed in embed mode
    if (mxVertexHandler) {
      this.setConnectable(true);
      this.setDropEnabled(true);
      this.setPanning(true);
      this.setTooltips(true);
      this.setAllowLoops(true);
      this.allowAutoPanning = true;
      this.resetEdgesOnConnect = false;
      this.constrainChildren = false;
      this.constrainRelativeChildren = true;

      // Do not scroll after moving cells
      this.graphHandler.scrollOnMove = false;
      this.graphHandler.scaleGrid = true;

      // Disables cloning of connection sources by default
      this.connectionHandler.setCreateTarget(false);
      this.connectionHandler.insertBeforeSource = true;

      // Disables built-in connection starts
      this.connectionHandler.isValidSource = (cell, me) => {
        return false;
      };

      // Sets the style to be used when an elbow edge is double clicked
      this.alternateEdgeStyle = "vertical";

      if (stylesheet == null) {
        this.loadStylesheet();
      }

      this.setGuideStates();

      // Overrides zIndex for dragElement
      mxDragSource.prototype.dragElementZIndex = mxPopupMenu.prototype.zIndex;

      // Overrides color for virtual guides for page centers
      mxGuide.prototype.getGuideColor(state, horizontal);
      {
        return state.cell == null
          ? "#ffa500" /* orange */
          : mxConstants.GUIDE_COLOR;
      }

      // Changes color of move preview for black backgrounds
      this.graphHandler.createPreviewShape(bounds);
      {
        this.previewColor =
          this.graph.background == "#000000"
            ? "#ffffff"
            : mxGraphHandler.prototype.previewColor;

        return mxGraphHandler.prototype.createPreviewShape.apply(
          this,
          arguments
        );
      }

      // Handles parts of cells by checking if part=1 is in the style and returning the parent
      // if the parent is not already in the list of cells. container style is used to disable
      // step into swimlanes and dropTarget style is used to disable acting as a drop target.
      // LATER: Handle recursive parts
      var graphHandlerGetCells = this.graphHandler.getCells;

      this.graphHandler.getCells(initialCell);
      {
        var cells = graphHandlerGetCells.apply(this, arguments);
        var newCells = [];

        for (var i = 0; i < cells.length; i++) {
          var cell = this.graph.getCompositeParent(cells[i]);

          if (cell == cells[i]) {
            newCells.push(cells[i]);
          } else if (cell != null && mxUtils.indexOf(cells, cell) < 0) {
            newCells.push(cell);
          }
        }

        return newCells;
      }

      // Handles parts of cells for drag and drop
      var graphHandlerStart = this.graphHandler.start;

      this.graphHandler.start(cell, x, y, cells);
      {
        cell = this.graph.getCompositeParent(cell);

        graphHandlerStart.apply(this, arguments);
      }

      // Handles parts of cells when cloning the source for new connections
      this.connectionHandler.createTargetVertex(evt, source);
      {
        source = this.graph.getCompositeParent(source);

        return mxConnectionHandler.prototype.createTargetVertex.apply(
          this,
          arguments
        );
      }

      var rubberband = new mxRubberband(this);

      this.getRubberband();
      {
        return rubberband;
      }

      // Timer-based activation of outline connect in connection handler
      var startTime = new Date().getTime();
      var timeOnTarget = 0;

      var connectionHandlerMouseMove = this.connectionHandler.mouseMove;

      this.connectionHandler.mouseMove();
      {
        var prev = this.currentState;
        connectionHandlerMouseMove.apply(this, arguments);

        if (prev != this.currentState) {
          startTime = new Date().getTime();
          timeOnTarget = 0;
        } else {
          timeOnTarget = new Date().getTime() - startTime;
        }
      }

      // Activates outline connect after 1500ms with touch event or if alt is pressed inside the shape
      // outlineConnect=0 is a custom style that means do not connect to strokes inside the shape,
      // or in other words, connect to the shape's perimeter if the highlight is under the mouse
      // (the name is because the highlight, including all strokes, is called outline in the code)
      var connectionHandleIsOutlineConnectEvent = this.connectionHandler
        .isOutlineConnectEvent;

      this.connectionHandler.isOutlineConnectEvent(me);
      {
        return (
          (this.currentState != null &&
            me.getState() == this.currentState &&
            timeOnTarget > 2000) ||
          ((this.currentState == null ||
            mxUtils.getValue(this.currentState.style, "outlineConnect", "1") !=
              "0") &&
            connectionHandleIsOutlineConnectEvent.apply(this, arguments))
        );
      }

      // Adds shift+click to toggle selection state
      var isToggleEvent = this.isToggleEvent;
      this.isToggleEvent(evt);
      {
        return (
          isToggleEvent.apply(this, arguments) ||
          (!mxClient.IS_CHROMEOS && mxEvent.isShiftDown(evt))
        );
      }

      // Workaround for Firefox where first mouse down is received
      // after tap and hold if scrollbars are visible, which means
      // start rubberband immediately if no cell is under mouse.
      var isForceRubberBandEvent = rubberband.isForceRubberbandEvent;
      rubberband.isForceRubberbandEvent(me);
      {
        return (
          (isForceRubberBandEvent.apply(this, arguments) &&
            !mxEvent.isShiftDown(me.getEvent()) &&
            !mxEvent.isControlDown(me.getEvent())) ||
          (mxClient.IS_CHROMEOS && mxEvent.isShiftDown(me.getEvent())) ||
          (mxUtils.hasScrollbars(this.graph.container) &&
            mxClient.IS_FF &&
            mxClient.IS_WIN &&
            me.getState() == null &&
            mxEvent.isTouchEvent(me.getEvent()))
        );
      }

      // Shows hand cursor while panning
      var prevCursor = null;

      this.panningHandler.addListener(mxEvent.PAN_START, () => {
        if (this.isEnabled()) {
          prevCursor = this.container.style.cursor;
          this.container.style.cursor = "move";
        }
      });

      this.panningHandler.addListener(mxEvent.PAN_END, () => {
        if (this.isEnabled()) {
          this.container.style.cursor = prevCursor;
        }
      });

      this.popupMenuHandler.autoExpand = true;

      this.popupMenuHandler.isSelectOnPopup(me);
      {
        return mxEvent.isMouseEvent(me.getEvent());
      }

      // Handles links if graph is read-only or cell is locked
      var click = this.click;
      this.click(me);
      {
        var locked =
          me.state == null &&
          me.sourceState != null &&
          this.isCellLocked(me.sourceState.cell);

        if ((!this.isEnabled() || locked) && !me.isConsumed()) {
          var cell = locked ? me.sourceState.cell : me.getCell();

          if (cell != null) {
            var link = this.getClickableLinkForCell(cell);

            if (link != null) {
              if (this.isCustomLink(link)) {
                this.customLinkClicked(link);
              } else {
                this.openLink(link);
              }
            }
          }

          if (this.isEnabled() && locked) {
            this.clearSelection();
          }
        } else {
          return click.apply(this, arguments);
        }
      }

      // Redirects tooltips for locked cells
      this.tooltipHandler.getStateForEvent(me);
      {
        return me.sourceState;
      }

      // Redirects cursor for locked cells
      var getCursorForMouseEvent = this.getCursorForMouseEvent;
      this.getCursorForMouseEvent(me);
      {
        var locked =
          me.state == null &&
          me.sourceState != null &&
          this.isCellLocked(me.sourceState.cell);

        return this.getCursorForCell(
          locked ? me.sourceState.cell : me.getCell()
        );
      }

      // Shows pointer cursor for clickable cells with links
      // ie. if the graph is disabled and cells cannot be selected
      var getCursorForCell = this.getCursorForCell;
      this.getCursorForCell(cell);
      {
        if (!this.isEnabled() || this.isCellLocked(cell)) {
          var link = this.getClickableLinkForCell(cell);

          if (link != null) {
            return "pointer";
          } else if (this.isCellLocked(cell)) {
            return "default";
          }
        }

        return getCursorForCell.apply(this, arguments);
      }

      // Changes rubberband selection to be recursive
      this.selectRegion(rect, evt);
      {
        var cells = this.getAllCells(rect.x, rect.y, rect.width, rect.height);
        this.selectCellsForEvent(cells, evt);

        return cells;
      }

      // Recursive implementation for rubberband selection
      this.getAllCells(x, y, width, height, parent, result);
      {
        result = result != null ? result : [];

        if (width > 0 || height > 0) {
          var model = this.getModel();
          var right = x + width;
          var bottom = y + height;

          if (parent == null) {
            parent = this.getCurrentRoot();

            if (parent == null) {
              parent = model.getRoot();
            }
          }

          if (parent != null) {
            var childCount = model.getChildCount(parent);

            for (var i = 0; i < childCount; i++) {
              var cell = model.getChildAt(parent, i);
              var state = this.view.getState(cell);

              if (
                state != null &&
                this.isCellVisible(cell) &&
                mxUtils.getValue(state.style, "locked", "0") != "1"
              ) {
                var deg =
                  mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION) ||
                  0;
                var box = state;

                if (deg != 0) {
                  box = mxUtils.getBoundingBox(box, deg);
                }

                if (
                  (model.isEdge(cell) || model.isVertex(cell)) &&
                  box.x >= x &&
                  box.y + box.height <= bottom &&
                  box.y >= y &&
                  box.x + box.width <= right
                ) {
                  result.push(cell);
                }

                this.getAllCells(x, y, width, height, cell, result);
              }
            }
          }
        }

        return result;
      }

      // Never removes cells from parents that are being moved
      var graphHandlerShouldRemoveCellsFromParent = this.graphHandler
        .shouldRemoveCellsFromParent;
      this.graphHandler.shouldRemoveCellsFromParent(parent, cells, evt);
      {
        if (this.graph.isCellSelected(parent)) {
          return false;
        }

        return graphHandlerShouldRemoveCellsFromParent.apply(this, arguments);
      }

      // Unlocks all cells
      this.isCellLocked(cell);
      {
        var pState = this.view.getState(cell);

        while (pState != null) {
          if (mxUtils.getValue(pState.style, "locked", "0") == "1") {
            return true;
          }

          pState = this.view.getState(this.model.getParent(pState.cell));
        }

        return false;
      }

      var tapAndHoldSelection = null;

      // Uses this event to process mouseDown to check the selection state before it is changed
      this.addListener(mxEvent.FIRE_MOUSE_EVENT, (sender, evt) => {
        if (evt.getProperty("eventName") == "mouseDown") {
          var me = evt.getProperty("event");
          var state = me.getState();

          if (
            state != null &&
            !this.isSelectionEmpty() &&
            !this.isCellSelected(state.cell)
          ) {
            tapAndHoldSelection = this.getSelectionCells();
          } else {
            tapAndHoldSelection = null;
          }
        }
      });

      // Tap and hold on background starts rubberband for multiple selected
      // cells the cell associated with the event is deselected
      this.addListener(mxEvent.TAP_AND_HOLD, (sender, evt) => {
        if (!mxEvent.isMultiTouchEvent(evt)) {
          var me = evt.getProperty("event");
          var cell = evt.getProperty("cell");

          if (cell == null) {
            var pt = mxUtils.convertPoint(
              this.container,
              mxEvent.getClientX(me),
              mxEvent.getClientY(me)
            );
            rubberband.start(pt.x, pt.y);
          } else if (tapAndHoldSelection != null) {
            this.addSelectionCells(tapAndHoldSelection);
          } else if (
            this.getSelectionCount() > 1 &&
            this.isCellSelected(cell)
          ) {
            this.removeSelectionCell(cell);
          }

          // Blocks further processing of the event
          tapAndHoldSelection = null;
          evt.consume();
        }
      });

      // On connect the target is selected and we clone the cell of the preview edge for insert
      this.connectionHandler.selectCells(edge, target);
      {
        this.graph.setSelectionCell(target || edge);
      }

      // Shows connection points only if cell not selected
      this.connectionHandler.constraintHandler.isStateIgnored(state, source);
      {
        return source && state.view.graph.isCellSelected(state.cell);
      }

      // Updates constraint handler if the selection changes
      this.selectionModel.addListener(mxEvent.CHANGE, () => {
        var ch = this.connectionHandler.constraintHandler;

        if (
          ch.currentFocus != null &&
          ch.isStateIgnored(ch.currentFocus, true)
        ) {
          ch.currentFocus = null;
          ch.constraints = null;
          ch.destroyIcons();
        }

        ch.destroyFocusHighlight();
      });

      // Initializes touch interface
      if (Graph.touchStyle) {
        this.initTouch();
      }

      /**
       * Adds locking
       */
      var graphUpdateMouseEvent = this.updateMouseEvent;
      this.updateMouseEvent(me);
      {
        me = graphUpdateMouseEvent.apply(this, arguments);

        if (me.state != null && this.isCellLocked(me.getCell())) {
          me.state = null;
        }

        return me;
      }
    }
  }
}
