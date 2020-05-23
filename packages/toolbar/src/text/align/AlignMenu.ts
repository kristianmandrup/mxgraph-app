import { ToolbarMenuAdder } from "../../ToolbarMenuAdder";
import mx from "@mxgraph-app/mx";
const {
  mxConstants,
  mxResources,
  mxClient,
} = mx;

export class AlignMenu extends ToolbarMenuAdder {
  create() {
    // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
    // to catch the focus on click in these browsers. NOTE: Workaround in mxPopupMenu for icon items (without text).
    var alignMenu = this.addMenuFunction(
      "",
      mxResources.get("align"),
      false,
      (menu) => {
        this.addAll(menu);
      },
    );

    alignMenu.style.position = "relative";
    alignMenu.style.whiteSpace = "nowrap";
    alignMenu.style.overflow = "hidden";
    alignMenu.innerHTML =
      '<div class="geSprite geSprite-left" style="margin-left:-2px;"></div>' +
      this.dropdownImageHtml;
    alignMenu.style.width = mxClient.IS_QUIRKS ? "50px" : "30px";

    if (this.compactUi) {
      alignMenu.getElementsByTagName("img")[0].style.left = "22px";
      alignMenu.getElementsByTagName("img")[0].style.top = "5px";
    }
    return alignMenu;
  }

  addAll(menu) {
    this.alignLeft(menu);
    this.alignCenter(menu);
    this.alignRight(menu);
    this.justifyfull(menu);
    this.insertorderedlist(menu);
    this.insertunorderedlist(menu);
    this.outdent(menu);
    this.indent(menu);
  }

  alignLeft(menu) {
    const { graph } = this;
    const elt = menu.addItem(
      "",
      null,
      (evt) => {
        graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
      },
      null,
      "geIcon geSprite geSprite-left",
    );
    elt.setAttribute("title", mxResources.get("left"));
  }

  alignCenter(menu) {
    const { graph } = this;
    const elt = menu.addItem(
      "",
      null,
      (evt) => {
        graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
      },
      null,
      "geIcon geSprite geSprite-center",
    );
    elt.setAttribute("title", mxResources.get("center"));
  }

  alignRight(menu) {
    const { graph } = this;
    const elt = menu.addItem(
      "",
      null,
      (evt) => {
        graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
      },
      null,
      "geIcon geSprite geSprite-right",
    );
    elt.setAttribute("title", mxResources.get("right"));
  }

  justifyfull(menu) {
    const elt = menu.addItem(
      "",
      null,
      () => {
        document.execCommand("justifyfull", false, undefined);
      },
      null,
      "geIcon geSprite geSprite-justifyfull",
    );
    elt.setAttribute("title", mxResources.get("justifyfull"));
  }

  insertorderedlist(menu) {
    const elt = menu.addItem(
      "",
      null,
      () => {
        document.execCommand("insertorderedlist", false, undefined);
      },
      null,
      "geIcon geSprite geSprite-orderedlist",
    );
    elt.setAttribute("title", mxResources.get("numberedList"));
  }

  insertunorderedlist(menu) {
    const elt = menu.addItem(
      "",
      null,
      () => {
        document.execCommand("insertunorderedlist", false, undefined);
      },
      null,
      "geIcon geSprite geSprite-unorderedlist",
    );
    elt.setAttribute("title", mxResources.get("bulletedList"));
  }

  outdent(menu) {
    const elt = menu.addItem(
      "",
      null,
      () => {
        document.execCommand("outdent", false, undefined);
      },
      null,
      "geIcon geSprite geSprite-outdent",
    );
    elt.setAttribute("title", mxResources.get("decreaseIndent"));
  }

  indent(menu) {
    const elt = menu.addItem(
      "",
      null,
      () => {
        document.execCommand("indent", false, undefined);
      },
      null,
      "geIcon geSprite geSprite-indent",
    );
    elt.setAttribute("title", mxResources.get("increaseIndent"));
  }
}
