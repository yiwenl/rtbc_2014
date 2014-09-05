(function() {

	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var namespace = breelNS.getNamespace("generic.controllers");

	if(!namespace.MouseMoveController) {

		var MouseMoveController = function() {

			this.container = null;
			this._moveTimeout = null;
			this._isMoving = false;
			this._moveTimeDelay = 1000;
		}

		namespace.MouseMoveController = MouseMoveController;
		var p = MouseMoveController.prototype;

		p.setup = function(aContainer) {
			// console.log("MouseMoveController :: aContainer : ", aContainer);
			this.container = aContainer;

			this.onMouseMoveBound = ListenerFunctions.createListenerFunction(this, this.onMouseMove);
			ListenerFunctions.addDOMListener(this.container, "mousemove", this.onMouseMoveBound);
		};

		p.onMouseMove = function() {
			var that = this;

			if(this._moveTimeout !== null) {
				clearTimeout(this._moveTimeout);	
			}
			
			this._moveTimeout = setTimeout(function() {
				that.mouseIsStationary();
			}, this._moveTimeDelay);

			if(!this._isMoving)
				this.mouseIsMoving();
		};

		p.mouseIsMoving = function() {
			this._isMoving = true;
		};

		p.mouseIsStationary = function() {
			this._isMoving = false;
		};

		MouseMoveController.create = function(aContainer) {
			var newMouseMoveController = new MouseMoveController();
			newMouseMoveController.setup(aContainer);
			return newMouseMoveController;
		};
	}
})();