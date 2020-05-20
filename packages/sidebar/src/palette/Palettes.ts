import { MiscPalette } from "./MiscPalette";
import { BasicPalette } from "./BasicPalette";
import { GeneralPalette } from "./GeneralPalette";
import { ImagePalette } from "./ImagePalette";
import { SearchPalette } from "./SearchPalette";
import { StencilPalette } from "./StencilPalette";

import mx from "mx";
import { AdvancedShapes } from "../shapes/AdvancedShapes";
import { PaletteAdder } from "./PaletteAdder";
const { mxEvent, mxClient, mxResources } = mx;
import resources from "resources/resources";
const { STENCIL_PATH } = resources;

export class Palettes {
  paletteMap: any = {
    basic: BasicPalette,
    misc: MiscPalette,
    general: GeneralPalette,
    image: ImagePalette,
    search: SearchPalette,
    stencil: StencilPalette,
  };
  palettes: any = {};

  documentMode: any;
  advancedShapes: any;
  container: any;
  createTitle: any;
  collapsedImage: any;
  expandedImage: any;
  paletteAdder: any;
  dir: any = STENCIL_PATH;

  constructor(paletteMap?: any) {
    this.paletteMap = paletteMap || this.paletteMap;
    this.advancedShapes = new AdvancedShapes();
    this.paletteAdder = new PaletteAdder();
  }

  addPalette(id, title, expanded, onInit) {
    this.paletteAdder.addPalette(id, title, expanded, onInit);
  }

  removePalette(id) {
    this.paletteAdder.removePalette(id);
  }

  addAll(expansion: any = {}) {
    this.addMiscPalette(expansion.misc);
    this.addAdvancedPalette(expansion.advanced);
    this.addSearchPalette(true);
    this.addGeneralPalette(true);
    this.addMiscPalette(false);
    this.addAdvancedPalette(false);
    this.addBasicPalette(this.dir);

    this.addArrowsPalette();
    this.addFlowchartPalette();
  }

  addArrowsPalette() {
    this.addStencilPalette(
      "arrows",
      mxResources.get("arrows"),
      this.dir + "/arrows.xml",
      ";whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2",
    );
  }

  addFlowchartPalette() {
    this.addStencilPalette(
      "flowchart",
      "Flowchart",
      this.dir + "/flowchart.xml",
      ";whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2",
    );
  }

  addStencilPalette(
    id,
    title,
    stencilFile,
    style,
    ignore?,
    onInit?,
    scale?,
    tags?,
    customFns: any[] = [],
  ) {
    new this.paletteMap.stencil().create(
      id,
      title,
      stencilFile,
      style,
      ignore,
      onInit,
      scale,
      tags,
      customFns,
    );
  }

  addSearchPalette(expand) {
    new this.paletteMap.search().create(expand);
  }

  addGeneralPalette(expand) {
    new this.paletteMap.general().create(expand);
  }

  addBasicPalette(dir) {
    new this.paletteMap.general().create(dir);
  }

  /**
   * Adds the general palette to the sidebar.
   */
  addMiscPalette(expand) {
    new this.paletteMap.misc().create(expand);
  }

  /**
   * Adds the container palette to the sidebar.
   */
  addAdvancedPalette(expand) {
    this.addPaletteFunctions(
      "advanced",
      mxResources.get("advanced"),
      expand != null ? expand : false,
      this.createAdvancedShapes(),
    );
  }

  createAdvancedShapes() {
    return this.advancedShapes.createAdvancedShapes();
  }

  /**
   * Adds the given palette.
   */
  addPaletteFunctions(id, title, expanded, fns) {
    this.addPalette(id, title, expanded, (content) => {
      for (var i = 0; i < fns.length; i++) {
        content.appendChild(fns[i](content));
      }
    });
  }

  /**
   * Adds the general palette to the sidebar.
   */
  addUmlPalette(expand) {}

  addBpmnPalette(dir, expand) {}

  addImagePalette(id, title, prefix, postfix, items, titles, tags) {
    new this.paletteMap.image().addImagePalette(
      id,
      title,
      prefix,
      postfix,
      items,
      titles,
      tags,
    );
  }
}
