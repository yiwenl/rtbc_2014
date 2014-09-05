// BackendHttpRequest.js

(function() {

	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var siteManager;
	var namespace = breelNS.getNamespace("generic.backend");

	if(!namespace.BackendHttpRequest) {

		var BackendHttpRequest = function BackendHttpRequest() {

			this._init();
		};

		namespace.BackendHttpRequest = BackendHttpRequest;
		var p = BackendHttpRequest.prototype = new EventDispatcher();

		BackendHttpRequest.LOADED = "loaded";
		BackendHttpRequest.ERROR = "error";

		p._init = function() {
			
			this._url = null;
			this._loader = null;
			this._data = null;

			this._openString = null;
			this._sendString = null;

			this._multipart = false;
			this._boundary = null;

			this._contentType = null;

			this._callback = null;
			
			return this;
		};

		p.setup = function(aType, aOpenString, aSendString, aMultiPart, aBoundary, aContentType) {

			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;

			this._type = (aType === undefined) ? "POST" : aType;
			this._openString = aOpenString;
			this._sendString = (aSendString === undefined) ? null : aSendString;
			this._multipart = (aMultiPart) ? aMultiPart : false;
			if(this._multipart) {
				this._boundary = aBoundary;
			}
			this._contentType = (aContentType === undefined) ? "application/x-www-form-urlencoded" : aContentType;
		};

		p.load = function() {
			if(browserName == "Microsoft Internet Explorer") {
				if(fullVersion < 10){
					this._loader = new ActiveXObject("Microsoft.XMLHTTP");
				}else {
					this._loader = new XMLHttpRequest();
				}
			} else {
				this._loader = new XMLHttpRequest();
			}

			this._loader.open(this._type, this._openString, true );

			this._loader.onreadystatechange = ListenerFunctions.createListenerFunction(this, this._onReadyStateChange);
			
			if(this._multipart) {
				this._loader.setRequestHeader("Content-Type", "multipart/form-data; boundary="+this._boundary);
			}else {
				this._loader.setRequestHeader("Content-type", this._contentType);
			}

			this._loader.send(this._sendString);

			return this;
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
						this.dispatchCustomEvent(BackendHttpRequest.LOADED, this._data);
					}
					else {
						// console.debug( "Error !!!!!!" );
						this.dispatchCustomEvent(BackendHttpRequest.ERROR, null);
					}
					break;
			}
		};

		p.destroy = function() {
			if(this._loader !== null) {
				this._loader.onreadystatechange = function(){
				};
				this._loader = null;
			}
			
			this._url = null;
			this._data = null;
		};

		BackendHttpRequest.create = function(aType, aOpenString, aSendString, aMultiPart, aBoundary, aContentType) {
			var newBackendHttpRequest = new BackendHttpRequest();
			newBackendHttpRequest.setup(aType, aOpenString, aSendString, aMultiPart, aBoundary, aContentType);
			return newBackendHttpRequest;
		};
	}

})();