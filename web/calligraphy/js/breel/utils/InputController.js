// InputController.js

(function() {

	var namespace = breelNS.getNamespace("allForThis.visualiser");
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;

	var singletons, siteManager;

	if(!namespace.InputController) {
		var InputController = function() {
			// singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			// siteManager = singletons.siteManager;
		}

		namespace.InputController = InputController;
		var p = InputController.prototype = new EventDispatcher();

		InputController.KEY_PRESSED = "keyPressed";
		InputController.MOUSE_WHEEL_SCROLLED = "mousewheelScrolled";

		p._setup = function(aUseKeyController, aUseMouseControlled, aMouseTarget) {
			this._onKeyboard = ListenerFunctions.createListenerFunction(this, this._keyBoard);
			if(aUseKeyController)
				ListenerFunctions.addDOMListener(window,"keydown",this._onKeyboard);

			this._onMouseWheelBound = ListenerFunctions.createListenerFunction(this, this._onMouseWheel);
			if(aUseMouseControlled) {
				var mouseTarget = (aMouseTarget !== undefined) ? aMouseTarget : document;
				ListenerFunctions.addDOMListener(mouseTarget,"mousewheel",this._onMouseWheelBound);
				ListenerFunctions.addDOMListener(mouseTarget,"DOMMouseScroll",this._onMouseWheelBound);
			}
		};


		p._keyBoard = function(e) {
			// console.log( "on key : ", e.keyCode );

			this.dispatchCustomEvent(InputController.KEY_PRESSED, e.keyCode);
		};

		p._onMouseWheel = function(e) {
			// console.log( "on mouse wheel : ", e.wheelDelta);
			
			this.dispatchCustomEvent(InputController.MOUSE_WHEEL_SCROLLED, e.wheelDelta);
		};

	}
	
})();