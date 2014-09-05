(function() {
	
	var namespace = breelNS.getNamespace("generic.copy");

	if(!namespace.TextConverterChain) {

		var TextConverterChain = function TextConverterChain() {

		}

		namespace.TextConverterChain = TextConverterChain;
		var p = TextConverterChain.prototype;

		p.init = function() {

			this._convertersArray = new Array();
			return this;
		};

		p.addConverter = function(aConverter) {

			this._convertersArray.push(aConverter);
			return this;
		};

		p.convertText = function(aText) {

			var currentText = aText;
			var theLength = this._convertersArray.length;
			for(var i = 0; i < theLength; i++) {
				var currentConverter = this._convertersArray[i];
				currentText = currentConverter.convertText(currentText);
			}

			return currentText;
		};

		TextConverterChain.create = function() {

			var newTextConverterChain = ((new TextConverterChain()).init());
			return newTextConverterChain;
		};

	}

})();