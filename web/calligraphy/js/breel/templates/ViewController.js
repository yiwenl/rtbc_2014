(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ElementUtils = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var DomElementPositionTween = breelNS.getNamespace("generic.animation").DomElementPositionTween;
	var TweenHelper = breelNS.getNamespace("generic.animation").TweenHelper;

	var namespace = breelNS.getNamespace("generic.templates");

	var singletons, siteManager;

	if(!namespace.ViewController) {
		var ViewController = function() {

			this._controllerId = null;
			this._isMobile = false;
			this._isTablet = false;

			this._element = document.createElement("div");
			this._element.className="controller";
			this.loaded = false;
			this._isInDOM = false;

			this._controllers = {};
			this._numberOfControllersInStateChange = 0;
			this._numberOfControllersChangedState = 0;

			this._clickEventName = null;
			this._supportedTransformProperty = "";
			this._supportsCssTransitions = false;

			this.hideFinishedEvent = null;

			this._hideFinishedTimeout = null;
			this._removeDomTimeout = null;
			this._isHiding = false;

			this._subControllerRequestAddToDomBound = ListenerFunctions.createListenerFunction(this, this._subControllerRequestAddToDom);
			this._subControllerRequestRemoveFromDomBound = ListenerFunctions.createListenerFunction(this, this._subControllerRequestRemoveFromDom);
			this._subControllerChangedStateBound = ListenerFunctions.createListenerFunction(this, this._subControllerChangedState);

		};

		namespace.ViewController = ViewController;

		ViewController.REQUEST_ADD_TO_DOM = "viewControllerAddToDom";
		ViewController.REQUEST_REMOVE_FROM_DOM = "viewControllerRemoveFromDom";

		ViewController.STATE_CHANGED = "viewControllerStateChanged";

		ViewController.HIDE_FINISHED = "controllerHideFinished";
		ViewController.REQUEST_IFRAME_CHANGE_HEIGHT = "controllerRequestChangeHeight";

		ViewController.LAYOUT_FINISHED = 'layoutFinished';

		var p = ViewController.prototype = new EventDispatcher();

		p.setup = function(aControllerID) {		

			singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			siteManager = singletons.siteManager;
			this._isMobile = singletons.browserDetector.getIsMobileDevice();
			this._isTablet = singletons.browserDetector.getIsTabletDevice();

			this._supportsCssTransitions = singletons.browserDetector.supportsCSSTransitions();

			this._setID(aControllerID);
			this._element.id = this.getID();

			this._clickEventName = singletons.browserDetector.getButtonClickEventName(true);
			this._buttonClickEventName = singletons.browserDetector.getButtonClickEventName(true);
			
			this._supportedTransformProperty = singletons.browserDetector.getSupportedTransformProperty();

			return this;
		};

		p._setID = function(aID) { 
			this._controllerID = aID;
		}

		p.getID = function() { 
			return this._controllerID; 
		}

		p.hasSubController = function(aControllerID) {
			return typeof(this._controllers[aControllerID]) != "undefined";
		};

		p.getController = function(aControllerID) {
			return this._controllers[aControllerID];
		}

		p.addSubController = function(aViewControllerObject, aControllerID) {

			if (!aControllerID) aControllerID = aViewControllerObject.getElement().getAttribute("id");


			if (!this._controllers[aControllerID]){				
				this._controllers[aControllerID] = aViewControllerObject;	
				aViewControllerObject.addEventListener(ViewController.REQUEST_ADD_TO_DOM, this._subControllerRequestAddToDomBound);
				aViewControllerObject.addEventListener(ViewController.REQUEST_REMOVE_FROM_DOM, this._subControllerRequestRemoveFromDomBound);
			}

		};



		p._subControllerChangedState = function(aEvent) {

			var controller = aEvent.detail.controller;
			controller.removeEventListener(ViewController.STATE_CHANGED, this._subControllerChangedStateBound);
			this._numberOfControllersChangedState++;
			if (this._numberOfControllersChangedState == this._numberOfControllersInStateChange) {

				this._numberOfControllersChangedState = 0;
				this._numberOfControllersInStateChange = 0;

				// console.log(this._controllerID + " reporting changed state");
				this.dispatchCustomEvent(ViewController.STATE_CHANGED, { controller : this});
			}
		};

		p._subControllerRequestAddToDom = function(aEvent) {
			var controllerID = aEvent.detail.controller.getID();
			if(this._controllers[controllerID]){
				this._addSubControllerToDom(controllerID);
			}
		};	

		p._addSubControllerToDom = function(aControllerID) {

			// default
			var controller = this._controllers[aControllerID];
			this._element.appendChild(controller.getElement());

			// override this method to handle individual controllers
			// and where they are put in the DOM
		};

		

		p._subControllerRequestRemoveFromDom = function(aEvent) {
			var controller = aEvent.detail.controller;
			var controllerID = controller.getID();
			if (controller) {
				var element = controller.getElement();
				if (element){
					if (element.parentNode)
					{
						element.parentNode.removeChild(element);
					}
					else console.warn("Error : Sub controller " + controllerID + " requested removal when it is not in DOM");
					
				} else console.warn("Error : Sub controller " + controllerID + " requested removal when it has no element");
			} else console.warn("Error : Unknown Sub controller " + controllerID + " requested removal");
		};

		p.getViewControllerId = function() {
			return this._controllerId;	
		};

		p.getElement = function() {
			return this._element;
		};

		p.load = function() {

			this.loaded = true;
		};

		p.controllerWillShow = function() {
			
		};

		p.applyState = function(aState) {

			// console.log("applying state : ", aState, " to " + this._controllerID );

			this._numberOfControllersInStateChange = 0;
			this._numberOfControllersChangedState = 0;

			// apply state to this controller, ignoring filtered values
			var hasPendingStateChange = false;
			for (var stateParam in aState){
				if (stateParam != "controllers"){
					switch(stateParam){
						case "visible":
							var newVisibility = aState[stateParam];
							if (newVisibility && !this._isInDOM) {
								hasPendingStateChange = true;
								this.show();
							}
							else if (!newVisibility && this._isInDOM){
								hasPendingStateChange = true;
								this.hide();
							}
						break;

						case "params":
							hasPendingStateChange = this.setParams(aState[stateParam]);
						break;
					}
				}
			}
						
			this._numberOfControllersInStateChange = 0;
			if (aState.controllers)
			{	
				var subControllers = aState.controllers;

				// count subcontrollers in state
				for (var controllerID in subControllers)
					this._numberOfControllersInStateChange++;
				
				for (var controllerID in subControllers)
				{				
					var subController = this._controllers[controllerID];
					subController.addEventListener(ViewController.STATE_CHANGED, this._subControllerChangedStateBound);
					var controllerHasPendingStateChange = subController.applyState(subControllers[controllerID]);

					hasPendingStateChange = controllerHasPendingStateChange;
					
				}
			} else this._numberOfControllersInStateChange = 0;
			

			if (!hasPendingStateChange){
				
				this.dispatchCustomEvent( ViewController.STATE_CHANGED, {controller:this} );
			}
			return hasPendingStateChange;
		};




		
		p.setParams = function(params) {
			

			return false;
		};

		p.show = function() {		

			// console.log(this.getID() + " called .show");	
		
			if (this._element) ElementUtils.addClass(this._element, "active");
			this._isHiding = false;
			this.requestAddToDOM();
			this._isInDOM = true;
		};

		p.showFinished = function() {	
			this.dispatchCustomEvent( ViewController.STATE_CHANGED, {controller:this} );
			this.dispatchCustomEvent( ViewController.SHOW_FINISHED, {controller:this} );
		};

		p.hide = function(aHideEvent) {
			
			// console.log(this.getID() + " called .hide");	
			if (this._isHiding) return;
			this._isHiding = true;

			if(aHideEvent != undefined) this.hideFinishedEvent = aHideEvent;
		
			if (this._element) ElementUtils.removeClass(this._element, "active");
		};

		p.hideFinished = function() {
			// console.log(this.getID() + " :: hideFinished");

			if (this._element) ElementUtils.removeClass(this._element, "active");

			this.dispatchCustomEvent( ViewController.HIDE_FINISHED, {controller:this} );
			this.dispatchCustomEvent( ViewController.STATE_CHANGED, {controller:this});
			this.requestRemoveFromDOM();
			this._isInDOM = false;
		};

		p.requestIFrameChangeHeight = function(aNewHeight) {
			this.dispatchCustomEvent(ViewController.REQUEST_IFRAME_CHANGE_HEIGHT, aNewHeight);
		};

		p.animateOpacity = function(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback) {

			DomElementOpacityTween.createWithAnimation(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback);	

			// if (this._supportsCssTransitions){	
			// 	singletons.cssTransitionHelper.fromTo(aElement, {
			// 		opacity : aStartOpacity
			// 	}, {
			// 		opacity : aOpacity
			// 	}, { ease : 'easeOutSine', duration : aTime, delay : aDelay});

			// 	if (aCallback && typeof(aDelay) != "undefined"){
			// 			setTimeout(function() {
			// 				aCallback();
			// 			}.bind(this), aDelay);
			// 	}
			

			// } else {
			// 	DomElementOpacityTween.createWithAnimation(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback);	
			// }

			
		};
		p.animatePosition = function(aElement, aStartX,aStartY, aEndX,aEndY, aTime, aEasing, aDelay, aCallback) {
			// console.log("animatePosition : ", aElement, aStartX,aStartY, aEndX,aEndY, aTime, aEasing, aDelay, aCallback);
			DomElementPositionTween.createWithAnimation(aElement, aStartX,aStartY, aEndX,aEndY, aTime, aEasing, aDelay, aCallback);
		};

		p.requestAddToDOM = function() {
			if (!this._isInDOM){				
				this.dispatchCustomEvent(ViewController.REQUEST_ADD_TO_DOM, { controller : this });
				this._isInDOM = true;
			}

		};

		p.requestRemoveFromDOM = function() {
			// console.log("ViewController.js :: requestRemoveFromDOM");
			this.dispatchCustomEvent(ViewController.REQUEST_REMOVE_FROM_DOM, { controller : this });
			this._isInDOM = false;
			this._isHiding = false;
		};

		p.updateLayout = function() {

			this._updateSubControllerLayout();

			this.dispatchCustomEvent(ViewController.LAYOUT_FINISHED);
		};

		p._updateSubControllerLayout = function() {
			for (var controllerId in this._controllers)
			{
				this._controllers[controllerId].updateLayout();
			}
		};

		ViewController.create = function(aControllerID) {
			var newViewController = new ViewController();
			newViewController.setup(aControllerID);
			return newViewController;

		};
	
	}

})();