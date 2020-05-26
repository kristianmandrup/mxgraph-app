import mx from "@mxgraph-app/mx";
import { Configuration } from "./Configuration";
const { mxUtils } = mx;

export class Parser {
  configure() {
    const { entities } = Configuration;
    const parseXml = mxUtils.parseXml;
    mxUtils.parseXml = function (text) {
      for (var i = 0; i < entities.length; i++) {
        text = text.replace(
          new RegExp("&" + entities[i][0] + ";", "g"),
          "&#" + entities[i][1] + ";"
        );
      }
      return parseXml(text);
    };
  }
}
