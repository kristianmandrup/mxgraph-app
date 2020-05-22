import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
import { Buttons } from "./Buttons";
import { InputHandlerInstaller } from "./InputHandlerInstaller";
import { Stepper } from "./Stepper";
import { Base } from "./Base";
import { FormatOption } from "./options/FormatOption";
import { CellOption } from "./options/CellOption";
import { CellColorOption } from "./options/CellColorOption";
import { ColorOption } from "./options/ColorOption";
const { mxEventObject, mxConstants, mxClient, mxEvent, mxUtils } = mx;
const { IMAGE_PATH } = resources;

/**
 * Base class for format panels.
 */
export class BaseFormatPanel extends Base {
  documentMode: any;
  selection: any;
  buttons: Buttons;

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
    this.buttons = new Buttons();
  }

  /**
   *
   */
  buttonBackgroundColor = "white";

  /**
   * Adds the given color option.
   */
  getSelectionState() {
    var graph = this.editorUi.editor.graph;
    var cells = graph.getSelectionCells();
    var shape = null;

    for (var i = 0; i < cells.length; i++) {
      var state = graph.view.getState(cells[i]);

      if (state != null) {
        var tmp = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);

        if (tmp != null) {
          if (shape == null) {
            shape = tmp;
          } else if (shape != tmp) {
            return null;
          }
        }
      }
    }

    return shape;
  }

  /**
   * Install input handler.
   */
  installInputHandler(
    input,
    key,
    defaultValue,
    min,
    max,
    unit,
    textEditFallback?,
    isFloat?,
  ) {
    this.createInputHandlerInstaller().install(
      input,
      key,
      defaultValue,
      min,
      max,
      unit,
      textEditFallback,
      isFloat,
    );
  }

  createInputHandlerInstaller() {
    return new InputHandlerInstaller(
      this.format,
      this.editorUi,
      this.container,
    );
  }

  /**
   * Adds the given option.
   */
  createPanel() {
    var div = document.createElement("div");
    div.className = "geFormatSection";
    div.style.padding = "12px 0px 12px 18px";

    return div;
  }

  /**
   * Adds the given option.
   */
  createTitle(title) {
    var div = document.createElement("div");
    div.style.padding = "0px 0px 6px 0px";
    div.style.whiteSpace = "nowrap";
    div.style.overflow = "hidden";
    div.style.width = "200px";
    div.style.fontWeight = "bold";
    mxUtils.write(div, title);

    return div;
  }

  /**
   *
   */
  createStepper(
    input,
    update,
    step,
    height,
    disableFocus?,
    defaultValue?,
    isFloat?,
  ) {
    return this.newStepper().create(
      input,
      update,
      step,
      height,
      disableFocus,
      defaultValue,
      isFloat,
    );
  }

  newStepper() {
    const { editorUi, format, container } = this;
    return new Stepper(format, editorUi, container);
  }

  /**
   * Adds the given option.
   */
  createOption(label, isCheckedFn, setCheckedFn, listener) {
    const { editorUi, format, container } = this;
    return new FormatOption(format, editorUi, container).createOption(
      label,
      isCheckedFn,
      setCheckedFn,
      listener,
    );
  }

  /**
   * The string 'null' means use null in values.
   */
  createCellOption(
    label,
    key,
    defaultValue,
    enabledValue,
    disabledValue,
    fn?,
    action?,
    stopEditing?,
  ) {
    return this.newCellOption().createCellOption(
      label,
      key,
      defaultValue,
      enabledValue,
      disabledValue,
      fn,
      action,
      stopEditing,
    );
  }

  newCellOption() {
    return new CellOption(this.format, this.editorUi, this.container);
  }

  /**
   * Adds the given color option.
   */
  createColorOption(
    label,
    getColorFn,
    setColorFn,
    defaultColor,
    listener,
    callbackFn?,
    hideCheckbox?,
  ) {
    return this.newColorOption().createColorOption(
      label,
      getColorFn,
      setColorFn,
      defaultColor,
      listener,
      callbackFn,
      hideCheckbox,
    );
  }

  newColorOption() {
    return new ColorOption(this.format, this.editorUi, this.container);
  }

  /**
   *
   */
  createCellColorOption(
    label,
    colorKey,
    defaultColor?,
    callbackFn?,
    setStyleFn?,
  ) {
    this.newCellColorOption().create(
      label,
      colorKey,
      defaultColor,
      callbackFn,
      setStyleFn,
    );
  }

  newCellColorOption() {
    return new CellColorOption(this.format, this.editorUi, this.container);
  }

  /**
   *
   */
  addArrow(elt, height?) {
    height = height != null ? height : 10;

    var arrow = document.createElement("div");
    arrow.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
    arrow.style.padding = "6px";
    arrow.style.paddingRight = "4px";

    var m = 10 - height;

    if (m == 2) {
      arrow.style.paddingTop = 6 + "px";
    } else if (m > 0) {
      arrow.style.paddingTop = 6 - m + "px";
    } else {
      arrow.style.marginTop = "-2px";
    }

    arrow.style.height = height + "px";
    arrow.style.borderLeft = "1px solid #a0a0a0";
    arrow.innerHTML = '<img border="0" src="' +
      (mxClient.IS_SVG
        ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII="
        : IMAGE_PATH + "/dropdown.png") +
      '" style="margin-bottom:4px;">';
    mxUtils.setOpacity(arrow, 70);

    var symbol = elt.getElementsByTagName("div")[0];

    if (symbol != null) {
      symbol.style.paddingRight = "6px";
      symbol.style.marginLeft = "4px";
      symbol.style.marginTop = "-1px";
      symbol.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
      mxUtils.setOpacity(symbol, 60);
    }

    mxUtils.setOpacity(elt, 100);
    elt.style.border = "1px solid #a0a0a0";
    elt.style.backgroundColor = this.buttonBackgroundColor;
    elt.style.backgroundImage = "none";
    elt.style.width = "auto";
    elt.className += " geColorBtn";
    mxUtils.setPrefixedStyle(elt.style, "borderRadius", "3px");

    elt.appendChild(arrow);

    return symbol;
  }

  /**
   *
   */
  addUnitInput(
    container,
    _unit,
    right,
    width,
    update,
    step?,
    marginTop?,
    disableFocus?,
    isFloat?,
  ) {
    marginTop = marginTop != null ? marginTop : 0;

    var input = document.createElement("input");
    input.style.position = "absolute";
    input.style.textAlign = "right";
    input.style.marginTop = "-2px";
    input.style.right = right + 12 + "px";
    input.style.width = width + "px";
    container.appendChild(input);

    var stepper = this.createStepper(
      input,
      update,
      step,
      null,
      disableFocus,
      null,
      isFloat,
    );
    stepper.style.marginTop = marginTop - 2 + "px";
    stepper.style.right = right + "px";
    container.appendChild(stepper);

    return input;
  }

  /**
   *
   */
  createRelativeOption(label, key, width?, handler?, init?) {
    width = width != null ? width : 44;

    var graph = this.editorUi.editor.graph;
    var div = this.createPanel();
    div.style.paddingTop = "10px";
    div.style.paddingBottom = "10px";
    mxUtils.write(div, label);
    div.style.fontWeight = "bold";

    var update = (evt) => {
      if (handler != null) {
        handler(input);
      } else {
        var value: any = parseInt(input.value);
        value = Math.min(100, Math.max(0, isNaN(value) ? 100 : value));
        var state = graph.view.getState(graph.getSelectionCell());

        if (state != null && value != mxUtils.getValue(state.style, key, 100)) {
          // Removes entry in style (assumes 100 is default for relative values)
          if (value == 100) {
            value = null;
          }

          graph.setCellStyles(key, value, graph.getSelectionCells());
          this.editorUi.fireEvent(
            new mxEventObject(
              "styleChanged",
              "keys",
              [key],
              "values",
              [value],
              "cells",
              graph.getSelectionCells(),
            ),
          );
        }

        input.value = (value != null ? value : "100") + " %";
      }

      mxEvent.consume(evt);
    };

    var input = this.addUnitInput(
      div,
      "%",
      20,
      width,
      update,
      10,
      -15,
      handler != null,
    );

    if (key != null) {
      var listener = (_sender?, _evt?, force?) => {
        if (force || input != document.activeElement) {
          var ss = this.format.getSelectionState();
          var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
          input.value = isNaN(tmp) ? "" : tmp + " %";
        }
      };

      mxEvent.addListener(input, "keydown", (e) => {
        if (e.keyCode == 13) {
          graph.container.focus();
          mxEvent.consume(e);
        } else if (e.keyCode == 27) {
          listener(null, null, true);
          graph.container.focus();
          mxEvent.consume(e);
        }
      });

      graph.getModel().addListener(mxEvent.CHANGE, listener);
      this.listeners.push({
        destroy: function () {
          graph.getModel().removeListener(listener);
        },
      });
      listener();
    }

    mxEvent.addListener(input, "blur", update);
    mxEvent.addListener(input, "change", update);

    if (init != null) {
      init(input);
    }

    return div;
  }

  /**
   *
   */
  addLabel(div, title, right, width?) {
    width = width != null ? width : 61;

    var label = document.createElement("div");
    mxUtils.write(label, title);
    label.style.position = "absolute";
    label.style.right = right + "px";
    label.style.width = width + "px";
    label.style.marginTop = "6px";
    label.style.textAlign = "center";
    div.appendChild(label);
  }

  /**
   *
   */
  addKeyHandler(input, listener) {
    mxEvent.addListener(input, "keydown", (e) => {
      if (e.keyCode == 13) {
        this.editorUi.editor.graph.container.focus();
        mxEvent.consume(e);
      } else if (e.keyCode == 27) {
        if (listener != null) {
          listener(null, null, true);
        }

        this.editorUi.editor.graph.container.focus();
        mxEvent.consume(e);
      }
    });
  }

  styleButtons(elts) {
    this.buttons.style(elts);
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  destroy() {
    if (this.listeners != null) {
      for (var i = 0; i < this.listeners.length; i++) {
        this.listeners[i].destroy();
      }
      this.listeners = [];
    }
  }
}
