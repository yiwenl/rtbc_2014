(function() {

	var ListenerFunctions = breelNS.getNamespace("generic.events").ListenerFunctions;

	var namespace = breelNS.getNamespace("generic.utils");

	if(!namespace.Scheduler) {

		var Scheduler = function Scheduler() {
			this.FRAMERATE = 60;
			this._delayTasks = [];
			this._nextTasks = [];
			this._deferTasks = [];
			this._batchTasks = [];
			this._highTasks = [];
			this._enterframeTasks = [];
			this._idTable = 0;
			
			this._onRequestAnimationFrameBound = null;
		}
		
		namespace.Scheduler = Scheduler;
		var p = Scheduler.prototype;

		p.setup = function() {
			this._onRequestAnimationFrameBound = ListenerFunctions.createListenerFunction(this, this._loop);
			requestAnimFrame(this._onRequestAnimationFrameBound);
		};

		p._loop = function() {
			this._process();

			requestAnimFrame(this._onRequestAnimationFrameBound);
		};

		p._process = function() {

			
			var startTime;
			
			while ( this._highTasks.length > 0) {
				var t = this._highTasks.pop();
				t.func.call(t.scope, t.params);
			}
			
			if(this._enterframeTasks.length > 0 ) {
				startTime = new Date().getTime();
				for ( var i=0; i<this._enterframeTasks.length; i++) {
					var task = this._enterframeTasks[i];
					if(task != null && task != undefined) {
						if( task.timeout == 0) task.func.apply(task.scope, task.params);
						else if (task.timeout > 0) {
							if(startTime - task.time > task.timeout) {
								task.func.apply(task.scope, task.params);
								task.time = startTime;
							}
						} 
					}
				}
			}
			

			if(this._delayTasks.length > 0) {
				startTime = new Date().getTime();
				for ( var i=0; i<this._delayTasks.length; i++) {
					var t = this._delayTasks[i];
					if(startTime-t.time > t.delay) {
						t.func.call(t.scope, t.params);
						this._delayTasks.splice(i, 1);
					}
				}
			}
				
			if(this._deferTasks.length > 0) {
				startTime = new Date().getTime();
				var interval = 1000 / this.FRAMERATE;
				while(this._deferTasks.length > 0) {
					var task = this._deferTasks.shift();
					var current = new Date().getTime();
					if(current - startTime < interval ) {
						task.func.apply(task.scope, task.params);
					} else {
						this._deferTasks.unshift(task);
						// console.log( "Push back to next Frame" );
						break;
					}
				}
			}

			if(this._batchTasks.length > 0) {
				startTime = new Date().getTime();

				var task = this._batchTasks.shift();
				// console.log( task.timeout );
				if( task.timeout == 0) task.func.apply(task.scope, task.params);
				else if (task.timeout > 0) {
					if(startTime - task.time > task.timeout) {
						task.func.apply(task.scope, task.params);
						task.time = startTime;

						for ( var i=0; i<this._batchTasks.length; i++) {
							var task = this._batchTasks[i];
							if(task) task.time = startTime;
						}
					} else {
						this._batchTasks.unshift(task);
					}
				} 
			}

			this._highTasks = this._highTasks.concat(this._nextTasks);
			this._nextTasks = [];
		};

		p.addEF = function(scope, func, params, timeout, times, onComplete) {
			if(timeout == undefined) timeout = 0;
			var id = this._idTable;
			this._enterframeTasks[id] = {scope:scope, func:func, params:params, timeout:timeout, time:new Date().getTime() };
			this._idTable ++;
			return id;
		};
	
	
		p.removeEF = function(id) {
			if(this._enterframeTasks[id] != undefined) {
				this._enterframeTasks[id] = null
			}
			return -1;
		};


		p.delay = function(scope, func, params, delay) {
			var time = new Date().getTime();
			var t = {scope:scope, func:func, params:params, delay:delay, time:time};
			this._delayTasks.push(t);
		};


		p.defer = function(scope, func, params) {
			var t = {scope:scope, func:func, params:params};
			this._deferTasks.push(t);
		};


		p.batch = function(scope, func, params, timeout) {
			if(timeout == undefined) timeout = 0;
			var time = new Date().getTime();
			var t = {scope:scope, func:func, params:params, timeout:timeout, time:time};
			this._batchTasks.push(t);
		};
		p.removeAllBatchTasks = function() {
			this._batchTasks = [];
		};


		p.next = function(scope, func, params) {
			var t = {scope:scope, func:func, params:params};
			this._nextTasks.push(t);
		};

		Scheduler.create = function() {
			var newScheduler = new Scheduler();
			newScheduler.setup();
			return newScheduler;
		};
	}

})();