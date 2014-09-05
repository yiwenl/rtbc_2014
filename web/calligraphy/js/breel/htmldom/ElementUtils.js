(function(){
	
	
	var namespace = breelNS.getNamespace("generic.htmldom");	

	var ListenerFunctions = breelNS.getClass("generic.events.ListenerFunctions");
	
	if(!namespace.ElementUtils) {
		
		var ElementUtils = function DomElementCreator() {
			//MENOTE: do nothing
		};
		
		namespace.ElementUtils = ElementUtils;

		ElementUtils.calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight) {

			var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
			ratio = Math.min(ratio[0], ratio[1]);

			return { width:srcWidth*ratio, height:srcHeight*ratio };
		}
		
		ElementUtils.addClass = function addClass(aNode, aClassName, aDelay) {
			if (parseFloat(aDelay) > 0)
			{
				var callbackFunction = ListenerFunctions.createListenerFunctionWithArguments(this, this.addClass, [aNode, aClassName]);
				setTimeout(callbackFunction, aDelay);
				
			}
			else
			{
				if (!ElementUtils.hasClass(aNode, aClassName)) {
					aNode.className += (aNode.className ? ' ' : '') + aClassName;
				}
			}			
			
			return aNode;
		};
		
		ElementUtils.hasClass = function hasClass(aNode, aClassName) {
			try {
				return new RegExp('(\\s|^)'+aClassName+'(\\s|$)').test(aNode.className);	
			} catch(err) {
				console.error("ElementUtils.hasClass :: error : ", err);
			}
			return false;
		}
		
		ElementUtils.removeClass = function removeClass(aNode, aClassName, aDelay) {
			if (parseFloat(aDelay) > 0)
			{
				var callbackFunction = ListenerFunctions.createListenerFunctionWithArguments(this, this.removeClass, [aNode, aClassName]);
				setTimeout(callbackFunction, aDelay);
				
			}
			else
				{
				if (ElementUtils.hasClass(aNode, aClassName)) {
					aNode.className=aNode.className.replace(new RegExp('(\\s|^)'+aClassName+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
				}
			}
			
			return aNode;
		}

		ElementUtils.toggleClass = function toggleClass(aNode, aClassName)  {
			if (ElementUtils.hasClass(aNode, aClassName)) {
				ElementUtils.removeClass(aNode, aClassName);
			} else {
				ElementUtils.addClass(aNode, aClassName);
			}
			
			return aNode;
		}

		if (window.jQuery) {

			var tempElement = document.createElement("div");

			// helper function to make code more readable
			var _supportsQuerySelector = typeof(tempElement.querySelector) == "function";

			ElementUtils._querySelector = function(aSource, aTargetSelector)
			{			
				try {
					if (_supportsQuerySelector){
						return aSource.querySelector(aTargetSelector);
					}
					else return $(aSource).children(aTargetSelector)[0];
				} catch(e)
				{
					console.error("Error when trying to select '" + aTargetSelector + "' from ", aSource);
					return null;
				}
			}	

			var _supportsQuerySelectorAll = typeof(tempElement.querySelectorAll) == "function";

			ElementUtils._querySelectorAll = function(aSource, aTargetSelector)
			{
				try {
					if (_supportsQuerySelectorAll)
					{	
						return aSource.querySelectorAll(aTargetSelector);
					}
					else return $(aSource).children(aTargetSelector).get();
				} catch(e)
				{
					console.error("Error when trying to select '" + aTargetSelector + "' from ", aSource);
					return [];
				}

			}

		}

		


		var _isIE6 = navigator.userAgent.indexOf("MSIE 6") != -1;

		ElementUtils._setOpacity = function(aElement, aOpacityValue) {
			if (_isIE6)
			{
				aOpacityValue = parseFloat(aOpacityValue) * 100;
				aElement.style.setProperty("filter", "alpha(opacity=" + aOpacityValue + ")", "");
			} else {
				aElement.style.opacity = parseFloat(aOpacityValue);
			}
		};

	}
})();