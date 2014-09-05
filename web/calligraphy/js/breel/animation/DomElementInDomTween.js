(function() {

	var TimedCommands = breelNS.getNamespace("generic.timer").TimedCommands;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Utils = breelNS.getNamespace("generic.utils").Utils;
	
	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.DomElementInDomTween) {

		var DomElementInDomTween = function DomElementInDomTween() {
			this._init();
		}

		namespace.DomElementInDomTween = DomElementInDomTween;

		DomElementInDomTween.INTERNAL_CHANGE_STATE = "changeState";
		
		var p = DomElementInDomTween.prototype;
		
		p._init = function() {
			this._element = null;
			this._parentElement = null;
			
			this._isInDom = false;
			
			this._changeStateCallback = ListenerFunctions.createListenerFunction(this, this._changeState);
			
			this._timedCommands = TimedCommands.create().setAutoStart(true);
			this._timedCommands.addEventListener(DomElementInDomTween.INTERNAL_CHANGE_STATE, this._changeStateCallback, false);
			
		}
		
		p.setElement = function(aElement, aParentElement) {
			this._element = aElement;
			this._parentElement = aParentElement;
			
			return this;
		};
		
		p.getElement = function() {
			return this._element;
		};
		
		p.isInDom = function() {
			return this._isInDom;
		};
		
		p.setStartInDom = function(aInDom) {
			this._isInDom = aInDom;
			
			return this;
		};
		
		p.animateTo = function(aInDom, aDelay) {
			//console.log(aInDom, aDelay);
			
			if(aDelay === 0) {
				this._timedCommands.clearAllCommandsByType(DomElementInDomTween.INTERNAL_CHANGE_STATE);
				this._isInDom = aInDom;
				this._update();
			}
			else {
				var currentTime = 0.001*Date.now();
				
				this._timedCommands.addCommand(DomElementInDomTween.INTERNAL_CHANGE_STATE, currentTime+aDelay, aInDom);
			}
			
			return this;
		};
		
		p.update = function() {
			this._update();
		};
		
		p._update = function() {
			if(this._isInDom) {
				if(this._element !== null && this._element.parentNode !== this._parentElement) {
					this._parentElement.appendChild(this._element);
				}
			}
			else {
				if(this._element !== null && this._element.parentNode !== null) {
					this._element.parentNode.removeChild(this._element);
				}
			}
		};

		p.stop = function() {
			this._timedCommands.clearAllCommandsByType(DomElementInDomTween.INTERNAL_CHANGE_STATE);
		};
		
		p._changeState = function(aEvent) {
			this._isInDom = aEvent.detail;
			this._update();
		};
		
		p.destroy = function() {
			this._element = null;
			this._parentElement = null;
			this._changeStateCallback = null;
			if(this._timedCommands !== null) {
				this._timedCommands.destroy();
				this._timedCommands = null;
			}
			
		};
		
		DomElementInDomTween.create = function(aElement, aParentElement, aStartInDom) {
			var newDomElementInDomTween = new DomElementInDomTween();
			newDomElementInDomTween.setElement(aElement, aParentElement);
			newDomElementInDomTween.setStartInDom(aStartInDom);
			return newDomElementInDomTween;
		};
	}

})();