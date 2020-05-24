import { Sidebar } from "./Sidebar";
import { ShapeUpdater } from "./shapes/ShapeUpdater";
import { DropCheck } from "./drag-drop/drop/DropCheck";
import mx from "@mxgraph-app/mx";
const { mxClient, mxEvent } = mx;

export class SidebarInitializer {
  sidebar: Sidebar;
  editorUi: any;
  container: any;
  graph: any;

  constructor(sidebar: Sidebar) {
    this.sidebar = sidebar;
    this.editorUi = sidebar.editorUi;
    this.container = sidebar.container;
  }

  get ui() {
    return this.editorUi;
  }

  initialize() {
    const { sidebar, ui, container } = this;
    const { minThumbStrokeWidth, thumbAntiAlias } = sidebar;
    this.graph = ui.createTemporaryGraph(ui.editor.graph.getStylesheet());
    this.graph.cellRenderer.minSvgStrokeWidth = minThumbStrokeWidth;
    this.graph.cellRenderer.antiAlias = thumbAntiAlias;
    this.graph.container.style.visibility = "hidden";
    this.graph.foldingEnabled = false;

    sidebar.shapeUpdater = new ShapeUpdater();
    sidebar.dropCheck = new DropCheck(ui);

    document.body.appendChild(this.graph.container);
    sidebar.pointerUpHandler = () => {
      sidebar.showTooltips = true;
    };

    mxEvent.addListener(
      document,
      mxClient.IS_POINTER ? "pointerup" : "mouseup",
      sidebar.pointerUpHandler
    );

    sidebar.pointerDownHandler = () => {
      sidebar.showTooltips = false;
      sidebar.hideTooltip();
    };

    mxEvent.addListener(
      document,
      mxClient.IS_POINTER ? "pointerdown" : "mousedown",
      sidebar.pointerDownHandler
    );

    sidebar.pointerMoveHandler = (evt) => {
      var src = mxEvent.getSource(evt);

      while (src != null) {
        if (src == sidebar.currentElt) {
          return;
        }

        src = src.parentNode;
      }

      sidebar.hideTooltip();
    };

    mxEvent.addListener(
      document,
      mxClient.IS_POINTER ? "pointermove" : "mousemove",
      sidebar.pointerMoveHandler
    );

    // Handles mouse leaving the window
    sidebar.pointerOutHandler = (evt) => {
      if (evt.toElement == null && evt.relatedTarget == null) {
        sidebar.hideTooltip();
      }
    };

    mxEvent.addListener(
      document,
      mxClient.IS_POINTER ? "pointerout" : "mouseout",
      sidebar.pointerOutHandler
    );

    // Enables tooltips after scroll
    mxEvent.addListener(container, "scroll", () => {
      sidebar.showTooltips = true;
      sidebar.hideTooltip();
    });
  }
}
