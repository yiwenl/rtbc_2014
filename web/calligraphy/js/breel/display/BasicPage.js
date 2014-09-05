// BasicPage.js

(function() {
	// IMPORTS
	var namespace = breelNS.getNamespace("powerOfSound.display");
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var StateManager = breelNS.getNamespace("generic.core").StateManager;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	if(!namespace.BasicPage) {
		var BasicPage = function() {
			this.container = document.createElement("div");
			this.isOpened = false;
			this._onResizeBound = ListenerFunctions.createListenerFunction(this, this._onResize);
			ListenerFunctions.addDOMListener(window, "resize", this._onResizeBound);
		}

		namespace.BasicPage = BasicPage;
		var p = BasicPage.prototype = new EventDispatcher();


		p.setParams = function(params) {
			
		};

		p.initialize = function() {
		};


		p.open = function() {
			this.setOpened();
		};


		p.close = function() {
			this.setClosed();
		};


		p.setOpened = function() {
			this.isOpened = true;
			this.dispatchCustomEvent( StateManager.END_PAGE_OPEN, {page:this} );
		};


		p.setClosed = function() {
			this.isOpened = false;
			this.dispatchCustomEvent( StateManager.END_PAGE_CLOSE, {page:this} );
			this.destroy();
		};


		p.destroy = function() {
			ListenerFunctions.removeDOMListener(window, "resize", this._onResizeBound);
		};


		p._onResize = function(e) {
		};


		p.getContainer = function() {	return this.container;	};
	}
	
})();