(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ElementUtils = breelNS.getNamespace("generic.htmldom").ElementUtils;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Page = breelNS.getNamespace("generic.templates").Page;
	var DomElementOpacityTween = breelNS.getNamespace("generic.animation").DomElementOpacityTween;

	var namespace = breelNS.getNamespace("generic.templates");

	var singletons, siteManager;

	if(!namespace.Dialog) {

		var Dialog = function() {

			this._element = null;
			this._isHiding = false;
		};

		namespace.Dialog = Dialog;

		var p = Dialog.prototype = new Page();
		var s = Page.prototype;

		Dialog.RESPONSE = "DialogButtonResponse";
		Dialog.HIDE_FINISHED = "DialogHideFinished";

		p.setup = function(aElement) {

			s.setup.call(this, aElement);
			
			// console.log("DIALOG : ", this._element);
		};

		p.getElement = function() {
			return this._element;			
		};

		p.show = function() {

			// s.show.call(this);
			this._isHiding = false;

			// this.setMidPosition();

		};

		p.hide = function() {

			if(!this._isHiding) return;
			this._isHiding = true;
			// s.hide.call(this);

			this.hideFinished(0);	
		};

		p.hideFinished = function() {
			
			console.log("hideFinished..");

			this.dispatchCustomEvent(Dialog.HIDE_FINISHED, this);

			this.removeFromDOM();

		};


		p.removeFromDOM = function() {

			console.log("removeFromDOM..");

			s.removeFromDOM.call(this);
		};


		p.setMidPosition = function() {
			var windowWidth = document.body.clientWidth;
			var dialogWidth = this._element.offsetWidth;

			var windowHeight = document.body.clientHeight;
			var dialogHeight = this._element.offsetHeight;

			this._element.style.left = (windowWidth - dialogWidth)/2+"px";
		//	this._element.style.top = (windowHeight - dialogHeight)/2+"px";
		};

		p.animateOpacity = function(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback) {
			DomElementOpacityTween.createWithAnimation(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback);
		};

		p._onWindowResize = function() {

			s._onWindowResize.call(this);

			this.setMidPosition();

		};
	}

})();