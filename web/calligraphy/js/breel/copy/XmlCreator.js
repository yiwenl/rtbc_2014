(function() {

	var namespace = breelNS.getNamespace("generic.copy");

	if(!namespace.XmlCreator) {

		var XmlCreator = function XmlCreator() {

		};
		
		namespace.XmlCreator = XmlCreator;
		var p = XmlCreator.prototype;

		p.createXmlLoader = function() {
			// console.log("breelNS.copy.XmlCreator.createXmlLoader");
				
			var returnLoader;

			if(window.XMLHttpRequest) {
				returnLoader = new XMLHttpRequest();
			} else {
				returnLoader = new ActiveXObject("Microsoft.XMLHTTP");
			}
		
			return returnLoader;
		};

		p.loadXmlFile = function(aPath) {
			// console.log("breelNS.copy.XmlCreator.loadXmlFile :: aPath : ", aPath);
				
			var xmlLoader = this.createXmlLoader();
			var returnDocument = null;
		
			try {
				xmlLoader.open("GET", aPath, false);
			
				xmlLoader.send();
				returnDocument = this.createXmlFromString(xmlLoader.responseText);
				//console.log("returnDocument : ", returnDocument);
			}
			catch(theError) {
				// console.log("loadXmlFile :: theError : ", theError);
				return null;
			}
		
			return returnDocument

		};

		p.loadXmlFileWithPost = function() {
			// console.log("breelNS.copy.XmlCreator.loadXmlFileWithPost");

			var xmlLoader = this.createXmlLoader();
		
			var returnDocument = null;
		
			try {
				xmlLoader.open("POST", aPath, false);
				xmlLoader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xmlLoader.setRequestHeader("Content-length", aParameters.length);
				xmlLoader.setRequestHeader("Connection", "close");
				xmlLoader.send(aParameters);
			
				returnDocument = this.createXmlFromString(xmlLoader.responseText);
			}
			catch(theError) {
				// console.log("the error : ", theError);
			
				return null;
			}
		
			return returnDocument;
		};

		p.createEmptyXml = function() {
			// console.log("breelNS.copy.XmlCreator.createEmptyXml");

			var returnDocument;
		
			if(window.DOMParser) {
				var parser = new DOMParser();
				returnDocument = parser.parseFromString("<temp />", "text/xml");
				returnDocument.removeChild(returnDocument.firstChild);
			}
			else {
				returnDocument = new ActiveXObject("Microsoft.XMLDOM");
				returnDocument.async = "false";
				returnDocument.loadXML("<temp />");
				returnDocument.removeChild(returnDocument.firstChild);
			}
			return returnDocument;

		};

		p.createXmlFromString = function(aText) {
			// console.log("breelNS.copy.XmlCreator.createXmlFromString :: aText : ", aText);

			var returnDocument;
		
			if(window.DOMParser) {
				var parser = new DOMParser();
				returnDocument = parser.parseFromString(aText, "text/xml");
			}
			else {
				returnDocument = new ActiveXObject("Microsoft.XMLDOM");
				returnDocument.async = "false";
				returnDocument.loadXML(aText);
			}
		
			return returnDocument;

		};

		p.createStringFromXml = function(aNode) {
			// console.log("breelNS.copy.XmlCreator.createStringFromXml :: aNode : ", aNode);

			if(window.XMLSerializer) {
				var serializer = new XMLSerializer();
				return serializer.serializeToString(aNode);
			}
			else {
				aNode.xml;
			}
		};

	}

})();