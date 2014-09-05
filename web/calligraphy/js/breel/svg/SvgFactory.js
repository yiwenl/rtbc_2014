(function() {

	var namespace = breelNS.getNamespace("generic.svg");

	if(!namespace.SvgFactory) {

		var SvgFactory = function SvgFactory() {
		
		}

		namespace.SvgFactory = SvgFactory;
		SvgFactory.svgns = "http://www.w3.org/2000/svg";

		SvgFactory.createSvg = function(aId, aWidth, aHeight) {
			var svg = document.createElementNS(SvgFactory.svgns, "svg");
			if(aId !== undefined) svg.setAttributeNS(null, "id", aId);
			if(aWidth !== undefined) svg.setAttributeNS(null, "width", aWidth);
			if(aHeight !== undefined) svg.setAttributeNS(null, "height", aHeight);
			if(aWidth !== undefined && aHeight !== undefined) {
				// svg.setAttributeNS(null, "viewbox", "0 0 "+aWidth+" "+aHeight);
			}

			return svg;
		};

		SvgFactory.createSvgElement = function(aType, aAttributes) {
			/* LVNOTE : 
				aType e.g "circle", "line", "svg"
				Atrributes eg. 
					var atrributs = {
						x1 : 50
						y1 : 50
						x2 : 100
						x3 : 100
					}
			*/
		
			var el = document.createElementNS(SvgFactory.svgns, aType);

			for(var att in aAttributes) {
				el.setAttributeNS(null, att, aAttributes[att])
			}

			return el;
		};

		SvgFactory.createSvgDef = function() {
			var def = document.createElementNS("http://www.w3.org/2000/svg", "def");
			return def;
		};

		SvgFactory.createLinerGradientTopBottom = function(aId, aColorTop, aColorBottom) {
			var grad = document.createElementNS(SvgFactory.svgns, "linearGradient");
			grad.setAttributeNS(null, "id", aId);
			grad.setAttributeNS(null, "x1", "0%");
			grad.setAttributeNS(null, "x2", "0%");
			grad.setAttributeNS(null, "y1", "0%");
			grad.setAttributeNS(null, "y2", "100%");

			var stopOne = document.createElementNS(SvgFactory.svgns, "stop");
			stopOne.setAttributeNS(null, "offset", "0%");
			stopOne.setAttributeNS(null, "stop-color", aColorTop);
			grad.appendChild(stopOne);

			var stopTwo = document.createElementNS(SvgFactory.svgns, "stop");
			stopTwo.setAttributeNS(null, "offset", "0%");
			stopTwo.setAttributeNS(null, "stop-color", aColorBottom);
			grad.appendChild(stopTwo);

			return grad;
		};

		SvgFactory.createSvgCircle = function(aX, aY, aRadius, aFill, aStroke, aStrokeWidth) {
			var el = document.createElementNS(SvgFactory.svgns, "circle");
			el.setAttribute("cx", aX);
			el.setAttribute("cy", aY);
			el.setAttribute("r", aRadius);

			if(aFill !== undefined)
				el.setAttributeNS(null, "fill", aFill);

			if(aStroke !== undefined) {
				el.setAttributeNS(null, "stroke", aStroke);
				
				if(aStrokeWidth !== undefined)
					el.setAttributeNS(null, "stroke-width", aStrokeWidth);
				else
					el.setAttributeNS(null, "stroke-width", "1");
			}

			return el;
		};

		SvgFactory.createRect = function(aX, aY, aWidth, aHeight) {
			var el = document.createElementNS(SvgFactory.svgns, "rect");
			el.setAttributeNS(null, 'x', aX);
			el.setAttributeNS(null, 'y', aY);
			el.setAttributeNS(null, 'width', aWidth);
			el.setAttributeNS(null, 'height', aHeight);

			return el;
		};

		SvgFactory.createLine = function(aXf, aYf, aXt, aYt, aStrokeWidth, aStroke, aCap) {
			var el = document.createElementNS(SvgFactory.svgns, "line");
			el.setAttributeNS(null, 'x1', aXf);
			el.setAttributeNS(null, 'y1', aYf);
			el.setAttributeNS(null, 'x2', aXt);
			el.setAttributeNS(null, 'y2', aYt);
			if(aStrokeWidth !== undefined)
				el.setAttributeNS(null, 'stroke-width', aStrokeWidth);
			else
				el.setAttributeNS(null, 'stroke-width', '1');

			if(aStroke !== undefined) el.setAttributeNS(null, 'stroke', aStroke);

			if(aCap !== undefined) el.setAttributeNS(null, "stroke-linecap", aCap)

			return el;
		};

		SvgFactory.fillElement = function(aElement, aFill) {
			if(aElement === undefined || aFill === undefined) {
				console.log("no element or fill set");
				return;
			}

			aElement.setAttributeNS(null, "fill", aFill);
		};
		SvgFactory.gradientFillElement = function(aElement, aFill) {
			if(aElement === undefined || aFill === undefined) {
				console.log("no element or fill set");
				return;
			}

			aElement.setAttributeNS(null, "fill", "url(#"+aFill+")");
		};
	}

})();