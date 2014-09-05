(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundLoader = breelNS.getNamespace("generic.sound").SoundLoader;
	var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;
	var FlashSoundLoader = breelNS.getNamespace("generic.sound.flash").FlashSoundLoader;
	var Html5SoundLoader = breelNS.getNamespace("generic.sound.html5").Html5SoundLoader;
	var WebAudioSoundLoader = breelNS.getNamespace("generic.sound.webAudio").WebAudioSoundLoader;

	var SoundPlayerFlashLink = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink");

	var namespace = breelNS.getNamespace("generic.sound");

	if (!namespace.SoundLibrary) {
		var SoundLibrary = function SoundLibrary() {

			this._soundFolderPath = "";
			this._loadingQueues = {};

			this._sounds = {};

			this._globalMuteState = false;

			this._audioFileExtension = "";
			this._usingAudioTech = "";

			this._randomQueryString = Math.round(Math.random() * 100000);
			this._supportsWebAudio = null;
			this._supportsHtml5Audio = null;

			this._webAudioContext = null;
			this._webAudioContextCreationTime = 0;
			this._hasUserEnabledAudio = false;

			this._flashLink = null;
			this._flashElement = null;
			this._flashLoadedCallbackBound = ListenerFunctions.createListenerFunction(this, this._flashLoadedCallback);
			this._flashStatusCallbackBound = ListenerFunctions.createListenerFunction(this, this._flashStatusCallback);
			this._flashSoundRefDidFinishBound = ListenerFunctions.createListenerFunction(this, this._flashSoundRefDidFinish);
			this._flashObjectLoaded = false;
			this._flashSyncSoundLocation = null;
			this._loadNextSoundPendingFlashLoad = false;

			this._readyCallback = null;

			this._checkFlashLoadedIntervalId = -1;
			this._abortingFlashLoad = false;

			this._paddingDuration = 0;
			this._currentLoadingQueue = [];

			this._queueLengthAtBegin = 0;
			this._loadingQueueNames = [];

			this._init();
		};

		namespace.SoundLibrary = SoundLibrary;

		SoundLibrary.LOADED_ONE = "loadedOne"; // fired when we load one sound
		SoundLibrary.ERROR_ONE = "errorOne"; // fired when there's an error on one sound
		SoundLibrary.LOAD_PROGRESS = "loadProgress"; // fired with a progress value
		SoundLibrary.LOADED_QUEUE = "loadedQueue"; // fired when we finish loading the queue
		SoundLibrary.ERROR_QUEUE = "errorQueue"; // fired at the end of the queue if there were any errors

		SoundLibrary.TECH_FLASH = "Flash";
		SoundLibrary.TECH_HTML5 = "HTML5";
		SoundLibrary.TECH_WEBAUDIO = "WebAudio";

		SoundLibrary.NO_SUPPORT = "soundLibraryNoSupport";

		SoundLibrary.MUTE_CHANGED = "soundLibraryMuteChanged";

		SoundLibrary.DEFAULT_PADDING = 1;
		SoundLibrary.DEFAULT_DURATION = 1;


		var p = SoundLibrary.prototype = new EventDispatcher();

		p._init = function() {

			return this;
		};

		p.setup = function(aSoundFolderPath, aTechnology, aFileExtension, aFlashSWFLocation, aFlashSyncSoundLocation, aReadyCallback) {

			if (typeof(aTechnology) == "undefined" || aTechnology == null || aTechnology == "" || aTechnology == "auto") {
				console.log("SoundLibrary :: Sound technology to use not defined - attempting to autodetect");
				aTechnology = this._autoDetectTechnology();

				if (aTechnology === null){
					this.dispatchCustomEvent(SoundLibrary.NO_SUPPORT, null);
				}

			}

			if (typeof(aFileExtension) == "undefined" || aFileExtension == null || aFileExtension == "" || aFileExtension == "auto") {

				console.log("SoundLibrary :: Sound file extension to use not defined - defaulting to MP3");
				aFileExtension = this._autoDetectFileExtension();
			}

			if (typeof(aFlashSWFLocation) == "undefined") {

				console.warn("SoundLibrary :: No location specified for Flash SWF - using default swf/soundplayer.swf");
				aFlashSWFLocation = "files/swf/soundplayer.swf";
			}

			if (typeof(aFlashSyncSoundLocation) == "undefined") {

				console.warn("SoundLibrary :: No location specified for Flash Sync sound - using default swf/syncSound.mp3");
				aFlashSyncSoundLocation = "files/swf/syncSound.mp3";
			}

			if (typeof(aReadyCallback) == "undefined") {
				console.warn("SoundLibrary :: No ready callback specified");
				this._readyCallback = function() { console.log("SoundLibrary :: Ready"); };
			}

			this._soundFolderPath = aSoundFolderPath;
			this._usingAudioTech = aTechnology;
			this._audioFileExtension = aFileExtension.toLowerCase();
			this._readyCallback = aReadyCallback;

			switch (this._usingAudioTech) {

				case SoundLibrary.TECH_WEBAUDIO:
					this._createWebAudioContext();
					this._hasUserEnabledAudio = false;

					this._readyCallback.call();

					break;

				case SoundLibrary.TECH_FLASH:

					if (this._audioFileExtension.toLowerCase() != "mp3") {
						console.warn("SoundLibrary :: Specified audio file extension other than mp3 for Flash - reverting to .mp3");
						this._audioFileExtension = "mp3";
					}

					this._loadNextSoundPendingFlashLoad = true;

					this.createFlashObject(aFlashSWFLocation + "?x=" + this._randomQueryString, aFlashSyncSoundLocation);

					this._hasUserEnabledAudio = true;
					break;

				case SoundLibrary.TECH_HTML5:

					this._hasUserEnabledAudio = false;

					this._readyCallback.call();

					break;

				default:

					break;

			}

			this.setDefaultSamplePadding(1);
			console.log("SoundLibrary :: setting default sample padding to 1s");

		};

		p.setAssetFolder = function(aNewAssetFolder) {
			this._soundFolderPath = aNewAssetFolder;
		}

		p.getAudioTech = function() {
			return this._usingAudioTech;
		};

		p.getFileExtension = function() {
			return this._audioFileExtension;
		};

		p.getRandomQueryString = function() {
			return this._randomQueryString;
		};

		p._createWebAudioContext = function() {

			if (this._usingAudioTech == SoundLibrary.TECH_WEBAUDIO) {

				if (typeof(AudioContext) !== "undefined") {
					this._webAudioContext = new AudioContext();
				} else if (typeof(webkitAudioContext) !== "undefined") {
					this._webAudioContext = new webkitAudioContext();
				} else {
					throw new Error("ERROR : tried to create a WebAudioContext when that technology is not available");
				}
			} else {
				throw new Error("ERROR : tried to set a WebAudioContext when not using that technology");
			}

			this._webAudioContextCreationTime = Date.now();

		};

		p.getWebAudioContextCreationTime = function() {
			return this._webAudioContextCreationTime;
		};

		/**
		 * Plays a preloaded dummy (silent) audio file (should be from a user input) to enable audio on tablet devices
		 */
		p.userInitiatedDummySound = function(aSilentSoundPath) {

			// this.playSound(aSilentSoundPath, 0, 1, 0, false);

			if (!this._hasUserEnabledAudio) {
				if (this._usingAudioTech == SoundLibrary.TECH_WEBAUDIO) {
					// for webaudio, it's easier to create a silent section of audio & play it rather than load

					var bufferSrc = this._webAudioContext.createBufferSource();
					var silentBuffer = this._webAudioContext.createBuffer(2, 1, 44100);
					bufferSrc.buffer = silentBuffer;
					if (typeof(bufferSrc.start) == "function")
						bufferSrc.start(0);
					else
						bufferSrc.noteOn(0);

					console.log("SoundLibrary :: user initiated dummy sound using silent WebAudio buffer");

				} else if (this._usingAudioTech == SoundLibrary.TECH_HTML5){

					try{
						var dummyAudio = new Audio();
					}catch(e) {
						console.log("SoundLibrary ::: error creating audio :: e : ", e);
						var dummyAudio = document.createElement("audio");
					}
					
					// dummyAudio.preload = "auto";
					dummyAudio.src = this._getSoundURL(aSilentSoundPath);
					dummyAudio.play();
					console.log("SoundLibrary :: user initiated dummy sound using HTML5 Audio object");

				}
				this._hasUserEnabledAudio = true;
			}

		};

		p.createFlashObject = function(aSoundPlayerSWFLocation, aSyncSoundLocation) {

			var flashContainerElement = document.createElement("div");
			flashContainerElement.className = "flashSoundPlayerElement";
			flashContainerElement.id = "flashSoundPlayer";



			document.body.appendChild(flashContainerElement);


			console.log("generic.sound.SoundLibrary::createFlashObject");
			console.log("flashSoundPlayer", aSoundPlayerSWFLocation, aSyncSoundLocation);

			if (this._usingAudioTech = SoundLibrary.TECH_FLASH) {


				this._flashSyncSoundLocation = aSyncSoundLocation;

				this._flashLink = SoundPlayerFlashLink.createSingleton(SoundPlayerFlashLink.DEFAULT_SINGLETON_NAME);
				this._flashLink.addEventListener(SoundPlayerFlashLink.FLASH_LOADED, this._flashLoadedCallbackBound);

				var flashvars = {
					"flashLoadedCallback": "breelNS.singletons." + SoundPlayerFlashLink.DEFAULT_SINGLETON_NAME + ".flashLoaded"
				};
				var params = {
					"allowscriptaccess": "always"
				};
				var attributes = {};

				swfobject.embedSWF(aSoundPlayerSWFLocation, "flashSoundPlayer", "1000", "580", "10.0.0", null, flashvars, params, attributes, this._flashStatusCallbackBound);


			} else {
				throw new Error("ERROR : tried to set a Flash Object when not using that technology");
			}

		};

		p._flashLoadedCallback = function(aEvent) {

			if (this._abortingFlashLoad){
				console.warn("SoundLibrary :: Flash Loaded callback fired, but we already aborted the load.");
				return;
			} else {
				clearTimeout(this._checkFlashLoadedIntervalId);
			}

			try {

				console.log("generic.sound.SoundLibrary::_flashLoadedCallback");
				console.log(this._loadingQueues);

				for (var queueName in this._loadingQueues) {
					var queue = this._loadingQueues[queueName];
					for (var i = 0; i < queue.length; i++) {
						queue[i].setFlashElement(this._flashElement);
					}
				};


				// load sync sound
				var syncLoadedCallback = ListenerFunctions.createListenerFunction(this, function(aEvent) {

					this._flashLink.removeEventListener(SoundLibrary.GROUP_LOADED, syncLoadedCallback);


					if (aEvent.detail == "loader0") {
						this._flashElement.setSyncSound(this._flashSyncSoundLocation);
						this._flashElement.setDefaultPaddingLength(this._paddingDuration / 1000);
						this._flashElement.startClock();

						if (this._loadNextSoundPendingFlashLoad) {
							this._loadNextSoundPendingFlashLoad = false;
							this._loadNextSound();
						}
					}

				});

				this._flashLink.addEventListener(SoundPlayerFlashLink.GROUP_LOADED, syncLoadedCallback);

				this._flashElement.loadFiles([this._flashSyncSoundLocation]);

				this._readyCallback.call();

				this._flashObjectLoaded = true;

			} catch(e){

				console.warn("SoundLibrary :: Error calling methods on Flash object - reverting to HTML5");
				this._onFlashLoadError();

			}

			
		};

		p._flashStatusCallback = function(aEvent) {

			console.log("SoundLibrary :: flash status callback : ", aEvent);
			console.log("SoundLibrary :: flash status : " + aEvent.success);
			if (aEvent.success) {
				console.log("SoundLibrary :: flash object loaded successfully");
				this._flashElement = aEvent.ref;

				this._flashElement.style.width = "1px";
				this._flashElement.style.height = "1px";
				this._flashElement.style.position = "absolute";
				this._flashElement.style.bottom = "0px";
				this._flashElement.style.left = "0px";
				this._flashElement.style.zIndex = 1;
				this._flashElement.backgroundColor = "transparent";

				this._checkFlashLoadedIntervalId = setTimeout(this._onFlashLoadError.bind(this), 1000);

			} else {
				console.error("ERROR : SoundLibrary : flash audio player did not load successfully");
				this._onFlashLoadError();
			}
		};


		p._flashSoundRefDidFinish = function(aEvent) {
			// METODO: implement this
			// this method is called when a particular sound ref has finished playing - we then remove it from the list on each FlashSoundObject
			var flashRef = aEvent.detail;
			for (var sndIndex in this._sounds) {
				var snd = this._sounds[sndIndex];
				snd.flashRefDidFinish(flashRef);
			}

		};

		p._onFlashLoadError = function(){

			clearTimeout(this._checkFlashLoadedIntervalId);

			console.error("SoundLibrary :: Flash load timed out - switching back to HTML5");
			this._abortingFlashLoad = true;

			// re-call setup - revert to HTML5
			this.setup(this._soundFolderPath, SoundLibrary.TECH_HTML5, this._autoDetectFileExtension(), "", "", this._readyCallback);

		}

		/**
		 * If the samples have a silent padding at the start & end (required for accurate Flash timing), set the duration here
		 * @param  {int} aPaddingS [padding duration in seconds]
		 */
		p.setDefaultSamplePadding = function(aPaddingS) {
			this._paddingDuration = parseInt(aPaddingS);

			if (this._usingAudioTech == SoundLibrary.TECH_FLASH) {
				if (this._flashObjectLoaded) this._flashElement.setDefaultPaddingLength(this._paddingDuration);
			}
		};

		p.getDefaultSamplePadding = function() {
			return this._paddingDuration;
		}

		p.toggleGlobalMute = function() {
			this.setGlobalMute(!this._globalMuteState);
			return this._globalMuteState;
		}

		p.setGlobalMute = function(aMute) {

			aMute = (aMute) ? true : false;

			this._globalMuteState = aMute;

			for (var sndIndex in this._sounds){
				var snd = this._sounds[sndIndex];
				snd.switchMute(aMute);

			}

			this.dispatchCustomEvent(SoundLibrary.MUTE_CHANGED, this._globalMuteState);

		};

		p.getIsMuted = function() {
			return this._globalMuteState;
		}


		/**
		 * adds a sound path to the loading queue (we can name our queues)
		 * @param  {[String]} aPath    [the sounds' path string relative to the sound folder. Without extension, we add this depending on the tech used]
		 * @param  {[String]} aQueueId [the name of the queue this sound belongs to (preload, gamePage etc)]
		 * @param  {[String]} aDuration [the duration of the audio WITHOUT padding (so will be 2 * aPaddingS shorter than actual audio file) in seconds]
		 * @param  {[String]} aPaddingS [the amount of padding applied to each end of the sample (not total amount), in seconds]
		 */
		p.addSoundToLoadingQueue = function(aPath, aQueueId, aDuration, aPaddingS) {


			if (typeof(this._loadingQueues[aQueueId]) == "undefined") {
				this._loadingQueues[aQueueId] = [];
			}

			if (typeof(aDuration) == "undefined") {
				console.warn("SoundLibrary :: WARNING : added sound to loading queue without specified duration. Using default of " + SoundLibrary.DEFAULT_DURATION + " second(s)");
				aDuration = SoundLibrary.DEFAULT_DURATION;
			}

			if (typeof(aPaddingS) == "undefined") {
				console.warn("SoundLibrary :: WARNING : added sound to loading queue without specified padding. Using default of " + SoundLibrary.DEFAULT_PADDING + " second(s)");
				aDuration = SoundLibrary.DEFAULT_PADDING;
			}

			var soundURL = this._getSoundURL(aPath);

			// store our loading params in an object
			var newLoadObject = this._createLoaderObject(aPath, soundURL, aQueueId);

			var loadCallbackBound = ListenerFunctions.createListenerFunctionWithArguments(this, this._soundDidLoad, [newLoadObject]);
			newLoadObject.addEventListener(SoundLoader.LOADED, loadCallbackBound);

			var newSoundObject = newLoadObject.getSoundObject();
			newSoundObject.switchMute(this._globalMuteState);
			newSoundObject.setPaddingFromMetadata(aPaddingS);
			newSoundObject.setDurationFromMetadata(aDuration);

			this._sounds[aPath] = newSoundObject;

			this._loadingQueues[aQueueId].push(newLoadObject);

			return newLoadObject;

		};


		p._createLoaderObject = function(aPath, aSoundUrl, aQueueId) {
			var newLoadObject;
			switch (this._usingAudioTech) {

				case SoundLibrary.TECH_HTML5:
					newLoadObject = Html5SoundLoader.create(aPath, aSoundUrl + "?x=" + this.getRandomQueryString(), aQueueId);
					break;
				case SoundLibrary.TECH_WEBAUDIO:
					newLoadObject = WebAudioSoundLoader.create(aPath, aSoundUrl + "?x=" + this.getRandomQueryString(), aQueueId, this._webAudioContext, this._webAudioContextCreationTime);
					break;
				default:
					newLoadObject = FlashSoundLoader.create(aPath, aSoundUrl, aQueueId, this._flashLink);

					if (this._flashObjectLoaded) newLoadObject.setFlashElement(this._flashElement);

					break;
			}

			return newLoadObject;
		};

		/**
		 * adds the contents of a particular queue to the current load queue
		 * @param  {[type]} aQueueId [the name of the queue to be loaded]
		 */
		p.beginQueue = function(aQueueId) {

			if (this._loadingQueues[aQueueId]) {

				for (var i = 0; i < this._loadingQueues[aQueueId].length; i++)
					this._currentLoadingQueue.push(this._loadingQueues[aQueueId][i]);

				this._queueLengthAtBegin = this._currentLoadingQueue.length;
				this._loadingQueueNames.push(aQueueId);

				this._loadNextSound();

			} else {
				throw new Error("SoundLibrary ERROR : tried to begin queue that does not exist");
			}

		};


		/**
		 * Gets a sound object for the specified path, if it exits
		 * @param  {String} aPath [The path given when the sound was loaded (without extension or asset folder name)]
		 * @return {[SoundObject]}       [the SoundObject in question, or null if it does not exist]
		 */
		p.getSound = function(aPath) {
			if (this._sounds[aPath]) return this._sounds[aPath];
			else return null;
		}


		p.playSound = function(aPath, aDelay, aVolume, aOverTime, aLoop) {

			// TODO: preload sound if it hasn't been already

			if (!aPath) throw new Error("SoundLibrary :: ERROR : no path defined in playSound");

			aOverTime = aOverTime || 0;
			aDelay = aDelay || 0;
			aVolume = (typeof(aVolume) != "undefined") ? aVolume : 1;


			console.log("SoundLibrary :: playing sound " + aPath + " with delay " + aDelay + " at volume " + aVolume);

			var snd = this.getSound(aPath);
			if (snd) {
				if (snd.getIsLoaded()) {
					snd.setVolume(aVolume, aOverTime, aDelay);
					snd.play(0, aDelay, undefined, aLoop);
					return snd;
				} else {
					console.log("SoundLibrary :: playSound " + aPath + " after load");
					var soundLoadCallback = ListenerFunctions.createListenerFunction(this, function() {
						this._sounds[aPath].play(0, aDelay);
					});
					snd.addEventListener(SoundObject.LOADED, soundLoadCallback);
					snd.load();
					return snd;
				}

			} else {
				// load this sound if it's not ready and play it straight off
				if (console.warn) console.warn("SoundLibrary :: WARNING : called play on unpreloaded sound, sound will play after load");
				var newQueueName = aPath + "_loadQueue";
				var soundUrl = this._getSoundURL(aPath);
				var newLoaderObject = this._createLoaderObject(aPath, soundUrl, newQueueName);
				var soundObject = newLoaderObject.getSoundObject();
				soundObject.setPaddingFromMetadata(this._paddingDuration);
				this._sounds[aPath] = soundObject;
				var soundLoadCallback = ListenerFunctions.createListenerFunction(this, function() {
					this._sounds[aPath].play(0, aDelay);
				});
				soundObject.addEventListener(SoundObject.LOADED, soundLoadCallback);
				soundObject.load();

				return soundObject;
			}
		};

		p._loadNextSound = function() {
			// console.log("generic.sound.SoundLibrary::_loadNextSound");
			// console.log(this._currentLoadingQueue, this._loadingQueueNames);

			if (this._loadNextSoundPendingFlashLoad) return;

			if (this._currentLoadingQueue.length > 0) {
				this._loadSound(this._currentLoadingQueue.shift());
			} else {
				while (this._loadingQueueNames.length)
					this.dispatchCustomEvent(SoundLibrary.LOADED_QUEUE, this._loadingQueueNames.shift());

			}

		};


		p._loadSound = function(aLoadObject) {

			aLoadObject.load();

		};


		p._soundDidLoad = function(aLoadingObject) {

			// console.log("sound did load: ", aLoadingObject);
			this.dispatchCustomEvent(SoundLibrary.LOADED_ONE, aLoadingObject._path);

			var loadProgress = 1 - (this._currentLoadingQueue.length / this._queueLengthAtBegin);

			this.dispatchCustomEvent(SoundLibrary.LOAD_PROGRESS, loadProgress);

			this._loadNextSound();
		};

		p.resetSyncOnAllSounds = function() {
			for (var sndIndex in this._sounds){
				this._sounds[sndIndex].resetSync();
			}

		};

		/**
		 * returns the correct sound URL for the path provided, depending on the tech used
		 * @param  {[type]} aSoundPath [the path relative to the sound folder]
		 */
		p._getSoundURL = function(aSoundPath) {
			var aSoundURL = this._soundFolderPath + "/";
			aSoundURL += aSoundPath + "." + this._audioFileExtension;
			return aSoundURL;
		};



		/**
		 *	Auto-detects which audio technology we should use
		 *
		 */
		p._autoDetectTechnology = function() {
			console.log("SoundLibrary :: Auto-detecting technology to use");
			var singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			try {
				if (singletons.browserDetector) {
					var browserDetector = singletons.browserDetector;
					var techToUse = null;
					if (browserDetector.getIsMobileDevice() || browserDetector.getIsTabletDevice()) {
						// TABLET / MOBILE
						if (browserDetector.getBrowserName() == "firefox" || browserDetector.getBrowserName() == "ie" || browserDetector.getIsAndroid()) {
							if (this._getSupportsHtml5Audio())
								techToUse = SoundLibrary.TECH_HTML5;
							else {
								console.error("SoundLibrary :: Platform does not support audio");
								techToUse = null;
							}

						} else {
							if (this._getSupportsWebAudio())
								techToUse = SoundLibrary.TECH_WEBAUDIO;
							else if (this._getSupportsHtml5Audio())
								techToUse = SoundLibrary.TECH_HTML5;
						}

					} else {
						// DESKTOP
						//if(browserDetector.getBrowserName() == "chrome" || browserDetector.getBrowserName() == "safari" ) {
						if (this._getSupportsWebAudio()) techToUse = SoundLibrary.TECH_WEBAUDIO;
						else if(browserDetector.getBrowserSupportsFlash()) techToUse = SoundLibrary.TECH_FLASH;
						else if (this._getSupportsHtml5Audio()) techToUse = SoundLibrary.TECH_HTML5;

					}

					console.log("SoundLibrary :: Auto-detected tech : " + techToUse);

					return techToUse;

				} else {
					console.warn("SoundLibrary :: Audio technology autodetect failed, no BrowserDetector object found. Defaulting to HTML5");
					return SoundLibrary.TECH_HTML5;
				}
			} catch (e) {

				console.warn("SoundLibrary :: Error during audio technology autodetect - defaulting to HTML5");
				return SoundLibrary.TECH_HTML5;

			}

		};

		p._getSupportsWebAudio = function() {

			if (this._supportsWebAudio == null) {
				try {
					this._supportsWebAudio = (typeof(AudioContext) !== "undefined" || typeof(webkitAudioContext) !== "undefined");
				} catch (e) {
					this._supportsWebAudio = false;
				}

			}
			return this._supportsWebAudio;
		};

		p._getSupportsHtml5Audio = function() {

			if (this._supportsHtml5Audio == null) {
				try {
					this._supportsHtml5Audio = (typeof(Audio) !== "undefined");
				} catch (e) {
					this._supportsHtml5Audio = false;
				}
			}
			return this._supportsHtml5Audio;

		};

		p._autoDetectFileExtension = function() {
			var singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			try {
				if (singletons.browserDetector) {
					var browserDetector = singletons.browserDetector;
					var extensionToUse = ""
					if (browserDetector.getBrowserSupportsAudioExtension("mp3")) extensionToUse = "mp3";
					else if (browserDetector.getBrowserSupportsAudioExtension("ogg")) extensionToUse = "ogg";
					// else if (browserDetector.getBrowserSupportsAudioExtension("wav")) extensionToUse = "wav";
					else extensionToUse = "mp3"; // Sod it, use MP3


					console.log("SoundLibrary :: Auto-detected file extension : " + extensionToUse);

					return extensionToUse;
				} else {
					console.warn("SoundLibrary :: file extension autodetect failed, no BrowserDetector object found. Defaulting to MP3");
					return "mp3";
				}
			} catch (e) {
				console.warn("SoundLibrary :: Error during file extension autodetect - defaulting to MP3");
				return "mp3";
			}

		};


		SoundLibrary.createSingleton = function() {

			if (!namespace.singletons) namespace.singletons = {};
			if (!namespace.singletons.SoundLibrary) {
				namespace.singletons.SoundLibrary = new SoundLibrary();

				// namespace.singletons.SoundLibrary.setup(aSoundFolderPath, aTechnology, aFileExtension, aFlashSWFLocation, aFlashSyncSoundLocation, aReadyCallback);
			}
			return namespace.singletons.SoundLibrary;
		};

	}

})();