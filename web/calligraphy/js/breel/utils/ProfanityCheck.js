breelNS.defineClass("generic.utils.ProfanityCheck", null, function(p, s, ProfanityCheck) {

	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	p.setup = function(aPath) {
		this.profanityList = undefined;
		this.isLoaded = false;

		var path = aPath;
		this._loader = new XMLHttpRequest();
		this._loader.open("GET", path, true );
		this._loader.onreadystatechange = ListenerFunctions.createListenerFunction(this, this._onReadyStateChange);
		this._loader.send(null);
	};

	p._onReadyStateChange = function() {
		switch(this._loader.readyState) {
			case 0: //Uninitialized
			case 1: //Set up
			case 2: //Sent
			case 3: //Partly done
				//LVNOTE: do nothing
				break;
			case 4: //Done
				if(this._loader.status < 400) {
					this._data = this._loader.responseText;
					this.onProfanityLoaded(this._data);
				}
				else {
					// console.debug("error in bad word load");
				}
				break;
		}
	};

	p.onProfanityLoaded = function(aList) {
		this.isLoaded = true;
		this.profanityList = aList.split(",");
	};

	p.checkForProfanity = function(aWord) {
		var wordsArray = this.profanityList;
		var wordsArrayLength = wordsArray.length;
		for(var i=0; i<wordsArrayLength; i++) {
			var word = wordsArray[i];
			if(word == "" || word == " ") continue;
			var regexTest = new RegExp("\\b"+word.toLowerCase()+"\\b");
			if( regexTest.test(aWord.toLowerCase()) ) {
				return true;
			}
		}

		return false;
	};

});