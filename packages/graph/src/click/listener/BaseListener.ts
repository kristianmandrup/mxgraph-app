import { BaseEventer } from "../BaseEventer";
import { Clear } from "./Clear";
import { Activate } from "./Activate";

export class BaseListener extends BaseEventer {
  cursor: any;
  ctx: any;
  updateCurrentState: any;

  clear = new Clear().handler;
  activate = new Activate().handler;
}
