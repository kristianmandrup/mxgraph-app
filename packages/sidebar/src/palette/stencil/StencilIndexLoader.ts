import { StencilPalette } from "./StencilPalette";
import mx from "@mxgraph-app/mx";
const { mxStencilRegistry, mxUtils } = mx;

export class StencilIndexLoader extends StencilPalette {
  load({ id, title, stencilFile, style, ignore, scale, tags, customFns }) {
    // LATER: Handle asynchronous loading dependency
    var fns: any[] = [];

    if (customFns != null) {
      for (var i = 0; i < customFns.length; i++) {
        fns.push(customFns[i]);
      }
    }

    mxStencilRegistry["loadStencilSet"](
      stencilFile,
      (packageName, stencilName, _displayName, w, h) => {
        if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
          var tmp = this.getTagsForStencil(packageName, stencilName);
          var tmpTags = tags != null ? tags[stencilName] : null;

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
              this.filterTags(tmp.join(" "))
            )
          );
        }
      },
      true,
      true
    );

    this.addPaletteFunctions(id, title, false, fns);
  }
}
