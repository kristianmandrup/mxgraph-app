import { Menu } from '../Menu'

export class MenuAdder {
  editorUi: any
  graph: any

  menuItems: any = {}
  menuName = 'no name'

  itemLayout: string[] = []
  isGraphEnabled: boolean = true

  defaultFonts: any
  customFonts: any
  customFontSizes: any

  constructor(editorUi, graph) {
    this.editorUi = editorUi
    this.graph = graph
  }

  // from Menus
  promptChange(menu, label, hint, defaultValue, key, parent, enabled, fn?, sprite?) {}

  put(label: string, menu: any) {}

  addMenuItems(menu: any, items: any[], node?: any) {}

  add() {
    this.put(this.menuName, this.createMenu())
  }

  addSubmenu(label: string, menu: any, node: any) {}

  addMenuItem(menu, menuItemClass) {
    new menuItemClass(this.editorUi, this.graph, menu).add()
  }

  createMenu() {
    new Menu((menu, parent) => {
      this.itemLayout.map((name) => {
        if (name == '-') {
          return menu.addSeparator(parent)
        }
        const menuItemClass = this.menuItems[name]
        this.addMenuItem(menu, menuItemClass)
      })

      this.extraItems(menu, parent)
    })
  }

  extraItems(menu, parent) {}
}
