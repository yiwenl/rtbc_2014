/* MIN BROWSER CONFIG SECTION */

	var useModernizr = true;

	var minFullSiteIOS = 6;
	var minFullSiteAndroid = 4;
	var minFullSiteChrome = 26;
	var minFullSiteSafari = 5.1;
	var minFullSiteFirefox = 20;
	var minFullSiteIE = 9;
	var minFullSiteOpera = 999;

	var minUpgradeSiteChrome = 14;
	var minUpgradeSiteSafari = 5.9;
	var minUpgradeSiteFirefox = 14;

	var minMobileSiteIOS = 5.1;
	var minMobileSiteAndroid = 3.1;
	var minMobileSiteWindows = 99999999999;

	var shouldShowFullSite = false;
	var shouldShowUpgradeSite = false;
	var shouldShowMobileSite = false;

	var passedAndroidTest = false;
/* -------------------------- */

/* 
	ALL VARIABLES MUST BE DEFINED WITHIN THIS FILE, 
	THE BREEL FRAMEWORK FOR BROWSER DETECTION SHOULD BE STAND ALONE
*/

	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var deviceName = null;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var deviceName = null;
	var mobileString = navigator.userAgent||navigator.vendor||window.opera;
	var windowOrientation = window.orientation;
	// LVNOTE : this needs to be reset after testing is done.
	// var windowOrientation = "test";
	// Set this to force the orientation.
	var deviceOrientation = undefined;


	var androidVer, iosVer, isMobile, isTablet;
	var browserDetector = new breelNS.generic.utils.BrowserDetector();

/* -------------------------- */

var breel_isTouch = function(){

	return Modernizr.touch;	
};

var breel_runModernizrCheck = function() {
	var check = true;

	check = Modernizr.audio && check;
	check = Modernizr.canvas && check;
	check = Modernizr.video && check;
	
	return check;
};
var breel_fallbackCheck = function() {

	var browserDetails = browserDetector.getBrowserNameAndNumber(nVer, nAgt, browserName, fullVersion, majorVersion, deviceName, mobileString, windowOrientation, deviceOrientation, window.innerWidth, window.innerHeight);
	
	browserName = browserDetails["name"];
	fullVersion = browserDetails["fullVersion"];
	majorVersion = browserDetails["majorVersion"];
	androidVer = browserDetails["androidVersion"];
	iosVer = browserDetails["iosVersion"];
	isMobile = browserDetails["isMobile"];
	isTablet = browserDetails["isTablet"];
	deviceOrientation = browserDetails["deviceOrientation"];

	if(browserName != "Microsoft Internet Explorer") {
		// document.write('<script type="text/javascript" src="js/libs/soundmanager2-jsmin.js"></scr' + 'ipt>'); 
	} else {
	}	

	// console.log( "Browser name : ", browserName );
	// console.log( "Browser name : ", browserName );
	// console.log( "Browser name : ", browserName );
	// console.log( "Browser name : ", browserName );
	// console.log( "Browser name : ", browserName );

	switch(browserName) {
		case "WindowsPhone" :
			shouldShowFullSite = false;
			shouldShowUpgradeSite = false;
		break;
		case "Microsoft Internet Explorer" :
			if(majorVersion >= minFullSiteIE) shouldShowFullSite = true;
		break;
		case "Chrome" :
			if(majorVersion >= minFullSiteChrome) {
				shouldShowFullSite = true;
			} else if(majorVersion < minFullSiteChrome && majorVersion >=  minUpgradeSiteChrome) {
				shouldShowUpgradeSite = true;
			}
		break;
		case "Safari" :
			var tmp = fullVersion.split(".");
			tmp.length = 2;
			majorVersion = Number(tmp.join("."));

			if(majorVersion >= minFullSiteSafari) shouldShowFullSite = true;
			else if(majorVersion < minFullSiteSafari && majorVersion >=  minUpgradeSiteSafari) {
				shouldShowUpgradeSite = true;
			}
		break;
		case "Firefox" :
			if(majorVersion >= minFullSiteFirefox) shouldShowFullSite = true;
			else if(majorVersion < minFullSiteFirefox && majorVersion >=  minUpgradeSiteFirefox) {
				shouldShowUpgradeSite = true;
			}
		break;
		case "Android":
			if(isTablet) {
				// tablet browser check
				if(parseFloat(androidVer) >= parseFloat(minFullSiteAndroid) ) {
					shouldShowFullSite = true;
					passedAndroidTest = true;
				}
			} else if(isMobile) {
				// mobile browser check
				if(parseFloat(androidVer) >= parseFloat(minMobileSiteAndroid) ) {
					shouldShowFullSite = true;
					passedAndroidTest = true;
				}
			}
		break;
		case "iOS":
			if(isTablet) {
				// tablet browser check
				if(iosVer >= minFullSiteIOS) shouldShowFullSite = true;
			} else if(isMobile) {
				// mobile browser check
				if(iosVer >= minMobileSiteIOS) shouldShowFullSite = true;
			}
		break;
		case "Opera":
			// if(majorVersion >= minFullSiteOpera) shouldShowFullSite = true;
		break;
		case "Netscape" :
			var isAtLeastIE11 = !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/));
			if(isAtLeastIE11) shouldShowFullSite = true;
		break;

		default:
			shouldShowFullSite = false;
		break;
	}

	// shouldShowMobileSite = true;
	if(breel_isTouch() && !isTablet){
		shouldShowMobileSite = false;
		shouldShowFullSite = true;
	}

	if(browserName == "Android" && !passedAndroidTest) {
		shouldShowMobileSite = false;
		shouldShowFullSite = false;
	}
	
	if(shouldShowFullSite) {
		// We have passed the min browser & device specs
		// console.log("show full site");
		isFallback = false;
	} else if(shouldShowUpgradeSite) {
		// We have passed the min browser & device specs for the upgrade site
		// console.log("show full site with upgrade notes");
		try{
			if(document.body !== undefined || document.body !== null) document.body.className += " upgrade";
		} catch(e){
			// console.log( "can't set class to body, body is undefined" );
		}
		isFallback = false;
	} else if(shouldShowMobileSite) {
		// We have passed the min browser & device specs for the mobile site
		// console.log("show mobile site");
		// if(window.location.href.indexOf("mobile") == -1)
			// console.log( 'show mobile show mobile show mobile show mobile show mobile ' );
			// window.location.href = "mobile/";
		isFallback = false;
	} else {
		// We have failed the min browser & device specs
		// console.log("show fallback site");
		// if(window.location.href.indexOf("fallback") == -1)
			// window.location.href = "fallback/";
		// console.log( "show fallback show fallback show fallback show fallback show fallback show fallback " );
		
		try{
			if(document.body !== undefined || document.body !== null) document.body.style.overflow = "hidden";
		} catch(e){
			// console.log( "can't set class to body, body is undefined" );
		}

		breelNS.fallback = true;
		isFallback = true;
	}
}


breel_fallbackCheck();
