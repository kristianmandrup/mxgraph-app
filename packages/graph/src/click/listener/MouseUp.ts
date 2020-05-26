import { BaseListener } from "./BaseListener";
import mx from "@mxgraph-app/mx";
const { mxEvent } = mx;

export class MouseUp extends BaseListener {
  beforeClick: any;
  onClick: any;

  handler = (_sender, me) => {
    const { ctx, graph, beforeClick, onClick } = this;
    var source = me.getSource();
    var evt = me.getEvent();

    // Checks for parent link
    var linkNode = source;
    let { currentLink } = this;

    while (linkNode != null && linkNode.nodeName.toLowerCase() != "a") {
      linkNode = linkNode.parentNode;
    }

    // Ignores clicks on links and collapse/expand icon
    if (
      linkNode == null &&
      Math.abs(ctx.scrollLeft - graph.container.scrollLeft) < tol &&
      Math.abs(ctx.scrollTop - graph.container.scrollTop) < tol &&
      (me.sourceState == null || !me.isSource(me.sourceState.control)) &&
      (((mxEvent.isLeftMouseButton(evt) || mxEvent.isMiddleMouseButton(evt)) &&
        !mxEvent.isPopupTrigger(evt)) ||
        mxEvent.isTouchEvent(evt))
    ) {
      if (currentLink) {
        let cLink: string = currentLink || "";
        var blank = graph.isBlankLink(this.currentLink);
        const isData = cLink.substring(0, 5) === "data:";
        if (beforeClick && (isData || !blank)) {
          beforeClick(evt, this.currentLink);
        }

        if (!mxEvent.isConsumed(evt)) {
          var target = mxEvent.isMiddleMouseButton(evt)
            ? "_blank"
            : blank
            ? graph.linkTarget
            : "_top";
          graph.openLink(this.currentLink, target);
          me.consume();
        }
      } else if (
        onClick != null &&
        !me.isConsumed() &&
        Math.abs(ctx.scrollLeft - graph.container.scrollLeft) < tol &&
        Math.abs(ctx.scrollTop - graph.container.scrollTop) < tol &&
        Math.abs(ctx.startX - me.getGraphX()) < tol &&
        Math.abs(ctx.startY - me.getGraphY()) < tol
      ) {
        onClick(me.getEvent());
      }
    }

    this.clear();
  };
}
