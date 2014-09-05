(function() {

	var MathUtils = breelNS.getNamespace("generic.math").MathUtils;
	var ProjectionPerspectiveMatrix = breelNS.getNamespace("generic.canvas").ProjectionPerspectiveMatrix;
	var HoverCamera = breelNS.getNamespace("generic.canvas").HoverCamera;
	var EventDispatcher = breelNS.getNamespace("generic.events").EventDispatcher;

	var namespace = breelNS.getNamespace("generic.canvas");
	var siteManager;

	if(!namespace.CanvasRenderer) {

		var CanvasRenderer = function() {

			this.zFar = 3000;

			this.childrenList = [];
			this.projection = new ProjectionPerspectiveMatrix();
			this.projection.perspective(90, 1, .1, this.zFar);
		};

		namespace.CanvasRenderer = CanvasRenderer;
		var p = CanvasRenderer.prototype = new EventDispatcher();
		var s = EventDispatcher.prototype;

		p.setup = function(ctx, autostart) {

			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			
			this.ctx = ctx;
			this.width = this.ctx.canvas.width;
			this.height = this.ctx.canvas.height;

			this.camera = new HoverCamera().init(this.zFar);
			this.camera.enableTouchEvents();
			this.mtx = mat4.create();

			this.isStarted = (autostart === undefined) ? false : autostart;
			if(this.isStarted) {
				this.efIndex = siteManager.scheduler.addEF(this, this.render, []);
			}
		};

		p.init = function() {

			this.ctx.clearRect(0,0, this.width, this.height);
		};

		p.start = function() {
			if(this.isStarted == true) return;
			this.isStarted = true;
			this.efIndex = siteManager.scheduler.addEF(this, this.render, []);
		};

		p.stop = function() {
			console.log( "STOP" );
			if(this.isStarted == false) return;	
			this.isStarted = false;
			console.log( "TO STOP" );
			this.efIndex = siteManager.scheduler.removeEF(this.efIndex);
		};

		p.render = function() {

		};

		p.addChild = function(aChild) {
			this.childrenList.push(aChild);
		};

		p.removeChild = function(aChild) {
			if(this.childrenList.indexOf(aChild) == -1) return;
			this.childrenList.splice(this.childrenList.indexOf(aChild), 1);
		};

		p.removeAll = function() {
			this.childrenList = [];
		};

		p._depthTest = function(a, b) {
			if( a.pos[2] > b.pos[2] ) return 1;
			else if ( a.pos[2] < b.pos[2] ) return -1;
			return 0;
		};

	}

})();