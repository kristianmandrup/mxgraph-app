import mx from "@mxgraph-app/mx";
const { mxUtils } = mx;

export class Openfile {
  producer: any;
  consumer: any;
  done: any;
  args: any;

  /**
   * Class for asynchronously opening a new window and loading a file at the same
   * time. This acts as a bridge between the open dialog and the new editor.
   */
  constructor(done) {
    this.producer = null;
    this.consumer = null;
    this.done = done;
    this.args = null;
  }

  /**
   * Registers the editor from the new window.
   */
  setConsumer(value) {
    this.consumer = value;
    this.execute();
  }

  /**
   * Sets the data from the loaded file.
   */
  setData() {
    this.args = arguments;
    this.execute();
  }

  /**
   * Displays an error message.
   */
  error(msg) {
    this.cancel(true);
    mxUtils.alert(msg);
  }

  /**
   * Consumes the data.
   */
  execute() {
    if (this.consumer != null && this.args != null) {
      this.cancel(false);
      this.consumer.apply(this, this.args);
    }
  }

  /**
   * Cancels the operation.
   */
  cancel(cancel) {
    if (this.done != null) {
      this.done(cancel != null ? cancel : true);
    }
  }
}
