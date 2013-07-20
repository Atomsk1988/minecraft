importScripts('ajax.js');

self.addEventListener('message', function(e) {
/*
	var context = new CanvasRenderingContext2D();
	event.data.setContext(context); // event.data is the CanvasProxy object
	context.scale(0.1,0.1);
	data = context.getbuildingData(0,0,context.width,context.height);
	*/

	var buildingData = {
		colorPalette:[],
		pixelData:[],
		structure:JSON.parse(e.data[1])
	}
	a=0;
	b=0;
	c=0;
	for(n=0;n<e.data[0].length;n+=4){
		color = e.data[0][n]+','+e.data[0][n+1]+','+e.data[0][n+2];
		var colorIndex = buildingData.colorPalette.indexOf(color);
		a++;
		if(colorIndex==-1){
			b++;
			colorIndex = buildingData.colorPalette.push(color);
			colorIndex--;
		}else{
			c++;
		}
		
		buildingData.pixelData.push(colorIndex);
	}

	ajax('save.php',function(result){
		self.postMessage(result);
	},'data='+JSON.stringify(buildingData));

}, false);