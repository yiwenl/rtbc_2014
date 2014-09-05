(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var namespace = breelNS.getNamespace("generic.core");
	var siteManager;

	if(!namespace.HistoryStateManager) {
		
		var HistoryStateManager = function() {
			this.onHistoryStateChangeBound = ListenerFunctions.createListenerFunction(this, this.onHistoryStateChange);
			this.history = History;
			this.setState = undefined;
		};

		namespace.HistoryStateManager = HistoryStateManager;
		var p = HistoryStateManager.prototype = new EventDispatcher();

		HistoryStateManager.STATE_CHANGED = "historyStateChanged";

		p.setup = function() {
			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			this.addHistoryEventListener();
		};

		p.addHistoryEventListener = function() {
			this.history.Adapter.bind(window,'statechange',this.onHistoryStateChangeBound);
		};

		p.addState = function(aStateObject, aTitle, aUrl) {
			console.debug("addState :: aStateObject, aTitle, aUrl : ", aStateObject, aTitle, aUrl);
			aTitle = (aTitle === undefined) ? null : aTitle;
			var winUrl = window.location.href;
			if(winUrl.charAt(winUrl.length-1) == "/") {
				var urlPath = (window.location.href.indexOf("recipe") != -1) ? ((breelNS.dirRoot == "/") ? "/"+aUrl : "../../"+aUrl ) : breelNS.dirRoot+aUrl;
			} else {
				var urlPath = (window.location.href.indexOf("recipe") != -1) ? ((breelNS.dirRoot == "/") ? "/"+aUrl : "../"+aUrl ) : breelNS.dirRoot+aUrl;
			}
			
			if(siteManager.config.config.setHistoryState) {
				this.setState = true;
				this.history.pushState(aStateObject, aTitle, urlPath);
			}

			console.debug("HistoryStateManager ::: addState :: this.history.getCurrentIndex : ", this.history.getCurrentIndex());
		};

		p.onHistoryStateChange = function() {
			var state = this.history.getState(false);
			// var state = this.history.getState();
			// console.log("onHistoryStateChange :: state : ", state);
			if(!this.setState) {
				this.dispatchCustomEvent( HistoryStateManager.STATE_CHANGED , state);
			} else {
				this.setState = false;
			}

			console.debug("HistoryStateManager ::: onHistoryStateChange :: this.history.getCurrentIndex : ", this.history.getCurrentIndex());
		};

		p.destroy = function() {
			this.history.Adapter.unbind(window,'statechange',this.onHistoryStateChangeBound);
		};

		HistoryStateManager.create = function(){
			var newHistoryStateManager = new HistoryStateManager();
			newHistoryStateManager.setup();
			return newHistoryStateManager;
		};

	}

})();