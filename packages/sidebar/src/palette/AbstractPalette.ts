import { AbstractShaper } from "../shapes/AbstractShaper";

export class AbstractPalette extends AbstractShaper {
  addPaletteFunctions: any;
  getTagsForStencil: any;
  addDataEntry: any;

  // Avoids having to bind all functions to "this"
  get sb() {
    return this;
  }
}
