import mx from "@mxgraph-app/mx";
import pako from "pako";
import Base64 from "Base64";
import html_sanitize from "sanitize-html";
const {
  mxGeometry,
  mxCell,
  mxConnectionConstraint,
  mxDictionary,
  mxGraphModel,
  mxCodec,
  mxFastOrganicLayout,
  mxCircleLayout,
  mxHierarchicalLayout,
  mxCompactTreeLayout,
  mxStackLayout,
  mxLayoutManager,
  mxImage,
  mxObjectIdentity,
  mxRectangle,
  mxCellRenderer,
  mxEventObject,
  mxConstants,
  mxClient,
  mxResources,
  mxPoint,
  mxEvent,
  mxGraph,
  mxUtils,
} = mx;

import resources from "resources/resources";
import { GraphConstructor } from "./GraphConstructor";
import { TableRowLayout } from "./table/TableRowLayout";
import { TableLayout } from "./table/TableLayout";
const { urlParams, IMAGE_PATH } = resources;

/**
 * Constructs a new graph instance. Note that the constructor does not take a
 * container because the graph instance is needed for creating the UI, which
 * in turn will create the container for the graph. Hence, the container is
 * assigned later in EditorUi.
 */
/**
 * Defines graph class.
 */
export class Graph {
  container: any;
  model: any;
  renderHint: any;
  stylesheet: any;
  themes: any;
  currentEdgeStyle: any;
  currentVertexStyle: any;
  defaultEdgeStyle: any;
  defaultVertexStyle: any;
  domainUrl: any;
  domainPathUrl: any;
  isHtmlLabel: any;
  getCurrentCellStyle: any;
  addListener: any;
  addMouseListener: any;
  cellRenderer: any;
  isEnabled: any;
  view: any;
  dateFormatCache: any;
  isCellVisible: any; // (cell) => void
  isSelectionEmpty: any; // () => void
  addCells: any; // ([realTarget], target, null, null, null, true)
  layoutManager: any;
  isCellLocked: any; // (cell) => boolean
  gridSize: any;
  graph: any;
  cloneCell: any; // (cell) => any
  getCellsBeyond: any; // (cell) => [any]
  zoomFactor: any;
  setSelectionCells: any; // (cell) => void
  setSelectionCell: any; // (cell) => void
  getCellGeometry: any; // (cell) => any
  clearSelection: any; // () => void
  scrollCellToVisible: any; // (cell) => any
  isSwimlane: any; // (cell) => boolean
  getCompositeParent: any; // (cell) => any
  createCurrentEdgeStyle: any; // () => void
  insertEdge: any; // (mxGraph)
  isCellCollapsed: any; // (cell) => boolean
  getFoldableCells: any; // (cells) => any
  getSelectionCells: any; // () => any
  getDefaultParent: any; // () => any
  foldingEnabled?: boolean;
  isEditing: any; // () => boolean
  stopEditing: any; // (boolean) => void
  escape: any; // () => any
  createVertex: any; //
  cloneCells: any; // (cells, null, cloneMap) => void
  setCellStyles: any; // (style, value, edges) => void
  autoSizeCell: any;
  cellEditor: any;

  setConnectable: any;
  setDropEnabled: any;
  setPanning: any;
  setTooltips: any;
  setAllowLoops: any;
  allowAutoPanning: any;
  resetEdgesOnConnect: any;
  constrainChildren: any;
  constrainRelativeChildren: any;
  pageVisible?: boolean;
  pageFormat: any;
  pageScale: any;
  getGraphBounds: any; // () => any
  getCellAt: any; // (x, y) => any
  cellToClone: any; // (cellToClone) => any;
  duplicateCells: any; // (any[]) => any[]

  // handlers
  tooltipHandler: any;
  graphHandler: any;
  connectionHandler: any;
  panningHandler: any;

  getModel() {
    return this.graph.getModel();
  }

  /**
   * Graph inherits from mxGraph
   */
  // mxUtils.extend(Graph, mxGraph);
  constructor(container, model, renderHint, stylesheet, themes?, standalone?) {
    new GraphConstructor().construct(
      container,
      model,
      renderHint,
      stylesheet,
      themes,
      standalone,
    );
  }

  /**
   * Specifies if the touch UI should be used (cannot detect touch in FF so always on for Windows/Linux)
   */
  static touchStyle = mxClient.IS_TOUCH ||
    (mxClient.IS_FF && mxClient.IS_WIN) ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    window["urlParams"] == null ||
    urlParams["touch"] == "1";

  /**
   * Shortcut for capability check.
   */
  static fileSupport = window.File != null &&
    window.FileReader != null &&
    window.FileList != null &&
    (window["urlParams"] == null || urlParams["filesupport"] != "0");

  /**
   * Default size for line jumps.
   */
  static lineJumpsEnabled = true;

  /**
   * Default size for line jumps.
   */
  static defaultJumpSize = 6;

  /**
   * Minimum width for table columns.
   */
  static minTableColumnWidth = 20;

  /**
   * Minimum height for table rows.
   */
  static minTableRowHeight = 20;

  /**
   * Text for foreign object warning.
   */
  static foreignObjectWarningText = "Viewer does not support full SVG 1.1";

  /**
   * Link for foreign object warning.
   */
  static foreignObjectWarningLink =
    "https://desk.draw.io/support/solutions/articles/16000042487";

  /**
   * Helper function for creating SVG data URI.
   */
  static createSvgImage(w, h, data, coordWidth?, coordHeight?) {
    var tmp = unescape(
      encodeURIComponent(
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
          w +
          'px" height="' +
          h +
          'px" ' +
          (coordWidth != null && coordHeight != null
            ? 'viewBox="0 0 ' + coordWidth + " " + coordHeight + '" '
            : "") +
          'version="1.1">' +
          data +
          "</svg>",
      ),
    );

    return new mxImage(
      "data:image/svg+xml;base64," +
        (window.btoa ? btoa(tmp) : Base64.encode(tmp, true)),
      w,
      h,
    );
  }

  /**
   * Removes all illegal control characters with ASCII code <32 except TAB, LF
   * and CR.
   */
  static zapGremlins(text) {
    var checked: any[] = [];

    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);

      // Removes all control chars except TAB, LF and CR
      if (
        (code >= 32 || code == 9 || code == 10 || code == 13) &&
        code != 0xffff &&
        code != 0xfffe
      ) {
        checked.push(text.charAt(i));
      }
    }

    return checked.join("");
  }

  /**
   * Turns the given string into an array.
   */
  static stringToBytes(str) {
    var arr = new Array(str.length);

    for (var i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }

    return arr;
  }

  /**
   * Turns the given array into a string.
   */
  static bytesToString(arr) {
    var result = new Array(arr.length);

    for (var i = 0; i < arr.length; i++) {
      result[i] = String.fromCharCode(arr[i]);
    }

    return result.join("");
  }

  /**
   * Returns a base64 encoded version of the compressed outer XML of the given node.
   */
  static compressNode(node, checked) {
    var xml = mxUtils.getXml(node);

    return this.compress(checked ? xml : this.zapGremlins(xml), null);
  }

  /**
   * Returns a base64 encoded version of the compressed string.
   */
  static compress(data, deflate) {
    if (data == null || data.length == 0 || typeof pako === "undefined") {
      return data;
    } else {
      var tmp = deflate
        ? pako.deflate(encodeURIComponent(data), { to: "string" })
        : pako.deflateRaw(encodeURIComponent(data), { to: "string" });

      return window.btoa ? btoa(tmp) : Base64.encode(tmp, true);
    }
  }

  /**
   * Returns a decompressed version of the base64 encoded string.
   */
  static decompress(data, inflate, checked) {
    if (data == null || data.length == 0 || typeof pako === "undefined") {
      return data;
    } else {
      var tmp = window.atob ? atob(data) : Base64.decode(data, true);

      var inflated = decodeURIComponent(
        inflate
          ? pako.inflate(tmp, { to: "string" })
          : pako.inflateRaw(tmp, { to: "string" }),
      );

      return checked ? inflated : Graph.zapGremlins(inflated);
    }
  }

  /**
   * Allows all values in fit.
   */
  minFitScale = null;

  /**
   * Allows all values in fit.
   */
  maxFitScale = null;

  /**
   * Sets the policy for links. Possible values are "self" to replace any framesets,
   * "blank" to load the URL in <linkTarget> and "auto" (default).
   */
  linkPolicy = urlParams["target"] == "frame"
    ? "blank"
    : urlParams["target"] || "auto";

  /**
   * Target for links that open in a new window. Default is _blank.
   */
  linkTarget = urlParams["target"] == "frame" ? "_self" : "_blank";

  /**
   * Value to the rel attribute of links. Default is 'nofollow noopener noreferrer'.
   * NOTE: There are security implications when this is changed and if noopener is removed,
   * then <openLink> must be overridden to allow for the opener to be set by default.
   */
  linkRelation = "nofollow noopener noreferrer";

  /**
   * Scrollbars are enabled on non-touch devices (not including Firefox because touch events
   * cannot be detected in Firefox, see above).
   */
  defaultScrollbars = !mxClient.IS_IOS;

  /**
   * Specifies if the page should be visible for new files. Default is true.
   */
  defaultPageVisible = true;

  /**
   * Specifies if the app should run in chromeless mode. Default is false.
   * This default is only used if the contructor argument is null.
   */
  lightbox = false;

  /**
   *
   */
  defaultPageBackgroundColor = "#ffffff";

  /**
   *
   */
  defaultPageBorderColor = "#ffffff";

  /**
   * Specifies the size of the size for "tiles" to be used for a graph with
   * scrollbars but no visible background page. A good value is large
   * enough to reduce the number of repaints that is caused for auto-
   * translation, which depends on this value, and small enough to give
   * a small empty buffer around the graph. Default is 400x400.
   */
  scrollTileSize = new mxRectangle(0, 0, 400, 400);

  /**
   * Overrides the background color and paints a transparent background.
   */
  transparentBackground = true;

  /**
   * Sets global constants.
   */
  selectParentAfterDelete = false;

  /**
   * Sets the default target for all links in cells.
   */
  defaultEdgeLength = 80;

  /**
   * Disables move of bends/segments without selecting.
   */
  edgeMode = false;

  /**
   * Allows all values in fit.
   */
  connectionArrowsEnabled = true;

  /**
   * Specifies the regular expression for matching placeholders.
   */
  placeholderPattern = new RegExp("%(date{.*}|[^%^{^}]+)%", "g");

  /**
   * Specifies the regular expression for matching placeholders.
   */
  absoluteUrlPattern = new RegExp("^(?:[a-z]+:)?//", "i");

  /**
   * Specifies the default name for the theme. Default is 'default'.
   */
  defaultThemeName = "default";

  /**
   * Specifies the default name for the theme. Default is 'default'.
   */
  defaultThemes = {};

  /**
   * Base URL for relative links.
   */
  baseUrl = urlParams["base"] != null
    ? decodeURIComponent(urlParams["base"])
    : (window != window.top ? document.referrer : document.location.toString())
      .split("#")[0];

  /**
   * Specifies if the label should be edited after an insert.
   */
  editAfterInsert = false;

  /**
   * Defines the built-in properties to be ignored in tooltips.
   */
  builtInProperties = ["label", "tooltip", "placeholders", "placeholder"];

  /**
   * Defines if the graph is part of an EditorUi. If this is false the graph can
   * be used in an EditorUi instance but will not have a UI added, functions
   * overridden or event handlers added.
   */
  standalone = false;

  /**
   * Installs child layout styles.
   */
  init(container) {
    mxGraph.prototype.init.apply(this, [container]);

    // Intercepts links with no target attribute and opens in new window
    this.cellRenderer.initializeLabel(state, shape);
    {
      mxCellRenderer.prototype.initializeLabel.apply(this, [state, shape]);

      // Checks tolerance for clicks on links
      var tol = state.view.graph.tolerance;
      var handleClick = true;
      var first: any;

      var down = (evt) => {
        handleClick = true;
        first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
      };

      var move = (evt) => {
        handleClick = handleClick &&
          first != null &&
          Math.abs(first.x - mxEvent.getClientX(evt)) < tol &&
          Math.abs(first.y - mxEvent.getClientY(evt)) < tol;
      };

      var up = (evt) => {
        if (handleClick) {
          var elt = mxEvent.getSource(evt);

          while (elt != null && elt != shape.node) {
            if (elt.nodeName.toLowerCase() == "a") {
              state.view.graph.labelLinkClicked(state, elt, evt);
              break;
            }

            elt = elt.parentNode;
          }
        }
      };

      mxEvent.addGestureListeners(shape.node, down, move, up);
      mxEvent.addListener(shape.node, "click", function (evt) {
        mxEvent.consume(evt);
      });
    }

    this.initLayoutManager();
  }

  cssTransformConfig() {}

  /**
   * Sets the XML node for the current diagram.
   */
  isLightboxView() {
    return this.lightbox;
  }

  /**
   * Sets the XML node for the current diagram.
   */
  isViewer() {
    return false;
  }

  /**
   * Installs automatic layout via styles
   */
  labelLinkClicked(state, elt, evt) {
    var href = elt.getAttribute("href");

    if (
      (href != null &&
        !this.isCustomLink(href) &&
        mxEvent.isLeftMouseButton(evt) &&
        !mxEvent.isPopupTrigger(evt)) ||
      mxEvent.isTouchEvent(evt)
    ) {
      if (!this.isEnabled() || this.isCellLocked(state.cell)) {
        var target = this.isBlankLink(href) ? this.linkTarget : "_top";
        this.openLink(this.getAbsoluteUrl(href), target);
      }

      mxEvent.consume(evt);
    }
  }

  /**
   * Returns the size of the page format scaled with the page size.
   */
  openLink(href, target, allowOpener?) {
    var result: any = window;

    try {
      // Workaround for blocking in same iframe
      if (target == "_self" && window != window.top) {
        window.location.href = href;
      } else {
        // Avoids page reload for anchors (workaround for IE but used everywhere)
        if (
          href.substring(0, this.baseUrl.length) == this.baseUrl &&
          href.charAt(this.baseUrl.length) == "#" &&
          target == "_top" &&
          window == window.top
        ) {
          var hash = href.split("#")[1];

          // Forces navigation if on same hash
          if (window.location.hash == "#" + hash) {
            window.location.hash = "";
          }

          window.location.hash = hash;
        } else {
          result = window.open(href, target != null ? target : "_blank");

          if (result != null && !allowOpener) {
            result.opener = null;
          }
        }
      }
    } catch (e) {
      // ignores permission denied
    }

    return result;
  }

  /**
   * Adds support for page links.
   */
  getLinkTitle(href) {
    return href.substring(href.lastIndexOf("/") + 1);
  }

  /**
   * Adds support for page links.
   */
  isCustomLink(href) {
    return href.substring(0, 5) == "data:";
  }

  /**
   * Adds support for page links.
   */
  customLinkClicked(link) {
    return false;
  }

  /**
   * Returns true if the given href references an external protocol that
   * should never open in a new window. Default returns true for mailto.
   */
  isExternalProtocol(href) {
    return href.substring(0, 7) === "mailto:";
  }

  /**
   * Hook for links to open in same window. Default returns true for anchors,
   * links to same domain or if target == 'self' in the config.
   */
  isBlankLink(href) {
    return (
      !this.isExternalProtocol(href) &&
      (this.linkPolicy === "blank" ||
        (this.linkPolicy !== "self" &&
          !this.isRelativeUrl(href) &&
          href.substring(0, this.domainUrl.length) !== this.domainUrl))
    );
  }

  /**
   *
   */
  isRelativeUrl(url) {
    return (
      url != null &&
      !this.absoluteUrlPattern.test(url) &&
      url.substring(0, 5) !== "data:" &&
      !this.isExternalProtocol(url)
    );
  }

  /**
   *
   */
  getAbsoluteUrl(url) {
    if (url != null && this.isRelativeUrl(url)) {
      if (url.charAt(0) == "#") {
        url = this.baseUrl + url;
      } else if (url.charAt(0) == "/") {
        url = this.domainUrl + url;
      } else {
        url = this.domainPathUrl + url;
      }
    }

    return url;
  }

  /**
   * Installs automatic layout via styles
   */
  initLayoutManager() {
    this.layoutManager = new mxLayoutManager(this);

    // Using shared instances for table layouts
    var rowLayout = new TableRowLayout(this);
    var tableLayout = new TableLayout(this);

    this.layoutManager.getLayout = (cell, eventName) => {
      // Workaround for possible invalid style after change and before view validation
      if (eventName != mxEvent.BEGIN_UPDATE) {
        var style = this.graph.getCellStyle(cell);

        if (style != null) {
          if (style["childLayout"] == "stackLayout") {
            var stackLayout = new mxStackLayout(this.graph, true);
            stackLayout.resizeParentMax =
              mxUtils.getValue(style, "resizeParentMax", "1") == "1";
            stackLayout.horizontal =
              mxUtils.getValue(style, "horizontalStack", "1") == "1";
            stackLayout.resizeParent =
              mxUtils.getValue(style, "resizeParent", "1") == "1";
            stackLayout.resizeLast =
              mxUtils.getValue(style, "resizeLast", "0") == "1";
            stackLayout.spacing = style["stackSpacing"] || stackLayout.spacing;
            stackLayout.border = style["stackBorder"] || stackLayout.border;
            stackLayout.marginLeft = style["marginLeft"] || 0;
            stackLayout.marginRight = style["marginRight"] || 0;
            stackLayout.marginTop = style["marginTop"] || 0;
            stackLayout.marginBottom = style["marginBottom"] || 0;
            stackLayout.fill = true;

            return stackLayout;
          } else if (style["childLayout"] == "treeLayout") {
            var treeLayout = new mxCompactTreeLayout(this.graph);
            treeLayout.horizontal =
              mxUtils.getValue(style, "horizontalTree", "1") == "1";
            treeLayout.resizeParent =
              mxUtils.getValue(style, "resizeParent", "1") == "1";
            treeLayout.groupPadding = mxUtils.getValue(
              style,
              "parentPadding",
              20,
            );
            treeLayout.levelDistance = mxUtils.getValue(
              style,
              "treeLevelDistance",
              30,
            );
            treeLayout.maintainParentLocation = true;
            treeLayout.edgeRouting = false;
            treeLayout.resetEdges = false;

            return treeLayout;
          } else if (style["childLayout"] == "flowLayout") {
            var flowLayout = new mxHierarchicalLayout(
              this.graph,
              mxUtils.getValue(
                style,
                "flowOrientation",
                mxConstants.DIRECTION_EAST,
              ),
            );
            flowLayout.resizeParent =
              mxUtils.getValue(style, "resizeParent", "1") == "1";
            flowLayout.parentBorder = mxUtils.getValue(
              style,
              "parentPadding",
              20,
            );
            flowLayout.maintainParentLocation = true;

            // Special undocumented styles for changing the hierarchical
            flowLayout.intraCellSpacing = mxUtils.getValue(
              style,
              "intraCellSpacing",
              mxHierarchicalLayout.prototype.intraCellSpacing,
            );
            flowLayout.interRankCellSpacing = mxUtils.getValue(
              style,
              "interRankCellSpacing",
              mxHierarchicalLayout.prototype.interRankCellSpacing,
            );
            flowLayout.interHierarchySpacing = mxUtils.getValue(
              style,
              "interHierarchySpacing",
              mxHierarchicalLayout.prototype.interHierarchySpacing,
            );
            flowLayout.parallelEdgeSpacing = mxUtils.getValue(
              style,
              "parallelEdgeSpacing",
              mxHierarchicalLayout.prototype.parallelEdgeSpacing,
            );

            return flowLayout;
          } else if (style["childLayout"] == "circleLayout") {
            return new mxCircleLayout(this.graph);
          } else if (style["childLayout"] == "organicLayout") {
            return new mxFastOrganicLayout(this.graph);
          } else if (
            this.graph.isTableRow(cell) || this.graph.isTableCell(cell)
          ) {
            return rowLayout;
          } else if (this.graph.isTable(cell)) {
            return tableLayout;
          }
        }
      }

      return null;
    };
  }

  /**
   * Returns the size of the page format scaled with the page size.
   */
  getPageSize() {
    return this.pageVisible
      ? new mxRectangle(
        0,
        0,
        this.pageFormat.width * this.pageScale,
        this.pageFormat.height * this.pageScale,
      )
      : this.scrollTileSize;
  }

  /**
   * Returns a rectangle describing the position and count of the
   * background pages, where x and y are the position of the top,
   * left page and width and height are the vertical and horizontal
   * page count.
   */
  getPageLayout() {
    var size = this.getPageSize();
    var bounds = this.getGraphBounds();

    if (bounds.width == 0 || bounds.height == 0) {
      return new mxRectangle(0, 0, 1, 1);
    } else {
      var x0 = Math.floor(
        Math.ceil(bounds.x / this.view.scale - this.view.translate.x) /
          size.width,
      );
      var y0 = Math.floor(
        Math.ceil(bounds.y / this.view.scale - this.view.translate.y) /
          size.height,
      );
      var w0 = Math.ceil(
        (Math.floor((bounds.x + bounds.width) / this.view.scale) -
          this.view.translate.x) /
          size.width,
      ) - x0;
      var h0 = Math.ceil(
        (Math.floor((bounds.y + bounds.height) / this.view.scale) -
          this.view.translate.y) /
          size.height,
      ) - y0;

      return new mxRectangle(x0, y0, w0, h0);
    }
  }

  /**
   * Sanitizes the given HTML markup.
   */
  sanitizeHtml(value, editing?) {
    // Uses https://code.google.com/p/google-caja/wiki/JsHtmlSanitizer
    // NOTE: Original minimized sanitizer was modified to support
    // data URIs for images, mailto and special data:-links.
    // LATER: Add MathML to whitelisted tags
    function urlX(link) {
      if (
        link != null &&
        link.toString().toLowerCase().substring(0, 11) !== "javascript:"
      ) {
        return link;
      }

      return null;
    }
    function idX(id) {
      return id;
    }

    return html_sanitize(value, urlX, idX);
  }

  /**
   * Revalidates all cells with placeholders in the current graph model.
   */
  updatePlaceholders() {
    var model = this.model;
    var validate = false;

    for (var key in this.model.cells) {
      var cell = this.model.cells[key];

      if (this.isReplacePlaceholders(cell)) {
        this.view.invalidate(cell, false, false);
        validate = true;
      }
    }

    if (validate) {
      this.view.validate();
    }
  }

  /**
   * Adds support for placeholders in labels.
   */
  isReplacePlaceholders(cell) {
    return (
      cell.value != null &&
      typeof cell.value == "object" &&
      cell.value.getAttribute("placeholders") == "1"
    );
  }

  /**
   * Returns true if the given mouse wheel event should be used for zooming. This
   * is invoked if no dialogs are showing and returns true with Alt or Control
   * (or cmd in macOS only) is pressed.
   */
  isZoomWheelEvent(evt) {
    return (
      mxEvent.isAltDown(evt) ||
      (mxEvent.isMetaDown(evt) && mxClient.IS_MAC) ||
      mxEvent.isControlDown(evt)
    );
  }

  /**
   * Returns true if the given scroll wheel event should be used for scrolling.
   */
  isScrollWheelEvent(evt) {
    return !this.isZoomWheelEvent(evt);
  }

  /**
   * Adds Alt+click to select cells behind cells (Shift+Click on Chrome OS).
   */
  isTransparentClickEvent(evt) {
    return mxEvent.isAltDown(evt) ||
      (mxClient.IS_CHROMEOS && mxEvent.isShiftDown(evt));
  }

  /**
   * Adds ctrl+shift+connect to disable connections.
   */
  isIgnoreTerminalEvent(evt) {
    return mxEvent.isShiftDown(evt) && mxEvent.isControlDown(evt);
  }

  /**
   * Adds support for placeholders in labels.
   */
  isSplitTarget(target, cells, evt) {
    return (
      !this.model.isEdge(cells[0]) &&
      !mxEvent.isAltDown(evt) &&
      !mxEvent.isShiftDown(evt) &&
      mxGraph.prototype.isSplitTarget.apply(this, [target, cells, evt])
    );
  }

  /**
   * Adds support for placeholders in labels.
   */
  getLabel(cell) {
    var result = mxGraph.prototype.getLabel.apply(this, [cell]);

    if (
      result != null &&
      this.isReplacePlaceholders(cell) &&
      cell.getAttribute("placeholder") == null
    ) {
      result = this.replacePlaceholders(cell, result);
    }

    return result;
  }

  // DEPRECATED!?
  // /**
  //  * Adds labelMovable style.
  //  */
  // isLabelMovable(cell)
  // {
  // 	var style = this.getCurrentCellStyle(cell);

  // 	return !this.isCellLocked(cell) &&
  // 		((this.model.isEdge(cell) && this.edgeLabelsMovable) ||
  // 		(this.model.isVertex(cell) && (this.vertexLabelsMovable ||
  // 		mxUtils.getValue(style, 'labelMovable', '0') == '1')));
  // };

  /**
   * Adds event if grid size is changed.
   */
  setGridSize(value) {
    this.gridSize = value;
    this.fireEvent("gridSizeChanged");
  }

  fireEvent(event) {
    // this.fireEvent(new mxEventObject('gridSizeChanged'));
  }

  /**
   * Function: getClickableLinkForCell
   *
   * Returns the first non-null link for the cell or its ancestors.
   *
   * Parameters:
   *
   * cell - <mxCell> whose link should be returned.
   */
  getClickableLinkForCell(cell) {
    do {
      var link = this.getLinkForCell(cell);

      if (link != null) {
        return link;
      }

      cell = this.model.getParent(cell);
    } while (cell != null);

    return null;
  }

  /**
   * Private helper method.
   */
  getGlobalVariable(name) {
    var val: any;

    if (name == "date") {
      val = new Date().toLocaleDateString();
    } else if (name == "time") {
      val = new Date().toLocaleTimeString();
    } else if (name == "timestamp") {
      val = new Date().toLocaleString();
    } else if (name.substring(0, 5) == "date{") {
      var fmt = name.substring(5, name.length - 1);
      val = this.formatDate(new Date(), fmt);
    }

    return val;
  }

  /**
   * Formats a date, see http://blog.stevenlevithan.com/archives/date-time-format
   */
  formatDate(date, mask, utc?) {
    // LATER: Cache regexs
    if (this.dateFormatCache == null) {
      this.dateFormatCache = {
        i18n: {
          dayNames: [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          monthNames: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },

        masks: {
          default: "ddd mmm dd yyyy HH:MM:ss",
          shortDate: "m/d/yy",
          mediumDate: "mmm d, yyyy",
          longDate: "mmmm d, yyyy",
          fullDate: "dddd, mmmm d, yyyy",
          shortTime: "h:MM TT",
          mediumTime: "h:MM:ss TT",
          longTime: "h:MM:ss TT Z",
          isoDate: "yyyy-mm-dd",
          isoTime: "HH:MM:ss",
          isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
          isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        },
      };
    }

    var dF = this.dateFormatCache;
    var token =
        /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
      timezone =
        /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
      timezoneClip = /[^-+\dA-Z]/g,
      pad = (val, len?) => {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
      };

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (
      arguments.length == 1 &&
      Object.prototype.toString.call(date) == "[object String]" &&
      !/\d/.test(date)
    ) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date();
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset();
    const tz: any = String(date).match(timezone) || [""];
    const Z = utc ? "UTC" : tz.pop().replace(timezoneClip, "");
    o = (o > 0 ? "-" : "+") +
      pad(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4);
    const $s: any = (d % 100) - (d % 10) != 10;
    const S = ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : ($s * d) % 10];

    var flags = {
      d: d,
      dd: pad(d),
      ddd: dF.i18n.dayNames[D],
      dddd: dF.i18n.dayNames[D + 7],
      m: m + 1,
      mm: pad(m + 1),
      mmm: dF.i18n.monthNames[m],
      mmmm: dF.i18n.monthNames[m + 12],
      yy: String(y).slice(2),
      yyyy: y,
      h: H % 12 || 12,
      hh: pad(H % 12 || 12),
      H: H,
      HH: pad(H),
      M: M,
      MM: pad(M),
      s: s,
      ss: pad(s),
      l: pad(L, 3),
      L: pad(L > 99 ? Math.round(L / 10) : L),
      t: H < 12 ? "a" : "p",
      tt: H < 12 ? "am" : "pm",
      T: H < 12 ? "A" : "P",
      TT: H < 12 ? "AM" : "PM",
      Z,
      o,
      S,
    };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  }

  /**
   *
   */
  createLayersDialog() {
    var div = document.createElement("div");
    div.style.position = "absolute";

    var model = this.getModel();
    var childCount = model.getChildCount(model.root);

    for (var i = 0; i < childCount; i++) {
      ((layer) => {
        var span = document.createElement("div");
        span.style.overflow = "hidden";
        span.style.textOverflow = "ellipsis";
        span.style.padding = "2px";
        span.style.whiteSpace = "nowrap";

        var cb = document.createElement("input");
        cb.style.display = "inline-block";
        cb.setAttribute("type", "checkbox");

        if (model.isVisible(layer)) {
          cb.setAttribute("checked", "checked");
          cb.defaultChecked = true;
        }

        span.appendChild(cb);

        var title = this.convertValueToString(layer) ||
          mxResources.get("background") || "Background";
        span.setAttribute("title", title);
        mxUtils.write(span, title);
        div.appendChild(span);

        mxEvent.addListener(cb, "click", function () {
          if (cb.getAttribute("checked") != null) {
            cb.removeAttribute("checked");
          } else {
            cb.setAttribute("checked", "checked");
          }

          model.setVisible(layer, cb.checked);
        });
      })(model.getChildAt(model.root, i));
    }

    return div;
  }

  /**
   * Private helper method.
   */
  replacePlaceholders(cell, str) {
    var result: any[] = [];

    if (str != null) {
      var last = 0;
      var match: any;
      while ((match = this.placeholderPattern.exec(str))) {
        var val = match[0];

        if (val.length > 2 && val != "%label%" && val != "%tooltip%") {
          var tmp = null;

          if (match.index > last && str.charAt(match.index - 1) == "%") {
            tmp = val.substring(1);
          } else {
            var name = val.substring(1, val.length - 1);

            // Workaround for invalid char for getting attribute in older versions of IE
            if (name.indexOf("{") < 0) {
              var current = cell;

              while (tmp == null && current != null) {
                if (current.value != null && typeof current.value == "object") {
                  tmp = current.hasAttribute(name)
                    ? current.getAttribute(name) != null
                      ? current.getAttribute(name)
                      : ""
                    : null;
                }

                current = this.model.getParent(current);
              }
            }

            if (tmp == null) {
              tmp = this.getGlobalVariable(name);
            }
          }

          result.push(
            str.substring(last, match.index) + (tmp != null ? tmp : val),
          );
          last = match.index + val.length;
        }
      }

      result.push(str.substring(last));
    }

    return result.join("");
  }

  /**
   * Resolves the given cells in the model and selects them.
   */
  restoreSelection(cells) {
    if (cells != null && cells.length > 0) {
      var temp: any[] = [];

      for (var i = 0; i < cells.length; i++) {
        var newCell = this.model.getCell(cells[i].id);

        if (newCell != null) {
          temp.push(newCell);
        }
      }

      this.setSelectionCells(temp);
    } else {
      this.clearSelection();
    }
  }

  /**
   * Selects cells for connect vertex return value.
   */
  selectCellsForConnectVertex(cells, evt, hoverIcons) {
    // Selects only target vertex if one exists
    if (cells.length == 2 && this.model.isVertex(cells[1])) {
      this.setSelectionCell(cells[1]);
      this.scrollCellToVisible(cells[1]);

      if (hoverIcons != null) {
        // Adds hover icons for cloned vertex or hides icons
        if (mxEvent.isTouchEvent(evt)) {
          hoverIcons.update(hoverIcons.getState(this.view.getState(cells[1])));
        } else {
          hoverIcons.reset();
        }
      }
    } else {
      this.setSelectionCells(cells);
    }
  }

  /**
   * Adds a connection to the given vertex.
   */
  connectVertex(source, direction, length, evt, forceClone, ignoreCellAt) {
    // Ignores relative edge labels
    if (source.geometry.relative && this.model.isEdge(source.parent)) {
      return [];
    }

    ignoreCellAt = ignoreCellAt ? ignoreCellAt : false;

    var pt = source.geometry.relative && source.parent.geometry != null
      ? new mxPoint(
        source.parent.geometry.width * source.geometry.x,
        source.parent.geometry.height * source.geometry.y,
      )
      : new mxPoint(source.geometry.x, source.geometry.y);

    if (direction == mxConstants.DIRECTION_NORTH) {
      pt.x += source.geometry.width / 2;
      pt.y -= length;
    } else if (direction == mxConstants.DIRECTION_SOUTH) {
      pt.x += source.geometry.width / 2;
      pt.y += source.geometry.height + length;
    } else if (direction == mxConstants.DIRECTION_WEST) {
      pt.x -= length;
      pt.y += source.geometry.height / 2;
    } else {
      pt.x += source.geometry.width + length;
      pt.y += source.geometry.height / 2;
    }

    var parentState = this.view.getState(this.model.getParent(source));
    var s = this.view.scale;
    var t = this.view.translate;
    var dx = t.x * s;
    var dy = t.y * s;

    if (parentState != null && this.model.isVertex(parentState.cell)) {
      dx = parentState.x;
      dy = parentState.y;
    }

    // Workaround for relative child cells
    if (this.model.isVertex(source.parent) && source.geometry.relative) {
      pt.x += source.parent.geometry.x;
      pt.y += source.parent.geometry.y;
    }

    // Checks actual end point of edge for target cell
    var target = ignoreCellAt || (mxEvent.isControlDown(evt) && !forceClone)
      ? null
      : this.getCellAt(dx + pt.x * s, dy + pt.y * s);

    if (this.model.isAncestor(target, source)) {
      target = null;
    }

    // Checks if target or ancestor is locked
    var temp = target;

    while (temp != null) {
      if (this.isCellLocked(temp)) {
        target = null;
        break;
      }

      temp = this.model.getParent(temp);
    }

    // Checks if source and target intersect
    if (target != null) {
      var sourceState = this.view.getState(source);
      var targetState = this.view.getState(target);

      if (
        sourceState != null &&
        targetState != null &&
        mxUtils.intersects(sourceState, targetState)
      ) {
        target = null;
      }
    }

    var duplicate = !mxEvent.isShiftDown(evt) || forceClone;

    if (duplicate) {
      if (direction == mxConstants.DIRECTION_NORTH) {
        pt.y -= source.geometry.height / 2;
      } else if (direction == mxConstants.DIRECTION_SOUTH) {
        pt.y += source.geometry.height / 2;
      } else if (direction == mxConstants.DIRECTION_WEST) {
        pt.x -= source.geometry.width / 2;
      } else {
        pt.x += source.geometry.width / 2;
      }
    }

    // Uses connectable parent vertex if one exists
    if (target != null && !this.isCellConnectable(target)) {
      var parent = this.getModel().getParent(target);

      if (this.getModel().isVertex(parent) && this.isCellConnectable(parent)) {
        target = parent;
      }
    }

    if (
      target == source || this.model.isEdge(target) ||
      !this.isCellConnectable(target)
    ) {
      target = null;
    }

    var result: any[] = [];

    this.model.beginUpdate();
    try {
      var swimlane = target != null && this.isSwimlane(target);
      var realTarget = !swimlane ? target : null;

      if (realTarget == null && duplicate) {
        // Handles relative children
        var cellToClone = source;
        var geo = this.getCellGeometry(source);

        while (geo != null && geo.relative) {
          cellToClone = this.getModel().getParent(cellToClone);
          geo = this.getCellGeometry(cellToClone);
        }

        // Handle consistuents for cloning
        cellToClone = this.getCompositeParent(cellToClone);
        realTarget = this.duplicateCells([cellToClone], false)[0];

        var geo = this.getCellGeometry(realTarget);

        if (geo != null) {
          geo.x = pt.x - geo.width / 2;
          geo.y = pt.y - geo.height / 2;
        }

        if (swimlane) {
          this.addCells([realTarget], target, null, null, null, true);
          target = null;
        }
      }

      // Never connects children in stack layouts
      var layout: any;

      if (this.layoutManager != null) {
        layout = this.layoutManager.getLayout(this.model.getParent(source));
      }

      var edge = (mxEvent.isControlDown(evt) && duplicate) ||
        (target == null && layout != null &&
          layout.constructor == mxStackLayout)
        ? null
        : this.insertEdge(
          this.model.getParent(source),
          null,
          "",
          source,
          realTarget,
          this.createCurrentEdgeStyle(),
        );

      // Inserts edge before source
      if (edge != null && this.connectionHandler.insertBeforeSource) {
        var index: any;
        var tmp = source;

        while (
          tmp.parent != null &&
          tmp.geometry != null &&
          tmp.geometry.relative &&
          tmp.parent != edge.parent
        ) {
          tmp = this.model.getParent(tmp);
        }

        if (tmp != null && tmp.parent != null && tmp.parent == edge.parent) {
          index = tmp.parent.getIndex(tmp);
          this.model.add(tmp.parent, edge, index);
        }
      }

      // Special case: Click on west icon puts clone before cell
      if (
        target == null &&
        realTarget != null &&
        layout != null &&
        source.parent != null &&
        layout.constructor == mxStackLayout &&
        direction == mxConstants.DIRECTION_WEST
      ) {
        var index = source.parent.getIndex(source);
        this.model.add(source.parent, realTarget, index);
      }

      if (edge != null) {
        result.push(edge);
      }

      if (target == null && realTarget != null) {
        result.push(realTarget);
      }

      if (realTarget == null && edge != null) {
        edge.geometry.setTerminalPoint(pt, false);
      }

      if (edge != null) {
        this.fireEvent(new mxEventObject("cellsInserted", "cells", [edge]));
      }
    } finally {
      this.model.endUpdate();
    }

    return result;
  }

  /**
   * Returns all labels in the diagram as a string.
   */
  getIndexableText() {
    var tmp = document.createElement("div");
    var labels: any[] = [];
    var label = "";

    for (var key in this.model.cells) {
      var cell = this.model.cells[key];

      if (this.model.isVertex(cell) || this.model.isEdge(cell)) {
        if (this.isHtmlLabel(cell)) {
          tmp.innerHTML = this.getLabel(cell);
          label = mxUtils.extractTextWithWhitespace([tmp]);
        } else {
          label = this.getLabel(cell);
        }

        label = mxUtils.trim(label.replace(/[\x00-\x1F\x7F-\x9F]|\s+/g, " "));

        if (label.length > 0) {
          labels.push(label);
        }
      }
    }

    return labels.join(" ");
  }

  /**
   * Returns the label for the given cell.
   */
  convertValueToString(cell) {
    var value = this.model.getValue(cell);

    if (value != null && typeof value == "object") {
      if (
        this.isReplacePlaceholders(cell) &&
        cell.getAttribute("placeholder") != null
      ) {
        var name = cell.getAttribute("placeholder");
        var current = cell;
        var result = null;

        while (result == null && current != null) {
          if (current.value != null && typeof current.value == "object") {
            result = current.hasAttribute(name)
              ? current.getAttribute(name) != null
                ? current.getAttribute(name)
                : ""
              : null;
          }

          current = this.model.getParent(current);
        }

        return result || "";
      } else {
        return value.getAttribute("label") || "";
      }
    }

    return mxGraph.prototype.convertValueToString.apply(this, [cell]);
  }

  /**
   * Returns the link for the given cell.
   */
  getLinksForState(state) {
    if (state != null && state.text != null && state.text.node != null) {
      return state.text.node.getElementsByTagName("a");
    }

    return null;
  }

  /**
   * Returns the link for the given cell.
   */
  getLinkForCell(cell) {
    if (cell.value != null && typeof cell.value == "object") {
      var link = cell.value.getAttribute("link");

      // Removes links with leading javascript: protocol
      // TODO: Check more possible attack vectors
      if (
        link != null && link.toLowerCase().substring(0, 11) === "javascript:"
      ) {
        link = link.substring(11);
      }

      return link;
    }

    return null;
  }

  /**
   * Overrides label orientation for collapsed swimlanes inside stack.
   */
  getCellStyle(cell) {
    var style = mxGraph.prototype.getCellStyle.apply(this, [cell]);

    if (cell != null && this.layoutManager != null) {
      var parent = this.model.getParent(cell);

      if (this.model.isVertex(parent) && this.isCellCollapsed(cell)) {
        var layout = this.layoutManager.getLayout(parent);

        if (layout != null && layout.constructor == mxStackLayout) {
          style[mxConstants.STYLE_HORIZONTAL] = !layout.horizontal;
        }
      }
    }

    return style;
  }

  /**
   * Disables alternate width persistence for stack layout parents
   */
  updateAlternateBounds(cell, geo, willCollapse) {
    if (
      cell != null && geo != null && this.layoutManager != null &&
      geo.alternateBounds != null
    ) {
      var layout = this.layoutManager.getLayout(this.model.getParent(cell));

      if (layout != null && layout.constructor == mxStackLayout) {
        if (layout.horizontal) {
          geo.alternateBounds.height = 0;
        } else {
          geo.alternateBounds.width = 0;
        }
      }
    }

    mxGraph.prototype.updateAlternateBounds.apply(
      this,
      [cell, geo, willCollapse],
    );
  }

  /**
   * Adds Shift+collapse/expand and size management for folding inside stack
   */
  isMoveCellsEvent(evt, state) {
    return mxEvent.isShiftDown(evt) ||
      mxUtils.getValue(state.style, "moveCells", "0") == "1";
  }

  /**
   * Adds Shift+collapse/expand and size management for folding inside stack
   */
  foldCells(collapse, recurse, cells, checkFoldable, evt) {
    recurse = recurse != null ? recurse : false;

    if (cells == null) {
      cells = this.getFoldableCells(this.getSelectionCells(), collapse);
    }

    if (cells != null) {
      this.model.beginUpdate();

      try {
        mxGraph.prototype.foldCells.apply(
          this,
          [collapse, recurse, cells, checkFoldable, evt],
        );

        // Resizes all parent stacks if alt is not pressed
        if (this.layoutManager != null) {
          for (var i = 0; i < cells.length; i++) {
            var state = this.view.getState(cells[i]);
            var geo = this.getCellGeometry(cells[i]);

            if (state != null && geo != null) {
              var dx = Math.round(geo.width - state.width / this.view.scale);
              var dy = Math.round(geo.height - state.height / this.view.scale);

              if (dy != 0 || dx != 0) {
                var parent = this.model.getParent(cells[i]);
                var layout = this.layoutManager.getLayout(parent);

                if (layout == null) {
                  // Moves cells to the right and down after collapse/expand
                  if (evt != null && this.isMoveCellsEvent(evt, state)) {
                    this.moveSiblings(state, parent, dx, dy);
                  }
                } else if (
                  (evt == null || !mxEvent.isAltDown(evt)) &&
                  layout.constructor == mxStackLayout &&
                  !layout.resizeLast
                ) {
                  this.resizeParentStacks(parent, layout, dx, dy);
                }
              }
            }
          }
        }
      } finally {
        this.model.endUpdate();
      }

      // Selects cells after folding
      if (this.isEnabled()) {
        this.setSelectionCells(cells);
      }
    }
  }

  /**
   * Overrides label orientation for collapsed swimlanes inside stack.
   */
  moveSiblings(state, parent, dx, dy) {
    this.model.beginUpdate();
    try {
      var cells = this.getCellsBeyond(state.x, state.y, parent, true, true);

      for (var i = 0; i < cells.length; i++) {
        if (cells[i] != state.cell) {
          var tmp = this.view.getState(cells[i]);
          var geo = this.getCellGeometry(cells[i]);

          if (tmp != null && geo != null) {
            geo = geo.clone();
            geo.translate(
              Math.round(
                dx * Math.max(0, Math.min(1, (tmp.x - state.x) / state.width)),
              ),
              Math.round(
                dy * Math.max(0, Math.min(1, (tmp.y - state.y) / state.height)),
              ),
            );
            this.model.setGeometry(cells[i], geo);
          }
        }
      }
    } finally {
      this.model.endUpdate();
    }
  }

  /**
   * Overrides label orientation for collapsed swimlanes inside stack.
   */
  resizeParentStacks(parent, layout, dx, dy) {
    if (
      this.layoutManager != null &&
      layout != null &&
      layout.constructor == mxStackLayout &&
      !layout.resizeLast
    ) {
      this.model.beginUpdate();
      try {
        var dir = layout.horizontal;

        // Bubble resize up for all parent stack layouts with same orientation
        while (
          parent != null &&
          layout != null &&
          layout.constructor == mxStackLayout &&
          layout.horizontal == dir &&
          !layout.resizeLast
        ) {
          var pgeo = this.getCellGeometry(parent);
          var pstate = this.view.getState(parent);

          if (pstate != null && pgeo != null) {
            pgeo = pgeo.clone();

            if (layout.horizontal) {
              pgeo.width += dx +
                Math.min(0, pstate.width / this.view.scale - pgeo.width);
            } else {
              pgeo.height += dy +
                Math.min(0, pstate.height / this.view.scale - pgeo.height);
            }

            this.model.setGeometry(parent, pgeo);
          }

          parent = this.model.getParent(parent);
          layout = this.layoutManager.getLayout(parent);
        }
      } finally {
        this.model.endUpdate();
      }
    }
  }

  /**
   * Disables drill-down for non-swimlanes.
   */
  isContainer(cell) {
    var style = this.getCurrentCellStyle(cell);

    if (this.isSwimlane(cell)) {
      return style["container"] != "0";
    } else {
      return style["container"] == "1";
    }
  }

  /**
   * Adds a expand style.
   */
  isExtendParent(cell) {
    var parent = this.model.getParent(cell);

    if (parent != null) {
      var style = this.getCurrentCellStyle(parent);

      if (style["expand"] != null) {
        return style["expand"] != "0";
      }
    }

    return mxGraph.prototype.isExtendParent.apply(this, [cell]);
  }

  /**
   * Adds a connectable style.
   */
  isCellConnectable(cell) {
    var style = this.getCurrentCellStyle(cell);

    return style["connectable"] != null
      ? style["connectable"] != "0"
      : mxGraph.prototype.isCellConnectable.apply(this, [cell]);
  }

  /**
   * Adds labelMovable style.
   */
  isLabelMovable(cell) {
    var style = this.getCurrentCellStyle(cell);

    return style["movableLabel"] != null
      ? style["movableLabel"] != "0"
      : mxGraph.prototype.isLabelMovable.apply(this, [cell]);
  }

  /**
   * Function: selectAll
   *
   * Selects all children of the given parent cell or the children of the
   * default parent if no parent is specified. To select leaf vertices and/or
   * edges use <selectCells>.
   *
   * Parameters:
   *
   * parent - Optional <mxCell> whose children should be selected.
   * Default is <defaultParent>.
   */
  selectAll(parent) {
    parent = parent || this.getDefaultParent();

    if (!this.isCellLocked(parent)) {
      mxGraph.prototype.selectAll.apply(this, [parent]);
    }
  }

  /**
   * Function: selectCells
   *
   * Selects all vertices and/or edges depending on the given boolean
   * arguments recursively, starting at the given parent or the default
   * parent if no parent is specified. Use <selectAll> to select all cells.
   * For vertices, only cells with no children are selected.
   *
   * Parameters:
   *
   * vertices - Boolean indicating if vertices should be selected.
   * edges - Boolean indicating if edges should be selected.
   * parent - Optional <mxCell> that acts as the root of the recursion.
   * Default is <defaultParent>.
   */
  selectCells(vertices, edges, parent) {
    parent = parent || this.getDefaultParent();

    if (!this.isCellLocked(parent)) {
      mxGraph.prototype.selectCells.apply(this, [vertices, edges, parent]);
    }
  }

  /**
   * Function: getSwimlaneAt
   *
   * Returns the bottom-most swimlane that intersects the given point (x, y)
   * in the cell hierarchy that starts at the given parent.
   *
   * Parameters:
   *
   * x - X-coordinate of the location to be checked.
   * y - Y-coordinate of the location to be checked.
   * parent - <mxCell> that should be used as the root of the recursion.
   * Default is <defaultParent>.
   */
  getSwimlaneAt(x, y, parent) {
    var result = mxGraph.prototype.getSwimlaneAt.apply(this, [x, y, parent]);

    if (this.isCellLocked(result)) {
      result = null;
    }

    return result;
  }

  /**
   * Disables folding for non-swimlanes.
   */
  isCellFoldable(cell) {
    var style = this.getCurrentCellStyle(cell);

    return (
      this.foldingEnabled &&
      (style["treeFolding"] == "1" ||
        (!this.isCellLocked(cell) &&
          ((this.isContainer(cell) && style["collapsible"] != "0") ||
            (!this.isContainer(cell) && style["collapsible"] == "1"))))
    );
  }

  /**
   * Stops all interactions and clears the selection.
   */
  reset() {
    if (this.isEditing()) {
      this.stopEditing(true);
    }

    this.escape();

    if (!this.isSelectionEmpty()) {
      this.clearSelection();
    }
  }

  /**
   * Overridden to limit zoom to 1% - 16.000%.
   */
  zoom(factor, center?) {
    factor = Math.max(0.01, Math.min(this.view.scale * factor, 160)) /
      this.view.scale;
    mxGraph.prototype.zoom.apply(this, [factor, center]);
  }

  /**
   * Function: zoomIn
   *
   * Zooms into the graph by <zoomFactor>.
   */
  zoomIn() {
    // Switches to 1% zoom steps below 15%
    if (this.view.scale < 0.15) {
      this.zoom((this.view.scale + 0.01) / this.view.scale);
    } else {
      // Uses to 5% zoom steps for better grid rendering in webkit
      // and to avoid rounding errors for zoom steps
      this.zoom(
        Math.round(this.view.scale * this.zoomFactor * 20) / 20 /
          this.view.scale,
      );
    }
  }

  /**
   * Function: zoomOut
   *
   * Zooms out of the graph by <zoomFactor>.
   */
  zoomOut() {
    // Switches to 1% zoom steps below 15%
    if (this.view.scale <= 0.15) {
      this.zoom((this.view.scale - 0.01) / this.view.scale, null);
    } else {
      // Uses to 5% zoom steps for better grid rendering in webkit
      // and to avoid rounding errors for zoom steps
      this.zoom(
        Math.round(this.view.scale * (1 / this.zoomFactor) * 20) / 20 /
          this.view.scale,
        null,
      );
    }
  }

  /**
   * Overrides tooltips to show custom tooltip or metadata.
   */
  getTooltipForCell(cell) {
    var tip = "";

    if (mxUtils.isNode(cell.value, null, null, null)) {
      var tmp = cell.value.getAttribute("tooltip");

      if (tmp != null) {
        if (tmp != null && this.isReplacePlaceholders(cell)) {
          tmp = this.replacePlaceholders(cell, tmp);
        }

        tip = this.sanitizeHtml(tmp);
      } else {
        var ignored = this.builtInProperties;
        var attrs = cell.value.attributes;
        var temp: any[] = [];

        // Hides links in edit mode
        if (this.isEnabled()) {
          ignored.push("link");
        }

        for (var i = 0; i < attrs.length; i++) {
          if (
            mxUtils.indexOf(ignored, attrs[i].nodeName) < 0 &&
            attrs[i].nodeValue.length > 0
          ) {
            temp.push({ name: attrs[i].nodeName, value: attrs[i].nodeValue });
          }
        }

        // Sorts by name
        temp.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        });

        for (var i = 0; i < temp.length; i++) {
          if (temp[i].name != "link" || !this.isCustomLink(temp[i].value)) {
            tip += (temp[i].name != "link"
              ? "<b>" + temp[i].name + ":</b> "
              : "") +
              mxUtils.htmlEntities(temp[i].value) +
              "\n";
          }
        }

        if (tip.length > 0) {
          tip = tip.substring(0, tip.length - 1);

          if (mxClient.IS_SVG) {
            tip = '<div style="max-width:360px;">' + tip + "</div>";
          }
        }
      }
    }

    return tip;
  }

  /**
   * Turns the given string into an array.
   */
  stringToBytes(str) {
    return Graph.stringToBytes(str);
  }

  /**
   * Turns the given array into a string.
   */
  bytesToString(arr) {
    return Graph.bytesToString(arr);
  }

  /**
   * Returns a base64 encoded version of the compressed outer XML of the given node.
   */
  compressNode(node) {
    return Graph.compressNode(node, null);
  }

  /**
   * Returns a base64 encoded version of the compressed string.
   */
  compress(data, deflate) {
    return Graph.compress(data, deflate);
  }

  /**
   * Returns a decompressed version of the base64 encoded string.
   */
  decompress(data, inflate) {
    return Graph.decompress(data, inflate, null);
  }

  /**
   * Redirects to static zapGremlins.
   */
  zapGremlins(text) {
    return Graph.zapGremlins(text);
  }

  /**
   * Returns true if the given cell is a table.
   */
  createParent(parent, child, childCount) {
    parent = this.cloneCell(parent);

    for (var i = 0; i < childCount; i++) {
      parent.insert(this.cloneCell(child));
    }

    return parent;
  }

  /**
   * Returns true if the given cell is a table.
   */
  createTable(rowCount, colCount, w, h) {
    w = w != null ? w : 40;
    h = h != null ? h : 30;

    return this.createParent(
      this.createVertex(
        null,
        null,
        "",
        0,
        0,
        colCount * w,
        rowCount * h,
        "html=1;whiteSpace=wrap;container=1;collapsible=0;childLayout=tableLayout;",
      ),
      this.createParent(
        this.createVertex(
          null,
          null,
          "",
          0,
          0,
          colCount * w,
          h,
          "html=1;whiteSpace=wrap;container=1;collapsible=0;points=[[0,0.5],[1,0.5]];part=1;",
        ),
        this.createVertex(
          null,
          null,
          "",
          0,
          0,
          w,
          h,
          "html=1;whiteSpace=wrap;connectable=0;part=1;",
        ),
        colCount,
      ),
      rowCount,
    );
  }

  /**
   *
   */
  createCrossFunctionalSwimlane(rowCount, colCount, w, h) {
    w = w != null ? w : 120;
    h = h != null ? h : 120;

    var s = "swimlane;html=1;whiteSpace=wrap;container=1;" +
      "collapsible=0;recursiveResize=0;expand=0;";

    var table = this.createVertex(
      null,
      null,
      "",
      0,
      0,
      colCount * w,
      rowCount * h,
      s + "childLayout=tableLayout;",
    );
    var row = this.createVertex(
      null,
      null,
      "",
      0,
      0,
      colCount * w,
      h,
      s + "horizontal=0;points=[[0,0.5],[1,0.5]];part=1;",
    );
    table.insert(
      this.createParent(
        row,
        this.createVertex(
          null,
          null,
          "",
          0,
          0,
          w,
          h,
          s + "connectable=0;part=1;",
        ),
        colCount,
      ),
    );

    if (rowCount > 1) {
      return this.createParent(
        table,
        this.createParent(
          row,
          this.createVertex(
            null,
            null,
            "",
            0,
            0,
            w,
            h,
            s + "connectable=0;part=1;startSize=0;",
          ),
          colCount,
        ),
        rowCount - 1,
      );
    } else {
      return table;
    }
  }

  /**
   * Returns true if the given cell is a table cell.
   */
  isTableCell(cell) {
    return this.isTableRow(this.model.getParent(cell));
  }

  /**
   * Returns true if the given cell is a table row.
   */
  isTableRow(cell) {
    return this.isTable(this.model.getParent(cell));
  }

  /**
   * Returns true if the given cell is a table.
   */
  isTable(cell) {
    var style = this.getCellStyle(cell);

    return style != null && style["childLayout"] == "tableLayout";
  }

  /**
   * Updates column width and row height.
   */
  getActualStartSize(swimlane, ignoreState?) {
    var result = new mxRectangle();

    if (this.isSwimlane(swimlane)) {
      var style = this.getCurrentCellStyle(swimlane, ignoreState);
      var size = parseInt(
        mxUtils.getValue(
          style,
          mxConstants.STYLE_STARTSIZE,
          mxConstants.DEFAULT_STARTSIZE,
        ),
      );
      var flipH = mxUtils.getValue(style, mxConstants.STYLE_FLIPH, 0) == 1;
      var flipV = mxUtils.getValue(style, mxConstants.STYLE_FLIPV, 0) == 1;
      var h = mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true);
      var n = 0;

      if (!h) {
        n++;
      }

      var dir = mxUtils.getValue(
        style,
        mxConstants.STYLE_DIRECTION,
        mxConstants.DIRECTION_EAST,
      );

      if (dir == mxConstants.DIRECTION_NORTH) {
        n++;
      } else if (dir == mxConstants.DIRECTION_WEST) {
        n += 2;
      } else if (dir == mxConstants.DIRECTION_SOUTH) {
        n += 3;
      }

      n = mxUtils.mod(n, 4);

      if (n == 0) {
        result.y = size;
      } else if (n == 1) {
        result.x = size;
      } else if (n == 2) {
        result.height = size;
      } else if (n == 3) {
        result.width = size;
      }

      if (flipV) {
        var tmp = result.y;
        result.y = result.height;
        result.height = tmp;
      }

      if (flipH) {
        var tmp = result.x;
        result.x = result.width;
        result.width = tmp;
      }
    }

    return result;
  }

  /**
   * Updates column width and row height.
   */
  tableResized(table) {
    console.log("tableLayout.tableResized", table);
    var model = this.getModel();
    var rowCount = model.getChildCount(table);
    var tableGeo = this.getCellGeometry(table);

    if (tableGeo != null && rowCount > 0) {
      var off = this.getActualStartSize(table);
      var y = off.y;

      for (var i = 0; i < rowCount; i++) {
        var row = model.getChildAt(table, i);

        if (row != null && model.isVertex(row)) {
          var rowGeo = this.getCellGeometry(row);

          if (rowGeo != null) {
            if (i == rowCount - 1) {
              var newRowGeo = rowGeo.clone();
              newRowGeo.width = tableGeo.width - off.x;

              if (y < tableGeo.height) {
                newRowGeo.height = tableGeo.height - y;
              } else if (y > tableGeo.height) {
                tableGeo.height = y + Graph.minTableRowHeight;
                newRowGeo.height = Graph.minTableRowHeight;
              }

              model.setGeometry(row, newRowGeo);
              this.tableRowResized(row, newRowGeo, rowGeo);
            }

            y += rowGeo.height;
          }
        }
      }
    }
  }

  /**
   * Updates column width and row height.
   */
  setRowHeight(row, height) {
    var model = this.getModel();

    model.beginUpdate();
    try {
      for (var i = 0; i < model.getChildCount(row); i++) {
        var child = model.getChildAt(row, i);

        if (model.isVertex(child)) {
          var childGeo = this.getCellGeometry(child);

          if (childGeo != null) {
            childGeo = childGeo.clone();
            childGeo.height = height;
            model.setGeometry(child, childGeo);
          }
        }
      }
    } finally {
      model.endUpdate();
    }
  }

  /**
   * Updates column width and row height.
   */
  tableRowResized(row, bounds, prev) {
    console.log("tableLayout.tableRowResized", row);
    var model = this.getModel();
    var rowGeo = this.getCellGeometry(row);
    var cellCount = model.getChildCount(row);

    if (rowGeo != null && cellCount > 0) {
      var off = this.getActualStartSize(row);
      var x = off.x;

      for (var i = 0; i < cellCount; i++) {
        var cell = model.getChildAt(row, i);

        if (cell != null && model.isVertex(cell)) {
          var geo = this.getCellGeometry(cell);

          if (geo != null) {
            var newGeo = geo.clone();
            newGeo.height = rowGeo.height - off.y;
            model.setGeometry(cell, newGeo);

            if (i == cellCount - 1) {
              if (x < rowGeo.width) {
                newGeo.width = rowGeo.width - x;
              } else if (x > rowGeo.width) {
                rowGeo.width = x + Graph.minTableColumnWidth;
                newGeo.width = Graph.minTableColumnWidth;
              }

              this.tableCellResized(cell, newGeo, geo);
            }

            x += geo.width;
          }
        }
      }
    }

    // Updates previous row height if upper edge was moved
    var table = model.getParent(row);
    var index = table.getIndex(row);

    if (bounds.y != prev.y && index > 0) {
      var previousRow = model.getChildAt(table, index - 1);
      var prg = this.getCellGeometry(previousRow);

      if (prg != null) {
        prg = prg.clone();
        prg.height -= prev.y - bounds.y;
        model.setGeometry(previousRow, prg);
      }
    }
  }

  /**
   * Updates column width and row height.
   */
  tableCellResized(cell, bounds, prev) {
    console.log("tableLayout.tableCellResized", cell, bounds, prev);
    var geo = this.getCellGeometry(cell);

    if (geo != null) {
      var model = this.getModel();
      var row = model.getParent(cell);
      var table = model.getParent(row);
      var index = row.getIndex(cell);

      // Applies new height to all cells in the row
      if (bounds.height != prev.height) {
        this.setRowHeight(row, geo.height);
      }

      // Updates column width
      var previousRow = null;

      for (var i = 0; i < model.getChildCount(table); i++) {
        var currentRow = model.getChildAt(table, i);

        if (model.isVertex(currentRow)) {
          var child = model.getChildAt(currentRow, index);

          if (cell != child) {
            var childGeo = this.getCellGeometry(child);

            if (childGeo != null) {
              childGeo = childGeo.clone();
              childGeo.width = geo.width;
              model.setGeometry(child, childGeo);
            }
          }

          // Updates previous row height
          if (bounds.y != prev.y && currentRow == row && previousRow != null) {
            var prg = this.getCellGeometry(previousRow);

            if (prg != null) {
              this.setRowHeight(previousRow, prg.height - prev.y + bounds.y);
            }
          }

          previousRow = currentRow;
        }
      }

      // Updates previous column width
      if (bounds.x != prev.x && index > 0) {
        var child = model.getChildAt(row, index - 1);
        var childGeo = this.getCellGeometry(child);

        if (childGeo != null) {
          var newChildGeo = childGeo.clone();
          newChildGeo.width -= prev.x - bounds.x;
          model.setGeometry(child, newChildGeo);

          this.tableCellResized(child, newChildGeo, childGeo);
        }
      }
    }
  }

  /**
   * Hook for subclassers.
   */
  getPagePadding() {
    return new mxPoint(0, 0);
  }

  /**
   * Creates lookup from object IDs to cell IDs.
   */
  createCellLookup(cells, lookup) {
    lookup = lookup != null ? lookup : new Object();

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      lookup[mxObjectIdentity.get(cell)] = cell.getId();
      var childCount = this.model.getChildCount(cell);

      for (var j = 0; j < childCount; j++) {
        this.createCellLookup([this.model.getChildAt(cell, j)], lookup);
      }
    }

    return lookup;
  }

  /**
   * Creates lookup from original to cloned cell IDs where mapping is
   * the mapping used in cloneCells and lookup is a mapping from
   * object IDs to cell IDs.
   */
  createCellMapping(mapping, lookup, cellMapping) {
    cellMapping = cellMapping != null ? cellMapping : new Object();

    for (var objectId in mapping) {
      var cellId = lookup[objectId];

      if (cellMapping[cellId] == null) {
        // Uses empty string if clone ID was null which means
        // the cell was cloned but not inserted into the model.
        cellMapping[cellId] = mapping[objectId].getId() || "";
      }
    }

    return cellMapping;
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  encodeCells(cells) {
    var cloneMap = new Object();
    var clones = this.cloneCells(cells, null, cloneMap);

    // Creates a dictionary for fast lookups
    var dict = new mxDictionary();

    for (var i = 0; i < cells.length; i++) {
      dict.put(cells[i], true);
    }

    // Checks for orphaned relative children and makes absolute
    for (var i = 0; i < clones.length; i++) {
      var state = this.view.getState(cells[i]);

      if (state != null) {
        var geo = this.getCellGeometry(clones[i]);

        if (
          geo != null &&
          geo.relative &&
          !this.model.isEdge(cells[i]) &&
          !dict.get(this.model.getParent(cells[i]))
        ) {
          geo.relative = false;
          geo.x = state.x / state.view.scale - state.view.translate.x;
          geo.y = state.y / state.view.scale - state.view.translate.y;
        }
      }
    }

    var codec = new mxCodec();
    var model = new mxGraphModel();
    var parent = model.getChildAt(model.getRoot(), 0);

    for (var i = 0; i < clones.length; i++) {
      model.add(parent, clones[i]);
    }
    const cellMapping = this.createCellMapping(
      cloneMap,
      this.createCellLookup(cells, null),
      null,
    );
    this.updateCustomLinks(cellMapping, clones);

    return codec.encode(model);
  }

  /**
   * Overrides cloning cells in moveCells.
   */

  moveCells(cells, dx, dy, clone, target, evt, mapping) {
    var graphMoveCells = Graph.prototype.moveCells;
    mapping = mapping != null ? mapping : new Object();
    var result = graphMoveCells.apply(
      this,
      [cells, dx, dy, clone, target, evt, mapping],
    );

    if (clone) {
      const cellMapping = this.createCellMapping(
        mapping,
        this.createCellLookup(cells, null),
        null,
      );
      this.updateCustomLinks(cellMapping, result);
    }
    return result;
  }

  /**
   * Updates cells IDs for custom links in the given cells.
   */
  updateCustomLinks(mapping, cells) {
    for (var i = 0; i < cells.length; i++) {
      if (cells[i] != null) {
        this.updateCustomLinksForCell(mapping, cells[i]);
      }
    }
  }

  /**
   * Updates cell IDs in custom links on the given cell and its label.
   */
  updateCustomLinksForCell(mapping, cell) {
    // Hook for subclassers
  }

  /**
   * Overrides method to provide connection constraints for shapes.
   */
  getAllConnectionConstraints(terminal, source) {
    if (terminal != null) {
      var constraints = mxUtils.getValue(terminal.style, "points", null);

      if (constraints != null) {
        // Requires an array of arrays with x, y (0..1), an optional
        // [perimeter (0 or 1), dx, and dy] eg. points=[[0,0,1,-10,10],[0,1,0],[1,1]]
        var result: any[] = [];

        try {
          var c = JSON.parse(constraints);

          for (var i = 0; i < c.length; i++) {
            var tmp = c[i];
            result.push(
              new mxConnectionConstraint(
                new mxPoint(tmp[0], tmp[1]),
                tmp.length > 2 ? tmp[2] != "0" : true,
                undefined,
                tmp.length > 3 ? tmp[3] : 0,
                tmp.length > 4 ? tmp[4] : 0,
              ),
            );
          }
        } catch (e) {
          // ignore
        }

        return result;
      } else if (terminal.shape != null && terminal.shape.bounds != null) {
        var dir = terminal.shape.direction;
        var bounds = terminal.shape.bounds;
        var scale = terminal.shape.scale;
        var w = bounds.width / scale;
        var h = bounds.height / scale;

        if (
          dir == mxConstants.DIRECTION_NORTH ||
          dir == mxConstants.DIRECTION_SOUTH
        ) {
          tmp = w;
          w = h;
          h = tmp;
        }

        constraints = terminal.shape.getConstraints(terminal.style, w, h);

        if (constraints != null) {
          return constraints;
        } else if (
          terminal.shape.stencil != null &&
          terminal.shape.stencil.constraints != null
        ) {
          return terminal.shape.stencil.constraints;
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints;
        }
      }
    }

    return null;
  }

  /**
   * Inverts the elbow edge style without removing existing styles.
   */
  flipEdge(edge) {
    if (edge != null) {
      var style = this.getCurrentCellStyle(edge);
      var elbow = mxUtils.getValue(
        style,
        mxConstants.STYLE_ELBOW,
        mxConstants.ELBOW_HORIZONTAL,
      );
      var value = elbow == mxConstants.ELBOW_HORIZONTAL
        ? mxConstants.ELBOW_VERTICAL
        : mxConstants.ELBOW_HORIZONTAL;
      this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
    }
  }

  /**
   * Disables drill-down for non-swimlanes.
   */
  isValidRoot(cell) {
    // Counts non-relative children
    var childCount = this.model.getChildCount(cell);
    var realChildCount = 0;

    for (var i = 0; i < childCount; i++) {
      var child = this.model.getChildAt(cell, i);

      if (this.model.isVertex(child)) {
        var geometry = this.getCellGeometry(child);

        if (geometry != null && !geometry.relative) {
          realChildCount++;
        }
      }
    }

    return realChildCount > 0 || this.isContainer(cell);
  }

  /**
   * Disables drill-down for non-swimlanes.
   */
  isValidDropTarget(cell) {
    var style = this.getCurrentCellStyle(cell);

    return (
      (mxUtils.getValue(style, "part", "0") != "1" || this.isContainer(cell)) &&
      mxUtils.getValue(style, "dropTarget", "1") != "0" &&
      (mxGraph.prototype.isValidDropTarget.apply(this, [cell, null, null]) ||
        this.isContainer(cell))
    );
  }

  /**
   * Overrides createGroupCell to set the group style for new groups to 'group'.
   */
  createGroupCell() {
    var group = mxGraph.prototype.createGroupCell.apply(this, [undefined]);
    group.setStyle("group");
    return group;
  }

  /**
   * Disables extending parents with stack layouts on add
   */
  isExtendParentsOnAdd(cell) {
    var result = mxGraph.prototype.isExtendParentsOnAdd.apply(this, [cell]);

    if (result && cell != null && this.layoutManager != null) {
      var parent = this.model.getParent(cell);

      if (parent != null) {
        var layout = this.layoutManager.getLayout(parent);

        if (layout != null && layout.constructor == mxStackLayout) {
          result = false;
        }
      }
    }

    return result;
  }

  /**
   * Overrides autosize to add a border.
   */
  getPreferredSizeForCell(cell) {
    const proto = mxGraph.prototype;
    var result = mxGraph.prototype.getPreferredSizeForCell.apply(this, [cell]);

    // Adds buffer
    if (result != null) {
      result.width += 10;
      result.height += 4;

      if (proto.gridEnabled) {
        result.width = proto.snap(result.width);
        result.height = proto.snap(result.height);
      }
    }

    return result;
  }

  /**
   * Overridden to stop moving edge labels between cells.
   */
  getDropTarget(cells, evt, cell, clone) {
    var model = this.getModel();

    // Disables drop into group if alt is pressed
    if (mxEvent.isAltDown(evt)) {
      return null;
    }

    // Disables dragging edge labels out of edges
    for (var i = 0; i < cells.length; i++) {
      if (this.model.isEdge(this.model.getParent(cells[i]))) {
        return null;
      }
    }

    return mxGraph.prototype.getDropTarget.apply(
      this,
      [cells, evt, cell, clone],
    );
  }

  /**
   * Adds a new label at the given position and returns the new cell. State is
   * an optional edge state to be used as the parent for the label. Vertices
   * are not allowed currently as states.
   */
  addText(x, y, state) {
    // Creates a new edge label with a predefined text
    var label = new mxCell();
    label.value = "Text";
    label.style =
      "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];";
    label.geometry = new mxGeometry(0, 0, 0, 0);
    label.vertex = true;

    if (state != null && this.model.isEdge(state.cell)) {
      label.style += "labelBackgroundColor=#ffffff;";
      label.geometry.relative = true;
      label.connectable = false;

      // Resets the relative location stored inside the geometry
      var pt2 = this.view.getRelativePoint(state, x, y);
      label.geometry.x = Math.round(pt2.x * 10000) / 10000;
      label.geometry.y = Math.round(pt2.y);

      // Resets the offset inside the geometry to find the offset from the resulting point
      label.geometry.offset = new mxPoint(0, 0);
      pt2 = this.view.getPoint(state, label.geometry);

      var scale = this.view.scale;
      label.geometry.offset = new mxPoint(
        Math.round((x - pt2.x) / scale),
        Math.round((y - pt2.y) / scale),
      );
    } else {
      var tr = this.view.translate;
      label.geometry.width = 40;
      label.geometry.height = 20;
      label.geometry.x = Math.round(x / this.view.scale) - tr.x -
        (state != null ? state.origin.x : 0);
      label.geometry.y = Math.round(y / this.view.scale) - tr.y -
        (state != null ? state.origin.y : 0);
      label.style += "autosize=1;";
    }

    this.getModel().beginUpdate();
    try {
      this.addCells([label], state != null ? state.cell : null);
      this.fireEvent(new mxEventObject("textInserted", "cells", [label]));

      // Updates size of text after possible change of style via event
      this.autoSizeCell(label);
    } finally {
      this.getModel().endUpdate();
    }

    return label;
  }

  /**
   * Inserts the given image at the cursor in a content editable text box using
   * the insertimage command on the document instance.
   */
  insertImage(newValue, w, h) {
    // To find the new image, we create a list of all existing links first
    if (newValue != null && this.cellEditor.textarea != null) {
      var tmp = this.cellEditor.textarea.getElementsByTagName("img");
      var oldImages: any[] = [];

      for (var i = 0; i < tmp.length; i++) {
        oldImages.push(tmp[i]);
      }

      // LATER: Fix inserting link/image in IE8/quirks after focus lost
      document.execCommand("insertimage", false, newValue);

      // Sets size of new image
      var newImages = this.cellEditor.textarea.getElementsByTagName("img");

      if (newImages.length == oldImages.length + 1) {
        // Inverse order in favor of appended images
        for (var i = newImages.length - 1; i >= 0; i--) {
          if (i == 0 || newImages[i] != oldImages[i - 1]) {
            // Workaround for lost styles during undo and redo is using attributes
            newImages[i].setAttribute("width", w);
            newImages[i].setAttribute("height", h);
            break;
          }
        }
      }
    }
  }

  /**
   * Adds meta-drag an Mac.
   * @param evt
   * @returns
   */
  isCloneEvent(evt) {
    return (mxClient.IS_MAC && mxEvent.isMetaDown(evt)) ||
      mxEvent.isControlDown(evt);
  }
}
