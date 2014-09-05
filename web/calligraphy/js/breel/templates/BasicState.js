// BasicState.js

(function() {
	// IMPORTS
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var StateManager = breelNS.getNamespace("generic.core").StateManager;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var ButtonAttacher = breelNS.getNamespace("generic.templates").ButtonAttacher;
	
	var namespace = breelNS.getNamespace("generic.templates");

	if(!namespace.BasicState) {
		var BasicState = function(aId, aParentNode, aTemplate) {
			//console.log("aId : "+aId +" aParentNode : ", aParentNode+ " aTemplate : ", aTemplate);
			this.id = aId;
			this.parentContainer = aParentNode;
			this.container = aTemplate;
			
			this.isOpened = false;

			this.buttons = {};
		}

		namespace.BasicState = BasicState;
		var p = BasicState.prototype = new ButtonAttacher();


		p.setParams = function(params) {
			
		};

		p.initialize = function() {
			this.parentContainer.appendChild(this.container);

			this._onResizeBound = ListenerFunctions.createListenerFunction(this, this._onResize);
			ListenerFunctions.addDOMListener(window, "resize", this._onResizeBound);
		};


		p.open = function() {
			this.setOpened();
		};


		p.close = function(aParams) {
			this.setClosed(aParams);
		};


		p.setOpened = function() {
			this.isOpened = true;
			this.dispatchCustomEvent( StateManager.END_STATE_OPEN, {state:this} );
		};


		p.setClosed = function(aParams) {
			this.isOpened = false;
			this.dispatchCustomEvent( StateManager.END_STATE_CLOSE, {state:this, params : aParams} );
			this.destroy();
		};

		p.animateOpacity = function(aDir, aStartOpacity, aTargetOpacity, aTime, aEasing, aDelay, aCallback) {

			aTime = (aTime === undefined) ? 1 : aTime;
			aDelay = (aDelay === undefined) ? 0 : aDelay;
			aEasing = (aEasing === undefined) ? TweenHelper.sin.EaseIn : aEasing;

			switch(aDir) {
				case "in":
					aStartOpacity = (aStartOpacity === undefined)  ? 0 : aStartOpacity;
					aTargetOpacity = (aTargetOpacity === undefined) ? 1 : aTargetOpacity;

					DomElementOpacityTween.createWithAnimation(this.container, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback);
				break;
				case "out":
					aStartOpacity = (aStartOpacity === undefined)  ? 1 : aStartOpacity;
					aTargetOpacity = (aTargetOpacity === undefined) ? 0 : aTargetOpacity;

					DomElementOpacityTween.createWithAnimation(this.container, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback);
				break;
			}
		};

		p.destroy = function() {
			ListenerFunctions.removeDOMListener(window, "resize", this._onResizeBound);
			this.removeButtonListeners();
		};


		p._onResize = function(e) {
		};


		p.getContainer = function() {	return this.container;	};
		p.getParentContainer = function() {	return this.parentContainer;	};

	}
	
})();