import { Click } from "../Click";
import { MouseDown } from "./MouseDown";
import { MouseUp } from "./MouseUp";
import { MouseMove } from "../../initializer/MouseMove";
import { Activate } from "./Activate";
import { Clear } from "./Clear";
import { CurrentState } from "./CurrentState";

export class MouseListener extends Click {
  beforeClick: any;
  onClick: any;

  cursor = this.container.style.cursor;
  tol = this.getTolerance();

  mouseDown = new MouseDown().handler;
  mouseMove = new MouseMove().handler;
  mouseUp = new MouseUp().handler;
  activate = new Activate().handler;
  clear = new Clear().handler;
  updateCurrentState = new CurrentState().update;

  createHandler() {
    const { highlight, updateCurrentState } = this;

    const { mouseDown, mouseMove, mouseUp, activate, clear } = this;

    return {
      currentState: null,
      currentLink: null,
      highlight,
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      updateCurrentState,
      mouseDown,
      mouseMove,
      mouseUp,
      activate,
      clear,
    };
  }
}
