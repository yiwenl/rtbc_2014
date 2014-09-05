// ViewPost.js

(function() {
	ViewPost = function(gl, idVertexShader, idFragmentShader, textureBg) {
		if(gl == undefined) return;
		this._textureBg = textureBg;
		View.call(this, gl, idVertexShader, idFragmentShader);
	}

	var p = ViewPost.prototype = new View();
	var s = View.prototype;

	p._init = function() {
		this.matrix = mat4.create();
		mat4.identity(this.matrix);

		this.video = document.body.querySelector("#bwVideo");
		this._texVideo = new bongiovi.GLTexture(this.gl, this.video);

		this.model = new bongiovi.GLModel(this.gl, 4);
        this.model.updateVertex(0, -1, -1, .99);
        this.model.updateVertex(1,  1, -1, .99);
        this.model.updateVertex(2,  1,  1, .99);
        this.model.updateVertex(3, -1,  1, .99);

        this.model.updateTextCoord(0, 0, 0);
        this.model.updateTextCoord(1, 1, 0);
        this.model.updateTextCoord(2, 1, 1);
        this.model.updateTextCoord(3, 0, 1); 
        
        this.model.generateBuffer();
	}

	p.render = function(texture, textureBlur) {
		if(this.video.readyState!=4) return;
		this._texVideo.updateTexture(this.video);
		this.model.setTexture(0, texture);
		this.model.setTexture(1, this._texVideo);
		this.model.setTexture(2, this._textureBg);
		this.model.setTexture(3, textureBlur);
		this.model.render(this.shader, this.matrix, this.matrix);
	}
})();