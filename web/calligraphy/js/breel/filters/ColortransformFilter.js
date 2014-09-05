// ColortransformFilter.js

(function() {

	var namespace = breelNS.getNamespace("generic.filter");
	var Filter = namespace.Filter;

	if(!namespace.ColortransformFilter) {
		var ColortransformFilter = function() {
			this.rOffset = 0;
			this.gOffset = 0;
			this.bOffset = 0;
			this.rMultiplier = 1;
			this.gMultiplier = 1;
			this.bMultiplier = 1;
		}

		namespace.ColortransformFilter = ColortransformFilter;
		var p = ColortransformFilter.prototype = new Filter();
		var s = Filter.prototype;


		p.render = function(canvas, param) {
			this.rOffset = param[0];
			this.gOffset = param[1];
			this.bOffset = param[2];
			this.rMultiplier = param[3];
			this.gMultiplier = param[4];
			this.bMultiplier = param[5];

			s.render.call(this, canvas);
		}


		p.evaluatePixel = function(index) {
			var pos = this.coord(index);

			var curr 	= this.sample(pos.x, pos.y);
			curr.r *= this.rMultiplier;
			curr.g *= this.gMultiplier;
			curr.b *= this.bMultiplier;
			curr.r += this.rOffset;
			curr.g += this.gOffset;
			curr.b += this.bOffset;
			curr.r = constrain(curr.r, 0, 255);
			curr.g = constrain(curr.g, 0, 255);
			curr.b = constrain(curr.b, 0, 255);

			this.setPixelByIndex(index, curr.r, curr.g, curr.b, curr.a);
		}

		var constrain = function(value, min, max) {
			return Math.max( Math.min( value, max ), min );
		}
	}
	
})();