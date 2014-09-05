(function() {

	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.AnimationManager) {

		var AnimationManager = function AnimationManager() {
			this._init();
		};

		namespace.AnimationManager = AnimationManager;
		var p = AnimationManager.prototype;

		p._init = function() {
			this._onRequestAnimationFrameBound = null;

			return this;
		};

		p.setup = function() {
			this._onRequestAnimationFrameBound = ListenerFunctions.createListenerFunction(this, this._onRequestAnimationFrame);
			requestAnimFrame(this._onRequestAnimationFrameBound);
		};

		p._onRequestAnimationFrame = function() {
			TWEEN.update();

			requestAnimFrame(this._onRequestAnimationFrameBound);
		};

		AnimationManager.create = function() {
			var newAnimationManager = new AnimationManager();
			newAnimationManager.setup();
			return newAnimationManager;
		};
	}

})();