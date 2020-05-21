export class FilenameDialog {
  args: any[];
  constructor(...args: any[]) {
    this.args = args;
  }
}

export class ColorDialog {
  args: any[];
  currentColorKey: any;
  picker: any;
  colorInput: any;
  container: any;

  constructor(...args: any[]) {
    this.args = args;
  }

  init() {}
}
