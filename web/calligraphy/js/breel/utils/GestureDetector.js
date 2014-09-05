(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ElementUtils = breelNS.getNamespace("generic.utils").ElementUtils;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var SimpleTrig = breelNS.getNamespace("generic.math").SimpleTrig;
	
	var namespace = breelNS.getNamespace("generic.utils");

	if(!namespace.GestureDetector) {
		var GestureDetector = function() {
			this._element = null;
			this._isAttached = false;

			this._globalOriginX = null;
			this._globalOriginY = null;
			this._deltaX = 0;
			this._deltaY = 0;

			this._elementWidth = 0;
			this._elementHeight = 0;

			this._minimumUpdateDistanceX = 0;
			this._minimumUpdateDistanceY = 0;
		

			this._onGlobalMouseDownBound = null;
			this._onGlobalMouseMoveBound = null;
			this._onGlobalMouseUpBound = null;
			this._onGlobalMouseLeaveBound = null;
		};		

		namespace.GestureDetector = GestureDetector;		

		var p = GestureDetector.prototype = new EventDispatcher();

		GestureDetector.fractionOfElementToMoveBeforeUpdate = 0.1;

		GestureDetector.GESTURE_START = "gestureDetectStart";
		GestureDetector.GESTURE_UPDATE = "gestureDetectUpdate";
		GestureDetector.GESTURE_END = "gestureDetectEnd";

		p.setup = function() {

			// LVNOTE : This file has not been tested since converted to use ListenerFunctions
			// that is why i have only commented the original code out isntead of replacing it completely.

			this._onGlobalMouseDownBound = ListenerFunctions.createListenerFunction(this, this._onGlobalMouseDown);
			this._onGlobalMouseMoveBound = ListenerFunctions.createListenerFunction(this, this._onGlobalMouseMove);
			this._onGlobalMouseUpBound = ListenerFunctions.createListenerFunction(this, this._onGlobalMouseUp);
			this._onGlobalMouseLeaveBound = ListenerFunctions.createListenerFunction(this, this._onGlobalMouseLeave);

			// document.body.addEventListener("touchmove", this._onGlobalMouseMoveBound);
			ListenerFunctions.addDOMListener(document.body, "touchmove", this._onGlobalMouseMoveBound);

		};

		p._onGlobalMouseDown = function (aEvent) {
			aEvent.preventDefault();	

		};

		p._onGlobalMouseMove = function(aEvent) {



			
			if (!this._isAttached) {
				
				return false;	
			} 
			aEvent.preventDefault();

			if (aEvent.type == 'touchmove' && aEvent.touches){
				var dX = this._globalOriginX - aEvent.touches[0].pageX;
				var dY = this._globalOriginY - aEvent.touches[0].pageY;
			}else{
				var dX = this._globalOriginX - aEvent.pageX;
				var dY = this._globalOriginY - aEvent.pageY;
			}

			var doUpdate = false;
			if (Math.abs(dX - this._deltaX) > this._minimumUpdateDistanceX) doUpdate = true;
			if (Math.abs(dY - this._deltaY) > this._minimumUpdateDistanceY) doUpdate = true;

			if (doUpdate) {

				this._deltaX = dX;
				this._deltaY = dY;

				var dataObject = this._createDataObject(aEvent.type);
				this.dispatchCustomEvent(GestureDetector.GESTURE_UPDATE, dataObject);

				// console.log("updating gesture : ", dataObject);
			}			
			return false;

		};

		p._onGlobalMouseUp = function(aEvent) {

	

			if (!this._isAttached) {
			
				return false;	
			} 
			aEvent.preventDefault();

			this._deltaX = this._globalOriginX - aEvent.pageX;
			this._deltaY = this._globalOriginY - aEvent.pageY;


			this._lastUpdateObject = this._createDataObject(aEvent.type, aEvent.target);

			if (aEvent.pageX > 0) this.dispatchCustomEvent(GestureDetector.GESTURE_UPDATE, this._lastUpdateObject);
			this.dispatchCustomEvent(GestureDetector.GESTURE_END, this._lastUpdateObject);
			// console.log("ending gesture : ", this._lastUpdateObject);
			
			return false;
		};

		p._onGlobalMouseLeave = function(aEvent) {

			console.log("GestureDetector :: Mouse Left");

			var isOutsideDocument = false;

			if (aEvent.relatedTarget){
				if (aEvent.relatedTarget.nodeName){
					if (aEvent.relatedTarget.nodeName == 'HTML')
						isOutsideDocument = true;
				}
			}
			
	
			// Mouse/touch left the document, end gesture with nothing happening
			aEvent.preventDefault();

			if (!this._isAttached) return false;			

			this._deltaX = this._globalOriginX;
			this._deltaY = this._globalOriginY;

			this._lastUpdateObject = this._createDataObject(aEvent.type, aEvent.target);

		//	this.dispatchCustomEvent(GestureDetector.GESTURE_UPDATE, this._lastUpdateObject);
			if (isOutsideDocument){
				this.dispatchCustomEvent(GestureDetector.GESTURE_END, this._lastUpdateObject);
			}
		};

		p._createDataObject = function(internalEvt, target) {

			var nX = (this._deltaX / this._elementWidth);
			var nY = (this._deltaY / this._elementHeight);

			return { 
				"x" : nX,
				"y" : nY,
				"distance" : SimpleTrig.getPythagoreanDistance(nX, nY),
				"internalType" : internalEvt,
				"targetElem" : target
			};

		};

		p.startTrackingGestureOnElement = function(aElement, aClientX, aClientY, aUpdateElementFraction) {

			var fractionOfElementBeforeUpdate = aUpdateElementFraction || GestureDetector.fractionOfElementToMoveBeforeUpdate;

			this._element = aElement;
			this._isAttached = true;

			this._globalOriginX = aClientX;
			this._globalOriginY = aClientY;

			this._deltaX = 0;
		 	this._deltaY = 0;

		 	// console.log("starting tracking : ", this._element.getAttribute("id"));

			
			// document.body.addEventListener("touchend", this._onGlobalMouseUpBound);
			ListenerFunctions.addDOMListener(document.body, "touchend", this._onGlobalMouseUpBound);	
			// document.body.addEventListener("touchleave", this._onGlobalMouseLeaveBound);
			ListenerFunctions.addDOMListener(document.body, "touchleave", this._onGlobalMouseLeaveBound);


			// document.body.addEventListener("mousemove", this._onGlobalMouseMoveBound);
			ListenerFunctions.addDOMListener(document.body, "mousemove", this._onGlobalMouseMoveBound);
			// document.body.addEventListener("mouseup", this._onGlobalMouseUpBound);
			ListenerFunctions.addDOMListener(document.body, "mouseup", this._onGlobalMouseUpBound);
			// document.body.addEventListener("mouseleave", this._onGlobalMouseLeaveBound);
			ListenerFunctions.addDOMListener(document.body, "mouseleave", this._onGlobalMouseLeaveBound);
			// window.addEventListener("mouseout", this._onGlobalMouseLeaveBound);
			ListenerFunctions.addDOMListener(window, "mouseout", this._onGlobalMouseLeaveBound);
			
			this._elementWidth = this._element.clientWidth;
			this._elementHeight = this._element.clientHeight;

			this._minimumUpdateDistanceX = this._elementWidth * fractionOfElementBeforeUpdate;
			this._minimumUpdateDistanceY = this._elementHeight * fractionOfElementBeforeUpdate;

			this.dispatchCustomEvent(GestureDetector.GESTURE_START, null);
		};


		p.detachFromElement = function() {

			// console.log("detaching from element.. ", this._element.getAttribute("id"));

			
			// document.body.removeEventListener("touchend", this._onGlobalMouseUpBound);
			ListenerFunctions.removeDOMListener(document.body, "touchend", this._onGlobalMouseUpBound);
			// document.body.removeEventListener("touchleave", this._onGlobalMouseLeaveBound);	
			ListenerFunctions.removeDOMListener(document.body, "touchleave", this._onGlobalMouseLeaveBound);

			// document.body.removeEventListener("mousemove", this._onGlobalMouseMoveBound);
			ListenerFunctions.removeDOMListener(document.body, "mousemove", this._onGlobalMouseMoveBound);
			// document.body.removeEventListener("mouseup", this._onGlobalMouseUpBound);
			ListenerFunctions.removeDOMListener(document.body, "mouseup", this._onGlobalMouseUpBound);
			// document.body.removeEventListener("mouseleave", this._onGlobalMouseLeaveBound);
			ListenerFunctions.removeDOMListener(document.body, "mouseleave", this._onGlobalMouseLeaveBound);
			// window.removeEventListener("mouseout", this._onGlobalMouseLeaveBound);
			ListenerFunctions.removeDOMListener(window, "mouseout", this._onGlobalMouseLeaveBound);		
			
			this._isAttached = false;
			this._element = null;
		};

		p.enable = function() {
	

		};

		p.disable = function() {
			// document.body.removeEventListener("mousedown", this._onGlobalMouseDownBound);
			ListenerFunctions.removeDOMListener(document.body, "mousedown", this._onGlobalMouseDownBound);
			// document.body.removeEventListener("touchstart", this._onGlobalMouseDownBound);
			// document.body.removeEventListener("mousemove", this._onGlobalMouseMoveBound);
			ListenerFunctions.removeDOMListener(document.body, "mousemove", this._onGlobalMouseMoveBound);
			
			// document.body.removeEventListener("touchend", this._onGlobalMouseUpBound);
			ListenerFunctions.removeDOMListener(document.body, "touchend", this._onGlobalMouseUpBound);
			// document.body.removeEventListener("mouseup", this._onGlobalMouseUpBound);
			ListenerFunctions.removeDOMListener(document.body, "mouseup", this._onGlobalMouseUpBound);
			// document.body.removeEventListener("touchleave", this._onGlobalMouseLeaveBound);
			ListenerFunctions.removeDOMListener(document.body, "touchleave", this._onGlobalMouseLeaveBound);
			// document.body.removeEventListener("mouseleave", this._onGlobalMouseLeaveBound);
			ListenerFunctions.removeDOMListener(document.body, "mouseleave", this._onGlobalMouseLeaveBound);
		
		};

		GestureDetector.create = function() {
			var newGestureDetector = new GestureDetector();
			newGestureDetector.setup();
			return newGestureDetector;
		};
	}
})();