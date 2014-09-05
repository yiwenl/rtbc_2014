(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var namespace = breelNS.getNamespace("generic.controllers");

	if(!namespace.KeyboardController) {

		var KeyboardController = function() {
			
		};
		namespace.KeyboardController = KeyboardController;
		var p = KeyboardController.prototype = new EventDispatcher();

		p.setup = function(aTarget) {
			var target = (aTarget === undefined) ? document : aTarget;

			this.onKeyPressBound = ListenerFunctions.createListenerFunction(this, this.onKeyPress);
			this.onKeyDownBound = ListenerFunctions.createListenerFunction(this, this.onKeyDown);
			
			ListenerFunctions.addDOMListener(target, "keypress", this.onKeyPressBound);
			ListenerFunctions.addDOMListener(target, "keydown", this.onKeyDownBound);
		};

		p.onKeyPress = function(aEvent) {
			var keyCode = aEvent.which;
			
		};

		p.onKeyDown = function(aEvent) {
			var keyCode = aEvent.keyCode;
			
		};

		KeyboardController.create = function(aTarget) {
			var newKeyboardController = new KeyboardController();
			newKeyboardController.setup(aTarget);
			return newKeyboardController;
		};
	}

})();