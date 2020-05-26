export class Elements {
  /**
   * Replaces the given element with a span.
   */
  replaceElement(elt, tagName)
  {
    var span = elt.ownerDocument.createElement((tagName != null) ? tagName : 'span');
    var attributes = Array.prototype.slice.call(elt.attributes);
    
    while (attr = attributes.pop())
    {
      span.setAttribute(attr.nodeName, attr.nodeValue);
    }
    
    span.innerHTML = elt.innerHTML;
    elt.parentNode.replaceChild(span, elt);
  };

  /**
   * 
   */
  processElements(elt, fn)
  {
    if (elt != null)
    {
      var elts = elt.getElementsByTagName('*');
      
      for (var i = 0; i < elts.length; i++)
      {
        fn(elts[i]);
      }
    }
  };
  
  /**
   * Handles label changes for XML user objects.
   */
  updateLabelElements(cells, fn, tagName)
  {
    cells = (cells != null) ? cells : this.getSelectionCells();
    var div = document.createElement('div');
    
    for (var i = 0; i < cells.length; i++)
    {
      // Changes font tags inside HTML labels
      if (this.isHtmlLabel(cells[i]))
      {
        var label = this.convertValueToString(cells[i]);
        
        if (label != null && label.length > 0)
        {
          div.innerHTML = label;
          var elts = div.getElementsByTagName((tagName != null) ? tagName : '*');
          
          for (var j = 0; j < elts.length; j++)
          {
            fn(elts[j]);
          }
          
          if (div.innerHTML != label)
          {
            this.cellLabelChanged(cells[i], div.innerHTML);
          }
        }
      }
    }
  };
}