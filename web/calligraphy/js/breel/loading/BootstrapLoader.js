(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var XmlLoader = breelNS.getNamespace("generic.loading").XmlLoader;
	var SequentialJSLoader = breelNS.getNamespace("generic.loading").SequentialJSLoader;

	var namespace = breelNS.getNamespace("generic.loading");

	if(!namespace.BootstrapLoader) {

		var BootstrapLoader = function BootstrapLoader() {

			this._xmlLoader = null;
			this._sequentialLoader = null;

			this._cumulativeProgress = 0;	// if we load different types of asset with weighting, use this to keep track of weighted offsets

			this._onFilesXmlLoadedBound = this._onFilesXmlLoaded.bind(this);
			this._onFilesXmlErrorBound = this._onFilesXmlError.bind(this);

			this._onScriptsLoadedBound = this._onScriptsLoadComplete.bind(this);
			this._onScriptsProgressBound = this._onScriptsProgress.bind(this);
			this._onScriptsErrorBound = this._onScriptsError.bind(this);
		};

		namespace.BootstrapLoader = BootstrapLoader;

		BootstrapLoader.PROGRESS = "progress";
		BootstrapLoader.COMPLETE = "complete";
		BootstrapLoader.ERROR = "error";

		// 'weighting'
		BootstrapLoader.SCRIPT_WEIGHTING = 0.25;

		var p = BootstrapLoader.prototype = new EventDispatcher();

		p.load = function(aFilesXMLPath) {

			this._xmlLoader = XmlLoader.create(aFilesXMLPath);
			this._xmlLoader.addEventListener(XmlLoader.LOADED, this._onFilesXmlLoadedBound);
			this._xmlLoader.addEventListener(XmlLoader.ERROR, this._onFilesXmlErrorBound);
			this._xmlLoader.load();
		};

		p._onFilesXmlLoaded = function(aEvent) {

			var xmlDoc = aEvent.detail;
			var data;
			try {
				data = xmlDoc.querySelector("data");
			}
			catch(e) {
				xmlDoc = (new DOMParser() ).parseFromString(aEvent.detail.xml, "application/xml");
				data = xmlDoc.querySelector("data");
			}

			var jsFiles = data.querySelectorAll("script");
			var jsFilesArray = [];
			for (var i=0;i<jsFiles.length;i++)
			{
				jsFilesArray.push(jsFiles[i].attributes['src'].value);
			}

			this._sequentialLoader = new SequentialJSLoader();
			this._sequentialLoader.addEventListener(SequentialJSLoader.LOADED, this._onScriptsLoadedBound);
			this._sequentialLoader.addEventListener(SequentialJSLoader.PROGRESS, this._onScriptsProgressBound);
			this._sequentialLoader.addEventListener(SequentialJSLoader.ERROR, this._onScriptsErrorBound);
			this._sequentialLoader.load(jsFilesArray)

		};

		p._onFilesXmlError = function(aEvent) {
			console.error("ERROR : Problem loading files.xml");
			this._onError();
		};


		p._onScriptsLoadComplete = function(aEvent) {
			// this._onProgress(this._cumulativeProgress * BootstrapLoader.SCRIPT_WEIGHTING);
			// OHNOTE: if we're loading different types of asset, this should check for other asset types to load
			this._onComplete();
		};

		p._onScriptsProgress = function(aEvent) {
			var progress = aEvent.detail;
			var weightedProgress = progress * BootstrapLoader.SCRIPT_WEIGHTING;
			this._onProgress(weightedProgress + this._cumulativeProgress);
		};

		p._onScriptsError = function(aEvent) {
			console.error("ERROR : Problem loading scripts");
			this._onError();
		};

		p._onProgress = function(aProgress) {
			this.dispatchCustomEvent(BootstrapLoader.PROGRESS, { progress : aProgress, loader : this});
		};

		p._onComplete = function() {
			this.dispatchCustomEvent(BootstrapLoader.COMPLETE, { loader : this});
		};

		p._onError = function() {
			this.dispatchCustomEvent(BootstrapLoader.ERROR, { loader : this});
		};

	}

})();