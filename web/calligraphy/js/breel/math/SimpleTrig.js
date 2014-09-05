(function() {

	var namespace = breelNS.getNamespace("generic.math");

	if(!namespace.SimpleTrig) {

		var SimpleTrig = function SimpleTrig() {

		};

		namespace.SimpleTrig = SimpleTrig;

		SimpleTrig.getAngle = function(point1, point2, returnDegrees)
		{
			returnDegrees = returnDegrees || false;
			
			var myRadians = Math.atan2((point1.y-point2.y), (point1.x-point2.x));			
			if (returnDegrees) return SimpleTrig.toDegrees(myRadians);
			else return myRadians;
		}

		
		SimpleTrig.getDistance = function(point1, point2)
		{
			var x = point2.x - point1.x;
			var y = point2.y - point1.y;
			return Math.sqrt(x*x + y*y);
		}
		
		SimpleTrig.getPythagoreanDistance = function(dX, dY) {
			return Math.sqrt(dX * dX + dY * dY);
		};

		SimpleTrig.getPointOnHypoteneuse = function(point, angle, hypoLength)
		{
			// find length of other 2 sides
			var a = Math.sin(angle)*hypoLength;
			var b = Math.sqrt((hypoLength*hypoLength) - (a*a));

			// work out point
			var x, y;

			if (angle > 1.5 || angle < -1.5) 
			{	
				x = point.x + b;
				y = point.y - a;
			}
			else {
				x = point.x - b;
				y = point.y - a;
			}

			return {x:x, y:y};
		} 

		
		SimpleTrig.getPointsOnACircle = function(radius, centre, numPoints)
		{
			var points = [];
			var angle = (Math.PI*2)/numPoints;

			for (var i=0; i < numPoints; ++i)
			{
				points[i] = SimpleTrig.getPointOnACircle(radius, centre, angle*i);
			}

			return points;
		}
		
		
		SimpleTrig.getPointOnACircle = function(radius, centre, theta)
		{
			var circumference = (radius*2) * Math.PI;
			newX = radius * Math.cos(theta) + centre.x;
			newY = radius * Math.sin(theta) + centre.y;
			
			return {x:newX, y:newY};
		}
		

		SimpleTrig.toDegrees = function(radians) 
		{
			return radians*180/Math.PI;
		}


		SimpleTrig.toRadians = function(degrees) 
		{
			return degrees/180*Math.PI;
		}
	}
})();