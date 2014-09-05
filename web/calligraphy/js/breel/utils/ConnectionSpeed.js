(function() {

	var namespace = breelNS.getNamespace("generic.utils");
	
	if (!namespace.ConnectionSpeed)
	{
		var ConnectionSpeed = function() {
		
			this._image = null;
			this._speedKbps = 0;
			this._speedMbps = 0;

			this._startTime;
			this._endTime;
		
		};		

		namespace.ConnectionSpeed = ConnectionSpeed;

		var p = ConnectionSpeed.prototype;

		ConnectionSpeed.IMAGE_SRC = 'files/images/loadTest.jpg';
		ConnectionSpeed.IMAGE_SIZE = 10549;

		p.loadImage = function(){

			this._image = new Image();
			var self = this;
			this._image.onload = function(){

				self._endTime = (new Date()).getTime();
				self._calculateResults();
			};
			this._startTime = (new Date()).getTime();
			this._image.src = ConnectionSpeed.IMAGE_SRC;

		};

		p._calculateResults = function(){

			var duration = (this._endTime - this._startTime) / 1000;
			var bitsLoaded = ConnectionSpeed.IMAGE_SIZE * 8;
			var speedBps = (bitsLoaded / duration).toFixed(2);
			this._speedKbps = (speedBps / 1024).toFixed(2);
			this._speedMbps = (this._speedKbps / 1024).toFixed(2);
		};

		p.getConnectionSpeed = function(){

			return this._speedMbps;
		};

		ConnectionSpeed.createSingleton = function() {
 
  			var projectNamespace = breelNS.getNamespace(breelNS.projectName);
 
			if (!projectNamespace.singletons) projectNamespace.singletons = {};
			if (!projectNamespace.singletons.connectionSpeed)
			{
				projectNamespace.singletons.connectionSpeed = new ConnectionSpeed();
			}	
			return projectNamespace.singletons.connectionSpeed;	
		};

	
	}

})();