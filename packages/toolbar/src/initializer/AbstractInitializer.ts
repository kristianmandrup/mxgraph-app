import { Base } from "../Base";
import mx from "@mxgraph-app/mx";
const { mxResources } = mx;

export class AbstractInitializer extends Base {
  get insertMenu() {
    var insertMenu = this.addMenu(
      "",
      mxResources.get("insert") +
        " (" +
        mxResources.get("doubleClickTooltip") +
        ")",
      true,
      "insert",
      null,
      true,
    );
    this.addDropDownArrow(insertMenu, "geSprite-plus", 38, 48, -4, -3, 36, -8);
    return insertMenu;
  }

  deleteElts() {
    var elts = this.addItems(["-", "delete"]);
    elts[1].setAttribute(
      "title",
      mxResources.get("delete") +
        " (" +
        this.editorUi.actions.get("delete").shortcut +
        ")",
    );
  }

  get undoElts() {
    var elts = this.addItems(["-", "undo", "redo"]);
    elts[1].setAttribute(
      "title",
      mxResources.get("undo") +
        " (" +
        this.editorUi.actions.get("undo").shortcut +
        ")",
    );
    elts[2].setAttribute(
      "title",
      mxResources.get("redo") +
        " (" +
        this.editorUi.actions.get("redo").shortcut +
        ")",
    );
    return elts;
  }

  get zoomElts() {
    var elts = this.addItems(["zoomIn", "zoomOut"]);
    elts[0].setAttribute(
      "title",
      mxResources.get("zoomIn") +
        " (" +
        this.editorUi.actions.get("zoomIn").shortcut +
        ")",
    );
    elts[1].setAttribute(
      "title",
      mxResources.get("zoomOut") +
        " (" +
        this.editorUi.actions.get("zoomOut").shortcut +
        ")",
    );
    return elts;
  }

  get viewMenu() {
    var viewMenu: any = this.addMenu(
      "",
      mxResources.get("zoom") + " (Alt+Mousewheel)",
      true,
      "viewZoom",
      null,
      true,
    );
    viewMenu.showDisabled = true;
    viewMenu.style.whiteSpace = "nowrap";
    viewMenu.style.position = "relative";
    viewMenu.style.overflow = "hidden";

    if (EditorUI.compactUi) {
      viewMenu.style.width = mxClient.IS_QUIRKS ? "58px" : "50px";
    } else {
      viewMenu.style.width = mxClient.IS_QUIRKS ? "62px" : "36px";
    }
    return viewMenu;
  }

  get sw() {
    var sw = screen.width;
    // Takes into account initial compact mode
    sw -= screen.height > 740 ? 56 : 0;
    return sw;
  }

  get formatMenu() {
    return this.addMenu(
      "",
      mxResources.get("view") + " (" + mxResources.get("panTooltip") + ")",
      true,
      "viewPanels",
      null,
      true,
    );
  }
}
