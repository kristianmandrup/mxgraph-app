export class Click {
  /**
   * Overrides double click handling to avoid accidental inserts of new labels in dblClick below.
   */
  click(me) {
    mxclick.call(this, me);

    // Stores state and source for checking in dblClick
    this.firstClickState = me.getState();
    this.firstClickSource = me.getSource();
  }

  /**
   * Overrides double click handling to add the tolerance and inserting text.
   */
  dblClick(evt, cell) {
    if (this.isEnabled()) {
      var pt = mxUtils.convertPoint(
        this.container,
        mxEvent.getClientX(evt),
        mxEvent.getClientY(evt),
      );

      // Automatically adds new child cells to edges on double click
      if (evt != null && !this.model.isVertex(cell)) {
        var state = (this.model.isEdge(cell)) ? this.view.getState(cell) : null;
        var src = mxEvent.getSource(evt);

        if (
          (this.firstClickState == state && this.firstClickSource == src) &&
          (state == null || (state.text == null || state.text.node == null ||
            state.text.boundingBox == null ||
            (!mxUtils.contains(state.text.boundingBox, pt.x, pt.y) &&
              !mxUtils.isAncestorNode(
                state.text.node,
                mxEvent.getSource(evt),
              )))) &&
          ((state == null && !this.isCellLocked(this.getDefaultParent())) ||
            (state != null && !this.isCellLocked(state.cell))) &&
          (state != null || (mxClient.IS_VML && src == this.view.getCanvas()) ||
            (mxClient.IS_SVG && src == this.view.getCanvas().ownerSVGElement))
        ) {
          if (state == null) {
            state = this.view.getState(this.getCellAt(pt.x, pt.y));
          }

          cell = this.addText(pt.x, pt.y, state);
        }
      }

      mxdblClick.call(this, evt, cell);
    }
  }

  /**
   * Adds a handler for clicking on shapes with links. This replaces all links in labels.
   */
  addClickHandler(highlight, beforeClick, onClick) {
    // Replaces links in labels for consistent right-clicks
    var checkLinks = () => {
      var links = this.container.getElementsByTagName("a");

      if (links != null) {
        for (var i = 0; i < links.length; i++) {
          var href = this.getAbsoluteUrl(links[i].getAttribute("href"));

          if (href != null) {
            links[i].setAttribute("rel", this.linkRelation);
            links[i].setAttribute("href", href);

            if (beforeClick != null) {
              mxEvent.addGestureListeners(links[i], null, null, beforeClick);
            }
          }
        }
      }
    };

    this.model.addListener(mxEvent.CHANGE, checkLinks);
    checkLinks();

    var cursor = this.container.style.cursor;
    var tol = this.getTolerance();
    var graph = this;

    var mouseListener = {
      currentState: null,
      currentLink: null,
      highlight:
        (highlight != null && highlight != "" && highlight != mxConstants.NONE)
          ? new mxCellHighlight(graph, highlight, 4)
          : null,
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      updateCurrentState: function (me) {
        var tmp = me.sourceState;

        // Gets topmost intersecting cell with link
        if (tmp == null || graph.getLinkForCell(tmp.cell) == null) {
          var cell = graph.getCellAt(
            me.getGraphX(),
            me.getGraphY(),
            null,
            null,
            null,
            function (state, x, y) {
              return graph.getLinkForCell(state.cell) == null;
            },
          );

          tmp = graph.view.getState(cell);
        }

        if (tmp != this.currentState) {
          if (this.currentState != null) {
            this.clear();
          }

          this.currentState = tmp;

          if (this.currentState != null) {
            this.activate(this.currentState);
          }
        }
      },
      mouseDown: function (sender, me) {
        this.startX = me.getGraphX();
        this.startY = me.getGraphY();
        this.scrollLeft = graph.container.scrollLeft;
        this.scrollTop = graph.container.scrollTop;

        if (
          this.currentLink == null && graph.container.style.overflow == "auto"
        ) {
          graph.container.style.cursor = "move";
        }

        this.updateCurrentState(me);
      },
      mouseMove: function (sender, me) {
        if (graph.isMouseDown) {
          if (this.currentLink != null) {
            var dx = Math.abs(this.startX - me.getGraphX());
            var dy = Math.abs(this.startY - me.getGraphY());

            if (dx > tol || dy > tol) {
              this.clear();
            }
          }
        } else {
          // Checks for parent link
          var linkNode = me.getSource();

          while (linkNode != null && linkNode.nodeName.toLowerCase() != "a") {
            linkNode = linkNode.parentNode;
          }

          if (linkNode != null) {
            this.clear();
          } else {
            if (
              graph.tooltipHandler != null && this.currentLink != null &&
              this.currentState != null
            ) {
              graph.tooltipHandler.reset(me, true, this.currentState);
            }

            if (
              this.currentState != null &&
              (me.getState() == this.currentState || me.sourceState == null) &&
              graph.intersects(
                this.currentState,
                me.getGraphX(),
                me.getGraphY(),
              )
            ) {
              return;
            }

            this.updateCurrentState(me);
          }
        }
      },
      mouseUp: function (sender, me) {
        var source = me.getSource();
        var evt = me.getEvent();

        // Checks for parent link
        var linkNode = source;

        while (linkNode != null && linkNode.nodeName.toLowerCase() != "a") {
          linkNode = linkNode.parentNode;
        }

        // Ignores clicks on links and collapse/expand icon
        if (
          linkNode == null &&
          (((Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
            Math.abs(this.scrollTop - graph.container.scrollTop) < tol) &&
            (me.sourceState == null || !me.isSource(me.sourceState.control))) &&
            (((mxEvent.isLeftMouseButton(evt) ||
              mxEvent.isMiddleMouseButton(evt)) &&
              !mxEvent.isPopupTrigger(evt)) || mxEvent.isTouchEvent(evt)))
        ) {
          if (this.currentLink != null) {
            var blank = graph.isBlankLink(this.currentLink);

            if (
              (this.currentLink.substring(0, 5) === "data:" ||
                !blank) && beforeClick != null
            ) {
              beforeClick(evt, this.currentLink);
            }

            if (!mxEvent.isConsumed(evt)) {
              var target = (mxEvent.isMiddleMouseButton(evt))
                ? "_blank"
                : ((blank) ? graph.linkTarget : "_top");
              graph.openLink(this.currentLink, target);
              me.consume();
            }
          } else if (
            onClick != null && !me.isConsumed() &&
            (Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
              Math.abs(this.scrollTop - graph.container.scrollTop) < tol) &&
            (Math.abs(this.startX - me.getGraphX()) < tol &&
              Math.abs(this.startY - me.getGraphY()) < tol)
          ) {
            onClick(me.getEvent());
          }
        }

        this.clear();
      },
      activate: (state) => {
        this.currentLink = graph.getAbsoluteUrl(
          graph.getLinkForCell(state.cell),
        );

        if (this.currentLink != null) {
          graph.container.style.cursor = "pointer";

          if (this.highlight != null) {
            this.highlight.highlight(state);
          }
        }
      },
      clear: () => {
        if (graph.container != null) {
          graph.container.style.cursor = cursor;
        }

        this.currentState = null;
        this.currentLink = null;

        if (this.highlight != null) {
          this.highlight.hide();
        }

        if (graph.tooltipHandler != null) {
          graph.tooltipHandler.hide();
        }
      },
    };

    // Ignores built-in click handling
    graph.click = (me) => {
    };
    graph.addMouseListener(mouseListener);

    mxEvent.addListener(document, "mouseleave", (evt) => {
      mouseListener.clear();
    });
  }
}
