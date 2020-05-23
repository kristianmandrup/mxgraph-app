import mx from "@mxgraph-app/mx";
import { BaseManager } from "../BaseManager";
const {
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class AbstractManager extends BaseManager {
  get rect() {
    return this.format.getSelectionState();
  }

  get leftUpdate(): any {
    const { left, panel } = this;
    return this.addGeometryHandler(left, (geo, value) => {
      value = panel.fromUnit(value);

      if (geo.relative) {
        geo.offset.x = value;
      } else {
        geo.x = value;
      }
    });
  }

  get topUpdate(): any {
    const { panel } = this;
    return this.addGeometryHandler(top, (geo, value) => {
      value = panel.fromUnit(value);

      if (geo.relative) {
        geo.offset.y = value;
      } else {
        geo.y = value;
      }
    });
  }

  setChangeListener() {
    const { listener, graph } = this;
    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();
  }

  get span() {
    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "50px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("size"));
    return span;
  }

  get span2() {
    var span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    mxUtils.write(span, mxResources.get("position"));
    return span;
  }

  get div2() {
    var div2 = this.createPanel();
    div2.style.paddingBottom = "30px";
    return div2;
  }

  get left() {
    const { div2, leftUpdate } = this;
    return this.addUnitInput(
      div2,
      this.getUnit(),
      84,
      44,
      () => {
        leftUpdate();
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit(),
    );
  }

  get top() {
    const { div2, topUpdate } = this;
    return this.addUnitInput(
      div2,
      this.getUnit(),
      20,
      44,
      () => {
        topUpdate();
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit(),
    );
  }

  get div() {
    var div = this.createPanel();
    div.style.paddingBottom = "8px";
    return div;
  }

  get width() {
    const { div, widthUpdate } = this;
    return this.addUnitInput(
      div,
      this.getUnit(),
      84,
      44,
      () => {
        widthUpdate();
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
        heightUpdate();
      },
      this.getUnitStep(),
      null,
      null,
      this.isFloatUnit(),
    );
  }

  get autosizeBtn() {
    const { ui } = this;
    const autosizeBtn = document.createElement("div");
    autosizeBtn.className = "geSprite geSprite-fit";
    autosizeBtn.setAttribute(
      "title",
      mxResources.get("autosize") +
        " (" +
        this.editorUi.actions.get("autosize").shortcut +
        ")",
    );
    autosizeBtn.style.position = "relative";
    autosizeBtn.style.cursor = "pointer";
    autosizeBtn.style.marginTop = "-3px";
    autosizeBtn.style.border = "0px";
    autosizeBtn.style.left = "52px";

    mxUtils.setOpacity(autosizeBtn, 50);

    mxEvent.addListener(autosizeBtn, "mouseenter", function () {
      mxUtils.setOpacity(autosizeBtn, 100);
    });

    mxEvent.addListener(autosizeBtn, "mouseleave", function () {
      mxUtils.setOpacity(autosizeBtn, 50);
    });

    mxEvent.addListener(autosizeBtn, "click", function () {
      ui.actions.get("autosize").funct();
    });

    return autosizeBtn;
  }

  get wrapper() {
    const { opt } = this;
    var wrapper = document.createElement("div");
    wrapper.style.paddingTop = "8px";
    wrapper.style.paddingRight = "20px";
    wrapper.style.whiteSpace = "nowrap";
    wrapper.style.textAlign = "right";
    wrapper.appendChild(opt);
    return wrapper;
  }

  listener = (_sender?, _evt?, force?) => {
    const { rect, graph, div, width, height, div2, left, top } = this;

    if (
      !rect.containsLabel &&
      rect.vertices.length == graph.getSelectionCount() &&
      rect.width != null &&
      rect.height != null
    ) {
      div.style.display = "";

      if (force || document.activeElement != width) {
        width.value = this.inUnit(rect.width) +
          (rect.width == "" ? "" : " " + this.getUnit());
      }

      if (force || document.activeElement != height) {
        height.value = this.inUnit(rect.height) +
          (rect.height == "" ? "" : " " + this.getUnit());
      }
    } else {
      div.style.display = "none";
    }

    if (
      rect.vertices.length == graph.getSelectionCount() &&
      rect.x != null &&
      rect.y != null
    ) {
      div2.style.display = "";

      if (force || document.activeElement != left) {
        left.value = this.inUnit(rect.x) +
          (rect.x == "" ? "" : " " + this.getUnit());
      }

      if (force || document.activeElement != top) {
        top.value = this.inUnit(rect.y) +
          (rect.y == "" ? "" : " " + this.getUnit());
      }
    } else {
      div2.style.display = "none";
    }
  };

  get widthUpdate(): any {
    const { constrainCheckbox, width, panel } = this;
    return this.addGeometryHandler(width, (geo, value) => {
      if (geo.width > 0) {
        value = Math.max(1, panel.fromUnit(value));

        if (constrainCheckbox.checked) {
          geo.height = Math.round((geo.height * value * 100) / geo.width) / 100;
        }

        geo.width = value;
      }
    });
  }
}
