(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.music");

	if(!namespace.Metronome) {
		var Metronome = function Metronome() {

			this._running = false;

			this._bpm = 120;
			this._beatsPerBar = 4;

			this._bars = 0;
			this._beats = 0;

			this._loopPointBeats = -1; // sets this metronome to loop bar numbers back to 0

			this._numOffsetGroups = 0;
			this._offsetMetronomes = {};	// collection of sub-metronomes offset to different time values (for audio sync, visual sync etc)


			// internal vars for speed
			this.__beatsPassed = 0;
			this.__timeDiff = 0;	
			this.__updateVariance = 0;
			this.__totalBeats = 0;

			this._lastBeatTimeS = null;

			this._beatInterval = (60) / this._bpm; 

			this.__nextUpdateInterval = this._beatInterval;
			this.__nextUpdateInterval += 1; // add 1 ms to ensure we're always after a beat event

			this._updateBound = ListenerFunctions.createListenerFunction(this, this._update);

		};

		namespace.Metronome = Metronome;			

		Metronome.UPDATE_INTERVAL = 10;

		var p = Metronome.prototype = new EventDispatcher();

		p.setup = function() {		
		

			return this;
		};

		p.setBPM = function(aBPM) {

			this._bpm = aBPM;
			this._beatInterval = 60 / this._bpm; 
			this.__nextUpdateInterval = Metronome.UPDATE_INTERVAL;		

			this.__nextUpdateInterval += 1;	// add 1 ms to ensure we're always after a beat event
		};

		p.setBeatsPerBar = function(aNumBeats) {
			this._beatsPerBar = aNumBeats;
		};

		p.getBPM = function() { return this._bpm; }
		p.getBeatsPerBar = function() { return this._beatsPerBar; }

		p.getBars = function() {
			return this._bars;
		};

		p.getBeats = function() {
			return this._beats;
		};

		p.setLoopBar = function(aLoopBar) {
			this._loopPointBeats = (aLoopBar * this._beatsPerBar) + 1;
		};


		p.start = function() {

			this._lastBeatTimeS = (new Date().getTime() / 1000);
			this._bars = 0;
			this._beats = 0;

			this._running = true;

			setTimeout(this._updateBound, this.__nextUpdateInterval);

			this._updateBound();

		};

		p.stop = function() {


			this._running = false;
		};

		p.addOffsetGroup = function(aOffsetSeconds, aGroupName) {

			aGroupName = aGroupName || "";
			if (aGroupName.length == 0){
				aGroupName = "offsetGroup_" + (this._numOffsetGroups + 1);
			}

			var newOffsetMetronome = OffsetMetronome.setup(aOffsetSeconds, aGroupName, this._beatInterval);
			this._offsetMetronomes[aGroupName] = newOffsetMetronome;
			this._numOffsetGroups++;
		};

		p.addIntervalCallbackWithOffset = function(aBeatFractionInterval, aOffsetAmount, aCallbackMethod) {
			

		};

		p._update = function() {

			// set the timeout to update before any other (potentially lengthly) calls
			setTimeout(this._updateBound, this.__nextUpdateInterval);

			var offsetMetrosLength = this._offsetMetronomes.length;
			for (var i = 0; i < offsetMetrosLength; i++)
				this._offsetMetronomes[i].update();
			
		};

		p.convertDurationToBeats = function(aDuration) {
			return Math.floor(aDuration / this._beatInterval);
		};

		p.convertDurationToWholeBars = function(aDuration) {
			return Math.floor(aDuration / (this._beatInterval * this._beatsPerBar));
		};

		p.convertBeatsToDuration = function(aBeats) {
			return this._beatInterval * aBeats;

		};

		p.convertBarsToDuration = function(aBars) {
			return this.convertBeatsToDuration(aBars * this._beatsPerBar);
		};

		p.destroy = function() {
		

		};
		
		Metronome.create = function() {
			var newMetronome = new Metronome();		
			newMetronome.setup();	
			return newMetronome;
		};
		
	}

})();