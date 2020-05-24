import resources from "@mxgraph-app/resources";
import { Palettes } from "./palette";
const { urlParams } = resources;

export class SidebarPaletteSetup {
  editorUi: any;
  graph: any;
  container: any;
  taglist = new Object();
  showTooltips = true;
  pointerUpHandler: any;
  pointerDownHandler: any;
  thread: any;
  currentElt: any;
  tooltip: any;
  tooltipTitle: any;
  graph2: any;
  roundDrop: any;
  triangleDown: any;
  currentSearch: any;
  entries: any;
  dir: any;
  palettes: any;
  documentMode: any = 0;

  thumbPadding = this.documentMode >= 5 ? 0 : 1;
  thumbBorder = 1;
  thumbWidth = 32;
  thumbHeight = 30;
  minThumbStrokeWidth = 1.3;
  thumbAntiAlias = true;

  constructor(editorUi, graph, opts: any = {}) {
    this.editorUi = editorUi;
    this.graph = graph;
    this.palettes = new Palettes();
    const { dir } = opts;
    this.dir = dir;
  }

  /**
   * Adds all palettes to the sidebar.
   */
  init() {
    this.palettes.addAll();
    this.configure();
  }

  configure() {
    /*
     * Experimental smaller sidebar entries
     */
    if (urlParams["sidebar-entries"] != "large") {
      this.thumbPadding = this.documentMode >= 5 ? 0 : 1;
      this.thumbBorder = 1;
      this.thumbWidth = 32;
      this.thumbHeight = 30;
      this.minThumbStrokeWidth = 1.3;
      this.thumbAntiAlias = true;
    }
  }
}
