import mx from "@mxgraph-app/mx";
const { mxWindow, mxUtils } = mx;
/**
 *
 */
export class OutlineWindow {
  constructor(editorUi, x, y, w, h) {
    var graph = editorUi.editor.graph;

    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.border = "1px solid whiteSmoke";
    div.style.overflow = "hidden";

    this.window = new mxWindow(
      mxResources.get("outline"),
      div,
      x,
      y,
      w,
      h,
      true,
      true,
    );
    this.window.minimumSize = new mxRectangle(0, 0, 80, 80);
    this.window.destroyOnClose = false;
    this.window.setMaximizable(false);
    this.window.setResizable(true);
    this.window.setClosable(true);
    this.window.setVisible(true);

    this.window.setLocation = function (x, y) {
      var iw = window.innerWidth || document.body.clientWidth ||
        document.documentElement.clientWidth;
      var ih = window.innerHeight || document.body.clientHeight ||
        document.documentElement.clientHeight;

      x = Math.max(0, Math.min(x, iw - this.table.clientWidth));
      y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

      if (this.getX() != x || this.getY() != y) {
        mxWindow.prototype.setLocation.apply(this, arguments);
      }
    };

    var resizeListener = () => {
      var x = this.window.getX();
      var y = this.window.getY();

      this.window.setLocation(x, y);
    };

    mxEvent.addListener(window, "resize", resizeListener);

    var outline = editorUi.createOutline(this.window);

    this.destroy = function () {
      mxEvent.removeListener(window, "resize", resizeListener);
      this.window.destroy();
      outline.destroy();
    };

    this.window.addListener(
      mxEvent.RESIZE,
      () => {
        outline.update(false);
        outline.outline.sizeDidChange();
      },
    );

    this.window.addListener(
      mxEvent.SHOW,
      () => {
        this.window.fit();
        outline.suspended = false;
        outline.outline.refresh();
        outline.update();
      },
    );

    this.window.addListener(
      mxEvent.HIDE,
      () => {
        outline.suspended = true;
      },
    );

    this.window.addListener(
      mxEvent.NORMALIZE,
      () => {
        outline.suspended = false;
        outline.update();
      },
    );

    this.window.addListener(
      mxEvent.MINIMIZE,
      () => {
        outline.suspended = true;
      },
    );

    var outlineCreateGraph = outline.createGraph;
    outline.createGraph = (container) => {
      var g = outlineCreateGraph.apply(this, arguments);
      g.gridEnabled = false;
      g.pageScale = graph.pageScale;
      g.pageFormat = graph.pageFormat;
      g.background =
        graph.background == null || graph.background == mxConstants.NONE
          ? graph.defaultPageBackgroundColor
          : graph.background;
      g.pageVisible = graph.pageVisible;

      var current = mxUtils.getCurrentStyle(graph.container);
      div.style.backgroundColor = current.backgroundColor;

      return g;
    };

    function update() {
      outline.outline.pageScale = graph.pageScale;
      outline.outline.pageFormat = graph.pageFormat;
      outline.outline.pageVisible = graph.pageVisible;
      outline.outline.background =
        graph.background == null || graph.background == mxConstants.NONE
          ? graph.defaultPageBackgroundColor
          : graph.background;

      var current = mxUtils.getCurrentStyle(graph.container);
      div.style.backgroundColor = current.backgroundColor;

      if (
        graph.view.backgroundPageShape != null &&
        outline.outline.view.backgroundPageShape != null
      ) {
        outline.outline.view.backgroundPageShape.fill =
          graph.view.backgroundPageShape.fill;
      }

      outline.outline.refresh();
    }

    outline.init(div);

    editorUi.editor.addListener("resetGraphView", update);
    editorUi.addListener("pageFormatChanged", update);
    editorUi.addListener("backgroundColorChanged", update);
    editorUi.addListener("backgroundImageChanged", update);
    editorUi.addListener("pageViewChanged", function () {
      update();
      outline.update(true);
    });

    if (outline.outline.dialect == mxConstants.DIALECT_SVG) {
      var zoomInAction = editorUi.actions.get("zoomIn");
      var zoomOutAction = editorUi.actions.get("zoomOut");

      mxEvent.addMouseWheelListener(function (evt, up) {
        var outlineWheel = false;
        var source = mxEvent.getSource(evt);

        while (source != null) {
          if (source == outline.outline.view.canvas.ownerSVGElement) {
            outlineWheel = true;
            break;
          }

          source = source.parentNode;
        }

        if (outlineWheel) {
          if (up) {
            zoomInAction.funct();
          } else {
            zoomOutAction.funct();
          }
        }
      });
    }
  }
}
