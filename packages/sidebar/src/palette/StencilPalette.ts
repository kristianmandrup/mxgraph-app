import mx from "mx";
import { AbstractPalette } from "./AbstractPalette";
const { mxStencilRegistry, mxUtils } = mx;

export class StencilPalette extends AbstractPalette {
  addStencilsToIndex: any; // fn
  getTagsForStencil: any;
  filterTags: any;

  // PaletteAdder
  addPaletteFunctions: any;
  addPalette: any;
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
    customFns: any[] = [],
  ) {
    scale = (scale != null) ? scale : 1;

    if (this.addStencilsToIndex) {
      // LATER: Handle asynchronous loading dependency
      var fns: any[] = [];

      if (customFns != null) {
        for (var i = 0; i < customFns.length; i++) {
          fns.push(customFns[i]);
        }
      }

      mxStencilRegistry["loadStencilSet"](
        stencilFile,
        (packageName, stencilName, displayName, w, h) => {
          if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
            var tmp = this.getTagsForStencil(packageName, stencilName);
            var tmpTags = (tags != null) ? tags[stencilName] : null;

            if (tmpTags != null) {
              tmp.push(tmpTags);
            }

            fns.push(
              this.createVertexTemplateEntry(
                "shape=" + packageName + stencilName.toLowerCase() + style,
                Math.round(w * scale),
                Math.round(h * scale),
                "",
                stencilName.replace(/_/g, " "),
                null,
                null,
                this.filterTags(tmp.join(" ")),
              ),
            );
          }
        },
        true,
        true,
      );

      this.addPaletteFunctions(id, title, false, fns);
    } else {
      this.addPalette(
        id,
        title,
        false,
        (content) => {
          if (style == null) {
            style = "";
          }

          if (onInit != null) {
            onInit.call(this, content);
          }

          if (customFns != null) {
            for (var i = 0; i < customFns.length; i++) {
              customFns[i](content);
            }
          }

          mxStencilRegistry["loadStencilSet"](
            stencilFile,
            (packageName, stencilName, displayName, w, h) => {
              if (
                ignore == null || mxUtils.indexOf(ignore, stencilName) < 0
              ) {
                content.appendChild(
                  this.createVertexTemplate(
                    "shape=" + packageName + stencilName.toLowerCase() +
                      style,
                    Math.round(w * scale),
                    Math.round(h * scale),
                    "",
                    stencilName.replace(/_/g, " "),
                    true,
                  ),
                );
              }
            },
            true,
          );
        },
      );
    }
  }
}
