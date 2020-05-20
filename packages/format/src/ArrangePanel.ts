import { BaseFormatPanel } from "./BaseFormatPanel";
import mx from "mx";
import { StyleFormatPanel } from "./StyleFormatPanel";
const { mxCellRenderer, mxEventObject, mxConstants, mxClient, mxResources, mxPoint, mxEvent, mxGraph, mxUtils } = mx

/**
 * Adds the label menu items to the given menu and parent.
 */
export class ArrangePanel extends BaseFormatPanel { 
  editorUi: any
  format: any
  container: any
  getUnit: any
  getUnitStep: any
  isFloatUnit: any
  inUnit: any

  constructor(format, editorUi, container) {
    super(format, editorUi, container)
    this.init();
  }

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    var graph = this.editorUi.editor.graph;
    var ss = this.format.getSelectionState();

    this.container.appendChild(this.addLayerOps(this.createPanel()));
    // Special case that adds two panels
    this.addGeometry(this.container);
    this.addEdgeGeometry(this.container);

    if (!ss.containsLabel || ss.edges.length == 0) {
      this.container.appendChild(this.addAngle(this.createPanel()));
    }
    
    if (!ss.containsLabel && ss.edges.length == 0 &&
      ss.style.shape != 'rectangle' &&
      ss.style.shape != 'label') {
      this.container.appendChild(this.addFlip(this.createPanel()));
    }
    
    if (ss.vertices.length > 1) {
      this.container.appendChild(this.addAlign(this.createPanel()));
      this.container.appendChild(this.addDistribute(this.createPanel()));
    } else if (ss.vertices.length == 1 && ss.edges.length == 0 &&
      (graph.isTable(ss.vertices[0]) ||
      graph.isTableRow(ss.vertices[0]) ||
      graph.isTableCell(ss.vertices[0]))) {
      this.container.appendChild(this.addTable(this.createPanel()));
    }
    
    this.container.appendChild(this.addGroupOps(this.createPanel()));
    
    if (ss.containsLabel) {
      // Adds functions from hidden style format panel
      var span = document.createElement('div');
      span.style.width = '100%';
      span.style.marginTop = '0px';
      span.style.fontWeight = 'bold';
      span.style.padding = '10px 0 0 18px';
      mxUtils.write(span, mxResources.get('style'));
      this.container.appendChild(span);
        
      new StyleFormatPanel(this.format, this.editorUi, this.container);
    }
  };

  /**
   * 
   */
  addTable(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '10px';

    var span = document.createElement('div');
    span.style.marginTop = '2px';
    span.style.marginBottom = '8px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('table'));
    div.appendChild(span);
    
    var panel = document.createElement('div');
    panel.style.position = 'relative';
    panel.style.paddingLeft = '0px';
    panel.style.borderWidth = '0px';
    panel.className = 'geToolbarContainer';

    var btns = [
          ui.toolbar.addButton('geSprite-insertcolumnbefore', mxResources.get('insertColumnBefore'),
      mxUtils.bind(this, function()
      {
        try
        {
          graph.insertTableColumn(ss.vertices[0], true);
        }
        catch (e)
        {
          ui.handleError(e);
        }
      }), panel),
      ui.toolbar.addButton('geSprite-insertcolumnafter', mxResources.get('insertColumnAfter'),
      mxUtils.bind(this, function()
      {
        try
        {
          graph.insertTableColumn(ss.vertices[0], false);
        }
        catch (e)
        {
          ui.handleError(e);
        }
      }), panel),
      ui.toolbar.addButton('geSprite-deletecolumn', mxResources.get('deleteColumn'),
      mxUtils.bind(this, function()
      {
        try
        {
          graph.deleteTableColumn(ss.vertices[0]);
        }
        catch (e)
        {
          ui.handleError(e);
        }
      }), panel),
      ui.toolbar.addButton('geSprite-insertrowbefore', mxResources.get('insertRowBefore'),
      mxUtils.bind(this, function()
      {
        try
        {
          graph.insertTableRow(ss.vertices[0], true);
        }
        catch (e)
        {
          ui.handleError(e);
        }
      }), panel),
      ui.toolbar.addButton('geSprite-insertrowafter', mxResources.get('insertRowAfter'),
      mxUtils.bind(this, function()
      {
        try
        {
          graph.insertTableRow(ss.vertices[0], false);
        }
        catch (e)
        {
          ui.handleError(e);
        }
      }), panel),
      ui.toolbar.addButton('geSprite-deleterow', mxResources.get('deleteRow'),
      mxUtils.bind(this, function()
      {
        try
        {
          graph.deleteTableRow(ss.vertices[0]);
        }
        catch (e)
        {
          ui.handleError(e);
        }
      }), panel)];
    this.styleButtons(btns);
    div.appendChild(panel);
    btns[2].style.marginRight = '9px';
    
    return div;
  };

  /**
   * 
   */
  addLayerOps(div) {
    var ui = this.editorUi;
    
    var btn = mxUtils.button(mxResources.get('toFront'), function(evt)
    {
      ui.actions.get('toFront').funct();
    })
    
    btn.setAttribute('title', mxResources.get('toFront') + ' (' + this.editorUi.actions.get('toFront').shortcut + ')');
    btn.style.width = '100px';
    btn.style.marginRight = '2px';
    div.appendChild(btn);
    
    var btn = mxUtils.button(mxResources.get('toBack'), function(evt)
    {
      ui.actions.get('toBack').funct();
    })
    
    btn.setAttribute('title', mxResources.get('toBack') + ' (' + this.editorUi.actions.get('toBack').shortcut + ')');
    btn.style.width = '100px';
    div.appendChild(btn);
    
    return div;
  };

  /**
   * 
   */
  addGroupOps(div) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var cell = graph.getSelectionCell();
    var ss = this.format.getSelectionState();
    var count = 0;
    var btn: any = null;
    
    div.style.paddingTop = '8px';
    div.style.paddingBottom = '6px';

    if (graph.getSelectionCount() > 1)
    {
      btn = mxUtils.button(mxResources.get('group'), function(evt)
      {
        ui.actions.get('group').funct();
      })
      
      btn.setAttribute('title', mxResources.get('group') + ' (' + this.editorUi.actions.get('group').shortcut + ')');
      btn.style.width = '202px';
      btn.style.marginBottom = '2px';
      div.appendChild(btn);
      count++;
    }
    else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) && !graph.isSwimlane(cell) &&
        graph.getModel().getChildCount(cell) > 0)
    {
      btn = mxUtils.button(mxResources.get('ungroup'), function(evt)
      {
        ui.actions.get('ungroup').funct();
      })
      
      btn.setAttribute('title', mxResources.get('ungroup') + ' (' +
        this.editorUi.actions.get('ungroup').shortcut + ')');
      btn.style.width = '202px';
      btn.style.marginBottom = '2px';
      div.appendChild(btn);
      count++;
    }
    
    if (ss.vertices.length > 0)
    {
      if (count > 0)
      {
        mxUtils.br(div);
        count = 0;
      }
      
      var btn = mxUtils.button(mxResources.get('copySize'), function(evt)
      {
        ui.actions.get('copySize').funct();
      });
      
      btn.setAttribute('title', mxResources.get('copySize') + ' (' +
        this.editorUi.actions.get('copySize').shortcut + ')');
      btn.style.width = '202px';
      btn.style.marginBottom = '2px';

      div.appendChild(btn);
      count++;
      
      if (ui.copiedSize != null)
      {
        var btn2 = mxUtils.button(mxResources.get('pasteSize'), function(evt)
        {
          ui.actions.get('pasteSize').funct();
        });
        
        btn2.setAttribute('title', mxResources.get('pasteSize') + ' (' +
          this.editorUi.actions.get('pasteSize').shortcut + ')');
        
        div.appendChild(btn2);
        count++;
        
        btn.style.width = '100px';
        btn.style.marginBottom = '2px';
        btn2.style.width = '100px';
        btn2.style.marginBottom = '2px';
      }
    }
    
    if (graph.getSelectionCount() == 1 && graph.getModel().isVertex(cell) &&
        graph.getModel().isVertex(graph.getModel().getParent(cell))) {
      if (count > 0) {
        mxUtils.br(div);
      }
      
      btn = mxUtils.button(mxResources.get('removeFromGroup'), (evt) => {
        ui.actions.get('removeFromGroup').funct();
      })
      
      btn.setAttribute('title', mxResources.get('removeFromGroup'));
      btn.style.width = '202px';
      btn.style.marginBottom = '2px';
      div.appendChild(btn);
      count++;
    } else if (graph.getSelectionCount() > 0) {
      if (count > 0) {
        mxUtils.br(div);
      }
      
      btn = mxUtils.button(mxResources.get('clearWaypoints'), (evt) => {
        this.editorUi.actions.get('clearWaypoints').funct();
      });
      
      btn.setAttribute('title', mxResources.get('clearWaypoints') + ' (' + this.editorUi.actions.get('clearWaypoints').shortcut + ')');
      btn.style.width = '202px';
      btn.style.marginBottom = '2px';
      div.appendChild(btn);

      count++;
    }
    
    if (graph.getSelectionCount() == 1) {
      if (count > 0) {
        mxUtils.br(div);
      }
      
      btn = mxUtils.button(mxResources.get('editData'), (evt) => {
        this.editorUi.actions.get('editData').funct();
      });
      
      btn.setAttribute('title', mxResources.get('editData') + ' (' + this.editorUi.actions.get('editData').shortcut + ')');
      btn.style.width = '100px';
      btn.style.marginBottom = '2px';
      div.appendChild(btn);
      count++;

      btn = mxUtils.button(mxResources.get('editLink'), (evt) => {
        this.editorUi.actions.get('editLink').funct();
      });
      
      btn.setAttribute('title', mxResources.get('editLink'));
      btn.style.width = '100px';
      btn.style.marginLeft = '2px';
      btn.style.marginBottom = '2px';
      div.appendChild(btn);
      count++;
    }
    
    if (count == 0) {
      div.style.display = 'none';
    }
    
    return div;
  };

  /**
   * add alignment to div
   */
  addAlign(div) {
    var graph = this.editorUi.editor.graph;
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '12px';
    div.appendChild(this.createTitle(mxResources.get('align')));
    
    var stylePanel = document.createElement('div');
    stylePanel.style.position = 'relative';
    stylePanel.style.paddingLeft = '0px';
    stylePanel.style.borderWidth = '0px';
    stylePanel.className = 'geToolbarContainer';
    
    if (mxClient.IS_QUIRKS) {
      div.style.height = '60px';
    }
    
    var left = this.editorUi.toolbar.addButton('geSprite-alignleft', mxResources.get('left'),
      function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, stylePanel);
    var center = this.editorUi.toolbar.addButton('geSprite-aligncenter', mxResources.get('center'),
      function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, stylePanel);
    var right = this.editorUi.toolbar.addButton('geSprite-alignright', mxResources.get('right'),
      function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, stylePanel);

    var top = this.editorUi.toolbar.addButton('geSprite-aligntop', mxResources.get('top'),
      function() { graph.alignCells(mxConstants.ALIGN_TOP); }, stylePanel);
    var middle = this.editorUi.toolbar.addButton('geSprite-alignmiddle', mxResources.get('middle'),
      function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, stylePanel);
    var bottom = this.editorUi.toolbar.addButton('geSprite-alignbottom', mxResources.get('bottom'),
      function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, stylePanel);
    
    this.styleButtons([left, center, right, top, middle, bottom]);
    right.style.marginRight = '6px';
    div.appendChild(stylePanel);
    
    return div;
  };

  /**
   * 
   */
  addFlip(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '10px';

    var span = document.createElement('div');
    span.style.marginTop = '2px';
    span.style.marginBottom = '8px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('flip'));
    div.appendChild(span);
    
    var btn = mxUtils.button(mxResources.get('horizontal'), (evt) => {
      graph.toggleCellStyles(mxConstants.STYLE_FLIPH, false);
    })
    
    btn.setAttribute('title', mxResources.get('horizontal'));
    btn.style.width = '100px';
    btn.style.marginRight = '2px';
    div.appendChild(btn);
    
    var btn = mxUtils.button(mxResources.get('vertical'), (evt) => {
      graph.toggleCellStyles(mxConstants.STYLE_FLIPV, false);
    })
    
    btn.setAttribute('title', mxResources.get('vertical'));
    btn.style.width = '100px';
    div.appendChild(btn);
    
    return div;
  };

  /**
   * 
   */
  addDistribute(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    div.style.paddingTop = '6px';
    div.style.paddingBottom = '12px';
    
    div.appendChild(this.createTitle(mxResources.get('distribute')));

    var btn = mxUtils.button(mxResources.get('horizontal'), (evt) => {
      graph.distributeCells(true);
    })
    
    btn.setAttribute('title', mxResources.get('horizontal'));
    btn.style.width = '100px';
    btn.style.marginRight = '2px';
    div.appendChild(btn);
    
    var btn = mxUtils.button(mxResources.get('vertical'), (evt) => {
      graph.distributeCells(false);
    })
    
    btn.setAttribute('title', mxResources.get('vertical'));
    btn.style.width = '100px';
    div.appendChild(btn);
    
    return div;
  };

  /**
   * 
   */
  addAngle(div) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();

    div.style.paddingBottom = '8px';
    
    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    
    var input:any
    var update: any;
    var btn:any
    
    if (ss.edges.length == 0) {
      mxUtils.write(span, mxResources.get('angle'));
      div.appendChild(span);
      
      input = this.addUnitInput(div, '°', 20, 44, () => {
        update.apply(this, arguments);
      }, null, null, null, null);
      
      mxUtils.br(div);
      div.style.paddingTop = '10px';
    } else {
      div.style.paddingTop = '8px';
    }

    if (!ss.containsLabel) {
      var label = mxResources.get('reverse');
      
      if (ss.vertices.length > 0 && ss.edges.length > 0) {
        label = mxResources.get('turn') + ' / ' + label;
      } else if (ss.vertices.length > 0) {
        label = mxResources.get('turn');
      }

      btn = mxUtils.button(label, (evt) => {
        ui.actions.get('turn').funct(evt);
      })
      
      btn.setAttribute('title', label + ' (' + this.editorUi.actions.get('turn').shortcut + ')');
      btn.style.width = '202px';
      div.appendChild(btn);
      
      if (input) {
        btn.style.marginTop = '8px';
      }
    }
    
    if (input) {
      var listener = (sender?, evt?, force?) => {
        if (force || document.activeElement != input) {
          ss = this.format.getSelectionState();
          var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_ROTATION, 0));
          input.value = (isNaN(tmp)) ? '' : tmp  + '°';
        }
      };
    
      update = this.installInputHandler(input, mxConstants.STYLE_ROTATION, 0, 0, 360, '°', null, true);
      this.addKeyHandler(input, listener);
    
      graph.getModel().addListener(mxEvent.CHANGE, listener);
      this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
      listener();
    }

    return div;
  }


  /**
   * 
   */
  addGeometry(container) {
    var panel = this;
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var rect = this.format.getSelectionState();
    
    var div = this.createPanel();
    div.style.paddingBottom = '8px';
    
    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '50px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('size'));
    div.appendChild(span);

    var widthUpdate, heightUpdate, leftUpdate, topUpdate;
    var width = this.addUnitInput(div, this.getUnit(), 84, 44, () => {
      widthUpdate.apply(this, []);
    }, this.getUnitStep(), null, null, this.isFloatUnit());
    var height = this.addUnitInput(div, this.getUnit(), 20, 44, () => {
      heightUpdate.apply(this, []);
    }, this.getUnitStep(), null, null, this.isFloatUnit());
    
    var autosizeBtn = document.createElement('div');
    autosizeBtn.className = 'geSprite geSprite-fit';
    autosizeBtn.setAttribute('title', mxResources.get('autosize') + ' (' + this.editorUi.actions.get('autosize').shortcut + ')');
    autosizeBtn.style.position = 'relative';
    autosizeBtn.style.cursor = 'pointer';
    autosizeBtn.style.marginTop = '-3px';
    autosizeBtn.style.border = '0px';
    autosizeBtn.style.left = '52px';
    mxUtils.setOpacity(autosizeBtn, 50);
    
    mxEvent.addListener(autosizeBtn, 'mouseenter', function()
    {
      mxUtils.setOpacity(autosizeBtn, 100);
    });
    
    mxEvent.addListener(autosizeBtn, 'mouseleave', function()
    {
      mxUtils.setOpacity(autosizeBtn, 50);
    });

    mxEvent.addListener(autosizeBtn, 'click', function()
    {
      ui.actions.get('autosize').funct();
    });
    
    div.appendChild(autosizeBtn);
    this.addLabel(div, mxResources.get('width'), 84);
    this.addLabel(div, mxResources.get('height'), 20);
    mxUtils.br(div);
    
    var wrapper = document.createElement('div');
    wrapper.style.paddingTop = '8px';
    wrapper.style.paddingRight = '20px';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.textAlign = 'right';
    var opt = this.createCellOption(mxResources.get('constrainProportions'),
      mxConstants.STYLE_ASPECT, null, 'fixed', 'null');
    opt.style.width = '100%';
    wrapper.appendChild(opt);
    div.appendChild(wrapper);
    
    var constrainCheckbox = opt.getElementsByTagName('input')[0];
    this.addKeyHandler(width, listener);
    this.addKeyHandler(height, listener);
    
    widthUpdate = this.addGeometryHandler(width, (geo, value) => {
      if (geo.width > 0)
      {
        value = Math.max(1, panel.fromUnit(value));
        
        if (constrainCheckbox.checked)
        {
          geo.height = Math.round((geo.height  * value * 100) / geo.width) / 100;
        }
        
        geo.width = value;
      }
    });
    heightUpdate = this.addGeometryHandler(height, (geo, value) => {
      if (geo.height > 0) {
        value = Math.max(1, panel.fromUnit(value));
        
        if (constrainCheckbox.checked)
        {
          geo.width = Math.round((geo.width  * value * 100) / geo.height) / 100;
        }
        
        geo.height = value;
      }
    });
    
    container.appendChild(div);
    
    var div2 = this.createPanel();
    div2.style.paddingBottom = '30px';
    
    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('position'));
    div2.appendChild(span);
    
    var left = this.addUnitInput(div2, this.getUnit(), 84, 44, () =>
    {
      leftUpdate.apply(this, arguments);
    }, this.getUnitStep(), null, null, this.isFloatUnit());
    var top = this.addUnitInput(div2, this.getUnit(), 20, 44, () =>
    {
      topUpdate.apply(this, arguments);
    }, this.getUnitStep(), null, null, this.isFloatUnit());

    mxUtils.br(div2);
    this.addLabel(div2, mxResources.get('left'), 84);
    this.addLabel(div2, mxResources.get('top'), 20);
    
    var listener = (sender, evt, force) => {
      rect = this.format.getSelectionState();

      if (!rect.containsLabel && rect.vertices.length == graph.getSelectionCount() &&
        rect.width != null && rect.height != null)
      {
        div.style.display = '';
        
        if (force || document.activeElement != width)
        {
          width.value = this.inUnit(rect.width) + ((rect.width == '') ? '' : ' ' + this.getUnit());
        }
        
        if (force || document.activeElement != height)
        {
          height.value = this.inUnit(rect.height) + ((rect.height == '') ? '' : ' ' + this.getUnit());
        }
      }
      else
      {
        div.style.display = 'none';
      }
      
      if (rect.vertices.length == graph.getSelectionCount() &&
        rect.x != null && rect.y != null)
      {
        div2.style.display = '';
        
        if (force || document.activeElement != left)
        {
          left.value = this.inUnit(rect.x)  + ((rect.x == '') ? '' : ' ' + this.getUnit());
        }
        
        if (force || document.activeElement != top)
        {
          top.value = this.inUnit(rect.y) + ((rect.y == '') ? '' : ' ' + this.getUnit());
        }
      }
      else
      {
        div2.style.display = 'none';
      }
    };

    this.addKeyHandler(left, listener);
    this.addKeyHandler(top, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
    listener();
    
    leftUpdate = this.addGeometryHandler(left, (geo, value) => {
      value = panel.fromUnit(value);
      
      if (geo.relative)
      {
        geo.offset.x = value;
      }
      else
      {
        geo.x = value;
      }
    });
    topUpdate = this.addGeometryHandler(top, (geo, value) => {
      value = panel.fromUnit(value);
      
      if (geo.relative)
      {
        geo.offset.y = value;
      }
      else
      {
        geo.y = value;
      }
    });

    container.appendChild(div2);
  };

  /**
   * 
   */
  addGeometryHandler(input, fn) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var initialValue = null;
    var panel = this;
    
    const update = (evt) => {
      if (input.value != '')
      {
        var value = parseFloat(input.value);

        if (isNaN(value)) 
        {
          input.value = initialValue + ' ' + panel.getUnit();
        }
        else if (value != initialValue)
        {
          graph.getModel().beginUpdate();
          try
          {
            var cells = graph.getSelectionCells();
            
            for (var i = 0; i < cells.length; i++)
            {
              if (graph.getModel().isVertex(cells[i]))
              {
                var geo = graph.getCellGeometry(cells[i]);
                
                if (geo != null)
                {
                  geo = geo.clone();
                  fn(geo, value);
                  
                  var state = graph.view.getState(cells[i]);
                  
                  if (state != null && graph.isRecursiveVertexResize(state))
                  {
                    graph.resizeChildCells(cells[i], geo);
                  }
                  
                  graph.getModel().setGeometry(cells[i], geo);
                  graph.constrainChildCells(cells[i]);
                }
              }
            }
          }
          finally
          {
            graph.getModel().endUpdate();
          }
          
          initialValue = value;
          input.value = value + ' ' + panel.getUnit();
        }
      }
      
      mxEvent.consume(evt);
    };

    mxEvent.addListener(input, 'blur', update);
    mxEvent.addListener(input, 'change', update);
    mxEvent.addListener(input, 'focus', function()
    {
      initialValue = input.value;
    });
    
    return update;
  };

  addEdgeGeometryHandler(input, fn) {
      var ui = this.editorUi;
      var graph = ui.editor.graph;
      var initialValue = null;

      const update = (evt) => {
          if (input.value != '')
          {
              var value = parseFloat(input.value);

              if (isNaN(value))
              {
                  input.value = initialValue + ' pt';
              }
              else if (value != initialValue)
              {
                  graph.getModel().beginUpdate();
                  try
                  {
                      var cells = graph.getSelectionCells();

                      for (var i = 0; i < cells.length; i++)
                      {
                          if (graph.getModel().isEdge(cells[i]))
                          {
                              var geo = graph.getCellGeometry(cells[i]);

                              if (geo != null)
                              {
                                  geo = geo.clone();
                                  fn(geo, value);

                                  graph.getModel().setGeometry(cells[i], geo);
                              }
                          }
                      }
                  }
                  finally
                  {
                      graph.getModel().endUpdate();
                  }

                  initialValue = value;
                  input.value = value + ' pt';
              }
          }

          mxEvent.consume(evt);
      };

      mxEvent.addListener(input, 'blur', update);
      mxEvent.addListener(input, 'change', update);
      mxEvent.addListener(input, 'focus', function()
      {
          initialValue = input.value;
      });

      return update;
  };

  /**
   * 
   */
  addEdgeGeometry(container) {
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    var rect = this.format.getSelectionState();
    
    var div = this.createPanel();
    
    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('width'));
    div.appendChild(span);

    var xtUpdate, ytUpdate, xsUpdate, ysUpdate;
    var width = this.addUnitInput(div, 'pt', 20, 44, (evt) =>
    {
      widthUpdate.apply(this, evt);
    });

    mxUtils.br(div);
    this.addKeyHandler(width, listener);
    
    const widthUpdate = (evt) => {
      // Maximum stroke width is 999
      var value = parseInt(width.value);
      value = Math.min(999, Math.max(1, (isNaN(value)) ? 1 : value));
      
      if (value != mxUtils.getValue(rect.style, 'width', mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth))
      {
        graph.setCellStyles('width', value, graph.getSelectionCells());
        ui.fireEvent(new mxEventObject('styleChanged', 'keys', ['width'],
            'values', [value], 'cells', graph.getSelectionCells()));
      }

      width.value = value + ' pt';
      mxEvent.consume(evt);
    };

    mxEvent.addListener(width, 'blur', widthUpdate);
    mxEvent.addListener(width, 'change', widthUpdate);

    container.appendChild(div);

    var divs = this.createPanel();
    divs.style.paddingBottom = '30px';

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, 'Start');
    divs.appendChild(span);

    var xs = this.addUnitInput(divs, 'pt', 84, 44, () =>
    {
      xsUpdate.apply(this, []);
    });
    var ys = this.addUnitInput(divs, 'pt', 20, 44, () =>
    {
      ysUpdate.apply(this, []);
    });

    mxUtils.br(divs);
    this.addLabel(divs, mxResources.get('left'), 84);
    this.addLabel(divs, mxResources.get('top'), 20);
    container.appendChild(divs);
    this.addKeyHandler(xs, listener);
    this.addKeyHandler(ys, listener);

    var divt = this.createPanel();
    divt.style.paddingBottom = '30px';

    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, 'End');
    divt.appendChild(span);

    var xt = this.addUnitInput(divt, 'pt', 84, 44, () =>
    {
      xtUpdate.apply(this, []);
    });
    var yt = this.addUnitInput(divt, 'pt', 20, 44, () =>
    {
      ytUpdate.apply(this, []);
    });

    mxUtils.br(divt);
    this.addLabel(divt, mxResources.get('left'), 84);
    this.addLabel(divt, mxResources.get('top'), 20);
    container.appendChild(divt);
    this.addKeyHandler(xt, listener);
    this.addKeyHandler(yt, listener);

    var listener = (sender?, evt?, force?) => {
      rect = this.format.getSelectionState();
      var cell = graph.getSelectionCell();
      
      if (rect.style.shape == 'link' || rect.style.shape == 'flexArrow')
      {
        div.style.display = '';
        
        if (force || document.activeElement != width)
        {
          var value = mxUtils.getValue(rect.style, 'width',
            mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth);
          width.value = value + ' pt';
        }
      }
      else
      {
        div.style.display = 'none';
      }

      if (graph.getSelectionCount() == 1 && graph.model.isEdge(cell))
      {
        var geo = graph.model.getGeometry(cell);
        
        if (geo.sourcePoint != null && graph.model.getTerminal(cell, true) == null)
        {
          xs.value = geo.sourcePoint.x;
          ys.value = geo.sourcePoint.y;
        }
        else
        {
          divs.style.display = 'none';
        }
        
        if (geo.targetPoint != null && graph.model.getTerminal(cell, false) == null)
        {
          xt.value = geo.targetPoint.x;
          yt.value = geo.targetPoint.y;
        }
        else
        {
          divt.style.display = 'none';
        }
      }
      else
      {
        divs.style.display = 'none';
        divt.style.display = 'none';
      }
    };

    xsUpdate = this.addEdgeGeometryHandler(xs, (geo, value) => {
      geo.sourcePoint.x = value;
    });

    ysUpdate = this.addEdgeGeometryHandler(ys, (geo, value) => {
      geo.sourcePoint.y = value;
    });

    xtUpdate = this.addEdgeGeometryHandler(xt, (geo, value) => {
      geo.targetPoint.x = value;
    });

    ytUpdate = this.addEdgeGeometryHandler(yt, (geo, value) => {
      geo.targetPoint.y = value;
    });

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
    listener();
  };

}