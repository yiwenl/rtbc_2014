// HSLFilter.js

(function() {

	var namespace = breelNS.getNamespace("generic.filter");
	var Filter = namespace.Filter;

	if(!namespace.HSLFilter) {
		var HSLFilter = function() {
			this.hOffset = 0;
			this.sOffset = 0;
			this.lOffset = 0;
		}

		namespace.HSLFilter = HSLFilter;
		var p = HSLFilter.prototype = new Filter();
		var s = Filter.prototype;


		p.render = function(canvas, param) {
			this.hOffset = params[0];
			this.sOffset = params[1];
			this.lOffset = params[2];

			s.render.call(this, canvas);
		}


		p.evaluatePixel = function(index) {
			var pos = this.coord(index);
			var curr = this.sample(pos.x, pos.y);

			var hsl = rgb2hsl(curr.r, curr.g, curr.b);
			hsl.h += this.hOffset;
			hsl.s += this.sOffset;
			hsl.l += this.lOffset;

			if(hsl.h >= 360) hsl.h -= 360;
			if(hsl.s >= 100) hsl.s -= 100;
			if(hsl.l >= 100) hsl.l -= 100;

			var rgb = hsl2Rgb(hsl.h, hsl.s, hsl.l);
			this.setPixelByIndex(index, rgb.r, rgb.g, rgb.b, curr.a);
		}
		

		var rgb2hsl = function(r,g,b) {
			var maxJ = Math.max(r,g,b);
			var minJ = Math.min(r,g,b);
			var _max = maxJ-minJ;
			if(r == g && g == b) {
				H = 0;
				S = 0;
			} else {
				switch(maxJ) {
					case r:
						H = (g-b)/_max;
						break;
					case g:
						H = 2 + (b-r)/_max;
						break;
					case b:
						H = 4 + (r-g)/_max;
						break;
				}

				H *= 60;
				if(H < 0) H += 360;
				H = Math.round(H);
				S = Math.round(100*(maxJ - minJ)/maxJ);
			}
			V = Math.round(100*maxJ/255);

			return {h:H, s:S, l:V};
		}


		var hsl2Rgb = function (h, s, v) {
			var r, g, b;
			var i;
			var f, p, q, t;
			
			h = Math.max(0, Math.min(360, h));
			s = Math.max(0, Math.min(100, s));
			v = Math.max(0, Math.min(100, v));
			
			s /= 100;
			v /= 100;

			if(s == 0) {
				r = g = b = v;
				return { r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255) };
			}
			
			h /= 60; // sector 0 to 5
			i = Math.floor(h);
			f = h - i; // factorial part of h
			p = v * (1 - s);
			q = v * (1 - s * f);
			t = v * (1 - s * (1 - f));

			switch(i) {
				case 0:
					r = v;
					g = t;
					b = p;
					break;
					
				case 1:
					r = q;
					g = v;
					b = p;
					break;
					
				case 2:
					r = p;
					g = v;
					b = t;
					break;
					
				case 3:
					r = p;
					g = q;
					b = v;
					break;
					
				case 4:
					r = t;
					g = p;
					b = v;
					break;
					
				default: // case 5:
					r = v;
					g = p;
					b = q;
			}
			
			return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255)};
		}
	}
	
})();