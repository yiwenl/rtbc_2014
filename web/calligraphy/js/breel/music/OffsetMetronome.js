(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.music");

	if(!namespace.OffsetMetronome) {
		var OffsetMetronome = function OffsetMetronome() {

			this._offsetS = 0;
			this._offsetGroupName = "";
			this._beatInterval = -1;

			this._lastCheckedTime = -1;

			this._eventIntervals = [];
		};

		namespace.OffsetMetronome = OffsetMetronome;

		var p = OffsetMetronome.prototype = new EventDispatcher();

		OffsetMetronome.TIMING_INTERVAL = "offsetMetronomeTimingInterval";

		p.setup = function(aOffsetSeconds, aOffsetGroupName, aBeatInterval) {			
		
			this._offsetS = aOffsetSeconds;
			this._offsetGroupName = aOffsetSeconds;
			this._beatInterval = aBeatInterval;

			return this;
		};

		p.addTimingInterval = function(aTimeInterval, aName, aNumberInBar) {

			aName = aName || "";

			var newEventInterval = {
				intervalTime : aTimeInterval,
				numberInBar : aNumberInBar,
				name : aName,
				totalCount : 0,
				countInBar : 0,
				lastReportedTime : -1
				nextExpectedTime : -1
			};

			var alreadyHaveInterval = false;
			for (var i =0; i < this._eventIntervals.length; i++)
			{
				alreadyHaveInterval = (this._eventIntervals[i].intervalTime == aTimeInterval || this._eventIntervals[i].name == aName);
			}
			if (alreadyHaveInterval) console.warn("OffsetMetronome :: WARNING : a timing interval with that name or interval has already been set on this metronome.");

			this._eventIntervals.push(newEventInterval);
		};

		p.removeTimingIntervalByName = function(aName) {

			for (var i =0; i < this._eventIntervals.length; i++)
			{
				var interval = this._eventIntervals[i];
				if (interval.name == aName)  {
					this._eventIntervals.splice(i, 1);
				}					
			}

		};

		/**
		 * update - checks the current time against the last time an update was called, and processes any timing events that may have occurred in the time		 		 
		 */
		p.update = function() {

			var currentTime = (new Date().getTime() / 1000) - this._offsetS;	// subtract the offset time from the current time to move everything in time

			// to prevent craziness on first tick, set all times to 'now'
			if (this._lastCheckedTime < 0){
				this._lastCheckedTime = currentTime;				
				var interval = null;
				for (var i=0; i < this._eventIntervals.length; i++){
					interval = this._eventIntervals[i];
					interval.lastReportedTime = currentTime;
					interval.nextExpectedTime = currentTime + interval.intervalTime;	
				} 
				return;
			}

			var timeDifference = currentTime - this._lastCheckedTime;
			var aInterval = null;
			for (var i = this_eventIntervals.length - 1; i >= 0; i--) {
				aInterval = this_eventIntervals[i];
				if (aInterval.nextExpectedTime <= currentTime){
					this.broadcastInterval(aInterval, currentTime);
				}
			};

		};


		p.broadcastInterval = function(aIntervalObject, aCurrentTime) {
			var aTimeOffset = aCurrentTime - aIntervalObject.nextExpectedTime;

			aIntervalObject.totalCount++;
			aIntervalObject.countInBar++;
			if (aIntervalObject.countInBar >= aIntervalObject.numberInBar) aIntervalObject.countInBar = 0;
			aIntervalObject.nextExpectedTime += aIntervalObject.intervalTime;
			aIntervalObject.lastReportedTime = aCurrentTime;

			this.dispatchCustomEvent(OffsetMetronome.TIMING_INTERVAL, { 
				timeInterval : aIntervalObject.intervalTime, 
				name : aIntervalObject.name,
				countInBar : aIntervalObject.countInBar,
				totalCount : aIntervalObject.totalCount,
				timeOffset : aTimeOffset
			});
			
		};

		
		p.destroy = function() {
		

		};
		
		OffsetMetronome.create = function(aOffsetSeconds, aOffsetGroupName, aBeatInterval) {
			var newOffsetMetronome = new OffsetMetronome();		
			newOffsetMetronome.setup(aOffsetSeconds, aOffsetGroupName, aBeatInterval);	
			return newOffsetMetronome;
		};
		
	}

})();