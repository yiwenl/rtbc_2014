(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.sound");

	if(!namespace.SoundLoader) {
		var SoundLoader = function SoundLoader() {

			this._url = null;
			this._path = null;
			this._queueId = null;
			this._soundObject = null;
			this._soundObjectIsMonophonic = true;

		};

		namespace.SoundLoader = SoundLoader;


		var p = SoundLoader.prototype = new EventDispatcher();

		SoundLoader.LOADED = "soundLoaderLoaded";

		p.setup = function(aSoundPath, aSoundURL, aQueueId, aIsMonophonic) {

			this._url = aSoundURL;
			this._path = aSoundPath;
			this._queueId = aQueueId;

			this._soundObjectIsMonophonic = (aIsMonophonic == true) ? true : false;

			// override this method with sound object creation

		};

		p.load = function() {


		};

		

		p.getSoundObject = function() {
			return this._soundObject;
		};

		SoundLoader.create = function(aSoundPath, aSoundURL, aQueueId, aIsMonophonic) {
			var newSoundLoader = new SoundLoader();
			newSoundLoader.setup(aSoundPath, aSoundURL, aQueueId, aIsMonophonic);
			return newSoundLoader;

		}
	}

})();