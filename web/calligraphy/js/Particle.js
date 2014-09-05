// Particle.js

(function() {
	Particle = function(pos, vel) {
		this.pos    = pos;
		this.vel    = vel;
		this.acc    = vec3.create([0, 0, 0]);
		
		this.radius = 2.0;
		this.decay  = .99;
	}

	var p = Particle.prototype;

	p.pullToCenter = function(center) {
		var dirToCenter = vec3.create();
		vec3.subtract(this.pos, center, dirToCenter);		
		var distToCenter = vec3.length(dirToCenter);
		var maxDistance = 300;

		if(distToCenter > maxDistance) {
			vec3.normalize(dirToCenter);
			var pullStrength = (distToCenter - maxDistance) * .0001;
			vec3.scale(dirToCenter, pullStrength);
			vec3.subtract(this.vel, dirToCenter);
		}
	};

	p.update = function() {
		vec3.add(this.vel, this.acc);
		vec3.add(this.pos, this.vel);
		vec3.scale(this.vel, this.decay);
		this.acc    = vec3.create([0, 0, 0]);
	};
})();