breelNS.defineClass("generic.frameworkbridges.StockholmBridge", "general.abstract.InitObject", function(p, s, StockholmBridge) {
	
	p._init = function() {
		s._init.call(this);
		
		this._globalObject = null;
	};
	
	p.addGlobalFunctions = function() {
		if(window.breel === undefined) {
			window.breel = new Object();
		}
		window.global = window;
		this._globalObject = window.breel;
		
		//Legacy functions
		this._globalObject.define = this.global_define.bind(this);
		this._globalObject.create = this.global_create.bind(this);
		
		if(this._globalObject.include === undefined) {
			this._globalObject.include = this.global_include.bind(this);
		}
		if(this._globalObject.proxy === undefined) {
			this._globalObject.proxy = this.global_proxy.bind(this);
		}
		
		//ph4 function
		this._globalObject.class = this.global_define.bind(this);
		this._globalObject.new = this.global_create.bind(this);
		
		if(this._globalObject.import === undefined) {
			this._globalObject.import = this.global_include.bind(this);
		}
		if(this._globalObject.style === undefined) {
			this._globalObject.style = this.global_style.bind(this);
		}
		if(this._globalObject.log === undefined) {
			this._globalObject.log = console.log.bind(console);
		}
		if(this._globalObject.warn === undefined) {
			this._globalObject.warn = console.warn.bind(console);
		}
		
	};
	
	p.global_define = function(aClassPath, aSuperClassPath, aProperties) {
		console.log("generic.frameworkbridges.StockholmBridge::global_define");
		
		var lastDotIndex = aClassPath.lastIndexOf(".");
		var parentPath = null;
		var className = null;
		if(lastDotIndex > 0) {
			className = aClassPath.substring(lastDotIndex+1, aClassPath.length);
			parentPath = aClassPath.substring(0, lastDotIndex);
		}
		else if(lastDotIndex === 0) {
			console.error("Class path " + aClassPath + " starts with dot.")
			return;
		}
		else {
			className = aClassPath;
		}
		var type = "breel." + aClassPath;
		aClassPath = "generic.stockholm." + aClassPath;
		
		var newClass = breelNS.defineClass(aClassPath, aSuperClassPath, function(aP, aS, aNewClass) {
			for(var objectName in aProperties) {
				aP[objectName] = aProperties[objectName];
			}
			
			aP.type = type;
			aP.super = aS;
		});
		
		var parentHolder = (parentPath !== null) ? breel.getNamespace(parentPath, this._globalObject) : this._globalObject;
		
		parentHolder[className] = newClass.prototype;
		return newClass.prototype;
	};
	
	p.global_include = function(aClassPath) {
		console.log("generic.frameworkbridges.StockholmBridge::global_include");
		
		aClassPath = "generic.stockholm." + aClassPath;
		
		if(breelNS.getClass(aClassPath) === null) {
			//MENOTE: Auto import should not be implemented as i put unnecessary restrictions on how the script can run
			console.error("Class " + aClassPath + " is not defined. Auto import doesn't work in bridge.");
		}
	};
	
	p.global_create = function(aClassPath /*, ... restArguments */) {
		console.log("generic.frameworkbridges.StockholmBridge::global_create");
		
		aClassPath = "generic.stockholm." + aClassPath;
		
		var NewClass = breelNS.getClass(aClassPath);
		var newObject = new NewClass();
		if(newObject._construct) { //MENOTE: legacy
			var restArguments = Array.prototype.splice.call(arguments, 1);
			newObject._construct.apply(newObject, restArguments);
		}
		if(newObject.__construct) { //MENOTE: ph4
			var restArguments = Array.prototype.splice.call(arguments, 1);
			newObject.__construct.apply(newObject, restArguments);
		}
		
		return newObject;
	};
	
	p.global_proxy = function(aFunction, aObject /*, ... restArguments */) {
		//MENOTE: This is a legace function that no longer exists in ph4
		console.log("generic.frameworkbridges.StockholmBridge::global_proxy");
		console.error("Proxy function not implemented in bridge.");
	};
	
	p.global_style = function(aNamespace) {
		console.log("generic.frameworkbridges.StockholmBridge::global_style");
		//MENOTE: Directly ported from stockholms breel.js object, if more functions needs to be ported we need to look at how we can use their object
		if (aNamespace.indexOf(".css") != -1) {
			document.write('<link href="' + aNamespace + '" rel="stylesheet">');
		}
		else {
			var dependencyPath = 'javascript/' + aNamespace.replace(/\./g, '/') + '.css';
			document.write('<link href="' + dependencyPath + '" rel="stylesheet">');
		}
	};
	
	p._destroy = function() {
		s._destroy.call(this);
	};
	
	StockholmBridge.createSingleton = function() {
		var stockholmBridge = new StockholmBridge();
		stockholmBridge.addGlobalFunctions();
		breelNS.singletons.stockholmBridge = stockholmBridge;
		return stockholmBridge;
	};
});