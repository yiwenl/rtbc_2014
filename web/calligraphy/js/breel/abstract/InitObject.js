(function() {

	var namespace = breelNS.getNamespace("general.abstract");
	var className = "InitObject";

	if(namespace[className] === undefined) {

		var InitObject = function() {
			//console.log("general.abstract.InitObject::InitObject");
			this._init.apply(this, arguments);
		};

		var p = InitObject.prototype = new Object();
		namespace[className] = InitObject;

		p._init = function() {
			//console.log("general.abstract.InitObject::_init");
			//Should be overridden
		};

		p.destroy = function() {
			//console.log("general.abstract.InitObject::destroy");
			this._destroy();
		};

		p._destroy = function() {
			//console.log("general.abstract.InitObject::_destroy");
			//Should be overridden
		};
	}
})();