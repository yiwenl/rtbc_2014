// ViewParticles.js

(function() {
	var NUM_PARTICLES = 0;
	var MIN_DIST = 30;
	var DROP_THRESH = .85;
	var AUDIO_THRESH = .5;
	var W = window.innerWidth;
	var H = window.innerHeight;
	var PERLIN_SEED = Math.random() * 9999;

	ViewParticles = function(gl, idVertexShader, idFragmentShader, textures, main) {
		if(gl == undefined) return;
		this.textures = textures;
		this.texture = this.textures[Math.floor(Math.random()*this.textures.length)];
		this.main = main;
		this._isKeyDown = false;
		this._needUpdate = false;
		this.mouse = vec3.create([0, 0, 0]);
		this._particles = [];
		this._points = [];
		this._efIndex = -1;
		this._count = 0;
		this._leap = new Leap.Controller();
		View.call(this, gl, idVertexShader, idFragmentShader);
	}

	var p = ViewParticles.prototype = new View();
	var s = View.prototype;


	p._init = function() {
        var that = this;

        document.addEventListener("keydown", function(e){
        	if(e.keyCode==82 && !that._isKeyDown) {
        		console.log( "Start Recording" );
        		that._isKeyDown = true;
        		that._points = [];
        		that._particles = [];
        		that.main.clearDrops();
        		that.texture = that.textures[Math.floor(Math.random()*that.textures.length)];
        	}
        });


        document.addEventListener("mousedown", function(e){
        	if(!that._isKeyDown) {
        		console.log( "Start Recording" );
        		that._isKeyDown = true;
        		that._points = [];
        		that._particles = [];
        		that.main.clearDrops();
        		that.texture = that.textures[Math.floor(Math.random()*that.textures.length)];
        	}
        });

        document.addEventListener("keyup", function(e){
        	console.log( "Stop Recording" );
        	that._isKeyDown = false;
        });


        document.addEventListener("mouseup", function(e){
        	console.log( "Stop Recording" );
        	that._isKeyDown = false;
        });

        this._leap.loop(function(frame) {
        	that._onLeapFrame(frame);
        });


        document.addEventListener("mousemove", function(e) {
        	that._onMouseMove(e);
        })


        // var RibbonAudioController = breelNS.getClass("samsungDW.RibbonAudioController");

		// this.ribbonAudioController = new RibbonAudioController();
		// this.ribbonAudioController.setup("samples", "chime_", 12);
	};


	p._onLeapFrame = function(frame) {
		if(this._isKeyDown && frame.fingers.length > 0) {
			var pos = frame.fingers[0].stabilizedTipPosition;
			if(pos[1] < 2) return;
			var current = vec3.create([pos[0]*2, -pos[1]*2+window.innerHeight/2, -pos[2]*2]);
			if(this._points.length == 0) {
				this._points.push(current);
				this._needUpdate = true;
			} else {
				var distance = dist(current, this._points[this._points.length-1]);
				if( distance > MIN_DIST) {
					current.distance = distance;
					this._points.push(current);
					this._needUpdate = true;

					if(Math.random() > DROP_THRESH) this.main.addDrop(vec3.create(current));
				}
			}

			if(Math.random() > AUDIO_THRESH) {
				var tx = MathUtils.map(pos[0], -300, 300, 0, window.innerWidth);
				var ty = MathUtils.map(pos[1], -300, 300, 0, window.innerHeight);
				this._playSound({clientX:tx, clientY:ty});
			}
		}
	};


	p._onMouseMove = function(e) {
		if(this._isKeyDown) {
			var t = new Date().getTime() * .005;
			var z = (Perlin.noise(t, PERLIN_SEED, 0) -.5 ) * 1000;
			var current = vec3.create([e.clientX - W/2, e.clientY - H/2, z]);
			if(this._points.length == 0) {
				this._points.push(current);
				this._needUpdate = true;
			} else {
				var distance = dist(current, this._points[this._points.length-1]);
				if( distance > MIN_DIST) {
					current.distance = distance;
					this._points.push(current);
					this._needUpdate = true;

					if(Math.random() > DROP_THRESH) this.main.addDrop(vec3.create(current));
				}
			}


			if(Math.random() > AUDIO_THRESH) this._playSound(e);
		}
		
	};


	p._playSound = function(e) {
		return;
		var t = new Date().getTime() * .001;
		var offset = 1.0;
		var brightness = Perlin.noise(e.clientX/window.innerWidth*offset+t, e.clientY/window.innerHeight*offset, this._points.length * .01);
		brightness = MathUtils.contrast(brightness, .5, 1.5);
		var pan = (e.clientX/window.innerWidth-.5) * 2;
		this.ribbonAudioController.playChime(brightness, pan);
	};


	var dist = function(p0, p1) {
		var dist = vec3.create();
		vec3.subtract(p0, p1, dist);
		return vec3.length(dist);
	}


	p.updateParticles = function() {
		var points = this._points;
		// console.log("this._points : ", this._points);
		// while(points.length > 50) points.shift();
		this._particles = MathUtils.getBezierPoints(points, points.length*2);

        var dir = vec3.create();
        var z = vec3.create([0, 0, 1]);
        var mtxLeft = mat4.create();
        var mtxRight = mat4.create();
        
        mat4.identity(mtxLeft);
        mat4.identity(mtxRight);
        mat4.rotateZ(mtxLeft, -Math.PI/2);
        mat4.rotateZ(mtxRight, Math.PI/2);
        this._quads = [];
        this._normals = [];

		for (var i = 0; i < this._particles.length; i++) {
			var size = 50 + 50 * (Perlin.noise(i*.1, 0, 0) - .5);
			var left = vec3.create();
        	var right = vec3.create();
        	var normal = vec3.create();

			var p = this._particles[i];
			if(i<this._particles.length-1) {
				var pNext = this._particles[i+1];	
				vec3.subtract(pNext, p, dir);
			}

			vec3.normalize(dir);

			vec3.cross(dir, z, left);
			vec3.scale(left, size);
			vec3.scale(left, -1, right);

			// vec3.scale(dir, size);
			// mat4.multiplyVec3(mtxLeft, dir, left);
			// mat4.multiplyVec3(mtxRight, dir, right);

			vec3.cross(left, dir, normal);
			vec3.normalize(normal);

			
			vec3.add(left, p);
			vec3.add(right, p);

			this._quads.push([left, right, p]);
			this._normals.push(normal);
		};


		this.model = new bongiovi.GLModel(this.gl, (this._quads.length-1)*4*2);
		// this.model.showWireFrame = true;
        this.model.setTexture(0, this.texture);
        this.model.setAttribute(0, "aNormal", 3);

        var p0, p1, p2, p3;
        var s = 1/(this._quads.length-1);
        var vOffset = 1;
        var index = 0;
        
        for(var i=0; i<this._quads.length-1; i++) {
        	var curr = this._quads[i];
        	var next = this._quads[i+1];
        	var norm0 = this._normals[i];
        	var norm1 = this._normals[i+1];

        	// var vOffset = MathUtils.random(1, 3);
        	// vOffset = Perlin.noise(9, i*.1, 0)*10;
        	// vOffset = (i % 2 == 0) ? 3 : 1;

        	p0 = curr[2];
        	p1 = next[2];
        	p2 = next[0];
        	p3 = curr[0];

        	this.model.updateVertex(index*4+0, p0[0], p0[1], p0[2]);
        	this.model.updateVertex(index*4+1, p1[0], p1[1], p1[2]);
        	this.model.updateVertex(index*4+2, p2[0], p2[1], p2[2]);
        	this.model.updateVertex(index*4+3, p3[0], p3[1], p3[2]);

        	this.model.updateAttribute(0, index*4+0, [norm0[0], norm0[1], norm0[2]]);
            this.model.updateAttribute(0, index*4+1, [norm1[0], norm1[1], norm1[2]]);
            this.model.updateAttribute(0, index*4+2, [norm1[0], norm1[1], norm1[2]]);
            this.model.updateAttribute(0, index*4+3, [norm0[0], norm0[1], norm0[2]]);

			this.model.updateTextCoord(index*4+0, s*i, .5);
			this.model.updateTextCoord(index*4+1, s*(i+1), .5);
			this.model.updateTextCoord(index*4+2, s*(i+1), 1);
			this.model.updateTextCoord(index*4+3, s*i, 1); 

			index++;


			p0 = curr[1];
        	p1 = next[1];
        	p2 = next[2];
        	p3 = curr[2];

        	

        	this.model.updateVertex(index*4+0, p0[0], p0[1], p0[2]);
        	this.model.updateVertex(index*4+1, p1[0], p1[1], p1[2]);
        	this.model.updateVertex(index*4+2, p2[0], p2[1], p2[2]);
        	this.model.updateVertex(index*4+3, p3[0], p3[1], p3[2]);

        	this.model.updateAttribute(0, index*4+0, [norm0[0], norm0[1], norm0[2]]);
            this.model.updateAttribute(0, index*4+1, [norm1[0], norm1[1], norm1[2]]);
            this.model.updateAttribute(0, index*4+2, [norm1[0], norm1[1], norm1[2]]);
            this.model.updateAttribute(0, index*4+3, [norm0[0], norm0[1], norm0[2]]);

			this.model.updateTextCoord(index*4+0, s*i, 0);
			this.model.updateTextCoord(index*4+1, s*(i+1), 0);
			this.model.updateTextCoord(index*4+2, s*(i+1), .5);
			this.model.updateTextCoord(index*4+3, s*i, .5); 

			index++;

        }

		this.model.generateBuffer();
		this._needUpdate = false;
	};


	p.render = function(camera, projection) {
		if(this._needUpdate) this.updateParticles();
		if(this._particles.length <=0) return;
		this.shader.setParameter("pointSize", "uniform1f", 2.0 );
		this.model.render(this.shader, camera, projection);
	};


	var getRandomVec = function() {
		return vec3.create([MathUtils.random(-1, 1), MathUtils.random(-1, 1), MathUtils.random(-1, 1)]);
	}
})();