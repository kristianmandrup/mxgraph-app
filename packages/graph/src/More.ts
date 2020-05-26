		/**
		 * HTML in-place editor
		 */
		mxCellEditor.prototype.isContentEditing()
		{
			var state = this.graph.view.getState(this.editingCell);
			
			return state != null && state.style['html'] == 1;
		};

		/**
		 * Returns true if all selected text is inside a table element.
		 */
		mxCellEditor.prototype.isTableSelected()
		{
			return this.graph.getParentByName(
				this.graph.getSelectedElement(),
				'TABLE', this.textarea) != null;
		};
		
		/**
		 * Sets the alignment of the current selected cell. This sets the
		 * alignment in the cell style, removes all alignment within the
		 * text and invokes the built-in alignment function.
		 * 
		 * Only the built-in function is invoked if shift is pressed or
		 * if table cells are selected and shift is not pressed.
		 */
		mxCellEditor.prototype.alignText(align, evt)
		{
			var shiftPressed = evt != null && mxEvent.isShiftDown(evt);
			
			if (shiftPressed || (window.getSelection != null && window.getSelection().containsNode != null))
			{
				var allSelected = true;
				
				this.graph.processElements(this.textarea, function(node)
				{
					if (shiftPressed || window.getSelection().containsNode(node, true))
					{
						node.removeAttribute('align');
						node.style.textAlign = null;
					}
					else
					{
						allSelected = false;
					}
				});
				
				if (allSelected)
				{
					this.graph.cellEditor.setAlign(align);
				}
			}
			
			document.execCommand('justify' + align.toLowerCase(), false, null);
		};
		
		/**
		 * Creates the keyboard event handler for the current graph and history.
		 */
		mxCellEditor.prototype.saveSelection()
		{
		    if (window.getSelection)
		    {
		        var sel = window.getSelection();
		        
		        if (sel.getRangeAt && sel.rangeCount)
		        {
		            var ranges = [];
		            
		            for (var i = 0, len = sel.rangeCount; i < len; ++i)
		            {
		                ranges.push(sel.getRangeAt(i));
		            }
		            
		            return ranges;
		        }
		    }
		    else if (document.selection && document.selection.createRange)
		    {
		        return document.selection.createRange();
		    }
		    
		    return null;
		};
	
		/**
		 * Creates the keyboard event handler for the current graph and history.
		 */
		mxCellEditor.prototype.restoreSelection(savedSel)
		{
			try
			{
				if (savedSel)
				{
					if (window.getSelection)
					{
						sel = window.getSelection();
						sel.removeAllRanges();
		
						for (var i = 0, len = savedSel.length; i < len; ++i)
						{
							sel.addRange(savedSel[i]);
						}
					}
					else if (document.selection && savedSel.select)
					{
						savedSel.select();
					}
				}
			}
			catch (e)
			{
				// ignore
			}
		};
	
		/**
		 * Handling of special nl2Br style for not converting newlines to breaks in HTML labels.
		 * NOTE: Since it's easier to set this when the label is created we assume that it does
		 * not change during the lifetime of the mxText instance.
		 */
		var mxCellRendererInitializeLabel = mxCellRenderer.prototype.initializeLabel;
		mxCellRenderer.prototype.initializeLabel(state)
		{
			if (state.text != null)
			{
				state.text.replaceLinefeeds = mxUtils.getValue(state.style, 'nl2Br', '1') != '0';
			}
			
			mxCellRendererInitializeLabel.apply(this, arguments);
		};
	
		var mxConstraintHandlerUpdate = mxConstraintHandler.prototype.update;
		mxConstraintHandler.prototype.update(me, source)
		{
			if (this.isKeepFocusEvent(me) || !mxEvent.isAltDown(me.getEvent()))
			{
				mxConstraintHandlerUpdate.apply(this, arguments);
			}
			else
			{
				this.reset();
			}
		};
	
		/**
		 * No dashed shapes.
		 */
		mxGuide.prototype.createGuideShape(horizontal)
		{
			var guide = new mxPolyline([], mxConstants.GUIDE_COLOR, mxConstants.GUIDE_STROKEWIDTH);
			
			return guide;
		};
		
		/**
		 * HTML in-place editor
		 */
		mxCellEditor.prototype.escapeCancelsEditing = false;
		
		var mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
		mxCellEditor.prototype.startEditing(cell, trigger)
		{
			mxCellEditorStartEditing.apply(this, arguments);
			
			// Overrides class in case of HTML content to add
			// dashed borders for divs and table cells
			var state = this.graph.view.getState(cell);
	
			if (state != null && state.style['html'] == 1)
			{
				this.textarea.className = 'mxCellEditor geContentEditable';
			}
			else
			{
				this.textarea.className = 'mxCellEditor mxPlainTextEditor';
			}
			
			// Toggles markup vs wysiwyg mode
			this.codeViewMode = false;
			
			// Stores current selection range when switching between markup and code
			this.switchSelectionState = null;
			
			// Selects editing cell
			this.graph.setSelectionCell(cell);

			// Enables focus outline for edges and edge labels
			var parent = this.graph.getModel().getParent(cell);
			var geo = this.graph.getCellGeometry(cell);
			
			if ((this.graph.getModel().isEdge(parent) && geo != null && geo.relative) ||
				this.graph.getModel().isEdge(cell))
			{
				// Quirks does not support outline at all so use border instead
				if (mxClient.IS_QUIRKS)
				{
					this.textarea.style.border = 'gray dotted 1px';
				}
				// IE>8 and FF on Windows uses outline default of none
				else if (mxClient.IS_IE || mxClient.IS_IE11 || (mxClient.IS_FF && mxClient.IS_WIN))
				{
					this.textarea.style.outline = 'gray dotted 1px';
				}
				else
				{
					this.textarea.style.outline = '';
				}
			}
			else if (mxClient.IS_QUIRKS)
			{
				this.textarea.style.outline = 'none';
				this.textarea.style.border = '';
			}
		}

		/**
		 * HTML in-place editor
		 */
		var cellEditorInstallListeners = mxCellEditor.prototype.installListeners;
		mxCellEditor.prototype.installListeners(elt)
		{
			cellEditorInstallListeners.apply(this, arguments);

			// Adds a reference from the clone to the original node, recursively
			function reference(node, clone)
			{
				clone.originalNode = node;
				
				node = node.firstChild;
				var child = clone.firstChild;
				
				while (node != null && child != null)
				{
					reference(node, child);
					node = node.nextSibling;
					child = child.nextSibling;
				}
				
				return clone;
			};
			
			// Checks the given node for new nodes, recursively
			function checkNode(node, clone)
			{
				if (node != null)
				{
					if (clone.originalNode != node)
					{
						cleanNode(node);
					}
					else
					{
						node = node.firstChild;
						clone = clone.firstChild;
						
						while (node != null)
						{
							var nextNode = node.nextSibling;
							
							if (clone == null)
							{
								cleanNode(node);
							}
							else
							{
								checkNode(node, clone);
								clone = clone.nextSibling;
							}
	
							node = nextNode;
						}
					}
				}
			};

			// Removes unused DOM nodes and attributes, recursively
			function cleanNode(node)
			{
				var child = node.firstChild;
				
				while (child != null)
				{
					var next = child.nextSibling;
					cleanNode(child);
					child = next;
				}
				
				if ((node.nodeType != 1 || (node.nodeName !== 'BR' && node.firstChild == null)) &&
					(node.nodeType != 3 || mxUtils.trim(mxUtils.getTextContent(node)).length == 0))
				{
					node.parentNode.removeChild(node);
				}
				else
				{
					// Removes linefeeds
					if (node.nodeType == 3)
					{
						mxUtils.setTextContent(node, mxUtils.getTextContent(node).replace(/\n|\r/g, ''));
					}

					// Removes CSS classes and styles (for Word and Excel)
					if (node.nodeType == 1)
					{
						node.removeAttribute('style');
						node.removeAttribute('class');
						node.removeAttribute('width');
						node.removeAttribute('cellpadding');
						node.removeAttribute('cellspacing');
						node.removeAttribute('border');
					}
				}
			};
			
			// Handles paste from Word, Excel etc by removing styles, classnames and unused nodes
			// LATER: Fix undo/redo for paste
			if (!mxClient.IS_QUIRKS && document.documentMode !== 7 && document.documentMode !== 8)
			{
				mxEvent.addListener(this.textarea, 'paste', (evt) =>
				{
					var clone = reference(this.textarea, this.textarea.cloneNode(true));
	
					window.setTimeout(() =>
					{
						// Paste from Word or Excel
						if (this.textarea != null &&
							(this.textarea.innerHTML.indexOf('<o:OfficeDocumentSettings>') >= 0 ||
							this.textarea.innerHTML.indexOf('<!--[if !mso]>') >= 0))
						{
							checkNode(this.textarea, clone);
						}
					}, 0);
				});
			}
		};
		
		mxCellEditor.prototype.toggleViewMode()
		{
			var state = this.graph.view.getState(this.editingCell);
			
			if (state != null)
			{
				var nl2Br = state != null && mxUtils.getValue(state.style, 'nl2Br', '1') != '0';
				var tmp = this.saveSelection();
				
				if (!this.codeViewMode)
				{
					// Clears the initial empty label on the first keystroke
					if (this.clearOnChange && this.textarea.innerHTML == this.getEmptyLabelText())
					{
						this.clearOnChange = false;
						this.textarea.innerHTML = '';
					}
					
					// Removes newlines from HTML and converts breaks to newlines
					// to match the HTML output in plain text
					var content = mxUtils.htmlEntities(this.textarea.innerHTML);
		
				    // Workaround for trailing line breaks being ignored in the editor
					if (!mxClient.IS_QUIRKS && document.documentMode != 8)
					{
						content = mxUtils.replaceTrailingNewlines(content, '<div><br></div>');
					}
					
				    content = this.graph.sanitizeHtml((nl2Br) ? content.replace(/\n/g, '').replace(/&lt;br\s*.?&gt;/g, '<br>') : content, true);
					this.textarea.className = 'mxCellEditor mxPlainTextEditor';
					
					var size = mxConstants.DEFAULT_FONTSIZE;
					
					this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
					this.textarea.style.fontSize = Math.round(size) + 'px';
					this.textarea.style.textDecoration = '';
					this.textarea.style.fontWeight = 'normal';
					this.textarea.style.fontStyle = '';
					this.textarea.style.fontFamily = mxConstants.DEFAULT_FONTFAMILY;
					this.textarea.style.textAlign = 'left';
					
					// Adds padding to make cursor visible with borders
					this.textarea.style.padding = '2px';
					
					if (this.textarea.innerHTML != content)
					{
						this.textarea.innerHTML = content;
					}
		
					this.codeViewMode = true;
				}
				else
				{
					var content = mxUtils.extractTextWithWhitespace(this.textarea.childNodes);
				    
					// Strips trailing line break
				    if (content.length > 0 && content.charAt(content.length - 1) == '\n')
				    {
				    	content = content.substring(0, content.length - 1);
				    }
				    
					content = this.graph.sanitizeHtml((nl2Br) ? content.replace(/\n/g, '<br/>') : content, true)
					this.textarea.className = 'mxCellEditor geContentEditable';
					
					var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
					var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
					var align = mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
					var bold = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD;
					var italic = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC;
					var txtDecor = [];
					
					if ((mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
					{
						txtDecor.push('underline');
					}
					
					if ((mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) &
							mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
					{
						txtDecor.push('line-through');
					}
					
					this.textarea.style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? Math.round(size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
					this.textarea.style.fontSize = Math.round(size) + 'px';
					this.textarea.style.textDecoration = txtDecor.join(' ');
					this.textarea.style.fontWeight = (bold) ? 'bold' : 'normal';
					this.textarea.style.fontStyle = (italic) ? 'italic' : '';
					this.textarea.style.fontFamily = family;
					this.textarea.style.textAlign = align;
					this.textarea.style.padding = '0px';
					
					if (this.textarea.innerHTML != content)
					{
						this.textarea.innerHTML = content;
						
						if (this.textarea.innerHTML.length == 0)
						{
							this.textarea.innerHTML = this.getEmptyLabelText();
							this.clearOnChange = this.textarea.innerHTML.length > 0;
						}
					}
		
					this.codeViewMode = false;
				}
				
				this.textarea.focus();
			
				if (this.switchSelectionState != null)
				{
					this.restoreSelection(this.switchSelectionState);
				}
				
				this.switchSelectionState = tmp;
				this.resize();
			}
		};
		
		var mxCellEditorResize = mxCellEditor.prototype.resize;
		mxCellEditor.prototype.resize(state, trigger)
		{
			if (this.textarea != null)
			{
				var state = this.graph.getView().getState(this.editingCell);
				
				if (this.codeViewMode && state != null)
				{
					var scale = state.view.scale;
					this.bounds = mxRectangle.fromRectangle(state);
					
					// General placement of code editor if cell has no size
					// LATER: Fix HTML editor bounds for edge labels
					if (this.bounds.width == 0 && this.bounds.height == 0)
					{
						this.bounds.width = 160 * scale;
						this.bounds.height = 60 * scale;
						
						var m = (state.text != null) ? state.text.margin : null;
						
						if (m == null)
						{
							m = mxUtils.getAlignmentAsPoint(mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER),
									mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE));
						}
						
						this.bounds.x += m.x * this.bounds.width;
						this.bounds.y += m.y * this.bounds.height;
					}
		
					this.textarea.style.width = Math.round((this.bounds.width - 4) / scale) + 'px';
					this.textarea.style.height = Math.round((this.bounds.height - 4) / scale) + 'px';
					this.textarea.style.overflow = 'auto';
		
					// Adds scrollbar offset if visible
					if (this.textarea.clientHeight < this.textarea.offsetHeight)
					{
						this.textarea.style.height = Math.round((this.bounds.height / scale)) + (this.textarea.offsetHeight - this.textarea.clientHeight) + 'px';
						this.bounds.height = parseInt(this.textarea.style.height) * scale;
					}
					
					if (this.textarea.clientWidth < this.textarea.offsetWidth)
					{
						this.textarea.style.width = Math.round((this.bounds.width / scale)) + (this.textarea.offsetWidth - this.textarea.clientWidth) + 'px';
						this.bounds.width = parseInt(this.textarea.style.width) * scale;
					}
									
					this.textarea.style.left = Math.round(this.bounds.x) + 'px';
					this.textarea.style.top = Math.round(this.bounds.y) + 'px';
		
					if (mxClient.IS_VML)
					{
						this.textarea.style.zoom = scale;
					}
					else
					{
						mxUtils.setPrefixedStyle(this.textarea.style, 'transform', 'scale(' + scale + ',' + scale + ')');	
					}
				}
				else
				{
					this.textarea.style.height = '';
					this.textarea.style.overflow = '';
					mxCellEditorResize.apply(this, arguments);
				}
			}
		};
		
		mxCellEditorGetInitialValue = mxCellEditor.prototype.getInitialValue;
		mxCellEditor.prototype.getInitialValue(state, trigger)
		{
			if (mxUtils.getValue(state.style, 'html', '0') == '0')
			{
				return mxCellEditorGetInitialValue.apply(this, arguments);
			}
			else
			{
				var result = this.graph.getEditingValue(state.cell, trigger)
			
				if (mxUtils.getValue(state.style, 'nl2Br', '1') == '1')
				{
					result = result.replace(/\n/g, '<br/>');
				}
				
				result = this.graph.sanitizeHtml(result, true);
				
				return result;
			}
		};
		
		mxCellEditorGetCurrentValue = mxCellEditor.prototype.getCurrentValue;
		mxCellEditor.prototype.getCurrentValue(state)
		{
			if (mxUtils.getValue(state.style, 'html', '0') == '0')
			{
				return mxCellEditorGetCurrentValue.apply(this, arguments);
			}
			else
			{
				var result = this.graph.sanitizeHtml(this.textarea.innerHTML, true);
	
				if (mxUtils.getValue(state.style, 'nl2Br', '1') == '1')
				{
					result = result.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
				}
				else
				{
					result = result.replace(/\r\n/g, '').replace(/\n/g, '');
				}
				
				return result;
			}
		};
	
		var mxCellEditorStopEditing = mxCellEditor.prototype.stopEditing;
		mxCellEditor.prototype.stopEditing(cancel)
		{
			// Restores default view mode before applying value
			if (this.codeViewMode)
			{
				this.toggleViewMode();
			}
			
			mxCellEditorStopEditing.apply(this, arguments);
			
			// Tries to move focus back to container after editing if possible
			this.focusContainer();
		};
		
		mxCellEditor.prototype.focusContainer()
		{
			try
			{
				this.graph.container.focus();
			}
			catch (e)
			{
				// ignore
			}
		};
	
		var mxCellEditorApplyValue = mxCellEditor.prototype.applyValue;
		mxCellEditor.prototype.applyValue(state, value)
		{
			// Removes empty relative child labels in edges
			this.graph.getModel().beginUpdate();
			
			try
			{
				mxCellEditorApplyValue.apply(this, arguments);
				
				if (value == '' && this.graph.isCellDeletable(state.cell) &&
					this.graph.model.getChildCount(state.cell) == 0 &&
					this.graph.isTransparentState(state))
				{
					this.graph.removeCells([state.cell], false);
				}
			}
			finally
			{
				this.graph.getModel().endUpdate();
			}
		};
		
		/**
		 * Returns the background color to be used for the editing box. This returns
		 * the label background for edge labels and null for all other cases.
		 */
		mxCellEditor.prototype.getBackgroundColor(state)
		{
			var color = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, null);

			if ((color == null || color == mxConstants.NONE) &&
				(state.cell.geometry != null && state.cell.geometry.width > 0) &&
				(mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION, 0) != 0 ||
				mxUtils.getValue(state.style, mxConstants.STYLE_HORIZONTAL, 1) == 0))
			{
				color = mxUtils.getValue(state.style, mxConstants.STYLE_FILLCOLOR, null);
			}

			if (color == mxConstants.NONE)
			{
				color = null;
			}
			
			return color;
		};
		
		mxCellEditor.prototype.getMinimumSize(state)
		{
			var scale = this.graph.getView().scale;
			
			return new mxRectangle(0, 0, (state.text == null) ? 30 :  state.text.size * scale + 20, 30);
		};
		
		// Hold alt to ignore drop target
		var mxGraphHandlerMoveCells = mxGraphHandler.prototype.moveCells;
		
		mxGraphHandler.prototype.moveCells(cells, dx, dy, clone, target, evt)
		{
			if (mxEvent.isAltDown(evt))
			{
				target = null;
			}
			
			mxGraphHandlerMoveCells.apply(this, arguments);
		};

		/**
		 * Hints on handlers
		 */
		function createHint()
		{
			var hint = document.createElement('div');
			hint.className = 'geHint';
			hint.style.whiteSpace = 'nowrap';
			hint.style.position = 'absolute';
			
			return hint;
		};
		
		/**
		 * Format pixels in the given unit
		 */
		function formatHintText(pixels, unit) 
		{
		    switch(unit) 
		    {
		        case mxConstants.POINTS:
		            return pixels;
		        case mxConstants.MILLIMETERS:
		            return (pixels / mxConstants.PIXELS_PER_MM).toFixed(1);
		        case mxConstants.INCHES:
		            return (pixels / mxConstants.PIXELS_PER_INCH).toFixed(2);
		    }
		};
		
		
		mxGraphView.prototype.formatUnitText(pixels) 
		{
			return pixels? formatHintText(pixels, this.unit) : pixels;
		};
		
		/**
		 * Updates the hint for the current operation.
		 */
		mxGraphHandler.prototype.updateHint(me)
		{
			if (this.pBounds != null && (this.shape != null || this.livePreviewActive))
			{
				if (this.hint == null)
				{
					this.hint = createHint();
					this.graph.container.appendChild(this.hint);
				}
	
				var t = this.graph.view.translate;
				var s = this.graph.view.scale;
				var x = this.roundLength((this.bounds.x + this.currentDx) / s - t.x);
				var y = this.roundLength((this.bounds.y + this.currentDy) / s - t.y);
				var unit = this.graph.view.unit;
				
				this.hint.innerHTML = formatHintText(x, unit) + ', ' + formatHintText(y, unit);
				
				this.hint.style.left = (this.pBounds.x + this.currentDx +
					Math.round((this.pBounds.width - this.hint.clientWidth) / 2)) + 'px';
				this.hint.style.top = (this.pBounds.y + this.currentDy +
					this.pBounds.height + Editor.hintOffset) + 'px';
			}
		};
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxGraphHandler.prototype.removeHint()
		{
			if (this.hint != null)
			{
				this.hint.parentNode.removeChild(this.hint);
				this.hint = null;
			}
		};

		/**
		 * Moves rotation handle to top, right corner.
		 */
		mxVertexHandler.prototype.rotationHandleVSpacing = -12;
		
		mxVertexHandler.prototype.getRotationHandlePosition()
		{
			var padding = this.getHandlePadding();
			
			return new mxPoint(this.bounds.x + this.bounds.width - this.rotationHandleVSpacing + padding.x / 2,
				this.bounds.y + this.rotationHandleVSpacing - padding.y / 2)
		};
	
		/**
		 * Enables recursive resize for groups.
		 */
		mxVertexHandler.prototype.isRecursiveResize(state, me)
		{
			return this.graph.isRecursiveVertexResize(state) &&
				!mxEvent.isControlDown(me.getEvent());
		};
		
		/**
		 * Enables centered resize events.
		 */
		mxVertexHandler.prototype.isCenteredEvent(state, me)
		{
			return (!(!this.graph.isSwimlane(state.cell) && this.graph.model.getChildCount(state.cell) > 0 &&
					!this.graph.isCellCollapsed(state.cell) &&
					mxUtils.getValue(state.style, 'recursiveResize', '1') == '1' &&
					mxUtils.getValue(state.style, 'childLayout', null) == null) &&
					mxEvent.isControlDown(me.getEvent())) ||
				mxEvent.isMetaDown(me.getEvent());
		};
		
		/**
		 * Adds handle padding for editing cells and exceptions.
		 */
		var vertexHandlerGetHandlePadding = mxVertexHandler.prototype.getHandlePadding;
		mxVertexHandler.prototype.getHandlePadding()
		{
			var result = new mxPoint(0, 0);
			var tol = this.tolerance;
			var name = this.state.style['shape'];

			if (mxCellRenderer.defaultShapes[name] == null &&
				mxStencilRegistry.getStencil(name) == null)
			{
				name = mxConstants.SHAPE_RECTANGLE;
			}
			
			// Checks if custom handles are overlapping with the shape border
			var handlePadding = this.graph.cellEditor.getEditingCell() == this.state.cell;
			
			if (!handlePadding)
			{
				if (this.customHandles != null)
				{
					for (var i = 0; i < this.customHandles.length; i++)
					{
						if (this.customHandles[i].shape != null &&
							this.customHandles[i].shape.bounds != null)
						{
							var b = this.customHandles[i].shape.bounds;
							var px = b.getCenterX();
							var py = b.getCenterY();
							
							if ((Math.abs(this.state.x - px) < b.width / 2) ||
								(Math.abs(this.state.y - py) < b.height / 2) ||
								(Math.abs(this.state.x + this.state.width - px) < b.width / 2) ||
								(Math.abs(this.state.y + this.state.height - py) < b.height / 2))
							{
								handlePadding = true;
								break;
							}
						}
					}
				}
			}
			
			if (handlePadding && this.sizers != null &&
				this.sizers.length > 0 && this.sizers[0] != null)
			{
				tol /= 2;
				
				result.x = this.sizers[0].bounds.width + tol;
				result.y = this.sizers[0].bounds.height + tol;
			}
			else
			{
				result = vertexHandlerGetHandlePadding.apply(this, arguments);
			}
			
			return result;
		};

		/**
		 * Updates the hint for the current operation.
		 */
		mxVertexHandler.prototype.updateHint(me)
		{
			if (this.index != mxEvent.LABEL_HANDLE)
			{
				if (this.hint == null)
				{
					this.hint = createHint();
					this.state.view.graph.container.appendChild(this.hint);
				}
	
				if (this.index == mxEvent.ROTATION_HANDLE)
				{
					this.hint.innerHTML = this.currentAlpha + '&deg;';
				}
				else
				{
					var s = this.state.view.scale;
					var unit = this.state.view.unit;
					this.hint.innerHTML = formatHintText(this.roundLength(this.bounds.width / s), unit) + ' x ' + 
											formatHintText(this.roundLength(this.bounds.height / s), unit);
				}
				
				var rot = (this.currentAlpha != null) ? this.currentAlpha : this.state.style[mxConstants.STYLE_ROTATION] || '0';
				var bb = mxUtils.getBoundingBox(this.bounds, rot);
				
				if (bb == null)
				{
					bb = this.bounds;
				}
				
				this.hint.style.left = bb.x + Math.round((bb.width - this.hint.clientWidth) / 2) + 'px';
				this.hint.style.top = (bb.y + bb.height + Editor.hintOffset) + 'px';
				
				if (this.linkHint != null)
				{
					this.linkHint.style.display = 'none';
				}
			}
		};
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxVertexHandler.prototype.removeHint()
		{
			mxGraphHandler.prototype.removeHint.apply(this, arguments);
			
			if (this.linkHint != null)
			{
				this.linkHint.style.display = '';
			}
		};

		/**
		 * Hides link hint while moving cells.
		 */
		var edgeHandlerMouseMove = mxEdgeHandler.prototype.mouseMove;
		
		mxEdgeHandler.prototype.mouseMove(sender, me)
		{
			edgeHandlerMouseMove.apply(this, arguments);
			
			if (this.graph.graphHandler != null && this.graph.graphHandler.first != null &&
				this.linkHint != null && this.linkHint.style.display != 'none')
			{
				this.linkHint.style.display = 'none';
			}
		}
		
		/**
		 * Hides link hint while moving cells.
		 */
		var edgeHandlerMouseUp = mxEdgeHandler.prototype.mouseUp;
		
		mxEdgeHandler.prototype.mouseUp(sender, me)
		{
			edgeHandlerMouseUp.apply(this, arguments);
			
			if (this.linkHint != null && this.linkHint.style.display == 'none')
			{
				this.linkHint.style.display = '';
			}
		}
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxEdgeHandler.prototype.updateHint(me, point)
		{
			if (this.hint == null)
			{
				this.hint = createHint();
				this.state.view.graph.container.appendChild(this.hint);
			}
	
			var t = this.graph.view.translate;
			var s = this.graph.view.scale;
			var x = this.roundLength(point.x / s - t.x);
			var y = this.roundLength(point.y / s - t.y);
			var unit = this.graph.view.unit;
			
			this.hint.innerHTML = formatHintText(x, unit) + ', ' + formatHintText(y, unit);
			this.hint.style.visibility = 'visible';
			
			if (this.isSource || this.isTarget)
			{
				if (this.constraintHandler.currentConstraint != null &&
					this.constraintHandler.currentFocus != null)
				{
					var pt = this.constraintHandler.currentConstraint.point;
					this.hint.innerHTML = '[' + Math.round(pt.x * 100) + '%, '+ Math.round(pt.y * 100) + '%]';
				}
				else if (this.marker.hasValidState())
				{
					this.hint.style.visibility = 'hidden';
				}
			}
			
			this.hint.style.left = Math.round(me.getGraphX() - this.hint.clientWidth / 2) + 'px';
			this.hint.style.top = (Math.max(me.getGraphY(), point.y) + Editor.hintOffset) + 'px';
			
			if (this.linkHint != null)
			{
				this.linkHint.style.display = 'none';
			}
		};
	
		/**
		 * Updates the hint for the current operation.
		 */
		mxEdgeHandler.prototype.removeHint = mxVertexHandler.prototype.removeHint;
	
		/**
		 * Defines the handles for the UI. Uses data-URIs to speed-up loading time where supported.
		 */
		// TODO: Increase handle padding
		HoverIcons.prototype.mainHandle = (!mxClient.IS_SVG) ? new mxImage(IMAGE_PATH + '/handle-main.png', 17, 17) :
			static createSvgImage(18, 18, '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '" stroke-width="1"/>');
		HoverIcons.prototype.secondaryHandle = (!mxClient.IS_SVG) ? new mxImage(IMAGE_PATH + '/handle-secondary.png', 17, 17) :
			static createSvgImage(16, 16, '<path d="m 8 3 L 13 8 L 8 13 L 3 8 z" stroke="#fff" fill="#fca000"/>');
		HoverIcons.prototype.fixedHandle = (!mxClient.IS_SVG) ? new mxImage(IMAGE_PATH + '/handle-fixed.png', 17, 17) :
			static createSvgImage(18, 18, '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '" stroke-width="1"/><path d="m 7 7 L 11 11 M 7 11 L 11 7" stroke="#fff"/>');
		HoverIcons.prototype.terminalHandle = (!mxClient.IS_SVG) ? new mxImage(IMAGE_PATH + '/handle-terminal.png', 17, 17) :
			static createSvgImage(18, 18, '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' + HoverIcons.prototype.arrowFill + '" stroke-width="1"/><circle cx="9" cy="9" r="2" stroke="#fff" fill="transparent"/>');
		HoverIcons.prototype.rotationHandle = (!mxClient.IS_SVG) ? new mxImage(IMAGE_PATH + '/handle-rotate.png', 16, 16) :
			static createSvgImage(16, 16, '<path stroke="' + HoverIcons.prototype.arrowFill +
				'" fill="' + HoverIcons.prototype.arrowFill +
				'" d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>',
				24, 24);
		
		if (mxClient.IS_SVG)
		{
			mxConstraintHandler.prototype.pointImage = static createSvgImage(5, 5, '<path d="m 0 0 L 5 5 M 0 5 L 5 0" stroke="' + HoverIcons.prototype.arrowFill + '"/>');
		}
		
		mxVertexHandler.prototype.handleImage = HoverIcons.prototype.mainHandle;
		mxVertexHandler.prototype.secondaryHandleImage = HoverIcons.prototype.secondaryHandle;
		mxEdgeHandler.prototype.handleImage = HoverIcons.prototype.mainHandle;
		mxEdgeHandler.prototype.terminalHandleImage = HoverIcons.prototype.terminalHandle;
		mxEdgeHandler.prototype.fixedHandleImage = HoverIcons.prototype.fixedHandle;
		mxEdgeHandler.prototype.labelHandleImage = HoverIcons.prototype.secondaryHandle;
		mxOutline.prototype.sizerImage = HoverIcons.prototype.mainHandle;
		
		if (window.Sidebar != null)
		{
			Sidebar.prototype.triangleUp = HoverIcons.prototype.triangleUp;
			Sidebar.prototype.triangleRight = HoverIcons.prototype.triangleRight;
			Sidebar.prototype.triangleDown = HoverIcons.prototype.triangleDown;
			Sidebar.prototype.triangleLeft = HoverIcons.prototype.triangleLeft;
			Sidebar.prototype.refreshTarget = HoverIcons.prototype.refreshTarget;
			Sidebar.prototype.roundDrop = HoverIcons.prototype.roundDrop;
		}

		// Pre-fetches images (only needed for non data-uris)
		if (!mxClient.IS_SVG)
		{
			new Image().src = HoverIcons.prototype.mainHandle.src;
			new Image().src = HoverIcons.prototype.fixedHandle.src;
			new Image().src = HoverIcons.prototype.terminalHandle.src;
			new Image().src = HoverIcons.prototype.secondaryHandle.src;
			new Image().src = HoverIcons.prototype.rotationHandle.src;
			
			new Image().src = HoverIcons.prototype.triangleUp.src;
			new Image().src = HoverIcons.prototype.triangleRight.src;
			new Image().src = HoverIcons.prototype.triangleDown.src;
			new Image().src = HoverIcons.prototype.triangleLeft.src;
			new Image().src = HoverIcons.prototype.refreshTarget.src;
			new Image().src = HoverIcons.prototype.roundDrop.src;
		}
		
		// Adds rotation handle and live preview
		mxVertexHandler.prototype.rotationEnabled = true;
		mxVertexHandler.prototype.manageSizers = true;
		mxVertexHandler.prototype.livePreview = true;
		mxGraphHandler.prototype.maxLivePreview = 16;
	
		// Increases default rubberband opacity (default is 20)
		mxRubberband.prototype.defaultOpacity = 30;
		
		// Enables connections along the outline, virtual waypoints, parent highlight etc
		mxConnectionHandler.prototype.outlineConnect = true;
		mxCellHighlight.prototype.keepOnTop = true;
		mxVertexHandler.prototype.parentHighlightEnabled = true;
		
		mxEdgeHandler.prototype.parentHighlightEnabled = true;
		mxEdgeHandler.prototype.dblClickRemoveEnabled = true;
		mxEdgeHandler.prototype.straightRemoveEnabled = true;
		mxEdgeHandler.prototype.virtualBendsEnabled = true;
		mxEdgeHandler.prototype.mergeRemoveEnabled = true;
		mxEdgeHandler.prototype.manageLabelHandle = true;
		mxEdgeHandler.prototype.outlineConnect = true;
		
		// Disables adding waypoints if shift is pressed
		mxEdgeHandler.prototype.isAddVirtualBendEvent(me)
		{
			return !mxEvent.isShiftDown(me.getEvent());
		};
	
		// Disables custom handles if shift is pressed
		mxEdgeHandler.prototype.isCustomHandleEvent(me)
		{
			return !mxEvent.isShiftDown(me.getEvent());
		};
		
		/**
		 * Implements touch style
		 */
		if (Graph.touchStyle)
		{
			// Larger tolerance for real touch devices
			if (mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)
			{
				mxShape.prototype.svgStrokeTolerance = 18;
				mxVertexHandler.prototype.tolerance = 12;
				mxEdgeHandler.prototype.tolerance = 12;
				Graph.prototype.tolerance = 12;
				
				mxVertexHandler.prototype.rotationHandleVSpacing = -16;
				
				// Implements a smaller tolerance for mouse events and a larger tolerance for touch
				// events on touch devices. The default tolerance (4px) is used for mouse events.
				mxConstraintHandler.prototype.getTolerance(me)
				{
					return (mxEvent.isMouseEvent(me.getEvent())) ? 4 : this.graph.getTolerance();
				};
			}
				
			// One finger pans (no rubberband selection) must start regardless of mouse button
			mxPanningHandler.prototype.isPanningTrigger(me)
			{
				var evt = me.getEvent();
				
			 	return (me.getState() == null && !mxEvent.isMouseEvent(evt)) ||
			 		(mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
			 		mxEvent.isControlDown(evt) || mxEvent.isShiftDown(evt)));
			};
			
			// Don't clear selection if multiple cells selected
			var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
			mxGraphHandler.prototype.mouseDown(sender, me)
			{
				graphHandlerMouseDown.apply(this, arguments);
	
				if (mxEvent.isTouchEvent(me.getEvent()) && this.graph.isCellSelected(me.getCell()) &&
					this.graph.getSelectionCount() > 1)
				{
					this.delayedSelection = false;
				}
			};
		}
		else
		{
			// Removes ctrl+shift as panning trigger for space splitting
			mxPanningHandler.prototype.isPanningTrigger(me)
			{
				var evt = me.getEvent();
				
				return (mxEvent.isLeftMouseButton(evt) && ((this.useLeftButtonForPanning &&
						me.getState() == null) || (mxEvent.isControlDown(evt) &&
						!mxEvent.isShiftDown(evt)))) || (this.usePopupTrigger &&
						mxEvent.isPopupTrigger(evt));
			};
		}

		// Overrides/extends rubberband for space handling with Ctrl+Shift(+Alt) drag ("scissors tool")
		mxRubberband.prototype.isSpaceEvent(me)
		{
			return this.graph.isEnabled() && !this.graph.isCellLocked(this.graph.getDefaultParent()) &&
				mxEvent.isControlDown(me.getEvent()) && mxEvent.isShiftDown(me.getEvent());
		};

		// Cancelled state
		mxRubberband.prototype.cancelled = false;

		// Cancels ongoing rubberband selection but consumed event to avoid reset of selection
		mxRubberband.prototype.cancel()
		{
			if (this.isActive())
			{
				this.cancelled = true;
				this.reset();
			}
		};

		// Handles moving of cells in both half panes
		mxRubberband.prototype.mouseUp(sender, me)
		{
			if (this.cancelled)
			{
				this.cancelled = false;
				me.consume();
			}
			else
			{
				var execute = this.div != null && this.div.style.display != 'none';
	
				var x0 = null;
				var y0 = null;
				var dx = null;
				var dy = null;
	
				if (this.first != null && this.currentX != null && this.currentY != null)
				{
					x0 = this.first.x;
					y0 = this.first.y;
					dx = (this.currentX - x0) / this.graph.view.scale;
					dy = (this.currentY - y0) / this.graph.view.scale;
	
					if (!mxEvent.isAltDown(me.getEvent()))
					{
						dx = this.graph.snap(dx);
						dy = this.graph.snap(dy);
						
						if (!this.graph.isGridEnabled())
						{
							if (Math.abs(dx) < this.graph.tolerance)
							{
								dx = 0;
							}
							
							if (Math.abs(dy) < this.graph.tolerance)
							{
								dy = 0;
							}
						}
					}
				}
				
				this.reset();
				
				if (execute)
				{
					if (mxEvent.isAltDown(me.getEvent()) && this.graph.isToggleEvent(me.getEvent()))
					{
						var rect = new mxRectangle(this.x, this.y, this.width, this.height);
						var cells = this.graph.getCells(rect.x, rect.y, rect.width, rect.height);
						
						this.graph.removeSelectionCells(cells);
					}
					else if (this.isSpaceEvent(me))
					{
						this.graph.model.beginUpdate();
						try
						{
							var cells = this.graph.getCellsBeyond(x0, y0, this.graph.getDefaultParent(), true, true);
	
							for (var i = 0; i < cells.length; i++)
							{
								if (this.graph.isCellMovable(cells[i]))
								{
									var tmp = this.graph.view.getState(cells[i]);
									var geo = this.graph.getCellGeometry(cells[i]);
									
									if (tmp != null && geo != null)
									{
										geo = geo.clone();
										geo.translate(dx, dy);
										this.graph.model.setGeometry(cells[i], geo);
									}
								}
							}
						}
						finally
						{
							this.graph.model.endUpdate();
						}
					}
					else
					{
						var rect = new mxRectangle(this.x, this.y, this.width, this.height);
						this.graph.selectRegion(rect, me.getEvent());
					}
					
					me.consume();
				}
			}
		};
		
		// Handles preview for creating/removing space in diagram
		mxRubberband.prototype.mouseMove(sender, me)
		{
			if (!me.isConsumed() && this.first != null)
			{
				var origin = mxUtils.getScrollOrigin(this.graph.container);
				var offset = mxUtils.getOffset(this.graph.container);
				origin.x -= offset.x;
				origin.y -= offset.y;
				var x = me.getX() + origin.x;
				var y = me.getY() + origin.y;
				var dx = this.first.x - x;
				var dy = this.first.y - y;
				var tol = this.graph.tolerance;
				
				if (this.div != null || Math.abs(dx) > tol ||  Math.abs(dy) > tol)
				{
					if (this.div == null)
					{
						this.div = this.createShape();
					}
					
					// Clears selection while rubberbanding. This is required because
					// the event is not consumed in mouseDown.
					mxUtils.clearSelection();
					this.update(x, y);
					
					if (this.isSpaceEvent(me))
					{
						var right = this.x + this.width;
						var bottom = this.y + this.height;
						var scale = this.graph.view.scale;
						
						if (!mxEvent.isAltDown(me.getEvent()))
						{
							this.width = this.graph.snap(this.width / scale) * scale;
							this.height = this.graph.snap(this.height / scale) * scale;
							
							if (!this.graph.isGridEnabled())
							{
								if (this.width < this.graph.tolerance)
								{
									this.width = 0;
								}
								
								if (this.height < this.graph.tolerance)
								{
									this.height = 0;
								}
							}
							
							if (this.x < this.first.x)
							{
								this.x = right - this.width;
							}
							
							if (this.y < this.first.y)
							{
								this.y = bottom - this.height;
							}
						}
						
						this.div.style.borderStyle = 'dashed';
						this.div.style.backgroundColor = 'white';
						this.div.style.left = this.x + 'px';
						this.div.style.top = this.y + 'px';
						this.div.style.width = Math.max(0, this.width) + 'px';
						this.div.style.height = this.graph.container.clientHeight + 'px';
						this.div.style.borderWidth = (this.width <= 0) ? '0px 1px 0px 0px' : '0px 1px 0px 1px';
						
						if (this.secondDiv == null)
						{
							this.secondDiv = this.div.cloneNode(true);
							this.div.parentNode.appendChild(this.secondDiv);
						}
						
						this.secondDiv.style.left = this.x + 'px';
						this.secondDiv.style.top = this.y + 'px';
						this.secondDiv.style.width = this.graph.container.clientWidth + 'px';
						this.secondDiv.style.height = Math.max(0, this.height) + 'px';
						this.secondDiv.style.borderWidth = (this.height <= 0) ? '1px 0px 0px 0px' : '1px 0px 1px 0px';
					}
					else
					{
						// Hides second div and restores style
						this.div.style.backgroundColor = '';
						this.div.style.borderWidth = '';
						this.div.style.borderStyle = '';
						
						if (this.secondDiv != null)
						{
							this.secondDiv.parentNode.removeChild(this.secondDiv);
							this.secondDiv = null;
						}
					}

					me.consume();
				}
			}
		};
		
		// Removes preview
		var mxRubberbandReset = mxRubberband.prototype.reset;
		mxRubberband.prototype.reset()
		{
			if (this.secondDiv != null)
			{
				this.secondDiv.parentNode.removeChild(this.secondDiv);
				this.secondDiv = null;
			}
			
			mxRubberbandReset.apply(this, arguments);
		};
		
	    // Timer-based activation of outline connect in connection handler
	    var startTime = new Date().getTime();
	    var timeOnTarget = 0;
	    
		var mxEdgeHandlerUpdatePreviewState = mxEdgeHandler.prototype.updatePreviewState;
		
		mxEdgeHandler.prototype.updatePreviewState(edge, point, terminalState, me)
		{
			mxEdgeHandlerUpdatePreviewState.apply(this, arguments);
			
	    	if (terminalState != this.currentTerminalState)
	    	{
	    		startTime = new Date().getTime();
	    		timeOnTarget = 0;
	    	}
	    	else
	    	{
		    	timeOnTarget = new Date().getTime() - startTime;
	    	}
			
			this.currentTerminalState = terminalState;
		};
	
		// Timer-based outline connect
		var mxEdgeHandlerIsOutlineConnectEvent = mxEdgeHandler.prototype.isOutlineConnectEvent;
		
		mxEdgeHandler.prototype.isOutlineConnectEvent(me)
		{
			return (this.currentTerminalState != null && me.getState() == this.currentTerminalState && timeOnTarget > 2000) ||
				((this.currentTerminalState == null || mxUtils.getValue(this.currentTerminalState.style, 'outlineConnect', '1') != '0') &&
				mxEdgeHandlerIsOutlineConnectEvent.apply(this, arguments));
		};
		
		// Disables custom handles if shift is pressed
		mxVertexHandler.prototype.isCustomHandleEvent(me)
		{
			return !mxEvent.isShiftDown(me.getEvent());
		};
	
		// Shows secondary handle for fixed connection points
		mxEdgeHandler.prototype.createHandleShape(index, virtual)
		{
			var source = index != null && index == 0;
			var terminalState = this.state.getVisibleTerminalState(source);
			var c = (index != null && (index == 0 || index >= this.state.absolutePoints.length - 1 ||
				(this.constructor == mxElbowEdgeHandler && index == 2))) ?
				this.graph.getConnectionConstraint(this.state, terminalState, source) : null;
			var pt = (c != null) ? this.graph.getConnectionPoint(this.state.getVisibleTerminalState(source), c) : null;
			var img = (pt != null) ? this.fixedHandleImage : ((c != null && terminalState != null) ?
				this.terminalHandleImage : this.handleImage);
			
			if (img != null)
			{
				var shape = new mxImageShape(new mxRectangle(0, 0, img.width, img.height), img.src);
				
				// Allows HTML rendering of the images
				shape.preserveImageAspect = false;
	
				return shape;
			}
			else
			{
				var s = mxConstants.HANDLE_SIZE;
				
				if (this.preferHtml)
				{
					s -= 1;
				}
				
				return new mxRectangleShape(new mxRectangle(0, 0, s, s), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
			}
		};
	
		var vertexHandlerCreateSizerShape = mxVertexHandler.prototype.createSizerShape;
		mxVertexHandler.prototype.createSizerShape(bounds, index, fillColor)
		{
			this.handleImage = (index == mxEvent.ROTATION_HANDLE) ? HoverIcons.prototype.rotationHandle : (index == mxEvent.LABEL_HANDLE) ? this.secondaryHandleImage : this.handleImage;
			
			return vertexHandlerCreateSizerShape.apply(this, arguments);
		};
		
		// Special case for single edge label handle moving in which case the text bounding box is used
		var mxGraphHandlerGetBoundingBox = mxGraphHandler.prototype.getBoundingBox;
		mxGraphHandler.prototype.getBoundingBox(cells)
		{
			if (cells != null && cells.length == 1)
			{
				var model = this.graph.getModel();
				var parent = model.getParent(cells[0]);
				var geo = this.graph.getCellGeometry(cells[0]);
				
				if (model.isEdge(parent) && geo != null && geo.relative)
				{
					var state = this.graph.view.getState(cells[0]);
					
					if (state != null && state.width < 2 && state.height < 2 && state.text != null &&
						state.text.boundingBox != null)
					{
						return mxRectangle.fromRectangle(state.text.boundingBox);
					}
				}
			}
			
			return mxGraphHandlerGetBoundingBox.apply(this, arguments);
		};

		// Ignores child cells with part style as guides
		var mxGraphHandlerGetGuideStates = mxGraphHandler.prototype.getGuideStates;
		
		mxGraphHandler.prototype.getGuideStates()
		{
			var states = mxGraphHandlerGetGuideStates.apply(this, arguments);
			var result = [];
			
			// NOTE: Could do via isStateIgnored hook
			for (var i = 0; i < states.length; i++)
			{
				if (mxUtils.getValue(states[i].style, 'part', '0') != '1')
				{
					result.push(states[i]);
				}
			}
			
			return result;
		};

		// Uses text bounding box for edge labels
		var mxVertexHandlerGetSelectionBounds = mxVertexHandler.prototype.getSelectionBounds;
		mxVertexHandler.prototype.getSelectionBounds(state)
		{
			var model = this.graph.getModel();
			var parent = model.getParent(state.cell);
			var geo = this.graph.getCellGeometry(state.cell);
			
			if (model.isEdge(parent) && geo != null && geo.relative && state.width < 2 && state.height < 2 && state.text != null && state.text.boundingBox != null)
			{
				var bbox = state.text.unrotatedBoundingBox || state.text.boundingBox;
				
				return new mxRectangle(Math.round(bbox.x), Math.round(bbox.y), Math.round(bbox.width), Math.round(bbox.height));
			}
			else
			{
				return mxVertexHandlerGetSelectionBounds.apply(this, arguments);
			}
		};
	
		// Redirects moving of edge labels to mxGraphHandler by not starting here.
		// This will use the move preview of mxGraphHandler (see above).
		var mxVertexHandlerMouseDown = mxVertexHandler.prototype.mouseDown;
		mxVertexHandler.prototype.mouseDown(sender, me)
		{
			var model = this.graph.getModel();
			var parent = model.getParent(this.state.cell);
			var geo = this.graph.getCellGeometry(this.state.cell);
			
			// Lets rotation events through
			var handle = this.getHandleForEvent(me);
			
			if (handle == mxEvent.ROTATION_HANDLE || !model.isEdge(parent) || geo == null || !geo.relative ||
				this.state == null || this.state.width >= 2 || this.state.height >= 2)
			{
				mxVertexHandlerMouseDown.apply(this, arguments);
			}
		};

		// Shows rotation handle for edge labels.
		mxVertexHandler.prototype.isRotationHandleVisible()
		{
			return this.graph.isEnabled() && this.rotationEnabled && this.graph.isCellRotatable(this.state.cell) &&
				(mxGraphHandler.prototype.maxCells <= 0 || this.graph.getSelectionCount() < mxGraphHandler.prototype.maxCells);
		};
	
		// Invokes turn on single click on rotation handle
		mxVertexHandler.prototype.rotateClick()
		{
			var stroke = mxUtils.getValue(this.state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
			var fill = mxUtils.getValue(this.state.style, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);
			
			if (this.state.view.graph.model.isVertex(this.state.cell) &&
				stroke == mxConstants.NONE && fill == mxConstants.NONE)
			{
				var angle = mxUtils.mod(mxUtils.getValue(this.state.style, mxConstants.STYLE_ROTATION, 0) + 90, 360);
				this.state.view.graph.setCellStyles(mxConstants.STYLE_ROTATION, angle, [this.state.cell]);
			}
			else
			{
				this.state.view.graph.turnShapes([this.state.cell]);
			}
		};

		var vertexHandlerMouseMove = mxVertexHandler.prototype.mouseMove;
	
		// Workaround for "isConsumed not defined" in MS Edge is to use arguments
		mxVertexHandler.prototype.mouseMove(sender, me)
		{
			vertexHandlerMouseMove.apply(this, arguments);
			
			if (this.graph.graphHandler.first != null)
			{
				if (this.rotationShape != null && this.rotationShape.node != null)
				{
					this.rotationShape.node.style.display = 'none';
				}
				
				if (this.linkHint != null && this.linkHint.style.display != 'none')
				{
					this.linkHint.style.display = 'none';
				}
			}
		};
		
		var vertexHandlerMouseUp = mxVertexHandler.prototype.mouseUp;
		
		mxVertexHandler.prototype.mouseUp(sender, me)
		{
			vertexHandlerMouseUp.apply(this, arguments);
			
			// Shows rotation handle only if one vertex is selected
			if (this.rotationShape != null && this.rotationShape.node != null)
			{
				this.rotationShape.node.style.display = (this.graph.getSelectionCount() == 1) ? '' : 'none';
			}
			
			if (this.linkHint != null && this.linkHint.style.display == 'none')
			{
				this.linkHint.style.display = '';
			}
		};
	
		var vertexHandlerInit = mxVertexHandler.prototype.init;
		mxVertexHandler.prototype.init()
		{
			vertexHandlerInit.apply(this, arguments);
			var redraw = false;
			
			if (this.rotationShape != null)
			{
				this.rotationShape.node.setAttribute('title', mxResources.get('rotateTooltip'));
			}
			
			this.rowState = null;
			
			if (this.graph.isTableRow(this.state.cell))
			{
				this.rowState = this.state;
			}
			else if (this.graph.isTableCell(this.state.cell))
			{
				this.rowState = this.graph.view.getState(
					this.graph.model.getParent(this.state.cell));
			}
				
			if (this.rowState != null)
			{
				this.rowMoveHandle = mxUtils.createImage(Editor.moveImage);
				this.rowMoveHandle.style.position = 'absolute';
				this.rowMoveHandle.style.cursor = 'pointer';
				this.rowMoveHandle.style.width = '24px';
				this.rowMoveHandle.style.height = '24px';
				this.graph.container.appendChild(this.rowMoveHandle);
				
				mxEvent.addGestureListeners(this.rowMoveHandle, (evt) =>
				{
					this.graph.graphHandler.start(this.state.cell,
						mxEvent.getClientX(evt), mxEvent.getClientY(evt), [this.rowState.cell]);
					this.graph.graphHandler.cellWasClicked = true;
					this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
					this.graph.isMouseDown = true;
					mxEvent.consume(evt);
				});
			}
			
			var update = () =>
			{
				if (this.specialHandle != null)
				{
					this.specialHandle.node.style.display = (this.graph.isEnabled() && this.graph.getSelectionCount() < this.graph.graphHandler.maxCells) ? '' : 'none';
				}
				
				this.redrawHandles();
			};

			this.changeHandler = (sender, evt) =>
			{
				this.updateLinkHint(this.graph.getLinkForCell(this.state.cell),
					this.graph.getLinksForState(this.state));
				update();
			};
			
			this.graph.getSelectionModel().addListener(mxEvent.CHANGE, this.changeHandler);
			this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
			
			// Repaint needed when editing stops and no change event is fired
			this.editingHandler = (sender, evt) =>
			{
				this.redrawHandles();
			};
			
			this.graph.addListener(mxEvent.EDITING_STOPPED, this.editingHandler);

			var link = this.graph.getLinkForCell(this.state.cell);
			var links = this.graph.getLinksForState(this.state);
			this.updateLinkHint(link, links);
			
			if (link != null || (links != null && links.length > 0))
			{
				redraw = true;
			}
			
			if (redraw)
			{
				this.redrawHandles();
			}
		};
		
		var vertexHandlerSetHandlesVisible = mxVertexHandler.prototype.setHandlesVisible;

		mxVertexHandler.prototype.setHandlesVisible(visible)
		{
			vertexHandlerSetHandlesVisible.apply(this, arguments);
			
			if (this.rowMoveHandle != null)
			{
				this.rowMoveHandle.style.display = (visible) ? '' : 'none';
			}
		};
		
		mxVertexHandler.prototype.updateLinkHint(link, links)
		{
			try
			{
				if ((link == null && (links == null || links.length == 0)) ||
					this.graph.getSelectionCount() > 1)
				{
					if (this.linkHint != null)
					{
						this.linkHint.parentNode.removeChild(this.linkHint);
						this.linkHint = null;
					}
				}
				else if (link != null || (links != null && links.length > 0))
				{
					if (this.linkHint == null)
					{
						this.linkHint = createHint();
						this.linkHint.style.padding = '6px 8px 6px 8px';
						this.linkHint.style.opacity = '1';
						this.linkHint.style.filter = '';
						
						this.graph.container.appendChild(this.linkHint);
					}
	
					this.linkHint.innerHTML = '';
					
					if (link != null)
					{
						this.linkHint.appendChild(this.graph.createLinkForHint(link));
						
						if (this.graph.isEnabled() && typeof this.graph.editLink === 'function')
						{
							var changeLink = document.createElement('img');
							changeLink.setAttribute('src', Editor.editImage);
							changeLink.setAttribute('title', mxResources.get('editLink'));
							changeLink.setAttribute('width', '11');
							changeLink.setAttribute('height', '11');
							changeLink.style.marginLeft = '10px';
							changeLink.style.marginBottom = '-1px';
							changeLink.style.cursor = 'pointer';
							this.linkHint.appendChild(changeLink);
							
							mxEvent.addListener(changeLink, 'click', (evt) =>
							{
								this.graph.setSelectionCell(this.state.cell);
								this.graph.editLink();
								mxEvent.consume(evt);
							});
							
							var removeLink = document.createElement('img');
							removeLink.setAttribute('src', Dialog.prototype.clearImage);
							removeLink.setAttribute('title', mxResources.get('removeIt', [mxResources.get('link')]));
							removeLink.setAttribute('width', '13');
							removeLink.setAttribute('height', '10');
							removeLink.style.marginLeft = '4px';
							removeLink.style.marginBottom = '-1px';
							removeLink.style.cursor = 'pointer';
							this.linkHint.appendChild(removeLink);
							
							mxEvent.addListener(removeLink, 'click', (evt) =>
							{
								this.graph.setLinkForCell(this.state.cell, null);
								mxEvent.consume(evt);
							});
						}
					}
	
					if (links != null)
					{
						for (var i = 0; i < links.length; i++)
						{
							var div = document.createElement('div');
							div.style.marginTop = (link != null || i > 0) ? '6px' : '0px';
							div.appendChild(this.graph.createLinkForHint(
								links[i].getAttribute('href'),
								mxUtils.getTextContent(links[i])));
							
							this.linkHint.appendChild(div);
						}
					}
				}
			}
			catch (e)
			{
				// ignore
			}
		};
		
		mxEdgeHandler.prototype.updateLinkHint = mxVertexHandler.prototype.updateLinkHint;
		
		var edgeHandlerInit = mxEdgeHandler.prototype.init;
		mxEdgeHandler.prototype.init()
		{
			edgeHandlerInit.apply(this, arguments);
			
			// Disables connection points
			this.constraintHandler.isEnabled = () =>
			{
				return this.state.view.graph.connectionHandler.isEnabled();
			};
			
			var update = () =>
			{
				if (this.linkHint != null)
				{
					this.linkHint.style.display = (this.graph.getSelectionCount() == 1) ? '' : 'none';
				}
				
				if (this.labelShape != null)
				{
					this.labelShape.node.style.display = (this.graph.isEnabled() &&
						this.graph.getSelectionCount() < this.graph.graphHandler.maxCells) ?
						'' : 'none';
				}
			};
			
			this.changeHandler = (sender, evt) =>
			{
				this.updateLinkHint(this.graph.getLinkForCell(this.state.cell),
					this.graph.getLinksForState(this.state));
				update();
				this.redrawHandles();
			};

			this.graph.getSelectionModel().addListener(mxEvent.CHANGE, this.changeHandler);
			this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	
			var link = this.graph.getLinkForCell(this.state.cell);
			var links = this.graph.getLinksForState(this.state);
									
			if (link != null || (links != null && links.length > 0))
			{
				this.updateLinkHint(link, links);
				this.redrawHandles();
			}
		};
	
		// Disables connection points
		var connectionHandlerInit = mxConnectionHandler.prototype.init;
		
		mxConnectionHandler.prototype.init()
		{
			connectionHandlerInit.apply(this, arguments);
			
			this.constraintHandler.isEnabled = () =>
			{
				return this.graph.connectionHandler.isEnabled();
			};
		};
	
		var vertexHandlerRedrawHandles = mxVertexHandler.prototype.redrawHandles;
		mxVertexHandler.prototype.redrawHandles()
		{		
			if (this.rowMoveHandle != null && this.rowState != null)
			{
				this.rowMoveHandle.style.left = (this.rowState.x + this.rowState.width) + 'px';
				this.rowMoveHandle.style.top = (this.rowState.y + this.rowState.height) + 'px';
			}
			
			// Shows rotation handle only if one vertex is selected
			if (this.rotationShape != null && this.rotationShape.node != null)
			{
				this.rotationShape.node.style.display = (this.rowMoveHandle == null &&
					(this.graph.getSelectionCount() == 1 && (this.index == null ||
					this.index == mxEvent.ROTATION_HANDLE))) ? '' : 'none';
			}

			vertexHandlerRedrawHandles.apply(this);

			if (this.state != null && this.linkHint != null)
			{
				var c = new mxPoint(this.state.getCenterX(), this.state.getCenterY());
				var tmp = new mxRectangle(this.state.x, this.state.y - 22, this.state.width + 24, this.state.height + 22);
				var bb = mxUtils.getBoundingBox(tmp, this.state.style[mxConstants.STYLE_ROTATION] || '0', c);
				var rs = (bb != null) ? mxUtils.getBoundingBox(this.state,
					this.state.style[mxConstants.STYLE_ROTATION] || '0') : this.state;
				var tb = (this.state.text != null) ? this.state.text.boundingBox : null;
				
				if (bb == null)
				{
					bb = this.state;
				}
				
				var b = bb.y + bb.height;
				
				if (tb != null)
				{
					b = Math.max(b, tb.y + tb.height);
				}
				
				this.linkHint.style.left = Math.max(0, Math.round(rs.x + (rs.width - this.linkHint.clientWidth) / 2)) + 'px';
				this.linkHint.style.top = Math.round(b + this.verticalOffset / 2 + Editor.hintOffset) + 'px';
			}
		};
		
		var vertexHandlerDestroy = mxVertexHandler.prototype.destroy;
		mxVertexHandler.prototype.destroy()
		{
			vertexHandlerDestroy.apply(this, arguments);
			
			if (this.rowMoveHandle != null)
			{
				this.rowMoveHandle.parentNode.removeChild(this.rowMoveHandle);
				this.rowMoveHandle = null;
				this.rowState = null;
			}
			
			if (this.linkHint != null)
			{
				this.linkHint.parentNode.removeChild(this.linkHint);
				this.linkHint = null;
			}

			if  (this.changeHandler != null)
			{
				this.graph.getSelectionModel().removeListener(this.changeHandler);
				this.graph.getModel().removeListener(this.changeHandler);
				this.changeHandler = null;
			}
			
			if  (this.editingHandler != null)
			{
				this.graph.removeListener(this.editingHandler);
				this.editingHandler = null;
			}
		};
		
		var edgeHandlerRedrawHandles = mxEdgeHandler.prototype.redrawHandles;
		mxEdgeHandler.prototype.redrawHandles()
		{
			// Workaround for special case where handler
			// is reset before this which leads to a NPE
			if (this.marker != null)
			{
				edgeHandlerRedrawHandles.apply(this);
		
				if (this.state != null && this.linkHint != null)
				{
					var b = this.state;
					
					if (this.state.text != null && this.state.text.bounds != null)
					{
						b = new mxRectangle(b.x, b.y, b.width, b.height);
						b.add(this.state.text.bounds);
					}
					
					this.linkHint.style.left = Math.max(0, Math.round(b.x + (b.width - this.linkHint.clientWidth) / 2)) + 'px';
					this.linkHint.style.top = Math.round(b.y + b.height + Editor.hintOffset) + 'px';
				}
			}
		};
	
		var edgeHandlerReset = mxEdgeHandler.prototype.reset;
		mxEdgeHandler.prototype.reset()
		{
			edgeHandlerReset.apply(this, arguments);
			
			if (this.linkHint != null)
			{
				this.linkHint.style.visibility = '';
			}
		};
		
		var edgeHandlerDestroy = mxEdgeHandler.prototype.destroy;
		mxEdgeHandler.prototype.destroy()
		{
			edgeHandlerDestroy.apply(this, arguments);
			
			if (this.linkHint != null)
			{
				this.linkHint.parentNode.removeChild(this.linkHint);
				this.linkHint = null;
			}
	
			if  (this.changeHandler != null)
			{
				this.graph.getModel().removeListener(this.changeHandler);
				this.graph.getSelectionModel().removeListener(this.changeHandler);
				this.changeHandler = null;
			}
		};
	})();
