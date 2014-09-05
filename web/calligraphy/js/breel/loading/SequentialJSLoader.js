(function(){
	
	var namespace = breelNS.getNamespace("generic.loading");
	var JSLoader = breelNS.getNamespace("generic.loading").JSLoader;
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	
	if(namespace.SequentialJSLoader === undefined) {
		
		var SequentialJSLoader = function SequentialJSLoader() {
			
			this._jsFiles = [];
			this._filesLoadedCount = 0;
		};
		
		namespace.SequentialJSLoader = SequentialJSLoader;
		
		SequentialJSLoader.LOADED = "sequenceLoaded";
		SequentialJSLoader.ERROR = "error";
		SequentialJSLoader.PROGRESS = "progress";
		
		var p = SequentialJSLoader.prototype = new EventDispatcher();
		
		p.load = function(aFilePathArray, aIsAsync) {
			this._loader = new JSLoader();
			this.isAsync = aIsAsync;
			this._jsFiles = aFilePathArray;
			this._filesLoadedCount = 0;
			if(this._jsFiles.length > 0) {
				this._loader.addEventListener(JSLoader.LOADED, this._onJSFileLoaded.bind(this), false);
				this._loadNext();
			}
		};

		p._loadNext = function(){
			if(this._filesLoadedCount < this._jsFiles.length){
				this._loader.load(this._jsFiles[this._filesLoadedCount], this.isAsync);
			}else{
				this.dispatchCustomEvent(SequentialJSLoader.LOADED, 1);
			}
		};

		p._onJSFileLoaded = function(aEvent) {
			this._filesLoadedCount++;
			var progress = this._filesLoadedCount / this._jsFiles.length;
			this.dispatchCustomEvent(SequentialJSLoader.PROGRESS, progress);


			// OHDEBUG :: artificial delay on load
			// var that = this;
			// setTimeout(function(){
			// 	that._loadNext();	
			// }, 100);

			this._loadNext();	
			
		};
		
	}
})();