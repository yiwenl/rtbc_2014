(function() {

	var namespace = breelNS.getNamespace("generic.utils");

	if(!namespace.MultipleCallLock) {

		var MultipleCallLock = function() {
			this.locked = false;
			this.lockIds = [];
		};
		namespace.MultipleCallLock = MultipleCallLock;
		var p = MultipleCallLock.prototype;

		p.lock = function(aId) {
			var index = this.lockIds.indexOf(aId);
			if(index !== -1) {
				console.log("MultipleCallLock :: lock :: ERROR : lock id " + aId + " has already been added");
				return;
			}
			this.locked = true;
			this.lockIds.push(aId);
			console.log("added lock id : ", aId , " new lock length ", this.lockIds.length);
		};

		p.unlock = function(aId) {
			var index = this.lockIds.indexOf(aId);
			if(index === -1) {
				console.log("MultipleCallLock :: unlock :: ERROR : lock id " + aId + " does not exist");
				return;
			}

			this.lockIds.splice(index, 1);
			console.log("remove lock id : ", aId , " new lock length ", this.lockIds.length);
			if(this.lockIds.length == 0) this.locked = false;
		};

		MultipleCallLock.create = function() {
			var newMultipleCallLock = new MultipleCallLock();
			return newMultipleCallLock;

		};
	}

})();