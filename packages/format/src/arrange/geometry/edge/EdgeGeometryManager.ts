import { AbstractManager } from "./AbstractManager";
import mx from "@mxgraph-app/mx";
const {
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class EdgeGeometryManager extends AbstractManager {
  /**
   *
   */
  addEdgeGeometry(container = this.container) {
    const { span, div, divs, graph } = this;
    // const { addKeyHandler, addLabel } = this;

    div.appendChild(span);

    const { width, listener, widthUpdate } = this;

    mxUtils.br(div);
    this.addKeyHandler(width, listener);

    mxEvent.addListener(width, "blur", widthUpdate);
    mxEvent.addListener(width, "change", widthUpdate);

    container.appendChild(div);

    divs.appendChild(span);

    const { xt, yt, xs, ys, divt, span1 } = this;

    mxUtils.br(divs);
    this.addLabel(divs, mxResources.get("left"), 84);
    this.addLabel(divs, mxResources.get("top"), 20);
    container.appendChild(divs);
    this.addKeyHandler(xs, listener);
    this.addKeyHandler(ys, listener);

    divt.appendChild(span1);

    mxUtils.br(divt);
    this.addLabel(divt, mxResources.get("left"), 84);
    this.addLabel(divt, mxResources.get("top"), 20);
    container.appendChild(divt);
    this.addKeyHandler(xt, listener);
    this.addKeyHandler(yt, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();
  }
}
