breelNS.defineClass("generic.utils.StringFormat", null, function(p, s, StringFormat) {


	StringFormat.removeStartAndEndWhiteSpace = function(aString) {
		var string = aString;

		var firstChar = string.charAt(0);
		if(firstChar === " ") {
			string = string.substring(1, string.length);
		}

		var lastChar = string.charAt(string.length-1);
		if(lastChar === " ") {
			string = string.substring(0, string.length-1);
		}

		return string;
	};

	StringFormat.removeAllWhiteSpace = function(aString) {
		var string = aString;
		string = string.replace(/\s+/g,' ');

		var firstChar = string.charAt(0);
		if(firstChar === " ") {
			string = string.substring(1, string.length);
		}
		var lastChar = string.charAt(string.length-1);
		if(lastChar === " ") {
			string = string.substring(0, string.length-1);
		}

		return string;
	};

	StringFormat.removeMultipleWhiteSpaces = function(aString) {
		var string = aString;
		string = string.replace(/\s{2,}/g,' ');

		return string;
	};

});