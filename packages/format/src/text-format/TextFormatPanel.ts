import { BaseFormatPanel } from "../BaseFormatPanel";
import mx from "@mxgraph-app/mx";
import { UpdateCssHandler } from "./helpers/UpdateCssHandler";
import { BackgroundPanel } from "./panels/BackgroundPanel";
import { FontColorPanel } from "./panels/FontColorPanel";
import { ExtraPanel } from "./panels/ExtraPanel";
import { InputHandler } from "./helpers/InputHandler";
import { ContainerPanel } from "./panels/ContainerPanel";
import { PositionChangeListener } from "./listener/PositionChangeListener";
const { mxConstants, mxClient, mxResources, mxEvent, mxUtils } = mx;

/**
 * Adds the label menu items to the given menu and parent.
 */
export class TextFormatPanel extends BaseFormatPanel {
  ctrlKey: any; // Editor.ctrlKey
  selection: any; // document.selection
  documentMode: any; // document.documentMode

  protected _spacingPanel: any;
  protected _fontStyleItems: any;
  protected _bottomSpacing: any;
  /**
   * Sets the default font family and size
   */
  defaultFont = "Helvetica";
  defaultFontSize = "12";

  constructor(format, editorUi, container) {
    super(format, editorUi, container);
    this.init();
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    this.container.style.borderBottom = "none";
    this.addFont(this.container);
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addFont(container) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();

    var title = this.createTitle(mxResources.get("font"));
    title.style.paddingLeft = "18px";
    title.style.paddingTop = "10px";
    title.style.paddingBottom = "6px";
    container.appendChild(title);

    var stylePanel = this.createStylePanel();

    if (mxClient.IS_QUIRKS) {
      stylePanel.style.display = "block";
    }

    if (graph.cellEditor.isContentEditing()) {
      var cssPanel = stylePanel.cloneNode();

      var cssMenu = this.createCssMenu();

      var arrow = cssMenu.getElementsByTagName("div")[0];
      arrow.style.cssFloat = "right";
      container.appendChild(cssPanel);
    }

    container.appendChild(stylePanel);

    var colorPanel = this.createColorPanel();

    var fontMenu = this.editorUi.toolbar.addMenu(
      "Helvetica",
      mxResources.get("fontFamily"),
      true,
      "fontFamily",
      stylePanel,
      null,
      true
    );
    fontMenu.style.color = "rgb(112, 112, 112)";
    fontMenu.style.whiteSpace = "nowrap";
    fontMenu.style.overflow = "hidden";
    fontMenu.style.margin = "0px";

    this.addArrow(fontMenu);
    fontMenu.style.width = "192px";
    fontMenu.style.height = "15px";

    var stylePanel2: any = stylePanel.cloneNode(false);
    stylePanel2.style.marginLeft = "-3px";

    var verticalItem = this.editorUi.toolbar.addItems(
      ["vertical"],
      stylePanel2,
      true
    )[0];

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(container);
    }

    container.appendChild(stylePanel2);

    this.styleButtons(fontStyleItems);
    this.styleButtons([verticalItem]);

    var stylePanel3: any = stylePanel.cloneNode(false);
    stylePanel3.style.marginLeft = "-3px";
    stylePanel3.style.paddingBottom = "0px";

    // Helper function to return a wrapper function does not pass any arguments
    var callFn = (fn) => {
      return fn();
    };

    var left = this.editorUi.toolbar.addButton(
      "geSprite-left",
      mxResources.get("left"),
      graph.cellEditor.isContentEditing()
        ? function (evt) {
            graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
          }
        : callFn(
            this.editorUi.menus.createStyleChangeFunction(
              [mxConstants.STYLE_ALIGN],
              [mxConstants.ALIGN_LEFT]
            )
          ),
      stylePanel3
    );
    var center = this.editorUi.toolbar.addButton(
      "geSprite-center",
      mxResources.get("center"),
      graph.cellEditor.isContentEditing()
        ? function (evt) {
            graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
          }
        : callFn(
            this.editorUi.menus.createStyleChangeFunction(
              [mxConstants.STYLE_ALIGN],
              [mxConstants.ALIGN_CENTER]
            )
          ),
      stylePanel3
    );
    var right = this.editorUi.toolbar.addButton(
      "geSprite-right",
      mxResources.get("right"),
      graph.cellEditor.isContentEditing()
        ? function (evt) {
            graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
          }
        : callFn(
            this.editorUi.menus.createStyleChangeFunction(
              [mxConstants.STYLE_ALIGN],
              [mxConstants.ALIGN_RIGHT]
            )
          ),
      stylePanel3
    );

    this.styleButtons([left, center, right]);

    // Quick hack for strikethrough
    // TODO: Add translations and toggle state
    if (graph.cellEditor.isContentEditing()) {
      var strike = this.editorUi.toolbar.addButton(
        "geSprite-removeformat",
        mxResources.get("strikethrough"),
        function () {
          document.execCommand("strikeThrough", false);
        },
        stylePanel2
      );
      this.styleButtons([strike]);

      strike.firstChild.style.background =
        "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPjwvZGVmcz48Y2xpcFBhdGggaWQ9ImIiPjx1c2UgeGxpbms6aHJlZj0iI2EiIG92ZXJmbG93PSJ2aXNpYmxlIi8+PC9jbGlwUGF0aD48cGF0aCBjbGlwLXBhdGg9InVybCgjYikiIGZpbGw9IiMwMTAxMDEiIGQ9Ik03LjI0IDguNzVjLS4yNi0uNDgtLjM5LTEuMDMtLjM5LTEuNjcgMC0uNjEuMTMtMS4xNi40LTEuNjcuMjYtLjUuNjMtLjkzIDEuMTEtMS4yOS40OC0uMzUgMS4wNS0uNjMgMS43LS44My42Ni0uMTkgMS4zOS0uMjkgMi4xOC0uMjkuODEgMCAxLjU0LjExIDIuMjEuMzQuNjYuMjIgMS4yMy41NCAxLjY5Ljk0LjQ3LjQuODMuODggMS4wOCAxLjQzLjI1LjU1LjM4IDEuMTUuMzggMS44MWgtMy4wMWMwLS4zMS0uMDUtLjU5LS4xNS0uODUtLjA5LS4yNy0uMjQtLjQ5LS40NC0uNjgtLjItLjE5LS40NS0uMzMtLjc1LS40NC0uMy0uMS0uNjYtLjE2LTEuMDYtLjE2LS4zOSAwLS43NC4wNC0xLjAzLjEzLS4yOS4wOS0uNTMuMjEtLjcyLjM2LS4xOS4xNi0uMzQuMzQtLjQ0LjU1LS4xLjIxLS4xNS40My0uMTUuNjYgMCAuNDguMjUuODguNzQgMS4yMS4zOC4yNS43Ny40OCAxLjQxLjdINy4zOWMtLjA1LS4wOC0uMTEtLjE3LS4xNS0uMjV6TTIxIDEydi0ySDN2Mmg5LjYyYy4xOC4wNy40LjE0LjU1LjIuMzcuMTcuNjYuMzQuODcuNTEuMjEuMTcuMzUuMzYuNDMuNTcuMDcuMi4xMS40My4xMS42OSAwIC4yMy0uMDUuNDUtLjE0LjY2LS4wOS4yLS4yMy4zOC0uNDIuNTMtLjE5LjE1LS40Mi4yNi0uNzEuMzUtLjI5LjA4LS42My4xMy0xLjAxLjEzLS40MyAwLS44My0uMDQtMS4xOC0uMTNzLS42Ni0uMjMtLjkxLS40MmMtLjI1LS4xOS0uNDUtLjQ0LS41OS0uNzUtLjE0LS4zMS0uMjUtLjc2LS4yNS0xLjIxSDYuNGMwIC41NS4wOCAxLjEzLjI0IDEuNTguMTYuNDUuMzcuODUuNjUgMS4yMS4yOC4zNS42LjY2Ljk4LjkyLjM3LjI2Ljc4LjQ4IDEuMjIuNjUuNDQuMTcuOS4zIDEuMzguMzkuNDguMDguOTYuMTMgMS40NC4xMy44IDAgMS41My0uMDkgMi4xOC0uMjhzMS4yMS0uNDUgMS42Ny0uNzljLjQ2LS4zNC44Mi0uNzcgMS4wNy0xLjI3cy4zOC0xLjA3LjM4LTEuNzFjMC0uNi0uMS0xLjE0LS4zMS0xLjYxLS4wNS0uMTEtLjExLS4yMy0uMTctLjMzSDIxeiIvPjwvc3ZnPg==)";
      strike.firstChild.style.backgroundPosition = "2px 2px";
      strike.firstChild.style.backgroundSize = "18px 18px";

      this.styleButtons([strike]);
    }

    var top = this.editorUi.toolbar.addButton(
      "geSprite-top",
      mxResources.get("top"),
      callFn(
        this.editorUi.menus.createStyleChangeFunction(
          [mxConstants.STYLE_VERTICAL_ALIGN],
          [mxConstants.ALIGN_TOP]
        )
      ),
      stylePanel3
    );
    var middle = this.editorUi.toolbar.addButton(
      "geSprite-middle",
      mxResources.get("middle"),
      callFn(
        this.editorUi.menus.createStyleChangeFunction(
          [mxConstants.STYLE_VERTICAL_ALIGN],
          [mxConstants.ALIGN_MIDDLE]
        )
      ),
      stylePanel3
    );
    var bottom = this.editorUi.toolbar.addButton(
      "geSprite-bottom",
      mxResources.get("bottom"),
      callFn(
        this.editorUi.menus.createStyleChangeFunction(
          [mxConstants.STYLE_VERTICAL_ALIGN],
          [mxConstants.ALIGN_BOTTOM]
        )
      ),
      stylePanel3
    );

    this.styleButtons([top, middle, bottom]);

    if (mxClient.IS_QUIRKS) {
      mxUtils.br(container);
    }

    container.appendChild(stylePanel3);

    // Hack for updating UI state below based on current text selection
    // currentTable is the current selected DOM table updated below
    var sub, sup, full, tableWrapper, currentTable, tableCell, tableRow;

    if (graph.cellEditor.isContentEditing()) {
      top.style.display = "none";
      middle.style.display = "none";
      bottom.style.display = "none";
      verticalItem.style.display = "none";

      full = this.editorUi.toolbar.addButton(
        "geSprite-justifyfull",
        mxResources.get("block"),
        function () {
          if (full.style.opacity == 1) {
            document.execCommand("justifyfull", false, undefined);
          }
        },
        stylePanel3
      );
      full.style.marginRight = "9px";
      full.style.opacity = 1;

      this.styleToolbarButtons();
      sub.style.marginLeft = "9px";

      var tmp = stylePanel3.cloneNode(false);
      tmp.style.paddingTop = "4px";
      var btns = [
        this.editorUi.toolbar.addButton(
          "geSprite-orderedlist",
          mxResources.get("numberedList"),
          function () {
            document.execCommand("insertorderedlist", false);
          },
          tmp
        ),
        this.editorUi.toolbar.addButton(
          "geSprite-unorderedlist",
          mxResources.get("bulletedList"),
          function () {
            document.execCommand("insertunorderedlist", false);
          },
          tmp
        ),
        this.editorUi.toolbar.addButton(
          "geSprite-outdent",
          mxResources.get("decreaseIndent"),
          function () {
            document.execCommand("outdent", false);
          },
          tmp
        ),
        this.editorUi.toolbar.addButton(
          "geSprite-indent",
          mxResources.get("increaseIndent"),
          function () {
            document.execCommand("indent", false);
          },
          tmp
        ),
        this.editorUi.toolbar.addButton(
          "geSprite-removeformat",
          mxResources.get("removeFormat"),
          function () {
            document.execCommand("removeformat", false);
          },
          tmp
        ),
        this.editorUi.toolbar.addButton(
          "geSprite-code",
          mxResources.get("html"),
          function () {
            graph.cellEditor.toggleViewMode();
          },
          tmp
        ),
      ];
      this.styleButtons(btns);
      btns[btns.length - 2].style.marginLeft = "9px";

      if (mxClient.IS_QUIRKS) {
        mxUtils.br(container);
        tmp.style.height = "40";
      }

      container.appendChild(tmp);
    } else {
      fontStyleItems[2].style.marginRight = "9px";
      right.style.marginRight = "9px";
    }

    // Label position
    var stylePanel4: any = stylePanel.cloneNode(false);
    stylePanel4.style.marginLeft = "0px";
    stylePanel4.style.paddingTop = "8px";
    stylePanel4.style.paddingBottom = "4px";
    stylePanel4.style.fontWeight = "normal";

    mxUtils.write(stylePanel4, mxResources.get("position"));

    // Adds label position options
    var positionSelect = document.createElement("select");
    positionSelect.style.position = "absolute";
    positionSelect.style.right = "20px";
    positionSelect.style.width = "97px";
    positionSelect.style.marginTop = "-2px";

    var directions = [
      "topLeft",
      "top",
      "topRight",
      "left",
      "center",
      "right",
      "bottomLeft",
      "bottom",
      "bottomRight",
    ];

    for (var i = 0; i < directions.length; i++) {
      var positionOption = document.createElement("option");
      positionOption.setAttribute("value", directions[i]);
      mxUtils.write(positionOption, mxResources.get(directions[i]));
      positionSelect.appendChild(positionOption);
    }

    stylePanel4.appendChild(positionSelect);

    // Writing direction
    var stylePanel5: any = stylePanel.cloneNode(false);
    stylePanel5.style.marginLeft = "0px";
    stylePanel5.style.paddingTop = "4px";
    stylePanel5.style.paddingBottom = "4px";
    stylePanel5.style.fontWeight = "normal";

    mxUtils.write(stylePanel5, mxResources.get("writingDirection"));

    // Adds writing direction options
    // LATER: Handle reselect of same option in all selects (change event
    // is not fired for same option so have opened state on click) and
    // handle multiple different styles for current selection
    var dirSelect = this.createDirSelect();

    // NOTE: For automatic we use the value null since automatic
    // requires the text to be non formatted and non-wrapped
    var dirs = ["automatic", "leftToRight", "rightToLeft"];
    var dirSet = {
      automatic: null,
      leftToRight: mxConstants.TEXT_DIRECTION_LTR,
      rightToLeft: mxConstants.TEXT_DIRECTION_RTL,
    };

    for (var i = 0; i < dirs.length; i++) {
      var dirOption = document.createElement("option");
      dirOption.setAttribute("value", dirs[i]);
      mxUtils.write(dirOption, mxResources.get(dirs[i]));
      dirSelect.appendChild(dirOption);
    }

    stylePanel5.appendChild(dirSelect);

    if (!graph.isEditing()) {
      container.appendChild(stylePanel4);

      new PositionChangeListener().add();

      // LATER: Update dir in text editor while editing and update style with label
      // NOTE: The tricky part is handling and passing on the auto value
      container.appendChild(stylePanel5);

      mxEvent.addListener(dirSelect, "change", function (evt) {
        graph.setCellStyles(
          mxConstants.STYLE_TEXT_DIRECTION,
          dirSet[dirSelect.value],
          graph.getSelectionCells()
        );
        mxEvent.consume(evt);
      });
    }

    // Font size
    var input = this.createFontSizeInput();
    stylePanel2.appendChild(input);

    // Workaround for font size 4 if no text is selected is update font size below
    // after first character was entered (as the font element is lazy created)
    var pendingFontSize = null;

    var inputUpdate = this.createInputHandler();

    var stepper = this.createStyledStepper();

    stylePanel2.appendChild(stepper);

    var arrow = fontMenu.getElementsByTagName("div")[0];
    arrow.style.cssFloat = "right";

    var bgColorApply: any;
    var currentBgColor: any = "#ffffff";

    var fontColorApply: any;
    var currentFontColor = "#000000";

    var bgPanel = this.createBgPanel();

    var borderPanel = this.createCellColorOption(
      mxResources.get("borderColor"),
      mxConstants.STYLE_LABEL_BORDERCOLOR,
      "#000000"
    );
    borderPanel.style.fontWeight = "bold";

    var panel = this.createFontColorPanel();

    colorPanel.appendChild(panel);
    colorPanel.appendChild(bgPanel);

    if (!graph.cellEditor.isContentEditing()) {
      colorPanel.appendChild(borderPanel);
    }

    container.appendChild(colorPanel);

    this.createExtraPanel();

    var span = this.createSpan();
    mxUtils.write(span, mxResources.get("spacing"));
    const { spacingPanel } = this;
    spacingPanel.appendChild(span);

    mxUtils.br(spacingPanel);
    this.addLabel(spacingPanel, mxResources.get("top"), 91);
    this.addLabel(spacingPanel, mxResources.get("global"), 20);
    mxUtils.br(spacingPanel);
    mxUtils.br(spacingPanel);

    mxUtils.br(spacingPanel);
    this.addLabel(spacingPanel, mxResources.get("left"), 162);
    this.addLabel(spacingPanel, mxResources.get("bottom"), 91);
    this.addLabel(spacingPanel, mxResources.get("right"), 20);

    this.appendPanelToContainer();

    this.addKeyHandlers(input);
    const { listener } = this;

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({
      destroy: function () {
        graph.getModel().removeListener(listener);
      },
    });
    listener();

    if (graph.cellEditor.isContentEditing()) {
      new UpdateCssHandler().create();
    }
    return container;
  }

  createStyledStepper() {
    var stepper = this.createStepper(
      input,
      inputUpdate,
      1,
      10,
      true,
      this.defaultFontSize
    );
    stepper.style.display = input.style.display;
    stepper.style.marginTop = "4px";

    if (!mxClient.IS_QUIRKS) {
      stepper.style.right = "20px";
    }
    return stepper;
  }

  createDirSelect() {
    const dirSelect = document.createElement("select");
    dirSelect.style.position = "absolute";
    dirSelect.style.right = "20px";
    dirSelect.style.width = "97px";
    dirSelect.style.marginTop = "-2px";
    return dirSelect;
  }

  createStylePanel() {
    var stylePanel = this.createPanel();
    stylePanel.style.paddingTop = "2px";
    stylePanel.style.paddingBottom = "2px";
    stylePanel.style.position = "relative";
    stylePanel.style.marginLeft = "-2px";
    stylePanel.style.borderWidth = "0px";
    stylePanel.className = "geToolbarContainer";
    return stylePanel;
  }

  styleToolbarButtons() {
    this.styleButtons([
      full,
      (sub = this.editorUi.toolbar.addButton(
        "geSprite-subscript",
        mxResources.get("subscript") + " (" + this.ctrlKey + "+,)",
        function () {
          document.execCommand("subscript", false);
        },
        stylePanel3
      )),
      (sup = this.editorUi.toolbar.addButton(
        "geSprite-superscript",
        mxResources.get("superscript") + " (" + this.ctrlKey + "+.)",
        function () {
          document.execCommand("superscript", false);
        },
        stylePanel3
      )),
    ]);
  }

  createSpan() {
    const span = document.createElement("div");
    span.style.position = "absolute";
    span.style.width = "70px";
    span.style.marginTop = "0px";
    span.style.fontWeight = "bold";
    return span;
  }

  createInputHandler() {
    return new InputHandler().create();
  }

  createExtraPanel() {
    return new ExtraPanel().create();
  }

  createFontColorPanel() {
    return new FontColorPanel().create();
  }

  createBgPanel() {
    return new BackgroundPanel().create();
  }

  createCssMenu() {
    var cssMenu = this.editorUi.toolbar.addMenu(
      mxResources.get("style"),
      mxResources.get("style"),
      true,
      "formatBlock",
      cssPanel,
      null,
      true
    );
    cssMenu.style.color = "rgb(112, 112, 112)";
    cssMenu.style.whiteSpace = "nowrap";
    cssMenu.style.overflow = "hidden";
    cssMenu.style.margin = "0px";
    this.addArrow(cssMenu);
    cssMenu.style.width = "192px";
    cssMenu.style.height = "15px";
    return cssMenu;
  }

  get fontStyleItems() {
    this._fontStyleItems = this._fontStyleItems || this.createFontStyleItems();
    return this._fontStyleItems;
  }

  protected createFontStyleItems() {
    const fontStyleItems = this.editorUi.toolbar.addItems(
      ["bold", "italic", "underline"],
      stylePanel2,
      true
    );

    fontStyleItems[0].setAttribute(
      "title",
      mxResources.get("bold") +
        " (" +
        this.editorUi.actions.get("bold").shortcut +
        ")"
    );
    fontStyleItems[1].setAttribute(
      "title",
      mxResources.get("italic") +
        " (" +
        this.editorUi.actions.get("italic").shortcut +
        ")"
    );
    fontStyleItems[2].setAttribute(
      "title",
      mxResources.get("underline") +
        " (" +
        this.editorUi.actions.get("underline").shortcut +
        ")"
    );
    return fontStyleItems;
  }

  addKeyHandlers(input) {
    const {
      listener,
      globalSpacing,
      topSpacing,
      rightSpacing,
      bottomSpacing,
      leftSpacing,
    } = this;
    this.addKeyHandler(input, listener);
    this.addKeyHandler(globalSpacing, listener);
    this.addKeyHandler(topSpacing, listener);
    this.addKeyHandler(rightSpacing, listener);
    this.addKeyHandler(bottomSpacing, listener);
    this.addKeyHandler(leftSpacing, listener);
  }

  setSelected = (elt, selected) => {
    if (mxClient.IS_IE && (mxClient.IS_QUIRKS || this.documentMode < 10)) {
      elt.style.filter = selected
        ? "progid:DXImageTransform.Microsoft.Gradient(" +
          "StartColorStr='#c5ecff', EndColorStr='#87d4fb', GradientType=0)"
        : "";
    } else {
      elt.style.backgroundImage = selected
        ? "linear-gradient(#c5ecff 0px,#87d4fb 100%)"
        : "";
    }
  };

  createFontSizeInput() {
    var input = document.createElement("input");
    input.style.textAlign = "right";
    input.style.marginTop = "4px";

    if (!mxClient.IS_QUIRKS) {
      input.style.position = "absolute";
      input.style.right = "32px";
    }

    input.style.width = "46px";
    input.style.height = mxClient.IS_QUIRKS ? "21px" : "17px";
    return input;
  }

  appendPanelToContainer() {
    return new ContainerPanel().append();
  }

  listener = (_sender?, _evt?, force?) => {
    const { setSelected, fontStyleItems } = this;
    let ss = this.format.getSelectionState();
    var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
    setSelected(
      fontStyleItems[0],
      (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD
    );
    setSelected(
      fontStyleItems[1],
      (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC
    );
    setSelected(
      fontStyleItems[2],
      (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE
    );
    fontMenu.firstChild.nodeValue = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_FONTFAMILY,
      this.defaultFont
    );

    setSelected(
      verticalItem,
      mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, "1") == "0"
    );

    if (force || document.activeElement != input) {
      var tmp = parseFloat(
        mxUtils.getValue(
          ss.style,
          mxConstants.STYLE_FONTSIZE,
          this.defaultFontSize
        )
      );
      input.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    var align = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_ALIGN,
      mxConstants.ALIGN_CENTER
    );
    setSelected(left, align == mxConstants.ALIGN_LEFT);
    setSelected(center, align == mxConstants.ALIGN_CENTER);
    setSelected(right, align == mxConstants.ALIGN_RIGHT);

    var valign = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_VERTICAL_ALIGN,
      mxConstants.ALIGN_MIDDLE
    );
    setSelected(top, valign == mxConstants.ALIGN_TOP);
    setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
    setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);

    var pos = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_LABEL_POSITION,
      mxConstants.ALIGN_CENTER
    );
    var vpos = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_VERTICAL_LABEL_POSITION,
      mxConstants.ALIGN_MIDDLE
    );

    if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP) {
      positionSelect.value = "topLeft";
    } else if (
      pos == mxConstants.ALIGN_CENTER &&
      vpos == mxConstants.ALIGN_TOP
    ) {
      positionSelect.value = "top";
    } else if (
      pos == mxConstants.ALIGN_RIGHT &&
      vpos == mxConstants.ALIGN_TOP
    ) {
      positionSelect.value = "topRight";
    } else if (
      pos == mxConstants.ALIGN_LEFT &&
      vpos == mxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = "bottomLeft";
    } else if (
      pos == mxConstants.ALIGN_CENTER &&
      vpos == mxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = "bottom";
    } else if (
      pos == mxConstants.ALIGN_RIGHT &&
      vpos == mxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = "bottomRight";
    } else if (pos == mxConstants.ALIGN_LEFT) {
      positionSelect.value = "left";
    } else if (pos == mxConstants.ALIGN_RIGHT) {
      positionSelect.value = "right";
    } else {
      positionSelect.value = "center";
    }

    var dir = mxUtils.getValue(
      ss.style,
      mxConstants.STYLE_TEXT_DIRECTION,
      mxConstants.DEFAULT_TEXT_DIRECTION
    );

    if (dir == mxConstants.TEXT_DIRECTION_RTL) {
      dirSelect.value = "rightToLeft";
    } else if (dir == mxConstants.TEXT_DIRECTION_LTR) {
      dirSelect.value = "leftToRight";
    } else if (dir == mxConstants.TEXT_DIRECTION_AUTO) {
      dirSelect.value = "automatic";
    }

    if (force || document.activeElement != globalSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING, 2)
      );
      globalSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != topSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_TOP, 0)
      );
      topSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != rightSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_RIGHT, 0)
      );
      rightSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != bottomSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_BOTTOM, 0)
      );
      bottomSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }

    if (force || document.activeElement != leftSpacing) {
      var tmp = parseFloat(
        mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_LEFT, 0)
      );
      leftSpacing.value = isNaN(tmp) ? "" : tmp + " pt";
    }
  };

  get topSpacing() {
    return this.addUnitInput(
      this.spacingPanel,
      "pt",
      91,
      44,
      () => this.topUpdate
    );
  }

  get globalSpacing() {
    return this.addUnitInput(
      this.spacingPanel,
      "pt",
      20,
      44,
      () => this.globalUpdate
    );
  }

  get spacingPanel() {
    this._spacingPanel = this._spacingPanel || this.createSpacingPanel();
    return this._spacingPanel;
  }

  protected createSpacingPanel() {
    const spacingPanel = this.createPanel();
    spacingPanel.style.paddingTop = "10px";
    spacingPanel.style.paddingBottom = "28px";
    spacingPanel.style.fontWeight = "normal";
    return spacingPanel;
  }

  get leftSpacing() {
    return this.addUnitInput(
      this.spacingPanel,
      "pt",
      162,
      44,
      () => this.leftUpdate
    );
  }

  get bottomSpacing() {
    this._bottomSpacing = this.bottomSpacing || this.createBottomSpacing();
    return this._bottomSpacing;
  }

  createBottomSpacing() {
    return this.addUnitInput(
      this.spacingPanel,
      "pt",
      91,
      44,
      () => this.bottomUpdate
    );
  }

  get rightSpacing() {
    return this.addUnitInput(
      this.spacingPanel,
      "pt",
      20,
      44,
      () => this.rightUpdate
    );
  }

  get globalUpdate() {
    return this.installInputHandler(
      this.globalSpacing,
      mxConstants.STYLE_SPACING,
      2,
      -999,
      999,
      " pt"
    );
  }

  get topUpdate() {
    return this.installInputHandler(
      this.topSpacing,
      mxConstants.STYLE_SPACING_TOP,
      0,
      -999,
      999,
      " pt"
    );
  }

  get rightUpdate() {
    return this.installInputHandler(
      this.rightSpacing,
      mxConstants.STYLE_SPACING_RIGHT,
      0,
      -999,
      999,
      " pt"
    );
  }

  get bottomUpdate() {
    return this.installInputHandler(
      this.bottomSpacing,
      mxConstants.STYLE_SPACING_BOTTOM,
      0,
      -999,
      999,
      " pt"
    );
  }

  get leftUpdate() {
    return this.installInputHandler(
      this.leftSpacing,
      mxConstants.STYLE_SPACING_LEFT,
      0,
      -999,
      999,
      " pt"
    );
  }

  createColorPanel() {
    const colorPanel = this.createPanel();
    colorPanel.style.marginTop = "8px";
    colorPanel.style.borderTop = "1px solid #c0c0c0";
    colorPanel.style.paddingTop = "6px";
    colorPanel.style.paddingBottom = "6px";
    return colorPanel;
  }
}
