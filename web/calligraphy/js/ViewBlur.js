// ViewBlur.js

(function() {
	ViewBlur = function(gl, idVertexShader, idFragmentShader, size) {
		if(gl == undefined) return;
		
		View.call(this, gl, idVertexShader, idFragmentShader);
		this.output = new bongiovi.GLTexture(this.gl, null, size, size);
	}

	var p = ViewBlur.prototype = new View();
	var s = View.prototype;

	p._init = function() {
		this.matrix = mat4.create();
		mat4.identity(this.matrix);

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
	};


	p.render = function(texture) {
		this.model.setTexture(0, texture);
		this.model.render(this.shader, this.matrix, this.matrix, this.output);
	};
})();