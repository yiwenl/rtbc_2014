(function() {

	var namespace = breelNS.getNamespace("generic.analytics");
	var siteManager;

	if(!namespace.AdriverTracking) {
		var AdriverTracking = function(){
			this.container = undefined;
		};
		namespace.AdriverTracking = AdriverTracking;

		var p = AdriverTracking.prototype;

		p.setup = function(aHolder) {
			this.container = aHolder;

			this.ageGate = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=vhodnaya&bt=21&pz=0&rnd=1620516247";
			this.playVideo = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=1&bt=21&pz=0&rnd=1620516248";
			this.becomePartButt = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=2&bt=21&pz=0&rnd=1620516249";
			this.viewGalleryButt = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=3&bt=21&pz=0&rnd=1620516250";
			this.shareTwitter = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=4&bt=21&pz=0&rnd=1620516251";
			this.shareFacebook = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=5&bt=21&pz=0&rnd=1620516252";
			this.shareGoogle = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=6&bt=21&pz=0&rnd=1620516253";
			this.enterThroughFacebook = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=7&bt=21&pz=0&rnd=1620516254";
			this.enterManually = "http://ad.adriver.ru/cgi-bin/rle.cgi?sid=193778&sz=8&bt=21&pz=0&rnd=1620516255";

		};

		p.addTracker = function(aUrl) {
			if(this.container === undefined) {
				console.log("The adriver holding container has not been created");
				return;
			}
			var img = document.createElement("img");
			img.src = aUrl;
			this.container.appendChild(img);
		};

		p.addTrackerByName = function(aName) {
			console.log("addTrackerByName : ", aName);
			if(this.container === undefined) {
				console.log("The adriver holding container has not been created");
				return;
			}
			var url = undefined;
			switch(aName) {
				case "ageGate":
					url = this.ageGate;
				break;
				case "playVideo":
					url = this.playVideo;
				break;
				case "becomePartButt":
					url = this.becomePartButt;
				break;
				case "viewGalleryButt":
					url = this.viewGalleryButt;
				break;
				case "shareTwitter":
					url = this.shareTwitter;
				break;
				case "shareFacebook":
					url = this.shareFacebook;
				break;
				case "shareGoogle":
					url = this.shareGoogle;
				break;
				case "enterThroughFacebook":
					url = this.enterThroughFacebook;
				break;
				case "enterManually":
					url = this.enterManually;
				break;
			}

			if(url === undefined){
				console.log("could not find tracking code with the name of : "+aName);
				return;
			}
			var img = document.createElement("img");
			img.src = url;
			this.container.appendChild(img);
		};

		AdriverTracking.create = function(aHolder) {
			var newAdriverTracking = new AdriverTracking();
			newAdriverTracking.setup(aHolder);
			return newAdriverTracking;
		};
	}
})();