import mx from 'mx'
import { Menu } from './Menu'
import { FilenameDialog } from 'sample/FilenameDialog'
const {
  mxCircleLayout,
  mxFastOrganicLayout,
  mxRadialTreeLayout,
  mxCompactTreeLayout,
  mxHierarchicalLayout,
  mxEventObject,
  mxResources,
  mxConstants,
  mxClient,
  mxPopupMenu,
  mxEvent,
  mxUtils,
} = mx

export class MenuInitializer {
  editorUi: any
  customFonts: any[] = []
  customFontSizes: any[] = []
  put: any
  defaultFonts: any
  styleChange: any
  promptChange: any
  addMenuItems: any
  addSubmenu: any

  constructor(editorUi: any) {
    this.editorUi = editorUi
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    var graph = this.editorUi.editor.graph
    var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled)

    this.customFonts = []
    this.customFontSizes = []

    this.put(
      'fontFamily',
      new Menu((menu, parent) => {
        var addItem = (fontname) => {
          var tr = this.styleChange(
            menu,
            fontname,
            [mxConstants.STYLE_FONTFAMILY],
            [fontname],
            null,
            parent,
            () => {
              document.execCommand('fontname', false, fontname)
            },
            () => {
              graph.updateLabelElements(graph.getSelectionCells(), function (elt) {
                elt.removeAttribute('face')
                elt.style.fontFamily = null

                if (elt.nodeName == 'PRE') {
                  graph.replaceElement(elt, 'div')
                }
              })
            }
          )
          tr.firstChild.nextSibling.style.fontFamily = fontname
        }

        for (var i = 0; i < this.defaultFonts.length; i++) {
          addItem(this.defaultFonts[i])
        }

        menu.addSeparator(parent)

        if (this.customFonts.length > 0) {
          for (var i = 0; i < this.customFonts.length; i++) {
            addItem(this.customFonts[i])
          }

          menu.addSeparator(parent)

          menu.addItem(
            mxResources.get('reset'),
            null,
            () => {
              this.customFonts = []
              this.editorUi.fireEvent(new mxEventObject('customFontsChanged'))
            },
            parent
          )

          menu.addSeparator(parent)
        }

        this.promptChange(
          menu,
          mxResources.get('custom') + '...',
          '',
          mxConstants.DEFAULT_FONTFAMILY,
          mxConstants.STYLE_FONTFAMILY,
          parent,
          true,
          (newValue) => {
            if (mxUtils.indexOf(this.customFonts, newValue) < 0) {
              this.customFonts.push(newValue)
              this.editorUi.fireEvent(new mxEventObject('customFontsChanged'))
            }
          }
        )
      })
    )
    this.put(
      'formatBlock',
      new Menu((menu, parent) => {
        function addItem(label, tag) {
          return menu.addItem(
            label,
            null,
            () => {
              // TODO: Check if visible
              if (graph.cellEditor.textarea != null) {
                graph.cellEditor.textarea.focus()
                document.execCommand('formatBlock', false, '<' + tag + '>')
              }
            },
            parent
          )
        }

        addItem(mxResources.get('normal'), 'p')

        addItem('', 'h1').firstChild.nextSibling.innerHTML =
          '<h1 style="margin:0px;">' + mxResources.get('heading') + ' 1</h1>'
        addItem('', 'h2').firstChild.nextSibling.innerHTML =
          '<h2 style="margin:0px;">' + mxResources.get('heading') + ' 2</h2>'
        addItem('', 'h3').firstChild.nextSibling.innerHTML =
          '<h3 style="margin:0px;">' + mxResources.get('heading') + ' 3</h3>'
        addItem('', 'h4').firstChild.nextSibling.innerHTML =
          '<h4 style="margin:0px;">' + mxResources.get('heading') + ' 4</h4>'
        addItem('', 'h5').firstChild.nextSibling.innerHTML =
          '<h5 style="margin:0px;">' + mxResources.get('heading') + ' 5</h5>'
        addItem('', 'h6').firstChild.nextSibling.innerHTML =
          '<h6 style="margin:0px;">' + mxResources.get('heading') + ' 6</h6>'

        addItem('', 'pre').firstChild.nextSibling.innerHTML =
          '<pre style="margin:0px;">' + mxResources.get('formatted') + '</pre>'
        addItem('', 'blockquote').firstChild.nextSibling.innerHTML =
          '<blockquote style="margin-top:0px;margin-bottom:0px;">' +
          mxResources.get('blockquote') +
          '</blockquote>'
      })
    )
    this.put(
      'fontSize',
      new Menu((menu, parent) => {
        var sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72]

        var addItem = (fontsize) => {
          this.styleChange(
            menu,
            fontsize,
            [mxConstants.STYLE_FONTSIZE],
            [fontsize],
            null,
            parent,
            () => {
              if (graph.cellEditor.textarea != null) {
                // Creates an element with arbitrary size 3
                document.execCommand('fontSize', false, '3')

                // Changes the css font size of the first font element inside the in-place editor with size 3
                // hopefully the above element that we've just created. LATER: Check for new element using
                // previous result of getElementsByTagName (see other actions)
                var elts = graph.cellEditor.textarea.getElementsByTagName('font')

                for (var i = 0; i < elts.length; i++) {
                  if (elts[i].getAttribute('size') == '3') {
                    elts[i].removeAttribute('size')
                    elts[i].style.fontSize = fontsize + 'px'

                    break
                  }
                }
              }
            }
          )
        }

        for (var i = 0; i < sizes.length; i++) {
          addItem(sizes[i])
        }

        menu.addSeparator(parent)

        if (this.customFontSizes.length > 0) {
          for (var i = 0; i < this.customFontSizes.length; i++) {
            addItem(this.customFontSizes[i])
          }

          menu.addSeparator(parent)

          menu.addItem(
            mxResources.get('reset'),
            null,
            () => {
              this.customFontSizes = []
            },
            parent
          )

          menu.addSeparator(parent)
        }

        this.promptChange(
          menu,
          mxResources.get('custom') + '...',
          '(pt)',
          '12',
          mxConstants.STYLE_FONTSIZE,
          parent,
          true,
          (newValue) => {
            this.customFontSizes.push(newValue)
          }
        )
      })
    )
    this.put(
      'direction',
      new Menu((menu, parent) => {
        menu.addItem(
          mxResources.get('flipH'),
          null,
          function () {
            graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false)
          },
          parent
        )
        menu.addItem(
          mxResources.get('flipV'),
          null,
          function () {
            graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false)
          },
          parent
        )
        this.addMenuItems(menu, ['-', 'rotation'], parent)
      })
    )
    this.put(
      'align',
      new Menu(
        mxUtils.bind(this, function (menu, parent) {
          menu.addItem(
            mxResources.get('leftAlign'),
            null,
            function () {
              graph.alignCells(mxConstants.ALIGN_LEFT)
            },
            parent
          )
          menu.addItem(
            mxResources.get('center'),
            null,
            function () {
              graph.alignCells(mxConstants.ALIGN_CENTER)
            },
            parent
          )
          menu.addItem(
            mxResources.get('rightAlign'),
            null,
            function () {
              graph.alignCells(mxConstants.ALIGN_RIGHT)
            },
            parent
          )
          menu.addSeparator(parent)
          menu.addItem(
            mxResources.get('topAlign'),
            null,
            function () {
              graph.alignCells(mxConstants.ALIGN_TOP)
            },
            parent
          )
          menu.addItem(
            mxResources.get('middle'),
            null,
            function () {
              graph.alignCells(mxConstants.ALIGN_MIDDLE)
            },
            parent
          )
          menu.addItem(
            mxResources.get('bottomAlign'),
            null,
            function () {
              graph.alignCells(mxConstants.ALIGN_BOTTOM)
            },
            parent
          )
        })
      )
    )
    this.put(
      'distribute',
      new Menu(
        mxUtils.bind(this, function (menu, parent) {
          menu.addItem(
            mxResources.get('horizontal'),
            null,
            function () {
              graph.distributeCells(true)
            },
            parent
          )
          menu.addItem(
            mxResources.get('vertical'),
            null,
            function () {
              graph.distributeCells(false)
            },
            parent
          )
        })
      )
    )
    this.put(
      'layout',
      new Menu((menu, parent) => {
        var promptSpacing = (defaultValue, fn) => {
          var dlg = new FilenameDialog(
            this.editorUi,
            defaultValue,
            mxResources.get('apply'),
            function (newValue) {
              fn(parseFloat(newValue))
            },
            mxResources.get('spacing')
          )
          this.editorUi.showDialog(dlg.container, 300, 80, true, true)
          dlg.init()
        }

        menu.addItem(
          mxResources.get('horizontalFlow'),
          null,
          () => {
            var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST)

            this.editorUi.executeLayout(function () {
              var selectionCells = graph.getSelectionCells()
              layout.execute(
                graph.getDefaultParent(),
                selectionCells.length == 0 ? null : selectionCells
              )
            }, true)
          },
          parent
        )
        menu.addItem(
          mxResources.get('verticalFlow'),
          null,
          () => {
            var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH)

            this.editorUi.executeLayout(function () {
              var selectionCells = graph.getSelectionCells()
              layout.execute(
                graph.getDefaultParent(),
                selectionCells.length == 0 ? null : selectionCells
              )
            }, true)
          },
          parent
        )
        menu.addSeparator(parent)
        menu.addItem(
          mxResources.get('horizontalTree'),
          null,
          () => {
            var tmp = graph.getSelectionCell()
            var roots: any

            if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
              if (graph.getModel().getEdgeCount(tmp) == 0) {
                roots = graph.findTreeRoots(graph.getDefaultParent())
              }
            } else {
              roots = graph.findTreeRoots(tmp)
            }

            if (roots != null && roots.length > 0) {
              tmp = roots[0]
            }

            if (tmp != null) {
              var layout = new mxCompactTreeLayout(graph, true)
              layout.edgeRouting = false
              layout.levelDistance = 30

              promptSpacing(layout.levelDistance, (newValue) => {
                layout.levelDistance = newValue

                this.editorUi.executeLayout(function () {
                  layout.execute(graph.getDefaultParent(), tmp)
                }, true)
              })
            }
          },
          parent
        )
        menu.addItem(
          mxResources.get('verticalTree'),
          null,
          () => {
            var tmp = graph.getSelectionCell()
            var roots: any

            if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
              if (graph.getModel().getEdgeCount(tmp) == 0) {
                roots = graph.findTreeRoots(graph.getDefaultParent())
              }
            } else {
              roots = graph.findTreeRoots(tmp)
            }

            if (roots != null && roots.length > 0) {
              tmp = roots[0]
            }

            if (tmp != null) {
              var layout = new mxCompactTreeLayout(graph, false)
              layout.edgeRouting = false
              layout.levelDistance = 30

              promptSpacing(layout.levelDistance, (newValue) => {
                layout.levelDistance = newValue

                this.editorUi.executeLayout(function () {
                  layout.execute(graph.getDefaultParent(), tmp)
                }, true)
              })
            }
          },
          parent
        )
        menu.addItem(
          mxResources.get('radialTree'),
          null,
          () => {
            var tmp = graph.getSelectionCell()
            var roots: any

            if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
              if (graph.getModel().getEdgeCount(tmp) == 0) {
                roots = graph.findTreeRoots(graph.getDefaultParent())
              }
            } else {
              roots = graph.findTreeRoots(tmp)
            }

            if (roots != null && roots.length > 0) {
              tmp = roots[0]
            }

            if (tmp != null) {
              var layout: any = new mxRadialTreeLayout(graph)
              layout.levelDistance = 80
              layout.autoRadius = true

              promptSpacing(layout.levelDistance, (newValue) => {
                layout.levelDistance = newValue

                this.editorUi.executeLayout(function () {
                  layout.execute(graph.getDefaultParent(), tmp)

                  if (!graph.isSelectionEmpty()) {
                    tmp = graph.getModel().getParent(tmp)

                    if (graph.getModel().isVertex(tmp)) {
                      graph.updateGroupBounds([tmp], graph.gridSize * 2, true)
                    }
                  }
                }, true)
              })
            }
          },
          parent
        )
        menu.addSeparator(parent)
        menu.addItem(
          mxResources.get('organic'),
          null,
          () => {
            var layout = new mxFastOrganicLayout(graph)

            promptSpacing(layout.forceConstant, (newValue) => {
              layout.forceConstant = newValue

              this.editorUi.executeLayout(function () {
                var tmp = graph.getSelectionCell()

                if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
                  tmp = graph.getDefaultParent()
                }

                layout.execute(tmp)

                if (graph.getModel().isVertex(tmp)) {
                  graph.updateGroupBounds([tmp], graph.gridSize * 2, true)
                }
              }, true)
            })
          },
          parent
        )
        menu.addItem(
          mxResources.get('circle'),
          null,
          () => {
            var layout = new mxCircleLayout(graph)

            this.editorUi.executeLayout(function () {
              var tmp = graph.getSelectionCell()

              if (tmp == null || graph.getModel().getChildCount(tmp) == 0) {
                tmp = graph.getDefaultParent()
              }

              layout.execute(tmp)

              if (graph.getModel().isVertex(tmp)) {
                graph.updateGroupBounds([tmp], graph.gridSize * 2, true)
              }
            }, true)
          },
          parent
        )
      })
    )
    this.put(
      'navigation',
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          ['home', '-', 'exitGroup', 'enterGroup', '-', 'expand', 'collapse', '-', 'collapsible'],
          parent
        )
      })
    )
    this.put(
      'arrange',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent)
        this.addSubmenu('direction', menu, parent)
        this.addMenuItems(menu, ['turn', '-'], parent)
        this.addSubmenu('align', menu, parent)
        this.addSubmenu('distribute', menu, parent)
        menu.addSeparator(parent)
        this.addSubmenu('navigation', menu, parent)
        this.addSubmenu('insert', menu, parent)
        this.addSubmenu('layout', menu, parent)
        this.addMenuItems(
          menu,
          ['-', 'group', 'ungroup', 'removeFromGroup', '-', 'clearWaypoints', 'autosize'],
          parent
        )
      })
    ).isEnabled = isGraphEnabled
    this.put(
      'insert',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['insertLink', 'insertImage'], parent)
      })
    )
    this.put(
      'view',
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          (this.editorUi.format != null ? ['formatPanel'] : []).concat(
            [
              'outline',
              'layers',
              '-',
              'pageView',
              'pageScale',
              '-',
              'scrollbars',
              'tooltips',
              '-',
              'grid',
              'guides',
              '-',
              'connectionArrows',
              'connectionPoints',
              '-',
              'resetView',
              'zoomIn',
              'zoomOut',
            ],
            parent
          )
        )
      })
    )
    // Two special dropdowns that are only used in the toolbar
    this.put(
      'viewPanels',
      new Menu((menu, parent) => {
        if (this.editorUi.format != null) {
          this.addMenuItems(menu, ['formatPanel'], parent)
        }

        this.addMenuItems(menu, ['outline', 'layers'], parent)
      })
    )
    this.put(
      'viewZoom',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['resetView', '-'], parent)
        var scales = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]

        for (var i = 0; i < scales.length; i++) {
          ;(function (scale) {
            menu.addItem(
              scale * 100 + '%',
              null,
              function () {
                graph.zoomTo(scale)
              },
              parent
            )
          })(scales[i])
        }

        this.addMenuItems(
          menu,
          ['-', 'fitWindow', 'fitPageWidth', 'fitPage', 'fitTwoPages', '-', 'customZoom'],
          parent
        )
      })
    )
    this.put(
      'file',
      new Menu((menu, parent) => {
        this.addMenuItems(
          menu,
          [
            'new',
            'open',
            '-',
            'save',
            'saveAs',
            '-',
            'import',
            'export',
            '-',
            'pageSetup',
            'print',
          ],
          parent
        )
      })
    )
    this.put(
      'edit',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, [
          'undo',
          'redo',
          '-',
          'cut',
          'copy',
          'paste',
          'delete',
          '-',
          'duplicate',
          '-',
          'editData',
          'editTooltip',
          'editStyle',
          '-',
          'edit',
          '-',
          'editLink',
          'openLink',
          '-',
          'selectVertices',
          'selectEdges',
          'selectAll',
          'selectNone',
          '-',
          'lockUnlock',
        ])
      })
    )
    this.put(
      'extras',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-', 'editDiagram'])
      })
    )
    this.put(
      'help',
      new Menu((menu, parent) => {
        this.addMenuItems(menu, ['help', '-', 'about'])
      })
    )
  }
}
