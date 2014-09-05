(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var SoundPlayerFlashLink = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink");

	var SoundObject = breelNS.getNamespace("generic.sound").SoundObject;

	var namespace = breelNS.getNamespace("generic.sound.flash");

	if(!namespace.FlashSoundObject) {
		var FlashSoundObject = function FlashSoundObject() {

			this._flashElement = null;
			this._flashLink 	= null;
			this._flashSoundRefs = [];
			this.audioID 		= '';

			this._updateVolumeBound = ListenerFunctions.createListenerFunction(this, this._updateVolume);
		};

		namespace.FlashSoundObject = FlashSoundObject;


		var p = FlashSoundObject.prototype = new SoundObject();
		var s = SoundObject.prototype;

		p.setup = function(aSoundPath, aSoundURL, aFlashLink) {	

			s.setup.call(this, aSoundPath, aSoundURL);
			this._soundEndedBound = ListenerFunctions.createListenerFunction(this, this._soundEnded);
			this._isMonophonic = false;	// flash is never monophonic
			this._flashLink = aFlashLink;			
			return this;
		};

		p.setFlashElement = function(aFlashElement) {
			this._flashElement = aFlashElement;
			this._isLoaded = true;
		}


		p.play = function(aFromTime, aDelayTime, aTimingCorrection, aLoop) {

			aFromTime = aFromTime || 0;
			aDelayTime = aDelayTime || 0;
			aTimingCorrection = aTimingCorrection || 0;

			if (!s.play.call(this, aFromTime, aDelayTime, aTimingCorrection)) return;

			if (this._flashElement)
			{
				var delayTime = aTimingCorrection * -1;
				if (aLoop) this._flashLink.addEventListener(SoundPlayerFlashLink.SOUND_ENDED_REF, this._soundEndedBound);
				try {
					var newFlashSoundRef = this._flashElement.playAudio(this._soundURL, delayTime);
				}
				catch(theError) {
					console.error("Error occured in flash playAudio", theError);
					console.log(theError.message, theError.fileName, theError.lineNumber, theError.stack);
					return;
				}
				this._flashSoundRefs.push(newFlashSoundRef);	// store the ref to this exact sound instance 
				this._updateVolume();
				this._isPlaying = true;
				// console.log('sound reference: ',this._flashSoundRefs);

				try{
					setTimeout(function() {
						this._hasAudioStarted = true;
						this.dispatchCustomEvent(SoundObject.PLAYING, this);
					}.bind(this), ((this._padding + delayTime) * 1000));	
				}catch(e){
					// catch
				}

			} else {
				throw new Error("ERROR: tried to play audio on FlashSoundObject before Flash player is loaded");

				try{
					setTimeout(function() {
						this._hasAudioStarted = true;
						this.dispatchCustomEvent(SoundObject.PLAYING, this);
					}.bind(this), ((this._padding + delayTime) * 1000));	
				}catch(e){
					// catch
				}
				
			}



		};

		p._soundEnded = function(aEvent) {
			var tempP = this._flashSoundRefs[this._flashSoundRefs.length-1];
			if (tempP == aEvent.detail) {
				// console.log("oh new FlashSoundLoader :: ended ", aEvent, tempP);
				this.play(); 
			}

			
			//if (aEvent.detail === )
		}

		p.pause = function(aDelayTime, aWidthTimeOffset) {

			// if(!s.pause.call(this, aDelayTime, aWidthTimeOffset)) return;

			// METODO: implement flash call to pause sounds by flash Ref
			// for (var i = 0; i < this._flashSoundRefs.length; i++)
			// {
			// 	var ref = this._flashSoundRefs[i];
			// 	this._flashElement.pauseByRef(ref);
			// }

			// HACK : just set the volume to 0

			var delayTime = (aDelayTime - aWidthTimeOffset) * 1000;



			setTimeout(function() {

				// ripped out of the SetVolume function

				for (var i = 0; i < this._flashSoundRefs.length; i++)
				{
					var ref = this._flashSoundRefs[i];
					try {
						this._flashElement.setVolume(ref, 0);						
					}
					catch(theError) {
						console.error("Error occured in flash setVolume", theError);
						console.log(theError.message, theError.fileName, theError.lineNumber, theError.stack);
					}
				}

			}.bind(this), delayTime);
			
			this._isPlaying = false;

			// console.log("FlashSoundObject :: pausing in " + delayTime);
			
		};

		p.stop = function(aDelayTime, aWidthTimeOffset){

			this.pause(aDelayTime, aWidthTimeOffset);

		};

		p.flashRefDidFinish = function(aRef) {
			//console.log("generic.sound.flash.FlashSoundObject::flashRefDidFinish");
			//console.log(aRef);
			//console.log(this._flashSoundRefs);
			
			for (var i =0; i< this._flashSoundRefs.length; i++)
			{
				if (this._flashSoundRefs[i] == aRef) this._flashSoundRefs.splice(i, 1);
			}

		};
		
		p._updateVolume = function() {
			//console.log("generic.sound.flash.FlashSoundObject::_updateVolume");
			//console.log(this._flashSoundRefs);
			
			s._updateVolume.call(this);

			for (var i = 0; i < this._flashSoundRefs.length; i++)
			{
				var ref = this._flashSoundRefs[i];
				try {
					if (!this.isMute)  this._flashElement.setVolume(ref, this._currentVolume);
					else this._flashElement.setVolume(ref, 0);
				}
				catch(theError) {
					console.error("Error occured in flash setVolume", theError);
					console.log(theError.message, theError.fileName, theError.lineNumber, theError.stack);
				}
			}

		};


		p.destroy = function() {

			s.destroy.call(this);
			
		};
		
		FlashSoundObject.create = function(aSoundPath, aSoundURL, aFlashLink) {
			var newFlashSoundObject = new FlashSoundObject();		
			newFlashSoundObject.setup(aSoundPath, aSoundURL, aFlashLink);	
			return newFlashSoundObject;
		};
		
	}

})();