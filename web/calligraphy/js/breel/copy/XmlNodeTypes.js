(function() {

	var namespace = breelNS.getNamespace("generic.copy");
	
	if (!namespace.XmlNodeTypes)
	{
		var XmlNodeTypes = function() {
		
			this._element = null;	
		
		};		

		namespace.XmlNodeTypes = XmlNodeTypes;

		var p = XmlNodeTypes.prototype;

		XmlNodeTypes.ELEMENT_NODE = 1;
		XmlNodeTypes.ATTRIBUTE_NODE = 2;
		XmlNodeTypes.TEXT_NODE = 3;
		XmlNodeTypes.CDATA_SECTION_NODE = 4;
		XmlNodeTypes.ENTITY_REFERENCE_NODE = 5;
		XmlNodeTypes.ENTITY_NODE = 6;
		XmlNodeTypes.PROCESSING_INSTRUCTION_NODE = 7;
		XmlNodeTypes.COMMENT_NODE = 8;
		XmlNodeTypes.DOCUMENT_NODE = 9;
		XmlNodeTypes.DOCUMENT_TYPE_NODE = 10;
		XmlNodeTypes.DOCUMENT_FRAGMENT_NODE = 11;
		XmlNodeTypes.NOTATION_NODE = 12;

	}

})();