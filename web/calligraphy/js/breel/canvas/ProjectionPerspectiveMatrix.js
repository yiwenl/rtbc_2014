(function() {

	var namespace = breelNS.getNamespace("generic.canvas");

	if(!namespace.ProjectionPerspectiveMatrix) {

		var ProjectionPerspectiveMatrix = function ProjectionPerspectiveMatrix() {
			this.matrix = mat4.create();
			mat4.identity(this.matrix);
		}

		namespace.ProjectionPerspectiveMatrix = ProjectionPerspectiveMatrix;
		var p = ProjectionPerspectiveMatrix.prototype;

		p.perspective = function(fov, aspect, near, far) {
			this.matrix = mat4.perspective(fov, aspect, near, far);
		};
		
	}

})();