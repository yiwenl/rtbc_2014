(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	
	var namespace = breelNS.getNamespace("generic.loading");

	var siteManager, scheduler;

	if(!namespace.ImageSequenceLoader) {

		var ImageSequenceLoader = function ImageSequenceLoader() {

			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			scheduler = siteManager.scheduler;

			this._req = null;
			this._sequenceID = null;
			this.frameData = null;
			this.frames = null;
			this.images = [];

			this.startTime = null;
			this._preFolderName = "";
			this._sourceFolderName = "";

			this._loaded = false;

			this._onReadyStateChangeBound = this._onReadyStateChange.bind(this);
		};

		namespace.ImageSequenceLoader = ImageSequenceLoader;

		ImageSequenceLoader.LOADED = "loaded";
		ImageSequenceLoader.PROGRESS = "progress";
		ImageSequenceLoader.ERROR = "error";

		ImageSequenceLoader.LOAD_TIME_REPORT = "loadTimeReport";

		var p = ImageSequenceLoader.prototype = new EventDispatcher();

		p.load = function(aSequenceJSONURL, aSequenceID) {
			//console.log("generic.loading.ImageSequenceLoader::load");
			//console.log(aSequenceJSONURL, aSequenceID);

			if (this._loaded){
				this.onComplete();
				return;
			}

			console.log("ImageSequenceLoader :: Loading sequence " + aSequenceID + " from " + aSequenceJSONURL);
			
			this._sequenceID = aSequenceID;

			this._req = new XMLHttpRequest();
			this._req.onreadystatechange = this._onReadyStateChangeBound;
			this._req.open("GET", aSequenceJSONURL, true);
			this._req.send(null);

			this.startTime = Date.now();

		};

		p.setSourceFolderName= function(aFolderName){
			console.log("ImageSequenceLoader :: setting source folder name to " + aFolderName)
			this._sourceFolderName = aFolderName + "/";
		}

		p.setPreFolderName = function(aFolderName) {
			console.log("ImageSequenceLoader :: setting prefolder name to " + aFolderName)
			this._preFolderName = aFolderName + "/";
		};

		p._onReadyStateChange = function(){
			switch(this._req.readyState) {
			case 0: //Uninitialized
				case 1: //Set up
				case 2: //Sent
				case 3: //Partly done
					// DO NOTHING
					break;
				case 4: //Done
					if(this._req.status < 400) {						
						this._loadCombinedImageSequence(this._req.responseText);						
					} else  {
						this.onError("Request returned error");
						this.dispatchCustomEvent(ImageSequenceLoader.ERROR, "ERROR Loading image sequence : status : ", this._req.status);	
					}
					break;
			}


		};


		p._loadCombinedImageSequence = function(frameData) {

			this._imageSequenceLoadedOneFrame = false;
			
			if (frameData)
				var tempData = JSON.parse(frameData);
			else {
				this.onError("No Frame data loaded");
				return;
			}
			
			this.frameData = tempData;

				
			this.imageSequenceCount = 0;
			this.frames = this.frameData.frames.concat();
			this._numberFrames = this.frameData.totalImages;

			console.log("ImageSequenceLoader :: loadCombinedImageSequence "+ tempData.name + " number of images " + tempData.totalImages);
				

			for (var i=0; i <this._numberFrames+1;i++){

				var frameLoadCallback = function(aIndex) { this._loadCombinedImageByIndex(aIndex); }.bind(this);
				scheduler.defer(this, frameLoadCallback, [i]);
			}


			// this._loadNextCombinedImage();

		};

		

		p._loadCombinedImageByIndex = function(aIndex) {
 
			var path = this._sourceFolderName + "sequences/" + this._preFolderName + this.frameData.name + "/" + this.frameData.name + "_" + aIndex + ".jpg";
			var img = new Image();
			var that = this;
			img.onload = function() {

				if (that._isCancellingQueue){
					that._isCancellingQueue = false;
					return;
				}

				that.images[aIndex] = this;
				
				that.imageSequenceCount++;				
						
				that.onProgress();
				

			}

			img.onerror = function() {
				if (that._isCancellingQueue){
					that._isCancellingQueue = false;
					return;
				}

				var fakeImage = new Image();
				
				that.images[aIndex] = fakeImage;
				
				that.imageSequenceCount++;
										
				that.onProgress();

			};

			img.src = path;

		};

		p.getFrameData = function() {
			return this.frameData;
		};

		p.getImages = function() {
			return this.images;
		};

		p.onProgress = function(){

			var progress = 0;
			if (this.imageSequenceCount > 0)
				progress = this.imageSequenceCount / this.frameData.totalImages;


			// console.log("ImageSequenceLoader :: Progress : " + progress);
			this.dispatchCustomEvent(ImageSequenceLoader.PROGRESS, progress);


			if(this.imageSequenceCount == this.frameData.totalImages+1) {

				this.onComplete();
			} 
			
		};

		p.onComplete = function() {
			this._loaded = true;
			this.dispatchCustomEvent(ImageSequenceLoader.LOADED, this._sequenceID);
			console.log("ImageSequenceLoader :: " + this._sequenceID + " Load complete");

			try{
				var loadDuration = (Date.now() - this.startTime) / 1000;
				console.log("ImageSequenceLoader :: sequnce loaded in " + loadDuration + " seconds");
				this.dispatchCustomEvent(ImageSequenceLoader.LOAD_TIME_REPORT, { 'duration' : loadDuration, 'name' : this._sequenceID });
			} catch(e){
				// do nothing
			}


		};

		p.abort = function() {
			this._isCancellingQueue = true;

		};

		p.onError = function(aMessage){

		
			console.error("ImageSequenceLoader :: ERROR Loading sequence : " + this._sequenceID + " : " + aMessage);
			this.dispatchCustomEvent(ImageSequenceLoader.ERROR, aMessage);			
		}


		p._loadNextCombinedImage = function() {

			if(this.imageSequenceCount == this.frameData.totalImages+1 ) {

				this.onComplete();

				return;
			} 
 
			var path = "sequences/" + this.frameData.name + "/" + this.frameData.name + "_" + this.imageSequenceCount + ".jpg";
			var img = new Image();
			var that = this;
			img.onload = function() {

				if (that._isCancellingQueue){
					that._isCancellingQueue = false;
					return;
				}

				that.images.push(this);
				
				that.imageSequenceCount++;				

				scheduler.next(that, that._loadNextCombinedImage, null);					
				
				// that._loadNextCombinedImage();
						
				that.onProgress();
				

			}

			img.onerror = function() {
				if (that._isCancellingQueue){
					that._isCancellingQueue = false;
					return;
				}

				var fakeImage = new Image();

				that.images.push(fakeImage);
				
				that.imageSequenceCount++;
				
				scheduler.next(that, that._loadNextCombinedImage, null);	
				// that._loadNextCombinedImage();
						
				that.onProgress();

			};

			img.src = path;
			
		};
	}

})();