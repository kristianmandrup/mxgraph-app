import { AbstractPalette } from "../AbstractPalette";
import { StencilIndexLoader } from "./StencilIndexLoader";
import { StencilDefaultLoader } from "./StencilDefaultLoader";

export class StencilPalette extends AbstractPalette {
  addStencilsToIndex: any; // fn
  getTagsForStencil: any;
  filterTags: any;

  // PaletteAdder
  addPaletteFunctions: any;
  addPalette: any;

  stencilIndexLoader = new StencilIndexLoader();
  stencilDefaultLoader = new StencilDefaultLoader();

  /**
   * Adds the given stencil palette.
   */
  create(
    id,
    title,
    stencilFile,
    style,
    ignore?,
    onInit?,
    scale?,
    tags?,
    customFns: any[] = []
  ) {
    scale = scale != null ? scale : 1;

    const opts: any = {
      id,
      title,
      stencilFile,
      style,
      ignore,
      onInit,
      scale,
      tags,
      customFns,
    };

    if (this.addStencilsToIndex) {
      this.stencilIndexLoader.load(opts);
    } else {
      this.stencilDefaultLoader.load(opts);
    }
  }
}
