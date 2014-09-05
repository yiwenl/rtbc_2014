(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;

	var namespace = breelNS.getNamespace("generic.sound.webAudio");

	if(!namespace.WebAudioSoundObject) {
		var WebAudioSoundObject = function WebAudioSoundObject() {

			this._rq = null;
			this._soundBuffer = null;
			this._soundSource = null;
			this._context = null;
			this._contextCreationTime = null;
			this._gainNode = null;
			this._isiOS = false;
			this._supportsBufferSourceStartFunction = false;

			this._trimPadding = false;
			this._hasAddedPaddingToSyncTime = false;

			this._loadCompleteBound = ListenerFunctions.createListenerFunction(this, this._loadCompleted);
			this._playbackFinishedBound = ListenerFunctions.createListenerFunction(this, this._playbackFinished);
			this._updateVolumeBound = ListenerFunctions.createListenerFunction(this, this._updateVolume);

			this._playbackFinishedTimeoutId = -1;
		};

		namespace.WebAudioSoundObject = WebAudioSoundObject;


		var p = WebAudioSoundObject.prototype = new SoundObject();
		var s = SoundObject.prototype;
		

		p.setup = function(aSoundPath, aSoundURL, aAudioObject, aWebAudioContext, aContextCreationTime) {	

			s.setup.call(this, aSoundPath, aSoundURL, aAudioObject);

			this._context = aWebAudioContext;
			this._contextCreationTime = aContextCreationTime;

			if (typeof(this._context.createGain) == "function"){
				this._gainNode = this._context.createGain();
			} else{
				this._gainNode = this._context.createGainNode();	
			}			
			this._gainNode.connect(this._context.destination);

			var dummySoundSource = this._context.createBufferSource();
			this._supportsBufferSourceStartFunction = typeof(dummySoundSource.start) == "function";
			dummySoundSource = null;

			this._isiOS = breelNS.getNamespace(breelNS.projectName).singletons.browserDetector.getIsIOS();
			
			return this;
		};

		p.load = function() {
			
			if (!this._isLoaded){

				this._rq = new XMLHttpRequest();
				this._rq.open("GET", this._soundURL, true);
				this._rq.responseType = "arraybuffer";

				this._rq.onerror = this._loadCompleteBound;
				this._rq.onload = this._loadCompleteBound;
				this._rq.send();

			} else {
				this._loadCompleted();
			}
		
		};

	
		p._loadCompleted = function() {		

			var audioData = this._rq.response;			
			try {		

				// this._context.decodeAudioData(audioData, this._decodeCompletedBound);

				var rawBuffer = this._context.createBuffer(audioData, false);
				this._decodeCompleted(rawBuffer);

			} catch(e){
				console.error("ERROR : WebAudioSoundObject - did not receive valid audio data from " + this._soundURL + ", creating silent buffer");
				var rawBuffer = null;
				rawBuffer = this._context.createBuffer(2, 1, 44100);

				this._decodeCompleted(rawBuffer);
			}
			
		};


		p._decodeCompleted = function(rawBuffer) {

			this._trimPadding = !this._supportsBufferSourceStartFunction;
			this._trimPadding = true;

			if (this._trimPadding) {
				try {
					// trim the padding from the raw buffer so we can play it immediately

					var sampleBufferLength = rawBuffer.length;
				
					this._soundBuffer = this._context.createBuffer(rawBuffer.numberOfChannels, sampleBufferLength, rawBuffer.sampleRate);

					var startSampleOffset = (this._padding) * rawBuffer.sampleRate;			

					for (var i =0; i < rawBuffer.numberOfChannels; i++)
					{
						var channel = this._soundBuffer.getChannelData(i);
						var rawChannel = rawBuffer.getChannelData(i);
						var channelSampleData = rawChannel.subarray(startSampleOffset, startSampleOffset + sampleBufferLength);
						channel.set(channelSampleData);
					}
				} catch(e){
					console.warn("ERROR :: WebAudioSoundObject there was an issue trimming the padding from this sample");
					this._soundBuffer = rawBuffer;
				}
				

			} else {

				this._soundBuffer = rawBuffer;

			}

			this._setRawDuration(this._soundBuffer.duration);

			console.log(" Web Audio Sound " + this._soundPath + " loaded : buffer length : " + rawBuffer.duration);
		

			this._isLoaded = true;
			
			s._loadCompleted.call(this);

		};

		p.play = function(aFromTime, aDelayTime, aTimingCorrection, aLoop) {

			aLoop = aLoop || false;
			aFromTime = aFromTime || 0;
			aDelayTime = aDelayTime || 0;
			aTimingCorrection = aTimingCorrection || 0;

			if (!s.play.call(this, aFromTime, aDelayTime, aTimingCorrection)) return;

			var delayTimeS = aTimingCorrection;
			var fromTimeS = aFromTime;

			// console.warn("SAMPLE RATE: " + this._context.sampleRate);

			if (this._soundSource){
				var oldSoundSource = this._soundSource;
				if (this._supportsBufferSourceStartFunction){
					oldSoundSource.stop(this._context.currentTime + aDelayTime);		

				} else {
					oldSoundSource.noteOff(this._context.currentTime + aDelayTime);				

				}


			}


			this._soundSource = this._context.createBufferSource();
			this._soundSource.buffer = this._soundBuffer;
			this._soundSource.connect(this._gainNode);
			this._soundSource.loop = aLoop;
			

			

			if (this._supportsBufferSourceStartFunction){
				
				this._soundSource.start(this._context.currentTime + delayTimeS);	

				// this._lastStartTimeRef = Date.now() + (delayTimeS * 1000) - (this._duration*1000) - 150; // nasty magic offset number here

				// this._lastStartTimeRef = this._contextCreationTime + (this._context.currentTime * 1000) + (delayTimeS * 1000) - (this._duration*1000);
				this._lastStartTimeRef = Date.now() + (delayTimeS * 1000) - (this._duration * 1000);
			}				
			else {
				
				this._soundSource.noteOn(this._context.currentTime + delayTimeS);	
				this._lastStartTimeRef = Date.now() + (delayTimeS * 1000) - (this._duration * 1000);

				// this._lastStartTimeRef = this._contextCreationTime + (this._context.currentTime * 1000) + (delayTimeS * 1000) - (this._duration*1000) - 80; // nasty magic offset number here

				
			}

			
			try{

				var playingDelayTime = (delayTimeS * 1000);
				playingDelayTime = (playingDelayTime > 0) ? playingDelayTime : 100;

				setTimeout(function() {
					this._hasAudioStarted = true;
					this.dispatchCustomEvent(SoundObject.PLAYING, this);

					this._playbackFinishedTimeoutId = setTimeout(this._playbackFinishedBound, this._duration * 1000);

				}.bind(this), playingDelayTime);	

				// console.log("WebAudioSoundObject :: dispatching PLAYING event in " + playingDelayTime);
				
			}catch(e){
				console.error("WebAudioSoundObject :: Problem dispatching PLAYING event : ", e);
			}
				
			
			this._isPlaying = true;
		};

		p.pause = function(aDelayTime, aWidthTimeOffset) {


			if(!s.pause.call(this, aDelayTime, aWidthTimeOffset)) return;

			// var delayTimeS = aDelayTime - aWidthTimeOffset;

			var delayTimeS = aWidthTimeOffset;

			if (this._supportsBufferSourceStartFunction){
				this._soundSource.stop(this._context.currentTime + delayTimeS);		
				// this._soundSource = null;		
			} else {
				this._soundSource.noteOff(this._context.currentTime + delayTimeS);				
				// this._soundSource = null;
			}


			this._playbackFinished();
		};

		p.stop = function(aDelayTime, aWidthTimeOffset){

			this.pause(aDelayTime, aWidthTimeOffset);

			this._hasAddedPaddingToSyncTime = false;

		}

		p._playbackFinished = function() {

			clearTimeout(this._playbackFinishedTimeoutId);

			s._playbackFinished.call(this);

			this._isPlaying = false;

		};

		p._updateVolume = function() {

			s._updateVolume.call(this);

			if (!this.isMute) {
				this._gainNode.gain.value = this._currentVolume;
			}
			else this._gainNode.gain.value = 0;

		};

		p.getSyncTime = function() {

			// return the amount of time that this particular sample has been running
			if (this._isPlaying && this._lastStartTimeRef){
				var currentTime= Date.now();
				return (currentTime - this._lastStartTimeRef);
			}else return null;

		};	


		p.destroy = function() {

			s.destroy.call(this);
			this._soundBuffer = null;

		};
		
		WebAudioSoundObject.create = function(aSoundPath, aSoundURL, aAudioObject, aWebAudioContext, aContextCreationTime) {
			var newWebAudioSoundObject = new WebAudioSoundObject();		
			newWebAudioSoundObject.setup(aSoundPath, aSoundURL, aAudioObject, aWebAudioContext, aContextCreationTime);	
			return newWebAudioSoundObject;
		};
		
	}

})();