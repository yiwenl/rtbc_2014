(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.sound");

	var SoundLogger = breelNS.getNamespace("generic.sound").SoundLogger;
	var soundLogger = SoundLogger.getSingleton();

	if(!namespace.SoundObject) {
		var SoundObject = function SoundObject() {

			this._soundPath = "";
			this._soundURL = "";
			this._isLoaded = false;
			this._isPlaying = false;
			this._hasAudioStarted = false;
			this._rawDuration = -1;
			this._duration = -1;
			this._padding = 0;
			this.isMute = false;
			this._isMonophonic = true; // if true, we can only have the sound playing one at a time (playing again causes sound to stop and re-play)
		
			this._tweens = [];

			this._currentVolume = 1;
			this._currentVolumeTween = null;
			this._updateVolumeBound = ListenerFunctions.createListenerFunction(this, this._updateVolume);

			this._lastStartTimeRef = null;

		};

		namespace.SoundObject = SoundObject;

		SoundObject.LOADED = "loaded";
		SoundObject.ERROR = "error";
		SoundObject.ENDED = "ended";

		SoundObject.PLAYING = "playing";

		var p = SoundObject.prototype = new EventDispatcher();

		/*
			N.B. All times are in seconds
		 */

		p.setup = function(aSoundPath, aSoundURL) {			
			
			this._soundPath = aSoundPath;
			this._soundURL = aSoundURL;

			return this;
		};

		p.getPath = function() {
			return this._soundPath;
		};

		p.setPadding = function(aPadding) {
			this._padding = aPadding;
		};

		p.setIsMonophonic = function(aIsMonophonic) {
			this._isMonophonic = aIsMonophonic;
		}

		/**
		 * Sets the raw duration of the sample, including padding. 
		 * @param  {[Number]} aRawDuration [total duration of the sample, including padding]		 
		 */
		p._setRawDuration = function(aRawDuration) {			
			this._rawDuration = aRawDuration;		
			this._duration = this._rawDuration - (2 * this._padding);
		};

		/**
		 * Sets the audio duration (excluding padding) for the sample. E.g. if audio is 1s long, with 0.2s padding, you would call this with the argument 1, having set _padding to 0.2s
		 * @param  {[Number]} aAudioDuration [The length of the audio in the sample, in seconds]		 
		 */
		p._setAudioDuration = function(aAudioDuration) {
			this._duration = aAudioDuration;
			this._rawDuration = this._duration + (2 * this._padding);
		};

		p.getDuration = function() {
			return this._duration;
		};

		p.getIsLoaded = function() {
			return this._isLoaded;
		};	

		p.getIsPlaying = function() {
			return this._isPlaying;
		};

		p.getHasAudioStarted = function() {
			return this._hasAudioStarted;
		};

		p.getPadding = function() {
			return this._padding;
		};

		p.load = function() {
			// override this method
			this._loadCompleted();
		};

		p._loadCompleted = function() {
			this._isLoaded = true;
			this.dispatchCustomEvent(SoundObject.LOADED, this._soundPath);
		};

		p.play = function(aFromTime, aDelayTime, aTimingCorrection, aLoop) {

			var allowPlay = false;

			if (this._isLoaded && (!this._isPlaying || !this._isMonophonic)) {
				soundLogger.pushMessage("SoundObject :: playing sound " + this._soundPath + " from time : " + aFromTime + " with delay : " + aDelayTime + " and correction : " + aTimingCorrection + " will start in " + (aDelayTime - aTimingCorrection));
				allowPlay = true;
			}				
			else if (this._isPlaying && this._isMonophonic) {
				console.warn("SoundObject :: tried to play monophonic sound that is already playing: " + this._soundPath);
				allowPlay = false;
			} else if (!this._isLoaded){
				console.warn("SoundObject :: tried to play unloaded sound : " + this._soundPath);
				allowPlay = false;
			} 
				

			if (allowPlay){				
				this._lastStartTimeRef = Date.now() + (this._padding - aTimingCorrection)*1000 - (this._duration * 1000);
		
				
			}




			return allowPlay;

			// override this method

		};

		p.pause = function(aDelayTime, aWithTimeOffset) {

			aDelayTime = aDelayTime || 0;
			aWithTimeOffset = aWithTimeOffset || 0;

			soundLogger.pushMessage("SoundObject :: pausing sound " + this._soundPath + " with delay :" + aDelayTime);
			
			return this._isPlaying;
		};

		p.stop = function(aDelayTime, aWithTimeOffset) {

			aDelayTime = aDelayTime || 0;
			aWithTimeOffset = aWithTimeOffset || 0;

			soundLogger.pushMessage("SoundObject :: stopping sound " + this._soundPath + " with delay :" + aDelayTime);
			
			this._lastStartTimeRef = null;

			return this._isPlaying;
		};

		p.getSyncTime = function() {

			// return the amount of time that this particular sample has been running
			if (this._isPlaying && this._lastStartTimeRef){
				var currentTime= Date.now();
				return (currentTime - this._lastStartTimeRef);
			}else return null;

		};

		p.resetSync = function() {

			this._lastStartTimeRef = null;

		};

		p.setVolume = function(aVolume, aOverTime, aDelayTime, aEasingFunction) {

			aDelayTime = aDelayTime || 0;
			aEasingFunction = aEasingFunction || TWEEN.Easing.Quartic.InOut;

			aOverTime *= 1000;	// convert to MS
			aDelayTime *= 1000;	// convert to MS

			console.log("SoundObject :: setting " + this._soundPath + " to volume " + aVolume + " over time : " + aOverTime + " with delay : " + aDelayTime);

			if(this._currentVolumeTween) this._currentVolumeTween.stop();

			if (aOverTime) {
				new TWEEN.Tween(this).to({ "_currentVolume" : aVolume}, aOverTime).onUpdate(this._updateVolumeBound).delay(aDelayTime).easing(aEasingFunction).start();
			} else {
				this._currentVolume = aVolume;
				this._updateVolume();
			}
			

		};

		p.switchMute = function(sSwitch) {
			if (sSwitch) {
				this.isMute = true;
			}
			else {
				this.isMute = false;
			}
			this._updateVolume();
		}


		p.setPaddingFromMetadata = function(aPadding) {
			aPadding = aPadding || 0;
			this._padding = aPadding;			
			this._setRawDuration(this._rawDuration);	// updates the actual sound duration with the new padding
		};

		p.setDurationFromMetadata = function(aDuration) {
			aDuration = aDuration || 0;
			this._setAudioDuration(aDuration);
		};
	

		p._updateVolume = function() {		

			// override this function

		};

		p._playbackFinished = function() {
			soundLogger.pushMessage("SoundObject :: sound " + this._soundPath + " finished");
			this.dispatchCustomEvent(SoundObject.ENDED, this._soundPath);
		};
		

		p.destroy = function() {
		

		};
		
		SoundObject.create = function(aSoundPath, aSoundURL) {
			var newSoundObject = new SoundObject();		
			newSoundObject.setup(aSoundPath, aSoundURL);	
			return newSoundObject;
		};
		
	}

})();