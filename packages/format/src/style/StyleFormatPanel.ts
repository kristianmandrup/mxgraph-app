import mx from "@mxgraph-app/mx";
import Base64 from "Base64";
import { BaseStyleFormat } from "./BaseStyleFormat";
import { Fill } from "./Fill";
import { StrokeFormat } from "./stroke/StrokeFormat";
const {
  mxEventObject,
  mxConstants,
  mxClient,
  mxResources,
  mxEvent,
  mxUtils,
} = mx;

/**
 * Adds the label menu items to the given menu and parent.
 */
export class StyleFormatPanel extends BaseStyleFormat {
  createCellOption: any;
  lineJumpsEnabled: any; // Graph.lineJumpsEnabled
  defaultJumpSize: any; // Graph.defaultJumpSize

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
    this.init();
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    var ss = this.format.getSelectionState();

    if (!ss.containsLabel) {
      if (
        ss.containsImage &&
        ss.vertices.length == 1 &&
        ss.style.shape == "image" &&
        ss.style.image != null &&
        ss.style.image.substring(0, 19) == "data:image/svg+xml;"
      ) {
        this.container.appendChild(this.addSvgStyles(this.createPanel()));
      }

      if (!ss.containsImage || ss.style.shape == "image") {
        this.container.appendChild(this.addFill(this.createPanel()));
      }

      this.container.appendChild(this.addStroke(this.createPanel()));
      this.container.appendChild(this.addLineJumps(this.createPanel()));
      var opacityPanel = this.createRelativeOption(
        mxResources.get("opacity"),
        mxConstants.STYLE_OPACITY,
        41,
      );
      opacityPanel.style.paddingTop = "8px";
      opacityPanel.style.paddingBottom = "8px";
      this.container.appendChild(opacityPanel);
      this.container.appendChild(this.addEffects(this.createPanel()));
    }

    var opsPanel = this.addEditOps(this.createPanel());

    if (opsPanel.firstChild != null) {
      mxUtils.br(opsPanel);
    }

    this.container.appendChild(this.addStyleOps(opsPanel));
  }

  /**
   * Use browser for parsing CSS.
   */
  getCssRules(css) {
    var doc = document.implementation.createHTMLDocument("");
    var styleElement: any = document.createElement("style");

    mxUtils.setTextContent(styleElement, css);
    doc.body.appendChild(styleElement);

    return styleElement.sheet.cssRules;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addSvgStyles(container) {
    // var ui = this.editorUi;
    // var graph = ui.editor.graph;
    var ss = this.format.getSelectionState();
    container.style.paddingTop = "6px";
    container.style.paddingBottom = "6px";
    container.style.fontWeight = "bold";
    container.style.display = "none";

    try {
      var exp = ss.style.editableCssRules;

      if (exp != null) {
        var regex = new RegExp(exp);

        var data = ss.style.image.substring(ss.style.image.indexOf(",") + 1);
        var xml = window.atob ? atob(data) : Base64.decode(data, true);
        var svg = mxUtils.parseXml(xml);

        if (svg != null) {
          var styles = svg.getElementsByTagName("style");

          for (var i = 0; i < styles.length; i++) {
            var rules = this.getCssRules(mxUtils.getTextContent(styles[i]));

            for (var j = 0; j < rules.length; j++) {
              this.addSvgRule(
                container,
                rules[j],
                svg,
                styles[i],
                rules,
                j,
                regex,
              );
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return container;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addSvgRule(container, rule, svg, styleElem, rules, ruleIndex, regex) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;

    if (regex.test(rule.selectorText)) {
      function rgb2hex(rgb) {
        rgb = rgb.match(
          /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i,
        );

        return rgb && rgb.length === 4
          ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
          : "";
      }

      var addStyleRule = (rule, key, label) => {
        if (rule.style[key] != "") {
          var option = this.createColorOption(
            label + " " + rule.selectorText,
            () => {
              return rgb2hex(rule.style[key]);
            },
            function (color) {
              rules[ruleIndex].style[key] = color;
              var cssTxt = "";

              for (var i = 0; i < rules.length; i++) {
                cssTxt += rules[i].cssText + " ";
              }

              styleElem.textContent = cssTxt;
              var xml = mxUtils.getXml(svg.documentElement);

              graph.setCellStyles(
                mxConstants.STYLE_IMAGE,
                "data:image/svg+xml," +
                  (window.btoa ? btoa(xml) : Base64.encode(xml, true)),
                graph.getSelectionCells(),
              );
            },
            "#ffffff",
            {
              install: function () {
                // ignore
              },
              destroy: function () {
                // ignore
              },
            },
          );

          container.appendChild(option);

          // Shows container if rules are added
          container.style.display = "";
        }
      };

      addStyleRule(rule, "fill", mxResources.get("fill"));
      addStyleRule(rule, "stroke", mxResources.get("line"));
    }
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addEditOps(div) {
    var ss = this.format.getSelectionState();
    var btn: any;

    if (this.editorUi.editor.graph.getSelectionCount() == 1) {
      btn = mxUtils.button(mxResources.get("editStyle"), (_evt) => {
        this.editorUi.actions.get("editStyle").funct();
      });

      btn.setAttribute(
        "title",
        mxResources.get("editStyle") +
          " (" +
          this.editorUi.actions.get("editStyle").shortcut +
          ")",
      );
      btn.style.width = "202px";
      btn.style.marginBottom = "2px";

      div.appendChild(btn);
    }

    if (ss.image) {
      var btn2 = mxUtils.button(mxResources.get("editImage"), (_evt) => {
        this.editorUi.actions.get("image").funct();
      });

      btn2.setAttribute("title", mxResources.get("editImage"));
      btn2.style.marginBottom = "2px";

      if (btn == null) {
        btn2.style.width = "202px";
      } else {
        btn.style.width = "100px";
        btn2.style.width = "100px";
        btn2.style.marginLeft = "2px";
      }

      div.appendChild(btn2);
    }

    return div;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addFill(container?) {
    return new Fill(this.format, this.editorUi, container || this.container)
      .addFill();
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addStroke(container) {
    return new StrokeFormat(
      this.format,
      this.editorUi,
      container || this.container,
    ).add();
  }

  /**
   * Adds UI for configuring line jumps.
   */
  addLineJumps(container) {
    var ss = this.format.getSelectionState();

    if (
      this.lineJumpsEnabled &&
      ss.edges.length > 0 &&
      ss.vertices.length == 0 &&
      ss.lineJumps
    ) {
      container.style.padding = "8px 0px 24px 18px";

      var ui = this.editorUi;
      var editor = ui.editor;
      var graph = editor.graph;

      var span = document.createElement("div");
      span.style.position = "absolute";
      span.style.fontWeight = "bold";
      span.style.width = "80px";

      mxUtils.write(span, mxResources.get("lineJumps"));
      container.appendChild(span);

      var styleSelect = document.createElement("select");
      styleSelect.style.position = "absolute";
      styleSelect.style.marginTop = "-2px";
      styleSelect.style.right = "76px";
      styleSelect.style.width = "62px";

      var styles = ["none", "arc", "gap", "sharp"];

      for (var i = 0; i < styles.length; i++) {
        var styleOption = document.createElement("option");
        styleOption.setAttribute("value", styles[i]);
        mxUtils.write(styleOption, mxResources.get(styles[i]));
        styleSelect.appendChild(styleOption);
      }

      mxEvent.addListener(styleSelect, "change", function (evt) {
        graph.getModel().beginUpdate();
        try {
          graph.setCellStyles(
            "jumpStyle",
            styleSelect.value,
            graph.getSelectionCells(),
          );
          ui.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              ["jumpStyle"],
              "values",
              [styleSelect.value],
              "cells",
              graph.getSelectionCells(),
            ),
          );
        } finally {
          graph.getModel().endUpdate();
        }

        mxEvent.consume(evt);
      });

      // Stops events from bubbling to color option event handler
      mxEvent.addListener(styleSelect, "click", (evt) => {
        mxEvent.consume(evt);
      });

      container.appendChild(styleSelect);

      var jumpSizeUpdate;

      var jumpSize = this.addUnitInput(container, "pt", 22, 33, () => {
        jumpSizeUpdate.apply(this, arguments);
      });

      jumpSizeUpdate = this.installInputHandler(
        jumpSize,
        "jumpSize",
        this.defaultJumpSize,
        0,
        999,
        " pt",
      );

      var listener = (_sender?, _evt?, force?) => {
        ss = this.format.getSelectionState();
        styleSelect.value = mxUtils.getValue(ss.style, "jumpStyle", "none");

        if (force || document.activeElement != jumpSize) {
          var tmp = parseInt(
            mxUtils.getValue(ss.style, "jumpSize", this.defaultJumpSize),
          );
          jumpSize.value = isNaN(tmp) ? "" : tmp + " pt";
        }
      };

      this.addKeyHandler(jumpSize, listener);

      graph.getModel().addListener(mxEvent.CHANGE, listener);
      this.listeners.push({
        destroy: function () {
          graph.getModel().removeListener(listener);
        },
      });
      listener();
    } else {
      container.style.display = "none";
    }

    return container;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addEffects(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();

    div.style.paddingTop = "0px";
    div.style.paddingBottom = "2px";

    var table = document.createElement("table");

    if (mxClient.IS_QUIRKS) {
      table.style.fontSize = "1em";
    }

    table.style.width = "100%";
    table.style.fontWeight = "bold";
    table.style.paddingRight = "20px";
    var tbody = document.createElement("tbody");
    var row = document.createElement("tr");
    row.style.padding = "0px";
    var left = document.createElement("td");
    left.style.padding = "0px";
    left.style.width = "50%";
    left.setAttribute("valign", "top");

    var right: any = left.cloneNode(true);
    right.style.paddingLeft = "8px";
    row.appendChild(left);
    row.appendChild(right);
    tbody.appendChild(row);
    table.appendChild(tbody);
    div.appendChild(table);

    var current = left;
    var count = 0;

    var addOption = (label, key, defaultValue) => {
      var opt = this.createCellOption(label, key, defaultValue);
      opt.style.width = "100%";
      current.appendChild(opt);
      current = current == left ? right : left;
      count++;
    };

    var listener = (_sender?, _evt?, _force?) => {
      ss = this.format.getSelectionState();

      left.innerHTML = "";
      right.innerHTML = "";
      current = left;

      if (ss.rounded) {
        addOption(mxResources.get("rounded"), mxConstants.STYLE_ROUNDED, 0);
      }

      if (ss.style.shape == "swimlane") {
        addOption(mxResources.get("divider"), "swimlaneLine", 1);
      }

      if (!ss.containsImage) {
        addOption(mxResources.get("shadow"), mxConstants.STYLE_SHADOW, 0);
      }

      if (ss.glass) {
        addOption(mxResources.get("glass"), mxConstants.STYLE_GLASS, 0);
      }

      if (ss.comic) {
        addOption(mxResources.get("comic"), "comic", 0);
      }

      if (count == 0) {
        div.style.display = "none";
      }
    };

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: () => {
        graph.getModel().removeListener(listener);
      },
    });

    listener();

    return div;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addStyleOps(div) {
    div.style.paddingTop = "10px";
    div.style.paddingBottom = "10px";

    var btn = mxUtils.button(mxResources.get("setAsDefaultStyle"), (_evt) => {
      this.editorUi.actions.get("setAsDefaultStyle").funct();
    });

    btn.setAttribute(
      "title",
      mxResources.get("setAsDefaultStyle") +
        " (" +
        this.editorUi.actions.get("setAsDefaultStyle").shortcut +
        ")",
    );
    btn.style.width = "202px";
    div.appendChild(btn);

    return div;
  }
}
