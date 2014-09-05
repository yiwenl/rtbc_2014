(function() {

	var namespace = breelNS.getNamespace("generic.animation");

	if(!namespace.EaseFunctions) {

		var EaseFunctions = function EaseFunctions() {

		};

		namespace.EaseFunctions = EaseFunctions;

		EaseFunctions.easeInQuart = function (t) { return t*t*t*t };
		EaseFunctions.easeOutQuart = function (t) { return 1-(--t)*t*t*t };
		EaseFunctions.easeInCubic = function (t) { return t*t*t };
		EaseFunctions.easeOutCubic = function (t) { return (--t)*t*t+1 };
		EaseFunctions.easeInQuad = function (t) { return t*t };
  		EaseFunctions.easeOutQuad = function (t) { return t*(2-t) };
	}
})();