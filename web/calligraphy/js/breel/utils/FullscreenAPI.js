(function(){
	
	var  namespace = breelNS.getNamespace("generic.utils");

	if (!namespace.FullscreenAPI) {

		var FullscreenAPI = function() {

		};

		namespace.FullscreenAPI = FullscreenAPI;

		FullscreenAPI.getFullscreenAPI = function(){
			var api = {
				supportsFullScreen: false,
				isFullScreen: function() { return false; },
				requestFullScreen: function() {},
				cancelFullScreen: function() {},
				fullScreenEventName: '',
				prefix: ''
			},
			browserPrefixes = 'webkit moz o ms khtml'.split(' ');

				// check for native support
			if (typeof document.cancelFullScreen != 'undefined') {
				api.supportsFullScreen = true;
			} else {
				// check for fullscreen support by vendor prefix
				for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
					api.prefix = browserPrefixes[i];
					
					if (typeof document[api.prefix + 'CancelFullScreen' ] != 'undefined' ) {
						api.supportsFullScreen = true;
						break;
					}
				}
			}

			// update methods to do something useful
			if (api.supportsFullScreen) {
				api.fullScreenEventName = api.prefix + 'fullscreenchange';

				api.isFullScreen = function() {
					switch (this.prefix) {
						case '':
							return document['fullScreen'];
						case 'webkit':
							return document['webkitIsFullScreen'];
						default:
							return document[this.prefix + 'FullScreen'];
					}
				}
				
				api.requestFullScreen = function(el) {
					return (this.prefix === '') ? el['requestFullScreen']() : el[this.prefix + 'RequestFullScreen']();
				}
				
				api.cancelFullScreen = function(el) {
					return (this.prefix === '') ? document['cancelFullScreen']() : document[this.prefix + 'CancelFullScreen']();
				}
				
			}
		
			//api.supportsFullScreen = false;
			return api;
		};
	}

})();