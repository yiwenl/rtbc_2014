breelNS.defineClass("samsungDW.RibbonAudioSoundSample", "generic.events.EventDispatcher", function(p, s, RibbonAudioSoundSample) {

	RibbonAudioSoundSample.LOADED = "RibbonAudioSampleLoaded";

	p._init = function() {
		s._init.call(this);

		this._samplePath = "";
		
		this._rq = null;
		this._soundBuffer = null;
		this._soundSource = null;
		this._context = null;
		this._gainNode = null;
		this._panNode = null;

		this.id = "";

		this._loaded = false;

	};

	p.load = function(aSamplePath, aWebAudioContext, aID){

		this.id = aID;

		this._context = aWebAudioContext;
		this._samplePath = aSamplePath;

		this._rq = new XMLHttpRequest();
		this._rq.open("GET", aSamplePath, true);
		this._rq.responseType = "arraybuffer";

		this._rq.onerror = this._onLoadError.bind(this);
		this._rq.onload = this._onLoadComplete.bind(this);
		this._rq.send();
	};

	p._onLoadError = function(){
		console.error("RibbonAudioSoundSample :: Error loading sample " + this._samplePath);		
	}

	p._onLoadComplete = function() {

		var audioData = this._rq.response;

		try {
			this._context.decodeAudioData(audioData, this._onDecodeComplete.bind(this));
		} catch(e){
			console.error("RibbonAudioSoundSample :: Error decoding sound sample : ", e);
		}

	};



	p._onDecodeComplete = function(rawBuffer){

		this._soundBuffer = rawBuffer;

		this._gainNode = this._context.createGain();
		this._panNode = this._context.createPanner();

		// this._panNode.panningModel = "equalpower";
		this._setPanValue(0);

		this._gainNode.connect(this._context.destination);
		this._panNode.connect(this._gainNode);

		this._loaded = true;

		this.dispatchCustomEvent(RibbonAudioSoundSample.LOADED, this);

	};


	p.play = function(aVolume, aPan) {

		aVolume = aVolume || 0;
		
		this._setPanValue(aPan * 180);

		this._gainNode.gain.value = aVolume;
		this._soundSource = this._context.createBufferSource();
		this._soundSource.buffer = this._soundBuffer;
		this._soundSource.connect(this._panNode);


		this._soundSource.start(this._context.currentTime);

	};


	p._setPanValue = function(value){
		var xDeg = parseInt(value);
		var zDeg = xDeg + 90;
		if (zDeg > 90) {
		zDeg = 180 - zDeg;
		}
		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));
		this._panNode.setPosition(x, 0, z);
	};
	
});
