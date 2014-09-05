(function() {
	var SimpleCamera = breelNS.getNamespace("generic.canvas").SimpleCamera;
	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;
	var MathUtils = breelNS.getNamespace("generic.math").MathUtils;
	var namespace = breelNS.getNamespace("generic.canvas");
	var siteManager;

	if(!namespace.HoverCamera) {

		var HoverCamera = function HoverCamera() {
		}

		namespace.HoverCamera = HoverCamera;

		var p = HoverCamera.prototype = new SimpleCamera();
		var s = SimpleCamera.prototype;

		p.init = function(radius, speed) {
			siteManager = breelNS.getNamespace(breelNS.projectName).singletons.siteManager;
			console.log("camera init");
			this._radius = radius;
			this._speed = speed == undefined ? .1 : speed;

			this._targetRX = 0;
			this._tempRX = 0;
			this.rx = 0;
			this._targetRY = -Math.PI/2;
			this._tempRY = -Math.PI/2;
			this.ry = -Math.PI/2;
			this._distx = 0;
			this._disty = 0;
			this._prex = 0;
			this._prey = 0;
			this.mouseX = 0;
			this.mouseY = 0;
			this._needUpdate = false;
			this.lockWheel = true;
			this.lockRx = siteManager.config.config.lockCameraX;
			this.lockRy = siteManager.config.config.lockCameraY;
			this._isLocked = false;
			this.down = vec3.create([0, 1, 0]);
			this.rz = 0;
			this._isMouseDown = false;

			this._lastDist = {
				x:0,
				y:0
			}
			this._currentDist = { 	
				x:0,
				y:0
			}

			this._onMouseDownBound = ListenerFunctions.createListenerFunction(this, this._onMouseDown);
			this._onMouseMoveBound = ListenerFunctions.createListenerFunction(this, this._onMouseMove);
			this._onMouseUpBound = ListenerFunctions.createListenerFunction(this, this._onMouseUp);
			this._onMouseWheelBound = ListenerFunctions.createListenerFunction(this, this._onMouseWheel);

			this._onMotionBound = ListenerFunctions.createListenerFunction(this, this._onMotion);
			// ListenerFunctions.addDOMListener(window, "devicemotion", this._onMotionBound);

			this._touchEventsEnabled = false;			

			return this;
		}

		p._onMotion = function(e) {
			this._needUpdate = true;
			this.mouseY = event.accelerationIncludingGravity.x * 20;
		}

		p.enableTouchEvents = function() {
			console.log("enableTouchEvents : ");
			if (this._touchEventsEnabled) return;
			this._touchEventsEnabled = true;

			ListenerFunctions.addDOMListener(document,"mousedown",this._onMouseDownBound);
			ListenerFunctions.addDOMListener(document,"mouseup",this._onMouseUpBound);
			ListenerFunctions.addDOMListener(document,"mousemove",this._onMouseMoveBound);

			// ListenerFunctions.addDOMListener(document,"touchstart",this._onMouseDownBound);
			// ListenerFunctions.addDOMListener(document,"touchend",this._onMouseUpBound);
			// ListenerFunctions.addDOMListener(document,"touchmove",this._onMouseMoveBound);

			if(siteManager.config.config.enableMouseWheel) {
				this.lockWheel = false;
				ListenerFunctions.addDOMListener(document,"mousewheel",this._onMouseWheelBound);
				ListenerFunctions.addDOMListener(document,"DOMMouseScroll",this._onMouseWheelBound);
			} else {
				this.lockWheel = true;
			}

		};


		p.disableTouchEvents = function() {

			this._touchEventsEnabled = false;

			ListenerFunctions.removeDOMListener(document,"mousedown",this._onMouseDownBound);
			ListenerFunctions.removeDOMListener(document,"mouseup",this._onMouseUpBound);
			ListenerFunctions.removeDOMListener(document,"mousemove",this._onMouseMoveBound);

			ListenerFunctions.removeDOMListener(document,"touchstart",this._onMouseDownBound);
			ListenerFunctions.removeDOMListener(document,"touchend",this._onMouseUpBound);
			ListenerFunctions.removeDOMListener(document,"touchmove",this._onMouseMoveBound);

			if(siteManager.config.config.enableMouseWheel) {
				this.lockWheel = false;
				ListenerFunctions.removeDOMListener(document,"mousewheel",this._onMouseWheelBound);
				ListenerFunctions.removeDOMListener(document,"DOMMouseScroll",this._onMouseWheelBound);
			} else {
				this.lockWheel = true;
			}

		};

		p._onMouseDown = function(e) {
			if(this._isMouseDown) return;
			this._isMouseDown = true;
			this._needUpdate = true;
			if(e.touches !== undefined) {
				var touchInputOne = e.touches[0];
				var touchInputTwo = e.touches[1];
			}

			if(touchInputOne && touchInputTwo) {
				this._currentDist = MathUtils.getDistance({x : touchInputOne.clientX, y : touchInputOne.clientY}, {x : touchInputTwo.clientX, y : touchInputTwo.clientY});
				this._lastDist = this._currentDist;
			} else {
				if(e.clientX) {
					this._prex = e.clientX;
					this._prey = e.clientY;
					this.mouseX = e.clientX;
					this.mouseY = e.clientY;
				} else if(e.touches) {
					this._prex = e.touches[0].pageX;
					this._prey = e.touches[0].pageY;
					this.mouseX = e.touches[0].pageX;
					this.mouseY = e.touches[0].pageY;
				} else {
					return;
				}
				
				this._tempRX = this.rx;
				this._tempRY = this.ry;
			}
		}


		p._onMouseUp = function(e) {
			if(!this._isMouseDown) return;
			this._isMouseDown = false;
			this._needUpdate = false;
		}


		p._onMouseMove = function(e) {
			e.preventDefault();

			if(e.touches !== undefined) {
				var touchInputOne = e.touches[0];
				var touchInputTwo = e.touches[1];
			}

			if(touchInputOne && touchInputTwo) {
				this._currentDist = MathUtils.getDistance({x : touchInputOne.clientX, y : touchInputOne.clientY}, {x : touchInputTwo.clientX, y : touchInputTwo.clientY});
				// alert("this._currentDist : "+ this._currentDist);
				if(this._currentDist != this._lastDist) {
					var value = this._currentDist / 120;
					if(this._currentDist > this._lastDist) {
						this._radius += value*siteManager.config.config.touchZoomSensitivity;
					} else {
						this._radius -= value*siteManager.config.config.touchZoomSensitivity;
					}
					// alert('value x : '+ value);
					

					this._lastDist = this._currentDist;
				}
			} else {

				if(e.clientX) {
					this.mouseX = e.clientX;
					this.mouseY = e.clientY;
				} else if(e.touches) {
					this.mouseX = e.touches[0].pageX;
					this.mouseY = e.touches[0].pageY;
				} else {
					return;
				}
			}
		}


		p._onMouseWheel = function(e) {
			e.preventDefault();
			if(this.lockWheel || this._isLocked) return;
			var w = e.wheelDelta;
			var d = e.detail;
			var value = 0;
			if (d){
				if (w) value = w/d/40*d>0?1:-1; // Opera
			    else value = -d/3;              // Firefox;         TODO: do not /3 for OS X
			} else value = w/120/2; 

			this._radius -= value*5;
		}


		p._updateDistance = function() {
			this._distx = (this.mouseY - this._prey) / 200;
			this._disty = (this.mouseX - this._prex) / 200;
		}


		p.update = function() {
			if(this._needUpdate) {
				this._updateDistance();
				this._targetRX = this._tempRX + this._distx;
				this._targetRY = this._tempRY + this._disty;
			}

			if(!this.lockRx && !this._isLocked) this.rx += (this._targetRX - this.rx) * this._speed;
			if(!this.lockRy && !this._isLocked) this.ry += (this._targetRY - this.ry) * this._speed;
			// console.log( this.lockRx, this._targetRX, this._isLocked );
			// this.ry += (this._targetRY - this.ry) * this._speed;

			// if(this.rx > Math.PI/2) {
			// 	this.rx = Math.PI/2;
			// 	this._targetRX = Math.PI/2;
			// } else if(this.rx < -Math.PI/2) {
			// 	this.rx = -Math.PI/2;
			// 	this._targetRX = -Math.PI/2;
			// }
			
			this.x = -Math.cos(this.rx) * Math.cos(this.ry) * this._radius;
			this.y = -Math.sin(this.rx) * this._radius;
			this.z = -Math.cos(this.rx) * Math.sin(this.ry) * this._radius;

			var rx = this.rx;
			while(rx < 0) rx += Math.PI*2;
			while(rx > Math.PI*2) rx -= Math.PI*2;
			var ry = this.ry;
			var rz = this.rz;	

			mat4.identity(this.matrix);
			var eye = vec3.create([this.x, this.y, this.z]);
			if(rx >=0 && rx < Math.PI/2) this.matrix = mat4.lookAt(eye, this.target, this.up);
			else if(rx >= Math.PI*3/2 && rx < Math.PI*2) this.matrix = mat4.lookAt(eye, this.target, this.up);
			else this.matrix = mat4.lookAt(eye, this.target, this.down);
			return this.matrix;
		}

		p.animateX = function(aTrx) {
			if(aTrx !== undefined) {
				var trx = aTrx;
				var tween = new TWEEN.Tween(this).to({'rx':trx, 'ry':this.ry}, 1000).easing(TWEEN.Easing.Cubic.Out).start();
				this._targetRX = trx;
				this._tempRX = trx;
				this._targetRY = -Math.PI/2;
				this._tempRY = -Math.PI/2;
				this._distx = 0;
				this._disty = 0;
				this._prex = 0;
				this._prey = 0;
				this.mouseX = 0;
				this.mouseY = 0;
			}
		};
		p.animateY = function(aTry) {
			if(aTry !== undefined) {
				var trY = aTry;
				var tween = new TWEEN.Tween(this).to({'rx':this.rx, 'ry':trY}, 1000).easing(TWEEN.Easing.Cubic.Out).start();
				this._targetRY = trY;
				this._tempRY = trY;
				this._distx = 0;
				this._disty = 0;
				this._prex = 0;
				this._prey = 0;
				this.mouseX = 0;
				this.mouseY = 0;
			}
		};

		p.lock = function(aBoolean, aTrx) {
			this._isLocked = aBoolean;
			// console.log("aBoolean, aTrx : ", aBoolean, aTrx);
			var trx = this._isLocked ? params.inspectCameraAngleLock : 0;
			// console.log("trx : ", trx);
			if(aTrx !== undefined) trx = aTrx;

			var tween = new TWEEN.Tween(this).to({'rx':trx, 'ry':-Math.PI/2}, 1000).easing(TWEEN.Easing.Cubic.Out).start();
			this._targetRX = trx;
			this._tempRX = trx;
			this._targetRY = -Math.PI/2;
			this._tempRY = -Math.PI/2;
			this._distx = 0;
			this._disty = 0;
			this._prex = 0;
			this._prey = 0;
			this.mouseX = 0;
			this.mouseY = 0;
		}
	}
})();