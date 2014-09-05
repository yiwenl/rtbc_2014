(function() {
	Filter = function() {
		this._imgData = null;
		this._pixels = [];
		this._ctx;
		this._canvas;
		this._width;
		this._height;
	}

	var p = Filter.prototype;
	// var zero = {r:0, g:0, b:0, a:0};


	p.render = function(canvas, params) {
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._width = this._canvas.width;
		this._height = this._canvas.height;
		this._imgData = this._ctx.getImageData(0, 0, this._width, this._height);
		this._pixels = this._imgData.data;

		for ( var i=0; i<this._pixels.length; i+=4) {
			this.evaluatePixel(i);
		}

		this._ctx.putImageData(this._imgData, 0, 0);
	}


	p.evaluatePixel = function(index) {
	}


	p.setPixelByIndex = function(index, r, g, b, a) {
		this._pixels[index] = r;
		this._pixels[index+1] = g;
		this._pixels[index+2] = b;
		this._pixels[index+3] = a;
	}


	p.setPixelByPosition = function(x, y, r, g, b, a) {
		var index = this.posToIndex(x, y);
		this.setPixelByIndex(index);
	}


	p.coord = function(index) {
		var posIndex = index/4;
		var x = posIndex % this._width;
		var y = Math.floor(posIndex / this._width);
		// if(index == 40) console.log( x, y );
		return {x:x, y:y};
	}


	p.posToIndex = function(x, y) {
		var posIndex = x + y * this._width;
		return posIndex * 4;
	}


	p.sample = function(x, y, source) {
		if(source == undefined) source = this._pixels;
		var rnd = Math.random();
		var index = this.posToIndex(x, y);

		if(x < 0 || x >= this._width || y < 0 || y >= this._height) {
			// if(rnd > .95) console.log( "Return Zero : " , x + ", " + y);
			var zero = {x:x, y:y, r:0, g:0, b:0, a:0};
			return zero;
		} else {
			
			var o = {x:x, y:y, index:index, r:source[index], g:source[index+1], b:source[index+2], a:source[index+3]}; 
			// if(rnd > .95) console.log( "Return Pixel : " , x + ", " + y);
			return o;
		}
	}
})();