(function() {

	var namespace = breelNS.getNamespace("generic.copy");

	if(!namespace.XmlModifier) {

		var XmlModifier = function XmlModifier() {

		};

		namespace.XmlModifier = XmlModifier;
		var p = XmlModifier.prototype;

		p.getOwnerDocument = function(aNode) {
			return((aNode.nodeType == breelNS.generic.copy.XmlNodeTypes.DOCUMENT_NODE) ? aNode : aNode.ownerDocument);
		};

		p.createChild = function(aParentNode, aName) {
			var newNode = this.getOwnerDocument(aParentNode).createElement(aName);
			aParentNode.appendChild(newNode);
			return newNode;
		};

		p.createAttribute = function(aNode, aName, aValue) {
			var newAttribute = this.getOwnerDocument(aNode).createAttribute(aName);
			newAttribute.nodeValue = aValue;
			aNode.setAttribute(newAttribute);
			return aNode;
		};

		p.createText = function(aParentNode, aText, aUseCdata) {
			var newNode;
			if(aUseCdata) {
				newNode = this.getOwnerDocument(aParentNode).createCDATASection(aText);
			} else {
				newNode = this.getOwnerDocument(aParentNode).createTextNode(aText);
			}
			aParentNode.appendChild(newNode);
			return aParentNode;
		};
	}
})();