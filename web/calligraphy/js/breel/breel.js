(function(aGlobalObject) {
	if(aGlobalObject.breelNS) {
		console.warn("B-Reel global object has already been constructed.");
		return;
	}
	var breelNS = {};
	aGlobalObject.breelNS = breelNS;
	breelNS.projectName = "sParticle";
	breelNS.javascriptRoot = "";
	breelNS.dirRoot = "";
	breelNS.javascriptToLoad = new Array();
	breelNS.productionMode = false;
	breelNS.fallback = false;

	if(breelNS.productionMode) {
		breelNS.dirRoot = "/";
	}
	breelNS.javascriptRoot = breelNS.dirRoot + breelNS.javascriptRoot;

	
	breelNS.getNamespace = function(aPackagePath, aHolderObject) {

		var currentObject = (aHolderObject === undefined) ? this : aHolderObject;

		var currentArray = aPackagePath.split(".");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			if(currentObject[currentName] === undefined) {
				currentObject[currentName] = {};
			}
			currentObject = currentObject[currentName];
		}

		return currentObject;
	};
	
	breelNS.getClass = function(aClassPath) {

		var lastSplitPosition = aClassPath.lastIndexOf(".");
		var packagePath = aClassPath.substring(0, lastSplitPosition);
		var className = aClassPath.substring(lastSplitPosition+1, aClassPath.length);
		
		var packageObject = this.getNamespace(packagePath);
		if(packageObject[className] === undefined) {
			console.error("Class " + aClassPath + " doesn't exist.");
			return null;
		}
		return packageObject[className];
	};
	
	breelNS.defineClass = function(aClassPath, aSuperClassPath, aDefinitionFunction) {
		var lastSplitPosition = aClassPath.lastIndexOf(".");
		var packagePath = aClassPath.substring(0, lastSplitPosition);
		var className = aClassPath.substring(lastSplitPosition+1, aClassPath.length);
		
		var packageObject = this.getNamespace(packagePath);
		if(packageObject[className] !== undefined) {
			console.warning("Can't define class " + aClassPath + " as it already exist.");
			return packageObject[className];
		}
		
		var SuperClass = Object;
		if(aSuperClassPath !== null) {
			SuperClass = this.getClass(aSuperClassPath);
			if(SuperClass === null) {
				console.error("Can't define class " + aClassPath + " as super class " + aSuperClassPath + " doesn't exist.");
				return null;
			}
		}
		
		var ClassConstructor = function() {
			SuperClass.apply(this, arguments);
		};
		ClassConstructor.prototype = new SuperClass();
		packageObject[className] = ClassConstructor;
		
		aDefinitionFunction.call(null, ClassConstructor.prototype, SuperClass.prototype, ClassConstructor);
		
		return ClassConstructor;
	};

	breelNS.addJS = function(aPath) {
		breelNS.javascriptToLoad.push(aPath);
	};

	breelNS.loadJS = function() {
		if(breelNS.fallback) return;
		
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');

		var path = breelNS.javascriptToLoad.shift();
		
		// console.log("path : ", path);

		script.type= 'text/javascript';
		script.addEventListener("load", loadComplete, false);
		script.src= breelNS.javascriptRoot+path;

		head.insertBefore(script, null);
	};


	breelNS.addFavicon = function() {
		var fav = document.createElement("link");
		fav.rel 	= "shortcut icon";
		fav.href 	= "[url]/favicon.ico";
		var head= document.getElementsByTagName('head')[0];
		head.insertBefore(fav, null);
	};

	function loadComplete() {
		if(breelNS.javascriptToLoad.length > 0) {
			breelNS.loadJS();
		}
	};

	breelNS.bootstrapLoaderObject = null;

	breelNS.setBootstrapLoaderObject = function(aBootstrapObject){
		this.bootstrapLoaderObject = aBootstrapObject;
	};	

	breelNS.getBootstrapLoaderObject = function(){
		return this.bootstrapLoaderObject;
	};	

	breelNS.bootstrapLoaderProgress = function(aProgress){
		if (this.bootstrapLoaderObject)
			if (this.bootstrapLoaderObject.setProgress){
				// console.log("Bootstrap loader progress : ", aProgress);
				this.bootstrapLoaderObject.setProgress(aProgress);
			}
		else console.warn("B-Reel bootstrap loader progress before object has been set")
	};

	breelNS.singletons = new Object();

})(window);
