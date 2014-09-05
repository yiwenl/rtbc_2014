(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var SoundLoader = breelNS.getNamespace("generic.sound").SoundLoader;
	var FlashSoundObject = breelNS.getNamespace("generic.sound.flash").FlashSoundObject;
	var SoundPlayerFlashLink = breelNS.getClass("generic.sound.flash.SoundPlayerFlashLink");

	var namespace = breelNS.getNamespace("generic.sound.flash");

	if(!namespace.FlashSoundLoader) {
		var FlashSoundLoader = function FlashSoundLoader() {

			this._flashLink = null;
			this._flashElement = null;
			this._loadCompleteBound = ListenerFunctions.createListenerFunction(this, this._loadComplete);
			this._flashLoadGroupName = null;
		};

		namespace.FlashSoundLoader = FlashSoundLoader;


		var p = FlashSoundLoader.prototype = new SoundLoader();
		var s = SoundLoader.prototype;

		p.setup = function(aSoundPath, aSoundURL, aQueueId, aFlashLink) {

			s.setup.call(this, aSoundPath, aSoundURL, aQueueId);

			this._flashLink = aFlashLink;
			this._flashLink.addEventListener(SoundPlayerFlashLink.GROUP_LOADED, this._loadCompleteBound);
			this._soundObject = FlashSoundObject.create(this._path, this._url, this._flashLink);


		};

		p.setFlashElement = function(aFlashElement) {
			// console.log('setFlashElement', aFlashElement);
			this._flashElement = aFlashElement;
			this._soundObject.setFlashElement(this._flashElement);
		}

		p.load = function() {

			console.log('flashsound loader', this.url);
			this._flashLoadGroupName = this._flashElement.loadFiles([this._url]);

		};


		p._loadComplete = function(aEvent) {

			if (aEvent.detail == this._flashLoadGroupName) {
				
				console.log("FlashSoundLoader :: loaded " + this._path + " with Flash group name " + this._flashLoadGroupName);

				this._flashLink.removeEventListener(SoundPlayerFlashLink.GROUP_LOADED, this._loadCompleteBound);

				this.dispatchCustomEvent(SoundLoader.LOADED, this._path);
			}
				
		};

		FlashSoundLoader.create = function(aSoundPath, aSoundURL, aQueueId, aFlashLink) {
			var newFlashSoundLoader = new FlashSoundLoader();
			newFlashSoundLoader.setup(aSoundPath, aSoundURL, aQueueId, aFlashLink);
			return newFlashSoundLoader;

		}
	}

})();