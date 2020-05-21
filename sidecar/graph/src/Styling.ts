export class Styling {
  /**
		 * 
		 */
		defaultVertexStyle = {};

		/**
		 * Contains the default style for edges.
		 */
		defaultEdgeStyle = {'edgeStyle': 'orthogonalEdgeStyle', 'rounded': '0',
			'jettySize': 'auto', 'orthogonalLoop': '1'};

		/**
		 * Returns the current edge style as a string.
		 */
		createCurrentEdgeStyle()
		{
			var style = 'edgeStyle=' + (this.currentEdgeStyle['edgeStyle'] || 'none') + ';';
			
			if (this.currentEdgeStyle['shape'] != null)
			{
				style += 'shape=' + this.currentEdgeStyle['shape'] + ';';
			}
			
			if (this.currentEdgeStyle['curved'] != null)
			{
				style += 'curved=' + this.currentEdgeStyle['curved'] + ';';
			}
			
			if (this.currentEdgeStyle['rounded'] != null)
			{
				style += 'rounded=' + this.currentEdgeStyle['rounded'] + ';';
			}

			if (this.currentEdgeStyle['comic'] != null)
			{
				style += 'comic=' + this.currentEdgeStyle['comic'] + ';';
			}

			if (this.currentEdgeStyle['jumpStyle'] != null)
			{
				style += 'jumpStyle=' + this.currentEdgeStyle['jumpStyle'] + ';';
			}

			if (this.currentEdgeStyle['jumpSize'] != null)
			{
				style += 'jumpSize=' + this.currentEdgeStyle['jumpSize'] + ';';
			}

			// Overrides the global default to match the default edge style
			if (this.currentEdgeStyle['orthogonalLoop'] != null)
			{
				style += 'orthogonalLoop=' + this.currentEdgeStyle['orthogonalLoop'] + ';';
			}
			else if (defaultEdgeStyle['orthogonalLoop'] != null)
			{
				style += 'orthogonalLoop=' + defaultEdgeStyle['orthogonalLoop'] + ';';
			}

			// Overrides the global default to match the default edge style
			if (this.currentEdgeStyle['jettySize'] != null)
			{
				style += 'jettySize=' + this.currentEdgeStyle['jettySize'] + ';';
			}
			else if (defaultEdgeStyle['jettySize'] != null)
			{
				style += 'jettySize=' + defaultEdgeStyle['jettySize'] + ';';
			}
			
			// Special logic for custom property of elbowEdgeStyle
			if (this.currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle' && this.currentEdgeStyle['elbow'] != null)
			{
				style += 'elbow=' + this.currentEdgeStyle['elbow'] + ';';
			}
			
			if (this.currentEdgeStyle['html'] != null)
			{
				style += 'html=' + this.currentEdgeStyle['html'] + ';';
			}
			else
			{
				style += 'html=1;';
			}
			
			return style;
    };
  }