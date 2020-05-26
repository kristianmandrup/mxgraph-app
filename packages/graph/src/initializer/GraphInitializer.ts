import mx from "@mxgraph-app/mx";
import { EventListeners } from "./EventListeners";
import { DomainUrl } from "./DomainUrl";
import { VertexHandlerConfig } from "./vertex-handler/VertexHandlerConf";
const { mxConstants, mxPoint, mxUtils } = mx;

export class GraphInitializer {
  themes: any;
  domainUrl: any;
  domainPathUrl: any;
  defaultThemes: any;
  defaultEdgeStyle: any;
  currentEdgeStyle: any;
  defaultVertexStyle: any;
  currentVertexStyle: any;
  standalone: any;
  baseUrl: any;
  container: any;
  graph: any;
  edgeMode: any;
  isHtmlLabel: any;
  getCurrentCellStyle: any;
  addListener: any;
  isEnabled: any;
  isCellSelected: any;
  selectionCellsHandler: any;
  currentTranslate: any;

  get model() {
    return this.graph.model;
  }

  getModel() {
    return this.graph.getModel();
  }

  vertexHandlerConf = new VertexHandlerConfig();
  eventListeners = new EventListeners();
  domainUrlConf = new DomainUrl();

  addEventListeners() {
    // Implements a listener for hover and click handling on edges
    if (!this.edgeMode) return;
    var start: any = {
      point: null,
      event: null,
      state: null,
      handle: null,
      selected: false,
    };
    this.eventListeners.addAll(start);
  }

  setDomainUrl() {
    this.domainUrlConf.configure();
  }

  /**
   * Graph inherits from mxGraph
   */
  // mxUtils.extend(Graph, mxGraph);
  create(container, _model, _renderHint, _stylesheet, themes, standalone) {
    // mxGraph.call(container, model, renderHint, stylesheet);
    this.container = container;
    this.themes = themes || this.defaultThemes;
    this.currentEdgeStyle = mxUtils.clone(this.defaultEdgeStyle);
    this.currentVertexStyle = mxUtils.clone(this.defaultVertexStyle);
    this.standalone = standalone != null ? standalone : false;

    // Sets the base domain URL and domain path URL for relative links.
    this.setDomainUrl();

    // Adds support for HTML labels via style. Note: Currently, only the Java
    // backend supports HTML labels but CSS support is limited to the following:
    // http://docs.oracle.com/javase/6/docs/api/index.html?javax/swing/text/html/CSS.html
    // TODO: Wrap should not affect isHtmlLabel output (should be handled later)
    this.isHtmlLabel = (cell) => {
      var style = this.getCurrentCellStyle(cell);
      return style != null
        ? style["html"] == "1" || style[mxConstants.STYLE_WHITE_SPACE] == "wrap"
        : false;
    };

    this.addEventListeners();

    this.vertexHandlerConf.config();
    //Create a unique offset object for each graph instance.
    this.currentTranslate = new mxPoint(0, 0);
  }
}
