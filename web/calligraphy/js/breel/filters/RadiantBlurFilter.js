// RadiantBlurFilter.js

(function() {
	RadiantBlurFilter = function() {
		this._blur = null;
	}

	var p = RadiantBlurFilter.prototype = new Filter();
	var s = Filter.prototype;


	p.render = function(canvas, param) {
		this._blur = param.blurImage;
		this.center = param.center;
		this.radius = param.radius;
		this.direction = param.direction;
		this.offset = param.offset;
		s.render.call(this, canvas, param);
	};


	p.evaluatePixel = function(index) {
		var pos = this.coord(index);

		var color = this.sample(pos.x, pos.y);
		var colorBlur = this.sample(pos.x, pos.y, this._blur);
		var offset = this.distance(pos, this.center) / this.radius;
		// if(Math.random() > .99) {
		// 	console.log( this.distance(pos, this.center), this.radius );
		// } 
		if(offset > 1) offset = 1;
		offset = 1.0-pos.x / 400;

		var dist = this.distance(pos, this.center);
		offset = dist / this.radius;
		if(offset > 1) offset = 1;

		offset *= this.offset;

		var r = color.r * offset + colorBlur.r * ( 1 - offset);
		var g = color.g * offset + colorBlur.g * ( 1 - offset);
		var b = color.b * offset + colorBlur.b * ( 1 - offset);
		var a = color.a * offset + colorBlur.a * ( 1 - offset);


		this.setPixelByIndex(index, r, g, b, a);
	};


	p.distance = function(p0, p1) {
		var diffx = p1.x - p0.x;
		var diffy = p1.y - p0.y;
		return Math.sqrt(diffx*diffx + diffy*diffy);
	};

})();