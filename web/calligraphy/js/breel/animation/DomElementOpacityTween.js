(function() {

	var TweenDelay = breelNS.getNamespace("generic.animation").TweenDelay;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Utils = breelNS.getNamespace("generic.utils").Utils;

	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.DomElementOpacityTween) {

		var DomElementOpacityTween = function DomElementOpacityTween() {
			this._init();
		}

		namespace.DomElementOpacityTween = DomElementOpacityTween;

		var p = DomElementOpacityTween.prototype;

		p._init = function() {
			this._element = null;
			this._opacity = 1;
			
			this._updateCallback = ListenerFunctions.createListenerFunction(this, this._update);
			
			this._tween = new TWEEN.Tween(this);
			this._tween.onUpdate(this._updateCallback);
			this._tween.onComplete()
			
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
			this._tween.onComplete(function() {
				if(this._opacity > 0.9) {
					this._opacity = 1;
				}
				this.update();
				if(aCallback !== undefined) aCallback();
			});
		};
		
		p.getOpacity = function() {
			return this._x;
		};
		
		p.setStartOpacity = function(aOpacity) {
			this._opacity = aOpacity;
			
			return this;
		};
		
		p.animateTo = function(aOpacity, aTime, aEasing, aDelay) {
			//console.log(aOpacity, aTime, aEasing, aDelay);
			
			this._tweenDelay.animateTo({"_opacity": aOpacity}, aTime, aEasing, aDelay);
			
			return this;
		};
		
		p.update = function() {
			this._update();
		};
		
		p._update = function() {
			if(this._element !== null) {
				try {
					this._element.style.setProperty("opacity", this._opacity, "");	
				} catch(e) {
					this._element.style["opacity"] = this._opacity;
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
		
		DomElementOpacityTween.create = function(aElement, aStartOpacity) {
			var newDomElementOpacityTween = new DomElementOpacityTween();
			newDomElementOpacityTween.setElement(aElement);
			newDomElementOpacityTween.setStartOpacity(aStartOpacity);
			return newDomElementOpacityTween;
		};
		
		DomElementOpacityTween.createWithAnimation = function(aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay, aCallback) {
			// console.log("aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay : ", aElement, aStartOpacity, aOpacity, aTime, aEasing, aDelay);
			var newDomElementOpacityTween = new DomElementOpacityTween();
			newDomElementOpacityTween.setElement(aElement);
			newDomElementOpacityTween.setCallback(aCallback);
			newDomElementOpacityTween.setStartOpacity(aStartOpacity);
			newDomElementOpacityTween.animateTo(aOpacity, aTime, aEasing, aDelay);
			return newDomElementOpacityTween;
		};

	}

})();