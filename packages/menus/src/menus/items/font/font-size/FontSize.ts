import { Menu, MenuAdder } from "@mxgraph-app/menus";
import { FontItem } from "./FontItem";
import mx from "@mxgraph-app/mx";
const { mxConstants, mxResources } = mx;

export class FontSizeMenu extends MenuAdder {
  constructor(editorUi, opts: any) {
    super(editorUi, opts);
  }

  add() {
    const { graph } = this;
    this.put(
      "fontSize",
      new Menu((menu, parent) => {
        const createAddItem = (menu) => {
          const fontSizeItem = new FontItem(this.menuStyler, graph, menu);
          return (item) => {
            fontSizeItem.addItem(item);
          };
        };
        const addItem = createAddItem(menu);

        var sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72];

        for (var i = 0; i < sizes.length; i++) {
          addItem(sizes[i]);
        }

        menu.addSeparator(parent);

        if (this.customFontSizes.length > 0) {
          for (var i = 0; i < this.customFontSizes.length; i++) {
            addItem(this.customFontSizes[i]);
          }

          menu.addSeparator(parent);

          menu.addItem(
            mxResources.get("reset"),
            null,
            () => {
              this.customFontSizes = [];
            },
            parent
          );

          menu.addSeparator(parent);
        }

        this.promptChange(menu, mxResources.get("custom") + "...", "(pt)", {
          defaultValue: "12",
          key: mxConstants.STYLE_FONTSIZE,
          parent,
          enabled: true,
          fn: (newValue) => {
            this.customFontSizes.push(newValue);
          },
          sprite: true,
        });
      })
    );
  }
}
