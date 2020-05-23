export class TextToolbar {
  /**
   * Hides the current menu.
   */
  create() {
    var graph = this.editorUi.editor.graph;

    var styleElt = this.addMenu(
      "",
      mxResources.get("style"),
      true,
      "formatBlock",
    );
    styleElt.style.position = "relative";
    styleElt.style.whiteSpace = "nowrap";
    styleElt.style.overflow = "hidden";
    styleElt.innerHTML = mxResources.get("style") + this.dropdownImageHtml;

    if (EditorUI.compactUi) {
      styleElt.style.paddingRight = "18px";
      styleElt.getElementsByTagName("img")[0].style.right = "1px";
      styleElt.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.fontMenu = this.addMenu(
      "",
      mxResources.get("fontFamily"),
      true,
      "fontFamily",
    );
    this.fontMenu.style.position = "relative";
    this.fontMenu.style.whiteSpace = "nowrap";
    this.fontMenu.style.overflow = "hidden";
    this.fontMenu.style.width = mxClient.IS_QUIRKS ? "80px" : "60px";

    this.setFontName(Menus.prototype.defaultFont);

    if (EditorUI.compactUi) {
      this.fontMenu.style.paddingRight = "18px";
      this.fontMenu.getElementsByTagName("img")[0].style.right = "1px";
      this.fontMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.sizeMenu = this.addMenu(
      Menus.prototype.defaultFontSize,
      mxResources.get("fontSize"),
      true,
      "fontSize",
    );
    this.sizeMenu.style.position = "relative";
    this.sizeMenu.style.whiteSpace = "nowrap";
    this.sizeMenu.style.overflow = "hidden";
    this.sizeMenu.style.width = mxClient.IS_QUIRKS ? "44px" : "24px";

    this.setFontSize(Menus.prototype.defaultFontSize);

    if (EditorUI.compactUi) {
      this.sizeMenu.style.paddingRight = "18px";
      this.sizeMenu.getElementsByTagName("img")[0].style.right = "1px";
      this.sizeMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    var elts = this.addItems([
      "-",
      "undo",
      "redo",
      "-",
      "bold",
      "italic",
      "underline",
    ]);
    elts[1].setAttribute(
      "title",
      mxResources.get("undo") +
        " (" +
        this.editorUi.actions.get("undo").shortcut +
        ")",
    );
    elts[2].setAttribute(
      "title",
      mxResources.get("redo") +
        " (" +
        this.editorUi.actions.get("redo").shortcut +
        ")",
    );
    elts[4].setAttribute(
      "title",
      mxResources.get("bold") +
        " (" +
        this.editorUi.actions.get("bold").shortcut +
        ")",
    );
    elts[5].setAttribute(
      "title",
      mxResources.get("italic") +
        " (" +
        this.editorUi.actions.get("italic").shortcut +
        ")",
    );
    elts[6].setAttribute(
      "title",
      mxResources.get("underline") +
        " (" +
        this.editorUi.actions.get("underline").shortcut +
        ")",
    );

    // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
    // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
    var alignMenu = this.addMenuFunction(
      "",
      mxResources.get("align"),
      false,
      (menu) => {
        elt = menu.addItem(
          "",
          null,
          (evt) => {
            graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
          },
          null,
          "geIcon geSprite geSprite-left",
        );
        elt.setAttribute("title", mxResources.get("left"));

        elt = menu.addItem(
          "",
          null,
          (evt) => {
            graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
          },
          null,
          "geIcon geSprite geSprite-center",
        );
        elt.setAttribute("title", mxResources.get("center"));

        elt = menu.addItem(
          "",
          null,
          (evt) => {
            graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
          },
          null,
          "geIcon geSprite geSprite-right",
        );
        elt.setAttribute("title", mxResources.get("right"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("justifyfull", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-justifyfull",
        );
        elt.setAttribute("title", mxResources.get("justifyfull"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("insertorderedlist", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-orderedlist",
        );
        elt.setAttribute("title", mxResources.get("numberedList"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("insertunorderedlist", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-unorderedlist",
        );
        elt.setAttribute("title", mxResources.get("bulletedList"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("outdent", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-outdent",
        );
        elt.setAttribute("title", mxResources.get("decreaseIndent"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("indent", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-indent",
        );
        elt.setAttribute("title", mxResources.get("increaseIndent"));
      },
    );

    alignMenu.style.position = "relative";
    alignMenu.style.whiteSpace = "nowrap";
    alignMenu.style.overflow = "hidden";
    alignMenu.innerHTML =
      '<div class="geSprite geSprite-left" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    alignMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";

    if (EditorUI.compactUi) {
      alignMenu.getElementsByTagName("img")[0].style.left = "22px";
      alignMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    var formatMenu = this.addMenuFunction(
      "",
      mxResources.get("format"),
      false,
      (menu) => {
        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("subscript").funct,
          null,
          "geIcon geSprite geSprite-subscript",
        );
        elt.setAttribute(
          "title",
          mxResources.get("subscript") + " (" + this.ctrlKey + "+,)",
        );

        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("superscript").funct,
          null,
          "geIcon geSprite geSprite-superscript",
        );
        elt.setAttribute(
          "title",
          mxResources.get("superscript") + " (" + this.ctrlKey + "+.)",
        );

        // KNOWN: IE+FF don't return keyboard focus after color dialog (calling focus doesn't help)
        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("fontColor").funct,
          null,
          "geIcon geSprite geSprite-fontcolor",
        );
        elt.setAttribute("title", mxResources.get("fontColor"));

        elt = menu.addItem(
          "",
          null,
          this.editorUi.actions.get("backgroundColor").funct,
          null,
          "geIcon geSprite geSprite-fontbackground",
        );
        elt.setAttribute("title", mxResources.get("backgroundColor"));

        elt = menu.addItem(
          "",
          null,
          () => {
            document.execCommand("removeformat", false, undefined);
          },
          null,
          "geIcon geSprite geSprite-removeformat",
        );
        elt.setAttribute("title", mxResources.get("removeFormat"));
      },
    );

    formatMenu.style.position = "relative";
    formatMenu.style.whiteSpace = "nowrap";
    formatMenu.style.overflow = "hidden";
    formatMenu.innerHTML =
      '<div class="geSprite geSprite-dots" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    formatMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";

    if (EditorUI.compactUi) {
      formatMenu.getElementsByTagName("img")[0].style.left = "22px";
      formatMenu.getElementsByTagName("img")[0].style.top = "5px";
    }

    this.addSeparator();

    this.addButton(
      "geIcon geSprite geSprite-code",
      mxResources.get("html"),
      function () {
        graph.cellEditor.toggleViewMode();

        if (
          graph.cellEditor.textarea.innerHTML.length > 0 &&
          (graph.cellEditor.textarea.innerHTML != "&nbsp;" ||
            !graph.cellEditor.clearOnChange)
        ) {
          window.setTimeout(function () {
            document.execCommand("selectAll", false, undefined);
          });
        }
      },
    );

    this.addSeparator();

    // FIXME: Uses geButton here and geLabel in main menu
    var insertMenu = this.addMenuFunction(
      "",
      mxResources.get("insert"),
      true,
      (menu) => {
        menu.addItem(mxResources.get("insertLink"), null, () => {
          this.editorUi.actions.get("link").funct();
        });

        menu.addItem(mxResources.get("insertImage"), null, () => {
          this.editorUi.actions.get("image").funct();
        });

        menu.addItem(mxResources.get("insertHorizontalRule"), null, () => {
          document.execCommand("inserthorizontalrule", false, undefined);
        });
      },
    );

    insertMenu.style.whiteSpace = "nowrap";
    insertMenu.style.overflow = "hidden";
    insertMenu.style.position = "relative";
    insertMenu.innerHTML =
      '<div class="geSprite geSprite-plus" style="margin-left:-4px;margin-top:-3px;"></div>' +
      this.dropdownImageHtml;
    insertMenu.style.width = mxClient.IS_QUIRKS ? "36px" : "16px";

    // Fix for item size in kennedy theme
    if (EditorUI.compactUi) {
      insertMenu.getElementsByTagName("img")[0].style.left = "24px";
      insertMenu.getElementsByTagName("img")[0].style.top = "5px";
      insertMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";
    }

    this.addSeparator();
    new TableElement.create();
  }
}
