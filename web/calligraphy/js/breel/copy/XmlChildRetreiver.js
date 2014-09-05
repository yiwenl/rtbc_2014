(function() {

	var namespace = breelNS.getNamespace("generic.copy");

	if (!namespace.XmlChildRetreiver)
	{
		var XmlChildRetreiver = function XmlChildRetreiver() {
		
		};		

		namespace.XmlChildRetreiver = XmlChildRetreiver;

		var p = XmlChildRetreiver.prototype;

		p.getFirstChild = function(aXml) {
			//console.log("XmlChildRetreiver.getFirstChild :: aXml : ", aXml);

			if(aXml == null) {
				throw new Error("getFirstChild :: no XML found");
				return null;
			}
	
			var currentArray = aXml.childNodes;
			//console.log("currentArray : ", currentArray);
			var currentArrayLength = currentArray.length;

			for(var i = 0; i < currentArrayLength; i++) {
				var currentChild = currentArray[i];
				if(currentChild.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE) {
					return currentChild;
				}
			}

		};

		p.getChild = function(aXml, aChildName) {
			//console.log("XmlChildRetreiver.getChild :: aXml, aChildName : ", aXml, aChildName);
			
			if(aXml == null) {
				throw new Error("getChild :: no XML found");
				return null;
			}
	
			var returnArray = new Array();
			var currentArray = aXml.childNodes;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentChild = currentArray[i];
				if(currentChild.nodeName == aChildName) {
					returnArray.push(currentChild);
				}
			}
	
			if(returnArray.length == 0) {
				throw new Error("getChild ::: no results found in XML");
				return null;
			}
	
			return returnArray[0];

		};

		p.getChilds = function(aXml, aChildName) {
			//console.log("XmlChildRetreiver.getChilds :: aXml, aChildName : ", aXml, aChildName);

			aChildName = "*";
	
			var returnArray = new Array();
	
			if(aXml == null) {
				throw new Error(" getChilds :: no XML found");
				return returnArray;
			}
			
			var currentArray = aXml.childNodes;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentChild = currentArray[i];
		
				if((currentChild.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE) && ((aChildName == "*") || (currentChild.nodeName == aChildName))) {
					returnArray.push(currentChild);
				}
			}
	
			if(returnArray.length == 0) {
				throw new Error(" getChilds ::: no XML found");
				return returnArray;
			}
	
			return returnArray;
		};

		p.getChildByAttribute = function(aXml, aAttributeName, aValue, aChildName) {
	// console.log("XmlChildRetreiver.getChildByAttribute :: aXml, aAttributeName, aValue, aChildName : ", aXml, aAttributeName, aValue, aChildName);

			aChildName = "*";
	
			if(aXml == null) {
				throw new Error("getChildByAttribute :: no XML found");
				return null;
			}
	
			var returnArray = new Array();
			var currentArray = aXml.childNodes;

			if(currentArray == null) {
				// //console.log("second null");
				throw new Error("getChildByAttribute ::: no XML found", currentArray);
			}
			
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentChild = currentArray[i];
				if((currentChild.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE) && ((aChildName == "*") || (currentChild.nodeName == aChildName)) && (this.getAttribute(currentChild, aAttributeName) == aValue)) { 
					returnArray.push(currentChild);
				}
			}	
	
			if(returnArray.length == 0) {
				console.log(aAttributeName, aValue, aChildName);
				throw new Error("getChildByAttribute :::: no XML found ^ ");
				return;
			}
	
			return returnArray[0];

		};

		p.getNodeValue = function(aXml) {
			// //console.log("XmlChildRetreiver.getNodeValue :: aXml : ", aXml);

			if(aXml == null) {
				throw new Error("getNodeValue :: no XML found");
				return null;
			}
			
			if(aXml.nodeType == breelNS.generic.copy.XmlNodeTypes.TEXT_NODE || aXml.nodeType == breelNS.generic.copy.XmlNodeTypes.CDATA_SECTION_NODE) {
				return String(aXml.nodeValue);
			} else if( aXml.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE) {
				return String(aXml.firstChild.nodeValue);
			}
		
			return null;
		};

		p.getAttribute = function(aXml, aAttributeName) {
			// //console.log("XmlChildRetreiver.getAttribute :: aXml, aAttributeName : ", aXml, aAttributeName);
			
			if(aXml == null) {
				throw new Error("getAttribute :: no XML found");
				return null;
			}
	
			if(!(aXml.nodeType == breelNS.generic.copy.XmlNodeTypes.ELEMENT_NODE)) {
				throw new Error("getNodeValue :: no XML match");
				return null;
			}
			if(aXml.hasAttribute) {
				if(!aXml.hasAttribute(aAttributeName)) {
					return null;
				}
				return aXml.getAttribute(aAttributeName);
			} else {
				var attributeArray = aXml.attributes;
				var attributeArrayLength = attributesArray.length;
				for(var i = 0; i < attributeArrayLength; i++) {
					var currentAttribute = attributesArray[i];
					if(currentAttribute["name"] == aAttributeName) {
						return currentAtrribute["value"];
					}
				}
				return null;
			}

		};

		p.hasSimpleContent = function(aXml) {
			// //console.log("XmlChildRetreiver.hasSimpleContent :: aXml : ", aXml);
			
			if(aXml == null) {
				return false;
			}
	
			if((aXml.childNodes.length == 1) && (aXml.firstChild.nodeType == breelNS.generic.copy.XmlNodeTypes.TEXT_NODE || aXml.firstChild.nodeType == breelNS.generic.copy.XmlNodeTypes.CDATA_SECTION_NODE)) {
				return true;
			}
			return false;

		};
	}

})();