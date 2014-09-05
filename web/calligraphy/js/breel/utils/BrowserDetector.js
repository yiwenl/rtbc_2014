(function() {

	var namespace = breelNS.getNamespace("generic.utils");
	
	if (!namespace.BrowserDetector)
	{
		var BrowserDetector = function() {
		
			this._element = null;	

			this._isMobileDevice = null;
			this._isTabletDevice = null;

			this._supportedTransformProperty = null;

			this._browserSupportsWebAudio = null;
			this._browserSupportsHtml5Audio = null;
			this._browserSupportsFlash = null;
			
			this._canScrollWindow = null;

			// console.log( "Is IPAD : ", this.getIsIPad(), ", ", navigator.userAgent );
		
		};

		namespace.BrowserDetector = BrowserDetector;

		var p = BrowserDetector.prototype;

		p.getBrowserName = function(aUserAgent) {

			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			var browserName = "";

			if(aUserAgent.match(/(Chrome)/)) {
				browserName = "chrome";
			} else if (aUserAgent.match(/(Safari)/)) {				
				browserName = "safari";
			} else if(aUserAgent.match(/(Firefox)/)) {
				browserName = "firefox";
			} else if(aUserAgent.match(/(MSIE)/)) {
				browserName = "ie";
			} else if(aUserAgent.match(/(Opera)/)) {
				browserName = "opera";
			}

			return browserName;
		};

		p.getIsIPhone = function(aUserAgent) {
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			return aUserAgent.match(/(iPhone)/) ? true : false;
		};

		p.getIsIPad = function(aUserAgent) {
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			return aUserAgent.match(/(iPad)/) ? true : false;
		};

		p.getIsIPad2 = function() {
			return window.devicePixelRatio == 1;
		}
		
		p.getIsIOS = function(aUserAgent) {
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			return aUserAgent.match(/(Mobile\/)/) ? true : false;		
		}

		p.getIsAndroid = function(aUserAgent) {
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			return aUserAgent.match(/(Android)/) ? true : false;	
		};

		p.getIsBlackBerry = function(aUserAgent) {
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			return aUserAgent.match(/(BlackBerry)/) ? true : false;			
		}

		p.getAndroidVersion = function(aUserAgent){
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;

			if( aUserAgent.indexOf("Android") >= 0 )
			{
			  var androidversion = parseFloat(aUserAgent.slice(aUserAgent.indexOf("Android")+8)); 
			  return androidversion;
			} else null;
		}

		p.getIsTabletScreenSize = function(aUserAgent, windowOrientation, windowWidth, windowHeight) {
			aUserAgent = (aUserAgent === undefined) ? navigator.userAgent : aUserAgent;
			windowOrientation = (windowOrientation === undefined) ? window.orientation : windowOrientation;
			windowWidth = (windowWidth === undefined) ? window.innerWidth : windowWidth;
			windowHeight = (windowHeight === undefined) ? window.innerHeight : windowHeight;

			var currentOrientation = 0;
			if (typeof(windowOrientation) != "undefined")
			{
				currentOrientation = windowOrientation;
			}

			if (aUserAgent.indexOf("iPhone") != -1) return false;
			if (aUserAgent.indexOf("iPad") != -1) return true;

			var docWidth = windowWidth;
			var docHeight = windowHeight;
			var isLanscapeLayout = docWidth > docHeight;

			// we assume 0 or 180 is the 'natural' way to hold this device
			if ((currentOrientation == 0 || currentOrientation == 180) && isLanscapeLayout) return true;
			else return false;
		};

		p.getIsMobileDevice = function(mobileString) {

			if (this._isMobileDevice == null){
				var isMobileDevice = false;
				
				mobileString = (mobileString === undefined) ? navigator.userAgent||navigator.vendor||window.opera : mobileString;
				var a = mobileString;
				if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
					// alert("is mobile");
					isMobileDevice = true;
				}else{
					// alert("is not mobile");
				}

				// DEBUG
				isMobileDevice = (document.location.href.indexOf("forceMobile=true") != -1) || isMobileDevice;

				this._isMobileDevice = isMobileDevice;
			}	
			

			return this._isMobileDevice;
		};

		p.getIsTabletDevice = function(aDeviceName, aMobileDevice, windowOrientation) {

			if(this._isTabletDevice === null) {
				if(aMobileDevice) {
					this._isTabletDevice = false;
					return false;
				}

				if(aDeviceName == "Android" || aDeviceName == "iPad") {
					if (typeof(windowOrientation) != "undefined") {
						this._isTabletDevice = true;
					} else {
						this._isTabletDevice = false;
					}
				} else {
					this._isTabletDevice = false;
				}
			}

			return this._isTabletDevice;
		};

		p.checkDeviceOrientation = function(windowOrientation, windowWidth, windowHeight) {

			windowOrientation = (windowOrientation === undefined) ? window.orientation : windowOrientation;
			windowWidth = (windowWidth === undefined) ? window.innerWidth : windowWidth;
			windowHeight = (windowHeight === undefined) ? window.innerHeight : windowHeight;

			var currentOrientation = 0;
			if (typeof(windowOrientation) != "undefined")
			{
				currentOrientation = windowOrientation;
			}

			var docWidth = windowWidth;
			var docHeight = windowHeight;
			var isLanscapeLayout = docWidth > docHeight;

			// we assume 0 or 180 is the 'natural' way to hold this device
			// if ((currentOrientation == 0 || currentOrientation == 180) && isLanscapeLayout) {
			// 	alert("orientation is landscape");
			// 	return "landscape";
			// } else {
			// 	alert("orientation is portrait");
			// 	return "portrait";
			// }
			
			// LVNOTE : Using the current orientation was giving the wrong result for iPads.
			if (isLanscapeLayout) {
				// alert("orientation is landscape");
				return "landscape";
			} else {
				// alert("orientation is portrait");
				return "portrait";
			}
		};

		p.getButtonClickEventName = function(aIsButton) {
			return (this.getIsMobileDevice() || this.getIsIPad() ) ? ((aIsButton) ? "touchstart" : "touchstart") : "click";
		};

		p.getMouseDownEventName = function() {
			return (this.getIsMobileDevice() || this.getIsIPad() || this.getIsAndroid() ) ? "touchstart" : "mousedown";
		};
		p.getMouseMoveEventName = function() {
			return (this.getIsMobileDevice() || this.getIsIPad() || this.getIsAndroid() ) ? "touchmove" : "mousemove";
		};
		p.getMouseUpEventName = function() {
			return (this.getIsMobileDevice() || this.getIsIPad() || this.getIsAndroid() ) ? "touchend" : "mouseup";
		};

		p.supportsCSSTransitions = function() {

			if (this._supportsCSSTransitions == null){

				var supportedTransitionProperty = this._getSupportedProperty(['transition', 'MozTransition', 'WebkitTransition', 'msTransition', 'OTransition']);
				this._supportsCSSTransitions = (supportedTransitionProperty == null) ? false : true;
			}
			return this._supportsCSSTransitions;
		};

		p.getSupportedTransformProperty = function() {

			if (this._supportedTransformProperty == null)
			{
				var supportedTransformProperty = this._getSupportedProperty(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
				this._supportedTransformProperty = supportedTransformProperty;
			}
			return this._supportedTransformProperty;
		};

		p._getSupportedProperty = function(proparray){
		    var root=document.documentElement //reference root element of document
		    for (var i=0; i<proparray.length; i++){ //loop through possible properties
		        if (typeof root.style[proparray[i]]=="string"){ //if the property value is a string (versus undefined)
		            return proparray[i] //return that string
		        }
	   		}
	   		return null;
   		};

   		p.supportsSVG = function() {
   			var passed = true;
   			var checkOne = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
   			if(!checkOne) {
   				passed = false;
   				var checkTwo = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
   				if(checkTwo)
   					passed = true;
   			}
    		return passed;
  		};

  		p.getCanScrollWindow = function() {

  			if (this._canScrollWindow == null){

  				var browserDetails = this.getBrowserNameAndNumber();
  				if (parseFloat(browserDetails.iosVersion) >= 7) this._canScrollWindow = false;  				
  				else if (this.getIsIPad()) this._canScrollWindow = false;
  				else this._canScrollWindow = true;

  			} 
  			return this._canScrollWindow;
  		}

  		p.getBrowserLanguage = function() {
  			var browserLang;
  			var lang;

  			if(navigator.language === undefined || navigator.language === null) {
				browserLang = navigator.systemLanguage;
			} else {
				browserLang = navigator.language;
			}

			if(browserLang.indexOf('en') >= 0) {
				lang = 'en';
			}else if(browserLang.indexOf('de') >= 0) {
				lang = 'de';
			}else if(browserLang.indexOf('es') >= 0) {
				lang = 'es';
			} else {
				lang = 'en';
			}


			var url = window.location.href;
			// params = url.split("?")[1];
			// var lngFromURL;
			var id;

			if(url.indexOf("lang" ) > -1) {
				id = url.split("lang=")[1].split("&")[0].toLowerCase();
				// console.log( "LANGLANG : " , id );

				var languags = ["en", "es", "de"];
				if(languags.indexOf(id) != -1) lang = id;
			}

			

			return lang;
  		};

  		p.getSupportsDateInput = function() {

  			if (this.getIsAndroid()) return false;  			

  			var input = document.createElement("input");
  			input.setAttribute("type", "date");
  			return input.type == "date";
  		}


  		p.getBrowserNameAndNumber = function(nVer, nAgt, browserName, fullVersion, majorVersion, deviceName, mobileString, windowOrientation, deviceOrientation, windowWidth, windowHeight) {
  			nVer = (nVer === undefined) ? navigator.appVersion : nVer;
  			nAgt = (nAgt === undefined) ? navigator.userAgent : nAgt;
  			browserName = (browserName === undefined) ? navigator.appName : browserName;
  			fullVersion = (fullVersion === undefined) ? ''+parseFloat(navigator.appVersion) : fullVersion;
  			majorVersion = (majorVersion === undefined) ? parseInt(navigator.appVersion,10) : majorVersion;
  			deviceName = (deviceName === undefined || deviceName === null) ? null : deviceName;
  			mobileString = (mobileString === undefined) ? navigator.userAgent||navigator.vendor||window.opera : mobileString;
  			windowOrientation = (windowOrientation === undefined) ? window.orientation : windowOrientation;

  			var browserDetails = {
  				"name" : null,
  				"fullVersion" : null,
  				"majorVersion" : null,
  				"androidVersion" : null,
  				"iosVersion" : null,
  				"isMobile" : false,
  				"isTablet" : false
  			};

			var nameOffset,verOffset,ix, androidVer, iosVer, isMobile, isTablet;


			if(nAgt.match(/(iPad)/) ? true : false) {
				browserName = "iOS";
				deviceName = "iPad";
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				var iosVerFull = parseInt(v[1]);
				var iosVerMin = parseInt(v[2]);
				iosVer = iosVerFull+"."+iosVerMin;
				iosVer = parseInt(iosVer);

			} else if(nAgt.match(/(iPhone)/) ? true : false) {
				browserName = "iOS";
				deviceName = "iPhone";
				var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
				var iosVerFull = parseInt(v[1]);
				var iosVerMin = parseInt(v[2]);
				iosVer = iosVerFull+"."+iosVerMin;
				iosVer = parseFloat(iosVer);
			} else if((verOffset=nAgt.indexOf("Windows Phone")) !=-1) {
				browserName = "WindowsPhone";
				deviceName = "WindowsPhone";
			} else if ((verOffset=nAgt.indexOf("Android")) !=-1) {
				browserName = "Android";
				deviceName = "Android";
				androidVer = parseFloat(nAgt.slice(nAgt.indexOf("Android")+8));

			} else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
				
				// In Opera, the true version is after "Opera" or after "Version"
				browserName = "Opera";
				fullVersion = nAgt.substring(verOffset+6);
				if ((verOffset=nAgt.indexOf("Version"))!=-1) 
				   fullVersion = nAgt.substring(verOffset+8);

			} else if ((verOffset=nAgt.indexOf("HTC_Flyer"))!=-1) {

				browserName = "Android";
				deviceName = "Android";
				androidVer = 3;
			} else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {

				// In MSIE, the true version is after "MSIE" in userAgent
				browserName = "Microsoft Internet Explorer";
				fullVersion = nAgt.substring(verOffset+5);

			} else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {

				// In Chrome, the true version is after "Chrome" 
				browserName = "Chrome";
				fullVersion = nAgt.substring(verOffset+7);

			} else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {

				// In Safari, the true version is after "Safari" or after "Version" 
				browserName = "Safari";
				fullVersion = nAgt.substring(verOffset+7);
				if ((verOffset=nAgt.indexOf("Version"))!=-1) 
					fullVersion = nAgt.substring(verOffset+8);

			} else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {

				// In Firefox, the true version is after "Firefox"
				browserName = "Firefox";
				fullVersion = nAgt.substring(verOffset+8);

			} else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {

				// In most other browsers, "name/version" is at the end of userAgent 
				browserName = nAgt.substring(nameOffset,verOffset);
				fullVersion = nAgt.substring(verOffset+1);
				if (browserName.toLowerCase()==browserName.toUpperCase()) {
					browserName = navigator.appName;
				}
			}

			// trim the fullVersion string at semicolon/space if present
			if ((ix=fullVersion.indexOf(";"))!=-1)
				fullVersion=fullVersion.substring(0,ix);
			if ((ix=fullVersion.indexOf(" "))!=-1)
				fullVersion=fullVersion.substring(0,ix);
			
			majorVersion = parseInt(''+fullVersion,10);
			if (isNaN(majorVersion)) {
				fullVersion  = ''+parseFloat(navigator.appVersion); 
				majorVersion = parseInt(navigator.appVersion,10);
			}

			isMobile = this.getIsMobileDevice(mobileString);
			isTablet = this.getIsTabletDevice(deviceName, isMobile, windowOrientation);
			deviceOrientation = (deviceOrientation === undefined) ? this.checkDeviceOrientation() : deviceOrientation;

			try {
				document.body.className += " " + browserName.toLowerCase().split(" ").join("-");	
			} catch(e) {
				// console.log( "Error on adding the browser class : " + browserName );
			}

			browserDetails["name"] = browserName;
			browserDetails["fullVersion"] = fullVersion;
			browserDetails["majorVersion"] = majorVersion;
			browserDetails["androidVersion"] = androidVer;
			browserDetails["iosVersion"] = iosVer;
			browserDetails["isMobile"] = isMobile;
			browserDetails["isTablet"] = isTablet;
			browserDetails["deviceOrientation"] = deviceOrientation;

			return browserDetails;
  		};

  		p.getBrowserSupportsWebAudio = function() {

  			if (this._browserSupportsWebAudio !== null) return this._browserSupportsWebAudio;
  			else {
  				this._browserSupportsWebAudio = false;
  				var context;
	  			try {
	  				if (typeof(AudioContext) !== "undefined") {
	  					this._browserSupportsWebAudio = true;
	  				} else if (typeof(webkitAudioContext) !== "undefined"){
	  					this._browserSupportsWebAudio = true;
	  				}
	  			} catch(e) {
	  				// do nothing
	  			}
	  			return this._browserSupportsWebAudio;
  			}
  		};

  		p.getBrowserSupportsHtml5Audio = function() {

  			if (this._browserSupportsHtml5Audio !== null) return this._browserSupportsHtml5Audio;
  			else {
  				this._browserSupportsHtml5Audio = false;  				
	  			try {
	  				if (typeof(Audio) !== "undefined") {
	  					this._browserSupportsHtml5Audio = true;
	  				} 
	  			} catch(e) {
	  				// do nothing
	  			}
	  			return this._browserSupportsHtml5Audio;
  			}
  		};

  		p.getBrowserSupportsFlash = function() {

  			if (this._browserSupportsFlash !== null) return this._browserSupportsFlash;
  			else {
  				this._browserSupportsFlash = false;
  				try {
  					var fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
  					if (fo) this._browserSupportsFlash = true;
  				} catch(e) {
  					if (navigator.mimeTypes)
  						if (navigator.mimeTypes['application/x-shockwave-flash'] != undefined) 
  							this._browserSupportsFlash = true;
  				}
  				return this._browserSupportsFlash;
  			}

  		};


  		p.getBrowserSupportsAudioExtension = function(aAudioFileExtension) {

  			aAudioFileExtension = aAudioFileExtension.toLowerCase();

  			var supportsJSAudio = this.getBrowserSupportsWebAudio() || this.getBrowserSupportsHtml5Audio();
  			if (supportsJSAudio) {
  				try {
  					var audio = new Audio();
	  				switch(aAudioFileExtension) {

	  					case "wav":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/wav') != "");
	  					break;

	  					case "ogg":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/ogg') != "");
	  					break;

	  					case "oga":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/ogg') != "");
	  					break;

	  					case "mp3":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/mpeg') != "");
	  					break;	

	  					case "mp4":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/mp4') != "");
	  					break;

	  					case "aac":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/mp4') != "");
	  					break;

	  					case "m4a":
	  						return (!!audio.canPlayType && audio.canPlayType('audio/mp4') != "");
	  					break;

	  				}

	  				audio = null;
  				} catch(e) {
  					return false;
  				}  				

  			} else if (this.getBrowserSupportsFlash()) {
  				if (aAudioFileExtension == "wav" || aAudioFileExtension == "mp3") return true;
  			}

  		};

  		p.getViewportHeight = function() {

  			var baseHeight = document.documentElement.clientHeight;

  			var browserDetails = this.getBrowserNameAndNumber();
  			if (browserDetails.name == "iOS"){
  				if (browserDetails.isMobile && !browserDetails.isTablet){
  					baseHeight += 60;
  				}  					
  				else {

  				}
  			}
  			


  			return baseHeight;
  		};

  		BrowserDetector.createSingleton = function() {
 
  			var projectNamespace = breelNS.getNamespace(breelNS.projectName);
 
			if (!projectNamespace.singletons) projectNamespace.singletons = {};
			if (!projectNamespace.singletons.browserDetector)
			{
				projectNamespace.singletons.browserDetector = new BrowserDetector();
			}	
			return projectNamespace.singletons.browserDetector;	
		};
	}

})();