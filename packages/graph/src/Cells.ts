export class Cells {

/**
   * 
   * @param cell
   * @returns {Boolean}
   */
  isCellResizable(cell)
  {
    var result = mxisCellResizable.apply(this, arguments);
    var style = this.getCurrentCellStyle(cell);
      
    return result || (mxUtils.getValue(style, mxConstants.STYLE_RESIZABLE, '1') != '0' &&
      style[mxConstants.STYLE_WHITE_SPACE] == 'wrap');
  };
  
  /**
   * Function: distributeCells
   * 
   * Distribuets the centers of the given cells equally along the available
   * horizontal or vertical space.
   * 
   * Parameters:
   * 
   * horizontal - Boolean that specifies the direction of the distribution.
   * cells - Optional array of <mxCells> to be distributed. Edges are ignored.
   */
  distributeCells(horizontal, cells)
  {
    if (cells == null)
    {
      cells = this.getSelectionCells();
    }
    
    if (cells != null && cells.length > 1)
    {
      var vertices = [];
      var max = null;
      var min = null;
      
      for (var i = 0; i < cells.length; i++)
      {
        if (this.getModel().isVertex(cells[i]))
        {
          var state = this.view.getState(cells[i]);
          
          if (state != null)
          {
            var tmp = (horizontal) ? state.getCenterX() : state.getCenterY();
            max = (max != null) ? Math.max(max, tmp) : tmp;
            min = (min != null) ? Math.min(min, tmp) : tmp;
            
            vertices.push(state);
          }
        }
      }
      
      if (vertices.length > 2)
      {
        vertices.sort(function(a, b)
        {
          return (horizontal) ? a.x - b.x : a.y - b.y;
        });
  
        var t = this.view.translate;
        var s = this.view.scale;
        
        min = min / s - ((horizontal) ? t.x : t.y);
        max = max / s - ((horizontal) ? t.x : t.y);
        
        this.getModel().beginUpdate();
        try
        {
          var dt = (max - min) / (vertices.length - 1);
          var t0 = min;
          
          for (var i = 1; i < vertices.length - 1; i++)
          {
            var pstate = this.view.getState(this.model.getParent(vertices[i].cell));
            var geo = this.getCellGeometry(vertices[i].cell);
            t0 += dt;
            
            if (geo != null && pstate != null)
            {
              geo = geo.clone();
              
              if (horizontal)
              {
                geo.x = Math.round(t0 - geo.width / 2) - pstate.origin.x;
              }
              else
              {
                geo.y = Math.round(t0 - geo.height / 2) - pstate.origin.y;
              }
              
              this.getModel().setGeometry(vertices[i].cell, geo);
            }
          }
        }
        finally
        {
          this.getModel().endUpdate();
        }
      }
    }
    
    return cells;
  };

  /**
   * Duplicates the given cells and returns the duplicates.
   */
  duplicateCells(cells, append)
  {
    cells = (cells != null) ? cells : this.getSelectionCells();
    append = (append != null) ? append : true;
    
    cells = this.model.getTopmostCells(cells);
    
    var model = this.getModel();
    var s = this.gridSize;
    var select = [];
    
    model.beginUpdate();
    try
    {
      var clones = this.cloneCells(cells, false, null, true);
      
      for (var i = 0; i < cells.length; i++)
      {
        var parent = model.getParent(cells[i]);
        var child = this.moveCells([clones[i]], s, s, false)[0];
        select.push(child);
        
        if (append)
        {
          model.add(parent, clones[i]);
        }
        else
        {
          // Maintains child index by inserting after clone in parent
          var index = parent.getIndex(cells[i]);
          model.add(parent, clones[i], index + 1);
        }
      }
    }
    finally
    {
      model.endUpdate();
    }
    
    return select;
  };


  
  /**
   * Handles label changes for XML user objects.
   */
  cellLabelChanged(cell, value, autoSize)
  {
    // Removes all illegal control characters in user input
    value = static zapGremlins(value);

    this.model.beginUpdate();
    try
    {			
      if (cell.value != null && typeof cell.value == 'object')
      {
        if (this.isReplacePlaceholders(cell) &&
          cell.getAttribute('placeholder') != null)
        {
          // LATER: Handle delete, name change
          var name = cell.getAttribute('placeholder');
          var current = cell;
              
          while (current != null)
          {
            if (current == this.model.getRoot() || (current.value != null &&
              typeof(current.value) == 'object' && current.hasAttribute(name)))
            {
              this.setAttributeForCell(current, name, value);
              
              break;
            }
            
            current = this.model.getParent(current);
          }
        }
        
        var tmp = cell.value.cloneNode(true);
        tmp.setAttribute('label', value);
        value = tmp;
      }

      mxcellLabelChanged.apply(this, arguments);
    }
    finally
    {
      this.model.endUpdate();
    }
  };

  /**
   * Removes transparent empty groups if all children are removed.
   */
  cellsRemoved(cells)
  {
    if (cells != null)
    {
      var dict = new mxDictionary();
      
      for (var i = 0; i < cells.length; i++)
      {
        dict.put(cells[i], true);
      }
      
      // LATER: Recurse up the cell hierarchy
      var parents = [];
      
      for (var i = 0; i < cells.length; i++)
      {
        var parent = this.model.getParent(cells[i]);

        if (parent != null && !dict.get(parent))
        {
          dict.put(parent, true);
          parents.push(parent);
        }
      }
      
      for (var i = 0; i < parents.length; i++)
      {
        var state = this.view.getState(parents[i]);
        
        if (state != null && (this.model.isEdge(state.cell) ||
          this.model.isVertex(state.cell)) &&
          this.isCellDeletable(state.cell) &&
          this.isTransparentState(state))
        {
          var allChildren = true;
          
          for (var j = 0; j < this.model.getChildCount(state.cell) && allChildren; j++)
          {
            if (!dict.get(this.model.getChildAt(state.cell, j)))
            {
              allChildren = false;
            }
          }
          
          if (allChildren)
          {
            cells.push(state.cell);
          }
        }
      }
    }
    
    mxcellsRemoved.apply(this, arguments);
  };
  
  /**
   * Overrides ungroup to check if group should be removed.
   */
  removeCellsAfterUngroup(cells)
  {
    var cellsToRemove = [];
    
    for (var i = 0; i < cells.length; i++)
    {
      if (this.isCellDeletable(cells[i]) && this.isTransparentState(
        this.view.getState(cells[i])))
      {
        cellsToRemove.push(cells[i]);
      }
    }
    
    cells = cellsToRemove;
    
    mxremoveCellsAfterUngroup.apply(this, arguments);
  };

  /**
   * Sets the link for the given cell.
   */
  setLinkForCell(cell, link)
  {
    this.setAttributeForCell(cell, 'link', link);
  };
  
  /**
   * Sets the link for the given cell.
   */
  setTooltipForCell(cell, link)
  {
    this.setAttributeForCell(cell, 'tooltip', link);
  };
  
  /**
   * Returns the cells in the model (or given array) that have all of the
   * given tags in their tags property.
   */
  getAttributeForCell(cell, attributeName, defaultValue)
  {
    var value = (cell.value != null && typeof cell.value === 'object') ?
      cell.value.getAttribute(attributeName) : null;
    
    return (value != null) ? value : defaultValue;
  };

  /**
   * Sets the link for the given cell.
   */
  setAttributeForCell(cell, attributeName, attributeValue)
  {
    var value = null;
    
    if (cell.value != null && typeof(cell.value) == 'object')
    {
      value = cell.value.cloneNode(true);
    }
    else
    {
      var doc = mxUtils.createXmlDocument();
      
      value = doc.createElement('UserObject');
      value.setAttribute('label', cell.value || '');
    }
    
    if (attributeValue != null)
    {
      value.setAttribute(attributeName, attributeValue);
    }
    else
    {
      value.removeAttribute(attributeName);
    }
    
    this.model.setValue(cell, value);
  };
    
}