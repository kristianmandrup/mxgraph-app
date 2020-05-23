import { Base } from "../../Base";
import mx from "@mxgraph-app/mx";
const {
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class AbstractManager extends Base {
  get rect() {
    return this.format.getSelectionState();
  }

  get div() {
    return this.createPanel();
  }

  get span() {
    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("width"));
    return span;
  }

  get divs() {
    const divs = this.createPanel();
    divs.style.paddingBottom = "30px";
    return divs;
  }

  get width1() {
    const { div, widthUpdate } = this;
    return this.addUnitInput(div, "pt", 20, 44, (evt) => {
      widthUpdate(evt);
    });
  }

  listener = (sender?, _evt?, force?) => {
    return new Listener(this.editorUi, this.container).handler(
      sender,
      _evt,
      force,
    );
  };

  widthUpdate = (evt) => {
    const { width, graph, ui, rect } = this;
    // Maximum stroke width is 999
    var value = parseInt(width.value);
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value));

    if (
      value !=
        mxUtils.getValue(
          rect.style,
          "width",
          mxCellRenderer.defaultShapes["flexArrow"].prototype.defaultWidth,
        )
    ) {
      graph.setCellStyles("width", value, graph.getSelectionCells());
      ui.fireEvent(
        new mxEventObject(
          "styleChanged",
          "keys",
          ["width"],
          "values",
          [value],
          "cells",
          graph.getSelectionCells(),
        ),
      );
    }

    width.value = value + " pt";
    mxEvent.consume(evt);
  };

  get xs() {
    const { xsUpdate, divs } = this;
    return this.addUnitInput(divs, "pt", 84, 44, () => {
      xsUpdate.apply(this, []);
    });
  }

  get ys() {
    const { ysUpdate, divs } = this;
    return this.addUnitInput(divs, "pt", 20, 44, () => {
      ysUpdate.apply(this, []);
    });
  }

  get divt() {
    const divt = this.createPanel();
    divt.style.paddingBottom = "30px";
    return divt;
  }

  get span1() {
    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, "Start");
    return span;
  }

  get span2() {
    const span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, "End");
    return span;
  }

  get xt() {
    const { xtUpdate, divt } = this;
    return this.addUnitInput(divt, "pt", 84, 44, () => {
      xtUpdate();
    });
  }

  get yt() {
    const { ytUpdate, divt } = this;
    return this.addUnitInput(divt, "pt", 20, 44, () => {
      ytUpdate();
    });
  }

  xsUpdate() {
    const { xs } = this;
    return this.addEdgeGeometryHandler(xs, (geo, value) => {
      geo.sourcePoint.x = value;
    });
  }

  ysUpdate() {
    const { ys } = this;
    return this.addEdgeGeometryHandler(ys, (geo, value) => {
      geo.sourcePoint.y = value;
    });
  }

  xtUpdate() {
    const { xt } = this;
    return this.addEdgeGeometryHandler(xt, (geo, value) => {
      geo.targetPoint.x = value;
    });
  }

  ytUpdate() {
    const { yt } = this;
    return this.addEdgeGeometryHandler(yt, (geo, value) => {
      geo.targetPoint.y = value;
    });
  }

  get width2() {
    const { div, widthUpdate } = this;
    return this.addUnitInput(
      div,
      this.getUnit(),
      84,
      44,
      () => {
        widthUpdate.apply(this, []);
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit(),
    );
  }
  get height() {
    const { div, heightUpdate } = this;
    return this.addUnitInput(
      div,
      this.getUnit(),
      20,
      44,
      () => {
        heightUpdate.apply(this, []);
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit(),
    );
  }
}
