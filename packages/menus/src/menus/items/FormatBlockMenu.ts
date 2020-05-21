import { Menu, MenuAdder } from "@mxgraph-app/menus";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

export class FormatBlockMenu extends MenuAdder {
  add() {
    const { graph } = this;
    this.put(
      "formatBlock",
      new Menu((menu, parent) => {
        function addItem(label, tag) {
          return menu.addItem(
            label,
            null,
            () => {
              // TODO: Check if visible
              if (graph.cellEditor.textarea != null) {
                graph.cellEditor.textarea.focus();
                document.execCommand("formatBlock", false, "<" + tag + ">");
              }
            },
            parent
          );
        }

        addItem(mxResources.get("normal"), "p");

        addItem("", "h1").firstChild.nextSibling.innerHTML =
          '<h1 style="margin:0px;">' + mxResources.get("heading") + " 1</h1>";
        addItem("", "h2").firstChild.nextSibling.innerHTML =
          '<h2 style="margin:0px;">' + mxResources.get("heading") + " 2</h2>";
        addItem("", "h3").firstChild.nextSibling.innerHTML =
          '<h3 style="margin:0px;">' + mxResources.get("heading") + " 3</h3>";
        addItem("", "h4").firstChild.nextSibling.innerHTML =
          '<h4 style="margin:0px;">' + mxResources.get("heading") + " 4</h4>";
        addItem("", "h5").firstChild.nextSibling.innerHTML =
          '<h5 style="margin:0px;">' + mxResources.get("heading") + " 5</h5>";
        addItem("", "h6").firstChild.nextSibling.innerHTML =
          '<h6 style="margin:0px;">' + mxResources.get("heading") + " 6</h6>";

        addItem("", "pre").firstChild.nextSibling.innerHTML =
          '<pre style="margin:0px;">' + mxResources.get("formatted") + "</pre>";
        addItem("", "blockquote").firstChild.nextSibling.innerHTML =
          '<blockquote style="margin-top:0px;margin-bottom:0px;">' +
          mxResources.get("blockquote") +
          "</blockquote>";
      })
    );
  }
}
