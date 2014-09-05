(function() {

	var namespace = breelNS.getNamespace("generic.math.order");
	var OrderSelector = namespace.OrderSelector;
	var BinaryTree = breelNS.getNamespace("generic.math").BinaryTree;

	if(!namespace.ImageSequenceOrderSelector) {
		var ImageSequenceOrderSelector = function ImageSequenceOrderSelector() {
			this._chooseStep = 0;
			this._currentForwardStep = 0;
			this._currentBackwardStep = 0;
			this._currentOrderStep = 0;
			this._orderArray = null;
			this._reservedArray = null;
			this._currentPosition = 0;
			this._length = 0;
		};

		namespace.ImageSequenceOrderSelector = ImageSequenceOrderSelector;
		
		var p = ImageSequenceOrderSelector.prototype = new OrderSelector();
		var s = OrderSelector.prototype;
		
		p.setup = function(aStartPosition, aLength) {
			//console.log("generic.math.order.ImageSequenceOrderSelector::setup");
			this._currentPosition = aStartPosition
			this._length = aLength;
			this._reservedArray = new Array(aLength);
			
			var depth = BinaryTree.getNextPowerOfTwoLength(aLength);
			var currentArrayLength = 2 << depth;
			var currentArray = new Array(currentArrayLength);
			for(var i = 0; i < aLength; i++) {
				currentArray[BinaryTree.getArrayPosition(i, depth)] = i;
			}
			for(var i = 0; i < currentArrayLength; i++) {
				if(currentArray[i] === undefined) {
					currentArray.splice(i, 1);
					i--;
					currentArrayLength--;
				}
			}
			this._orderArray = currentArray;
			//console.log(this._orderArray);
			
			return this;
		};
		
		p.changeCurrentPosition = function(aPosition) {
			this._currentForwardStep = 0;
			this._currentBackwardStep = 0;
			this._currentPosition = aPosition;
		};
		
		p.getNextPosition = function() {
			
			this._chooseStep++;
			if(this._chooseStep % 3 == 0) {
				for(var i = this._currentForwardStep; i < this._length; i++) {
					this._currentForwardStep = i;
					var currentPosition = (this._currentPosition-i+this._length)%this._length;
					if(this._reservedArray[currentPosition] != true) {
						this._reservedArray[currentPosition] = true;
						return currentPosition;
					}
				}
			}
			else if(this._chooseStep % 3 == 1) {
				for(var i = this._currentBackwardStep; i < this._length; i++) {
					this._currentBackwardStep = i;
					var currentPosition = (this._currentPosition+i)%this._length;
					if(this._reservedArray[currentPosition] != true) {
						this._reservedArray[currentPosition] = true;
						return currentPosition;
					}
				}
			}
			else {
				for(var i = this._currentOrderStep; i < this._length; i++) {
					this._currentOrderStep = i;
					var currentPosition = this._orderArray[i];
					if(this._reservedArray[currentPosition] != true) {
						this._reservedArray[currentPosition] = true;
						return currentPosition;
					}
				}
			}
				
			return -1;
		};
		
		ImageSequenceOrderSelector.create = function(aStartPosition, aLength) {
			var newImageSequenceOrderSelector = new ImageSequenceOrderSelector();
			newImageSequenceOrderSelector.setup(aStartPosition, aLength);
			return newImageSequenceOrderSelector;
		};
	}
})();