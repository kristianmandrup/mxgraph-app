import mx from "@mxgraph-app/mx";
const { mxEventSource, mxEventObject } = mx;

/**
 * Constructs a new action for the given parameters.
 */
export class Menu {
  funct: any;
  enabled: any;
  eventSource: any;

  constructor(funct: any, enabled?: boolean) {
    this.eventSource = new mxEventSource(this);
    // mxEventSource.call(this);
    this.funct = funct;
    this.enabled = enabled != null ? enabled : true;
  }

  /**
   * Sets the enabled state of the action and fires a stateChanged event.
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Sets the enabled state of the action and fires a stateChanged event.
   */
  setEnabled(value: boolean) {
    if (this.enabled != value) {
      this.enabled = value;
      this.fireEvent("stateChanged");
    }
  }

  fireEvent(event: string) {
    this.eventSource.fireEvent(new mxEventObject(event));
  }

  /**
   * Executes menu action on parent
   */
  execute(menu, parent) {
    this.funct(menu, parent);
  }
}
