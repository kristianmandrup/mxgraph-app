import mx from 'mx'
const { mxEventObject } = mx

/**
 * Constructs a new action for the given parameters.
 */
export class Menu {
  funct: any
  enabled: any

  // Menu inherits from mxEventSource
  // mxUtils.extend(Menu, mxEventSource);

  constructor(funct, enabled?) {
    // mxEventSource.call(this);
    this.funct = funct
    this.enabled = enabled != null ? enabled : true
  }

  /**
   * Sets the enabled state of the action and fires a stateChanged event.
   */
  isEnabled() {
    return this.enabled
  }

  /**
   * Sets the enabled state of the action and fires a stateChanged event.
   */
  setEnabled(value) {
    if (this.enabled != value) {
      this.enabled = value
      this.fireEvent('stateChanged')
    }
  }

  fireEvent(event) {
    // this.fireEvent(new mxEventObject('stateChanged'))
  }

  /**
   * Sets the enabled state of the action and fires a stateChanged event.
   */
  execute(menu, parent) {
    this.funct(menu, parent)
  }
}
