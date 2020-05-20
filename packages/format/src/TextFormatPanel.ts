import { BaseFormatPanel } from "./BaseFormatPanel";
import mx from "mx";
const { mxConstants, mxClient, mxResources, mxPoint, mxEvent, mxGraph, mxUtils } = mx

/**
 * Adds the label menu items to the given menu and parent.
 */
export class TextFormatPanel extends BaseFormatPanel {
  constructor(format, editorUi, container) {
    super(format, editorUi, container);
    this.init();
  };

  /**
   * Adds the label menu items to the given menu and parent.
   */
  init() {
    this.container.style.borderBottom = 'none';
    this.addFont(this.container);
  };

  /**
   * Adds the label menu items to the given menu and parent.
   */
  addFont(container) {
    var ui = this.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;
    var ss = this.format.getSelectionState();
    
    var title = this.createTitle(mxResources.get('font'));
    title.style.paddingLeft = '18px';
    title.style.paddingTop = '10px';
    title.style.paddingBottom = '6px';
    container.appendChild(title);

    var stylePanel = this.createPanel();
    stylePanel.style.paddingTop = '2px';
    stylePanel.style.paddingBottom = '2px';
    stylePanel.style.position = 'relative';
    stylePanel.style.marginLeft = '-2px';
    stylePanel.style.borderWidth = '0px';
    stylePanel.className = 'geToolbarContainer';
    
    if (mxClient.IS_QUIRKS)
    {
      stylePanel.style.display = 'block';
    }

    if (graph.cellEditor.isContentEditing())
    {
      var cssPanel = stylePanel.cloneNode();
      
      var cssMenu = this.editorUi.toolbar.addMenu(mxResources.get('style'),
        mxResources.get('style'), true, 'formatBlock', cssPanel, null, true);
      cssMenu.style.color = 'rgb(112, 112, 112)';
      cssMenu.style.whiteSpace = 'nowrap';
      cssMenu.style.overflow = 'hidden';
      cssMenu.style.margin = '0px';
      this.addArrow(cssMenu);
      cssMenu.style.width = '192px';
      cssMenu.style.height = '15px';
      
      var arrow = cssMenu.getElementsByTagName('div')[0];
      arrow.style.cssFloat = 'right';
      container.appendChild(cssPanel);
    }
    
    container.appendChild(stylePanel);
    
    var colorPanel = this.createPanel();
    colorPanel.style.marginTop = '8px';
    colorPanel.style.borderTop = '1px solid #c0c0c0';
    colorPanel.style.paddingTop = '6px';
    colorPanel.style.paddingBottom = '6px';
    
    var fontMenu = this.editorUi.toolbar.addMenu('Helvetica', mxResources.get('fontFamily'),
      true, 'fontFamily', stylePanel, null, true);
    fontMenu.style.color = 'rgb(112, 112, 112)';
    fontMenu.style.whiteSpace = 'nowrap';
    fontMenu.style.overflow = 'hidden';
    fontMenu.style.margin = '0px';
    
    this.addArrow(fontMenu);
    fontMenu.style.width = '192px';
    fontMenu.style.height = '15px';
    
    var stylePanel2 = stylePanel.cloneNode(false);
    stylePanel2.style.marginLeft = '-3px';
    var fontStyleItems = this.editorUi.toolbar.addItems(['bold', 'italic', 'underline'], stylePanel2, true);
    fontStyleItems[0].setAttribute('title', mxResources.get('bold') + ' (' + this.editorUi.actions.get('bold').shortcut + ')');
    fontStyleItems[1].setAttribute('title', mxResources.get('italic') + ' (' + this.editorUi.actions.get('italic').shortcut + ')');
    fontStyleItems[2].setAttribute('title', mxResources.get('underline') + ' (' + this.editorUi.actions.get('underline').shortcut + ')');
    
    var verticalItem = this.editorUi.toolbar.addItems(['vertical'], stylePanel2, true)[0];
    
    if (mxClient.IS_QUIRKS)
    {
      mxUtils.br(container);
    }
    
    container.appendChild(stylePanel2);

    this.styleButtons(fontStyleItems);
    this.styleButtons([verticalItem]);
    
    var stylePanel3 = stylePanel.cloneNode(false);
    stylePanel3.style.marginLeft = '-3px';
    stylePanel3.style.paddingBottom = '0px';
    
    // Helper function to return a wrapper function does not pass any arguments
    var callFn(fn)
    {
      return function()
      {
        return fn();
      };
    };
    
    var left = this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
      (graph.cellEditor.isContentEditing()) ?
      function(evt)
      {
        graph.cellEditor.alignText(mxConstants.ALIGN_LEFT, evt);
      } : callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT])), stylePanel3);
    var center = this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
      (graph.cellEditor.isContentEditing()) ?
      function(evt)
      {
        graph.cellEditor.alignText(mxConstants.ALIGN_CENTER, evt);
      } : callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER])), stylePanel3);
    var right = this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
      (graph.cellEditor.isContentEditing()) ?
      function(evt)
      {
        graph.cellEditor.alignText(mxConstants.ALIGN_RIGHT, evt);
      } : callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT])), stylePanel3);

    this.styleButtons([left, center, right]);
    
    // Quick hack for strikethrough
    // TODO: Add translations and toggle state
    if (graph.cellEditor.isContentEditing())
    {
      var strike = this.editorUi.toolbar.addButton('geSprite-removeformat', mxResources.get('strikethrough'),
        function()
        {
          document.execCommand('strikeThrough', false, null);
        }, stylePanel2);
      this.styleButtons([strike]);

      strike.firstChild.style.background = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PHBhdGggaWQ9ImEiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPjwvZGVmcz48Y2xpcFBhdGggaWQ9ImIiPjx1c2UgeGxpbms6aHJlZj0iI2EiIG92ZXJmbG93PSJ2aXNpYmxlIi8+PC9jbGlwUGF0aD48cGF0aCBjbGlwLXBhdGg9InVybCgjYikiIGZpbGw9IiMwMTAxMDEiIGQ9Ik03LjI0IDguNzVjLS4yNi0uNDgtLjM5LTEuMDMtLjM5LTEuNjcgMC0uNjEuMTMtMS4xNi40LTEuNjcuMjYtLjUuNjMtLjkzIDEuMTEtMS4yOS40OC0uMzUgMS4wNS0uNjMgMS43LS44My42Ni0uMTkgMS4zOS0uMjkgMi4xOC0uMjkuODEgMCAxLjU0LjExIDIuMjEuMzQuNjYuMjIgMS4yMy41NCAxLjY5Ljk0LjQ3LjQuODMuODggMS4wOCAxLjQzLjI1LjU1LjM4IDEuMTUuMzggMS44MWgtMy4wMWMwLS4zMS0uMDUtLjU5LS4xNS0uODUtLjA5LS4yNy0uMjQtLjQ5LS40NC0uNjgtLjItLjE5LS40NS0uMzMtLjc1LS40NC0uMy0uMS0uNjYtLjE2LTEuMDYtLjE2LS4zOSAwLS43NC4wNC0xLjAzLjEzLS4yOS4wOS0uNTMuMjEtLjcyLjM2LS4xOS4xNi0uMzQuMzQtLjQ0LjU1LS4xLjIxLS4xNS40My0uMTUuNjYgMCAuNDguMjUuODguNzQgMS4yMS4zOC4yNS43Ny40OCAxLjQxLjdINy4zOWMtLjA1LS4wOC0uMTEtLjE3LS4xNS0uMjV6TTIxIDEydi0ySDN2Mmg5LjYyYy4xOC4wNy40LjE0LjU1LjIuMzcuMTcuNjYuMzQuODcuNTEuMjEuMTcuMzUuMzYuNDMuNTcuMDcuMi4xMS40My4xMS42OSAwIC4yMy0uMDUuNDUtLjE0LjY2LS4wOS4yLS4yMy4zOC0uNDIuNTMtLjE5LjE1LS40Mi4yNi0uNzEuMzUtLjI5LjA4LS42My4xMy0xLjAxLjEzLS40MyAwLS44My0uMDQtMS4xOC0uMTNzLS42Ni0uMjMtLjkxLS40MmMtLjI1LS4xOS0uNDUtLjQ0LS41OS0uNzUtLjE0LS4zMS0uMjUtLjc2LS4yNS0xLjIxSDYuNGMwIC41NS4wOCAxLjEzLjI0IDEuNTguMTYuNDUuMzcuODUuNjUgMS4yMS4yOC4zNS42LjY2Ljk4LjkyLjM3LjI2Ljc4LjQ4IDEuMjIuNjUuNDQuMTcuOS4zIDEuMzguMzkuNDguMDguOTYuMTMgMS40NC4xMy44IDAgMS41My0uMDkgMi4xOC0uMjhzMS4yMS0uNDUgMS42Ny0uNzljLjQ2LS4zNC44Mi0uNzcgMS4wNy0xLjI3cy4zOC0xLjA3LjM4LTEuNzFjMC0uNi0uMS0xLjE0LS4zMS0xLjYxLS4wNS0uMTEtLjExLS4yMy0uMTctLjMzSDIxeiIvPjwvc3ZnPg==)';
      strike.firstChild.style.backgroundPosition = '2px 2px';
      strike.firstChild.style.backgroundSize = '18px 18px';

      this.styleButtons([strike]);
    }
    
    var top = this.editorUi.toolbar.addButton('geSprite-top', mxResources.get('top'),
      callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP])), stylePanel3);
    var middle = this.editorUi.toolbar.addButton('geSprite-middle', mxResources.get('middle'),
      callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE])), stylePanel3);
    var bottom = this.editorUi.toolbar.addButton('geSprite-bottom', mxResources.get('bottom'),
      callFn(this.editorUi.menus.createStyleChangeFunction([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM])), stylePanel3);
    
    this.styleButtons([top, middle, bottom]);
    
    if (mxClient.IS_QUIRKS)
    {
      mxUtils.br(container);
    }
    
    container.appendChild(stylePanel3);
    
    // Hack for updating UI state below based on current text selection
    // currentTable is the current selected DOM table updated below
    var sub, sup, full, tableWrapper, currentTable, tableCell, tableRow;
    
    if (graph.cellEditor.isContentEditing())
    {
      top.style.display = 'none';
      middle.style.display = 'none';
      bottom.style.display = 'none';
      verticalItem.style.display = 'none';
      
      full = this.editorUi.toolbar.addButton('geSprite-justifyfull', mxResources.get('block'),
        function()
        {
          if (full.style.opacity == 1)
          {
            document.execCommand('justifyfull', false, null);
          }
        }, stylePanel3);
      full.style.marginRight = '9px';
      full.style.opacity = 1;

      this.styleButtons([full,
            sub = this.editorUi.toolbar.addButton('geSprite-subscript',
              mxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)',
        function()
        {
          document.execCommand('subscript', false, null);
        }, stylePanel3), sup = this.editorUi.toolbar.addButton('geSprite-superscript',
          mxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)',
        function()
        {
          document.execCommand('superscript', false, null);
        }, stylePanel3)]);
      sub.style.marginLeft = '9px';
      
      var tmp = stylePanel3.cloneNode(false);
      tmp.style.paddingTop = '4px';
      var btns = [this.editorUi.toolbar.addButton('geSprite-orderedlist', mxResources.get('numberedList'),
          function()
          {
            document.execCommand('insertorderedlist', false, null);
          }, tmp),
        this.editorUi.toolbar.addButton('geSprite-unorderedlist', mxResources.get('bulletedList'),
          function()
          {
            document.execCommand('insertunorderedlist', false, null);
          }, tmp),
        this.editorUi.toolbar.addButton('geSprite-outdent', mxResources.get('decreaseIndent'),
          function()
          {
            document.execCommand('outdent', false, null);
          }, tmp),
        this.editorUi.toolbar.addButton('geSprite-indent', mxResources.get('increaseIndent'),
          function()
          {
            document.execCommand('indent', false, null);
          }, tmp),
        this.editorUi.toolbar.addButton('geSprite-removeformat', mxResources.get('removeFormat'),
          function()
          {
            document.execCommand('removeformat', false, null);
          }, tmp),
        this.editorUi.toolbar.addButton('geSprite-code', mxResources.get('html'),
          function()
          {
            graph.cellEditor.toggleViewMode();
          }, tmp)];
      this.styleButtons(btns);
      btns[btns.length - 2].style.marginLeft = '9px';
      
      if (mxClient.IS_QUIRKS)
      {
        mxUtils.br(container);
        tmp.style.height = '40';
      }
      
      container.appendChild(tmp);
    }
    else
    {
      fontStyleItems[2].style.marginRight = '9px';
      right.style.marginRight = '9px';
    }
    
    // Label position
    var stylePanel4 = stylePanel.cloneNode(false);
    stylePanel4.style.marginLeft = '0px';
    stylePanel4.style.paddingTop = '8px';
    stylePanel4.style.paddingBottom = '4px';
    stylePanel4.style.fontWeight = 'normal';
    
    mxUtils.write(stylePanel4, mxResources.get('position'));
    
    // Adds label position options
    var positionSelect = document.createElement('select');
    positionSelect.style.position = 'absolute';
    positionSelect.style.right = '20px';
    positionSelect.style.width = '97px';
    positionSelect.style.marginTop = '-2px';
    
    var directions = ['topLeft', 'top', 'topRight', 'left', 'center', 'right', 'bottomLeft', 'bottom', 'bottomRight'];
    var lset = {'topLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM],
        'top': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM],
        'topRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM],
        'left': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE],
        'center': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE],
        'right': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE],
        'bottomLeft': [mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP],
        'bottom': [mxConstants.ALIGN_CENTER, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_TOP],
        'bottomRight': [mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP]};

    for (var i = 0; i < directions.length; i++)
    {
      var positionOption = document.createElement('option');
      positionOption.setAttribute('value', directions[i]);
      mxUtils.write(positionOption, mxResources.get(directions[i]));
      positionSelect.appendChild(positionOption);
    }

    stylePanel4.appendChild(positionSelect);
    
    // Writing direction
    var stylePanel5 = stylePanel.cloneNode(false);
    stylePanel5.style.marginLeft = '0px';
    stylePanel5.style.paddingTop = '4px';
    stylePanel5.style.paddingBottom = '4px';
    stylePanel5.style.fontWeight = 'normal';

    mxUtils.write(stylePanel5, mxResources.get('writingDirection'));
    
    // Adds writing direction options
    // LATER: Handle reselect of same option in all selects (change event
    // is not fired for same option so have opened state on click) and
    // handle multiple different styles for current selection
    var dirSelect = document.createElement('select');
    dirSelect.style.position = 'absolute';
    dirSelect.style.right = '20px';
    dirSelect.style.width = '97px';
    dirSelect.style.marginTop = '-2px';

    // NOTE: For automatic we use the value null since automatic
    // requires the text to be non formatted and non-wrapped
    var dirs = ['automatic', 'leftToRight', 'rightToLeft'];
    var dirSet = {'automatic': null,
        'leftToRight': mxConstants.TEXT_DIRECTION_LTR,
        'rightToLeft': mxConstants.TEXT_DIRECTION_RTL};

    for (var i = 0; i < dirs.length; i++)
    {
      var dirOption = document.createElement('option');
      dirOption.setAttribute('value', dirs[i]);
      mxUtils.write(dirOption, mxResources.get(dirs[i]));
      dirSelect.appendChild(dirOption);
    }

    stylePanel5.appendChild(dirSelect);
    
    if (!graph.isEditing())
    {
      container.appendChild(stylePanel4);
      
      mxEvent.addListener(positionSelect, 'change', function(evt)
      {
        graph.getModel().beginUpdate();
        try
        {
          var vals = lset[positionSelect.value];
          
          if (vals != null)
          {
            graph.setCellStyles(mxConstants.STYLE_LABEL_POSITION, vals[0], graph.getSelectionCells());
            graph.setCellStyles(mxConstants.STYLE_VERTICAL_LABEL_POSITION, vals[1], graph.getSelectionCells());
            graph.setCellStyles(mxConstants.STYLE_ALIGN, vals[2], graph.getSelectionCells());
            graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, vals[3], graph.getSelectionCells());
          }
        }
        finally
        {
          graph.getModel().endUpdate();
        }
        
        mxEvent.consume(evt);
      });

      // LATER: Update dir in text editor while editing and update style with label
      // NOTE: The tricky part is handling and passing on the auto value
      container.appendChild(stylePanel5);
      
      mxEvent.addListener(dirSelect, 'change', function(evt)
      {
        graph.setCellStyles(mxConstants.STYLE_TEXT_DIRECTION, dirSet[dirSelect.value], graph.getSelectionCells());
        mxEvent.consume(evt);
      });
    }

    // Font size
    var input = document.createElement('input');
    input.style.textAlign = 'right';
    input.style.marginTop = '4px';
    
    if (!mxClient.IS_QUIRKS)
    {
      input.style.position = 'absolute';
      input.style.right = '32px';
    }
    
    input.style.width = '46px';
    input.style.height = (mxClient.IS_QUIRKS) ? '21px' : '17px';
    stylePanel2.appendChild(input);
    
    // Workaround for font size 4 if no text is selected is update font size below
    // after first character was entered (as the font element is lazy created)
    var pendingFontSize = null;

    var inputUpdate = this.installInputHandler(input, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize, 1, 999, ' pt',
    function(fontSize)
    {
      // IE does not support containsNode
      // KNOWN: Fixes font size issues but bypasses undo
      if (window.getSelection && !mxClient.IS_IE && !mxClient.IS_IE11)
      {
        var selection = window.getSelection();
        var container = (selection.rangeCount > 0) ? selection.getRangeAt(0).commonAncestorContainer :
          graph.cellEditor.textarea;

        function updateSize(elt, ignoreContains)
        {
          if (graph.cellEditor.textarea != null && elt != graph.cellEditor.textarea &&
            graph.cellEditor.textarea.contains(elt) &&
            (ignoreContains || selection.containsNode(elt, true)))
          {
            if (elt.nodeName == 'FONT')
            {
              elt.removeAttribute('size');
              elt.style.fontSize = fontSize + 'px';
            }
            else
            {
              var css = mxUtils.getCurrentStyle(elt);
              
              if (css.fontSize != fontSize + 'px')
              {
                if (mxUtils.getCurrentStyle(elt.parentNode).fontSize != fontSize + 'px')
                {
                  elt.style.fontSize = fontSize + 'px';
                }
                else
                {
                  elt.style.fontSize = '';
                }
              }
            }
          }
        };
        
        // Wraps text node or mixed selection with leading text in a font element
        if (container == graph.cellEditor.textarea ||
          container.nodeType != mxConstants.NODETYPE_ELEMENT)
        {
          document.execCommand('fontSize', false, '1');
        }

        if (container != graph.cellEditor.textarea)
        {
          container = container.parentNode;
        }
        
        if (container != null && container.nodeType == mxConstants.NODETYPE_ELEMENT)
        {
          var elts = container.getElementsByTagName('*');
          updateSize(container);
          
          for (var i = 0; i < elts.length; i++)
          {
            updateSize(elts[i]);
          }
        }

        input.value = fontSize + ' pt';
      }
      else if (window.getSelection || document.selection)
      {
        // Checks selection
        var par = null;
        
        if (document.selection)
        {
          par = document.selection.createRange().parentElement();
        }
        else
        {
          var selection = window.getSelection();
          
          if (selection.rangeCount > 0)
          {
            par = selection.getRangeAt(0).commonAncestorContainer;
          }
        }
        
        // Node.contains does not work for text nodes in IE11
        function isOrContains(container, node)
        {
            while (node != null)
            {
                if (node === container)
                {
                    return true;
                }
                
                node = node.parentNode;
            }
            
            return false;
        };
        
        if (par != null && isOrContains(graph.cellEditor.textarea, par))
        {
          pendingFontSize = fontSize;
          
          // Workaround for can't set font size in px is to change font size afterwards
          document.execCommand('fontSize', false, '4');
          var elts = graph.cellEditor.textarea.getElementsByTagName('font');
          
          for (var i = 0; i < elts.length; i++)
          {
            if (elts[i].getAttribute('size') == '4')
            {
              elts[i].removeAttribute('size');
              elts[i].style.fontSize = pendingFontSize + 'px';
        
              // Overrides fontSize in input with the one just assigned as a workaround
              // for potential fontSize values of parent elements that don't match
              window.setTimeout(function()
              {
                input.value = pendingFontSize + ' pt';
                pendingFontSize = null;
              }, 0);
              
              break;
            }
          }
        }
      }
    }, true);
    
    var stepper = this.createStepper(input, inputUpdate, 1, 10, true, Menus.prototype.defaultFontSize);
    stepper.style.display = input.style.display;
    stepper.style.marginTop = '4px';
    
    if (!mxClient.IS_QUIRKS)
    {
      stepper.style.right = '20px';
    }
    
    stylePanel2.appendChild(stepper);
    
    var arrow = fontMenu.getElementsByTagName('div')[0];
    arrow.style.cssFloat = 'right';
    
    var bgColorApply = null;
    var currentBgColor = '#ffffff';
    
    var fontColorApply = null;
    var currentFontColor = '#000000';
      
    var bgPanel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('backgroundColor'), function()
    {
      return currentBgColor;
    }, function(color)
    {
      document.execCommand('backcolor', false, (color != mxConstants.NONE) ? color : 'transparent');
    }, '#ffffff',
    {
      install: function(apply) { bgColorApply = apply; },
      destroy: function() { bgColorApply = null; }
    }, null, true) : this.createCellColorOption(mxResources.get('backgroundColor'), mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, '#ffffff', null, function(color)
    {
      graph.updateLabelElements(graph.getSelectionCells(), function(elt)
      {
        elt.style.backgroundColor = null;
      });
    });
    bgPanel.style.fontWeight = 'bold';

    var borderPanel = this.createCellColorOption(mxResources.get('borderColor'), mxConstants.STYLE_LABEL_BORDERCOLOR, '#000000');
    borderPanel.style.fontWeight = 'bold';
    
    var panel = (graph.cellEditor.isContentEditing()) ? this.createColorOption(mxResources.get('fontColor'), function()
    {
      return currentFontColor;
    }, function(color)
    {
      if (mxClient.IS_FF)
      {
        // Workaround for Firefox that adds the font element around
        // anchor elements which ignore inherited colors is to move
        // the font element inside anchor elements
        var tmp = graph.cellEditor.textarea.getElementsByTagName('font');
        var oldFonts = [];

        for (var i = 0; i < tmp.length; i++)
        {
          oldFonts.push(
          {
            node: tmp[i],
            color: tmp[i].getAttribute('color')
          });
        }

        document.execCommand('forecolor', false, (color != mxConstants.NONE) ?
          color : 'transparent');

        // Finds the new or changed font element
        var newFonts = graph.cellEditor.textarea.getElementsByTagName('font');

        for (var i = 0; i < newFonts.length; i++)
        {
          if (i >= oldFonts.length || newFonts[i] != oldFonts[i].node ||
            (newFonts[i] == oldFonts[i].node &&
              newFonts[i].getAttribute('color') != oldFonts[i].color))
          {
            var child = newFonts[i].firstChild;

            // Moves the font element to inside the anchor element and adopts all children
            if (child != null && child.nodeName == 'A' && child.nextSibling ==
              null &&
              child.firstChild != null)
            {
              var parent = newFonts[i].parentNode;
              parent.insertBefore(child, newFonts[i]);
              var tmp = child.firstChild;

              while (tmp != null)
              {
                var next = tmp.nextSibling;
                newFonts[i].appendChild(tmp);
                tmp = next;
              }

              child.appendChild(newFonts[i]);
            }

            break;
          }
        }
      }
      else
      {
        document.execCommand('forecolor', false, (color != mxConstants.NONE) ?
          color : 'transparent');
      }
    }, '#000000',
    {
      install: function(apply) { fontColorApply = apply; },
      destroy: function() { fontColorApply = null; }
    }, null, true) : this.createCellColorOption(mxResources.get('fontColor'), mxConstants.STYLE_FONTCOLOR, '#000000', function(color)
    {
      if (color == null || color == mxConstants.NONE)
      {
        bgPanel.style.display = 'none';
      }
      else
      {
        bgPanel.style.display = '';
      }
      
      borderPanel.style.display = bgPanel.style.display;
    }, function(color)
    {
      if (color == null || color == mxConstants.NONE)
      {
        graph.setCellStyles(mxConstants.STYLE_NOLABEL, '1', graph.getSelectionCells());
      }
      else
      {
        graph.setCellStyles(mxConstants.STYLE_NOLABEL, null, graph.getSelectionCells());
      }

      graph.updateLabelElements(graph.getSelectionCells(), function(elt)
      {
        elt.removeAttribute('color');
        elt.style.color = null;
      });
    });
    panel.style.fontWeight = 'bold';
    
    colorPanel.appendChild(panel);
    colorPanel.appendChild(bgPanel);
    
    if (!graph.cellEditor.isContentEditing())
    {
      colorPanel.appendChild(borderPanel);
    }
    
    container.appendChild(colorPanel);

    var extraPanel = this.createPanel();
    extraPanel.style.paddingTop = '2px';
    extraPanel.style.paddingBottom = '4px';
    
    // LATER: Fix toggle using '' instead of 'null'
    var wwOpt = this.createCellOption(mxResources.get('wordWrap'), mxConstants.STYLE_WHITE_SPACE, null, 'wrap', 'null', null, null, true);
    wwOpt.style.fontWeight = 'bold';
    
    // Word wrap in edge labels only supported via labelWidth style
    if (!ss.containsLabel && !ss.autoSize && ss.edges.length == 0)
    {
      extraPanel.appendChild(wwOpt);
    }
    
    // Delegates switch of style to formattedText action as it also convertes newlines
    var htmlOpt = this.createCellOption(mxResources.get('formattedText'), 'html', '0',
      null, null, null, ui.actions.get('formattedText'));
    htmlOpt.style.fontWeight = 'bold';
    extraPanel.appendChild(htmlOpt);
    
    var spacingPanel = this.createPanel();
    spacingPanel.style.paddingTop = '10px';
    spacingPanel.style.paddingBottom = '28px';
    spacingPanel.style.fontWeight = 'normal';
    
    var span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.width = '70px';
    span.style.marginTop = '0px';
    span.style.fontWeight = 'bold';
    mxUtils.write(span, mxResources.get('spacing'));
    spacingPanel.appendChild(span);

    var topUpdate, globalUpdate, leftUpdate, bottomUpdate, rightUpdate;
    var topSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function()
    {
      topUpdate.apply(this, arguments);
    });
    var globalSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function()
    {
      globalUpdate.apply(this, arguments);
    });

    mxUtils.br(spacingPanel);
    this.addLabel(spacingPanel, mxResources.get('top'), 91);
    this.addLabel(spacingPanel, mxResources.get('global'), 20);
    mxUtils.br(spacingPanel);
    mxUtils.br(spacingPanel);

    var leftSpacing = this.addUnitInput(spacingPanel, 'pt', 162, 44, function()
    {
      leftUpdate.apply(this, arguments);
    });
    var bottomSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function()
    {
      bottomUpdate.apply(this, arguments);
    });
    var rightSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function()
    {
      rightUpdate.apply(this, arguments);
    });

    mxUtils.br(spacingPanel);
    this.addLabel(spacingPanel, mxResources.get('left'), 162);
    this.addLabel(spacingPanel, mxResources.get('bottom'), 91);
    this.addLabel(spacingPanel, mxResources.get('right'), 20);
    
    if (!graph.cellEditor.isContentEditing())
    {
      container.appendChild(extraPanel);
      container.appendChild(this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_TEXT_OPACITY));
      container.appendChild(spacingPanel);
    }
    else
    {
      var selState = null;
      var lineHeightInput = null;
      
      container.appendChild(this.createRelativeOption(mxResources.get('lineheight'), null, null, function(input)
      {
        var value = (input.value == '') ? 120 : parseInt(input.value);
        value = Math.max(0, (isNaN(value)) ? 120 : value);

        if (selState != null)
        {
          graph.cellEditor.restoreSelection(selState);
          selState = null;
        }
        
        var selectedElement = graph.getSelectedElement();
        var node = selectedElement;
        
        while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
        {
          node = node.parentNode;
        }
        
        if (node != null && node == graph.cellEditor.textarea && graph.cellEditor.textarea.firstChild != null)
        {
          if (graph.cellEditor.textarea.firstChild.nodeName != 'P')
          {
            graph.cellEditor.textarea.innerHTML = '<p>' + graph.cellEditor.textarea.innerHTML + '</p>';
          }
          
          node = graph.cellEditor.textarea.firstChild;
        }
        
        if (node != null && graph.cellEditor.textarea != null && node != graph.cellEditor.textarea &&
          graph.cellEditor.textarea.contains(node))
        {
          node.style.lineHeight = value + '%';
        }
        
        input.value = value + ' %';
      }, function(input)
      {
        // Used in CSS handler to update current value
        lineHeightInput = input;
        
        // KNOWN: Arrow up/down clear selection text in quirks/IE 8
        // Text size via arrow button limits to 16 in IE11. Why?
        mxEvent.addListener(input, 'mousedown', function()
        {
          if (document.activeElement == graph.cellEditor.textarea)
          {
            selState = graph.cellEditor.saveSelection();
          }
        });
        
        mxEvent.addListener(input, 'touchstart', function()
        {
          if (document.activeElement == graph.cellEditor.textarea)
          {
            selState = graph.cellEditor.saveSelection();
          }
        });
        
        input.value = '120 %';
      }));
      
      var insertPanel = stylePanel.cloneNode(false);
      insertPanel.style.paddingLeft = '0px';
      var insertBtns = this.editorUi.toolbar.addItems(['link', 'image'], insertPanel, true);

      var btns = [
              this.editorUi.toolbar.addButton('geSprite-horizontalrule', mxResources.get('insertHorizontalRule'),
          function()
          {
            document.execCommand('inserthorizontalrule', false);
          }, insertPanel),				
          this.editorUi.toolbar.addMenuFunctionInContainer(insertPanel, 'geSprite-table', mxResources.get('table'), false, mxUtils.bind(this, function(menu)
          {
            this.editorUi.menus.addInsertTableItem(menu);
          }))];
      this.styleButtons(insertBtns);
      this.styleButtons(btns);
      
      var wrapper2 = this.createPanel();
      wrapper2.style.paddingTop = '10px';
      wrapper2.style.paddingBottom = '10px';
      wrapper2.appendChild(this.createTitle(mxResources.get('insert')));
      wrapper2.appendChild(insertPanel);
      container.appendChild(wrapper2);
      
      if (mxClient.IS_QUIRKS)
      {
        wrapper2.style.height = '70';
      }
      
      var tablePanel = stylePanel.cloneNode(false);
      tablePanel.style.paddingLeft = '0px';
      
      var btns = [
              this.editorUi.toolbar.addButton('geSprite-insertcolumnbefore', mxResources.get('insertColumnBefore'),
            mxUtils.bind(this, function()
          {
            try
            {
                  if (currentTable != null)
                  {
                    graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex : 0);
                  }
            }
            catch (e)
            {
              this.editorUi.handleError(e);
            }
          }), tablePanel),
          this.editorUi.toolbar.addButton('geSprite-insertcolumnafter', mxResources.get('insertColumnAfter'),
          mxUtils.bind(this, function()
          {
            try
            {
              if (currentTable != null)
                  {
                graph.insertColumn(currentTable, (tableCell != null) ? tableCell.cellIndex + 1 : -1);
                  }
            }
            catch (e)
            {
              this.editorUi.handleError(e);
            }
          }), tablePanel),
          this.editorUi.toolbar.addButton('geSprite-deletecolumn', mxResources.get('deleteColumn'),
          mxUtils.bind(this, function()
          {
            try
            {
              if (currentTable != null && tableCell != null)
              {
                graph.deleteColumn(currentTable, tableCell.cellIndex);
              }
            }
            catch (e)
            {
              this.editorUi.handleError(e);
            }
          }), tablePanel),
          this.editorUi.toolbar.addButton('geSprite-insertrowbefore', mxResources.get('insertRowBefore'),
          mxUtils.bind(this, function()
          {
            try
            {
              if (currentTable != null && tableRow != null)
              {
                graph.insertRow(currentTable, tableRow.sectionRowIndex);
              }
            }
            catch (e)
            {
              this.editorUi.handleError(e);
            }
          }), tablePanel),
          this.editorUi.toolbar.addButton('geSprite-insertrowafter', mxResources.get('insertRowAfter'),
          mxUtils.bind(this, function()
          {
            try
            {
              if (currentTable != null && tableRow != null)
              {
                graph.insertRow(currentTable, tableRow.sectionRowIndex + 1);
              }
            }
            catch (e)
            {
              this.editorUi.handleError(e);
            }
          }), tablePanel),
          this.editorUi.toolbar.addButton('geSprite-deleterow', mxResources.get('deleteRow'),
          mxUtils.bind(this, function()
          {
            try
            {
              if (currentTable != null && tableRow != null)
              {
                graph.deleteRow(currentTable, tableRow.sectionRowIndex);
              }
            }
            catch (e)
            {
              this.editorUi.handleError(e);
            }
          }), tablePanel)];
      this.styleButtons(btns);
      btns[2].style.marginRight = '9px';
      
      var wrapper3 = this.createPanel();
      wrapper3.style.paddingTop = '10px';
      wrapper3.style.paddingBottom = '10px';
      wrapper3.appendChild(this.createTitle(mxResources.get('table')));
      wrapper3.appendChild(tablePanel);

      if (mxClient.IS_QUIRKS)
      {
        mxUtils.br(container);
        wrapper3.style.height = '70';
      }
      
      var tablePanel2 = stylePanel.cloneNode(false);
      tablePanel2.style.paddingLeft = '0px';
      
      var btns = [
              this.editorUi.toolbar.addButton('geSprite-strokecolor', mxResources.get('borderColor'),
          mxUtils.bind(this, function(evt)
          {
            if (currentTable != null)
            {
              // Converts rgb(r,g,b) values
              var color = currentTable.style.borderColor.replace(
                    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                    function($0, $1, $2, $3) {
                        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                    });
              this.editorUi.pickColor(color, function(newColor)
              {
                var targetElt = (tableCell != null && (evt == null || !mxEvent.isShiftDown(evt))) ? tableCell : currentTable;
                
                graph.processElements(targetElt, function(elt)
                {
                  elt.style.border = null;
                });
                
                if (newColor == null || newColor == mxConstants.NONE)
                {
                  targetElt.removeAttribute('border');
                  targetElt.style.border = '';
                  targetElt.style.borderCollapse = '';
                }
                else
                {
                  targetElt.setAttribute('border', '1');
                  targetElt.style.border = '1px solid ' + newColor;
                  targetElt.style.borderCollapse = 'collapse';
                }
              });
            }
          }), tablePanel2),
          this.editorUi.toolbar.addButton('geSprite-fillcolor', mxResources.get('backgroundColor'),
          mxUtils.bind(this, function(evt)
          {
            // Converts rgb(r,g,b) values
            if (currentTable != null)
            {
              var color = currentTable.style.backgroundColor.replace(
                    /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                    function($0, $1, $2, $3) {
                        return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                    });
              this.editorUi.pickColor(color, function(newColor)
              {
                var targetElt = (tableCell != null && (evt == null || !mxEvent.isShiftDown(evt))) ? tableCell : currentTable;
                
                graph.processElements(targetElt, function(elt)
                {
                  elt.style.backgroundColor = null;
                });
                
                if (newColor == null || newColor == mxConstants.NONE)
                {
                  targetElt.style.backgroundColor = '';
                }
                else
                {
                  targetElt.style.backgroundColor = newColor;
                }
              });
            }
          }), tablePanel2),
          this.editorUi.toolbar.addButton('geSprite-fit', mxResources.get('spacing'),
          function()
          {
            if (currentTable != null)
            {
              var value = currentTable.getAttribute('cellPadding') || 0;
              
              var dlg = new FilenameDialog(ui, value, mxResources.get('apply'), mxUtils.bind(this, function(newValue)
              {
                if (newValue != null && newValue.length > 0)
                {
                  currentTable.setAttribute('cellPadding', newValue);
                }
                else
                {
                  currentTable.removeAttribute('cellPadding');
                }
              }), mxResources.get('spacing'));
              ui.showDialog(dlg.container, 300, 80, true, true);
              dlg.init();
            }
          }, tablePanel2),
          this.editorUi.toolbar.addButton('geSprite-left', mxResources.get('left'),
          function()
          {
            if (currentTable != null)
            {
              currentTable.setAttribute('align', 'left');
            }
          }, tablePanel2),
          this.editorUi.toolbar.addButton('geSprite-center', mxResources.get('center'),
          function()
          {
            if (currentTable != null)
            {
              currentTable.setAttribute('align', 'center');
            }
          }, tablePanel2),
          this.editorUi.toolbar.addButton('geSprite-right', mxResources.get('right'),
          function()
          {
            if (currentTable != null)
            {
              currentTable.setAttribute('align', 'right');
            }
          }, tablePanel2)];
      this.styleButtons(btns);
      btns[2].style.marginRight = '9px';
      
      if (mxClient.IS_QUIRKS)
      {
        mxUtils.br(wrapper3);
        mxUtils.br(wrapper3);
      }
      
      wrapper3.appendChild(tablePanel2);
      container.appendChild(wrapper3);
      
      tableWrapper = wrapper3;
    }
    
    function setSelected(elt, selected)
    {
      if (mxClient.IS_IE && (mxClient.IS_QUIRKS || document.documentMode < 10))
      {
        elt.style.filter = (selected) ? 'progid:DXImageTransform.Microsoft.Gradient('+
                'StartColorStr=\'#c5ecff\', EndColorStr=\'#87d4fb\', GradientType=0)' : '';
      }
      else
      {
        elt.style.backgroundImage = (selected) ? 'linear-gradient(#c5ecff 0px,#87d4fb 100%)' : '';
      }
    };
    
    var listener = mxUtils.bind(this, function(sender, evt, force)
    {
      ss = this.format.getSelectionState();
      var fontStyle = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSTYLE, 0);
      setSelected(fontStyleItems[0], (fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD);
      setSelected(fontStyleItems[1], (fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC);
      setSelected(fontStyleItems[2], (fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE);
      fontMenu.firstChild.nodeValue = mxUtils.getValue(ss.style, mxConstants.STYLE_FONTFAMILY, Menus.prototype.defaultFont);

      setSelected(verticalItem, mxUtils.getValue(ss.style, mxConstants.STYLE_HORIZONTAL, '1') == '0');
      
      if (force || document.activeElement != input)
      {
        var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_FONTSIZE, Menus.prototype.defaultFontSize));
        input.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
      }
      
      var align = mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
      setSelected(left, align == mxConstants.ALIGN_LEFT);
      setSelected(center, align == mxConstants.ALIGN_CENTER);
      setSelected(right, align == mxConstants.ALIGN_RIGHT);
      
      var valign = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
      setSelected(top, valign == mxConstants.ALIGN_TOP);
      setSelected(middle, valign == mxConstants.ALIGN_MIDDLE);
      setSelected(bottom, valign == mxConstants.ALIGN_BOTTOM);
      
      var pos = mxUtils.getValue(ss.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
      var vpos = mxUtils.getValue(ss.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
      
      if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_TOP)
      {
        positionSelect.value = 'topLeft';
      }
      else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_TOP)
      {
        positionSelect.value = 'top';
      }
      else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_TOP)
      {
        positionSelect.value = 'topRight';
      }
      else if (pos == mxConstants.ALIGN_LEFT && vpos == mxConstants.ALIGN_BOTTOM)
      {
        positionSelect.value = 'bottomLeft';
      }
      else if (pos == mxConstants.ALIGN_CENTER && vpos == mxConstants.ALIGN_BOTTOM)
      {
        positionSelect.value = 'bottom';
      }
      else if (pos == mxConstants.ALIGN_RIGHT && vpos == mxConstants.ALIGN_BOTTOM)
      {
        positionSelect.value = 'bottomRight';
      }
      else if (pos == mxConstants.ALIGN_LEFT)
      {
        positionSelect.value = 'left';
      }
      else if (pos == mxConstants.ALIGN_RIGHT)
      {
        positionSelect.value = 'right';
      }
      else
      {
        positionSelect.value = 'center';
      }
      
      var dir = mxUtils.getValue(ss.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);
      
      if (dir == mxConstants.TEXT_DIRECTION_RTL)
      {
        dirSelect.value = 'rightToLeft';
      }
      else if (dir == mxConstants.TEXT_DIRECTION_LTR)
      {
        dirSelect.value = 'leftToRight';
      }
      else if (dir == mxConstants.TEXT_DIRECTION_AUTO)
      {
        dirSelect.value = 'automatic';
      }
      
      if (force || document.activeElement != globalSpacing)
      {
        var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING, 2));
        globalSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
      }

      if (force || document.activeElement != topSpacing)
      {
        var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_TOP, 0));
        topSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
      }
      
      if (force || document.activeElement != rightSpacing)
      {
        var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_RIGHT, 0));
        rightSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
      }
      
      if (force || document.activeElement != bottomSpacing)
      {
        var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_BOTTOM, 0));
        bottomSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
      }
      
      if (force || document.activeElement != leftSpacing)
      {
        var tmp = parseFloat(mxUtils.getValue(ss.style, mxConstants.STYLE_SPACING_LEFT, 0));
        leftSpacing.value = (isNaN(tmp)) ? '' : tmp  + ' pt';
      }
    });

    globalUpdate = this.installInputHandler(globalSpacing, mxConstants.STYLE_SPACING, 2, -999, 999, ' pt');
    topUpdate = this.installInputHandler(topSpacing, mxConstants.STYLE_SPACING_TOP, 0, -999, 999, ' pt');
    rightUpdate = this.installInputHandler(rightSpacing, mxConstants.STYLE_SPACING_RIGHT, 0, -999, 999, ' pt');
    bottomUpdate = this.installInputHandler(bottomSpacing, mxConstants.STYLE_SPACING_BOTTOM, 0, -999, 999, ' pt');
    leftUpdate = this.installInputHandler(leftSpacing, mxConstants.STYLE_SPACING_LEFT, 0, -999, 999, ' pt');

    this.addKeyHandler(input, listener);
    this.addKeyHandler(globalSpacing, listener);
    this.addKeyHandler(topSpacing, listener);
    this.addKeyHandler(rightSpacing, listener);
    this.addKeyHandler(bottomSpacing, listener);
    this.addKeyHandler(leftSpacing, listener);

    graph.getModel().addListener(mxEvent.CHANGE, listener);
    this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
    listener();
    
    if (graph.cellEditor.isContentEditing())
    {
      var updating = false;
      
      var updateCssHandler()
      {
        if (!updating)
        {
          updating = true;
        
          window.setTimeout(function()
          {
            var selectedElement = graph.getSelectedElement();
            var node = selectedElement;

            while (node != null && node.nodeType != mxConstants.NODETYPE_ELEMENT)
            {
              node = node.parentNode;
            }

            if (node != null)
            {
              // Workaround for commonAncestor on range in IE11 returning parent of common ancestor
              if (node == graph.cellEditor.textarea && graph.cellEditor.textarea.children.length == 1 &&
                graph.cellEditor.textarea.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT)
              {
                node = graph.cellEditor.textarea.firstChild;
              }
              
              function getRelativeLineHeight(fontSize, css, elt)
              {
                if (elt.style != null && css != null)
                {
                  var lineHeight = css.lineHeight
                  
                  if (elt.style.lineHeight != null && elt.style.lineHeight.substring(elt.style.lineHeight.length - 1) == '%')
                  {
                    return parseInt(elt.style.lineHeight) / 100;
                  }
                  else
                  {
                    return (lineHeight.substring(lineHeight.length - 2) == 'px') ?
                        parseFloat(lineHeight) / fontSize : parseInt(lineHeight);
                  }
                }
                else
                {
                  return '';
                }
              };
              
              function getAbsoluteFontSize(css)
              {
                var fontSize = (css != null) ? css.fontSize : null;
                  
                if (fontSize != null && fontSize.substring(fontSize.length - 2) == 'px')
                {
                  return parseFloat(fontSize);
                }
                else
                {
                  return mxConstants.DEFAULT_FONTSIZE;
                }
              };
              
              var css = mxUtils.getCurrentStyle(node);
              var fontSize = getAbsoluteFontSize(css);
              var lineHeight = getRelativeLineHeight(fontSize, css, node);

              // Finds common font size
              var elts = node.getElementsByTagName('*');

              // IE does not support containsNode
              if (elts.length > 0 && window.getSelection && !mxClient.IS_IE && !mxClient.IS_IE11)
              {
                var selection = window.getSelection();

                for (var i = 0; i < elts.length; i++)
                {
                  if (selection.containsNode(elts[i], true))
                  {
                    temp = mxUtils.getCurrentStyle(elts[i]);
                    fontSize = Math.max(getAbsoluteFontSize(temp), fontSize);
                    var lh = getRelativeLineHeight(fontSize, temp, elts[i]);
                    
                    if (lh != lineHeight || isNaN(lh))
                    {
                      lineHeight = '';
                    }
                  }
                }
              }
              
              function hasParentOrOnlyChild(name)
              {
                if (graph.getParentByName(node, name, graph.cellEditor.textarea) != null)
                {
                  return true;
                }
                else
                {
                  var child = node;
                  
                  while (child != null && child.childNodes.length == 1)
                  {
                    child = child.childNodes[0];
                    
                    if (child.nodeName == name)
                    {
                      return true;
                    }
                  }
                }
                
                return false;
              };
              
              function isEqualOrPrefixed(str, value)
              {
                if (str != null && value != null)
                {
                  if (str == value)
                  {
                    return true;
                  }
                  else if (str.length > value.length + 1)
                  {
                    return str.substring(str.length - value.length - 1, str.length) == '-' + value;
                  }
                }
                
                return false;
              };
              
              if (css != null)
              {
                setSelected(fontStyleItems[0], css.fontWeight == 'bold' ||
                  css.fontWeight > 400 || hasParentOrOnlyChild('B') ||
                  hasParentOrOnlyChild('STRONG'));
                setSelected(fontStyleItems[1], css.fontStyle == 'italic' ||
                  hasParentOrOnlyChild('I') || hasParentOrOnlyChild('EM'));
                setSelected(fontStyleItems[2], hasParentOrOnlyChild('U'));
                setSelected(sup, hasParentOrOnlyChild('SUP'));
                setSelected(sub, hasParentOrOnlyChild('SUB'));
                
                if (!graph.cellEditor.isTableSelected())
                {
                  var align = graph.cellEditor.align || mxUtils.getValue(ss.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);

                  if (isEqualOrPrefixed(css.textAlign, 'justify'))
                  {
                    setSelected(full, isEqualOrPrefixed(css.textAlign, 'justify'));
                    setSelected(left, false);
                    setSelected(center, false);
                    setSelected(right, false);
                  }
                  else
                  {
                    setSelected(full, false);
                    setSelected(left, align == mxConstants.ALIGN_LEFT);
                    setSelected(center, align == mxConstants.ALIGN_CENTER);
                    setSelected(right, align == mxConstants.ALIGN_RIGHT);
                  }
                }
                else
                {
                  setSelected(full, isEqualOrPrefixed(css.textAlign, 'justify'));
                  setSelected(left, isEqualOrPrefixed(css.textAlign, 'left'));
                  setSelected(center, isEqualOrPrefixed(css.textAlign, 'center'));
                  setSelected(right, isEqualOrPrefixed(css.textAlign, 'right'));
                }
                
                currentTable = graph.getParentByName(node, 'TABLE', graph.cellEditor.textarea);
                tableRow = (currentTable == null) ? null : graph.getParentByName(node, 'TR', currentTable);
                tableCell = (currentTable == null) ? null : graph.getParentByNames(node, ['TD', 'TH'], currentTable);
                tableWrapper.style.display = (currentTable != null) ? '' : 'none';
                
                if (document.activeElement != input)
                {
                  if (node.nodeName == 'FONT' && node.getAttribute('size') == '4' &&
                    pendingFontSize != null)
                  {
                    node.removeAttribute('size');
                    node.style.fontSize = pendingFontSize + ' pt';
                    pendingFontSize = null;
                  }
                  else
                  {
                    input.value = (isNaN(fontSize)) ? '' : fontSize + ' pt';
                  }
                  
                  var lh = parseFloat(lineHeight);
                  
                  if (!isNaN(lh))
                  {
                    lineHeightInput.value = Math.round(lh * 100) + ' %';
                  }
                  else
                  {
                    lineHeightInput.value = '100 %';
                  }
                }
                
                // Converts rgb(r,g,b) values
                var color = css.color.replace(
                      /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                      function($0, $1, $2, $3) {
                          return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                      });
                var color2 = css.backgroundColor.replace(
                      /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                      function($0, $1, $2, $3) {
                          return "#" + ("0"+Number($1).toString(16)).substr(-2) + ("0"+Number($2).toString(16)).substr(-2) + ("0"+Number($3).toString(16)).substr(-2);
                      });
                
                // Updates the color picker for the current font
                if (fontColorApply != null)
                {
                  if (color.charAt(0) == '#')
                  {
                    currentFontColor = color;
                  }
                  else
                  {
                    currentFontColor = '#000000';
                  }
                  
                  fontColorApply(currentFontColor, true);
                }
                
                if (bgColorApply != null)
                {
                  if (color2.charAt(0) == '#')
                  {
                    currentBgColor = color2;
                  }
                  else
                  {
                    currentBgColor = null;
                  }
                  
                  bgColorApply(currentBgColor, true);
                }
                
                // Workaround for firstChild is null or not an object
                // in the log which seems to be IE8- only / 29.01.15
                if (fontMenu.firstChild != null)
                {
                  // Strips leading and trailing quotes
                  var ff = css.fontFamily;
                  
                  if (ff.charAt(0) == '\'')
                  {
                    ff = ff.substring(1);
                  }
                  
                  if (ff.charAt(ff.length - 1) == '\'')
                  {
                    ff = ff.substring(0, ff.length - 1);
                  }

                  if (ff.charAt(0) == '"')
                  {
                    ff = ff.substring(1);
                  }
                  
                  if (ff.charAt(ff.length - 1) == '"')
                  {
                    ff = ff.substring(0, ff.length - 1);
                  }
                  
                  fontMenu.firstChild.nodeValue = ff;
                }
              }
            }
            
            updating = false;
          }, 0);
        }
      };
      
      if (mxClient.IS_FF || mxClient.IS_EDGE || mxClient.IS_IE || mxClient.IS_IE11)
      {
        mxEvent.addListener(graph.cellEditor.textarea, 'DOMSubtreeModified', updateCssHandler);
      }
      
      mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler);
      mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
      mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
      mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
      this.listeners.push({destroy: function()
      {
        // No need to remove listener since textarea is destroyed after edit
      }});
      updateCssHandler();
    }

    return container;
  };
}