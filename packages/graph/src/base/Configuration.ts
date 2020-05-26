export class Configuration {
  static html4: any;

  static configure() {
    const { html4 } = this;
    // Workaround for allowing target="_blank" in HTML sanitizer
    // see https://code.google.com/p/google-caja/issues/detail?can=2&q=&colspec=ID%20Type%20Status%20Priority%20Owner%20Summary&groupby=&sort=&id=1296
    if (typeof html4 !== "undefined") {
      html4.ATTRIBS["a::target"] = 0;
      html4.ATTRIBS["source::src"] = 0;
      html4.ATTRIBS["video::src"] = 0;
      // Would be nice for tooltips but probably a security risk...
      //html4.ATTRIBS["video::autoplay"] = 0;
      //html4.ATTRIBS["video::autobuffer"] = 0;
    }
  }

  static entities = [
    ["nbsp", "160"],
    ["shy", "173"],
  ];
}
