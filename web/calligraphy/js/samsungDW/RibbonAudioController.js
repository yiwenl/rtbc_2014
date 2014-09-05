breelNS.defineClass("samsungDW.RibbonAudioController", "generic.events.EventDispatcher", function(p, s, EventDispatcher) {

	var RibbonAudioSoundSample = breelNS.getClass("samsungDW.RibbonAudioSoundSample");
	
	p._init = function() {
		s._init.call(this);

		this._hasLoadedSamples = false;

		this._samples = [];

		this._context = null;
		
	};


	p.setup = function(aAudioFolder, aSamplePrefix, aNumSamples){

		try {
			this._context = new webkitAudioContext();
		} catch(e){
			alert("Error : Could not create Web Audio Context : ", e);			
		}
		

		var sampleIndex = 1;
		for (var i=1; i < aNumSamples + 1; i++){

			var newSample = new RibbonAudioSoundSample();
			newSample.addEventListener(RibbonAudioSoundSample.LOADED, function(aEvent) {
				var obj = aEvent.detail;
				this._samples[obj.id] = obj;
			}.bind(this));
			newSample.load(aAudioFolder + "/" + aSamplePrefix + i + ".wav", this._context, i);

		}


	};

	p.playChime = function(aBrightness, aPosition) {

		aBrightness = aBrightness || 0;
		if (aBrightness > 1) aBrightness = 1;

		var selectedIndex = Math.floor(aBrightness * this._samples.length) ;
		if(selectedIndex == this._samples.length) selectedIndex = this._samples.length-1;
		var sampleToPlay = this._samples[selectedIndex];
		if(sampleToPlay) sampleToPlay.play(.25, aPosition);

	};

	
});
