import { Base } from "../../Base";
import mx from "@mxgraph-app/mx";
const {
  mxConstants,
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

export class AbstractManager extends Base {
  get rect() {
    return this.format.getSelectionState();
  }

  get width() {
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
    var wrapper = document.createElement("div");
    wrapper.style.paddingTop = "8px";
    wrapper.style.paddingRight = "20px";
    wrapper.style.whiteSpace = "nowrap";
    wrapper.style.textAlign = "right";
    wrapper.appendChild(opt);
    return wrapper;
  }

  get opt() {
    var opt = this.createCellOption(
      mxResources.get("constrainProportions"),
      mxConstants.STYLE_ASPECT,
      null,
      "fixed",
      "null",
    );
    opt.style.width = "100%";
    return opt;
  }

  listener = (_sender?, _evt?, force?) => {
    rect = this.format.getSelectionState();

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

  get widthUpdate() {
    const { constrainCheckbox } = this;
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

  get constrainCheckbox() {
    const { opt } = this;
    return opt.getElementsByTagName("input")[0];
  }

  get heightUpdate() {
    return this.addGeometryHandler(height, (geo, value) => {
      if (geo.height > 0) {
        value = Math.max(1, panel.fromUnit(value));

        if (constrainCheckbox.checked) {
          geo.width = Math.round((geo.width * value * 100) / geo.height) / 100;
        }

        geo.height = value;
      }
    });
  }
}
