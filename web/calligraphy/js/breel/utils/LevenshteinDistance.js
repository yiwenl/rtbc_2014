(function() {

	var namespace = breelNS.getNamespace("generic.utils");


	if(!namespace.LevenshteinDistance) {

		var LevenshteinDistance = function() {

		};

		namespace.LevenshteinDistance = LevenshteinDistance;
		var p = LevenshteinDistance.prototype;

		p.compareStrings = function(aString, bString) {
			// LVNOTE : returns a int value. The lower the value the closer the strings are two one another.
			// code reference can be found at : http://rosettacode.org/wiki/Levenshtein_distance#JavaScript
			aString = aString.toLowerCase();
			bString = bString.toLowerCase();

			var m = aString.length,
				n = bString.length,
				d = [],
				i, j;
	 
			if (!m) return n;
			if (!n) return m;
		 
			for (i = 0; i <= m; i++) d[i] = [i];
			for (j = 0; j <= n; j++) d[0][j] = j;
		 
			for (j = 1; j <= n; j++) {
				for (i = 1; i <= m; i++) {
				if (aString[i-1] == bString[j-1]) d[i][j] = d[i - 1][j - 1];
					else d[i][j] = Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1;
				}
			}
			return d[m][n];
		};

	}

})();