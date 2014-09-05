(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var StateManager = breelNS.getNamespace("generic.core").StateManager;

	var namespace = breelNS.getNamespace("generic.core");

	if(!namespace.StateManagerGenerator) {

		var StateManagerGenerator = function() {
			this.stateManager = undefined;
		};

		namespace.StateManagerGenerator = StateManagerGenerator;
		var p = StateManagerGenerator.prototype = new EventDispatcher();

		p.setup = function(aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds, aParams) {
			this.stateManager = StateManager.create(aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds);
			
			this._onStateChangedBound = ListenerFunctions.createListenerFunction(this, this._onStateChanged);
			this.stateManager.addEventListener(StateManager.STATE_OPEN, this._onStateChangedBound);
			
			this.stateManager.beginStateManager(aParams);
		};

		p._onStateChanged = function(aEvent) {
			var stateOpening = aEvent.detail;
			console.log("stateOpening : ", stateOpening);
		};

		StateManagerGenerator.create = function(aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds, aParams) {
			console.log("aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds, aParams : ", aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds, aParams);
			var newStateManagerGenerator = new StateManagerGenerator;
			newStateManagerGenerator.setup(aStates, aDefaultState, aContainer, aParentNameSpaceId, aAbsoluteParentName, aTemplateIds, aParams);
			return newStateManagerGenerator;
		};
	}

})();