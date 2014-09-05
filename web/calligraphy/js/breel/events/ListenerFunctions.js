breelNS.defineClass("generic.events.ListenerFunctions", null, function(p, s, ListenerFunctions) {
	
	ListenerFunctions.addDOMListener = function(aElement, aEvent, aCallback) {
		if(typeof aElement.addEventListener === 'function')
			aElement.addEventListener(aEvent, aCallback, false);			
		else if(typeof aElement.attachEvent === 'function')
			aElement.attachEvent('on' + aEvent, aCallback);
		else
			aElement['on' + aEvent] = aCallback;
	};


	ListenerFunctions.removeDOMListener = function(aElement, aEvent, aCallback) {
		if(aElement == null || aElement == undefined) return;
		if(typeof aElement.removeEventListener === 'function')
			aElement.removeEventListener(aEvent, aCallback, false);
		else if(typeof aElement.attachEvent === 'function')
			aElement.detachEvent('on' + aEvent, aCallback);
		else
			aElement['on' + aEvent] = null;
		
	};


	ListenerFunctions.createListenerFunction = function(aListenerObject, aListenerFunction) {
		
		if (aListenerFunction === undefined){
			throw new Error("ERROR ListenerFunctions :: createListenerFunction :: callback function was null when called by :: "+ aListenerObject);
		}
		
		var returnFunction = function dynamicListenerFunction() {
			aListenerFunction.apply(aListenerObject, arguments);
		};
		return returnFunction;
	};


	ListenerFunctions.createListenerFunctionOnce = function(aListenerObject, aListenerFunction) {
		
		if (aListenerFunction === undefined){
			throw new Error("ERROR ListenerFunctions :: createListenerFunction :: callback function was null when called by :: "+ aListenerObject);
		}
		
		var returnFunction = function dynamicListenerFunction() {
			if(aListenerFunction === undefined) return null;
			aListenerFunction.apply(aListenerObject, arguments);
			aListenerFunction = undefined;
		};
		return returnFunction;
	};

	
	ListenerFunctions.createListenerFunctionWithArguments = function(aListenerObject, aListenerFunction, aArguments) {
		
		if (aListenerFunction === undefined){
			throw new Error("ERROR ListenerFunctions :: createListenerFunction :: callback function was null when called by :: "+ aListenerObject);
		}
		
		var returnFunction = function dynamicListenerFunction() {
			var argumentsArray = aArguments.concat([]); //MENOTE: can't concat arguments. It adds an object instead of all arguments.
			var currentArray = arguments;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				argumentsArray.push(currentArray[i]);
			}
			aListenerFunction.apply(aListenerObject, argumentsArray);
		};
		return returnFunction;
	};
	
	ListenerFunctions.createListenerFunctionWithReturn = function(aListenerObject, aListenerFunction) {
		
		if (aListenerFunction === undefined){
			throw new Error("ERROR ListenerFunctions :: createListenerFunctionWithReturn :: callback function was null when called by :: "+ aListenerObject);
		}
		
		var returnFunction = function dynamicListenerFunction() {
			return aListenerFunction.apply(aListenerObject, arguments);
		};
		return returnFunction;
	};
});
