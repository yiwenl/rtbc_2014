(function() {

	var namespace = breelNS.getNamespace("generic.canvas");

	if(!namespace.SimpleCamera) {
		var SimpleCamera = function SimpleCamera() {
			this.matrix = mat4.create();
			mat4.identity(this.matrix);

			this.x = 0;
			this.y = 0;
			this.z = 0;

			this.target = vec3.create([0, 0, 0]);
			this.up = vec3.create([0, -1, 0]);
			this.eye = vec3.create([0, 0, 0]);
		}

		namespace.SimpleCamera = SimpleCamera;
		var p = SimpleCamera.prototype;

		p.update = function() {
			mat4.identity(this.matrix);
			// var eye = vec3.create([this.x, this.y, this.z]);
			this.eye[0] = this.x;
			this.eye[1] = this.y;
			this.eye[2] = this.z;
			this.matrix = mat4.lookAt(this.eye, this.target, this.up);
			return this.matrix;
		};

	}
	
})();