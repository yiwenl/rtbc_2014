(function() {
	
	var EventDispatcher = breelNS.getClass("generic.events.EventDispatcher");
	var ListenerFunctions = breelNS.getClass("generic.events.ListenerFunctions");

	var namespace = breelNS.getNamespace("generic.sound.flash");

	if(!namespace.SoundPlayerFlashLink) {
		var SoundPlayerFlashLink = function SoundPlayerFlashLink() {
	
		};

		namespace.SoundPlayerFlashLink = SoundPlayerFlashLink;

		SoundPlayerFlashLink.FILE_LOADED = "groupLoaded";
		SoundPlayerFlashLink.GROUP_LOADED = "fileLoaded";
		SoundPlayerFlashLink.SOUND_ENDED_REF = "soundEndedRef";
		SoundPlayerFlashLink.FLASH_LOADED = "flashLoaded";

		SoundPlayerFlashLink.DEFAULT_SINGLETON_NAME = "soundPlayerFlashLink";

		var p = SoundPlayerFlashLink.prototype = new EventDispatcher();
		var s = EventDispatcher.prototype;

		p.flashLoaded = function() {
			console.log("generic.sound.flash.SoundPlayerFlashLink::flashLoaded");
			try {
				this.dispatchCustomEvent(SoundPlayerFlashLink.FLASH_LOADED, null);
			}
			catch(theError) {
				console.error("Error occured in flash loaded callback", theError);
				console.log(theError.message, theError.fileName, theError.lineNumber, theError.stack);
			}
		};

		p.groupLoaded = function(aName) {	
			console.log("generic.sound.flash.SoundPlayerFlashLink::groupLoaded");
			console.log(aName);
			
			try {
				this.dispatchCustomEvent(SoundPlayerFlashLink.GROUP_LOADED, aName);
			}
			catch(theError) {
				console.error("Error occured in flash callback", theError);
				console.log(theError.message, theError.fileName, theError.lineNumber, theError.stack);
			}
			
		};

		p.soundEnded = function(aRef) {
			// METODO: implement this in Flash
			console.log("generic.sound.flash.SoundPlayerFlashLink::soundEnded");

			try {
				this.dispatchCustomEvent(SoundPlayerFlashLink.SOUND_ENDED_REF, aRef);				
			} catch(theError){
				console.error("Error occured in flash callback", theError);
				console.log(theError.message, theError.fileName, theError.lineNumber, theError.stack);
			}

		};


		p.fileLoaded = function(aName) {
			console.log("generic.sound.flash.SoundPlayerFlashLink::fileLoaded");
			console.log(aName);
			
			try {
				this.dispatchCustomEvent(SoundPlayerFlashLink.FILE_LOADED, aName);
			}
			catch(theError) {
				console.error("Error occured in flash callback", theError, theError.stack);
			}
		};

		p.destroy = function() {

			s.destroy.call(this);
			
		};
		
		SoundPlayerFlashLink.createSingleton = function(aName) {
			var newSoundPlayerFlashLink = new SoundPlayerFlashLink();
			breelNS.singletons[aName] = newSoundPlayerFlashLink;
			return newSoundPlayerFlashLink;
		};
		
	}

})();