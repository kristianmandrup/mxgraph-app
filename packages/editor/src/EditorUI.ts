import mx from "@mxgraph-app/mx";
import { MenuManager } from "@mxgraph-app/menus";
import resources from "@mxgraph-app/resources";
import {
  ErrorDialog,
  Dialog,
  ColorDialog,
  OpenDialog,
  LinkDialog,
  EditDataDialog,
  ChangePageSetup,
  FilenameDialog,
  Openfile,
} from "@mxgraph-app/dialogs";
import { Toolbar } from "@mxgraph-app/toolbar";
import { Sidebar } from "@mxgraph-app/sidebar";
import { Format } from "@mxgraph-app/format";
const {
  mxOutline,
  mxMorphing,
  mxImage,
  mxClient,
  mxRectangle,
  mxEventObject,
  mxPoint,
  mxEvent,
  mxUtils,
  mxResources,
  mxPopupMenu,
  mxXmlRequest,
} = mx;

const { urlParams, SAVE_URL, MAX_REQUEST_SIZE } = resources;

const Graph: any = {};
const Editor: any = {};

export class EditorUI {
  chromelessToolbar: any;
  layersDialog: any;
  keyHandler: any;
  keydownHandler: any;
  keyupHandler: any;
  resizeHandler: any;
  gestureHandler: any;
  orientationChangeHandler: any;
  scrollHandler: any;

  documentMode: any;
  dialogs: any[] = [];
  dialog: any;
  destroyFunctions: any = [];
  actions: any;
  editor: any;
  container: any;
  sidebar: any;
  toolbar: any;
  menubarContainer: any;
  toolbarContainer: any;
  sidebarContainer: any;
  sidebarFooterContainer: any;
  formatContainer: any;
  diagramContainer: any;
  footerContainer: any;
  tabContainer: any;
  statusContainer: any;
  menus: any;
  menubar: any;
  hsplit: any;
  format: any;
  $openFile: any;
  updateDocumentTitle: any; // fn
  addListener: any;

  refresh() {
    // use Refresher
  }

  /**
   * Global config that specifies if the compact UI elements should be used.
   */
  static compactUi = true;

  /**
   * Specifies the size of the split bar.
   */
  splitSize = mxClient.IS_TOUCH || mxClient.IS_POINTER ? 12 : 8;

  /**
   * Specifies the height of the menubar. Default is 30.
   */
  menubarHeight = 30;

  /**
   * Specifies the width of the format panel should be enabled. Default is true.
   */
  formatEnabled = true;

  /**
   * Specifies the width of the format panel. Default is 240.
   */
  formatWidth = 240;

  /**
   * Specifies the height of the toolbar. Default is 38.
   */
  toolbarHeight = 38;

  /**
   * Specifies the height of the footer. Default is 28.
   */
  footerHeight = 28;

  /**
   * Specifies the height of the optional sidebarFooterContainer. Default is 34.
   */
  sidebarFooterHeight = 34;

  /**
   * Specifies the position of the horizontal split bar. Default is 240 or 118 for
   * screen widths <= 640px.
   */
  hsplitPosition =
    screen.width <= 640
      ? 118
      : urlParams["sidebar-entries"] != "large"
      ? 212
      : 240;

  /**
   * Specifies if animations are allowed in <executeLayout>. Default is true.
   */
  allowAnimation = true;

  /**
   * Default is 2.
   */
  lightboxMaxFitScale = 2;

  /**
   * Default is 4.
   */
  lightboxVerticalDivider = 4;

  /**
   * Specifies if single click on horizontal split should collapse sidebar. Default is false.
   */
  hsplitClickEnabled = false;

  /**
   * "Installs" menus in EditorUi.
   */
  createMenus() {
    return new MenuManager(this);
  }

  init(url) {
    // editorUiInit.apply(this, arguments);
    this.actions.get("export").setEnabled(false);

    // Updates action states which require a backend
    if (!Editor.useLocalStorage) {
      mxUtils.post(url, "", this.onOpen, this.onError);
    }
  }

  onOpen = (req) => {
    var enabled = req.getStatus() != 404;
    this.actions.get("open").setEnabled(enabled || Graph.fileSupport);
    this.actions.get("import").setEnabled(enabled || Graph.fileSupport);
    this.actions.get("save").setEnabled(enabled);
    this.actions.get("saveAs").setEnabled(enabled);
    this.actions.get("export").setEnabled(enabled);
  };

  onError = (_err) => {};

  fireEvent(_event) {
    // this.fireEvent(new mxEventObject("backgroundColorChanged"));
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setBackgroundColor(value) {
    this.editor.graph.background = value;
    this.editor.graph.view.validateBackground();

    this.fireEvent(new mxEventObject("backgroundColorChanged"));
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setFoldingEnabled(value) {
    this.editor.graph.foldingEnabled = value;
    this.editor.graph.view.revalidate();
    this.fireEvent(new mxEventObject("foldingEnabledChanged"));
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setPageFormat(value) {
    this.editor.graph.pageFormat = value;
    if (!this.editor.graph.pageVisible) {
      this.actions.get("pageView").funct();
    } else {
      this.editor.graph.view.validateBackground();
      this.editor.graph.sizeDidChange();
    }
    this.fireEvent(new mxEventObject("pageFormatChanged"));
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setPageScale(value) {
    this.editor.graph.pageScale = value;

    if (!this.editor.graph.pageVisible) {
      this.actions.get("pageView").funct();
    } else {
      this.editor.graph.view.validateBackground();
      this.editor.graph.sizeDidChange();
    }
    this.fireEvent(new mxEventObject("pageScaleChanged"));
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setGridColor(value) {
    this.editor.graph.view.gridColor = value;
    this.editor.graph.view.validateBackground();
    this.fireEvent(new mxEventObject("gridColorChanged"));
  }

  /**
   * Updates the states of the given undo/redo items.
   */
  addUndoListener() {
    var undo = this.actions.get("undo");
    var redo = this.actions.get("redo");

    var undoMgr = this.editor.undoManager;
    var undoListener = () => {
      undo.setEnabled(this.canUndo());
      redo.setEnabled(this.canRedo());
    };

    undoMgr.addListener(mxEvent.ADD, undoListener);
    undoMgr.addListener(mxEvent.UNDO, undoListener);
    undoMgr.addListener(mxEvent.REDO, undoListener);
    undoMgr.addListener(mxEvent.CLEAR, undoListener);

    // Overrides cell editor to update action states
    var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

    this.editor.graph.cellEditor.startEditing = () => {
      cellEditorStartEditing.apply(this, arguments);
      undoListener();
    };

    var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

    this.editor.graph.cellEditor.stopEditing = (_cell, _trigger) => {
      cellEditorStopEditing.apply(this, arguments);
      undoListener();
    };

    // Updates the button states once
    undoListener();
  }

  zeroOffset = new mxPoint(0, 0);

  getDiagramContainerOffset() {
    return this.zeroOffset;
  }

  /**
   * Creates the required containers.
   */
  createTabContainer() {
    return null;
  }

  /**
   * Creates the required containers.
   */
  createDivs() {
    this.menubarContainer = this.createDiv("geMenubarContainer");
    this.toolbarContainer = this.createDiv("geToolbarContainer");
    this.sidebarContainer = this.createDiv("geSidebarContainer");
    this.formatContainer = this.createDiv(
      "geSidebarContainer geFormatContainer"
    );
    this.diagramContainer = this.createDiv("geDiagramContainer");
    this.footerContainer = this.createDiv("geFooterContainer");
    this.hsplit = this.createDiv("geHsplit");
    this.hsplit.setAttribute("title", mxResources.get("collapseExpand"));

    // Sets static style for containers
    this.menubarContainer.style.top = "0px";
    this.menubarContainer.style.left = "0px";
    this.menubarContainer.style.right = "0px";
    this.toolbarContainer.style.left = "0px";
    this.toolbarContainer.style.right = "0px";
    this.sidebarContainer.style.left = "0px";
    this.formatContainer.style.right = "0px";
    this.formatContainer.style.zIndex = "1";
    this.diagramContainer.style.right =
      (this.format != null ? this.formatWidth : 0) + "px";
    this.footerContainer.style.left = "0px";
    this.footerContainer.style.right = "0px";
    this.footerContainer.style.bottom = "0px";
    this.footerContainer.style.zIndex = mxPopupMenu.prototype.zIndex - 2;
    this.hsplit.style.width = this.splitSize + "px";
    this.sidebarFooterContainer = this.createSidebarFooterContainer();

    if (this.sidebarFooterContainer) {
      this.sidebarFooterContainer.style.left = "0px";
    }

    if (!this.editor.chromeless) {
      this.tabContainer = this.createTabContainer();
    } else {
      this.diagramContainer.style.border = "none";
    }
  }

  /**
   * Hook for sidebar footer container. This implementation returns null.
   */
  createSidebarFooterContainer() {
    return null;
  }

  /**
   * Creates the required containers.
   */
  createUi() {
    // Creates menubar
    this.menubar = this.editor.chromeless
      ? null
      : this.menus.createMenubar(this.createDiv("geMenubar"));

    if (this.menubar != null) {
      this.menubarContainer.appendChild(this.menubar.container);
    }

    // Adds status bar in menubar
    if (this.menubar != null) {
      this.statusContainer = this.createStatusContainer();

      // Connects the status bar to the editor status
      this.editor.addListener("statusChanged", () => {
        this.setStatusText(this.editor.getStatus());
      });

      this.setStatusText(this.editor.getStatus());
      this.menubar.container.appendChild(this.statusContainer);

      // Inserts into DOM
      this.container.appendChild(this.menubarContainer);
    }

    // Creates the sidebar
    this.sidebar = this.editor.chromeless
      ? null
      : this.createSidebar(this.sidebarContainer);

    if (this.sidebar != null) {
      this.container.appendChild(this.sidebarContainer);
    }

    // Creates the format sidebar
    this.format =
      this.editor.chromeless || !this.formatEnabled
        ? null
        : this.createFormat(this.formatContainer);

    if (this.format != null) {
      this.container.appendChild(this.formatContainer);
    }

    // Creates the footer
    var footer = this.editor.chromeless ? null : this.createFooter();

    if (footer != null) {
      this.footerContainer.appendChild(footer);
      this.container.appendChild(this.footerContainer);
    }

    if (this.sidebar != null && this.sidebarFooterContainer) {
      this.container.appendChild(this.sidebarFooterContainer);
    }

    this.container.appendChild(this.diagramContainer);

    if (this.container != null && this.tabContainer != null) {
      this.container.appendChild(this.tabContainer);
    }

    // Creates toolbar
    this.toolbar = this.editor.chromeless
      ? null
      : this.createToolbar(this.createDiv("geToolbar"));

    if (this.toolbar != null) {
      this.toolbarContainer.appendChild(this.toolbar.container);
      this.container.appendChild(this.toolbarContainer);
    }

    // HSplit
    if (this.sidebar != null) {
      this.container.appendChild(this.hsplit);

      this.addSplitHandler(this.hsplit, true, 0, (value) => {
        this.hsplitPosition = value;
        this.refresh();
      });
    }
  }

  /**
   * Creates a new toolbar for the given container.
   */
  createStatusContainer() {
    var container = document.createElement("a");
    container.className = "geItem geStatus";

    if (screen.width < 420) {
      container.style.maxWidth = Math.max(20, screen.width - 320) + "px";
      container.style.overflow = "hidden";
    }

    return container;
  }

  /**
   * Creates a new toolbar for the given container.
   */
  setStatusText(value) {
    this.statusContainer.innerHTML = value;
  }

  /**
   * Creates a new toolbar for the given container.
   */
  createToolbar(container) {
    return new Toolbar(this, container);
  }

  /**
   * Creates a new sidebar for the given container.
   */
  createSidebar(container) {
    return new Sidebar(this, container);
  }

  /**
   * Creates a new sidebar for the given container.
   */
  createFormat(container) {
    return new Format(this, container);
  }

  /**
   * Creates and returns a new footer.
   */
  createFooter() {
    return this.createDiv("geFooter");
  }

  /**
   * Creates the actual toolbar for the toolbar container.
   */
  createDiv(classname) {
    var elt = document.createElement("div");
    elt.className = classname;

    return elt;
  }

  /**
   * Updates the states of the given undo/redo items.
   */
  addSplitHandler(elt, horizontal, dx, onChange) {
    var start: any;
    var initial: any;
    var ignoreClick: any;
    var last: any;

    // Disables built-in pan and zoom in IE10 and later
    if (mxClient.IS_POINTER) {
      elt.style.touchAction = "none";
    }

    var getValue = () => {
      var result = parseInt(horizontal ? elt.style.left : elt.style.bottom);

      // Takes into account hidden footer
      if (!horizontal) {
        result = result + dx - this.footerHeight;
      }

      return result;
    };

    const moveHandler = (evt) => {
      if (start != null) {
        var pt = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
        onChange(
          Math.max(
            0,
            initial + (horizontal ? pt.x - start.x : start.y - pt.y) - dx
          )
        );
        mxEvent.consume(evt);

        if (initial != getValue()) {
          ignoreClick = true;
          last = null;
        }
      }
    };

    function dropHandler(evt) {
      moveHandler(evt);
      initial = null;
      start = null;
    }

    mxEvent.addGestureListeners(
      elt,
      (evt) => {
        start = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
        initial = getValue();
        ignoreClick = false;
        mxEvent.consume(evt);
      },
      null,
      null
    );

    mxEvent.addListener(elt, "click", (evt) => {
      if (!ignoreClick && this.hsplitClickEnabled) {
        var next = last != null ? last - dx : 0;
        last = getValue();
        onChange(next);
        mxEvent.consume(evt);
      }
    });

    mxEvent.addGestureListeners(document, null, moveHandler, dropHandler);

    this.destroyFunctions.push(function () {
      mxEvent.removeGestureListeners(document, null, moveHandler, dropHandler);
    });
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  handleError(resp, title, fn, invokeFnOnClose, _notFoundMessage) {
    var e = resp != null && resp.error != null ? resp.error : resp;

    if (e != null || title != null) {
      var msg = mxUtils.htmlEntities(mxResources.get("unknownError"));
      var btn = mxResources.get("ok");
      title = title != null ? title : mxResources.get("error");

      if (e != null && e.message != null) {
        msg = mxUtils.htmlEntities(e.message);
      }

      this.showError(
        title,
        msg,
        btn,
        fn,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        invokeFnOnClose ? fn : null
      );
    } else if (fn != null) {
      fn();
    }
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  showError(
    title,
    msg,
    btn,
    fn,
    retry,
    btn2,
    fn2,
    btn3,
    fn3,
    w,
    h,
    hide,
    onClose
  ) {
    var dlg = new ErrorDialog(this, title, msg, btn || mxResources.get("ok"), {
      fn,
      retry,
      btn2,
      fn2,
      hide,
      btn3,
      fn3,
    });
    var lines = Math.ceil(msg != null ? msg.length / 50 : 1);
    this.showDialog(
      dlg.container,
      w || 340,
      h || 100 + lines * 20,
      true,
      false,
      onClose
    );
    dlg.init();
  }

  /**
   * Displays a print dialog.
   */
  showDialog(
    elt,
    w,
    h,
    modal,
    closable,
    onClose?,
    noScroll?,
    transparent?,
    onResize?,
    ignoreBgClick?
  ) {
    this.editor.graph.tooltipHandler.hideTooltip();

    if (this.dialogs == null) {
      this.dialogs = [];
    }

    this.dialog = new Dialog(
      this,
      elt,
      w,
      h,
      modal,
      closable,
      onClose,
      noScroll,
      transparent,
      onResize,
      ignoreBgClick
    );
    this.dialogs.push(this.dialog);
  }

  /**
   * Displays a print dialog.
   */
  hideDialog(cancel, isEsc?) {
    if (this.dialogs != null && this.dialogs.length > 0) {
      var dlg = this.dialogs.pop();

      if (dlg.close(cancel, isEsc) == false) {
        //add the dialog back if dialog closing is cancelled
        this.dialogs.push(dlg);
        return;
      }

      this.dialog =
        this.dialogs.length > 0 ? this.dialogs[this.dialogs.length - 1] : null;
      this.editor.fireEvent(new mxEventObject("hideDialog"));

      if (
        this.dialog == null &&
        this.editor.graph.container.style.visibility != "hidden"
      ) {
        window.setTimeout(() => {
          if (
            this.editor.graph.isEditing() &&
            this.editor.graph.cellEditor.textarea != null
          ) {
            this.editor.graph.cellEditor.textarea.focus();
          } else {
            mxUtils.clearSelection();
            this.editor.graph.container.focus();
          }
        }, 0);
      }
    }
  }

  /**
   * Display a color dialog.
   */
  pickColor(color, apply) {
    var graph = this.editor.graph;
    var selState = graph.cellEditor.saveSelection();
    var h =
      226 +
      (Math.ceil(ColorDialog.prototype.presetColors.length / 12) +
        Math.ceil(ColorDialog.prototype.defaultColors.length / 12)) *
        17;

    var dlg = new ColorDialog(
      this,
      color || "none",
      function (color) {
        graph.cellEditor.restoreSelection(selState);
        apply(color);
      },
      function () {
        graph.cellEditor.restoreSelection(selState);
      }
    );
    this.showDialog(dlg.container, 230, h, true, false);
    dlg.init();
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  openFile() {
    // Closes dialog after open
    this.$openFile = new Openfile((cancel) => {
      this.hideDialog(cancel);
    });

    // Removes openFile if dialog is closed
    this.showDialog(
      new OpenDialog(this).container,
      Editor.useLocalStorage ? 640 : 320,
      Editor.useLocalStorage ? 480 : 220,
      true,
      true,
      () => {
        this.$openFile = null;
      },
      null,
      null
    );
  }

  /**
   * Extracs the graph model from the given HTML data from a data transfer event.
   */
  extractGraphModelFromHtml(data) {
    var result = null;

    try {
      var idx = data.indexOf("&lt;mxGraphModel ");

      if (idx >= 0) {
        var idx2 = data.lastIndexOf("&lt;/mxGraphModel&gt;");

        if (idx2 > idx) {
          result = data
            .substring(idx, idx2 + 21)
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/\\&quot;/g, '"')
            .replace(/\n/g, "");
        }
      }
    } catch (e) {
      // ignore
    }

    return result;
  }

  /**
   * Opens the given files in the editor.
   */
  extractGraphModelFromEvent(evt) {
    var result: any;
    var data: any;

    const { documentMode } = this;

    if (evt != null) {
      var provider =
        evt.dataTransfer != null ? evt.dataTransfer : evt.clipboardData;

      if (provider != null) {
        if (documentMode == 10 || documentMode == 11) {
          data = provider.getData("Text");
        } else {
          data =
            mxUtils.indexOf(provider.types, "text/html") >= 0
              ? provider.getData("text/html")
              : null;

          if (
            mxUtils.indexOf(
              provider.types,
              "text/plain" && (data == null || data.length == 0)
            )
          ) {
            data = provider.getData("text/plain");
          }
        }

        if (data != null) {
          data = Graph.zapGremlins(mxUtils.trim(data));

          // Tries parsing as HTML document with embedded XML
          var xml = this.extractGraphModelFromHtml(data);

          if (xml != null) {
            data = xml;
          }
        }
      }
    }

    if (data != null && this.isCompatibleString(data)) {
      result = data;
    }

    return result;
  }

  /**
   * Hook for subclassers to return true if event data is a supported format.
   * This implementation always returns false.
   */
  isCompatibleString(_data) {
    return false;
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  saveFile(forceDialog) {
    if (!forceDialog && this.editor.filename != null) {
      this.save(this.editor.getOrCreateFilename());
    } else {
      var dlg = new FilenameDialog(
        this,
        this.editor.getOrCreateFilename(),
        mxResources.get("save"),
        (name) => {
          this.save(name);
        },
        null,
        (name) => {
          if (name != null && name.length > 0) {
            return true;
          }

          mxUtils.confirm(mxResources.get("invalidName"));

          return false;
        }
      );
      this.showDialog(dlg.container, 300, 100, true, true);
      dlg.init();
    }
  }

  /**
   * Saves the current graph under the given filename.
   */
  save(name) {
    if (name != null) {
      if (this.editor.graph.isEditing()) {
        this.editor.graph.stopEditing();
      }

      var xml = mxUtils.getXml(this.editor.getGraphXml());

      try {
        if (Editor.useLocalStorage) {
          if (
            localStorage.getItem(name) != null &&
            !mxUtils.confirm(mxResources.get("replaceIt", [name]))
          ) {
            return;
          }

          localStorage.setItem(name, xml);
          this.editor.setStatus(
            mxUtils.htmlEntities(mxResources.get("saved")) + " " + new Date()
          );
        } else {
          if (xml.length < MAX_REQUEST_SIZE) {
            const req = new mxXmlRequest(
              SAVE_URL,
              "filename=" +
                encodeURIComponent(name) +
                "&xml=" +
                encodeURIComponent(xml),
              null,
              null,
              null,
              null
            );
            req.simulate(document, "_blank");
          } else {
            mxUtils.alert(mxResources.get("drawingTooLarge"));
            mxUtils.popup(xml);

            return;
          }
        }

        this.editor.setModified(false);
        this.editor.setFilename(name);
        this.updateDocumentTitle();
      } catch (e) {
        this.editor.setStatus(
          mxUtils.htmlEntities(mxResources.get("errorSavingFile"))
        );
      }
    }
  }

  /**
   * Executes the given layout.
   */
  executeLayout(exec, animate, post) {
    var graph = this.editor.graph;

    if (graph.isEnabled()) {
      graph.getModel().beginUpdate();
      try {
        exec();
      } catch (e) {
        throw e;
      } finally {
        // Animates the changes in the graph model except
        // for Camino, where animation is too slow
        if (
          this.allowAnimation &&
          animate &&
          (navigator.userAgent == null ||
            navigator.userAgent.indexOf("Camino") < 0)
        ) {
          // New API for animating graph layout results asynchronously
          var morph = new mxMorphing(graph);
          morph.addListener(mxEvent.DONE, () => {
            graph.getModel().endUpdate();

            if (post != null) {
              post();
            }
          });

          morph.startAnimation();
        } else {
          graph.getModel().endUpdate();

          if (post != null) {
            post();
          }
        }
      }
    }
  }

  /**
   * Hides the current menu.
   */
  showImageDialog(title, value, fn, _ignoreExisting) {
    var cellEditor = this.editor.graph.cellEditor;
    var selState = cellEditor.saveSelection();
    var newValue = mxUtils.prompt(title, value);
    cellEditor.restoreSelection(selState);

    if (newValue != null && newValue.length > 0) {
      var img = new Image();

      img.onload = function () {
        fn(newValue, img.width, img.height);
      };
      img.onerror = function () {
        fn(null);
        mxUtils.alert(mxResources.get("fileNotFound"));
      };

      img.src = newValue;
    } else {
      fn(null);
    }
  }

  /**
   * Hides the current menu.
   */
  showLinkDialog(value, btnLabel, fn) {
    var dlg = new LinkDialog(this, value, btnLabel, fn);
    this.showDialog(dlg.container, 420, 90, true, true);
    dlg.init();
  }

  /**
   * Hides the current menu.
   */
  showDataDialog(cell) {
    if (cell != null) {
      var dlg = new EditDataDialog(this, cell);
      this.showDialog(dlg.container, 480, 420, true, false, null, false);
      dlg.init();
    }
  }

  /**
   * Hides the current menu.
   */
  showBackgroundImageDialog(apply) {
    apply =
      apply != null
        ? apply
        : (image) => {
            var change = new ChangePageSetup(this, null, image);
            change.ignoreColor = true;

            this.editor.graph.model.execute(change);
          };

    var newValue = mxUtils.prompt(mxResources.get("backgroundImage"), "");

    if (newValue != null && newValue.length > 0) {
      var img = new Image();

      img.onload = function () {
        apply(new mxImage(newValue, img.width, img.height));
      };
      img.onerror = function () {
        apply(null);
        mxUtils.alert(mxResources.get("fileNotFound"));
      };

      img.src = newValue;
    } else {
      apply(null);
    }
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setBackgroundImage(image) {
    this.editor.graph.setBackgroundImage(image);
    this.editor.graph.view.validateBackgroundImage();

    this.fireEvent(new mxEventObject("backgroundImageChanged"));
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  confirm(msg, okFn, cancelFn) {
    if (mxUtils.confirm(msg)) {
      if (okFn != null) {
        okFn();
      }
    } else if (cancelFn != null) {
      cancelFn();
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  createOutline(_wnd) {
    var outline = new mxOutline(this.editor.graph, undefined);
    outline.border = 20;

    mxEvent.addListener(window, "resize", () => {
      outline.update(null);
    });

    this.addListener("pageFormatChanged", () => {
      outline.update(null);
    });
    return outline;
  }

  // Alt+Shift+Keycode mapping to action
  altShiftActions = {
    67: "clearWaypoints", // Alt+Shift+C
    65: "connectionArrows", // Alt+Shift+A
    76: "editLink", // Alt+Shift+L
    80: "connectionPoints", // Alt+Shift+P
    84: "editTooltip", // Alt+Shift+T
    86: "pasteSize", // Alt+Shift+V
    88: "copySize", // Alt+Shift+X
  };

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  destroy() {
    if (this.editor != null) {
      this.editor.destroy();
      this.editor = null;
    }

    if (this.menubar != null) {
      this.menubar.destroy();
      this.menubar = null;
    }

    if (this.toolbar != null) {
      this.toolbar.destroy();
      this.toolbar = null;
    }

    if (this.sidebar != null) {
      this.sidebar.destroy();
      this.sidebar = null;
    }

    if (this.keyHandler != null) {
      this.keyHandler.destroy();
      this.keyHandler = null;
    }

    if (this.keydownHandler != null) {
      mxEvent.removeListener(document, "keydown", this.keydownHandler);
      this.keydownHandler = null;
    }

    if (this.keyupHandler != null) {
      mxEvent.removeListener(document, "keyup", this.keyupHandler);
      this.keyupHandler = null;
    }

    if (this.resizeHandler != null) {
      mxEvent.removeListener(window, "resize", this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.gestureHandler != null) {
      mxEvent.removeGestureListeners(document, this.gestureHandler, null, null);
      this.gestureHandler = null;
    }

    if (this.orientationChangeHandler != null) {
      mxEvent.removeListener(
        window,
        "orientationchange",
        this.orientationChangeHandler
      );
      this.orientationChangeHandler = null;
    }

    if (this.scrollHandler != null) {
      mxEvent.removeListener(window, "scroll", this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.destroyFunctions != null) {
      for (var i = 0; i < this.destroyFunctions.length; i++) {
        this.destroyFunctions[i]();
      }

      this.destroyFunctions = null;
    }

    var c = [
      this.menubarContainer,
      this.toolbarContainer,
      this.sidebarContainer,
      this.formatContainer,
      this.diagramContainer,
      this.footerContainer,
      this.chromelessToolbar,
      this.hsplit,
      this.sidebarFooterContainer,
      this.layersDialog,
    ];

    for (var i = 0; i < c.length; i++) {
      if (c[i] != null && c[i].parentNode != null) {
        c[i].parentNode.removeChild(c[i]);
      }
    }
  }

  /**
   * Returns the URL for a copy of this editor with no state.
   */
  canRedo() {
    return this.editor.graph.isEditing() || this.editor.undoManager.canRedo();
  }

  /**
   * Returns the URL for a copy of this editor with no state.
   */
  canUndo() {
    return this.editor.graph.isEditing() || this.editor.undoManager.canUndo();
  }

  /**
   *
   */
  getEditBlankXml() {
    return mxUtils.getXml(this.editor.getGraphXml());
  }

  /**
   * Returns the URL for a copy of this editor with no state.
   */
  getUrl(pathname) {
    var href = pathname != null ? pathname : window.location.pathname;
    var parms = href.indexOf("?") > 0 ? 1 : 0;

    // Removes template URL parameter for new blank diagram
    for (var key in urlParams) {
      if (parms == 0) {
        href += "?";
      } else {
        href += "&";
      }

      href += key + "=" + urlParams[key];
      parms++;
    }

    return href;
  }

  /**
   * Specifies if the graph has scrollbars.
   */
  setScrollbars(value) {
    var graph = this.editor.graph;
    var prev = graph.container.style.overflow;
    graph.scrollbars = value;
    this.editor.updateGraphComponents();

    if (prev != graph.container.style.overflow) {
      graph.container.scrollTop = 0;
      graph.container.scrollLeft = 0;
      graph.view.scaleAndTranslate(1, 0, 0);
      this.resetScrollbars();
    }

    this.fireEvent(new mxEventObject("scrollbarsChanged"));
  }

  /**
   * Returns true if the graph has scrollbars.
   */
  hasScrollbars() {
    return this.editor.graph.scrollbars;
  }

  /**
   * Resets the state of the scrollbars.
   */
  resetScrollbars() {
    var graph = this.editor.graph;

    if (!this.editor.extendCanvas) {
      graph.container.scrollTop = 0;
      graph.container.scrollLeft = 0;

      if (!mxUtils.hasScrollbars(graph.container)) {
        graph.view.setTranslate(0, 0);
      }
    } else if (!this.editor.isChromelessView()) {
      if (mxUtils.hasScrollbars(graph.container)) {
        if (graph.pageVisible) {
          var pad = graph.getPagePadding();
          graph.container.scrollTop =
            Math.floor(pad.y - this.editor.initialTopSpacing) - 1;
          graph.container.scrollLeft =
            Math.floor(
              Math.min(
                pad.x,
                (graph.container.scrollWidth - graph.container.clientWidth) / 2
              )
            ) - 1;

          // Scrolls graph to visible area
          var bounds = graph.getGraphBounds();

          if (bounds.width > 0 && bounds.height > 0) {
            if (
              bounds.x >
              graph.container.scrollLeft + graph.container.clientWidth * 0.9
            ) {
              graph.container.scrollLeft = Math.min(
                bounds.x + bounds.width - graph.container.clientWidth,
                bounds.x - 10
              );
            }

            if (
              bounds.y >
              graph.container.scrollTop + graph.container.clientHeight * 0.9
            ) {
              graph.container.scrollTop = Math.min(
                bounds.y + bounds.height - graph.container.clientHeight,
                bounds.y - 10
              );
            }
          }
        } else {
          var bounds = graph.getGraphBounds();
          var width = Math.max(
            bounds.width,
            graph.scrollTileSize.width * graph.view.scale
          );
          var height = Math.max(
            bounds.height,
            graph.scrollTileSize.height * graph.view.scale
          );
          graph.container.scrollTop = Math.floor(
            Math.max(
              0,
              bounds.y -
                Math.max(20, (graph.container.clientHeight - height) / 4)
            )
          );
          graph.container.scrollLeft = Math.floor(
            Math.max(
              0,
              bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)
            )
          );
        }
      } else {
        var b = mxRectangle.fromRectangle(
          graph.pageVisible
            ? graph.view.getBackgroundPageBounds()
            : graph.getGraphBounds()
        );
        var tr = graph.view.translate;
        var s = graph.view.scale;
        b.x = b.x / s - tr.x;
        b.y = b.y / s - tr.y;
        b.width /= s;
        b.height /= s;

        var dy = graph.pageVisible
          ? 0
          : Math.max(0, (graph.container.clientHeight - b.height) / 4);

        graph.view.setTranslate(
          Math.floor(
            Math.max(0, (graph.container.clientWidth - b.width) / 2) - b.x + 2
          ),
          Math.floor(dy - b.y + 1)
        );
      }
    }
  }

  /**
   * Loads the stylesheet for this graph.
   */
  setPageVisible(value) {
    var graph = this.editor.graph;
    var hasScrollbars = mxUtils.hasScrollbars(graph.container);
    var tx = 0;
    var ty = 0;

    if (hasScrollbars) {
      tx =
        graph.view.translate.x * graph.view.scale - graph.container.scrollLeft;
      ty =
        graph.view.translate.y * graph.view.scale - graph.container.scrollTop;
    }

    graph.pageVisible = value;
    graph.pageBreaksVisible = value;
    graph.preferPageSize = value;
    graph.view.validateBackground();

    // Workaround for possible handle offset
    if (hasScrollbars) {
      var cells = graph.getSelectionCells();
      graph.clearSelection();
      graph.setSelectionCells(cells);
    }

    // Calls updatePageBreaks
    graph.sizeDidChange();

    if (hasScrollbars) {
      graph.container.scrollLeft =
        graph.view.translate.x * graph.view.scale - tx;
      graph.container.scrollTop =
        graph.view.translate.y * graph.view.scale - ty;
    }

    this.fireEvent(new mxEventObject("pageViewChanged"));
  }
}
