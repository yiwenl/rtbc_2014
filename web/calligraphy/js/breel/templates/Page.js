(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ElementUtils = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;
	var DomElementPositionTween = breelNS.getNamespace("generic.animation").DomElementPositionTween;
	var TweenHelper = breelNS.getNamespace("generic.animation").TweenHelper;

	var namespace = breelNS.getNamespace("generic.templates");

	var singletons, siteManager;

	if(!namespace.Page) {
		var Page = function() {

			this._pageId = null;
			this._isMobile = false;

			this._element = null;
			this.loaded = false;

			this._clickEventName = null;

			this.hideFinishedEvent = null;

			this._hideFinishedTimeout = null;
			this._removeDomTimeout = null;
			this._isHiding = false;

		};

		namespace.Page = Page;

		Page.HIDE_FINISHED = "pageHideFinished";
		Page.REQUEST_IFRAME_CHANGE_HEIGHT = "pageRequestChangeHeight";

		var p = Page.prototype = new EventDispatcher();

		p.setup = function(aElement) {
			this._element = aElement;

			singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			siteManager = singletons.siteManager;
			this._isMobile = siteManager.browserDetector.getIsMobileDevice();

			this._pageId = this._element.getAttribute("id");	

			this._clickEventName = siteManager.browserDetector.getButtonClickEventName(false);
			this._buttonClickEventName = siteManager.browserDetector.getButtonClickEventName(true);
				
			this.onWindowResize = ListenerFunctions.createListenerFunction(this, this.windowResize);
		};

		p.getPageId = function() {
			return this._pageId;	
		};

		p.getElement = function() {
			return this._element;
		};

		p.load = function() {

			this.loaded = true;
		};

		p.pageWillShow = function() {
			
		};

		p.show = function() {		

			console.log(this._pageId + " called .show");	
			ListenerFunctions.addDOMListener(window,"resize",this.onWindowResize);
			ElementUtils.addClass(this._element, "active");
			this._isHiding = false;

		};

		p.showFinished = function() {
			siteManager.block(false);
		};

		p.hide = function(aHideEvent) {
			siteManager.block(true);
			console.log(this._pageId + " called .hide");	
			if (this._isHiding) return;
			this._isHiding = true;

			if(aHideEvent != undefined) this.hideFinishedEvent = aHideEvent;
			
			ListenerFunctions.removeDOMListener(window,"resize",this.onWindowResize);
			ElementUtils.removeClass(this._element, "active");
		};

		p.hideFinished = function() {
			console.log("Page.js :: hideFinished");

			ElementUtils.removeClass(this._element, "active");

			this.removeFromDOM();

			if(this.hideFinishedEvent == null){
				this.dispatchCustomEvent(Page.HIDE_FINISHED, this);
			}else {
				this.dispatchCustomEvent(this.hideFinishedEvent, this);
			}

		};

		p.requestIFrameChangeHeight = function(aNewHeight) {
			this.dispatchCustomEvent(Page.REQUEST_IFRAME_CHANGE_HEIGHT, aNewHeight);
		};

		p.animateOpacity = function(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback) {
			DomElementOpacityTween.createWithAnimation(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback);
		};
		p.animatePosition = function(aElement, aStartX,aStartY, aEndX,aEndY, aTime, aEasing, aDelay, aCallback) {
			// console.log("animatePosition : ", aElement, aStartX,aStartY, aEndX,aEndY, aTime, aEasing, aDelay, aCallback);
			DomElementPositionTween.createWithAnimation(aElement, aStartX,aStartY, aEndX,aEndY, aTime, aEasing, aDelay, aCallback);
		};

		p.removeFromDOM = function() {
			console.log("Page.js :: removeFromDOM");
			if (this._element.parentElement)
				this._element.parentElement.removeChild(this._element);

			this._isHiding = false;
		};

		p.windowResize = function() {

		};
	
	}

})();