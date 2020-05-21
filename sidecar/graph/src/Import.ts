export class Importer {
  /**
   * 
   */
  importGraphModel(node, dx, dy, crop) {
    dx = (dx != null) ? dx : 0;
    dy = (dy != null) ? dy : 0;
    
    var codec = new mxCodec(node.ownerDocument);
    var tempModel = new mxGraphModel();
    codec.decode(node, tempModel);
    var cells = []
    
    // Clones cells to remove invalid edges
    var cloneMap = new Object();
    var cellMapping = new Object();
    var layers = tempModel.getChildren(this.cloneCell(tempModel.root,
      this.isCloneInvalidEdges(), cloneMap));
    
    if (layers != null)
    {
      // Creates lookup from object IDs to cell IDs
      var lookup = this.createCellLookup([tempModel.root]);
      
      // Uses copy as layers are removed from array inside loop
      layers = layers.slice();

      this.model.beginUpdate();
      try
      {
        // Merges into unlocked current layer if one layer is pasted
        if (layers.length == 1 && !this.isCellLocked(this.getDefaultParent()))
        {
          cells = this.moveCells(tempModel.getChildren(layers[0]),
            dx, dy, false, this.getDefaultParent());
          
          // Imported default parent maps to local default parent
          cellMapping[tempModel.getChildAt(tempModel.root, 0).getId()] =
            this.getDefaultParent().getId();
        }
        else
        {
          for (var i = 0; i < layers.length; i++)
          {
            var children = this.model.getChildren(this.moveCells(
              [layers[i]], dx, dy, false, this.model.getRoot())[0]);
            
            if (children != null)
            {
              cells = cells.concat(children);
            }
          }
        }
        
        if (cells != null)
        {
          // Adds mapping for all cloned entries from imported to local cell ID
          this.createCellMapping(cloneMap, lookup, cellMapping);
          this.updateCustomLinks(cellMapping, cells);
          
          if (crop)
          {
            if (this.isGridEnabled())
            {
              dx = this.snap(dx);
              dy = this.snap(dy);
            }
            
            var bounds = this.getBoundingBoxFromGeometry(cells, true);
            
            if (bounds != null)
            {
              this.moveCells(cells, dx - bounds.x, dy - bounds.y);
            }
          }
        }
      }
      finally
      {
        this.model.endUpdate();
      }
    }
    
    return cells;
  };
}