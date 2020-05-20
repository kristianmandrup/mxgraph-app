import { Graph } from "./Graph";
import mx from "mx";
const { mxPopupMenuHandler, mxEvent, mxUtils, mxConstants } = mx;

export class Functionas {
  documentMode: any;
  isCustomLink: any; // fn
  selection: any;
  graph: any;
  isTableCell: any; // (cell) => any
  isTableRow: any; // (cell) => any
  isTable: any; // (cell) => any
  getCellGeometry: any; // (cell) => any
  getLinkTitle: any;
  linkTarget: any;
  linkRelation: any;
  getAbsoluteUrl: any;
  connectionHandler: any;
  addListener: any;
  popupMenuHandler: any;
  updateMouseEvent: any;
  getCellAt: any; // (me.graphX, me.graphY);
  isSwimlane: any; // (cell) => boolean
  hitsSwimlaneContent: any; // (cell, me.graphX, me.graphY)
  customLinkClicked: any;
  fireMouseEvent: any;
  isCellSelected: any;
  isSelectionEmpty: any;
  view: any;
  container: any;
  isEnabled: any;
  isEditing: any;

  getModel() {
    return this.graph.getModel();
  }

  /**
   * Adds warning for truncated labels in older viewers.
   */
  addForeignObjectWarning(canvas, root) {
    if (root.getElementsByTagName("foreignObject").length > 0) {
      var sw = canvas.createElement("switch");
      var g1 = canvas.createElement("g");
      g1.setAttribute(
        "requiredFeatures",
        "http://www.w3.org/TR/SVG11/feature#Extensibility",
      );
      var a = canvas.createElement("a");
      a.setAttribute("transform", "translate(0,-5)");

      // Workaround for implicit namespace handling in HTML5 export, IE adds NS1 namespace so use code below
      // in all IE versions except quirks mode. KNOWN: Adds xlink namespace to each image tag in output.
      if (
        a.setAttributeNS == null ||
        (root.ownerDocument != document && this.documentMode == null)
      ) {
        a.setAttribute("xlink:href", Graph.foreignObjectWarningLink);
        a.setAttribute("target", "_blank");
      } else {
        a.setAttributeNS(
          mxConstants.NS_XLINK,
          "xlink:href",
          Graph.foreignObjectWarningLink,
        );
        a.setAttributeNS(mxConstants.NS_XLINK, "target", "_blank");
      }

      var text = canvas.createElement("text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "10px");
      text.setAttribute("x", "50%");
      text.setAttribute("y", "100%");
      mxUtils.write(text, Graph.foreignObjectWarningText);

      sw.appendChild(g1);
      a.appendChild(text);
      sw.appendChild(a);
      root.appendChild(sw);
    }
  }

  /**
   * Hook for creating the canvas used in getSvg.
   */
  updateSvgLinks(node, target, removeCustom) {
    var links = node.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");

      if (href == null) {
        href = links[i].getAttribute("xlink:href");
      }

      if (href != null) {
        if (target != null && /^https?:\/\//.test(href)) {
          links[i].setAttribute("target", target);
        } else if (removeCustom && this.isCustomLink(href)) {
          links[i].setAttribute("href", "javascript:void(0);");
        }
      }
    }
  }

  /**
   * Returns the first ancestor of the current selection with the given name.
   */
  getSelectedElement() {
    var node = null;

    if (window.getSelection) {
      var sel: any = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        var range = sel.getRangeAt(0);
        node = range.commonAncestorContainer;
      }
    } else if (this.selection) {
      node = this.selection.createRange().parentElement();
    }

    return node;
  }

  /**
   * Returns the first ancestor of the current selection with the given name.
   */
  getParentByName(node, name, stopAt) {
    while (node != null) {
      if (node.nodeName == name) {
        return node;
      }

      if (node == stopAt) {
        return null;
      }

      node = node.parentNode;
    }

    return node;
  }

  /**
   * Returns the first ancestor of the current selection with the given name.
   */
  getParentByNames(node, names, stopAt) {
    while (node != null) {
      if (mxUtils.indexOf(names, node.nodeName) >= 0) {
        return node;
      }

      if (node == stopAt) {
        return null;
      }

      node = node.parentNode;
    }

    return node;
  }

  /**
   * Selects the given node.
   */
  selectNode(node) {
    var sel: any;
    var range: any;

    // IE9 and non-IE
    if (window.getSelection) {
      sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        range = document.createRange();
        range.selectNode(node);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } // IE < 9
    else if ((sel = this.selection) && sel.type != "Control") {
      var originalRange = sel.createRange();
      originalRange.collapse(true);
      range = sel.createRange();
      range.setEndPoint("StartToStart", originalRange);
      range.select();
    }
  }

  /**
   * 
   */
  insertTableColumn(cell, before) {
    var model = this.getModel();
    model.beginUpdate();

    try {
      var table = cell;
      var index = 0;

      if (this.isTableCell(cell)) {
        var row = model.getParent(cell);
        table = model.getParent(row);
        index = row.getIndex(cell);
      } else {
        if (this.isTableRow(cell)) {
          table = model.getParent(cell);
        }

        if (!before) {
          index = model.getChildCount(model.getChildAt(table, 0)) - 1;
        }
      }

      for (var i = 0; i < model.getChildCount(table); i++) {
        var row = model.getChildAt(table, i);
        var child = model.getChildAt(row, index);
        var clone = model.cloneCell(child);
        var geo = this.getCellGeometry(clone);
        clone.value = null;

        if (geo != null) {
          geo.width = Graph.minTableColumnWidth;
          var rowGeo = this.getCellGeometry(row);

          if (rowGeo != null) {
            geo.height = rowGeo.height;
          }
        }

        model.add(row, clone, index + ((before) ? 0 : 1));
      }

      var tableGeo = this.getCellGeometry(table);

      if (tableGeo != null) {
        tableGeo = tableGeo.clone();
        tableGeo.width += Graph.minTableColumnWidth;

        model.setGeometry(table, tableGeo);
      }
    } finally {
      model.endUpdate();
    }
  }

  /**
   * 
   */
  insertTableRow(cell, before) {
    var model = this.getModel();
    model.beginUpdate();

    try {
      var table = cell;
      var index = 0;

      if (this.isTableCell(cell)) {
        var row = model.getParent(cell);
        table = model.getParent(row);
        index = table.getIndex(row);
      } else if (this.isTableRow(cell)) {
        table = model.getParent(cell);
        index = table.getIndex(cell);
      } else if (!before) {
        index = model.getChildCount(table) - 1;
      }

      var row = model.cloneCell(model.getChildAt(table, index));
      row.value = null;

      var rowGeo = this.getCellGeometry(row);

      if (rowGeo != null) {
        rowGeo.height = Graph.minTableRowHeight;

        for (var i = 0; i < model.getChildCount(row); i++) {
          var cell = model.getChildAt(row, i);
          cell.value = null;

          var geo = this.getCellGeometry(cell);

          if (geo != null) {
            geo.height = rowGeo.height;
          }
        }

        model.add(table, row, index + ((before) ? 0 : 1));

        var tableGeo = this.getCellGeometry(table);

        if (tableGeo != null) {
          tableGeo = tableGeo.clone();
          tableGeo.height += rowGeo.height;

          model.setGeometry(table, tableGeo);
        }
      }
    } finally {
      model.endUpdate();
    }
  }

  /**
   * 
   */
  deleteTableColumn(cell) {
    var model = this.getModel();
    model.beginUpdate();

    try {
      var table = cell;
      var index = 0;

      if (this.isTableCell(cell)) {
        var row = model.getParent(cell);
        table = model.getParent(row);
        index = row.getIndex(cell);
      } else if (this.isTableRow(cell)) {
        table = model.getParent(cell);
        index = model.getChildCount(cell) - 1;
      } else if (this.isTable(cell)) {
        index = model.getChildCount(model.getChildAt(cell, 0)) - 1;
      }

      var width = 0;

      for (var i = 0; i < model.getChildCount(table); i++) {
        var row = model.getChildAt(table, i);
        var child = model.getChildAt(row, index);
        model.remove(child);

        var geo = this.getCellGeometry(child);

        if (geo != null) {
          width = Math.max(width, geo.width);
        }
      }

      var tableGeo = this.getCellGeometry(table);

      if (tableGeo != null) {
        tableGeo = tableGeo.clone();
        tableGeo.width -= width;

        model.setGeometry(table, tableGeo);
      }
    } finally {
      model.endUpdate();
    }
  }

  /**
   * 
   */
  deleteTableRow(cell) {
    var model = this.getModel();
    model.beginUpdate();

    try {
      var row = cell;

      if (this.isTableCell(cell)) {
        row = model.getParent(cell);
      } else if (this.isTable(cell)) {
        row = model.getChildAt(cell, model.getChildCount(cell) - 1);
      }

      var table = model.getParent(row);
      model.remove(row);
      var height = 0;

      var geo = this.getCellGeometry(row);

      if (geo != null) {
        height = geo.height;
      }

      var tableGeo = this.getCellGeometry(table);

      if (tableGeo != null) {
        tableGeo = tableGeo.clone();
        tableGeo.height -= height;

        model.setGeometry(table, tableGeo);
      }
    } finally {
      model.endUpdate();
    }
  }

  /**
   * Inserts a new row into the given table.
   */
  insertRow(table, index) {
    var bd = table.tBodies[0];
    var cells = bd.rows[0].cells;
    var cols = 0;

    // Counts columns including colspans
    for (var i = 0; i < cells.length; i++) {
      var colspan = cells[i].getAttribute("colspan");
      cols += (colspan != null) ? parseInt(colspan) : 1;
    }

    var row = bd.insertRow(index);

    for (var i = 0; i < cols; i++) {
      mxUtils.br(row.insertCell(-1));
    }

    return row.cells[0];
  }

  /**
   * Deletes the given column.
   */
  deleteRow(table, index) {
    table.tBodies[0].deleteRow(index);
  }

  /**
   * Deletes the given column.
   */
  insertColumn(table, index) {
    var hd = table.tHead;

    if (hd != null) {
      // TODO: use colIndex
      for (var h = 0; h < hd.rows.length; h++) {
        var th = document.createElement("th");
        hd.rows[h].appendChild(th);
        mxUtils.br(th);
      }
    }

    var bd = table.tBodies[0];

    for (var i = 0; i < bd.rows.length; i++) {
      var cell = bd.rows[i].insertCell(index);
      mxUtils.br(cell);
    }

    return bd.rows[0].cells[(index >= 0) ? index : bd.rows[0].cells.length - 1];
  }

  /**
   * Deletes the given column.
   */
  deleteColumn(table, index) {
    if (index >= 0) {
      var bd = table.tBodies[0];
      var rows = bd.rows;

      for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells.length > index) {
          rows[i].deleteCell(index);
        }
      }
    }
  }

  /**
   * Inserts the given HTML at the caret position (no undo).
   */
  pasteHtmlAtCaret(html) {
    var sel, range, lastNode;

    // IE9 and non-IE
    if (window.getSelection) {
      sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers (IE9, for one)
        var el = document.createElement("div");
        el.innerHTML = html;
        var frag = document.createDocumentFragment(), node;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }

        range.insertNode(frag);
      }
    } // IE < 9
    else if ((sel = this.selection) && sel.type != "Control") {
      // FIXME: Does not work if selection is empty
      sel.createRange().pasteHTML(html);
    }
  }

  /**
   * Creates an anchor elements for handling the given link in the
   * hint that is shown when the cell is selected.
   */
  createLinkForHint(link, label) {
    link = (link != null) ? link : "javascript:void(0);";

    if (label == null || label.length == 0) {
      if (this.isCustomLink(link)) {
        label = this.getLinkTitle(link);
      } else {
        label = link;
      }
    }

    // Helper function to shorten strings
    function short(str, max) {
      if (str.length > max) {
        str = str.substring(0, Math.round(max / 2)) + "..." +
          str.substring(str.length - Math.round(max / 4));
      }

      return str;
    }

    var a = document.createElement("a");
    a.setAttribute("rel", this.linkRelation);
    a.setAttribute("href", this.getAbsoluteUrl(link));
    a.setAttribute(
      "title",
      short((this.isCustomLink(link)) ? this.getLinkTitle(link) : link, 80),
    );

    if (this.linkTarget != null) {
      a.setAttribute("target", this.linkTarget);
    }

    // Adds shortened label to link
    mxUtils.write(a, short(label, 40));

    // Handles custom links
    if (this.isCustomLink(link)) {
      mxEvent.addListener(
        a,
        "click",
        (evt) => {
          this.customLinkClicked(link);
          mxEvent.consume(evt);
        },
      );
    }

    return a;
  }

  /**
   * Customized graph for touch devices.
   */
  initTouch() {
    // Disables new connections via "hotspot"
    this.connectionHandler.marker.isEnabled = () => {
      return this.graph.connectionHandler.first != null;
    }; // Hides menu when editing starts

    this.addListener(mxEvent.START_EDITING, (sender, evt) => {
      this.popupMenuHandler.hideMenu();
    });

    // Adds custom hit detection if native hit detection found no cell
    var graphUpdateMouseEvent = this.updateMouseEvent;
    this.updateMouseEvent = (me) => {
      me = graphUpdateMouseEvent.apply(this, arguments);

      if (mxEvent.isTouchEvent(me.getEvent()) && me.getState() == null) {
        var cell = this.getCellAt(me.graphX, me.graphY);

        if (
          cell != null && this.isSwimlane(cell) &&
          this.hitsSwimlaneContent(cell, me.graphX, me.graphY)
        ) {
          cell = null;
        } else {
          me.state = this.view.getState(cell);

          if (me.state != null && me.state.shape != null) {
            this.container.style.cursor = me.state.shape.node.style.cursor;
          }
        }
      }

      if (me.getState() == null && this.isEnabled()) {
        this.container.style.cursor = "default";
      }

      return me;
    }; // Context menu trigger implementation depending on current selection state
    // combined with support for normal popup trigger.

    var cellSelected = false;
    var selectionEmpty = false;
    var menuShowing = false;

    var oldFireMouseEvent = this.fireMouseEvent;

    this.fireMouseEvent = (evtName, me, sender) => {
      if (evtName == mxEvent.MOUSE_DOWN) {
        // For hit detection on edges
        me = this.updateMouseEvent(me);

        cellSelected = this.isCellSelected(me.getCell());
        selectionEmpty = this.isSelectionEmpty();
        menuShowing = this.popupMenuHandler.isMenuShowing();
      }

      oldFireMouseEvent.apply(this, arguments);
    }; // Shows popup menu if cell was selected or selection was empty and background was clicked
    // FIXME: Conflicts with mxPopupMenuHandler.prototype.getCellForPopupEvent in Editor.js by
    // selecting parent for selected children in groups before this check can be made.

    this.popupMenuHandler.mouseUp = (sender, me) => {
      this.popupMenuHandler.popupTrigger = !this.isEditing() &&
        this.isEnabled() &&
        (me.getState() == null || !me.isSource(me.getState().control)) &&
        (this.popupMenuHandler.popupTrigger ||
          (!menuShowing && !mxEvent.isMouseEvent(me.getEvent()) &&
            ((selectionEmpty && me.getCell() == null &&
              this.isSelectionEmpty()) ||
              (cellSelected && this.isCellSelected(me.getCell())))));
      mxPopupMenuHandler.prototype.mouseUp.apply(
        this.popupMenuHandler,
        [sender, me],
      );
    };
  }
}
