(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.templates");
	var siteManager;

	if(!namespace.ButtonGenerator) {
		var ButtonGenerator = function() {
			
			this.id = undefined;
			this.element = undefined;
			this.expire = false;
			this.life = undefined;
			this.lifeCount = 0;
		
			this._onButtonClickedBound = undefined;
			this._onMouseOverBound = undefined;
			this._onMouseOutBound = undefined;
		};

		namespace.ButtonGenerator = ButtonGenerator;
		var p = ButtonGenerator.prototype = new EventDispatcher();

		ButtonGenerator.CLICK = "buttonClicked_";
		ButtonGenerator.DOUBLE_CLICK = "buttonDoubleClicked_";
		ButtonGenerator.MOUSE_OVER = "buttonOver_";
		ButtonGenerator.MOUSE_OUT = "buttonOut_";

		p.setup = function(aId, aElement, aEvents, aLife) {
			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			this.id = aId;
			this.element = aElement;
			this.events = aEvents;
			this.life = aLife;
			if(this.life > 0) {
				this.expire = true;
				this.lifeCount = 0;
			}


			this._onButtonClickedBound = ListenerFunctions.createListenerFunction(this, this._onButtonClicked);
			this._onButtonDoubleClickedBound = ListenerFunctions.createListenerFunction(this, this._onButtonDoubleClicked);
			this._onMouseOverBound = ListenerFunctions.createListenerFunction(this, this._onMouseOver);
			this._onMouseOutBound = ListenerFunctions.createListenerFunction(this, this._onMouseOut);

			this.addAllEvents();
		};

		p.addAllEvents = function() {
			if(this.events.length > 0) {
				for(var i=0; i<this.events.length; i++){
					var eventName = this.events[i];
					this.addEventByName(eventName);
				}
			} else {
				this.addEventByName("click");
			}
		};
		p.removeAllEvents = function() {
			if(this.events.length > 0) {
				for(var i=0; i<this.events.length; i++){
					var eventName = this.events[i];
					this.removeEventByName(eventName);
				}
			} else {
				this.removeEventByName("click");
			}
		};

		p.addEventByName = function(aEventName) {
			switch(aEventName) {
				case "click":
					ListenerFunctions.addDOMListener(this.element, browserDetector.getButtonClickEventName(true), this._onButtonClickedBound);
				break;
				case "doubleClick":
					ListenerFunctions.addDOMListener(this.element, "dblclick", this._onButtonDoubleClickedBound);
				break;
				case "mouseover":
					ListenerFunctions.addDOMListener(this.element, "mouseover", this._onMouseOverBound);
				break;
				case "mouseout":
					ListenerFunctions.addDOMListener(this.element, "mouseout", this._onMouseOutBound);
				break;
			}
		};
		p.removeEventByName = function(aEventName) {
			switch(aEventName) {
				case "click":
					ListenerFunctions.removeDOMListener(this.element, browserDetector.getButtonClickEventName(true), this._onButtonClickedBound);
				break;
				case "doubleClick":
					ListenerFunctions.removeDOMListener(this.element, "dblclick", this._onButtonDoubleClickedBound);
				break;
				case "mouseover":
					ListenerFunctions.removeDOMListener(this.element, "mouseover", this._onMouseOverBound);
				break;
				case "mouseout":
					ListenerFunctions.removeDOMListener(this.element, "mouseout", this._onMouseOutBound);
				break;
			}
		};

		p._onButtonClicked = function(aEvent) {
			this.dispatchCustomEvent( ButtonGenerator.CLICK+this.id, aEvent );

			var trackStr = this.element.getAttribute('data-tracking');
			if (trackStr !== null && trackStr != "" && trackStr != " "){
				// do analytics stuff
				if(siteManager.analyticsManager !== undefined) siteManager.analyticsManager.gaTrackEvent('button', 'click', trackStr);
			}
	
			this.lifeCount++;
			if(this.expire && this.lifeCount >= this.life){
				this.removeEventByName("click");
			}
		};
		p._onButtonDoubleClicked = function(aEvent) {
			this.dispatchCustomEvent( ButtonGenerator.DOUBLE_CLICK+this.id, aEvent );

			this.removeEventByName("doubleClick");
		};
		p._onMouseOver = function(aEvent) {
			if(browserDetector.getBrowserName != "ie") siteManager.sound.buttonRollOver();
			this.dispatchCustomEvent( ButtonGenerator.MOUSE_OVER+this.id, aEvent );
		};
		p._onMouseOut = function(aEvent) {
			this.dispatchCustomEvent( ButtonGenerator.MOUSE_OUT+this.id, aEvent );
		};

		p.destroy = function() {
			
		};

		ButtonGenerator.create = function(aId, aElement, aEvents, aLife) {
			var newButtonGenerator = new ButtonGenerator();
			newButtonGenerator.setup(aId, aElement, aEvents, aLife);
			return newButtonGenerator;
		};
	}
})();