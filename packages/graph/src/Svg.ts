import mx from "@mxgraph-app/mx";

const {
  mxRectangle,
  mxSvgCanvas2D,
  mxConstants,
  mxResources,
  mxUtils,
  mxImageExport,
} = mx;

export class Svg {
  getLinkForCell: any; // (cell) => any
  useCssTransforms: any;
  view: any;
  sizeDidChange: any;
  getGraphBounds: any;
  getBoundingBox: any;
  getSelectionCells: any;
  state: any;
  backgroundImage: any;
  getView: any;
  model: any;
  updateSvgLinks: any;
  addForeignObjectWarning: any;

  /**
   * Hook for creating the canvas used in getSvg.
   */
  createSvgCanvas(node) {
    var canvas = new mxSvgCanvas2D(node);

    canvas.pointerEvents = true;

    return canvas;
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  createSvgImageExport() {
    var exp = new mxImageExport();

    // Adds hyperlinks (experimental)
    exp.getLinkForCellState = (state, _canvas) => {
      return this.getLinkForCell(state.cell);
    };

    return exp;
  }
  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  getSvg(
    background,
    scale,
    border,
    nocrop,
    crisp,
    ignoreSelection,
    showText,
    imgExport,
    linkTarget,
    hasShadow
  ) {
    //Disable Css Transforms if it is used
    var origUseCssTrans = this.useCssTransforms;

    if (origUseCssTrans) {
      this.useCssTransforms = false;
      this.view.revalidate();
      this.sizeDidChange();
    }

    try {
      scale = scale != null ? scale : 1;
      border = border != null ? border : 0;
      crisp = crisp != null ? crisp : true;
      ignoreSelection = ignoreSelection != null ? ignoreSelection : true;
      showText = showText != null ? showText : true;

      var bounds =
        ignoreSelection || nocrop
          ? this.getGraphBounds()
          : this.getBoundingBox(this.getSelectionCells());

      if (bounds == null) {
        throw Error(mxResources.get("drawingEmpty"));
      }

      var vs = this.view.scale;

      // Prepares SVG document that holds the output
      var svgDoc = mxUtils.createXmlDocument();
      var root =
        svgDoc.createElementNS != null
          ? svgDoc.createElementNS(mxConstants.NS_SVG, "svg")
          : svgDoc.createElement("svg");

      if (background != null) {
        if (root.style != null) {
          root.style.backgroundColor = background;
        } else {
          root.setAttribute("style", "background-color:" + background);
        }
      }

      if (svgDoc.createElementNS == null) {
        root.setAttribute("xmlns", mxConstants.NS_SVG);
        root.setAttribute("xmlns:xlink", mxConstants.NS_XLINK);
      } else {
        // KNOWN: Ignored in IE9-11, adds namespace for each image element instead. No workaround.
        root.setAttributeNS(
          "http://www.w3.org/2000/xmlns/",
          "xmlns:xlink",
          mxConstants.NS_XLINK
        );
      }

      var s = scale / vs;
      var w =
        Math.max(1, Math.ceil(bounds.width * s) + 2 * border) +
        (hasShadow ? 5 : 0);
      var h =
        Math.max(1, Math.ceil(bounds.height * s) + 2 * border) +
        (hasShadow ? 5 : 0);

      root.setAttribute("version", "1.1");
      root.setAttribute("width", w + "px");
      root.setAttribute("height", h + "px");
      root.setAttribute(
        "viewBox",
        (crisp ? "-0.5 -0.5" : "0 0") + " " + w + " " + h
      );
      svgDoc.appendChild(root);

      // Renders graph. Offset will be multiplied with state's scale when painting state.
      // TextOffset only seems to affect FF output but used everywhere for consistency.
      var group =
        svgDoc.createElementNS != null
          ? svgDoc.createElementNS(mxConstants.NS_SVG, "g")
          : svgDoc.createElement("g");
      root.appendChild(group);

      var svgCanvas: any = this.createSvgCanvas(group);
      svgCanvas.foOffset = crisp ? -0.5 : 0;
      svgCanvas.textOffset = crisp ? -0.5 : 0;
      svgCanvas.imageOffset = crisp ? -0.5 : 0;
      svgCanvas.translate(
        Math.floor((border / scale - bounds.x) / vs),
        Math.floor((border / scale - bounds.y) / vs)
      );

      // Convert HTML entities
      var htmlConverter = document.createElement("div");

      // Adds simple text fallback for viewers with no support for foreignObjects
      var getAlternateText = svgCanvas.getAlternateText;
      svgCanvas.getAlternateText = (
        _fo,
        _x,
        _y,
        w,
        _h,
        str,
        _align,
        _valign,
        _wrap,
        _format,
        _overflow,
        _clip,
        _rotation
      ) => {
        // Assumes a max character width of 0.5em
        if (str != null && this.state.fontSize > 0) {
          try {
            if (mxUtils.isNode(str, null)) {
              str = str.innerText;
            } else {
              htmlConverter.innerHTML = str;
              str = mxUtils.extractTextWithWhitespace(htmlConverter.childNodes);
            }

            // Workaround for substring breaking double byte UTF
            var exp = Math.ceil((2 * w) / this.state.fontSize);
            var result: any[] = [];
            var length = 0;
            var index = 0;

            while ((exp == 0 || length < exp) && index < str.length) {
              var char = str.charCodeAt(index);

              if (char == 10 || char == 13) {
                if (length > 0) {
                  break;
                }
              } else {
                result.push(str.charAt(index));

                if (char < 255) {
                  length++;
                }
              }

              index++;
            }

            // Uses result and adds ellipsis if more than 1 char remains
            if (result.length < str.length && str.length - result.length > 1) {
              str = mxUtils.trim(result.join("")) + "...";
            }

            return str;
          } catch (e) {
            return getAlternateText.apply(this, arguments);
          }
        } else {
          return getAlternateText.apply(this, arguments);
        }
      }; // Paints background image

      var bgImg = this.backgroundImage;

      if (bgImg != null) {
        var s2 = vs / scale;
        var tr = this.view.translate;
        var tmp = new mxRectangle(
          tr.x * s2,
          tr.y * s2,
          bgImg.width * s2,
          bgImg.height * s2
        );

        // Checks if visible
        if (mxUtils.intersects(bounds, tmp)) {
          svgCanvas.image(
            tr.x,
            tr.y,
            bgImg.width,
            bgImg.height,
            bgImg.src,
            true
          );
        }
      }

      svgCanvas.scale(s);
      svgCanvas.textEnabled = showText;

      imgExport = imgExport != null ? imgExport : this.createSvgImageExport();
      var imgExportDrawCellState = imgExport.drawCellState;

      // Ignores custom links
      var imgExportGetLinkForCellState = imgExport.getLinkForCellState;

      imgExport.getLinkForCellState = (state, _canvas) => {
        var result = imgExportGetLinkForCellState.apply(this, arguments);

        return result != null && !state.view.graph.isCustomLink(result)
          ? result
          : null;
      }; // Implements ignoreSelection flag

      imgExport.drawCellState = (state, _canvas) => {
        var graph = state.view.graph;
        var selected = graph.isCellSelected(state.cell);
        var parent = graph.model.getParent(state.cell);

        // Checks if parent cell is selected
        while (!ignoreSelection && !selected && parent != null) {
          selected = graph.isCellSelected(parent);
          parent = graph.model.getParent(parent);
        }

        if (ignoreSelection || selected) {
          imgExportDrawCellState.apply(this, arguments);
        }
      };

      imgExport.drawState(this.getView().getState(this.model.root), svgCanvas);
      this.updateSvgLinks(root, linkTarget, true);
      this.addForeignObjectWarning(svgCanvas, root);

      return root;
    } finally {
      if (origUseCssTrans) {
        this.useCssTransforms = true;
        this.view.revalidate();
        this.sizeDidChange();
      }
    }
  }
}
