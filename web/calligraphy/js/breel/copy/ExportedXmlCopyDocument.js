(function() {

	var namespace = breelNS.getNamespace("generic.copy");

	var XmlChildRetreiver = breelNS.getNamespace("generic.copy").XmlChildRetreiver;

	if(!namespace.ExportedXmlCopyDocument) {

		var ExportedXmlCopyDocument = function ExportedXmlCopyDocument() {

		};

		namespace.ExportedXmlCopyDocument = ExportedXmlCopyDocument;
		var p = ExportedXmlCopyDocument.prototype;

		p.init = function() {
			// console.log("breelNS.copy.ExportedXmlCopyDocument.init");
			this._xml = null;

			this.xmlChildRetreiver = new XmlChildRetreiver();
	
			return this;
		};

		p.getCopy = function(aPath) {
			// console.log("breelNS.copy.ExportedXmlCopyDocument.getCopy :: aPath : ", aPath);
			
			var currentNode = this._xml;
			var currentArray = aPath.split("/");
			var currentArrayLength = currentArray.length;
	
			for(var i = 0; i < currentArrayLength-1; i++) {
				currentNode = this.xmlChildRetreiver.getChildByAttribute(currentNode, "name", currentArray[i]);
			}
	
			var lastId = currentArray[currentArrayLength-1];
			if(lastId == "text" && this.xmlChildRetreiver.hasSimpleContent(currentNode)) {
				return this.xmlChildRetreiver.getNodeValue(currentNode);
			}
	
			currentNode = this.xmlChildRetreiver.getChildByAttribute(currentNode, "name", lastId);
			if(currentNode != null) {
				return this.xmlChildRetreiver.getNodeValue(currentNode);
			}
			return null;
		};

		p.hasCopy = function() {
			// console.log("breelNS.copy.ExportedXmlCopyDocument.hasCopy");
			
			var currentNode = this._xml;
		
			var currentArray = aPath.split("/");
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength-1; i++) {
				currentNode = this.xmlChildRetreiver.getChildByAttribute(currentNode, "name", currentArray[i]);
			}
	
			var lastId = currentArray[currentArrayLength-1];
			if(lastId == "text" && this.xmlChildRetreiver.hasSimpleContent(currentNode)) {
				return true;
			}
	
			currentNode = this.xmlChildRetreiver.getChildByAttribute(currentNode, "name", lastId);
			return (currentNode != null);

		};

		p.setXml = function(aXml) {
			// console.log("breelNS.copy.ExportedXmlCopyDocument.setXml :: aXml : ", aXml);
			
			this._xml = aXml;
		
			return this;	
		};

		p.create = function(aXml) {
			// console.log("breelNS.copy.ExportedXmlCopyDocument.create :: aXml : ", aXml);

			var newDocument = (new breelNS.generic.copy.ExportedXmlCopyDocument()).init();
			newDocument.setXml(aXml);
			return newDocument;
		};
	}
})();