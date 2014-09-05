(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var TemplateManager = breelNS.getNamespace("generic.templates").TemplateManager;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var XmlLoader = breelNS.getNamespace("generic.loading").XmlLoader;
	var PreloadPage = breelNS.getNamespace("allForThis.pages").PreloadPage;
	var UrlFunctions = breelNS.getNamespace("generic.utils").UrlFunctions;

	// LVNOTE : This can be included to dispatch events for what sections have loaded and 
	// the current loading percent but the loading page would need to be made more generic to
	// fit within the breel framework.
	// var LoadingPage = null;
	
	var singletons, siteManager;

	var namespace = breelNS.getNamespace("generic.loading");

	if(!namespace.LoadingManager) {
		
		var LoadingManager = function() {

			this.xmlLoader = null;

			this._assetSections = {};

			this._currentAssetSection = null;
			this._currentAssetLoadList = [];
			this._loadIndex = -1;
			this._isLoading = false;

			this.onLoadingError = ListenerFunctions.createListenerFunction(this, this._onLoadingError);
			this.onAssetListLoaded = ListenerFunctions.createListenerFunction(this, this.assetListLoaded);

			this.onTemplateImagesLoaded = ListenerFunctions.createListenerFunction(this, this._onTemplateImages);

			this._sectionTemplatesLoadedBound = ListenerFunctions.createListenerFunction(this, this._sectionTemplatesLoaded);
			this._loadNextAssetBound = ListenerFunctions.createListenerFunction(this, this.loadNextAsset);

			this._assetCounter = 0;
			this._images = {};
			this._videos = {};

			singletons = breelNS.getNamespace(breelNS.projectName).singletons;

		};

		namespace.LoadingManager = LoadingManager;

		var p = LoadingManager.prototype = new EventDispatcher();

		LoadingManager.ERROR = "loadingManagerError";
		LoadingManager.SECTION_LOADED = "loadingManagerSectionLoaded";
		LoadingManager.ASSET_LIST_LOADED = "loadingManagerAssetListLoaded";

		LoadingManager.LOAD_PROGRESS = "loadingManagerProgress";

		p.setup = function() {

			siteManager = singletons.siteManager;
		};

		p.loadAssetList = function(aPath) {

			if(siteManager === undefined || siteManager === null) {
				console.log("siteManager has not been setup... setting up siteManager");
				this.setup();
			}

			this.xmlLoader = XmlLoader.create(aPath);
			this.xmlLoader.addEventListener(XmlLoader.ERROR, this.onLoadingError);
			this.xmlLoader.addEventListener(XmlLoader.LOADED, this.onAssetListLoaded);
			this.xmlLoader.load();
		
			console.log("LoadingManager ** loading asset list");
		};
		
		p._onLoadingError = function() {
			console.log("LoadingManager *** ERROR ***  loading asset list");
		};


		p._createConfig = function(vars) {
			var setting = breelNS.getNamespace("allForThis.visualiser").VisualiserSettings;
			if(siteManager.config == undefined) siteManager.config = {};
			for ( var i=0; i<vars.childNodes.length; i++) {
				if( vars.childNodes[i].childNodes[0] != undefined ) {
					var att = vars.childNodes[i].nodeName;
					if ( att.indexOf("MinMax") > -1) {
						var index = Number( att.split("index")[1].split("MinMax")[0] );
						range = vars.childNodes[i].childNodes[0].nodeValue.split(",");
						setting.ranges[index] = [Number(range[0]), Number(range[1])];
						
						setting.MAX_AMOUNT = Math.max(setting.MAX_AMOUNT, Number(range[1]) );
					}

					if ( att.indexOf("ClosingRange") > -1) {
						var index = Number( att.split("index")[1].split("ClosingRange")[0] );
						setting.closingRange[index] = Number(vars.childNodes[i].childNodes[0].nodeValue);
					}

					siteManager.config[att] = vars.childNodes[i].childNodes[0].nodeValue;
				}
			}

			for ( var i=0; i<setting.ranges.length; i++) {
				setting.spacingOffset[i] = 1 / ( (setting.ranges[i][1]+10) / (setting.MAX_AMOUNT+10) );
			}

			// check URL for override state
			var url = window.location.href;
			var stateComponents = UrlFunctions.parseQueryString(url);
			for (var key in stateComponents)
			{
				if (key == "") {
					var stateValue = stateComponents[key];
					if(stateValue) {
						if(stateValue == 'before') siteManager.config.state = "0";
						else if(stateValue == 'live') siteManager.config.state = "1";
						else if(stateValue == 'after') siteManager.config.state = "2";
						else siteManager.config.state = "0";
					}

				}

			}

			// console.log( "CONFIG : " , siteManager.config);
			// console.log( setting.MAX_AMOUNT );
			// console.log( setting.closingRange );
		}

		p.assetListLoaded = function(aEvent) {
			var str = aEvent.detail.childNodes[0].childNodes[0].nodeValue;
			console.log("assetListLoaded called, xml = ", str);
			console.log( JSON.parse );
			var config = JSON.parse(str);
			console.log( "Config : ", config );
			return;

			siteManager.templateManager.addEventListener(siteManager.templateManager.TEMPLATE_IMAGES, this.onTemplateImagesLoaded);

			var xmlDoc = aEvent.detail;
			var vars;
			try {
				vars = xmlDoc.querySelector("vars");
			}
			catch(e) {
				xmlDoc = (new DOMParser() ).parseFromString(aEvent.detail.xml, "application/xml");
				vars = xmlDoc.querySelector("vars");
			
			}

			this._createConfig(vars);
			siteManager.setupDebugMode();

			var sections;
			try {
				sections = xmlDoc.querySelectorAll("section");
			}
			catch(e){
				xmlDoc = (new DOMParser() ).parseFromString(aEvent.detail.xml, "application/xml");		
				sections = xmlDoc.querySelectorAll("section");
			}

			for (var i = 0; i < sections.length; i++){
				var sectionXML = sections[i];
				var sectionObj = {};				
				var sectionName = sectionXML.getAttribute("name");
				sectionObj.name = sectionName;
				sectionObj.assets = [];
				sectionObj.containsTemplates = false;
				sectionObj.templateCount = 0;
				sectionObj.loaded = false;
				var sectionAssetXMLList = sectionXML.querySelectorAll('asset');
				for (var j = 0; j < sectionAssetXMLList.length; j++)
				{
					var asset = sectionAssetXMLList[j];
					var assetObj = {};
					assetObj.type = asset.getAttribute("type");
					if (assetObj.type == 'template'){
						sectionObj.hasTemplates = true;
						sectionObj.templateCount++;	
					} else if (assetObj.type == "audio"){
						assetObj.duration = asset.getAttribute("duration");
					} 
					assetObj.src = asset.getAttribute("src");
					assetObj.id = asset.getAttribute("id");



					sectionObj.assets.push(assetObj);
					// console.log("added asset" , assetObj);
				}
				this._assetSections[sectionObj.name] = sectionObj;
			}
			this.dispatchCustomEvent(LoadingManager.ASSET_LIST_LOADED, null);
			// console.groupEnd("LoadingManager ** Asset List Loaded, " + sections.length + " sections");
		};

		p._onTemplateImages = function(aEvent) {

			var imageSrcArray = aEvent.detail;
			// console.log( "Image src Array :", imageSrcArray );

			for (var i=0;i<imageSrcArray.length;i++){
				var assetObj = {};
				assetObj.type = "image";
				assetObj.src = imageSrcArray[i];
				this._currentAssetLoadList.push(assetObj);
				this._assetCounter++;
			}

		};

		p.loadSection = function(aSectionName) {
			console.log("loadSection : aSectionName : ", aSectionName);
			var sectionToLoad = this._assetSections[aSectionName];
			if (!sectionToLoad) throw new Error("Could not load section "+ aSectionName + ", not found.");

			this._assetCounter = 0;

			if (sectionToLoad.loaded)
			{
				// console.log("already loaded section : " + aSectionName);
				this.dispatchCustomEvent(LoadingManager.SECTION_LOADED, sectionToLoad.name);

				// console.log("this._currentAssetSection.name : ", this._currentAssetSection.name);
				if (this._currentAssetSection.name == 'intro') {
					this.dispatchCustomEvent(PreloadPage.LOADINGPROGRESS, 100);
				}

				return;
			}

			this._currentAssetSection = sectionToLoad;
			this._currentAssetLoadList = [];
			this._loadIndex = -1;
			console.log("LoadingManager ** loading assets for " + this._currentAssetSection.name + " section");

			
			if (this._currentAssetSection.hasTemplates){

				siteManager.templateManager.addEventListener(TemplateManager.LOADED, this._sectionTemplatesLoadedBound);

				for (var i = 0; i < this._currentAssetSection.assets.length; i++)
				{
					var asset = this._currentAssetSection.assets[i];
					if (asset.type == "template") {
						siteManager.templateManager.addTemplateUrl(asset.src);						
					}
					else {
						this._currentAssetLoadList.push(asset);
					}
				}
				siteManager.templateManager.loadTemplates();
			}
			else {
				this.loadNextAsset();	
			}			
		};

		p._sectionTemplatesLoaded = function(aEvent) {

			console.log("Loading Manager ** templates loaded for section " + this._currentAssetSection.name);

		//	this._assetCounter = 0;

			siteManager.templateManager.removeEventListener(TemplateManager.LOADED, this._sectionTemplatesLoadedBound);

			this.loadNextAsset();
		};

		p.loadNextAsset = function() {
			var imageManager = siteManager.imageManager;

			this._isLoading = true;
			this._loadIndex++;

			var currentAssetLoadListLength = this._currentAssetLoadList.length;

			for(var i=0; i<currentAssetLoadListLength; i++){
				var asset = this._currentAssetLoadList[i];
				if(asset.type == "image") this._assetCounter++;
			}

			if (currentAssetLoadListLength == 0)
			{
				this._isLoading = false;				
				this._currentAssetSection.loaded = true;		
				this.dispatchCustomEvent(LoadingManager.SECTION_LOADED, this._currentAssetSection.name);

				return;		
			}

			var nextAsset = this._currentAssetLoadList.shift();

			var loadingPercent = Math.round(((this._assetCounter - this._currentAssetLoadList.length)/this._assetCounter)*100);

			// LVNOTE : This could be brought back in,
			// if we want to create a more generic way to access the loading percentage
			if (this._currentAssetSection.name == 'intro') {
				this.dispatchCustomEvent(PreloadPage.LOADINGPROGRESS, loadingPercent);
			}
			
			var target = this;
			switch(nextAsset.type){
				case "image" :
					var newImage = new Image();
					var id = nextAsset.id;
					newImage.onload = function(){
						if(id !== null && id !== undefined && id != '') target._images[id] = this;
						target._loadNextAssetBound();
					}
					newImage.onerror = function() {
						console.error("ERROR loading image asset : " + nextAsset.src);
						target.loadNextAsset();		
					}

					

					newImage.src = imageManager.getImageSrc(nextAsset.src);
				break;
				case "video" :
					var newVideo = new Video();
					var id = nextAsset.id;
					newVideo.onlaod = function() {
						if(id !== null && id !== undefined && id != '') target._videos[id] = this;
						target._loadNextAssetBound();
					}
					newVideo.onerror = function() {
						console.error("ERROR loading video asset : " + nextAsset.src);
						target.loadNextAsset();
					}

					newVideo.src = "";

					// newVideo.load();
				break;
			}

		};


		p.getImage = function(id) {	return this._images[id];	};

	}

})();