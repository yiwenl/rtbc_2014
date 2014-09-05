(function() {
	var BasicPage = breelNS.getNamespace("generic.templates").BasicPage;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.templates");

	if(!namespace.LoaderPage) {
		var LoaderPage = function(aId, aDefaultState, aDefaultSection, aStates, aSections) {
			this._loadingPercent = 0;

			BasicPage.call(this, aId, aDefaultState, aDefaultSection, aStates, aSections);
		}
		namespace.LoaderPage = LoaderPage;
		var p = LoaderPage.prototype = new BasicPage();
		var s = BasicPage.prototype;

		LoaderPage.PERCENTAGE_UPDATE = "percentageUpdate";

		p.initialize = function() {

		};

		p.setLoadingPercent = function(aPercent) {
			if(aPercent > 1) aPercent = 1;
			this._loadingPercent = aPercent;
			console.log("aPercent : ", aPercent);
		};

		p.loadComplete = function() {

		};

	}

})();