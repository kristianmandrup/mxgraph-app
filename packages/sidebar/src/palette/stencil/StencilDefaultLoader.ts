import { StencilPalette } from "./StencilPalette";
import mx from "@mxgraph-app/mx";
const { mxStencilRegistry, mxUtils } = mx;

export class StencilDefaultLoader extends StencilPalette {
  load({ id, title, stencilFile, style, ignore, onInit, scale, customFns }) {
    this.addPalette(id, title, false, (content) => {
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
        (packageName, stencilName, _displayName, w, h) => {
          if (ignore == null || mxUtils.indexOf(ignore, stencilName) < 0) {
            content.appendChild(
              this.createVertexTemplate(
                "shape=" + packageName + stencilName.toLowerCase() + style,
                Math.round(w * scale),
                Math.round(h * scale),
                "",
                stencilName.replace(/_/g, " "),
                true
              )
            );
          }
        },
        true
      );
    });
  }
}
