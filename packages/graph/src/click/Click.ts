import mx from "@mxgraph-app/mx";
import { MouseListener } from "./listener/MouseListener";
import { BaseEventer } from "./BaseEventer";
const { mxClient, mxEvent, mxGraph, mxUtils } = mx;

export class Click extends BaseEventer {
  container: any;
  isEnabled: any;
  firstClickState: any;
  firstClickSource: any;
  isCellLocked: any;
  getDefaultParent: any;
  getCellAt: any;
  getLinkForCell: any;
  getAbsoluteUrl: any;
  getTolerance: any;
  addText: any;
  linkRelation: any;
  currentLink: any;
  currentState: any;

  get model() {
    return this.graph.model;
  }

  get view() {
    return this.graph.view;
  }

  /**
   * Overrides double click handling to avoid accidental inserts of new labels in dblClick below.
   */
  click(me) {
    mxGraph.prototype.click.call(this, me);

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
        mxEvent.getClientY(evt)
      );

      // Automatically adds new child cells to edges on double click
      if (evt != null && !this.model.isVertex(cell)) {
        var state = this.model.isEdge(cell) ? this.view.getState(cell) : null;
        var src = mxEvent.getSource(evt);

        if (
          this.firstClickState == state &&
          this.firstClickSource == src &&
          (state == null ||
            state.text == null ||
            state.text.node == null ||
            state.text.boundingBox == null ||
            (!mxUtils.contains(state.text.boundingBox, pt.x, pt.y) &&
              !mxUtils.isAncestorNode(
                state.text.node,
                mxEvent.getSource(evt)
              ))) &&
          ((state == null && !this.isCellLocked(this.getDefaultParent())) ||
            (state != null && !this.isCellLocked(state.cell))) &&
          (state != null ||
            (mxClient.IS_VML && src == this.view.getCanvas()) ||
            (mxClient.IS_SVG && src == this.view.getCanvas().ownerSVGElement))
        ) {
          if (state == null) {
            state = this.view.getState(this.getCellAt(pt.x, pt.y));
          }

          cell = this.addText(pt.x, pt.y, state);
        }
      }

      mxGraph.prototype.dblClick.call(this, evt, cell);
    }
  }

  /**
   * Adds a handler for clicking on shapes with links. This replaces all links in labels.
   */
  addClickHandler(_highlight, beforeClick, _onClick) {
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

    const { graph, mouseListener } = this;

    // Ignores built-in click handling
    graph.click = (_me) => {};
    graph.addMouseListener(mouseListener);

    mxEvent.addListener(document, "mouseleave", (_evt) => {
      mouseListener.clear();
    });
  }

  mouseListener = new MouseListener().createHandler();
}
