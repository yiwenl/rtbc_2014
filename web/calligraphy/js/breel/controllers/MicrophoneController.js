(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var namespace = breelNS.getNamespace("generic.controllers");

	if(!namespace.MicrophoneController) {

		var MicrophoneController = function() {
			this.recognition = undefined;
			this.supported = false;

			this.started = false;
			this.paused = false;

			this.onMicrophoneStartBound = ListenerFunctions.createListenerFunction(this, this.onMicrophoneStart);
			this.onMicrophoneErrorBound = ListenerFunctions.createListenerFunction(this, this.onMicrophoneError);
			this.onMicrophoneEndBound = ListenerFunctions.createListenerFunction(this, this.onMicrophoneEnd);
			this.onMicrophoneAudioStartBound = ListenerFunctions.createListenerFunction(this, this.onMicrophoneAudioStart);
			this.onMicrophoneAudioEndBound = ListenerFunctions.createListenerFunction(this, this.onMicrophoneAudioEnd);
			this.onMicrophoneResultBound = ListenerFunctions.createListenerFunction(this, this.onMicrophoneResult);
		};

		namespace.MicrophoneController = MicrophoneController;
		var p = MicrophoneController.prototype = new EventDispatcher();

		p.setup = function(aContinuous, aInterimResults, aLang) {
			if(window.SpeechRecognition) {
				try {
					this.recognition = new SpeechRecognition();
				}catch(e) {
					console.log("Browser has no webkitSpeechRecognition support");
					console.log("error : ", e);
					return;
				}
			} else if(window.speechRecognition) {
				try {
					this.recognition = new speechRecognition();
				}catch(e) {
					console.log("Browser has no webkitSpeechRecognition support");
					console.log("error : ", e);
					return;
				}
			}else if(window.webkitSpeechRecognition) {
				try {
					this.recognition = new webkitSpeechRecognition();
				}catch(e) {
					console.log("Browser has no webkitSpeechRecognition support");
					console.log("error : ", e);
					return;
				}
			} else {
				console.log("Browser has no SpeechRecognition support");
				return;
			}

			this.supported = true;

			this.recognition.continuous = aContinuous;
			this.recognition.interimResults = aInterimResults;
			this.recognition.lang = aLang;

			ListenerFunctions.addDOMListener(this.recognition, "start", this.onMicrophoneStartBound);
			ListenerFunctions.addDOMListener(this.recognition, "error", this.onMicrophoneErrorBound);
			ListenerFunctions.addDOMListener(this.recognition, "end", this.onMicrophoneEndBound);
			ListenerFunctions.addDOMListener(this.recognition, "audiostart", this.onMicrophoneAudioStartBound);
			ListenerFunctions.addDOMListener(this.recognition, "audioend", this.onMicrophoneAudioEndBound);
			ListenerFunctions.addDOMListener(this.recognition, "result", this.onMicrophoneResultBound);
		};


		p.startMic = function() {
			// if(this.started) return;
			if(!this.supported) return;

			try {
				this.recognition.start();	
			} catch(e) {
				console.log("can not start the mic :: e : ", e);
			}
			
		};
		p.stopMic = function() {
			// if(!this.started) return;
			if(!this.supported) return;
			
			try {
				this.recognition.stop();
			} catch(e) {
				console.log("can not stop the mic :: e : ", e);
			}
			
		};

		p.togglePause = function(){
			this.paused = (this.paused) ? false : true;
		};


		p.onMicrophoneStart = function() {
			this.started = true;
		};
		p.onMicrophoneError = function(aEvent) {
			this.started = false;
		};
		p.onMicrophoneEnd = function() {
			this.started = false;
		};
		p.onMicrophoneAudioStart = function() {
			
		};
		p.onMicrophoneAudioEnd = function() {
			
		};
		p.onMicrophoneResult = function(aEvent) {
			console.log("onMicrophoneResult :: aEvent.results ", aEvent.results);
		};
		

		MicrophoneController.create = function(aContinuous, aInterimResults, aLang) {
			var newMicrophoneController = new MicrophoneController();
			newMicrophoneController.setup(aContinuous, aInterimResults, aLang);
			return newMicrophoneController;
		};
	}

})();