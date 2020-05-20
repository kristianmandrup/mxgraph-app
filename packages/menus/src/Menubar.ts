import mx from 'mx'
const { mxClient, mxPopupMenu, mxEvent, mxUtils } = mx

/**
 * Construcs a new menubar for the given editor.
 */
export class Menubar {
  editorUi: any
  container: any
  currentElt: any

  constructor(editorUi, container) {
    this.editorUi = editorUi
    this.container = container
  }

  /**
   * Adds the menubar elements.
   */
  hideMenu() {
    this.editorUi.hideCurrentMenu()
  }

  /**
   * Adds a submenu to this menubar.
   */
  addMenu(label, funct, before?) {
    var elt = document.createElement('a')
    elt.className = 'geItem'
    mxUtils.write(elt, label)
    this.addMenuHandler(elt, funct)

    if (before != null) {
      this.container.insertBefore(elt, before)
    } else {
      this.container.appendChild(elt)
    }

    return elt
  }

  /**
   * Adds a handler for showing a menu in the given element.
   */
  addMenuHandler(elt, funct) {
    if (funct != null) {
      var show = true

      var clickHandler = (evt) => {
        if ((show && elt.enabled == null) || elt.enabled) {
          this.editorUi.editor.graph.popupMenuHandler.hideMenu()
          var menu: any = new mxPopupMenu(funct)
          menu.div.className += ' geMenubarMenu'
          menu.smartSeparators = true
          menu.showDisabled = true
          menu.autoExpand = true

          // Disables autoexpand and destroys menu when hidden
          menu.hideMenu = () => {
            mxPopupMenu.prototype.hideMenu.apply(menu, [])
            this.editorUi.resetCurrentMenu()
            menu.destroy()
          }

          var offset = mxUtils.getOffset(elt)
          menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt)
          this.editorUi.setCurrentMenu(menu, elt)
        }

        mxEvent.consume(evt)
      }

      // Shows menu automatically while in expanded state
      mxEvent.addListener(elt, 'mousemove', (evt) => {
        if (this.editorUi.currentMenu != null && this.editorUi.currentMenuElt != elt) {
          this.editorUi.hideCurrentMenu()
          clickHandler(evt)
        }
      })

      // Hides menu if already showing and prevents focus
      mxEvent.addListener(elt, mxClient.IS_POINTER ? 'pointerdown' : 'mousedown', (evt) => {
        show = this.currentElt != elt
        evt.preventDefault()
      })

      mxEvent.addListener(
        elt,
        'click',
        mxUtils.bind(this, function (evt) {
          clickHandler(evt)
          show = true
        })
      )
    }
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  destroy() {
    // do nothing
  }
}
