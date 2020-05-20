export class InsertPoint {
  /**
   * Returns a point that specifies the location for inserting cells.
   */
  getInsertPoint()
  {
    var gs = this.getGridSize();
    var dx = this.container.scrollLeft / this.view.scale - this.view.translate.x;
    var dy = this.container.scrollTop / this.view.scale - this.view.translate.y;
    
    if (this.pageVisible)
    {
      var layout = this.getPageLayout();
      var page = this.getPageSize();
      dx = Math.max(dx, layout.x * page.width);
      dy = Math.max(dy, layout.y * page.height);
    }
    
    return new mxPoint(this.snap(dx + gs), this.snap(dy + gs));
  };
  
  /**
   * 
   */
  getFreeInsertPoint()
  {
    var view = this.view;
    var bds = this.getGraphBounds();
    var pt = this.getInsertPoint();
    
    // Places at same x-coord and 2 grid sizes below existing graph
    var x = this.snap(Math.round(Math.max(pt.x, bds.x / view.scale - view.translate.x +
      ((bds.width == 0) ? 2 * this.gridSize : 0))));
    var y = this.snap(Math.round(Math.max(pt.y, (bds.y + bds.height) / view.scale - view.translate.y +
      2 * this.gridSize)));
    
    return new mxPoint(x, y);
  };
      
  /**
   * 
   */
  getCenterInsertPoint(bbox)
  {
    bbox = (bbox != null) ? bbox : new mxRectangle();
    
    if (mxUtils.hasScrollbars(this.container))
    {
      return new mxPoint(
        this.snap((this.container.scrollLeft + this.container.clientWidth / 2) / this.view.scale -
          this.view.translate.x - bbox.width / 2),
        this.snap((this.container.scrollTop + this.container.clientHeight / 2) / this.view.scale -
          this.view.translate.y - bbox.height / 2));
    }
    else
    {
      return new mxPoint(
        this.snap(this.container.clientWidth / 2 / this.view.scale -
          this.view.translate.x - bbox.width / 2),
        this.snap(this.container.clientHeight / 2 / this.view.scale -
          this.view.translate.y - bbox.height / 2));
    }
  };
  
  /**
   * Hook for subclassers to return true if the current insert point was defined
   * using a mouse hover event.
   */
  isMouseInsertPoint()
  {			
    return false;
  };
}