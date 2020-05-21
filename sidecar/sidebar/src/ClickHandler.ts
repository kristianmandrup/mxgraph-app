import mx from "mx";
const { mxUtils, mxEvent, mxPoint } = mx;

export class ClickHandler {
  editorUi: any;
  dragElement: any;
  currentGraph: any;

  /**
 * Adds a handler for inserting the cell with a single click.
 */
  addClickHandler(elt, ds, cells) {
    var graph = this.editorUi.editor.graph;
    var oldMouseDown = ds.mouseDown;
    var oldMouseMove = ds.mouseMove;
    var oldMouseUp = ds.mouseUp;
    var tol = graph.tolerance;
    var first: any;
    var sb: any;

    ds.mouseDown = function (evt) {
      oldMouseDown.apply(this, arguments);
      first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));

      if (this.dragElement != null) {
        this.dragElement.style.display = "none";
        mxUtils.setOpacity(elt, 50);
      }
    };

    ds.mouseMove(evt);
    {
      if (
        this.dragElement != null &&
        this.dragElement.style.display == "none" &&
        first != null && (Math.abs(first.x - mxEvent.getClientX(evt)) > tol ||
          Math.abs(first.y - mxEvent.getClientY(evt)) > tol)
      ) {
        this.dragElement.style.display = "";
        mxUtils.setOpacity(elt, 100);
      }

      oldMouseMove.apply(this, arguments);
    }

    ds.mouseUp(evt);
    {
      try {
        if (
          !mxEvent.isPopupTrigger(evt) && this.currentGraph == null &&
          this.dragElement != null && this.dragElement.style.display == "none"
        ) {
          sb.itemClicked(cells, ds, evt, elt);
        }

        oldMouseUp.apply(ds, arguments);
        mxUtils.setOpacity(elt, 100);
        first = null;

        // Blocks tooltips on this element after single click
        sb.currentElt = elt;
      } catch (e) {
        ds.reset();
        sb.editorUi.handleError(e);
      }
    }
  }
}
