(function() {

	var namespace = breelNS.getNamespace("generic.canvas");

	if(!namespace.DisplayObject) {

		var DisplayObject = function() {
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.scale = 1;
			this.alpha = 1;
		}


		namespace.DisplayObject = DisplayObject;
		var p = DisplayObject.prototype;

		p.render = function(ctx) {

		};


		p.update = function() {
			
		}
		
	}

})();