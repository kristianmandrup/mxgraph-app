import { EditorUI } from "ui/EditorUI";
import { Dialog } from "sample/Dialog";
import mx from "mx";
import { FilenameDialog } from "sample/FilenameDialog";
const {
  mxWindow,
  mxPopupMenu,
  mxUtils,
  mxResources,
  mxClient,
  mxEvent,
  mxCell,
  mxRectangle,
} = mx;
/**
 *
 */
export class LayersWindow {
  documentMode: any;
  window: any;
  refreshLayers: any;
  graph: any;
  editorUi: any;
  listDiv: any;

  constructor(editorUi, x, y, w, h) {
    var graph = editorUi.editor.graph;

    var div = document.createElement("div");
    div.style.userSelect = "none";
    div.style.background = Dialog.backdropColor == "white"
      ? "whiteSmoke"
      : Dialog.backdropColor;
    div.style.border = "1px solid whiteSmoke";
    div.style.height = "100%";
    div.style.marginBottom = "10px";
    div.style.overflow = "auto";

    var tbarHeight = !EditorUI.compactUi ? "30px" : "26px";

    var listDiv = document.createElement("div");
    listDiv.style.backgroundColor = Dialog.backdropColor == "white"
      ? "#dcdcdc"
      : Dialog.backdropColor;
    listDiv.style.position = "absolute";
    listDiv.style.overflow = "auto";
    listDiv.style.left = "0px";
    listDiv.style.right = "0px";
    listDiv.style.top = "0px";
    listDiv.style.bottom = parseInt(tbarHeight) + 7 + "px";
    div.appendChild(listDiv);

    var dragSource: any;
    var dropIndex: any;

    mxEvent.addListener(div, "dragover", function (evt) {
      evt.dataTransfer.dropEffect = "move";
      dropIndex = 0;
      evt.stopPropagation();
      evt.preventDefault();
    });

    // Workaround for "no element found" error in FF
    mxEvent.addListener(div, "drop", function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
    });

    var layerCount: any;
    var selectionLayer: any;
    var ldiv = document.createElement("div");

    ldiv.className = "geToolbarContainer";
    ldiv.style.position = "absolute";
    ldiv.style.bottom = "0px";
    ldiv.style.left = "0px";
    ldiv.style.right = "0px";
    ldiv.style.height = tbarHeight;
    ldiv.style.overflow = "hidden";
    ldiv.style.padding = !EditorUI.compactUi ? "1px" : "4px 0px 3px 0px";
    ldiv.style.backgroundColor = Dialog.backdropColor == "white"
      ? "whiteSmoke"
      : Dialog.backdropColor;
    ldiv.style.borderWidth = "1px 0px 0px 0px";
    ldiv.style.borderColor = "#c3c3c3";
    ldiv.style.borderStyle = "solid";
    ldiv.style.display = "block";
    ldiv.style.whiteSpace = "nowrap";

    if (mxClient.IS_QUIRKS) {
      ldiv.style.filter = "none";
    }

    var link = document.createElement("a");
    link.className = "geButton";

    if (mxClient.IS_QUIRKS) {
      link.style.filter = "none";
    }

    var removeLink: any = link.cloneNode();
    removeLink.innerHTML =
      '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>';

    mxEvent.addListener(removeLink, "click", function (evt) {
      if (graph.isEnabled()) {
        graph.model.beginUpdate();
        try {
          var index = graph.model.root.getIndex(selectionLayer);
          graph.removeCells([selectionLayer], false);

          // Creates default layer if no layer exists
          if (graph.model.getChildCount(graph.model.root) == 0) {
            graph.model.add(graph.model.root, new mxCell());
            graph.setDefaultParent(null);
          } else if (
            index > 0 && index <= graph.model.getChildCount(graph.model.root)
          ) {
            graph.setDefaultParent(
              graph.model.getChildAt(graph.model.root, index - 1),
            );
          } else {
            graph.setDefaultParent(null);
          }
        } finally {
          graph.model.endUpdate();
        }
      }

      mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
      removeLink.className = "geButton mxDisabled";
    }

    ldiv.appendChild(removeLink);

    var insertLink: any = link.cloneNode();
    insertLink.setAttribute(
      "title",
      mxUtils.trim(mxResources.get("moveSelectionTo", [""])),
    );
    insertLink.innerHTML =
      '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>';

    mxEvent.addListener(insertLink, "click", (evt) => {
      if (graph.isEnabled() && !graph.isSelectionEmpty()) {
        editorUi.editor.graph.popupMenuHandler.hideMenu();

        var menu: any = new mxPopupMenu(
          (menu, parent) => {
            for (var i = layerCount - 1; i >= 0; i--) {
              const add = (child) => {
                var item = menu.addItem(
                  graph.convertValueToString(child) ||
                    mxResources.get("background"),
                  null,
                  () => {
                    graph.moveCells(
                      graph.getSelectionCells(),
                      0,
                      0,
                      false,
                      child,
                    );
                  },
                  parent,
                );

                if (
                  graph.getSelectionCount() == 1 &&
                  graph.model.isAncestor(child, graph.getSelectionCell())
                ) {
                  menu.addCheckmark(item, Editor.checkmarkImage);
                }
              };
              add(graph.model.getChildAt(graph.model.root, i));
            }
          },
        );
        menu.div.className += " geMenubarMenu";
        menu.smartSeparators = true;
        menu.showDisabled = true;
        menu.autoExpand = true;

        // Disables autoexpand and destroys menu when hidden
        menu.hideMenu = () => {
          mxPopupMenu.prototype.hideMenu.apply(menu, []);
          menu.destroy();
        };

        var offset = mxUtils.getOffset(insertLink);
        menu.popup(offset.x, offset.y + insertLink.offsetHeight, null, evt);

        // Allows hiding by clicking on document
        editorUi.setCurrentMenu(menu);
      }
    });

    ldiv.appendChild(insertLink);

    var dataLink: any = link.cloneNode();
    dataLink.innerHTML =
      '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>';
    dataLink.setAttribute("title", mxResources.get("rename"));

    mxEvent.addListener(dataLink, "click", (evt) => {
      if (graph.isEnabled()) {
        editorUi.showDataDialog(selectionLayer);
      }

      mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
      dataLink.className = "geButton mxDisabled";
    }

    ldiv.appendChild(dataLink);

    var duplicateLink: any = link.cloneNode();
    duplicateLink.innerHTML =
      '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>';

    mxEvent.addListener(duplicateLink, "click", (evt) => {
      if (graph.isEnabled()) {
        var newCell: any;
        graph.model.beginUpdate();
        try {
          newCell = graph.cloneCell(selectionLayer);
          graph.cellLabelChanged(newCell, mxResources.get("untitledLayer"));
          newCell.setVisible(true);
          newCell = graph.addCell(newCell, graph.model.root);
          graph.setDefaultParent(newCell);
        } finally {
          graph.model.endUpdate();
        }

        if (newCell != null && !graph.isCellLocked(newCell)) {
          graph.selectAll(newCell);
        }
      }
    });

    if (!graph.isEnabled()) {
      duplicateLink.className = "geButton mxDisabled";
    }

    ldiv.appendChild(duplicateLink);

    var addLink: any = link.cloneNode();
    addLink.innerHTML =
      '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>';
    addLink.setAttribute("title", mxResources.get("addLayer"));

    mxEvent.addListener(addLink, "click", function (evt) {
      if (graph.isEnabled()) {
        graph.model.beginUpdate();

        try {
          var cell = graph.addCell(
            new mxCell(mxResources.get("untitledLayer")),
            graph.model.root,
          );
          graph.setDefaultParent(cell);
        } finally {
          graph.model.endUpdate();
        }
      }

      mxEvent.consume(evt);
    });

    if (!graph.isEnabled()) {
      addLink.className = "geButton mxDisabled";
    }

    ldiv.appendChild(addLink);
    div.appendChild(ldiv);

    const refresh = () => {
      layerCount = graph.model.getChildCount(graph.model.root);
      listDiv.innerHTML = "";

      function addLayer(index, label, child, defaultParent) {
        var ldiv = document.createElement("div");
        ldiv.className = "geToolbarContainer";

        ldiv.style.overflow = "hidden";
        ldiv.style.position = "relative";
        ldiv.style.padding = "4px";
        ldiv.style.height = "22px";
        ldiv.style.display = "block";
        ldiv.style.backgroundColor = Dialog.backdropColor == "white"
          ? "whiteSmoke"
          : Dialog.backdropColor;
        ldiv.style.borderWidth = "0px 0px 1px 0px";
        ldiv.style.borderColor = "#c3c3c3";
        ldiv.style.borderStyle = "solid";
        ldiv.style.whiteSpace = "nowrap";
        ldiv.setAttribute("title", label);

        var left = document.createElement("div");
        left.style.display = "inline-block";
        left.style.width = "100%";
        left.style.textOverflow = "ellipsis";
        left.style.overflow = "hidden";

        mxEvent.addListener(ldiv, "dragover", (evt) => {
          evt.dataTransfer.dropEffect = "move";
          dropIndex = index;
          evt.stopPropagation();
          evt.preventDefault();
        });

        mxEvent.addListener(ldiv, "dragstart", function (evt) {
          dragSource = ldiv;

          // Workaround for no DnD on DIV in FF
          if (mxClient.IS_FF) {
            // LATER: Check what triggers a parse as XML on this in FF after drop
            evt.dataTransfer.setData("Text", "<layer/>");
          }
        });

        mxEvent.addListener(ldiv, "dragend", function (evt) {
          if (dragSource != null && dropIndex != null) {
            graph.addCell(child, graph.model.root, dropIndex);
          }

          dragSource = null;
          dropIndex = null;
          evt.stopPropagation();
          evt.preventDefault();
        });

        var btn = document.createElement("img");
        btn.setAttribute("draggable", "false");
        btn.setAttribute("align", "top");
        btn.setAttribute("border", "0");
        btn.style.padding = "4px";
        btn.setAttribute("title", mxResources.get("lockUnlock"));

        var style = graph.getCurrentCellStyle(child);

        if (mxUtils.getValue(style, "locked", "0") == "1") {
          btn.setAttribute("src", Dialog.prototype.lockedImage);
        } else {
          btn.setAttribute("src", Dialog.prototype.unlockedImage);
        }

        if (graph.isEnabled()) {
          btn.style.cursor = "pointer";
        }

        mxEvent.addListener(btn, "click", (evt) => {
          if (graph.isEnabled()) {
            var value: any;

            graph.getModel().beginUpdate();
            try {
              value = mxUtils.getValue(style, "locked", "0") == "1"
                ? null
                : "1";
              graph.setCellStyles("locked", value, [child]);
            } finally {
              graph.getModel().endUpdate();
            }

            if (value == "1") {
              graph.removeSelectionCells(
                graph.getModel().getDescendants(child),
              );
            }

            mxEvent.consume(evt);
          }
        });

        left.appendChild(btn);

        var inp = document.createElement("input");
        inp.setAttribute("type", "checkbox");
        inp.setAttribute(
          "title",
          mxResources.get(
            "hideIt",
            [child.value || mxResources.get("background")],
          ),
        );
        inp.style.marginLeft = "4px";
        inp.style.marginRight = "6px";
        inp.style.marginTop = "4px";
        left.appendChild(inp);

        if (graph.model.isVisible(child)) {
          inp.setAttribute("checked", "checked");
          inp.defaultChecked = true;
        }

        mxEvent.addListener(inp, "click", (evt) => {
          graph.model.setVisible(child, !graph.model.isVisible(child));
          mxEvent.consume(evt);
        });

        mxUtils.write(left, label);
        ldiv.appendChild(left);

        if (graph.isEnabled()) {
          // Fallback if no drag and drop is available
          if (
            mxClient.IS_TOUCH ||
            mxClient.IS_POINTER ||
            mxClient.IS_VML ||
            (mxClient.IS_IE && this.documentMode < 10)
          ) {
            var right = document.createElement("div");
            right.style.display = "block";
            right.style.textAlign = "right";
            right.style.whiteSpace = "nowrap";
            right.style.position = "absolute";
            right.style.right = "6px";
            right.style.top = "6px";

            // Poor man's change layer order
            if (index > 0) {
              var img2 = document.createElement("a");

              img2.setAttribute("title", mxResources.get("toBack"));

              img2.className = "geButton";
              img2.style.cssFloat = "none";
              img2.innerHTML = "&#9660;";
              img2.style.width = "14px";
              img2.style.height = "14px";
              img2.style.fontSize = "14px";
              img2.style.margin = "0px";
              img2.style.marginTop = "-1px";
              right.appendChild(img2);

              mxEvent.addListener(img2, "click", (evt) => {
                if (graph.isEnabled()) {
                  graph.addCell(child, graph.model.root, index - 1);
                }

                mxEvent.consume(evt);
              });
            }

            if (index >= 0 && index < layerCount - 1) {
              var img1 = document.createElement("a");

              img1.setAttribute("title", mxResources.get("toFront"));

              img1.className = "geButton";
              img1.style.cssFloat = "none";
              img1.innerHTML = "&#9650;";
              img1.style.width = "14px";
              img1.style.height = "14px";
              img1.style.fontSize = "14px";
              img1.style.margin = "0px";
              img1.style.marginTop = "-1px";
              right.appendChild(img1);

              mxEvent.addListener(img1, "click", (evt) => {
                if (graph.isEnabled()) {
                  graph.addCell(child, graph.model.root, index + 1);
                }

                mxEvent.consume(evt);
              });
            }

            ldiv.appendChild(right);
          }

          if (
            mxClient.IS_SVG && (!mxClient.IS_IE || this.documentMode >= 10)
          ) {
            ldiv.setAttribute("draggable", "true");
            ldiv.style.cursor = "move";
          }
        }

        mxEvent.addListener(ldiv, "dblclick", function (evt) {
          var nodeName = mxEvent.getSource(evt).nodeName;

          if (nodeName != "INPUT" && nodeName != "IMG") {
            renameLayer(child);
            mxEvent.consume(evt);
          }
        });

        if (graph.getDefaultParent() == child) {
          ldiv.style.background = Dialog.backdropColor == "white"
            ? "#e6eff8"
            : "#505759";
          ldiv.style.fontWeight = graph.isEnabled() ? "bold" : "";
          selectionLayer = child;
        } else {
          mxEvent.addListener(ldiv, "click", function (evt) {
            if (graph.isEnabled()) {
              graph.setDefaultParent(defaultParent);
              graph.view.setCurrentRoot(null);
              refresh();
            }
          });
        }

        listDiv.appendChild(ldiv);
      }

      // Cannot be moved or deleted
      for (var i = layerCount - 1; i >= 0; i--) {
        const add = (child) => {
          addLayer(
            i,
            graph.convertValueToString(child) || mxResources.get("background"),
            child,
            child,
          );
        };
        add(graph.model.getChildAt(graph.model.root, i));
      }

      var label = graph.convertValueToString(selectionLayer) ||
        mxResources.get("background");
      removeLink.setAttribute("title", mxResources.get("removeIt", [label]));
      duplicateLink.setAttribute(
        "title",
        mxResources.get("duplicateIt", [label]),
      );
      dataLink.setAttribute("title", mxResources.get("editData"));

      if (graph.isSelectionEmpty()) {
        insertLink.className = "geButton mxDisabled";
      }
    };

    refresh();
    graph.model.addListener(mxEvent.CHANGE, function () {
      refresh();
    });

    graph.selectionModel.addListener(mxEvent.CHANGE, function () {
      if (graph.isSelectionEmpty()) {
        insertLink.className = "geButton mxDisabled";
      } else {
        insertLink.className = "geButton";
      }
    });

    const window: any = new mxWindow(
      mxResources.get("layers"),
      div,
      x,
      y,
      w,
      h,
      true,
      true,
    );
    this.window = window;

    window.minimumSize = new mxRectangle(0, 0, 120, 120);
    window.destroyOnClose = false;
    window.setMaximizable(false);
    window.setResizable(true);
    window.setClosable(true);
    window.setVisible(true);

    this.window.addListener(
      mxEvent.SHOW,
      () => {
        this.window.fit();
      },
    );

    // Make refresh available via instance
    this.refreshLayers = refresh;

    window.setLocation = (x, y) => {
      var iw = window.innerWidth || document.body.clientWidth ||
        document.documentElement.clientWidth;
      var ih = window.innerHeight || document.body.clientHeight ||
        document.documentElement.clientHeight;

      x = Math.max(0, Math.min(x, iw - window.table.clientWidth));
      y = Math.max(0, Math.min(y, ih - window.table.clientHeight - 48));

      if (window.getX() != x || window.getY() != y) {
        mxWindow.prototype.setLocation.apply(this, [x, y]);
      }
    };

    mxEvent.addListener(window, "resize", this.resizeListener);
  }

  renameLayer(layer) {
    const { graph, editorUi } = this;
    if (graph.isEnabled() && layer != null) {
      var label = graph.convertValueToString(layer);
      var dlg = new FilenameDialog(
        editorUi,
        label || mxResources.get("background"),
        mxResources.get("rename"),
        (newValue) => {
          if (newValue != null) {
            graph.cellLabelChanged(layer, newValue);
          }
        },
        mxResources.get("enterName"),
      );
      editorUi.showDialog(dlg.container, 300, 100, true, true);
      dlg.init();
    }
  }

  resizeListener = () => {
    var x = this.window.getX();
    var y = this.window.getY();

    this.window.setLocation(x, y);
  };

  init() {
    const { listDiv } = this;
    listDiv.scrollTop = listDiv.scrollHeight - listDiv.clientHeight;
  }

  destroy() {
    mxEvent.removeListener(window, "resize", this.resizeListener);
    this.window.destroy();
  }
}
