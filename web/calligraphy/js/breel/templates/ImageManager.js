(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var BrowserDetector = breelNS.getNamespace("generic.utils").BrowserDetector;

	var namespace = breelNS.getNamespace("generic.templates");

	if(!namespace.ImageManager) {

		var ImageManager = function() {

			this._imagesFolder = "";

			this._currentPixelDensity = "1x";

			this.browserDetector = null;
		};

		namespace.ImageManager = ImageManager;
		var p = ImageManager.prototype;

		p.setup = function(aImagesFolder) {
			
			this._imagesFolder = aImagesFolder;

			this.browserDetector = new BrowserDetector();

			var pixelDensity = window.devicePixelRatio;
			if (pixelDensity) {
				switch(pixelDensity)
				{
					case 1:
						this._currentPixelDensity = "1x";
					break;
					case 2:
						this._currentPixelDensity = "2x";
					break;
					default:
						this._currentPixelDensity = "1x";
					break;
				}
			}

			console.log("ImageManager ** current device pixel density : ", this._currentPixelDensity);
		};

		p.getPixelDensityInt = function() {
			switch(this._currentPixelDensity)
			{
				case "1x": 
					return 1;
				break;
				case "2x":
					return 2;
				break;
				default:
					return 1;
				break;
			}
		};

		p.updateAllStyleSheetsForPixelDensity = function() {
			for (var i = 0; i < document.styleSheets.length; i++ ){
				this.updateImageSrcInCSSSheet(document.styleSheets[i]);
			}
		};

		p.updateImageSrcInCSSSheet = function(aStyleSheet) {
			var ruleList = aStyleSheet.cssRules || aStyleSheet.rules;
			if (ruleList){
				for (var i= 0; i < ruleList.length; i++)
				{
					var rule = ruleList[i];				
					
					if(rule.cssRules) {
						
						for (var j = 0; j< rule.cssRules.length; j++) {
							var newRule = rule.cssRules[j];
							if (newRule.style) {
								if (newRule.style.backgroundImage != "") {
									var newBackgroundImagePath = "";
									if (this._pathContainsSVG(newRule.style.backgroundImage, ".svg"))
										newBackgroundImagePath = newRule.style.backgroundImage.replace(/\/xx\//g, "/svg/");
									else
										newBackgroundImagePath = newRule.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/");
										newRule.style.backgroundImage = newBackgroundImagePath;
										// console.log("updated background image in newRule : ", newRule, " to ",  newBackgroundImagePath);
								}
							}
						}

					} else {
					
						if (rule.style) {
							try {
								if (rule.style.backgroundImage != "") {
								var newBackgroundImagePath = "";
								if (this._pathContainsSVG(rule.style.backgroundImage, ".svg"))
									newBackgroundImagePath = rule.style.backgroundImage.replace(/\/xx\//g, "/svg/");
								else
									newBackgroundImagePath = rule.style.backgroundImage.replace(/\/xx\//g, "/" + this._currentPixelDensity + "/");
								rule.style.backgroundImage = newBackgroundImagePath;
								// console.log("updated background image in rule : ", rule, " to ",  newBackgroundImagePath);
								}
							} catch(e)
							{
								console.error(e);
							
							}
							
						}

					}
						
				}
			}
			

		};

		p._pathContainsSVG = function(aPath) {			
			return aPath.indexOf(".svg") !== -1;
		};

		p.getImageSrc = function(aPath) {
			var svgsupport = true;

			if (aPath == "" || aPath == null)
			{
				console.warn("Warning : requested image src for blank path");
				return aPath;				
			}

			var pathPrefix = "";
			if (this._pathContainsSVG(aPath, ".svg")) {
				if(!this.browserDetector.supportsSVG()) {
					console.log("Browser does not support SVG");
					svgsupport = false;
				}
				pathPrefix = this._imagesFolder + "/svgs";
			} else {
				if(pathPrefix.indexOf("/singlequality/") == -1) {
					pathPrefix = this._imagesFolder + "/" + this._currentPixelDensity;
				}
			}

			if (aPath.indexOf(pathPrefix) == -1)
				aPath = pathPrefix + "/" + aPath;

			if(!svgsupport) {
				var svgParts = aPath.split('/');
				var fileName = svgParts[4].split('.');
				fileName = fileName[0];
				var aPath = svgParts[0]+"/"+svgParts[1]+"/"+svgParts[2]+"/svgFallback/"+fileName+'.png';
			}

			return aPath;
		};

		p.getImageElement = function(aPath, aLoadedCallback) {
			var path = this.getImageSrc(aPath);
			var newImage = new Image();
			newImage.onload = aLoadedCallback;
			newImage.src = path;
			return newImage;
		};
		
	}

})();