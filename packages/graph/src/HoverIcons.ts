import mx from "@mxgraph-app/mx";
const {
  mxImage,
  mxRectangle,
  mxResources,
  mxClient,
  mxUtils,
  mxConstants,
  mxEvent,
} = mx;
import resources from "@mxgraph-app/resources";
import { Graph } from "./Graph";
const { IMAGE_PATH } = resources;

/**
 * Hover icons are used for hover, vertex handler and drag from sidebar.
 */
export class HoverIcons {
  graph: any;
  arrowUp: any;
  arrowRight: any;
  arrowDown: any;
  arrowLeft: any;
  elts: any;
  resetHandler: any;
  repaintHandler: any;
  mouseDownPoint: any;
  bbox: any;
  updateThread: any;
  prev: any;
  startTime: any;

  constructor(graph) {
    this.graph = graph;
    this.init();
  }

  /**
   * Up arrow.
   */
  arrowSpacing = 2;

  /**
   * Delay to switch to another state for overlapping bbox. Default is 500ms.
   */
  updateDelay = 500;

  /**
   * Delay to switch between states. Default is 140ms.
   */
  activationDelay = 140;

  /**
   * Up arrow.
   */
  currentState: any;

  /**
   * Up arrow.
   */
  activeArrow: any;

  /**
   * Up arrow.
   */
  inactiveOpacity = 15;

  /**
   * Up arrow.
   */
  cssCursor = "copy";

  /**
   * Whether to hide arrows that collide with vertices.
   * LATER: Add keyboard override, touch support.
   */
  checkCollisions = true;

  /**
   * Up arrow.
   */
  arrowFill = "#29b6f2";

  /**
   * Up arrow.
   */
  triangleUp = !mxClient.IS_SVG
    ? new mxImage(IMAGE_PATH + "/triangle-up.png", 26, 14)
    : Graph.createSvgImage(
        18,
        28,
        '<path d="m 6 26 L 12 26 L 12 12 L 18 12 L 9 1 L 1 12 L 6 12 z" ' +
          'stroke="#fff" fill="' +
          this.arrowFill +
          '"/>'
      );

  /**
   * Right arrow.
   */
  triangleRight = !mxClient.IS_SVG
    ? new mxImage(IMAGE_PATH + "/triangle-right.png", 14, 26)
    : Graph.createSvgImage(
        26,
        18,
        '<path d="m 1 6 L 14 6 L 14 1 L 26 9 L 14 18 L 14 12 L 1 12 z" ' +
          'stroke="#fff" fill="' +
          this.arrowFill +
          '"/>'
      );

  /**
   * Down arrow.
   */
  triangleDown = !mxClient.IS_SVG
    ? new mxImage(IMAGE_PATH + "/triangle-down.png", 26, 14)
    : Graph.createSvgImage(
        18,
        26,
        '<path d="m 6 1 L 6 14 L 1 14 L 9 26 L 18 14 L 12 14 L 12 1 z" ' +
          'stroke="#fff" fill="' +
          this.arrowFill +
          '"/>'
      );

  /**
   * Left arrow.
   */
  triangleLeft = !mxClient.IS_SVG
    ? new mxImage(IMAGE_PATH + "/triangle-left.png", 14, 26)
    : Graph.createSvgImage(
        28,
        18,
        '<path d="m 1 9 L 12 1 L 12 6 L 26 6 L 26 12 L 12 12 L 12 18 z" ' +
          'stroke="#fff" fill="' +
          this.arrowFill +
          '"/>'
      );

  /**
   * Round target.
   */
  roundDrop = !mxClient.IS_SVG
    ? new mxImage(IMAGE_PATH + "/round-drop.png", 26, 26)
    : Graph.createSvgImage(
        26,
        26,
        '<circle cx="13" cy="13" r="12" ' +
          'stroke="#fff" fill="' +
          this.arrowFill +
          '"/>'
      );

  /**
   * Refresh target.
   */
  refreshTarget = new mxImage(
    mxClient.IS_SVG
      ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCI+PGVsbGlwc2UgZmlsbD0iIzI5YjZmMiIgY3g9IjEyIiBjeT0iMTIiIHJ4PSIxMiIgcnk9IjEyIi8+PHBhdGggdHJhbnNmb3JtPSJzY2FsZSgwLjgpIHRyYW5zbGF0ZSgyLjQsIDIuNCkiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iI2ZmZiIgZD0iTTEyIDZ2M2w0LTQtNC00djNjLTQuNDIgMC04IDMuNTgtOCA4IDAgMS41Ny40NiAzLjAzIDEuMjQgNC4yNkw2LjcgMTQuOGMtLjQ1LS44My0uNy0xLjc5LS43LTIuOCAwLTMuMzEgMi42OS02IDYtNnptNi43NiAxLjc0TDE3LjMgOS4yYy40NC44NC43IDEuNzkuNyAyLjggMCAzLjMxLTIuNjkgNi02IDZ2LTNsLTQgNCA0IDR2LTNjNC40MiAwIDgtMy41OCA4LTggMC0xLjU3LS40Ni0zLjAzLTEuMjQtNC4yNnoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+Cg=="
      : IMAGE_PATH + "/refresh.png",
    38,
    38
  );

  /**
   * Tolerance for hover icon clicks.
   */
  tolerance = mxClient.IS_TOUCH ? 6 : 0;

  /**
   *
   */
  init() {
    this.arrowUp = this.createArrow(
      this.triangleUp,
      mxResources.get("plusTooltip")
    );
    this.arrowRight = this.createArrow(
      this.triangleRight,
      mxResources.get("plusTooltip")
    );
    this.arrowDown = this.createArrow(
      this.triangleDown,
      mxResources.get("plusTooltip")
    );
    this.arrowLeft = this.createArrow(
      this.triangleLeft,
      mxResources.get("plusTooltip")
    );

    this.elts = [this.arrowUp, this.arrowRight, this.arrowDown, this.arrowLeft];

    this.resetHandler = () => {
      this.reset();
    };

    this.repaintHandler = () => {
      this.repaint();
    };

    this.graph.selectionModel.addListener(mxEvent.CHANGE, this.resetHandler);
    this.graph.model.addListener(mxEvent.CHANGE, this.repaintHandler);
    this.graph.view.addListener(
      mxEvent.SCALE_AND_TRANSLATE,
      this.repaintHandler
    );
    this.graph.view.addListener(mxEvent.TRANSLATE, this.repaintHandler);
    this.graph.view.addListener(mxEvent.SCALE, this.repaintHandler);
    this.graph.view.addListener(mxEvent.DOWN, this.repaintHandler);
    this.graph.view.addListener(mxEvent.UP, this.repaintHandler);
    this.graph.addListener(mxEvent.ROOT, this.repaintHandler);
    this.graph.addListener(mxEvent.ESCAPE, this.resetHandler);
    mxEvent.addListener(this.graph.container, "scroll", this.resetHandler);

    // Resets the mouse point on escape
    this.graph.addListener(mxEvent.ESCAPE, () => {
      this.mouseDownPoint = null;
    });

    // Removes hover icons if mouse leaves the container
    mxEvent.addListener(this.graph.container, "mouseleave", (evt) => {
      // Workaround for IE11 firing mouseleave for touch in diagram
      if (
        evt.relatedTarget != null &&
        mxEvent.getSource(evt) == this.graph.container
      ) {
        this.setDisplay("none");
      }
    });

    // Resets current state when in-place editor starts
    this.graph.addListener(mxEvent.START_EDITING, (_evt) => {
      this.reset();
    });

    // Resets current state after update of selection state for touch events
    var graphClick = this.graph.click;
    this.graph.click = (me) => {
      graphClick.apply(this.graph, arguments);

      if (
        this.currentState != null &&
        !this.graph.isCellSelected(this.currentState.cell) &&
        mxEvent.isTouchEvent(me.getEvent()) &&
        !this.graph.model.isVertex(me.getCell())
      ) {
        this.reset();
      }
    };

    // Checks if connection handler was active in mouse move
    // as workaround for possible double connection inserted
    var connectionHandlerActive = false;

    // Implements a listener for hover and click handling
    this.graph.addMouseListener({
      mouseDown: (_sender, me) => {
        connectionHandlerActive = false;
        var evt = me.getEvent();

        if (this.isResetEvent(evt)) {
          this.reset();
        } else if (!this.isActive()) {
          var state = this.getState(me.getState());

          if (state != null || !mxEvent.isTouchEvent(evt)) {
            this.update(state);
          }
        }

        this.setDisplay("none");
      },
      mouseMove: (_sender, me) => {
        var evt = me.getEvent();

        if (this.isResetEvent(evt)) {
          this.reset();
        } else if (!this.graph.isMouseDown && !mxEvent.isTouchEvent(evt)) {
          this.update(
            this.getState(me.getState()),
            me.getGraphX(),
            me.getGraphY()
          );
        }

        if (
          this.graph.connectionHandler != null &&
          this.graph.connectionHandler.shape != null
        ) {
          connectionHandlerActive = true;
        }
      },
      mouseUp: (_sender, me) => {
        const evt = me.getEvent();
        // const pt = mxUtils.convertPoint(
        //   this.graph.container,
        //   mxEvent.getClientX(evt),
        //   mxEvent.getClientY(evt)
        // );

        if (this.isResetEvent(evt)) {
          this.reset();
        } else if (
          this.isActive() &&
          !connectionHandlerActive &&
          this.mouseDownPoint != null
        ) {
          this.click(this.currentState, this.getDirection(), me);
        } else if (this.isActive()) {
          // Selects target vertex after drag and clone if not only new edge was inserted
          if (
            this.graph.getSelectionCount() != 1 ||
            !this.graph.model.isEdge(this.graph.getSelectionCell())
          ) {
            this.update(
              this.getState(
                this.graph.view.getState(
                  this.graph.getCellAt(me.getGraphX(), me.getGraphY())
                )
              )
            );
          } else {
            this.reset();
          }
        } else if (
          mxEvent.isTouchEvent(evt) ||
          (this.bbox != null &&
            mxUtils.contains(this.bbox, me.getGraphX(), me.getGraphY()))
        ) {
          // Shows existing hover icons if inside bounding box
          this.setDisplay("");
          this.repaint();
        } else if (!mxEvent.isTouchEvent(evt)) {
          this.reset();
        }

        connectionHandlerActive = false;
        this.resetActiveArrow();
      },
    });
  }

  /**
   *
   */
  isResetEvent(evt, _allowShift?) {
    return (
      mxEvent.isAltDown(evt) ||
      (this.activeArrow == null && mxEvent.isShiftDown(evt)) ||
      mxEvent.isMetaDown(evt) ||
      (mxEvent.isPopupTrigger(evt) && !mxEvent.isControlDown(evt))
    );
  }

  /**
   *
   */
  createArrow(img, tooltip) {
    var arrow: any;

    if (mxClient.IS_IE && !mxClient.IS_SVG) {
      // Workaround for PNG images in IE6
      if (mxClient.IS_IE6 && document.compatMode != "CSS1Compat") {
        arrow = document.createElement(mxClient.VML_PREFIX + ":image");
        arrow.setAttribute("src", img.src);
        arrow.style.borderStyle = "none";
      } else {
        arrow = document.createElement("div");
        arrow.style.backgroundImage = "url(" + img.src + ")";
        arrow.style.backgroundPosition = "center";
        arrow.style.backgroundRepeat = "no-repeat";
      }

      arrow.style.width = img.width + 4 + "px";
      arrow.style.height = img.height + 4 + "px";
      arrow.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    } else {
      arrow = mxUtils.createImage(img.src);
      arrow.style.width = img.width + "px";
      arrow.style.height = img.height + "px";
      arrow.style.padding = this.tolerance + "px";
    }

    if (tooltip != null) {
      arrow.setAttribute("title", tooltip);
    }

    arrow.style.position = "absolute";
    arrow.style.cursor = this.cssCursor;

    mxEvent.addGestureListeners(
      arrow,
      (evt) => {
        if (this.currentState != null && !this.isResetEvent(evt)) {
          this.mouseDownPoint = mxUtils.convertPoint(
            this.graph.container,
            mxEvent.getClientX(evt),
            mxEvent.getClientY(evt)
          );
          this.drag(evt, this.mouseDownPoint.x, this.mouseDownPoint.y);
          this.activeArrow = arrow;
          this.setDisplay("none");
          mxEvent.consume(evt);
        }
      },
      null,
      null
    );

    // Captures mouse events as events on graph
    mxEvent.redirectMouseEvents(
      arrow,
      this.graph,
      this.currentState,
      null,
      null,
      null,
      null
    );

    mxEvent.addListener(arrow, "mouseenter", (evt) => {
      // Workaround for Firefox firing mouseenter on touchend
      if (mxEvent.isMouseEvent(evt)) {
        if (this.activeArrow != null && this.activeArrow != arrow) {
          mxUtils.setOpacity(this.activeArrow, this.inactiveOpacity);
        }

        this.graph.connectionHandler.constraintHandler.reset();
        mxUtils.setOpacity(arrow, 100);
        this.activeArrow = arrow;
      }
    });

    mxEvent.addListener(arrow, "mouseleave", (_evt) => {
      // Workaround for IE11 firing this event on touch
      if (!this.graph.isMouseDown) {
        this.resetActiveArrow();
      }
    });

    return arrow;
  }

  /**
   *
   */
  resetActiveArrow() {
    if (this.activeArrow != null) {
      mxUtils.setOpacity(this.activeArrow, this.inactiveOpacity);
      this.activeArrow = null;
    }
  }

  /**
   *
   */
  getDirection() {
    var dir = mxConstants.DIRECTION_EAST;

    if (this.activeArrow == this.arrowUp) {
      dir = mxConstants.DIRECTION_NORTH;
    } else if (this.activeArrow == this.arrowDown) {
      dir = mxConstants.DIRECTION_SOUTH;
    } else if (this.activeArrow == this.arrowLeft) {
      dir = mxConstants.DIRECTION_WEST;
    }

    return dir;
  }

  /**
   *
   */
  visitNodes(visitor) {
    for (var i = 0; i < this.elts.length; i++) {
      if (this.elts[i] != null) {
        visitor(this.elts[i]);
      }
    }
  }

  /**
   *
   */
  removeNodes() {
    this.visitNodes(function (elt) {
      if (elt.parentNode != null) {
        elt.parentNode.removeChild(elt);
      }
    });
  }

  /**
   *
   */
  setDisplay(display) {
    this.visitNodes(function (elt) {
      elt.style.display = display;
    });
  }

  /**
   *
   */
  isActive() {
    return this.activeArrow != null && this.currentState != null;
  }

  /**
   *
   */
  drag(evt, x, y) {
    this.graph.popupMenuHandler.hideMenu();
    this.graph.stopEditing(false);

    // Checks if state was removed in call to stopEditing above
    if (this.currentState != null) {
      this.graph.connectionHandler.start(this.currentState, x, y);
      this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
      this.graph.isMouseDown = true;

      // Hides handles for selection cell
      var handler = this.graph.selectionCellsHandler.getHandler(
        this.currentState.cell
      );

      if (handler != null) {
        handler.setHandlesVisible(false);
      }

      // Ctrl+shift drag sets source constraint
      var es = this.graph.connectionHandler.edgeState;

      if (
        evt != null &&
        mxEvent.isShiftDown(evt) &&
        mxEvent.isControlDown(evt) &&
        es != null &&
        mxUtils.getValue(es.style, mxConstants.STYLE_EDGE, null) ===
          "orthogonalEdgeStyle"
      ) {
        var direction = this.getDirection();
        es.cell.style = mxUtils.setStyle(
          es.cell.style,
          "sourcePortConstraint",
          direction
        );
        es.style["sourcePortConstraint"] = direction;
      }
    }
  }

  /**
   *
   */
  getStateAt(_state, x, y) {
    return this.graph.view.getState(this.graph.getCellAt(x, y));
  }

  /**
   *
   */
  click(state, dir, me) {
    var evt = me.getEvent();
    var x = me.getGraphX();
    var y = me.getGraphY();

    var tmp = this.getStateAt(state, x, y);

    if (
      tmp != null &&
      this.graph.model.isEdge(tmp.cell) &&
      !mxEvent.isControlDown(evt) &&
      (tmp.getVisibleTerminalState(true) == state ||
        tmp.getVisibleTerminalState(false) == state)
    ) {
      this.graph.setSelectionCell(tmp.cell);
      this.reset();
    } else if (state != null) {
      this.graph.selectCellsForConnectVertex(
        this.graph.connectVertex(
          state.cell,
          dir,
          this.graph.defaultEdgeLength,
          evt
        ),
        evt,
        this
      );
    }

    me.consume();
  }

  /**
   *
   */
  reset(clearTimeout?) {
    clearTimeout = clearTimeout == null ? true : clearTimeout;

    if (clearTimeout && this.updateThread != null) {
      window.clearTimeout(this.updateThread);
    }

    this.mouseDownPoint = null;
    this.currentState = null;
    this.activeArrow = null;
    this.removeNodes();
    this.bbox = null;
  }

  /**
   *
   */
  repaint() {
    this.bbox = null;

    if (this.currentState != null) {
      // Checks if cell was deleted
      this.currentState = this.getState(this.currentState);

      // Cell was deleted
      if (
        this.currentState != null &&
        this.graph.model.isVertex(this.currentState.cell) &&
        this.graph.isCellConnectable(this.currentState.cell)
      ) {
        var bds = mxRectangle.fromRectangle(this.currentState);

        // Uses outer bounding box to take rotation into account
        if (
          this.currentState.shape != null &&
          this.currentState.shape.boundingBox != null
        ) {
          bds = mxRectangle.fromRectangle(this.currentState.shape.boundingBox);
        }

        bds.grow(this.graph.tolerance);
        bds.grow(this.arrowSpacing);

        var handler = this.graph.selectionCellsHandler.getHandler(
          this.currentState.cell
        );
        var rotationBbox: any;

        if (handler != null) {
          bds.x -= handler.horizontalOffset / 2;
          bds.y -= handler.verticalOffset / 2;
          bds.width += handler.horizontalOffset;
          bds.height += handler.verticalOffset;

          // Adds bounding box of rotation handle to avoid overlap
          if (
            handler.rotationShape != null &&
            handler.rotationShape.node != null &&
            handler.rotationShape.node.style.visibility != "hidden" &&
            handler.rotationShape.node.style.display != "none" &&
            handler.rotationShape.boundingBox != null
          ) {
            rotationBbox = handler.rotationShape.boundingBox;
          }
        }

        // Positions arrows avoid collisions with rotation handle
        var positionArrow = (arrow, x, y) => {
          if (rotationBbox != null) {
            var bbox = new mxRectangle(
              x,
              y,
              arrow.clientWidth,
              arrow.clientHeight
            );

            if (mxUtils.intersects(bbox, rotationBbox)) {
              if (arrow == this.arrowUp) {
                y -= bbox.y + bbox.height - rotationBbox.y;
              } else if (arrow == this.arrowRight) {
                x += rotationBbox.x + rotationBbox.width - bbox.x;
              } else if (arrow == this.arrowDown) {
                y += rotationBbox.y + rotationBbox.height - bbox.y;
              } else if (arrow == this.arrowLeft) {
                x -= bbox.x + bbox.width - rotationBbox.x;
              }
            }
          }

          arrow.style.left = x + "px";
          arrow.style.top = y + "px";
          mxUtils.setOpacity(arrow, this.inactiveOpacity);
        };

        positionArrow(
          this.arrowUp,
          Math.round(
            this.currentState.getCenterX() -
              this.triangleUp.width / 2 -
              this.tolerance
          ),
          Math.round(bds.y - this.triangleUp.height - this.tolerance)
        );

        positionArrow(
          this.arrowRight,
          Math.round(bds.x + bds.width - this.tolerance),
          Math.round(
            this.currentState.getCenterY() -
              this.triangleRight.height / 2 -
              this.tolerance
          )
        );

        positionArrow(
          this.arrowDown,
          parseInt(this.arrowUp.style.left),
          Math.round(bds.y + bds.height - this.tolerance)
        );

        positionArrow(
          this.arrowLeft,
          Math.round(bds.x - this.triangleLeft.width - this.tolerance),
          parseInt(this.arrowRight.style.top)
        );

        if (this.checkCollisions) {
          var right = this.graph.getCellAt(
            bds.x + bds.width + this.triangleRight.width / 2,
            this.currentState.getCenterY()
          );
          var left = this.graph.getCellAt(
            bds.x - this.triangleLeft.width / 2,
            this.currentState.getCenterY()
          );
          var top = this.graph.getCellAt(
            this.currentState.getCenterX(),
            bds.y - this.triangleUp.height / 2
          );
          var bottom = this.graph.getCellAt(
            this.currentState.getCenterX(),
            bds.y + bds.height + this.triangleDown.height / 2
          );

          // Shows hover icons large cell is behind all directions of current cell
          if (right != null && right == left && left == top && top == bottom) {
            right = null;
            left = null;
            top = null;
            bottom = null;
          }

          var currentGeo = this.graph.getCellGeometry(this.currentState.cell);

          var checkCollision = (cell, arrow) => {
            var geo =
              this.graph.model.isVertex(cell) &&
              this.graph.getCellGeometry(cell);

            // Ignores collision if vertex is more than 3 times the size of this vertex
            if (
              cell != null &&
              !this.graph.model.isAncestor(cell, this.currentState.cell) &&
              !this.graph.isSwimlane(cell) &&
              (geo == null ||
                currentGeo == null ||
                (geo.height < 3 * currentGeo.height &&
                  geo.width < 3 * currentGeo.width))
            ) {
              arrow.style.visibility = "hidden";
            } else {
              arrow.style.visibility = "visible";
            }
          };

          checkCollision(right, this.arrowRight);
          checkCollision(left, this.arrowLeft);
          checkCollision(top, this.arrowUp);
          checkCollision(bottom, this.arrowDown);
        } else {
          this.arrowLeft.style.visibility = "visible";
          this.arrowRight.style.visibility = "visible";
          this.arrowUp.style.visibility = "visible";
          this.arrowDown.style.visibility = "visible";
        }

        if (this.graph.tooltipHandler.isEnabled()) {
          this.arrowLeft.setAttribute("title", mxResources.get("plusTooltip"));
          this.arrowRight.setAttribute("title", mxResources.get("plusTooltip"));
          this.arrowUp.setAttribute("title", mxResources.get("plusTooltip"));
          this.arrowDown.setAttribute("title", mxResources.get("plusTooltip"));
        } else {
          this.arrowLeft.removeAttribute("title");
          this.arrowRight.removeAttribute("title");
          this.arrowUp.removeAttribute("title");
          this.arrowDown.removeAttribute("title");
        }
      } else {
        this.reset();
      }

      // Updates bounding box
      if (this.currentState != null) {
        this.bbox = this.computeBoundingBox();

        // Adds tolerance for hover
        if (this.bbox != null) {
          this.bbox.grow(10);
        }
      }
    }
  }

  /**
   *
   */
  computeBoundingBox() {
    var bbox = !this.graph.model.isEdge(this.currentState.cell)
      ? mxRectangle.fromRectangle(this.currentState)
      : null;

    this.visitNodes(function (elt) {
      if (elt.parentNode != null) {
        var tmp = new mxRectangle(
          elt.offsetLeft,
          elt.offsetTop,
          elt.offsetWidth,
          elt.offsetHeight
        );

        if (bbox == null) {
          bbox = tmp;
        } else {
          bbox.add(tmp);
        }
      }
    });

    return bbox;
  }

  /**
   *
   */
  getState(state) {
    if (state != null) {
      var cell = state.cell;

      if (!this.graph.getModel().contains(cell)) {
        state = null;
      } else {
        // Uses connectable parent vertex if child is not connectable
        if (
          this.graph.getModel().isVertex(cell) &&
          !this.graph.isCellConnectable(cell)
        ) {
          var parent = this.graph.getModel().getParent(cell);

          if (
            this.graph.getModel().isVertex(parent) &&
            this.graph.isCellConnectable(parent)
          ) {
            cell = parent;
          }
        }

        // Ignores locked cells and edges
        if (this.graph.isCellLocked(cell) || this.graph.model.isEdge(cell)) {
          cell = null;
        }

        state = this.graph.view.getState(cell);

        if (state != null && state.style == null) {
          state = null;
        }
      }
    }

    return state;
  }

  /**
   *
   */
  update(state, x?, y?) {
    if (
      !this.graph.connectionArrowsEnabled ||
      (state != null &&
        mxUtils.getValue(state.style, "allowArrows", "1") == "0")
    ) {
      this.reset();
    } else {
      if (
        state != null &&
        state.cell.geometry != null &&
        state.cell.geometry.relative &&
        this.graph.model.isEdge(state.cell.parent)
      ) {
        state = null;
      }

      var timeOnTarget: any;

      // Time on target
      if (this.prev != state || this.isActive()) {
        this.startTime = new Date().getTime();
        this.prev = state;
        timeOnTarget = 0;

        if (this.updateThread != null) {
          window.clearTimeout(this.updateThread);
        }

        if (state != null) {
          // Starts timer to update current state with no mouse events
          this.updateThread = window.setTimeout(() => {
            if (
              !this.isActive() &&
              !this.graph.isMouseDown &&
              !this.graph.panningHandler.isActive()
            ) {
              this.prev = state;
              this.update(state, x, y);
            }
          }, this.updateDelay + 10);
        }
      } else if (this.startTime != null) {
        timeOnTarget = new Date().getTime() - this.startTime;
      }

      this.setDisplay("");

      if (
        this.currentState != null &&
        this.currentState != state &&
        timeOnTarget < this.activationDelay &&
        this.bbox != null &&
        !mxUtils.contains(this.bbox, x, y)
      ) {
        this.reset(false);
      } else if (
        this.currentState != null ||
        timeOnTarget > this.activationDelay
      ) {
        if (
          this.currentState != state &&
          ((timeOnTarget > this.updateDelay && state != null) ||
            this.bbox == null ||
            x == null ||
            y == null ||
            !mxUtils.contains(this.bbox, x, y))
        ) {
          if (state != null && this.graph.isEnabled()) {
            this.removeNodes();
            this.setCurrentState(state);
            this.repaint();

            // Resets connection points on other focused cells
            if (
              this.graph.connectionHandler.constraintHandler.currentFocus !=
              state
            ) {
              this.graph.connectionHandler.constraintHandler.reset();
            }
          } else {
            this.reset();
          }
        }
      }
    }
  }

  /**
   *
   */
  setCurrentState(state) {
    if (state.style["portConstraint"] != "eastwest") {
      this.graph.container.appendChild(this.arrowUp);
      this.graph.container.appendChild(this.arrowDown);
    }

    this.graph.container.appendChild(this.arrowRight);
    this.graph.container.appendChild(this.arrowLeft);
    this.currentState = state;
  }
}
