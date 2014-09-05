(function() {

	var namespace = breelNS.getNamespace("generic.htmldom");

	if(!namespace.DomElementCreator) {

		var DomElementCreator = function DomElementCreator() {

		};

		namespace.DomElementCreator = DomElementCreator;

		DomElementCreator.createChild = function createChild(aParentNode, aName, aId, aClassName) {
			var newNode = aParentNode.ownerDocument.createElement(aName);
			if(aId !== undefined) newNode.id = aId;
			if(aClassName !== undefined) newNode.className = aClassName;
			
			aParentNode.appendChild(newNode);
			return newNode;
		};

		DomElementCreator.createEl = function(aName, aId) {
			var newElement = document.createElement(aName);
			if(aId !== undefined) newElement.id = aId;
			return newElement;
		};

		DomElementCreator.createAttribute = function(aNode, aName, aValue) {
			var newAttribute = aNode.ownerDocument.createAttribute(aName);
			newAttribute.nodeValue = aValue;
			aNode.setAttributeNode(newAttribute);
			return aNode;
		};
		
		DomElementCreator.createText = function(aParentNode, aText) {
			var newNode = aParentNode.ownerDocument.createTextNode(aText);
			aParentNode.appendChild(newNode);
			return newNode;
		};
		
		DomElementCreator.createSvg = function(aDocument) {
			var newElement = aDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
			var defsElement = aDocument.createElementNS("http://www.w3.org/2000/svg", "defs");
			newElement.appendChild(defsElement);
			
			return newElement;
		};
		
		DomElementCreator.createSvgElement = function(aParentNode, aTagName) {
			
			var newElement = aParentNode.ownerDocument.createElementNS("http://www.w3.org/2000/svg", aTagName);
			
			aParentNode.appendChild(newElement);
			
			return newElement;
		};
		
		DomElementCreator.createSvgAttribute = function(aNode, aName, aValue) {
			var newAttribute = this.ownerDocument.createAttributeNS("http://www.w3.org/2000/svg", aName);
			newAttribute.nodeValue = aValue;
			aNode.setAttributeNode(newAttribute);
			return aNode;
		};
		
	}

})();