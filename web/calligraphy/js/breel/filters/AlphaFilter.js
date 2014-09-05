// AlphaFilter.js

(function() {

	var namespace = breelNS.getNamespace("generic.filter");
	var Filter = namespace.Filter;

	if(!namespace.AlphaFilter) {
		var AlphaFilter = function() {
			
		}

		namespace.AlphaFilter = AlphaFilter;
		var p = AlphaFilter.prototype = new Filter();
		var s = Filter.prototype;


		p.render = function(canvas, alphaChannel) {
			this.alphaChannel = alphaChannel;
			s.render.call(this, canvas);
		}


		p.evaluatePixel = function(index) {
			var pos = this.coord(index);
			var color = this.sample(pos.x, pos.y);
			var alpha = this.sample(pos.x, pos.y, this.alphaChannel);

			this.setPixelByIndex(index, color.r, color.g, color.b, alpha.r);
		}
	}

})();