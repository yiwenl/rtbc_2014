(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundLoader = breelNS.getNamespace("generic.sound").SoundLoader;
	var WebAudioSoundObject = breelNS.getNamespace("generic.sound.webAudio").WebAudioSoundObject;

	var namespace = breelNS.getNamespace("generic.sound.webAudio");

	if(!namespace.WebAudioSoundLoader) {
		var WebAudioSoundLoader = function WebAudioSoundLoader() {

			this._audio = null;
			this._rq = null;

			this._loadCompleteBound = ListenerFunctions.createListenerFunction(this, this._loadComplete);
		};

		namespace.WebAudioSoundLoader = WebAudioSoundLoader;


		var p = WebAudioSoundLoader.prototype = new SoundLoader();
		var s = SoundLoader.prototype;

		p.setup = function(aSoundPath, aSoundURL, aQueueId, aWebAudioContext, aContextCreationTime) {

			s.setup.call(this, aSoundPath, aSoundURL, aQueueId);

			this._rq = new XMLHttpRequest();
			this._rq.open("GET", aSoundURL, true);
			this._rq.responseType = "arraybuffer";

			this._rq.onload = this._loadCompleteBound;
			

			this._soundObject = WebAudioSoundObject.create(this._path, this._url, this._audio, aWebAudioContext, aContextCreationTime);
			this._soundObject.setIsMonophonic(this._soundObjectIsMonophonic);

		};

		p.load = function() {
			if (this._rq) {
				this._rq.send();
				return true;
			} else {
				return false;
			}
		};

		p._loadComplete = function() {
			this.dispatchCustomEvent(SoundLoader.LOADED, this._path);
		};

		WebAudioSoundLoader.create = function(aSoundPath, aSoundURL, aQueueId, aWebAudioContext, aContextCreationTime) {
			var newWebAudioSoundLoader = new WebAudioSoundLoader();
			newWebAudioSoundLoader.setup(aSoundPath, aSoundURL, aQueueId, aWebAudioContext, aContextCreationTime);
			return newWebAudioSoundLoader;

		}
	}

})();