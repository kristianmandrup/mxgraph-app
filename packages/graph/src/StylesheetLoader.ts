export class StylesheetLoader { 
/**
   * Loads the stylesheet for this graph.
   */
  loadStylesheet()
  {
    var node = (this.themes != null) ? this.themes[this.defaultThemeName] :
      (!mxStyleRegistry.dynamicLoading) ? null :
      mxUtils.load(STYLE_PATH + '/default.xml').getDocumentElement();
    
    if (node != null)
    {
      var dec = new mxCodec(node.ownerDocument);
      dec.decode(node, this.getStylesheet());
    }
  };
}