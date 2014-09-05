(function() {

	var TweenDelay = breelNS.getNamespace("generic.animation").TweenDelay;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Utils = breelNS.getNamespace("generic.utils").Utils;
	
	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.DomElementPositionTween) {

		var DomElementPositionTween = function DomElementPositionTween() {
			this._init();
		}

		namespace.DomElementPositionTween = DomElementPositionTween;

		var p = DomElementPositionTween.prototype;

		p._init = function() {
			this._element = null;
			this._x = 0;
			this._y = 0;
			
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
		
		p.getXPosition = function() {
			return this._x;
		};
		
		p.getYPosition = function() {
			return this._y;
		};
		
		p.setStartPosition = function(aX, aY, aMoveToStartBeforeAnim) {
			this._x = aX;
			this._y = aY;
			
			if(aMoveToStartBeforeAnim) this._update();

			return this;
		};
		
		p.animateTo = function(aX, aY, aTime, aEasing, aDelay) {
			//console.log(aX, aY, aTime, aEasing, aDelay);
			
			this._tweenDelay.animateTo({"_x": aX, "_y": aY}, aTime, aEasing, aDelay);
			
			return this;
		};
		
		p.update = function() {
			this._update();
		};
		
		p._update = function() {
			
			var elementTransform = "translate(" + this._x + "px, " + this._y + "px)";
			
			if(this._element !== null) {

				if (Modernizr.cssanimations){
					this._element.style.setProperty("-khtml-transform", elementTransform, "");
					this._element.style.setProperty("-moz-transform", elementTransform, "");
					this._element.style.setProperty("-ms-transform", elementTransform, "");
					this._element.style.setProperty("-webkit-transform", elementTransform, "");
					this._element.style.setProperty("-o-transform", elementTransform, "");
					this._element.style.setProperty("transform", elementTransform, "");
					// this._element.style.top = this._y + 'px';
					// this._element.style.left = this._x + 'px';
			
				}
				else{
					this._element.style.top = this._y + 'px';
					this._element.style.left = this._x + 'px';
				}
				
			}
		};
		
		p.destroy = function() {
			this._element = null;
			this._updateCallback = null;
			this._tween = null;
			Utils.destroyIfExists(this._tweenDelay);
			this._tweenDelay = null;
		};
		
		DomElementPositionTween.create = function(aElement, aStartX, aStartY) {
			var newDomElementPositionTween = new DomElementPositionTween();
			newDomElementPositionTween.setElement(aElement);
			newDomElementPositionTween.setStartPosition(aStartX, aStartY);
			return newDomElementPositionTween;
		};
		
		DomElementPositionTween.createWithAnimation = function(aElement, aStartX, aStartY, aX, aY, aTime, aEasing, aDelay, aCallback, aMoveToStartBeforeAnim) {
			var newDomElementPositionTween = new DomElementPositionTween();
			newDomElementPositionTween.setElement(aElement);
			if(typeof aCallback == 'function') newDomElementPositionTween.setCallback(aCallback);
			newDomElementPositionTween.setStartPosition(aStartX, aStartY, aMoveToStartBeforeAnim);
			newDomElementPositionTween.animateTo(aX, aY, aTime, aEasing, aDelay);
			return newDomElementPositionTween;
		};
	}

})();