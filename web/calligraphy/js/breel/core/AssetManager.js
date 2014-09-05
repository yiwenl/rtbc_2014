// AssetManager.js

(function() {
	// IMPORTS
	var namespace = breelNS.getNamespace("generic.core");
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var SoundLoader = breelNS.getNamespace("generic.sound").SoundLoader;
	var ImgSeqSelector 	= breelNS.getNamespace("generic.math.order").ImageSequenceOrderSelector;
	var ImageSequenceLoader = breelNS.getNamespace("generic.loading").ImageSequenceLoader;
	var BrowserDetector = breelNS.getNamespace("generic.utils").BrowserDetector;

	var core, siteManager, singletons, scheduler;

	if(!namespace.AssetManager) {
		var AssetManager = function() {
			this.assets = {};
			this._queue = [];
			this._nAssetToLoad = 0;
			this._nAssetLoaded = 0;
			
			this._loadedWeight = 0;
			this._totalWeight = 0;
			this._currentWeight = 0;
			
			this._imagesFolder = "files/images";
			this._imagesFolder = breelNS.dirRoot + this._imagesFolder;
			this._currentPixelDensity = "1x";
			this._req = null;
			this._parser = new DOMParser();
			this._requestOnReadyStateChangeBound = this._requestOnReadyStateChange.bind(this);
			this._sequenceProgressBound = this._sequenceProgress.bind(this);
			this._currentAsset = null;
			this.combinedSequence = {};

			this._isCancellingQueue = false;


			this._isMobile = false;
			this._isTablet = false;
		}

		AssetManager.ALL_COMPLETE = "allComplete";
		AssetManager.PROGRESS = "onProgress";
		AssetManager.ERROR = "assetManagerError";
		AssetManager.LOADED = "assetManagerLoaded";

		AssetManager.TEMPLATE_IMAGES = "assetManagerImageLoading";

		AssetManager.ON_CLIP_SEQUENCE_LOADED = "AssetManagerOnClipSequenceLoaded";
		AssetManager.ON_CLIP_IMAGE_LOADED = "AssetManagerClipImageLoaded";

		namespace.AssetManager = AssetManager;
		var p = AssetManager.prototype = new EventDispatcher();

		p.init = function(aImageRoute) {
			// console.log("aImageRoute : ", aImageRoute);
			if(aImageRoute !== undefined) this._imagesFolder = aImageRoute;
			core = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

			singletons = breelNS.getNamespace(breelNS.projectName).singletons;			
			siteManager = singletons.siteManager;
			scheduler = siteManager.scheduler;

			var pixelDensity = window.devicePixelRatio;
			if (pixelDensity) {
				switch(pixelDensity)
				{
					case 1:
						this._currentPixelDensity = "1x";
					break;
					case 2:
						this._currentPixelDensity = "2x";
					break;
					default:
						this._currentPixelDensity = "1x";
					break;
				}
			}

			this._isMobile = browserDetector.getIsMobileDevice();
			this._isTablet = browserDetector.getIsTabletDevice();
		};

		p.enqueueClip = function(clipId, clipType, clipSrc){
			//console.log("generic.core.AssetManager::enqueueClip");
			//console.log(clipId, clipType, clipSrc);

			var assetSuffix = siteManager.clipManager.getAssetSuffix(clipId);
			var compressionFolder = "compressed_" + siteManager.clipManager.getCompressionLevelForClip(clipId);
			if (clipSrc.indexOf(assetSuffix) == -1)								
				clipSrc = clipSrc.replace(".txt", assetSuffix + ".txt");

			if (clipId.indexOf(assetSuffix) == -1)
				clipId = clipId + assetSuffix;

			//console.log("AssetManager :: enqueueClip : ", clipId, clipType, clipSrc);

			var obj = {id:clipId, type: clipType, url: clipSrc, compressionFolder : compressionFolder, loaded: false};

			this._queue.push(obj);

		};
		


		p.enqueue = function(id, type, url, aWeight) {
			//console.log("generic.core.AssetManager::enqueue");
			//console.log(id, type, url);

			var compressionFolder = "";	// just for image sequences

			if(aWeight == null) {
				aWeight = -1; 
			}

			if (type == "sequenceCombined"){

				// ensure the id and url have the asset suffix in the name

				var assetSuffix = siteManager.clipManager.getAssetSuffix(id);
				compressionFolder = "compressed_" + siteManager.clipManager.getCompressionLevelForClip(id);
				if (url.indexOf(assetSuffix) == -1)								
					url = url.replace(".txt", assetSuffix + ".txt");

				if (id.indexOf(assetSuffix) == -1)
					id = id + assetSuffix;
			}

			if (type=="sequence") {

				function pad (str, max) {
				  return str.length < max ? pad("0" + str, max) : str;
				}

				var n = url.lastIndexOf("_");
				var m = url.lastIndexOf(".");
				var stStart = url.substring(0,n+1);
				var stEnd = url.substring(m,url.length);
				var numSeq = url.substring(n+1,m);

				for (var i=0; i<numSeq; i++) {
					var nid = pad(i.toString(), numSeq.length);
					var nurl = stStart + nid + stEnd;

					// console.log(id+i);
					var currentWeight = ((aWeight === -1) ? 150 : aWeight);
					this._queue.push(	{id:(id+i), type:type, url:nurl, "weight": currentWeight, compressionFolder : compressionFolder});
					this._totalWeight += currentWeight;
				}
			}			 
			else {
				var currentWeight = ((aWeight === -1) ? 30 : aWeight);
				this._queue.push(	{id:id, type:type, url:url, "weight": currentWeight, compressionFolder : compressionFolder}	);
				this._totalWeight += currentWeight;
			}
		};

		p.cancelSequentialImageQueue = function() {
			
			this._isCancellingQueue = true;
			this._isLoading = false;
			
		};

		p.isLoading = function(){

			return this._isLoading;	
		};


		p.startLoading = function() {
			// console.log("generic.core.AssetManager::startLoading");
		//	this._isLoading = true;
			if (!this._isLoading){
				this._isLoading = true;
				this._nAssetToLoad = this._queue.length;
				this._nAssetLoaded = 0;
				this._loadedWeight = 0;
				this._isCancellingQueue = false;
				this._loadNext();	
			} else {
				console.log("AssetManager :: cannot start loading, already loading");
			}
		};


		p._loadNext = function() {
			//console.log("generic.core.AssetManager::_loadNext");
			if(this._queue.length == 0) {
				this._onAllAssetLoaded();
				return;
			}

			var asset = this._queue.shift();
			this._currentAsset = asset;
			var type = asset.type;

			this._currentWeight = asset.weight;

			if(this.hasAsset(asset.id)) {
				//console.log( "Asset With ID : ", asset.id , " already exist, move on to next asset." );
				if (asset.type == "sequenceCombined"){
					this.dispatchCustomEvent(AssetManager.ON_CLIP_SEQUENCE_LOADED, asset.id);					
				}

				this._loadNext();
				
				return;
			}
			
			switch(type) {
				case "sequenceCombined" :
					
					var that = this;
					var sequenceLoaderObject = new ImageSequenceLoader();					
					sequenceLoaderObject.addEventListener(ImageSequenceLoader.LOADED, function() {
						that.assets[asset.id] = sequenceLoaderObject;
						that._onProgress();	
					});
					sequenceLoaderObject.addEventListener(ImageSequenceLoader.ERROR, function() {
						that._onProgress();	
					});
					sequenceLoaderObject.addEventListener(ImageSequenceLoader.PROGRESS, this._sequenceProgressBound);
					sequenceLoaderObject.setSourceFolderName(siteManager.getSequenceSourceFolderName());
					sequenceLoaderObject.setPreFolderName(asset.compressionFolder);
					sequenceLoaderObject.load(asset.url, asset.id);
					
					break;
				case "audio" :

					var that = this;
					var queueId = "queue_single_" + asset.url;
					var soundLibrary = siteManager.soundLibrary;
					var soundLoaderObject = soundLibrary.addSoundToLoadingQueue(asset.url, queueId, soundLibrary.getDefaultSamplePadding());
					soundLoaderObject.addEventListener(SoundLoader.LOADED, function() {
						that._onProgress();
					});
					
					soundLibrary.beginQueue(queueId);
					
					break;
				case "template" :
					this._req = new XMLHttpRequest();
					this._req.onreadystatechange = this._requestOnReadyStateChangeBound;
					this._req.open("GET", breelNS.dirRoot+asset.url, true);
					this._req.send(null);
					// this._onProgress();
					break;
				case "image" : 
				case "svg" : 
				case "sequence":
					var that = this;
					var newImage = new Image();
					var src = this.getImageSrc(asset.url);
					newImage.onload = function() {
						that.assets[asset.id] = this;
						that._onProgress();
					}

					newImage.onerror = function() {
						console.error("ERROR loading image asset : " + src);
						that._loadNext();
					}

					newImage.src = src;
					break;
				default : 
					this._onProgress();
					break;
			}
			
		};


		p._onProgress = function() {
			//console.log("generic.core.AssetManager::_onProgress");
			this._nAssetLoaded++;
			this._loadedWeight += this._currentWeight;
			//console.log(this._loadedWeight, this._totalWeight);
			this.dispatchCustomEvent(AssetManager.PROGRESS, {loaded: this._loadedWeight, total: this._totalWeight} );
			//setTimeout(this._loadNext.bind(this), 2000);
			this._loadNext();
		};

		p._sequenceProgress = function(aEvent) {
			//console.log("generic.core.AssetManager::_sequenceProgress");
			//console.log(aEvent);

			var currentLoadedWeight = this._loadedWeight+this._currentWeight*Math.max(0, Math.min(1, aEvent.detail));

			var progressObject = {"loaded": currentLoadedWeight, "total": this._totalWeight};
			//console.log(currentLoadedWeight, this._totalWeight);

			this.dispatchCustomEvent(AssetManager.PROGRESS, progressObject);
		};

		p._onAllAssetLoaded = function() {
			this._isLoading = false;

			
			if (this.frameData && this.frameData.name != ""){
				if (this.combinedSequence[this.frameData.name].imageSequences.length == this.frameData.totalImages){
					this.dispatchCustomEvent(AssetManager.ALL_COMPLETE, null);
					this._readyForAdHocLoad = true;
				}

			}
			else {
				this.dispatchCustomEvent(AssetManager.ALL_COMPLETE, null);
			}
		};


		p.getImageSrc = function(aPath) {
			var svgsupport = true;

			if (aPath == "" || aPath == null) return aPath;				

			var pathPrefix = "";
			if (this._pathContainsSVG(aPath)) {
				if(!this.supportsSVG()) {
					console.log("Browser does not support SVG");
					svgsupport = false;
				}
				pathPrefix = this._imagesFolder + "/svgs";
			} else {
				pathPrefix = this._imagesFolder + "/" + this._currentPixelDensity;
			}

			if (aPath.indexOf(pathPrefix) == -1 && aPath.indexOf("/singlequality/") == -1)
				aPath = pathPrefix + "/" + aPath;

			if(!svgsupport) {
				var svgParts = aPath.split('/');
				var fileName = svgParts[4].split('.');
				fileName = fileName[0];
				var aPath = svgParts[0]+"/"+svgParts[1]+"/"+svgParts[2]+"/svgFallback/"+fileName+'.png';
			}

			return aPath;
		};


		p.getPixelDensityInt = function() {
			switch(this._currentPixelDensity)
			{
				case "1x": 
					return 1;
				break;
				case "2x":
					return 2;
				break;
				default:
					return 1;
				break;
			}
		};

		p._pathContainsSVG = function(aPath) {	
			if(aPath == undefined) return false;
			return aPath.indexOf(".svg") !== -1;	
		};
		p.getAsset = function(id) {	return this.assets[id];	};
		p.hasAsset = function(id) {	return !(this.assets[id] == undefined);	}
		p.removeAsset = function(id) {

		};

		p.supportsSVG = function() {
			var passed = true;
			var checkOne = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
			if(!checkOne) {
				passed = false;
				var checkTwo = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
				if(checkTwo)
					passed = true;
			}
			return passed;
		};


		p.updateAllStyleSheetsForPixelDensity = function() {
			for (var i = 0; i < document.styleSheets.length; i++ ){
				this.updateImageSrcInCSSSheet(document.styleSheets[i]);
			}
		};
		
  		p.updateImageSrcInCSSSheet = function(aStyleSheet) {
  			var ruleList = aStyleSheet.cssRules || aStyleSheet.rules;
			
			if (ruleList){
				for (var i= 0; i < ruleList.length; i++) {
					var rule = ruleList[i];
					
					if(rule.cssRules) {
						for (var j = 0; j< rule.cssRules.length; j++) {
							var newRule = rule.cssRules[j];
							if (newRule.style) {
								if (newRule.style.backgroundImage != "") {
									var newBackgroundImagePath = "";
									if (this._pathContainsSVG(newRule.style.backgroundImage, ".svg"))
										newBackgroundImagePath = newRule.style.backgroundImage.replace(/\/xx\//g, "/svg/");
									else
										newBackgroundImagePath = newRule.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/");
										newRule.style.backgroundImage = newBackgroundImagePath;
										// console.log("updated background image in newRule : ", newRule, " to ",  newBackgroundImagePath);
								}
							}
						}
					}
					else if (rule.style) {
						try {
							if (rule.style.backgroundImage != "") {
								var newBackgroundImagePath = "";
								if (this._pathContainsSVG(rule.style.backgroundImage, ".svg")) {
									newBackgroundImagePath = rule.style.backgroundImage.replace(/\/xx\//g, "/svg/");
								}
								else {
									newBackgroundImagePath = rule.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/");
								}
								rule.style.backgroundImage = newBackgroundImagePath;
								//console.log("updated background image in rule : ", rule, " to ",  newBackgroundImagePath);
							}
						}
						catch(e) {
							console.error(e);
						}
						
					}
				}
			}
  		};

		p._requestOnReadyStateChange = function() {
			switch(this._req.readyState) {
			case 0: //Uninitialized
				case 1: //Set up
				case 2: //Sent
				case 3: //Partly done
					// DO NOTHING
					break;
				case 4: //Done
					if(this._req.status < 400) {						
						if(this._currentAsset.type == "template") this._templateLoadCallback(this._req.responseText);
						// else if ( this._currentAsset.type == "sequenceCombined") this._loadCombinedImageSequence(this._req.responseText);
						// else if (this._currentAsset.type == "sequence360") this._loadCombinedImageSequence(this._req.responseText);
						else {
							console.log( "FROM XML HTTP REQUEST : ", this._req.responseText );
						}
					}
					else {
						this.dispatchCustomEvent(AssetManager.ERROR, "Error loading template from ", this._currentlyLoadingTemplate,  " status : ", this._rq.status);
					}
					break;
			}
		};

		p._updateCombinedImageProgress = function() {
			
			var imageSeqProgress = this.imageSequenceCount / this.frameData.totalImages;
			// console.log("combined image progress : ", imageSeqProgress, " for frame ", this.frameData.name);
			
			this.dispatchCustomEvent(AssetManager.PROGRESS, {loaded:(this._nAssetLoaded + imageSeqProgress), total:this._nAssetToLoad} );
		}

		p.getCombinedSequence = function(id) {
			return this.combinedSequence[id];
		};

		p._templateLoadCallback = function(aTemplateXML) {
			//console.log( aTemplateXML );
			var templateDoc = this._parser.parseFromString(aTemplateXML, "text/xml");

			var templatesInXML = templateDoc.querySelectorAll("*[data-type='template']");

			for (var i = 0; i < templatesInXML.length; i++){
				var templateNode = templatesInXML[i];
				var templateId = templateNode.getAttribute("id");
				templateNode = this._updateImagesInTemplate(templateNode);

				var attrs = templateNode.attributes;
				var result = undefined;
				for(var z = 0; z < attrs.length; z++) {
					if (attrs[z] !== undefined) {
						if(attrs[z].nodeName == 'data-template-id') {
							result = attrs[z].nodeValue;
						}
				  	}
				}
				if (result !== undefined) templateId = result;

				// templateId = (templateNode.getAttribute('data-template-id') === null) ? templateId : templateNode.getAttribute('data-template-id');
				// templateId = (templateNode.dataset['templateId'] === undefined) ? templateId : templateNode.dataset['templateId'];
				this._getAllImagesInTemplate(templateNode);
				this._updateCopyInTemplate(templateNode);

				// this._templates[templateId] = templateNode;			
				this.assets[templateId] = templateNode;
			}

			this._onProgress();
		};



		p._updateImagesInTemplate = function(aTemplate) {

			var imageCollection = aTemplate.querySelectorAll("img");

			for (var i= 0; i < imageCollection.length; i++) {
				var img = imageCollection[i];
				var imgSrc = img.getAttribute('src');
				if (imgSrc) {
					img.setAttribute('src', this.getImageSrc(imgSrc));
				}
			}

			return aTemplate;
		};

		p._getAllImagesInTemplate = function(aTemplate) {
			var childNodes = aTemplate.querySelectorAll("*");
			var imagesInTemplate = [];
			for (var i=0;i<childNodes.length;i++){
				var childNode = childNodes[i];
				for (var j = 0; j < childNode.attributes.length; j++)
				{
					var attributeValue = childNode.attributes[j].value;
					if (attributeValue.match(/(.png)/))
					{
						imagesInTemplate.push(attributeValue);	
					}
						

				}
				// if (childNode.hasAttribute('src'))
				// 	imagesInTemplate.push(childNode.getAttribute('src'));
				
			}
			if (imagesInTemplate.length > 0)
				this.dispatchCustomEvent(AssetManager.TEMPLATE_IMAGES, imagesInTemplate);

		};

		p._updateCopyInTemplate = function(aTemplate) {
			
			var copyCollection = aTemplate.querySelectorAll("*[data-type='copy']");

			for (var i = 0; i < copyCollection.length; i++){
				var copyNode = copyCollection[i];
				var copyId = copyNode.getAttribute("data-copyId");
				// console.log(copyId, copyNode, copyNode.innerHTML);
				try {
					copyNode.innerHTML = siteManager.copyManager.getCopy(copyId);
				}
				catch(e) {
					console.debug( "Error changing copy : ", copyId, siteManager.copyManager.getCopy(copyId) );
					console.debug( "Error changing copy : ", copyNode, copyNode.innerHTML );
				}
				
			}

		};
	}
	
})();