/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
// Workaround for allowing target="_blank" in HTML sanitizer
// see https://code.google.com/p/google-caja/issues/detail?can=2&q=&colspec=ID%20Type%20Status%20Priority%20Owner%20Summary&groupby=&sort=&id=1296
if (typeof html4 !== 'undefined')
{
	html4.ATTRIBS["a::target"] = 0;
	html4.ATTRIBS["source::src"] = 0;
	html4.ATTRIBS["video::src"] = 0;
	// Would be nice for tooltips but probably a security risk...
	//html4.ATTRIBS["video::autoplay"] = 0;
	//html4.ATTRIBS["video::autobuffer"] = 0;
}

// Workaround for handling named HTML entities in mxUtils.parseXml
// LATER: How to configure DOMParser to just ignore all entities?
(function()
{
	var entities = [
		['nbsp', '160'],
		['shy', '173']
    ];

	var parseXml = mxUtils.parseXml;
	
	mxUtils.parseXml = function(text)
	{
		for (var i = 0; i < entities.length; i++)
	    {
	        text = text.replace(new RegExp(
	        	'&' + entities[i][0] + ';', 'g'),
		        '&#' + entities[i][1] + ';');
	    }

		return parseXml(text);
	};
})();

// Shim for missing toISOString in older versions of IE
// See https://stackoverflow.com/questions/12907862
if (!Date.prototype.toISOString)
{         
    (function()
    {         
        function pad(number)
        {
            var r = String(number);
            
            if (r.length === 1) 
            {
                r = '0' + r;
            }
            
            return r;
        };
        
        Date.prototype.toISOString = function()
        {
            return this.getUTCFullYear()
                + '-' + pad( this.getUTCMonth() + 1 )
                + '-' + pad( this.getUTCDate() )
                + 'T' + pad( this.getUTCHours() )
                + ':' + pad( this.getUTCMinutes() )
                + ':' + pad( this.getUTCSeconds() )
                + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                + 'Z';
        };       
    }());
}

// Shim for Date.now()
if (!Date.now)
{
	Date.now = function()
	{
		return new Date().getTime();
	};
}

// Changes default colors
/**
 * Measurements Units
 */
mxConstants.POINTS = 1;
mxConstants.MILLIMETERS = 2;
mxConstants.INCHES = 3;
/**
 * This ratio is with page scale 1
 */
mxConstants.PIXELS_PER_MM = 3.937;
mxConstants.PIXELS_PER_INCH = 100;

mxConstants.SHADOW_OPACITY = 0.25;
mxConstants.SHADOWCOLOR = '#000000';
mxConstants.VML_SHADOWCOLOR = '#d0d0d0';
mxGraph.prototype.pageBreakColor = '#c0c0c0';
mxGraph.prototype.pageScale = 1;

// Letter page format is default in US, Canada and Mexico
(function()
{
	try
	{
		if (navigator != null && navigator.language != null)
		{
			var lang = navigator.language.toLowerCase();
			mxGraph.prototype.pageFormat = (lang === 'en-us' || lang === 'en-ca' || lang === 'es-mx') ?
				mxConstants.PAGE_FORMAT_LETTER_PORTRAIT : mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		}
	}
	catch (e)
	{
		// ignore
	}
})();




// Matches label positions of mxGraph 1.x
mxText.prototype.baseSpacingTop = 5;
mxText.prototype.baseSpacingBottom = 1;

// Keeps edges between relative child cells inside parent
mxGraphModel.prototype.ignoreRelativeEdgeParent = false;

// Defines grid properties
mxGraphView.prototype.gridImage = (mxClient.IS_SVG) ? 'data:image/gif;base64,R0lGODlhCgAKAJEAAAAAAP///8zMzP///yH5BAEAAAMALAAAAAAKAAoAAAIJ1I6py+0Po2wFADs=' :
	IMAGE_PATH + '/grid.gif';
mxGraphView.prototype.gridSteps = 4;
mxGraphView.prototype.minGridSize = 4;

// UrlParams is null in embed mode
mxGraphView.prototype.defaultGridColor = '#d0d0d0';
mxGraphView.prototype.gridColor = mxGraphView.prototype.defaultGridColor;

//Units
mxGraphView.prototype.unit = mxConstants.POINTS;

mxGraphView.prototype.setUnit = function(unit) 
{
	if (this.unit != unit)
	{
	    this.unit = unit;
	    
	    this.fireEvent(new mxEventObject('unitChanged', 'unit', unit));
	}
};

// Alternative text for unsupported foreignObjects
mxSvgCanvas2D.prototype.foAltText = '[Not supported by viewer]';

// Hook for custom constraints
mxShape.prototype.getConstraints = function(style, w, h)
{
	return null;
};
