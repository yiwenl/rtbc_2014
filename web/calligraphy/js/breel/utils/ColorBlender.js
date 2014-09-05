(function(){
	
	var NumberFunctions = breelNS.getNamespace("generic.utils").NumberFunctions;
	
	var namespace = breelNS.getNamespace("generic.utils");
	
	if(namespace.ColorBlender === undefined) {
		
		var ColorBlender = function ColorBlender() {
			//MENOTE: do nothing
		};
		
		namespace.ColorBlender = ColorBlender;
		
		ColorBlender.getBlendedHexColor = function(aParameter, aBeginColor, aEndColor) {
			
			var beginR = parseInt(aBeginColor.substring(1, 3), 16);
			var beginG = parseInt(aBeginColor.substring(3, 5), 16);
			var beginB = parseInt(aBeginColor.substring(5, 7), 16);
			
			var endR = parseInt(aEndColor.substring(1, 3), 16);
			var endG = parseInt(aEndColor.substring(3, 5), 16);
			var endB = parseInt(aEndColor.substring(5, 7), 16);
			
			var returnString = "#";
			returnString += NumberFunctions.getPaddedNumber(Math.round((1-aParameter)*beginR+(aParameter)*endR).toString(16), 2);
			returnString += NumberFunctions.getPaddedNumber(Math.round((1-aParameter)*beginG+(aParameter)*endG).toString(16), 2);
			returnString += NumberFunctions.getPaddedNumber(Math.round((1-aParameter)*beginB+(aParameter)*endB).toString(16), 2);
			
			return returnString;
		};

		ColorBlender.getBlendedRGBColor = function(c0, c1, percent) {
			try {
				var r = Math.floor( c0.r + (c1.r - c0.r) * percent);
				var g = Math.floor( c0.g + (c1.g - c0.g) * percent);
				var b = Math.floor( c0.b + (c1.b - c0.b) * percent);

				var color = ColorBlender.Color(r, g, b);
				return color;
			} catch (e) {
				// console.log( c0, c1, percent );
				// console.log( e );
			}
		};

		ColorBlender.Color = function(value0, value1, value2) {
			var color = {
				r : undefined,
				g : undefined,
				b : undefined,
				hexvalue : undefined
			}
			
			if(value1 === undefined) {
				color.hexValue = value0;

				color.r = color.hexValue >> 16 & 0xFF;
				color.g = color.hexValue >> 8 & 0xFF;
				color.b = color.hexValue & 0xFF;
			} else {
				color.r = value0;
				color.g = value1;
				color.b = value2;

				color.hexValue = color.r << 16 | color.g << 8 | color.b;
			};

			return color;
		};

	}
})();