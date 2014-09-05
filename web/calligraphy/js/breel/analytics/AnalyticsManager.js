(function() {

	var namespace = breelNS.getNamespace('generic.analytics');
	var siteManager;

	if (!namespace.AnalyticsManager)
	{
		var AnalyticsManager = function() {
			this.breelTracker = undefined;
			this.clientTracker = undefined;
			this.allTrackers = undefined;
		};

		namespace.AnalyticsManager = AnalyticsManager;

		var p  = AnalyticsManager.prototype;

		p.setup = function() {
			console.log('AnalyticsManager setup');
			this.breelTracker = ga.getByName('breel');
			this.clientTracker = ga.getByName('client');
			this.allTrackers = ga.getAll();
			this.allTrackersLength = (this.allTrackers === undefined) ? 0 : this.allTrackers.length;
		};

		p.gaTrackPage = function(aLocation, aPage, aTitle) {
			// console.log("AnalyticsManager ::: gaTrackPage :: aLocation, aPage, aTitle : ", aLocation, aPage, aTitle);

			if (window.analyticsIsActive){
				if(aPage !== undefined && aLocation.charAt(0) != '/') {
					// LVNOTE : aPage value must start with a forward slash.
					aPage += '/'+aPage;
				}

				for(var i=0; i<this.allTrackersLength; i++) {
					var tracker = this.allTrackers[i];
					if(aLocation !== undefined && aPage !== undefined && aTitle !== undefined){
						tracker.send('pageview', aLocation, aPage, aTitle);
					} else if(aLocation !== undefined && aPage !== undefined) {
						tracker.send('pageview', aLocation, aPage);
					} else if(aLocation !== undefined) {
						tracker.send('pageview', aLocation);
					} else {
						tracker.send('pageview');
					}
				}
			}
			
		};

		p.gaTrackEvent = function(aCategory, aAction, aLabel, aValue){
			// console.log("AnalyticsManager ::: gaTrackEvent :: aCategory, aAction, aLabel, aValue : ", aCategory, aAction, aLabel, aValue);
			/*
				Details : 
				aCategory - Typically the object that was interacted with (e.g. button)
				aAction - The type of interaction (e.g. click)
				aLabel - Useful for categorizing events (e.g. nav buttons)
				aValue - Values must be non-negative. Useful to pass counts (e.g. 4 times)
			 */
			
			if (window.analyticsIsActive){
				for(var i=0; i<this.allTrackersLength; i++) {
					var tracker = this.allTrackers[i];
					if(aLabel !== undefined && aValue !== undefined) {
						tracker.send('event', aCategory, aAction, aLabel, aValue);
					} else if(aLabel !== undefined) {
						tracker.send('event', aCategory, aAction, aLabel);
					} else {
						tracker.send('event', aCategory, aAction);
					}
				}
			}
			
		};

		p.gaTrackSocialInteraction = function(aSocialNetwork, aSocialAction, aSocialTarget, aPage) {
			// console.log("AnalyticsManager ::: aSocialNetwork, aSocialAction, aSocialTarget, aPage : ", aSocialNetwork, aSocialAction, aSocialTarget, aPage);
			
			if (window.analyticsIsActive){
				for(var i=0; i<this.allTrackersLength; i++) {
					var tracker = this.allTrackers[i];
					if(aPage !== undefined) {
						tracker.send('social', aSocialNetwork, aSocialAction, aSocialTarget, {'page': '/'+aPage});
					} else {
						tracker.send('social', aSocialNetwork, aSocialAction, aSocialTarget);
					}
				}
			}

		};

	}
})();