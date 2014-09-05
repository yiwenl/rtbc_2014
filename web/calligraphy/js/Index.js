// Index.js

(function() {
	var NUM_PARTICLES = 1;

	Flocking = function(container) {
		this._preIndex = -1;
		bongiovi.Scene.call(this, container);
		this._canvas.style.left = "0px";
	}

	var p = Flocking.prototype = new bongiovi.Scene();
	var s = bongiovi.Scene.prototype;


	p._init = function() {
		s._init.call(this);
		var size         = 1024*2;
		this._textOutput = new bongiovi.GLTexture(this.gl, null, size, size);

		this._textures = [];
		for(var i=0; i<5; i++) {
			var tex = new bongiovi.GLTexture(this.gl, images["brush"+i]);
			this._textures.push(tex);
		}
		this._texFloor   = new bongiovi.GLTexture(this.gl, images.floor);
		this._texDrop1   = new bongiovi.GLTexture(this.gl, images.drop01);
		this._texDrop2   = new bongiovi.GLTexture(this.gl, images.drop02);
		this._texDrop3   = new bongiovi.GLTexture(this.gl, images.drop03);
		this._texDrop4   = new bongiovi.GLTexture(this.gl, images.drop04);
		this._texDrop5   = new bongiovi.GLTexture(this.gl, images.drop05);
		this._texDrop6   = new bongiovi.GLTexture(this.gl, images.drop06);
		
		this._vParticles = new ViewParticles(this.gl, "shader-vs-particles", "shader-fs-light", this._textures, this);
		this._vBg        = new ViewBg(this.gl, "shader-vs", "shader-fs", this._texFloor);
		
		this._vDrop1     = new ViewDrops(this.gl, "shader-vs-facefront", "shader-fs-anim", this._texDrop1, .25);
		this._vDrop2     = new ViewDrops(this.gl, "shader-vs-facefront", "shader-fs-anim", this._texDrop2, .20);
		this._vDrop3     = new ViewDrops(this.gl, "shader-vs-facefront", "shader-fs-anim", this._texDrop3, .20);
		this._vDrop4     = new ViewDrops(this.gl, "shader-vs-facefront", "shader-fs-anim", this._texDrop4, .25);
		this._vDrop5     = new ViewDrops(this.gl, "shader-vs-facefront", "shader-fs-anim", this._texDrop5, .20);
		this._vDrop6     = new ViewDrops(this.gl, "shader-vs-facefront", "shader-fs-anim", this._texDrop6, .25);
		
		this._vPost      = new ViewPost(this.gl, "shader-vs", "shader-fs-post", this._texFloor);
		this._vVBlur     = new ViewBlur(this.gl, "shader-vs-vBlur", "shader-fs-blur", 256);
		this._vHBlur     = new ViewBlur(this.gl, "shader-vs-hBlur", "shader-fs-blur", 256);
		
		this._vDrops     = [this._vDrop1, this._vDrop2, this._vDrop3, this._vDrop4, this._vDrop5, this._vDrop6];
		
	};

	p.resetCamera = function() {
		this.camera      = new bongiovi.HoverCamera();
		this.camera.init(1250);
	};

	p.addDrop = function(pos) {
		var index;
		do {
			index = Math.floor(Math.random() * this._vDrops.length);
		} while(index == this._preIndex);
		this._preIndex = index;
		// console.log( "Add drop to : ", index );
		this._vDrops[index].addDrop(pos);
	};


	p.clearDrops = function() {
		// this._vDrop.clearDrops();
		for(var i=0; i<this._vDrops.length; i++) {
			this._vDrops[i].clearDrops();
		}
		this.resetCamera();
	};


	p.render = function() {
		if(!this._vParticles) return;
		s.render.call(this);

		var rangeY = .2;
		var rangeX = .2;
		var t = new Date().getTime() * .0001;
		this.camera._targetRY = this.camera.ry = Math.cos(t) * Math.PI * rangeY - Math.PI/2;
		this.camera._targetRX = this.camera.rx = Math.cos(1.76 * Math.sin(t*1)) * Math.PI * rangeX;

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._textOutput.frameBuffer);
		this.gl.viewport(0, 0, this._textOutput.frameBuffer.width, this._textOutput.frameBuffer.height);
		this.gl.clearColor(0, 0, 0, 0);
 		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		var invert = mat4.create(this.matrix);
        mat4.inverse(invert)
        var invertCamera = mat4.toInverseMat3(invert);

		this._vParticles.render(this.matrix, this.projection.matrix);

		for(var i=0; i<this._vDrops.length; i++) {
			this._vDrops[i].render(this.matrix, this.projection.matrix, invertCamera);
		}
		

		this.gl.bindTexture(this.gl.TEXTURE_2D, this._textOutput.texture);
		this.gl.generateMipmap(this.gl.TEXTURE_2D);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

		this._vVBlur.render(this._textOutput);
		this._vHBlur.render(this._vVBlur.output);

		this._vBg.render();
		this._vPost.render(this._textOutput, this._vHBlur.output);
	};


	p._onResize = function(e) {
		W = window.innerWidth;
		H = window.innerHeight;

		this._canvas.width = W;
		this._canvas.height = H;
		this.gl.viewportWidth  = W;
		this.gl.viewportHeight = H;
    	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    	this.projection.perspective(45, W/H, 1, 5000);
    	this.render();

    	this._canvas.style.position = "absolute";
	};

})();