// VideoPlayer.js
(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var namespace = breelNS.getNamespace("generic.video");
	var siteManager;

	if(!namespace.VideoPlayer) {
		var VideoPlayer = function() {
			this.video = null;
			this.duration = -1;

			this.volume = 1;
			this._fadeDownId = undefined;

			this.paused = false;

			this.fullScreenApi = {
				supportsFullScreen: false,
				isFullScreen: function() { return false; },
				requestFullScreen: function() {},
				cancelFullScreen: function() {},
				fullScreenEventName: '-',
				prefix: ''
			};
			this.browserPrefixes = 'webkit moz o ms'.split(' ');

			this._shouldLoop = false;
			this._hasEnded = false;
			this.setup();

			this.parentEl = undefined;
		}

		VideoPlayer.VIDEO_PROGRESS = "videoProgress";
		VideoPlayer.END_RANGE = .001;
		VideoPlayer.VIDEO_END = "videoEnd";
		VideoPlayer.VIDEO_CAN_PLAY = "videoCanplay";
		VideoPlayer.WEBKITBEGINFULLSCREEN = 'webkitbeginfullscreeen';
		VideoPlayer.WEBKITENDFULLSCREEN = 'webkitendfullscreen';


		namespace.VideoPlayer = VideoPlayer;
		var p = VideoPlayer.prototype = new EventDispatcher();

		p.setup = function() {
			if (typeof document.cancelFullScreen != 'undefined') {
				this.fullScreenApi.supportsFullScreen = true;
			} else {
				// check for fullscreen support by vendor prefix
				for (var i = 0, il = this.browserPrefixes.length; i < il; i++ ) {
					this.fullScreenApi.prefix = this.browserPrefixes[i];
					if (typeof document[this.fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
						this.fullScreenApi.supportsFullScreen = true;
						break;
					}
				}
			}

			if (this.fullScreenApi.supportsFullScreen) {
				this.fullScreenApi.fullScreenEventName = this.fullScreenApi.prefix + 'fullscreenchange';
				this.fullScreenApi.isFullScreen = function() {
					switch (this.prefix) {
						case '':
							return document.fullScreen;
						case 'webkit':
							return document.webkitIsFullScreen;
						default:
							return document[this.prefix + 'FullScreen'];
					}
				}
				this.fullScreenApi.requestFullScreen = function(el) {
					console.log("requestFullScreen :: this.prefix  : ", this.prefix);
					return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
				}
				this.fullScreenApi.cancelFullScreen = function(el) {
					return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
				}
			}
		};

		p.load = function(path) {

			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			
			// if(browserDetector.getIsTabletDevice() ) path += "_iPad";
			// if(browserDetector.getBrowserName() == "ie" ) path += "_iPad";
			console.log( "Loading Video : ", path );

			try {
				this.video = document.createElement('video');
			} catch(e) {
				this.video = new Video();
			}

			var prefix = path;

			// LVNOTE : REMOVED Webm because we dont have a webm and firefox is looking for it
			if(browserName == "firefox") {
				this.addSource(this.video, prefix + ".mp4", "video/mp4");
				// this.addSource(this.video, prefix + ".webm", "video/webm");
				this.addSource(this.video, prefix + ".ogg", "video/ogg");
			} else {
				this.addSource(this.video, prefix + ".mp4", "video/mp4");
				// this.addSource(this.video, prefix + ".webm", "video/webm");
				this.addSource(this.video, prefix + ".ogg", "video/ogg");
			}
			
			this.video.preload = true;


			this.video.className = "videoPlayer";
			
			if(browserDetector.getBrowserName() == "firefox" || browserDetector.getIsAndroid()) {
				siteManager.scheduler.delay(this, this._canPlay, [], 1000);
				// this._canPlay();
			} else {
				this._canPlayBound = ListenerFunctions.createListenerFunction(this, this._canPlay);
				ListenerFunctions.addDOMListener(this.video, "canplaythrough", this._canPlayBound);
				this._onWebkitEndfullscreenBound = ListenerFunctions.createListenerFunction(this, this._onWebkitEndfullscreen);
				ListenerFunctions.addDOMListener(this.video, 'webkitendfullscreen', this._onWebkitEndfullscreenBound);
			}

			this.video.load();

			//video debugging
			// ListenerFunctions.addDOMListener(this.video, "stalled", function(e) {'Videoplayer Stalled'});
			// ListenerFunctions.addDOMListener(this.video, "suspend", function(e) {'Videoplayer Suspended'});
			// ListenerFunctions.addDOMListener(this.video, "mskeymessage", function(e) {'Videoplayer error in the key session'});
			// ListenerFunctions.addDOMListener(this.video, "waiting", function(e) {'Videoplayer playback stops because the next frame of a video resource is not available'});
			this._isPausedBound = ListenerFunctions.createListenerFunction(this, this._isPaused);
			ListenerFunctions.addDOMListener(this.video, "pause", this._isPausedBound);

			this._onVideoEndBound = ListenerFunctions.createListenerFunction(this, this._onVideoEnd);
			ListenerFunctions.addDOMListener(this.video, 'ended', this._onVideoEndBound);

			this._isProgressBound = ListenerFunctions.createListenerFunction(this, this._onProgress);
			ListenerFunctions.addDOMListener(this.video, "progress", this._onProgress);

			//this._efIndex = siteManager.scheduler.addEF(this, this._loop, []);// This didn't work after a few sedonds in Firefox TD

			this._loopBound = ListenerFunctions.createListenerFunction(this, this._loop);
			this._efIndex = window.setInterval(this._loopBound, 100);
		};

		p.getVideoElement = function() {
			return this.video;
		};

		p.setWidth = function(aWidth) {
			this.video.style.width = aWidth + "px";
		};

		p._canPlay = function(e) {
			//console.log('VideoPlayer canPlay fired: ');
			this.dispatchCustomEvent(VideoPlayer.VIDEO_CAN_PLAY, this);
			ListenerFunctions.removeDOMListener(this.video, "canplaythrough", this._canPlayBound);
		};

		p._loop = function() {
			if(this.video.currentTime > this.video.duration-VideoPlayer.END_RANGE) {
				if(this._shouldLoop){
					this.dispatchCustomEvent(VideoPlayer.VIDEO_END, this);
				} else {
					if(!this._hasEnded) {
						this._hasEnded = true;
						this.dispatchCustomEvent(VideoPlayer.VIDEO_END, this);
					}
				}
			}
		};

		p.play = function() {
			this.video.play();
			this._hasEnded = false;
			this.paused = false;
		};

		p.loadVideo = function(){

			this.video.load();	
		};




		p.pause = function() {
			this.video.pause();
			this.paused = true;
		};



		p._onVideoEnd = function(){

			siteManager.analyticsManager.gaTrack('video', 'ended');
		
		};

		p.toggleFullScreen = function() {
			if(this.fullScreenApi.supportsFullScreen) {
				if(this.fullScreenApi.isFullScreen()) {
					this.fullScreenApi.cancelFullScreen();
				} else {
					this.fullScreenApi.requestFullScreen(this.video);
				}
			} else {
			}
		};

		p._onWebkitEndfullscreen = function(){

			this.dispatchCustomEvent(VideoPlayer.WEBKITENDFULLSCREEN);	
		};

		p._isPaused = function() {
			//console.log('Videoplayer: video is paused');
			return this.paused;
		};

		p._onProgress = function(e) {
			//console.log('Videoplayer: On Current progress');
		};


		p.seek = function(time) {
	
			this.video.currentTime = time;
		};


		p.addSource = function(element, src, type) {
			var source = document.createElement('source');

    		source.src = src;
    		if (type)
    			source.type = type;

    		element.appendChild(source);
		};


		p.addToDom = function(dom) {
			this.parentEl = dom;
			this.parentEl.appendChild(this.video);
		};

		p.fadeDownVolume = function() {
			this._fadeDownId = siteManager.scheduler.addEF(this, this.fadeDownVolumeLoop, [], 50, 10);
		};
		p.fadeDownVolumeLoop = function() {
			if (this.volume > 0){
				this.volume -= .1;
				this.volume = Math.round(this.volume * 10) /10;
				if(this.video) this.video.volume = this.volume;
			}
		};

		p.setSize = function(aWidth, aHeight) {
			if(aWidth !== undefined) this.video.style.width = aWidth + "px";
			if(aHeight !== undefined) this.video.style.height = aHeight + "px";
		};


		p.destroyVideo = function() {
			window.clearInterval(this._efIndex);
			if(this.video) {
				this.video.pause();
				this.video.src = "";
				this.video = null;
				this.volume = 1;
			}
			
		};
	}
	
})();