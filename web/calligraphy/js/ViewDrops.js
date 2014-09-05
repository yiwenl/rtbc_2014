// ViewDrops.js

(function() {
	ViewDrops = function(gl, idVertexShader, idFragmentShader, texture, coordOffset) {
		if(gl == undefined) return;
		this.texture = texture;
		this._needUpdate = false;
		this.particles = [];
		this._count = 0;
		this.coordOffset = coordOffset;
		View.call(this, gl, idVertexShader, idFragmentShader);
	}

	var p = ViewDrops.prototype = new View();
	var s = View.prototype;


	p._init = function() {	};


	p.addDrop = function(pos) {
		// console.log( "Add Drop", vec3.str(pos) );
		pos.startCount = this._count;
		pos.size = MathUtils.random(100, 250);
		pos.rotation = Math.random() * Math.PI * 2;
		this.particles.push(pos);
		this.updateParticles();
	};


	p.clearDrops = function() {
		this.particles = [];
	};


	p.updateParticles = function() {
		this._numParticles = this.particles.length;
		this.model = new bongiovi.GLModel(this.gl, this._numParticles * 4);
		this.model.setAttribute(0, "sizeOffset", 2);
		this.model.setAttribute(1, "animCount", 3);
		var tx, ty, tz;
		var scale = 720/480;

		for ( var i=0; i<this._numParticles; i++) {
			var p = this.particles[i];
			var size = p.size;
			tx = p[0];
			ty = p[1];
			tz = p[2];

			this.model.updateVertex(i*4+1, tx, ty, tz);
			this.model.updateVertex(i*4+2, tx, ty, tz);
			this.model.updateVertex(i*4+3, tx, ty, tz);
			this.model.updateVertex(i*4+0, tx, ty, tz);
            
            this.model.updateAttribute(0, i*4+0, [-size*scale,  -size]);
            this.model.updateAttribute(0, i*4+1, [ size*scale,  -size]);
            this.model.updateAttribute(0, i*4+2, [ size*scale,   size]);
            this.model.updateAttribute(0, i*4+3, [-size*scale,   size]);

            this.model.updateAttribute(1, i*4+0, [p.startCount, 0,	p.rotation]);
            this.model.updateAttribute(1, i*4+1, [p.startCount, 0,	p.rotation]);
            this.model.updateAttribute(1, i*4+2, [p.startCount, 0,	p.rotation]);
            this.model.updateAttribute(1, i*4+3, [p.startCount, 0,	p.rotation]);


            this.model.updateTextCoord(i*4,   0, 0);
            this.model.updateTextCoord(i*4+1, 1/4, 0);
            this.model.updateTextCoord(i*4+2, 1/4, 1/4);
            this.model.updateTextCoord(i*4+3, 0, 1/4); 
		}

		this.model.setTexture(0, this.texture);

		this.model.generateBuffer();
	};


	p.render = function(camera, projection, invertCamera) {
		this._count ++;
		if(this.particles.length == 0) return;

		this.shader.setParameter("invertCamera", "uniformMatrix3fv", invertCamera);
        this.shader.setParameter("count", "uniform1f", this._count);
        this.shader.setParameter("coordOffset", "uniform1f", this.coordOffset);
		this.model.render(this.shader, camera, projection);
	};


})();