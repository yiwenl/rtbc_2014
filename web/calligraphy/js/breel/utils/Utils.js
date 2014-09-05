(function() {

	var namespace = breelNS.getNamespace("generic.utils");

	if(!namespace.Utils) {

		namespace.Utils = function() {

		};

		var Utils = namespace.Utils;

		Utils.destroyIfExists = function(aObject) {
			if(aObject !== null && aObject !== undefined && aObject.destroy instanceof Function) {
				aObject.destroy();
			}
		};
	
		Utils.destroyArrayIfExists = function(aArray) {
			if(aArray !== null && aArray !== undefined && aArray instanceof Array) {
				
				var currentArray = aArray;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentObject = currentArray[i];
					if(currentObject !== null && currentObject !== undefined && currentObject.destroy instanceof Function) {
						currentObject.destroy();
					}
					currentArray[i] = null;
				}
			}
		};

		Utils.checkIfArraysMatch = function(aArray, bArray) {
			var aArrayLength = aArray.length;
			var bArrayLength = bArray.length;
			var same = true;
			if(aArrayLength != bArrayLength) return false;
			for(var i = 0; i<aArrayLength; i++) {
				var aItem = aArray[i];
				var bItem = bArray[i];
				if( Utils.isArray(aItem) && Utils.isArray(bItem) ) {
					if( Utils.checkIfArraysMatch(aItem, bItem) ) {
						continue;
					} else {
						same = false;
						return same;
					}
				} else if(typeof aItem === 'object' && typeof bItem === 'object') {
					if( Utils.checkIfObjectsMatch(aItem, bItem) ) {
						continue;
					} else {
						same = false;
						return same;
					}
				} else if(aItem != bItem) {
					same = false;
					return same;
				}
			}

			return same;
		};

		Utils.isArrayEmpty = function(aArray) {
			return (aArray.length == 0) ? true : false;
		};
		Utils.isObjectEmpty = function(aObject) {
			for(var prop in aObject) {
				if(aObject.hasOwnProperty(prop))
					return false;
			}
			return true;
		};
		Utils.checkIfObjectsMatch = function(aObject, bObject) {
			var same = true;
			if(aObject === undefined || bObject === undefined) return false;
			if(Utils.objectSize(aObject) != Utils.objectSize(bObject)) return false;

			for(var prop in aObject) {
				var aItem = aObject[prop];
				var bItem = bObject[prop];

				if( Utils.isArray(aItem) && Utils.isArray(bItem) ) {
					if( Utils.checkIfArraysMatch(aItem, bItem) ) {
						continue;
					} else {
						same = false;
						return same;
					}
				} else if(typeof aItem === 'object' && typeof bItem === 'object') {
					if( Utils.checkIfObjectsMatch(aItem, bItem) ) {
						continue;
					} else {
						same = false;
						return same;
					}
				} else if(aItem != bItem) {
					same = false;
					return same;
				}
			}
			return same;
		};
		Utils.objectSize = function(aObject) {
			var size = 0, key;
			for (key in aObject) {
				if (aObject.hasOwnProperty(key)) size++;
			}
			return size;
		};

		Utils.isArray = function(aArray) {
			return Object.prototype.toString.apply(aArray) === '[object Array]';
		}
		
		Utils._toCamelCase = function(s) {

			// remove underscores and numbers from the start of a string.
			s = s.replace(/([^a-zA-Z0-9_\-])|^[_0-9]+/g, "").trim().toLowerCase();

			// turn all letters that follow a space or hypthen to uppercase.
			s = s.replace(/([ -]+)([a-zA-Z0-9])/g, function(a,b,c) {
				return c.toUpperCase();
			});
			// turn all letters that follow a number to uppercase.
			s = s.replace(/([0-9]+)([a-zA-Z])/g, function(a,b,c) {
				return b + c.toUpperCase();
			});

			return s;
		};
		Utils.capitaliseFirstLetter = function(aString) {
    		return aString.charAt(0).toUpperCase() + aString.slice(1);
		};

		Utils._getURLParameter = function(aName) {
  			return decodeURIComponent((new RegExp('[?|&]' + aName + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
		};

		Utils.setCookie = function(aCookieName, aCookieValue, aExDays, aExMins, aDomain, aPath) {
			// console.log("aCookieName, aCookieValue, aExDays, aDomain : ", aCookieName, aCookieValue, aExDays, aExMins, aDomain);
			var exdate=new Date();
			var hasExpire = false;
			if(aExDays !== undefined) {
				exdate.setDate(exdate.getDate() + aExDays);
				hasExpire = true;
			} 
			if(aExMins !== undefined) {
				exdate.setMinutes(exdate.getMinutes() + aExMins);
				hasExpire = true;
			}
			
			var aCookieValue=escape(aCookieValue) + ((hasExpire==false) ? "" : "; expires="+exdate.toUTCString()) + ((aDomain==undefined) ? "" : "; domain="+aDomain)+ ((aPath==undefined) ? "" : "; path="+aPath);
			document.cookie=aCookieName + "=" + aCookieValue;
		};

		Utils.getCookie = function(c_name) {
			// console.log("c_name : ", c_name);
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");
			if (c_start == -1) {
				c_start = c_value.indexOf(c_name + "=");
			}
			
			if (c_start == -1) {
				c_value = null;
			} else {
				c_start = c_value.indexOf("=", c_start) + 1;
				var c_end = c_value.indexOf(";", c_start);
				if (c_end == -1) {
					c_end = c_value.length;
				}
				c_value = unescape(c_value.substring(c_start,c_end));
			}
			return c_value;
		};

		Utils.delete_cookie = function(name, aDomain, aPath) {
			console.log("delete_cookie :: aDomain : ", aDomain);
			var cookieDetails = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + ( (aDomain==undefined) ? "" : "domain="+aDomain+";") + ((aPath==undefined) ? "" : " path="+aPath);
			// alert("cookieDetails : "+ cookieDetails);
    		document.cookie = cookieDetails;
		};

		Utils.getDescendantProperty = function(object, path) {
			var arr = path.split(".");
			while(arr.length && (object = object[arr.shift()]));
			return object;
		};
	}
})();