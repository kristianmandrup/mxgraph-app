export class Placeholders {
  /**
   * Returns true if the given stencil contains any placeholder text.
   */
  stencilHasPlaceholders(stencil)
  {
    if (stencil != null && stencil.fgNode != null)
    {
      var node = stencil.fgNode.firstChild;
      
      while (node != null)
      {
        if (node.nodeName == 'text' && node.getAttribute('placeholders') == '1')
        {
          return true;
        }
        
        node = node.nextSibling;
      }
    }
    
    return false;
  };
  
  /**
   * Updates the child cells with placeholders if metadata of a cell has changed.
   */
  processChange(change)
  {
    mxprocessChange.apply(this, arguments);
    
    if (change instanceof mxValueChange && change.cell != null &&
      change.cell.value != null && typeof(change.cell.value) == 'object')
    {
      this.invalidateDescendantsWithPlaceholders(change.cell);
    }
  };
  
  /**
   * Replaces the given element with a span.
   */
  invalidateDescendantsWithPlaceholders(cell)
  {
    // Invalidates all descendants with placeholders
    var desc = this.model.getDescendants(cell);
    
    // LATER: Check if only label or tooltip have changed
    if (desc.length > 0)
    {
      for (var i = 0; i < desc.length; i++)
      {
        var state = this.view.getState(desc[i]);
        
        if (state != null && state.shape != null && state.shape.stencil != null &&
          this.stencilHasPlaceholders(state.shape.stencil))
        {
          this.removeStateForCell(desc[i]);
        }
        else if (this.isReplacePlaceholders(desc[i]))
        {
          this.view.invalidate(desc[i], false, false);
        }
      }
    }
  };
}