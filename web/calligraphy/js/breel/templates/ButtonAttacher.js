(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ButtonGenerator = breelNS.getNamespace("generic.templates").ButtonGenerator;

	var namespace = breelNS.getNamespace("generic.templates");
	var siteManager;

	if(!namespace.ButtonAttacher) {

		var ButtonAttacher = function() {
			this.buttons = {};
		};

		namespace.ButtonAttacher = ButtonAttacher;
		var p = ButtonAttacher.prototype = new EventDispatcher();

		p.setupButtons = function() {
			var Buttons = this.container.querySelectorAll("*[data-type='button']");

			for(var i=0; i<Buttons.length; i++) {
				var button = Buttons[i];
				// console.log(button);
				var events = button.getAttribute("data-button-events").split(',');
				var life = parseInt(button.getAttribute("data-button-event-life"));
				// console.log("events : ", events);

				var id = button.getAttribute("data-button-event-name");
				var newButt = new ButtonGenerator.create(id, button, events, life);

				this.buttons[id] = newButt;
			}
		};
		p.getButtonEventName = function(aEventType, aButt) {
			var eventName;

			switch(aEventType) {
				case "click":
					eventName = ButtonGenerator.CLICK;
				break;
				case "doubleClick":
					eventName = ButtonGenerator.DOUBLE_CLICK;
				break;
				case "mouseover":
					eventName = ButtonGenerator.MOUSE_OVER;
				break;
				case "mouseout":
					eventName = ButtonGenerator.MOUSE_OUT;
				break;
			}
			return eventName+aButt.id;
		};

		p.attachButtEvents = function(aButt, aEvents) {
			var buttEventLength = aButt.events.length;
			for(var i=0; i<buttEventLength; i++) {
				var aEvent = aButt.events[i];
				var aEventName = this.getButtonEventName(aEvent, aButt);
				aButt.addEventListener(aEventName, aEvents[aEvent]);
			}
		};
		p.removeButtEvents = function(aButt, aEvents) {
			var buttEventLength = aButt.events.length;
			for(var i=0; i<buttEventLength; i++) {
				var aEvent = aButt.events[i];
				var aEventName = this.getButtonEventName(aEvent, aButt);
				aButt.removeEventListener(aEventName, aEvents[aEvent]);
			}
		};
		
		p.defineEvents = function() {
			console.log("BasicPage :: defineEvents");
		};
		p.addButtonListeners = function() {
			console.log("BasicPage :: addButtonListeners");
		};
		p.removeButtonListeners = function() {
			console.log("BasicPage :: removeButtonListeners");
		};
		
	}

})();