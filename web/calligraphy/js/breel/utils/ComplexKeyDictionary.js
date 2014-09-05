(function() {
	
	var namespace = breelNS.getNamespace("generic.utils");

	if (!namespace.ComplexKeyDictionary)
	{
		var ComplexKeyDictionary = function() {
		
			this._keys = new Array();
			this._values = new Array();
		
		};		

		namespace.ComplexKeyDictionary = ComplexKeyDictionary;

		var p = ComplexKeyDictionary.prototype;

		p.setValue = function(aKey, aValue) {

			var currentArray = this._keys;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentKey = currentArray[i];
				if(currentKey === aKey) {
					this._values[i] = aValue;
					return;
				}
			}

			this._keys.push(aKey);
			this._values.push(aValue);
		};

		p.getValue = function(aKey) {
			var currentArray = this._keys;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentKey = currentArray[i];
				if(currentKey === aKey) {
					return this._values[i];
				}
			}

			//METODO: error message

			return null;
		};
		

	}

})();