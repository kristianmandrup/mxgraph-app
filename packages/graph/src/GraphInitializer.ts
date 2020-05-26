import mx from "@mxgraph-app/mx";
const { mxRectangle, mxCellRenderer, 
  mxConstants, mxClient,  mxPoint, mxEvent, mxGraph, mxUtils } = mx

export class GraphInitializer {
  graph: any
  /**
   * Graph inherits from mxGraph 
   */
  // mxUtils.extend(Graph, mxGraph);
  create(container, model, renderHint, stylesheet, themes, standalone) {
	  mxGraph.call(this, container, model, renderHint, stylesheet);
  
    const { graph } = this

    this.themes = themes || this.defaultThemes;
    this.currentEdgeStyle = mxUtils.clone(this.defaultEdgeStyle);
    this.currentVertexStyle = mxUtils.clone(this.defaultVertexStyle);
    this.standalone = (standalone != null) ? standalone : false;

    // Sets the base domain URL and domain path URL for relative links.
    var b = this.baseUrl;
    var p = b.indexOf('//');
    this.domainUrl = '';
    this.domainPathUrl = '';
    
    if (p > 0)
    {
      var d = b.indexOf('/', p + 2);

      if (d > 0)
      {
        this.domainUrl = b.substring(0, d);
      }
      
      d = b.lastIndexOf('/');
      
      if (d > 0)
      {
        this.domainPathUrl = b.substring(0, d + 1);
      }
    }
    
    // Adds support for HTML labels via style. Note: Currently, only the Java
    // backend supports HTML labels but CSS support is limited to the following:
    // http://docs.oracle.com/javase/6/docs/api/index.html?javax/swing/text/html/CSS.html
    // TODO: Wrap should not affect isHtmlLabel output (should be handled later)
    this.isHtmlLabel(cell) {
      var style = this.getCurrentCellStyle(cell);
      
      return (style != null) ? (style['html'] == '1' || style[mxConstants.STYLE_WHITE_SPACE] == 'wrap') : false;
    };
    
    // Implements a listener for hover and click handling on edges
    if (this.edgeMode)
    {
      var start = {
        point: null,
        event: null,
        state: null,
        handle: null,
        selected: false
      };
      
      // Uses this event to process mouseDown to check the selection state before it is changed
      this.addListener(mxEvent.FIRE_MOUSE_EVENT, (sender, evt) =>
      {
        if (evt.getProperty('eventName') == 'mouseDown' && this.isEnabled())
        {
          var me = evt.getProperty('event');
          
          if (!mxEvent.isControlDown(me.getEvent()) && !mxEvent.isShiftDown(me.getEvent()))
            {
              var state = me.getState();
      
              if (state != null)
              {
                // Checks if state was removed in call to stopEditing above
                if (this.model.isEdge(state.cell))
                {
                  start.point = new mxPoint(me.getGraphX(), me.getGraphY());
                  start.selected = this.isCellSelected(state.cell);
                  start.state = state;
                  start.event = me;
                  
                  if (state.text != null && state.text.boundingBox != null &&
                    mxUtils.contains(state.text.boundingBox, me.getGraphX(), me.getGraphY()))
                  {
                    start.handle = mxEvent.LABEL_HANDLE;
                  }
                  else
                  {
                    var handler = this.selectionCellsHandler.getHandler(state.cell);
    
                    if (handler != null && handler.bends != null && handler.bends.length > 0)
                    {
                      start.handle = handler.getHandleForEvent(me);
                    }
                  }
                }
              }
            }
        }
      });
      
      var mouseDown = null;
      
      this.addMouseListener(
      {
        mouseDown: function(sender, me) {},
          mouseMove: (sender, me) =>
          {
            // Checks if any other handler is active
            var handlerMap = this.selectionCellsHandler.handlers.map;
            
            for (var key in handlerMap)
            {
              if (handlerMap[key].index != null)
              {
                return;
              }
            }
            
            if (this.isEnabled() && !this.panningHandler.isActive() && !mxEvent.isControlDown(me.getEvent()) &&
              !mxEvent.isShiftDown(me.getEvent()) && !mxEvent.isAltDown(me.getEvent()))
            {
              var tol = this.tolerance;
    
              if (start.point != null && start.state != null && start.event != null)
              {
                var state = start.state;
                
                if (Math.abs(start.point.x - me.getGraphX()) > tol ||
                  Math.abs(start.point.y - me.getGraphY()) > tol)
                {
                  // Lazy selection for edges inside groups
                  if (!this.isCellSelected(state.cell))
                  {
                    this.setSelectionCell(state.cell);
                  }
                  
                  var handler = this.selectionCellsHandler.getHandler(state.cell);
                  
                  if (handler != null && handler.bends != null && handler.bends.length > 0)
                  {
                    var handle = handler.getHandleForEvent(start.event);
                    var edgeStyle = this.view.getEdgeStyle(state);
                    var entity = edgeStyle == mxEdgeStyle.EntityRelation;
                    
                    // Handles special case where label was clicked on unselected edge in which
                    // case the label will be moved regardless of the handle that is returned
                    if (!start.selected && start.handle == mxEvent.LABEL_HANDLE)
                    {
                      handle = start.handle;
                    }
                    
                    if (!entity || handle == 0 || handle == handler.bends.length - 1 || handle == mxEvent.LABEL_HANDLE)
                    {
                      // Source or target handle or connected for direct handle access or orthogonal line
                      // with just two points where the central handle is moved regardless of mouse position
                      if (handle == mxEvent.LABEL_HANDLE || handle == 0 || state.visibleSourceState != null ||
                        handle == handler.bends.length - 1 || state.visibleTargetState != null)
                      {
                        if (!entity && handle != mxEvent.LABEL_HANDLE)
                        {
                          var pts = state.absolutePoints;
                          
                          // Default case where handles are at corner points handles
                          // drag of corner as drag of existing point
                          if (pts != null && ((edgeStyle == null && handle == null) ||
                            edgeStyle == mxEdgeStyle.OrthConnector))
                          {
                            // Does not use handles if they were not initially visible
                            handle = start.handle;

                            if (handle == null)
                            {
                              var box = new mxRectangle(start.point.x, start.point.y);
                              box.grow(mxEdgeHandler.prototype.handleImage.width / 2);
                              
                              if (mxUtils.contains(box, pts[0].x, pts[0].y))
                              {
                                // Moves source terminal handle
                                handle = 0;
                              }
                              else if (mxUtils.contains(box, pts[pts.length - 1].x, pts[pts.length - 1].y))
                              {
                                // Moves target terminal handle
                                handle = handler.bends.length - 1;
                              }
                              else
                              {
                                // Checks if edge has no bends
                                var nobends = edgeStyle != null && (pts.length == 2 || (pts.length == 3 &&
                                  ((Math.round(pts[0].x - pts[1].x) == 0 && Math.round(pts[1].x - pts[2].x) == 0) ||
                                  (Math.round(pts[0].y - pts[1].y) == 0 && Math.round(pts[1].y - pts[2].y) == 0))));
                                
                                if (nobends)
                                {
                                  // Moves central handle for straight orthogonal edges
                                  handle = 2;
                                }
                                else
                                {
                                  // Finds and moves vertical or horizontal segment
                                  handle = mxUtils.findNearestSegment(state, start.point.x, start.point.y);
                                  
                                  // Converts segment to virtual handle index
                                  if (edgeStyle == null)
                                  {
                                    handle = mxEvent.VIRTUAL_HANDLE - handle;
                                  }
                                  // Maps segment to handle
                                  else
                                  {
                                    handle += 1;
                                  }
                                }
                              }
                            }
                          }
                          
                          // Creates a new waypoint and starts moving it
                          if (handle == null)
                          {
                            handle = mxEvent.VIRTUAL_HANDLE;
                          }
                        }
                        
                        handler.start(me.getGraphX(), me.getGraphX(), handle);
                        start.state = null;
                        start.event = null;
                        start.point = null;
                        start.handle = null;
                        start.selected = false;
                        me.consume();
    
                        // Removes preview rectangle in graph handler
                        this.graphHandler.reset();
                      }
                    }
                    else if (entity && (state.visibleSourceState != null || state.visibleTargetState != null))
                    {
                      // Disables moves on entity to make it consistent
                      this.graphHandler.reset();
                      me.consume();
                    }
                  }
                }
              }
              else
              {
                // Updates cursor for unselected edges under the mouse
                var state = me.getState();
                
                if (state != null)
                {
                  // Checks if state was removed in call to stopEditing above
                  if (this.model.isEdge(state.cell))
                  {
                    var cursor = null;
                    var pts = state.absolutePoints;
                    
                    if (pts != null)
                    {
                      var box = new mxRectangle(me.getGraphX(), me.getGraphY());
                      box.grow(mxEdgeHandler.prototype.handleImage.width / 2);
                      
                      if (state.text != null && state.text.boundingBox != null &&
                        mxUtils.contains(state.text.boundingBox, me.getGraphX(), me.getGraphY()))
                      {
                        cursor = 'move';
                      }
                      else if (mxUtils.contains(box, pts[0].x, pts[0].y) ||
                        mxUtils.contains(box, pts[pts.length - 1].x, pts[pts.length - 1].y))
                      {
                        cursor = 'pointer';
                      }
                      else if (state.visibleSourceState != null || state.visibleTargetState != null)
                      {
                        // Moving is not allowed for entity relation but still indicate hover state
                        var tmp = this.view.getEdgeStyle(state);
                        cursor = 'crosshair';
                        
                        if (tmp != mxEdgeStyle.EntityRelation && this.isOrthogonal(state))
                        {
                          var idx = mxUtils.findNearestSegment(state, me.getGraphX(), me.getGraphY());
                          
                          if (idx < pts.length - 1 && idx >= 0)
                          {
                            cursor = (Math.round(pts[idx].x - pts[idx + 1].x) == 0) ?
                              'col-resize' : 'row-resize';
                          }
                        }
                      }
                    }
                    
                    if (cursor != null)
                    {
                      state.setCursor(cursor);
                    }
                  }
                }
              }
            }
          },
          mouseUp: (sender, me) =>
          {
          start.state = null;
          start.event = null;
          start.point = null;
          start.handle = null;
          }
      });
    }
    
    // HTML entities are displayed as plain text in wrapped plain text labels
    this.cellRenderer.getLabelValue(state) {
      var result = mxCellRenderer.prototype.getLabelValue.apply(this, [state]);
      
      if (state.view.graph.isHtmlLabel(state.cell))
      {
        if (state.style['html'] != 1)
        {
          result = mxUtils.htmlEntities(result, false);
        }
        else
        {
          result = state.view.graph.sanitizeHtml(result);
        }
      }
      
      return result;
    };

    // All code below not available and not needed in embed mode
    if (typeof mxVertexHandler !== 'undefined')
    {
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
      this.connectionHandler.isValidSource(cell, me)
      {
        return false;
      };

      // Sets the style to be used when an elbow edge is double clicked
      this.alternateEdgeStyle = 'vertical';

      if (stylesheet == null)
      {
        this.loadStylesheet();
      }

      // Adds page centers to the guides for moving cells
      var graphHandlerGetGuideStates = this.graphHandler.getGuideStates;
      this.graphHandler.getGuideStates()
      {
        var result = graphHandlerGetGuideStates.apply(this, arguments);
        
        // Create virtual cell state for page centers
        if (this.graph.pageVisible)
        {
          var guides = [];
          
          var pf = this.graph.pageFormat;
          var ps = this.graph.pageScale;
          var pw = pf.width * ps;
          var ph = pf.height * ps;
          var t = this.graph.view.translate;
          var s = this.graph.view.scale;

          var layout = this.graph.getPageLayout();
          
          for (var i = 0; i < layout.width; i++)
          {
            guides.push(new mxRectangle(((layout.x + i) * pw + t.x) * s,
              (layout.y * ph + t.y) * s, pw * s, ph * s));
          }
          
          for (var j = 1; j < layout.height; j++)
          {
            guides.push(new mxRectangle((layout.x * pw + t.x) * s,
              ((layout.y + j) * ph + t.y) * s, pw * s, ph * s));
          }
          
          // Page center guides have precedence over normal guides
          result = guides.concat(result);
        }
        
        return result;
      };

      // Overrides zIndex for dragElement
      mxDragSource.prototype.dragElementZIndex = mxPopupMenu.prototype.zIndex;
      
      // Overrides color for virtual guides for page centers
      mxGuide.prototype.getGuideColor(state, horizontal)
      {
        return (state.cell == null) ? '#ffa500' /* orange */ : mxConstants.GUIDE_COLOR;
      };

      // Changes color of move preview for black backgrounds
      this.graphHandler.createPreviewShape(bounds)
      {
        this.previewColor = (this.graph.background == '#000000') ? '#ffffff' : mxGraphHandler.prototype.previewColor;
        
        return mxGraphHandler.prototype.createPreviewShape.apply(this, arguments);
      };
      
      // Handles parts of cells by checking if part=1 is in the style and returning the parent
      // if the parent is not already in the list of cells. container style is used to disable
      // step into swimlanes and dropTarget style is used to disable acting as a drop target.
      // LATER: Handle recursive parts
      var graphHandlerGetCells = this.graphHandler.getCells;
      
      this.graphHandler.getCells(initialCell)
      {
          var cells = graphHandlerGetCells.apply(this, arguments);
          var newCells = [];

          for (var i = 0; i < cells.length; i++)
          {
            var cell = this.graph.getCompositeParent(cells[i]);
            
            if (cell == cells[i])
            {
              newCells.push(cells[i]);
            }
            else if (cell != null && mxUtils.indexOf(cells, cell) < 0)
              {
                  newCells.push(cell);
              }
          }

          return newCells;
      };
      
      // Handles parts of cells for drag and drop
      var graphHandlerStart = this.graphHandler.start;
      
      this.graphHandler.start(cell, x, y, cells)
      {
        cell = this.graph.getCompositeParent(cell);
        
        graphHandlerStart.apply(this, arguments);
      };
      
      // Handles parts of cells when cloning the source for new connections
      this.connectionHandler.createTargetVertex(evt, source)
      {
        source = this.graph.getCompositeParent(source);
        
        return mxConnectionHandler.prototype.createTargetVertex.apply(this, arguments);
      };
      
        var rubberband = new mxRubberband(this);
        
        this.getRubberband()
        {
          return rubberband;
        };
        
        // Timer-based activation of outline connect in connection handler
        var startTime = new Date().getTime();
        var timeOnTarget = 0;
        
        var connectionHandlerMouseMove = this.connectionHandler.mouseMove;
        
        this.connectionHandler.mouseMove()
        {
          var prev = this.currentState;
          connectionHandlerMouseMove.apply(this, arguments);
          
          if (prev != this.currentState)
          {
            startTime = new Date().getTime();
            timeOnTarget = 0;
          }
          else
          {
            timeOnTarget = new Date().getTime() - startTime;
          }
        };

        // Activates outline connect after 1500ms with touch event or if alt is pressed inside the shape
        // outlineConnect=0 is a custom style that means do not connect to strokes inside the shape,
        // or in other words, connect to the shape's perimeter if the highlight is under the mouse
        // (the name is because the highlight, including all strokes, is called outline in the code)
        var connectionHandleIsOutlineConnectEvent = this.connectionHandler.isOutlineConnectEvent;
        
        this.connectionHandler.isOutlineConnectEvent(me)
        {
            return (this.currentState != null && me.getState() == this.currentState && timeOnTarget > 2000) ||
              ((this.currentState == null || mxUtils.getValue(this.currentState.style, 'outlineConnect', '1') != '0') &&
              connectionHandleIsOutlineConnectEvent.apply(this, arguments));
        };
        
        // Adds shift+click to toggle selection state
        var isToggleEvent = this.isToggleEvent;
        this.isToggleEvent(evt)
        {
            return isToggleEvent.apply(this, arguments) || (!mxClient.IS_CHROMEOS && mxEvent.isShiftDown(evt));
        };
        
        // Workaround for Firefox where first mouse down is received
        // after tap and hold if scrollbars are visible, which means
        // start rubberband immediately if no cell is under mouse.
        var isForceRubberBandEvent = rubberband.isForceRubberbandEvent;
        rubberband.isForceRubberbandEvent(me)
        {
            return (isForceRubberBandEvent.apply(this, arguments) && !mxEvent.isShiftDown(me.getEvent()) &&
              !mxEvent.isControlDown(me.getEvent())) || (mxClient.IS_CHROMEOS && mxEvent.isShiftDown(me.getEvent())) ||
              (mxUtils.hasScrollbars(this.graph.container) && mxClient.IS_FF &&
              mxClient.IS_WIN && me.getState() == null && mxEvent.isTouchEvent(me.getEvent()));
        };
        
        // Shows hand cursor while panning
        var prevCursor = null;
        
      this.panningHandler.addListener(mxEvent.PAN_START, () =>
      {
        if (this.isEnabled())
        {
          prevCursor = this.container.style.cursor;
          this.container.style.cursor = 'move';
        }
      });
        
      this.panningHandler.addListener(mxEvent.PAN_END, () =>
      {
        if (this.isEnabled())
        {
          this.container.style.cursor = prevCursor;
        }
      });

      this.popupMenuHandler.autoExpand = true;
      
      this.popupMenuHandler.isSelectOnPopup(me)
      {
        return mxEvent.isMouseEvent(me.getEvent());
      };
    
      // Handles links if graph is read-only or cell is locked
      var click = this.click;
      this.click(me)
      {
        var locked = me.state == null && me.sourceState != null &&
          this.isCellLocked(me.sourceState.cell);
        
        if ((!this.isEnabled() || locked) && !me.isConsumed())
        {
          var cell = (locked) ? me.sourceState.cell : me.getCell();
          
          if (cell != null)
          {
            var link = this.getClickableLinkForCell(cell);

            if (link != null)
            {
              if (this.isCustomLink(link))
              {
                this.customLinkClicked(link);
              }
              else
              {
                this.openLink(link);
              }
            }
          }
          
          if (this.isEnabled() && locked)
          {
            this.clearSelection();
          }
        }
        else
        {
          return click.apply(this, arguments);
        }
      };

      // Redirects tooltips for locked cells
      this.tooltipHandler.getStateForEvent(me)
      {
        return me.sourceState;
      };
      
      // Redirects cursor for locked cells
      var getCursorForMouseEvent = this.getCursorForMouseEvent; 
      this.getCursorForMouseEvent(me)
      {
        var locked = me.state == null && me.sourceState != null && this.isCellLocked(me.sourceState.cell);
        
        return this.getCursorForCell((locked) ? me.sourceState.cell : me.getCell());
      };
      
      // Shows pointer cursor for clickable cells with links
      // ie. if the graph is disabled and cells cannot be selected
      var getCursorForCell = this.getCursorForCell;
      this.getCursorForCell(cell)
      {
        if (!this.isEnabled() || this.isCellLocked(cell))
        {
          var link = this.getClickableLinkForCell(cell);
          
          if (link != null)
          {
            return 'pointer';
          }
          else if (this.isCellLocked(cell))
          {
            return 'default';
          }
        }

        return getCursorForCell.apply(this, arguments);
      };
      
      // Changes rubberband selection to be recursive
      this.selectRegion(rect, evt)
      {
        var cells = this.getAllCells(rect.x, rect.y, rect.width, rect.height);
        this.selectCellsForEvent(cells, evt);
        
        return cells;
      };
      
      // Recursive implementation for rubberband selection
      this.getAllCells(x, y, width, height, parent, result)
      {
        result = (result != null) ? result : [];
        
        if (width > 0 || height > 0)
        {
          var model = this.getModel();
          var right = x + width;
          var bottom = y + height;
    
          if (parent == null)
          {
            parent = this.getCurrentRoot();
            
            if (parent == null)
            {
              parent = model.getRoot();
            }
          }
          
          if (parent != null)
          {
            var childCount = model.getChildCount(parent);
            
            for (var i = 0; i < childCount; i++)
            {
              var cell = model.getChildAt(parent, i);
              var state = this.view.getState(cell);
              
              if (state != null && this.isCellVisible(cell) && mxUtils.getValue(state.style, 'locked', '0') != '1')
              {
                var deg = mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION) || 0;
                var box = state;
                
                if (deg != 0)
                {
                  box = mxUtils.getBoundingBox(box, deg);
                }
                
                if ((model.isEdge(cell) || model.isVertex(cell)) &&
                  box.x >= x && box.y + box.height <= bottom &&
                  box.y >= y && box.x + box.width <= right)
                {
                  result.push(cell);
                }
    
                this.getAllCells(x, y, width, height, cell, result);
              }
            }
          }
        }
        
        return result;
      };

      // Never removes cells from parents that are being moved
      var graphHandlerShouldRemoveCellsFromParent = this.graphHandler.shouldRemoveCellsFromParent;
      this.graphHandler.shouldRemoveCellsFromParent(parent, cells, evt)
      {
        if (this.graph.isCellSelected(parent))
        {
          return false;
        }
        
        return graphHandlerShouldRemoveCellsFromParent.apply(this, arguments);
      };

      // Unlocks all cells
      this.isCellLocked(cell)
      {
        var pState = this.view.getState(cell);
        
        while (pState != null)
        {
          if (mxUtils.getValue(pState.style, 'locked', '0') == '1')
          {
            return true;
          }
          
          pState = this.view.getState(this.model.getParent(pState.cell));
        }
        
        return false;
      };
      
      var tapAndHoldSelection = null;
      
      // Uses this event to process mouseDown to check the selection state before it is changed
      this.addListener(mxEvent.FIRE_MOUSE_EVENT, (sender, evt) =>
      {
        if (evt.getProperty('eventName') == 'mouseDown')
        {
          var me = evt.getProperty('event');
          var state = me.getState();
          
          if (state != null && !this.isSelectionEmpty() && !this.isCellSelected(state.cell))
          {
            tapAndHoldSelection = this.getSelectionCells();
          }
          else
          {
            tapAndHoldSelection = null;
          }
        }
      });
      
      // Tap and hold on background starts rubberband for multiple selected
      // cells the cell associated with the event is deselected
      this.addListener(mxEvent.TAP_AND_HOLD, (sender, evt) =>
      {
        if (!mxEvent.isMultiTouchEvent(evt))
        {
          var me = evt.getProperty('event');
          var cell = evt.getProperty('cell');
          
          if (cell == null)
          {
            var pt = mxUtils.convertPoint(this.container,
                mxEvent.getClientX(me), mxEvent.getClientY(me));
            rubberband.start(pt.x, pt.y);
          }
          else if (tapAndHoldSelection != null)
          {
            this.addSelectionCells(tapAndHoldSelection);
          }
          else if (this.getSelectionCount() > 1 && this.isCellSelected(cell))
          {
            this.removeSelectionCell(cell);
          }
          
          // Blocks further processing of the event
          tapAndHoldSelection = null;
          evt.consume();
        }
      });
    
      // On connect the target is selected and we clone the cell of the preview edge for insert
      this.connectionHandler.selectCells(edge, target)
      {
        this.graph.setSelectionCell(target || edge);
      };
      
      // Shows connection points only if cell not selected
      this.connectionHandler.constraintHandler.isStateIgnored(state, source)
      {
        return source && state.view.graph.isCellSelected(state.cell);
      };
      
      // Updates constraint handler if the selection changes
      this.selectionModel.addListener(mxEvent.CHANGE, () =>
      {
        var ch = this.connectionHandler.constraintHandler;
        
        if (ch.currentFocus != null && ch.isStateIgnored(ch.currentFocus, true))
        {
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
      this.updateMouseEvent(me)
      {
        me = graphUpdateMouseEvent.apply(this, arguments);
        
        if (me.state != null && this.isCellLocked(me.getCell()))
        {
          me.state = null;
        }
        
        return me;
      };
    }
    
    //Create a unique offset object for each graph instance.
    this.currentTranslate = new mxPoint(0, 0);
  }
}