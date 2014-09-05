(function() {

	var TweenDelay = breelNS.getNamespace("generic.animation").TweenDelay;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Utils = breelNS.getNamespace("generic.utils").Utils;

	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.DomElementScaleTween) {

		var DomElementScaleTween = function DomElementScaleTween() {
			this._init();
		}


		namespace.DomElementScaleTween = DomElementScaleTween;

		var p = DomElementScaleTween.prototype;

		p._init = function() {
			this._element = null;
			this._horizontalScale = 1;
			this._verticalScale = 1;
			
			this._updateCallback = ListenerFunctions.createListenerFunction(this, this._update);
			
			this._tween = new TWEEN.Tween(this);
			this._tween.onUpdate(this._updateCallback);
			
			this._tweenDelay = TweenDelay.create(this._tween);
		}
		
		p.setElement = function(aElement) {
			this._element = aElement;
			
			return this;
		};
		
		p.getElemet = function() {
			return this._element;
		};

		p.setCallback = function(aCallback) {
			this._tween.onComplete(aCallback);
		}
		
		p.getHorizontalScale = function() {
			return this._horizontalScale;
		};
		
		p.getVerticalScale = function() {
			return this._verticalScale;
		};
		
		p.setStartScale = function(aHorizontalScale, aVerticalScale) {
			this._horizontalScale = aHorizontalScale;
			this._verticalScale = aVerticalScale;
			
			return this;
		};
		
		p.animateTo = function(aHorizontalScale, aVerticalScale, aTime, aEasing, aDelay) {
			//console.log(aHorizontalScale, aVerticalScale, aTime, aEasing, aDelay);
			
			this._tweenDelay.animateTo({"_horizontalScale": aHorizontalScale, "_verticalScale": aVerticalScale}, aTime, aEasing, aDelay);
			
			return this;
		};
		
		p.getTransform = function() {
			return "scale(" + this._horizontalScale + ", " + this._verticalScale + ")";
		};
		
		p.update = function() {
			this._update();
		};
		
		p._update = function() {
			
			var elementTransform = this.getTransform();
			
			if(this._element !== null) {
				this._element.style.setProperty("-khtml-transform", elementTransform, "");
				this._element.style.setProperty("-moz-transform", elementTransform, "");
				this._element.style.setProperty("-ms-transform", elementTransform, "");
				this._element.style.setProperty("-webkit-transform", elementTransform, "");
				this._element.style.setProperty("-o-transform", elementTransform, "");
				this._element.style.setProperty("transform", elementTransform, "");
			}
		};
		
		p.destroy = function() {
			this._element = null;
			this._updateCallback = null;
			if(this._tween !== null) {
				this._tween.stop();
			}
			this._tween = null;
			Utils.destroyIfExists(this._tweenDelay);
			this._tweenDelay = null;
			
		};
		
		DomElementScaleTween.create = function(aElement, aStartHorizontalScale, aStartVerticalScale) {
			var newDomElementScaleTween = new DomElementScaleTween();
			newDomElementScaleTween.setElement(aElement);
			newDomElementScaleTween.setStartScale(aStartHorizontalScale, aStartVerticalScale);
			return newDomElementScaleTween;
		};
		
		DomElementScaleTween.createWithAnimation = function(aElement, aStartHorizontalScale, aStartVerticalScale, aHorizontalScale, aVerticalScale, aTime, aEasing, aDelay, aCallback) {
			var newDomElementScaleTween = new DomElementScaleTween();
			newDomElementScaleTween.setElement(aElement);
			if(typeof aCallback == 'function') newDomElementOpacityTween.setCallback(aCallback);
			newDomElementScaleTween.setStartScale(aStartHorizontalScale, aStartVerticalScale);
			newDomElementScaleTween.animateTo(aHorizontalScale, aVerticalScale, aTime, aEasing, aDelay);
			return newDomElementScaleTween;
		};
	}

})();