(function(){
	
	var namespace = breelNS.getNamespace("generic.canvas");
	
	if(namespace.PerlinCanvas === undefined) {
		
		var PerlinCanvas = function PerlinCanvas() {
			//MENOTE: do nothing
		};
		
		namespace.PerlinCanvas = PerlinCanvas;
		
		PerlinCanvas.randomNoise = function(canvas, x, y, width, height, alpha) {
		    x = x || 0;
		    y = y || 0;
		    width = width || canvas.width;
		    height = height || canvas.height;
		    alpha = alpha || 255;
		    var g = canvas.getContext("2d"),
		        imageData = g.getImageData(x, y, width, height),
		        random = Math.random,
		        pixels = imageData.data,
		        n = pixels.length,
		        i = 0;
		    while (i < n) {
		        pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
		        pixels[i++] = alpha;
		    }
		    g.putImageData(imageData, x, y);
		    return canvas;
		}
		 
		PerlinCanvas.perlinNoise = function(canvas, noise) {
		    noise = noise || randomNoise(createCanvas(canvas.width, canvas.height));
		    var g = canvas.getContext("2d");
		    g.save();
		    
		    /* Scale random iterations onto the canvas to generate Perlin noise. */
		    for (var size = 4; size <= noise.width; size *= 2) {
		        var x = (Math.random() * (noise.width - size)) | 0,
		            y = (Math.random() * (noise.height - size)) | 0;
		        g.globalAlpha = 4 / size;
		        g.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
		    }
		 
		    g.restore();
		    return canvas;
		}
	}
})();