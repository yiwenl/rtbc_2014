(function() {

	var namespace = breelNS.getNamespace("generic.math");

	if(!namespace.BinaryTree) {
		var BinaryTree = function BinaryTree() {

		};

		namespace.BinaryTree = BinaryTree;
		
		BinaryTree.getArrayPosition = function(aNumber, aDepth) {
			var returnPosition = 0;
			var currentValue = aNumber;
			
			for(var i = 0; i <= aDepth; i++) {
				var offsetLength = aDepth-i;
				var currentBit = currentValue & 0x01;
				returnPosition += currentBit*(1 << offsetLength);
				currentValue >>= 1;
			}
			
			return returnPosition;
		};
		
		BinaryTree.getNextPowerOfTwoLength = function(aValue) {
			var returnLength = 0;
			while(aValue > (2 << returnLength)) {
				returnLength++;
			}
			return returnLength;
		};
	}
})();