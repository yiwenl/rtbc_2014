// Core.js

(function() {
	//	IMPORTS
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var ConfigSite = breelNS.getNamespace("generic.core").ConfigSite;
	var GlobalStateManager = breelNS.getNamespace("generic.core").GlobalStateManager;
	var AssetManager = breelNS.getNamespace("generic.core").AssetManager;
	var SoundManager = breelNS.getNamespace("flyWell.core").SoundManager;
	var Scheduler = breelNS.getNamespace("generic.utils").Scheduler;
	var AnimationManager = breelNS.getNamespace("generic.animation").AnimationManager;
	var CopyManager = breelNS.getNamespace("generic.copy").CopyManager;
	var XmlCreator = breelNS.getNamespace("generic.copy").XmlCreator;
	var XmlChildRetreiver = breelNS.getNamespace("generic.copy").XmlChildRetreiver;
	var ExportedXmlCopyDocument = breelNS.getNamespace("generic.copy").ExportedXmlCopyDocument;

	var namespace = breelNS.getNamespace("generic.core");

	if(!namespace.Core) {
		var Core = function() {
			this.config = null;
			this.globalStateManager = null;
			this.assetManager = null;
			this.assetImageRoot = undefined;
			this.copyManager = null;
			this.soundManager = null;
			this.sharingManager = null;

			this.stateObject = undefined;

			this.xmlCreator = null;
			this.xmlChildRetreiver = null;
			this.exportedXmlCopyDocument = null;
			this.localLang = "en";
		}

		namespace.Core = Core;
		var p = Core.prototype;


		p.setup = function() {
			this.animationManager = AnimationManager.create();
			this.scheduler = Scheduler.create();
			this.config = new ConfigSite();
			this.globalStateManager= new GlobalStateManager();
			this.assetManager = new AssetManager();
			this.copyManager = new CopyManager();
			// this.soundManager = new SoundManager();

			this._onConfigLoadedBound = ListenerFunctions.createListenerFunctionOnce(this, this._onConfigLoaded);
			ListenerFunctions.addDOMListener(this.config, ConfigSite.CONFIG_LOADED, this._onConfigLoadedBound);
		};


		p.load = function(configPath, aCopyPath) {
			this.setCopyDocument(aCopyPath);

			if ( configPath === undefined ) configPath = "../files/xml/config.xml";
			this.config.setup(configPath);
		};


		p._onConfigLoaded = function(e) {
			// console.log( "Config Loaded:", this.config.config );

			this.assetManager.init(this.assetImageRoot);
			this.globalStateManager.init();

			this.globalStateManager.setDefaultState();

			this.assetManager.updateAllStyleSheetsForPixelDensity();

			if(breelNS.productionMode) {
				this.config.config.debug = false;
				this.config.config.backend.state = "production";
			}

			if(!this.config.config.debug) {
				var console = new Object();
				window.console = console;
				console.dir = function(){};     
				console.debug = function(){};
				console.info = function(){};
				console.warn = function(){};
				console.log = function() {};
				console.trace = function(){};
				console.group = function(){};
				console.groupCollapsed = function(){};
				console.timeStamp = function() {};
				console.profile = function() {};
				console.profileEnd = function() {};
				console.error = function() {};
			}
			
		};


		p.setCopyDocument = function(aPath) {
			var path = (aPath === undefined) ? "files/xml/copy.xml" : aPath;

			this.xmlCreator = new XmlCreator();
			this.xmlChildRetreiver = new XmlChildRetreiver();
			this.exportedXmlCopyDocument = new ExportedXmlCopyDocument();

			this.localLang = browserDetector.getBrowserLanguage();
			var copyDocument = this.xmlChildRetreiver.getFirstChild(this.xmlCreator.loadXmlFile(path));
			this.copyManager.setCopyDocument(this.exportedXmlCopyDocument.create(copyDocument));
			
		};

	}

	
})();
