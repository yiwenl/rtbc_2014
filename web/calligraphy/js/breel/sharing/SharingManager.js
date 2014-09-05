(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var namespace = breelNS.getNamespace("generic.sharing");

	var singletons, siteManager;

	if(!namespace.SharingManager) {

		var SharingManager = function() {

			this._FB = null;
			this._twitter = null;

			this.pixelDensity = null;

			this.domain = document.location.hostname;
			this.sitePath = document.location.pathname;
			this.imagePath = this.sitePath + 'files/images/share_image.jpg';
			this.httpRef = "http";

			
			// this.httpRef = "https";
		};
		
		namespace.SharingManager = SharingManager;
		var p = SharingManager.prototype = new EventDispatcher;

		SharingManager.BITLY_LOGIN = "allForThis";
		SharingManager.BITLY_API_KEY = "R_72ac3db7208175b9d2e6cdb540335bcc";
		SharingManager.BITLY_ACCESS_TOKEN = "084a11e1c17c04d8deb68d9a25932fda01d3a5da";
		SharingManager.TWITTER_BASE_URL = "https://twitter.com/intent/tweet?url=";
		
		p.setup = function(aFbObj) {
			singletons = breelNS.getNamespace(breelNS.projectName).singletons;
			siteManager = singletons.siteManager;
			this.pixelDensity = siteManager.assetManager.getPixelDensityInt();

			this.setupShareObjects();
			if(aFbObj !== undefined) this.setFacebookObj(aFbObj);
		};

		p.setupShareObjects = function() {
			this.defaultFacebookShare();
			this.defaultTwitterShare();
			this.defaultGoogleShare();
			this.defaultPinterestShare();
		};

		p.defaultFacebookShare = function() {
			this._facebookShareObj = {
				'name' : siteManager.copyManager.getCopy("generic/sharing/facebook/title"),
				'caption' : '',
				'descr' : siteManager.copyManager.getCopy("generic/sharing/facebook/desc"),
				'url' : siteManager.copyManager.getCopy("generic/sharing/facebook/url"),
				'shortUrl' : ''
			};
		};
		p.defaultTwitterShare = function() {
			this._twitterShareObj = {
				'name' : siteManager.copyManager.getCopy("generic/sharing/twitter/title"),
				'descr' : siteManager.copyManager.getCopy("generic/sharing/twitter/desc"),
				'hashTags': siteManager.copyManager.getCopy("generic/sharing/twitter/hashTags"),
				'url' : siteManager.copyManager.getCopy("generic/sharing/twitter/url"),
				'shortUrl' : ''
			};
		};
		p.defaultGoogleShare = function() {
			this._googlePlusShareObj = {
				'url' : siteManager.copyManager.getCopy("generic/sharing/facebook/url"),
				'baseUrl' : 'https://plus.google.com/share?url='
			};
		};
		p.defaultPinterestShare = function() {
			this._pinterestShareObj = {
				'url' : siteManager.copyManager.getCopy("generic/sharing/pinterest/url"),
				'descr' : siteManager.copyManager.getCopy("generic/sharing/pinterest/desc"),
				'baseUrl' : 'http://pinterest.com/pin/create/button/?url=',
				'imageUrl' : 'http://flywell.ba.com/preview/socials/BAFlyWell.jpg'
			};
		};

		p.updateShareObject = function(aObjectName, aObjectParam, aObjectValue) {
			// console.log( "update Share oBject : ", aObjectName, aObjectName.toLowerCase(), aObjectName.toLowerCase() == "");
			switch(aObjectName.toLowerCase()) {
				case "facebook" :
					this._facebookShareObj[aObjectParam] = aObjectValue;
				break;
				case "twitter" :
					this._twitterShareObj[aObjectParam] = aObjectValue;
				break;
				case "google" :
					this._googlePlusShareObj[aObjectParam] = aObjectValue;
				break;
				case "pinterest" :
					this._pinterestShareObj[aObjectParam] = aObjectValue;
				break;
			}
		};

		p.createShortenUrl = function(aShareUrl, aCallback){

			var shortenRq;
			
			shortenRq = new XMLHttpRequest();
			shortenRq.onreadystatechange = function() {
				switch(shortenRq.readyState) {
					case 0: //Uninitialized
					case 1: //Set up
					case 2: //Sent
					case 3: //Partly done
						// DO NOTHING
						break;
					case 4: //Done
						if(shortenRq.status < 400) {	
							try {
								console.log("shortenRq.responseText : ", shortenRq.responseText);
								var responseObj = JSON.parse(shortenRq.responseText);					
								if (responseObj.status_txt == "OK") {
									var response = encodeURIComponent(responseObj.data.url);
									aCallback.call(this, response);
								} else {
									aCallback.call(this, aShareUrl);	
								}	
							} 
							catch(e)
							{
								console.error("ERROR : Problem with response from bit.ly ", e);
								aCallback.call(this, aShareUrl);
							}						
						}
						else 
						{
							console.error("ERROR: Could not bit.ly shorten url : " + aShareUrl);
						}
					break;
				}

			};
			

			try {

				var shortenURL = "";
				var bitlyLink = "http://api.bitly.com/v3/shorten";

				var sitePath = document.location.pathname;
				var sitePathComponents = sitePath.split("/");
				sitePath = sitePath.replace(sitePathComponents[sitePathComponents.length -1], "");

				shortenURL += bitlyLink;
				shortenURL += "?apiKey=" + SharingManager.BITLY_API_KEY;
				shortenURL += "&access_token=" + SharingManager.BITLY_ACCESS_TOKEN + "&longUrl=";
				shortenURL += encodeURIComponent(aShareUrl);

				// shortenURL += SharingManager.BITLY_LOGIN+"&apiKey=";
				// shortenURL += SharingManager.BITLY_API_KEY;

				// shortenURL += sitePath + "backend/proxy/https/api-ssl.bitly.com/v3/shorten";
				// shortenURL += "?access_token=" + SharingManager.BITLY_ACCESS_TOKEN;
				// shortenURL += "&longUrl=" + encodeURIComponent(aShareUrl);

				console.log("shorten URL : " + shortenURL);
				shortenRq.open("GET", shortenURL, true);
				shortenRq.send(null);
			} catch(e) {
				console.error("Error :: there was a problem shortening the URL with bit.ly : ", e);
				aCallback.call(this, aShareUrl);

			}
			
		};

		p.setFacebookObj = function(FBObj) {
			this._FB = FBObj;
		
		};

		p.postToFBWall = function(extra) {
			var sharingURL = this._facebookShareObj["url"].replace("http", this.httpRef);

			if (this._FB){
				if(extra == undefined) {
						this._FB.ui({
						method: "feed",
						link: sharingURL,
						name: this._facebookShareObj["name"],
	         		 	description: this._facebookShareObj["descr"],
	         		 	display: "popup"
					});
				} else {
					this._FB.ui({
						method: 'feed',
						name: this._facebookShareObj["name"],
						picture: extra,
						link: sharingURL,
						description: this._facebookShareObj["descr"],
						display: "popup"
					});
				}
				
			}
		};

		p.setupTweetButton = function(aTweetButton) {
			var tweetUrl = "";
			tweetUrl += SharingManager.TWITTER_BASE_URL;
			tweetUrl += this._twitterShareObj['url'] + "&hashtags=";
			tweetUrl += this._twitterShareObj['hashTags']+"&text=";
			tweetUrl += encodeURIComponent(this._twitterShareObj['descr'] );
			
			var aTag = aTweetButton.parentNode;
			if(aTag == undefined) return;

			aTag.setAttribute('href', tweetUrl);
			aTag.setAttribute('target', "_blank");
		};

		p.postGoogleShare = function() {
			console.log( "Google plus share : ", this._googlePlusShareObj['url'] );
			window.open(
				this._googlePlusShareObj['baseUrl']+this._googlePlusShareObj['url'],
				'popupwindow',
				'scrollbars=yes,width=600,height=400'
			).focus();

		};

		p.renderNativeGooglePlusBtn = function(element){

			gapi.plusone.go(element);

		};
		p.renderNativeGooglePlusFollowBtn = function(element){

			gapi.follow.go(element);

		};
		p.renderNativeTweetButton = function(){
			twttr.widgets.load();

		};
		p.renderNativeFbButton = function(element){

			FB.XFBML.parse(element);	
		};


	}

})();