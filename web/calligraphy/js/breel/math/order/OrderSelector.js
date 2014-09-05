(function() {

	var namespace = breelNS.getNamespace("generic.math.order");

	if(!namespace.OrderSelector) {
		var OrderSelector = function OrderSelector() {

		};

		namespace.OrderSelector = OrderSelector;
		
		var p = OrderSelector.prototype;
		
		p.getNextPosition = function() {
			return -1;
		};
	}
})();