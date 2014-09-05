(function() {

	var TextConverterChain = breelNS.getNamespace("generic.copy").TextConverterChain;

	var namespace = breelNS.getNamespace("generic.copy");
	var siteManager;

	if (!namespace.CopyManager) {

		var CopyManager = function CopyManager() {
			this.returnErrorStringOnNull = true;
			this._copyDocument = null;
			this._defaultTextConverterChain = TextConverterChain.create();
		};

		namespace.CopyManager = CopyManager;
		var p = CopyManager.prototype;

		p.setCopyDocument =function(aDocument) {
			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			this._copyDocument = aDocument;
		};

		p.getDefaultTextConverterChian = function(aPath, aUseDefaultTextConversion) {
			return this._defaultTextConverterChain;
		};

		p.getCopy = function(aPath, aUseDefaultTextConversion) {

			if(aUseDefaultTextConversion == null) {
				aUseDefaultTextConversion = true;
			}
			var returnString = this._copyDocument.getCopy(aPath);
			if(returnString == null) {
				if(this.returnErrorStringOnNull) {
					return "Text not found (" + aPath + ")";
				}
				return null;
			}

			if(aUseDefaultTextConversion) {
				returnString = this._defaultTextConverterChain.convertText(returnString);
			}

			return returnString;
		};

		p.hasCopy = function(aPath) {
			
			return this._copyDocument.hasCopy(aPath);
		};

	}

})();