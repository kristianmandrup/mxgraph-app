export class Rotation {
  /**
   * Turns the given cells and returns the changed cells.
   */
  turnShapes(cells, backwards) {
    var model = this.getModel();
    var select = [];
    
    model.beginUpdate();
    try
    {
      for (var i = 0; i < cells.length; i++)
      {
        var cell = cells[i];
        
        if (model.isEdge(cell))
        {
          var src = model.getTerminal(cell, true);
          var trg = model.getTerminal(cell, false);
          
          model.setTerminal(cell, trg, true);
          model.setTerminal(cell, src, false);
          
          var geo = model.getGeometry(cell);
          
          if (geo != null)
          {
            geo = geo.clone();
            
            if (geo.points != null)
            {
              geo.points.reverse();
            }
            
            var sp = geo.getTerminalPoint(true);
            var tp = geo.getTerminalPoint(false)
            
            geo.setTerminalPoint(sp, false);
            geo.setTerminalPoint(tp, true);
            model.setGeometry(cell, geo);
            
            // Inverts constraints
            var edgeState = this.view.getState(cell);
            var sourceState = this.view.getState(src);
            var targetState = this.view.getState(trg);
            
            if (edgeState != null)
            {
              var sc = (sourceState != null) ? this.getConnectionConstraint(edgeState, sourceState, true) : null;
              var tc = (targetState != null) ? this.getConnectionConstraint(edgeState, targetState, false) : null;
              
              this.setConnectionConstraint(cell, src, true, tc);
              this.setConnectionConstraint(cell, trg, false, sc);
            }
  
            select.push(cell);
          }
        }
        else if (model.isVertex(cell))
        {
          var geo = this.getCellGeometry(cell);
    
          if (geo != null)
          {
            // Rotates the size and position in the geometry
            geo = geo.clone();
            geo.x += geo.width / 2 - geo.height / 2;
            geo.y += geo.height / 2 - geo.width / 2;
            var tmp = geo.width;
            geo.width = geo.height;
            geo.height = tmp;
            model.setGeometry(cell, geo);
            
            // Reads the current direction and advances by 90 degrees
            var state = this.view.getState(cell);
            
            if (state != null)
            {
              var dirs = [mxConstants.DIRECTION_EAST, mxConstants.DIRECTION_SOUTH,
                mxConstants.DIRECTION_WEST, mxConstants.DIRECTION_NORTH];
              var dir = mxUtils.getValue(state.style, mxConstants.STYLE_DIRECTION,
                mxConstants.DIRECTION_EAST);
              this.setCellStyles(mxConstants.STYLE_DIRECTION,
                dirs[mxUtils.mod(mxUtils.indexOf(dirs, dir) +
                ((backwards) ? -1 : 1), dirs.length)], [cell]);
            }
  
            select.push(cell);
          }
        }
      }
    }
    finally
    {
      model.endUpdate();
    }
    
    return select;
  }
}