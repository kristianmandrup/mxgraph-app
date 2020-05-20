import mx from "mx";
import resources from "resources/resources";
import { Dialog } from "sample/Dialog";
import { DiagramFormatPanel } from "./DiagramFormatPanel";
const { mxResources, mxEventObject, mxConstants, mxClient, mxPoint, mxEvent, mxGraph, mxUtils } = mx
const { IMAGE_PATH } = resources

export class FormatRefresher {
  container: any
  editorUi: any
  showCloseButton: any
  panels: any[] = []
  clear: any
  /**
   * Adds the label menu items to the given menu and parent.
   */
  refresh() {
    // Performance tweak: No refresh needed if not visible
    if (this.container.style.width == '0px') {
      return;
    }
    
    this.clear();
    var ui = this.editorUi;
    var graph = ui.editor.graph;
    
    var div = document.createElement('div');
    div.style.whiteSpace = 'nowrap';
    div.style.color = 'rgb(112, 112, 112)';
    div.style.textAlign = 'left';
    div.style.cursor = 'default';
    
    var label = document.createElement('div');
    label.className = 'geFormatSection';
    label.style.textAlign = 'center';
    label.style.fontWeight = 'bold';
    label.style.paddingTop = '8px';
    label.style.fontSize = '13px';
    label.style.borderWidth = '0px 0px 1px 1px';
    label.style.borderStyle = 'solid';
    label.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
    label.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
    label.style.overflow = 'hidden';
    label.style.width = '100%';
    this.container.appendChild(div);
    
    // Prevents text selection
      mxEvent.addListener(label, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
          mxUtils.bind(this, function(evt)
    {
      evt.preventDefault();
    }));
    
    if (graph.isSelectionEmpty())
    {
      mxUtils.write(label, mxResources.get('diagram'));
      label.style.borderLeftWidth = '0px';
      
      // Adds button to hide the format panel since
      // people don't seem to find the toolbar button
      // and the menu item in the format menu
      if (this.showCloseButton)
      {
        var img = document.createElement('img');
        img.setAttribute('border', '0');
        img.setAttribute('src', Dialog.prototype.closeImage);
        img.setAttribute('title', mxResources.get('hide'));
        img.style.position = 'absolute';
        img.style.display = 'block';
        img.style.right = '0px';
        img.style.top = '8px';
        img.style.cursor = 'pointer';
        img.style.marginTop = '1px';
        img.style.marginRight = '17px';
        img.style.border = '1px solid transparent';
        img.style.padding = '1px';
        img.style.opacity = 0.5;
        label.appendChild(img)
        
        mxEvent.addListener(img, 'click', function()
        {
          ui.actions.get('formatPanel').funct();
        });
      }
      
      div.appendChild(label);
      this.panels.push(new DiagramFormatPanel(this, ui, div));
    }
    else if (graph.isEditing())
    {
      mxUtils.write(label, mxResources.get('text'));
      div.appendChild(label);
      this.panels.push(new TextFormatPanel(this, ui, div));
    }
    else
    {
      var containsLabel = this.getSelectionState().containsLabel;
      var currentLabel = null;
      var currentPanel = null;
      
      var addClickHandler = mxUtils.bind(this, function(elt, panel, index)
      {
        var clickHandler = mxUtils.bind(this, function(evt)
        {
          if (currentLabel != elt)
          {
            if (containsLabel)
            {
              this.labelIndex = index;
            }
            else
            {
              this.currentIndex = index;
            }
            
            if (currentLabel != null)
            {
              currentLabel.style.backgroundColor = this.inactiveTabBackgroundColor;
              currentLabel.style.borderBottomWidth = '1px';
            }
    
            currentLabel = elt;
            currentLabel.style.backgroundColor = '';
            currentLabel.style.borderBottomWidth = '0px';
            
            if (currentPanel != panel)
            {
              if (currentPanel != null)
              {
                currentPanel.style.display = 'none';
              }
              
              currentPanel = panel;
              currentPanel.style.display = '';
            }
          }
        });
        
        mxEvent.addListener(elt, 'click', clickHandler);
        
        // Prevents text selection
          mxEvent.addListener(elt, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
              mxUtils.bind(this, function(evt)
          {
          evt.preventDefault();
        }));
        
        if (index == ((containsLabel) ? this.labelIndex : this.currentIndex))
        {
          // Invokes handler directly as a workaround for no click on DIV in KHTML.
          clickHandler();
        }
      });
      
      var idx = 0;

      label.style.backgroundColor = this.inactiveTabBackgroundColor;
      label.style.borderLeftWidth = '1px';
      label.style.cursor = 'pointer';
      label.style.width = (containsLabel) ? '50%' : '33.3%';
      label.style.width = (containsLabel) ? '50%' : '33.3%';
      var label2 = label.cloneNode(false);
      var label3 = label2.cloneNode(false);

      // Workaround for ignored background in IE
      label2.style.backgroundColor = this.inactiveTabBackgroundColor;
      label3.style.backgroundColor = this.inactiveTabBackgroundColor;
      
      // Style
      if (containsLabel)
      {
        label2.style.borderLeftWidth = '0px';
      }
      else
      {
        label.style.borderLeftWidth = '0px';
        mxUtils.write(label, mxResources.get('style'));
        div.appendChild(label);
        
        var stylePanel = div.cloneNode(false);
        stylePanel.style.display = 'none';
        this.panels.push(new StyleFormatPanel(this, ui, stylePanel));
        this.container.appendChild(stylePanel);

        addClickHandler(label, stylePanel, idx++);
      }
      
      // Text
      mxUtils.write(label2, mxResources.get('text'));
      div.appendChild(label2);

      var textPanel = div.cloneNode(false);
      textPanel.style.display = 'none';
      this.panels.push(new TextFormatPanel(this, ui, textPanel));
      this.container.appendChild(textPanel);
      
      // Arrange
      mxUtils.write(label3, mxResources.get('arrange'));
      div.appendChild(label3);

      var arrangePanel = div.cloneNode(false);
      arrangePanel.style.display = 'none';
      this.panels.push(new ArrangePanel(this, ui, arrangePanel));
      this.container.appendChild(arrangePanel);
      
      addClickHandler(label2, textPanel, idx++);
      addClickHandler(label3, arrangePanel, idx++);
    }
  };
}
