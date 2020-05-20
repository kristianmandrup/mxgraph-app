import mx from 'mx'
import { Menubar } from '../../Menubar'
const {
  mxMouseEvent,
  mxEdgeHandler,
  mxEventObject,
  mxResources,
  mxConstants,
  mxClient,
  mxEvent,
  mxUtils,
} = mx

/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
export class Menus {
  editorUi: any
  menus: any
  checkmarkImage: any
  customFonts: any[] = []
  customFontSizes: any[] = []
  documentMode: any

  constructor(editorUi) {
    this.editorUi = editorUi
    this.menus = new Object()
    this.init()

    // Pre-fetches checkmark image
    if (!mxClient.IS_SVG) {
      new Image().src = this.checkmarkImage
    }
  }

  /**
   * Sets the default font family.
   */
  defaultFont = 'Helvetica'

  /**
   * Sets the default font size.
   */
  defaultFontSize = '12'

  /**
   * Sets the default font size.
   */
  defaultMenuItems = ['file', 'edit', 'view', 'arrange', 'extras', 'help']

  /**
   * Adds the label menu items to the given menu and parent.
   */
  defaultFonts = [
    'Helvetica',
    'Verdana',
    'Times New Roman',
    'Garamond',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Lucida Console',
    'Tahoma',
  ]

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    var graph = this.editorUi.editor.graph
    var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled)

    this.customFonts = []
    this.customFontSizes = []

    // TODO: add menus
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  put(name, menu) {
    this.menus[name] = menu

    return menu
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  get(name) {
    return this.menus[name]
  }

  /**
   * Adds the given submenu.
   */
  addSubmenu(name, menu, parent, label) {
    var entry = this.get(name)

    if (entry != null) {
      var enabled = entry.isEnabled()

      if (menu.showDisabled || enabled) {
        var submenu = menu.addItem(
          label || mxResources.get(name),
          null,
          null,
          parent,
          null,
          enabled
        )
        this.addMenu(name, menu, submenu)
      }
    }
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addMenu(name, popupMenu, parent) {
    var menu = this.get(name)

    if (menu != null && (popupMenu.showDisabled || menu.isEnabled())) {
      this.get(name).execute(popupMenu, parent)
    }
  }

  /**
   * Adds a menu item to insert a table.
   */
  addInsertTableItem(menu, insertFn) {
    insertFn =
      insertFn != null
        ? insertFn
        : (evt, rows, cols) => {
            var graph = this.editorUi.editor.graph
            var td = graph.getParentByName(mxEvent.getSource(evt), 'TD')

            if (td != null && graph.cellEditor.textarea != null) {
              var row2 = graph.getParentByName(td, 'TR')

              // To find the new link, we create a list of all existing links first
              // LATER: Refactor for reuse with code for finding inserted image below
              var tmp: any = graph.cellEditor.textarea.getElementsByTagName('table')
              var oldTables: any[] = []

              for (var i = 0; i < tmp.length; i++) {
                oldTables.push(tmp[i])
              }

              // Finding the new table will work with insertHTML, but IE does not support that
              graph.container.focus()
              graph.pasteHtmlAtCaret(createTable(rows, cols))

              // Moves cursor to first table cell
              var newTables = graph.cellEditor.textarea.getElementsByTagName('table')

              if (newTables.length == oldTables.length + 1) {
                // Inverse order in favor of appended tables
                for (var i = newTables.length - 1; i >= 0; i--) {
                  if (i == 0 || newTables[i] != oldTables[i - 1]) {
                    graph.selectNode(newTables[i].rows[0].cells[0])
                    break
                  }
                }
              }
            }
          }

    // KNOWN: Does not work in IE8 standards and quirks
    var graph = this.editorUi.editor.graph
    var row2: any
    var td: any

    function createTable(rows, cols) {
      var html = ['<table>']

      for (var i = 0; i < rows; i++) {
        html.push('<tr>')

        for (var j = 0; j < cols; j++) {
          html.push('<td><br></td>')
        }

        html.push('</tr>')
      }

      html.push('</table>')

      return html.join('')
    }

    // Show table size dialog
    var elt2 = menu.addItem(
      '',
      null,
      mxUtils.bind(this, function (evt) {
        if (td != null && row2 != null) {
          insertFn(evt, row2.sectionRowIndex + 1, td.cellIndex + 1)
        }
      })
    )

    // Quirks mode does not add cell padding if cell is empty, needs good old spacer solution
    var quirksCellHtml =
      '<img src="' + mxClient.imageBasePath + '/transparent.gif' + '" width="16" height="16"/>'

    function createPicker(rows, cols) {
      var table2 = document.createElement('table')
      table2.setAttribute('border', '1')
      table2.style.borderCollapse = 'collapse'

      if (!mxClient.IS_QUIRKS) {
        table2.setAttribute('cellPadding', '8')
      }

      for (var i = 0; i < rows; i++) {
        var row = table2.insertRow(i)

        for (var j = 0; j < cols; j++) {
          var cell = row.insertCell(-1)

          if (mxClient.IS_QUIRKS) {
            cell.innerHTML = quirksCellHtml
          }
        }
      }

      return table2
    }

    function extendPicker(picker, rows, cols) {
      for (var i = picker.rows.length; i < rows; i++) {
        var row = picker.insertRow(i)

        for (var j = 0; j < picker.rows[0].cells.length; j++) {
          var cell = row.insertCell(-1)

          if (mxClient.IS_QUIRKS) {
            cell.innerHTML = quirksCellHtml
          }
        }
      }

      for (var i: any = 0; i < picker.rows.length; i++) {
        var row = picker.rows[i]

        for (var j: number = row.cells.length; j < cols; j++) {
          var cell = row.insertCell(-1)

          if (mxClient.IS_QUIRKS) {
            cell.innerHTML = quirksCellHtml
          }
        }
      }
    }

    elt2.firstChild.innerHTML = ''
    var picker = createPicker(5, 5)
    elt2.firstChild.appendChild(picker)

    var label = document.createElement('div')
    label.style.padding = '4px'
    label.style.fontSize = this.defaultFontSize + 'px'
    label.innerHTML = '1x1'
    elt2.firstChild.appendChild(label)

    mxEvent.addListener(picker, 'mouseover', function (e) {
      td = graph.getParentByName(mxEvent.getSource(e), 'TD')

      if (td != null) {
        row2 = graph.getParentByName(td, 'TR')
        extendPicker(picker, Math.min(20, row2.sectionRowIndex + 2), Math.min(20, td.cellIndex + 2))
        label.innerHTML = td.cellIndex + 1 + 'x' + (row2.sectionRowIndex + 1)

        for (var i = 0; i < picker.rows.length; i++) {
          var r = picker.rows[i]

          for (var j = 0; j < r.cells.length; j++) {
            var cell = r.cells[j]

            if (i <= row2.sectionRowIndex && j <= td.cellIndex) {
              cell.style.backgroundColor = 'blue'
            } else {
              cell.style.backgroundColor = 'white'
            }
          }
        }

        mxEvent.consume(e)
      }
    })
  }

  /**
   * Adds a style change item to the given menu.
   */
  edgeStyleChange(menu, label, keys, values, sprite, parent, reset) {
    return menu.addItem(
      label,
      null,
      () => {
        var graph = this.editorUi.editor.graph
        graph.stopEditing(false)

        graph.getModel().beginUpdate()
        try {
          var cells = graph.getSelectionCells()
          var edges: any[] = []

          for (var i = 0; i < cells.length; i++) {
            var cell = cells[i]

            if (graph.getModel().isEdge(cell)) {
              if (reset) {
                var geo = graph.getCellGeometry(cell)

                // Resets all edge points
                if (geo != null) {
                  geo = geo.clone()
                  geo.points = null
                  graph.getModel().setGeometry(cell, geo)
                }
              }

              for (var j = 0; j < keys.length; j++) {
                graph.setCellStyles(keys[j], values[j], [cell])
              }

              edges.push(cell)
            }
          }

          this.editorUi.fireEvent(
            new mxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', edges)
          )
        } finally {
          graph.getModel().endUpdate()
        }
      },
      parent,
      sprite
    )
  }

  /**
   * Adds a style change item to the given menu.
   */
  styleChange(menu, label, keys, values, sprite, parent, fn, post) {
    var apply = this.createStyleChangeFunction(keys, values)

    return menu.addItem(
      label,
      null,
      () => {
        var graph = this.editorUi.editor.graph

        if (fn != null && graph.cellEditor.isContentEditing()) {
          fn()
        } else {
          apply(post)
        }
      },
      parent,
      sprite
    )
  }

  /**
   *
   */
  createStyleChangeFunction(keys, values) {
    return (post) => {
      var graph = this.editorUi.editor.graph
      graph.stopEditing(false)

      graph.getModel().beginUpdate()
      try {
        var cells = graph.getSelectionCells()

        for (var i = 0; i < keys.length; i++) {
          graph.setCellStyles(keys[i], values[i], cells)

          // Removes CSS alignment to produce consistent output
          if (keys[i] == mxConstants.STYLE_ALIGN) {
            graph.updateLabelElements(cells, function (elt) {
              elt.removeAttribute('align')
              elt.style.textAlign = null
            })
          }

          // Updates autosize after font changes
          if (keys[i] == mxConstants.STYLE_FONTFAMILY) {
            for (var i = 0; i < cells.length; i++) {
              if (graph.model.getChildCount(cells[i]) == 0) {
                graph.autoSizeCell(cells[i], false)
              }
            }
          }
        }

        if (post != null) {
          post()
        }

        this.editorUi.fireEvent(
          new mxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', cells)
        )
      } finally {
        graph.getModel().endUpdate()
      }
    }
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  toggleStyle(key, defaultValue) {
    var graph = this.editorUi.editor.graph
    var value = graph.toggleCellStyles(key, defaultValue)
    this.editorUi.fireEvent(
      new mxEventObject(
        'styleChanged',
        'keys',
        [key],
        'values',
        [value],
        'cells',
        graph.getSelectionCells()
      )
    )
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addMenuItem(menu, key, parent, trigger, sprite?, label?) {
    var action = this.editorUi.actions.get(key)

    if (action != null && (menu.showDisabled || action.isEnabled()) && action.visible) {
      var item = menu.addItem(
        label || action.label,
        null,
        function () {
          action.funct(trigger)
        },
        parent,
        sprite,
        action.isEnabled()
      )

      // Adds checkmark image
      if (action.toggleAction && action.isSelected()) {
        menu.addCheckmark(item, Editor.checkmarkImage)
      }

      this.addShortcut(item, action)

      return item
    }

    return null
  }

  /**
   * Adds a checkmark to the given menuitem.
   */
  addShortcut(item, action) {
    if (action.shortcut != null) {
      var td = item.firstChild.nextSibling.nextSibling
      var span = document.createElement('span')
      span.style.color = 'gray'
      mxUtils.write(span, action.shortcut)
      td.appendChild(span)
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addMenuItems(menu, keys, parent, trigger, sprites?) {
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == '-') {
        menu.addSeparator(parent)
      } else {
        this.addMenuItem(menu, keys[i], parent, trigger, sprites != null ? sprites[i] : null)
      }
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  createPopupMenu(menu, cell, evt) {
    menu.smartSeparators = true

    this.addPopupMenuHistoryItems(menu, cell, evt)
    this.addPopupMenuEditItems(menu, cell, evt)
    this.addPopupMenuStyleItems(menu, cell, evt)
    this.addPopupMenuArrangeItems(menu, cell, evt)
    this.addPopupMenuCellItems(menu, cell, evt)
    this.addPopupMenuSelectionItems(menu, cell, evt)
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuHistoryItems(menu, cell, evt) {
    if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ['undo', 'redo'], null, evt)
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuEditItems(menu, cell, evt) {
    if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ['pasteHere'], null, evt)
    } else {
      this.addMenuItems(menu, ['delete', '-', 'cut', 'copy', '-', 'duplicate'], null, evt)
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuStyleItems(menu, cell, evt) {
    if (this.editorUi.editor.graph.getSelectionCount() == 1) {
      this.addMenuItems(menu, ['-', 'setAsDefaultStyle'], null, evt)
    } else if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ['-', 'clearDefaultStyle'], null, evt)
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuArrangeItems(menu, cell, evt) {
    var graph = this.editorUi.editor.graph

    if (!graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ['-', 'toFront', 'toBack'], null, evt)
    }

    if (graph.getSelectionCount() > 1) {
      this.addMenuItems(menu, ['-', 'group'], null, evt)
    } else if (
      graph.getSelectionCount() == 1 &&
      !graph.getModel().isEdge(cell) &&
      !graph.isSwimlane(cell) &&
      graph.getModel().getChildCount(cell) > 0
    ) {
      this.addMenuItems(menu, ['-', 'ungroup'], null, evt)
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuCellItems(menu, cell, evt) {
    var graph = this.editorUi.editor.graph
    cell = graph.getSelectionCell()
    var state = graph.view.getState(cell)
    menu.addSeparator()

    if (state != null) {
      var hasWaypoints = false

      if (
        graph.getModel().isEdge(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_EDGE, null) != 'entityRelationEdgeStyle' &&
        mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) != 'arrow'
      ) {
        var handler = graph.selectionCellsHandler.getHandler(cell)
        var isWaypoint = false

        if (handler instanceof mxEdgeHandler && handler.bends != null && handler.bends.length > 2) {
          var index = handler.getHandleForEvent(graph.updateMouseEvent(new mxMouseEvent(evt)))

          // Configures removeWaypoint action before execution
          // Using trigger parameter is cleaner but have to find waypoint here anyway.
          var rmWaypointAction = this.editorUi.actions.get('removeWaypoint')
          rmWaypointAction.handler = handler
          rmWaypointAction.index = index

          isWaypoint = index > 0 && index < handler.bends.length - 1
        }

        menu.addSeparator()
        this.addMenuItem(menu, 'turn', null, evt, null, mxResources.get('reverse'))
        this.addMenuItems(menu, [isWaypoint ? 'removeWaypoint' : 'addWaypoint'], null, evt)

        // Adds reset waypoints option if waypoints exist
        var geo = graph.getModel().getGeometry(cell)
        hasWaypoints = geo != null && geo.points != null && geo.points.length > 0
      }

      if (
        graph.getSelectionCount() == 1 &&
        (hasWaypoints ||
          (graph.getModel().isVertex(cell) && graph.getModel().getEdgeCount(cell) > 0))
      ) {
        this.addMenuItems(menu, ['-', 'clearWaypoints'], null, evt)
      }
    }

    if (graph.getSelectionCount() == 1) {
      this.addMenuItems(menu, ['-', 'editData', 'editLink'], null, evt)

      // Shows edit image action if there is an image in the style
      if (
        graph.getModel().isVertex(cell) &&
        mxUtils.getValue(state.style, mxConstants.STYLE_IMAGE, null) != null
      ) {
        menu.addSeparator()
        this.addMenuItem(menu, 'image', null, evt).firstChild.nextSibling.innerHTML =
          mxResources.get('editImage') + '...'
      }
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  addPopupMenuSelectionItems(menu, cell, evt) {
    if (this.editorUi.editor.graph.isSelectionEmpty()) {
      this.addMenuItems(menu, ['-', 'selectVertices', 'selectEdges', 'selectAll'], null, evt)
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  createMenubar(container) {
    var menubar = new Menubar(this.editorUi, container)
    var menus = this.defaultMenuItems

    for (var i = 0; i < menus.length; i++) {
      const addMenu = (menu) => {
        const menuResource = mxResources.get(menus[i])
        var elt = menubar.addMenu(menuResource, () => {
          // Allows extensions of menu.funct
          menu.funct.apply(this, [menu])
        })
        this.menuCreated(menu, elt)
      }
      addMenu(this.get(menus[i]))
    }

    return menubar
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  menuCreated(menu, elt, className?) {
    if (elt != null) {
      className = className != null ? className : 'geItem'
      const { documentMode } = this
      menu.addListener('stateChanged', function () {
        elt.enabled = menu.enabled

        if (!menu.enabled) {
          elt.className = className + ' mxDisabled'

          if (documentMode == 8) {
            elt.style.color = '#c3c3c3'
          }
        } else {
          elt.className = className

          if (documentMode == 8) {
            elt.style.color = ''
          }
        }
      })
    }
  }
}
