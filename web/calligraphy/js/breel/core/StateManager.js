(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var Utils = breelNS.getNamespace("generic.utils").Utils;

	var pageNamespace = breelNS.projectName+".page";

	var namespace = breelNS.getNamespace("generic.core");
	var siteManager;

	if(!namespace.StateManager) {

		var StateManager = function() {
			this._states = {};
			this._currentState = undefined;
			this._currentStateId = undefined;
			this._preState = undefined;
			this._preStateId = undefined;
			this._nextState = undefined;
			this._nextStateId = undefined;

			this._loader = null;
			this._toLoadID = undefined;
			this._blocker = null;

			this._onNextStateDispatchedBound = ListenerFunctions.createListenerFunction(this, this.onNextStateDispatched);
		}

		StateManager.STATE_OPEN = "stateOpen";
		StateManager.NEXT_STATE = "nextState";
		StateManager.END_STATE_OPEN = "endStateOpen";
		StateManager.END_STATE_CLOSE = "endStateClose";
		StateManager.STATE_CALLED_SCROLL = "stateCalledScroll";
		StateManager.STATE_MANAGER_CALLED_SCROLL = "stateManagerCalledScroll";

		namespace.StateManager = StateManager;
		var p = StateManager.prototype = new EventDispatcher();

		p.initialize = function(aStateTemplates, aStartState, aParentNode, aParentId, aAbsoluteParentName, aTemplateIds) {
			// console.log("aStateTemplates, aStartState, aParentNode, aParentId, aAbsoluteParentName, aTemplateIds : ", aStateTemplates, aStartState, aParentNode, aParentId, aAbsoluteParentName, aTemplateIds);
			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

			this._onPageOpenedBound = ListenerFunctions.createListenerFunction(this, this._onPageOpened);
			this._onPageClosedBound = ListenerFunctions.createListenerFunction(this, this._onPageClosed);
			this._onStateCalledScrollBound = ListenerFunctions.createListenerFunction(this, this._onStateCalledScroll);

			for(var i=0; i<aStateTemplates.length; i++) {
				var stateId = aStateTemplates[i];

				var classRef = stateId+"State";
				if(aAbsoluteParentName) {
					var parentNS = breelNS.getNamespace(aParentId);
				}else{
					var parentNS = breelNS.getNamespace(pageNamespace+"."+aParentId);
				}

				if(aTemplateIds === undefined) {
					var templateId = aParentId+stateId;
					templateId = templateId.replace(".", "");
				} else {
					var templateId = aTemplateIds[i];
				}

				var template = siteManager.assetManager.getAsset(templateId);
				var state = new parentNS[classRef](stateId, aParentNode, template);
				state.addEventListener(StateManager.NEXT_STATE, this._onNextStateDispatchedBound);
				state.addEventListener(StateManager.STATE_CALLED_SCROLL, this._onStateCalledScrollBound);
				this._states[stateId] = state;
			}

			this._getBlocker();

			this.startState = Utils._toCamelCase("-"+aStartState);
		};

		p.beginStateManager = function(aParams) {
			this.setState(this.startState, aParams);
		};

		p.setState = function(aStateId, aParams) {
			if(aStateId == this._currentStateId) {
				console.log("Tried to open the state that is currently on show. ID : "+ aStateId);
				return;
			}

			var stateOnShow = false;
			if(this._currentState) {
				stateOnShow = true;
				this._blocker.style.display = "block";
				this._currentState.addEventListener(StateManager.END_STATE_CLOSE, this._onPageClosedBound);
				this._preState = this._currentState;
				this._preStateId = this._currentStateId;
			}

			if(this._states[aStateId] !== undefined) {
				this._nextState = this._states[aStateId];
				this._nextStateId = aStateId;
				this._nextState.addEventListener(StateManager.END_STATE_OPEN, this._onPageOpenedBound);
			} else {
				console.warn("ERROR : Could not find the state with id  : "+ aStateId);
			}

			if(!stateOnShow) {
				this.dispatchCustomEvent(StateManager.STATE_OPEN, this._nextStateId);
				this._blocker.style.display = "block";
				if(aParams !== undefined) this._nextState.setParams(aParams);
				this._nextState.initialize();
				this._nextState.open();
			} else {
				this._currentState.close(aParams);
			}
		};

		p.setParams = function(params) {
			// console.log("setParams : ", params);
			if(this._currentState !== undefined) this._currentState.setParams(params);
		};

		p.onNextStateDispatched = function(aEvent) {
			var nextState = aEvent.detail;
			this.setState(nextState);
		}

		p._onPageOpened = function(aEvent) {
			if(this._nextState === undefined) return;

			this._nextState.removeEventListener(StateManager.END_STATE_OPEN, this._onPageOpenedBound);

			this._blocker.style.display = "none";
			this._currentState = this._nextState;
			this._currentStateId = this._nextStateId;

			this._nextState = undefined;
			this._nextStateId = undefined;
		};

		p._onPageClosed = function(aEvent) {
			
			if(this._blocker === undefined) this._getBlocker();
			this._blocker.style.display = "none";

			var container = aEvent.detail.state.container;
			var params = aEvent.detail.params;
			if(container !== null && container.parentNode !== null) container.parentNode.removeChild(container);

			ListenerFunctions.removeDOMListener(aEvent.detail, StateManager.END_STATE_CLOSE, this._onPageClosedBound);

			if(this._nextState !== undefined) {
				if(params !== undefined) this._nextState.setParams(params);
				this._nextState.initialize();
				var stateId = this._nextStateId
				this._nextState.open();

				this.dispatchCustomEvent(StateManager.STATE_OPEN, stateId);
			}
		};

		p._getBlocker = function() {
			this._blocker = document.getElementById("siteBlocker");
		};


		p.getState = function(stateId) {	return this._states[stateId];	};

		p.getCurrentState = function(){
			return this._currentState;	
		};

		p._onStateCalledScroll = function(aEvent) {
			console.log("stateManager :: _onStateCalledScroll : ", aEvent);
			var targetSection = aEvent.detail;
			this.dispatchCustomEvent(StateManager.STATE_MANAGER_CALLED_SCROLL, targetSection);
		};

		p._onResize = function(e) {
			if(this._currentState !== undefined) this._currentState._onResize(params);
		};

		p.destroy = function() {

			for(var state in this._states) {
				this._states[state].destroy();
			}
			this._currentState.removeEventListener(StateManager.END_STATE_CLOSE, this._onPageClosedBound);
			
			this._states = {};
			this._currentState = undefined;
			this._currentStateId = undefined;
			this._preState = undefined;
			this._preStateId = undefined;
			this._nextState = undefined;
			this._nextStateId = undefined;

			this._loader = null;
			this._toLoadID = undefined;
			this._blocker = null;
		};

		StateManager.create = function(aStateTemplates, aStartState, aParentNode, aParentId, aAbsoluteParentName, aTemplateIds) { 
			var newStateManager = new StateManager();
			newStateManager.initialize(aStateTemplates, aStartState, aParentNode, aParentId, aAbsoluteParentName, aTemplateIds);
			return newStateManager;
		};

	}

})();

