import mx from "mx";
const { mxConstants, mxClient, mxEvent, mxKeyHandler, mxUtils } = mx;
import { Nudger } from "./Nudger";

export class KeyHandler {
  editor: any;
  isControlDown: any;
  isGraphEvent: any;
  isEnabled: any;
  dialogs: any;
  actions: any;
  altShiftActions: any;
  hoverIcons: any;
  nudger: any;
  handleError: any;

  constructor(nudger?: any) {
    this.nudger = nudger || this.createNudger();
  }

  createNudger() {
    return new Nudger();
  }

  nudge(keyCode, stepSize, resize?) {
    return this.nudger.nudge(keyCode, stepSize, resize);
  }

  /**
   * Creates the keyboard event handler for the current graph and history.
   */
  create(editor) {
    var editorUi = this;
    var graph = this.editor.graph;
    var keyHandler: any = new mxKeyHandler(graph);

    var isEventIgnored = keyHandler.isEventIgnored;
    keyHandler.isEventIgnored = (evt) => {
      const { isControlDown } = this;
      // Handles undo/redo/ctrl+./,/u via action and allows ctrl+b/i
      // only if editing value is HTML (except for FF and Safari)
      return !(mxEvent.isShiftDown(evt) && evt.keyCode == 9) &&
        ((!this.isControlDown(evt) || mxEvent.isShiftDown(evt) ||
          (evt.keyCode != 90 && evt.keyCode != 89 && evt.keyCode != 188 &&
            evt.keyCode != 190 && evt.keyCode != 85)) &&
          ((evt.keyCode != 66 && evt.keyCode != 73) ||
            !this.isControlDown(evt) || (graph.cellEditor.isContentEditing() &&
              !mxClient.IS_FF && !mxClient.IS_SF)) &&
          isEventIgnored.apply(this, [evt]));
    };

    // Ignores graph enabled state but not chromeless state
    keyHandler.isEnabledForEvent = (evt) => {
      return (!mxEvent.isConsumed(evt) && this.isGraphEvent(evt) &&
        this.isEnabled() &&
        (editorUi.dialogs == null || editorUi.dialogs.length == 0));
    };

    // Routes command-key to control-key on Mac
    keyHandler.isControlDown = function (evt) {
      return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
    };

    var queue: any[] = [];
    var thread = null;
    const { nudge } = this;

    // Overridden to handle special alt+shift+cursor keyboard shortcuts
    var directions = {
      37: mxConstants.DIRECTION_WEST,
      38: mxConstants.DIRECTION_NORTH,
      39: mxConstants.DIRECTION_EAST,
      40: mxConstants.DIRECTION_SOUTH,
    };

    var keyHandlerGetFunction = keyHandler.getFunction;

    mxKeyHandler.prototype.getFunction = function (evt) {
      if (graph.isEnabled()) {
        // TODO: Add alt modified state in core API, here are some specific cases
        if (mxEvent.isShiftDown(evt) && mxEvent.isAltDown(evt)) {
          var action = editorUi.actions.get(
            editorUi.altShiftActions[evt.keyCode],
          );

          if (action != null) {
            return action.funct;
          }
        }

        if (evt.keyCode == 9 && mxEvent.isAltDown(evt)) {
          if (graph.cellEditor.isContentEditing()) {
            // Alt+Shift+Tab while editing
            return function () {
              document.execCommand("outdent", false, undefined);
            };
          } else if (mxEvent.isShiftDown(evt)) {
            // Alt+Shift+Tab
            return function () {
              graph.selectParentCell();
            };
          } else {
            // Alt+Tab
            return function () {
              graph.selectChildCell();
            };
          }
        } else if (
          directions[evt.keyCode] != null && !graph.isSelectionEmpty()
        ) {
          // On macOS, Control+Cursor is used by Expose so allow for Alt+Control to resize
          if (
            !this.isControlDown(evt) && mxEvent.isShiftDown(evt) &&
            mxEvent.isAltDown(evt)
          ) {
            if (graph.model.isVertex(graph.getSelectionCell())) {
              return function () {
                var cells = graph.connectVertex(
                  graph.getSelectionCell(),
                  directions[evt.keyCode],
                  graph.defaultEdgeLength,
                  evt,
                  true,
                );

                if (cells != null && cells.length > 0) {
                  if (cells.length == 1 && graph.model.isEdge(cells[0])) {
                    graph.setSelectionCell(
                      graph.model.getTerminal(cells[0], false),
                    );
                  } else {
                    graph.setSelectionCell(cells[cells.length - 1]);
                  }

                  graph.scrollCellToVisible(graph.getSelectionCell());

                  if (editorUi.hoverIcons != null) {
                    editorUi.hoverIcons.update(
                      graph.view.getState(graph.getSelectionCell()),
                    );
                  }
                }
              };
            }
          } else {
            // Avoids consuming event if no vertex is selected by returning null below
            // Cursor keys move and resize (ctrl) cells
            if (this.isControlDown(evt)) {
              return () => {
                nudge(
                  evt.keyCode,
                  (mxEvent.isShiftDown(evt)) ? graph.gridSize : null,
                  true,
                );
              };
            } else {
              return () => {
                nudge(
                  evt.keyCode,
                  (mxEvent.isShiftDown(evt)) ? graph.gridSize : null,
                );
              };
            }
          }
        }
      }

      return keyHandlerGetFunction.apply(this, [editor]);
    };

    // Binds keystrokes to actions
    keyHandler.bindAction = (code, control, key, shift) => {
      var action = this.actions.get(key);

      if (action != null) {
        var f = function () {
          if (action.isEnabled()) {
            action.funct();
          }
        };

        if (control) {
          if (shift) {
            keyHandler.bindControlShiftKey(code, f);
          } else {
            keyHandler.bindControlKey(code, f);
          }
        } else {
          if (shift) {
            keyHandler.bindShiftKey(code, f);
          } else {
            keyHandler.bindKey(code, f);
          }
        }
      }
    };

    var ui = this;
    var keyHandlerEscape = keyHandler.escape;
    keyHandler.escape = (evt) => {
      keyHandlerEscape.apply(this, [evt]);
    };

    // Ignores enter keystroke. Remove this line if you want the
    // enter keystroke to stop editing. N, W, T are reserved.
    keyHandler.enter = () => {};

    keyHandler.bindControlShiftKey(36, function () {
      graph.exitGroup();
    }); // Ctrl+Shift+Home
    keyHandler.bindControlShiftKey(35, function () {
      graph.enterGroup();
    }); // Ctrl+Shift+End
    keyHandler.bindKey(36, function () {
      graph.home();
    }); // Home
    keyHandler.bindKey(35, function () {
      graph.refresh();
    }); // End
    keyHandler.bindAction(107, true, "zoomIn"); // Ctrl+Plus
    keyHandler.bindAction(109, true, "zoomOut"); // Ctrl+Minus
    keyHandler.bindAction(80, true, "print"); // Ctrl+P
    keyHandler.bindAction(79, true, "outline", true); // Ctrl+Shift+O

    if (!this.editor.chromeless || this.editor.editable) {
      keyHandler.bindControlKey(36, function () {
        if (graph.isEnabled()) graph.foldCells(true);
      }); // Ctrl+Home
      keyHandler.bindControlKey(35, function () {
        if (graph.isEnabled()) graph.foldCells(false);
      }); // Ctrl+End
      keyHandler.bindControlKey(13, function () {
        if (graph.isEnabled()) {
          try {
            graph.setSelectionCells(
              graph.duplicateCells(graph.getSelectionCells(), false),
            );
          } catch (e) {
            ui.handleError(e);
          }
        }
      }); // Ctrl+Enter

      // bind actions
    }

    if (!mxClient.IS_WIN) {
      keyHandler.bindAction(90, true, "redo", true); // Ctrl+Shift+Z
    } else {
      keyHandler.bindAction(89, true, "redo"); // Ctrl+Y
    }

    return keyHandler;
  }
}
