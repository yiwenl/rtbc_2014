(function() {
	
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.sound");

	if(!namespace.SoundLogger) {
		var SoundLogger = function SoundLogger() {

			this._messages = [];

		};

		namespace.SoundLogger = SoundLogger;


		var p = SoundLogger.prototype = new EventDispatcher();


		p.pushMessage = function() {

			for (var i =0; i < arguments.length; i++)
				this._messages.push(arguments[i]);
		};

		p.flush = function(aClear) {

			// console.log(" :: SoundLogger Start :: (note, these messages are not in-time) ");

			while(this._messages.length) {
				if (aClear) this._messages.shift();
				else console.log(this._messages.shift());
			}

			// console.log(" :: SoundLogger End :: ");
		};

		SoundLogger.getSingleton = function() {
			return SoundLogger.createSingleton();
		}

		
		SoundLogger.createSingleton = function() {

			if (!namespace.singletons) namespace.singletons = {};
			if (!namespace.singletons.SoundLogger)
			{
				namespace.singletons.SoundLogger = new SoundLogger();
			}	
			return namespace.singletons.SoundLogger;	
		};
		
	}

})();