//Farid Rener
//farid.rener@mail.mcgill.ca
//MUMT 502


window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
	var nAxis = 7;
	var nData = 5;
	
	var dimensions = [250, 250];
	var dimensionsSVG = dimensions[0]+' '+dimensions[1]+'';

	//data
	var theremin = [1.,1.,0.25,0.25,0.1,0.1,1.];
	var lightningDrum = [0.5,0.66,0.375,0.25,0.1,0.1,1.];
  	var test1 = [0.1,0.8,1.,0.66,0.25,0.25,0.1];
  	var test2 = [0.3,1.,0.1,0.8,1.,0.66,0.25];
  	var test3 = [0.1,0.9,0.1,0.9,0.1,0.9,0.5];

	var data = [theremin, lightningDrum, test1, test2,test3];
	var names = ['Theremin', 'Lightning Drum', 'Test 1', 'Test 2', 'Test 3'];
	var colours = ['#3b14e0', '#7c9a2d', '#e89430','#744dd9', '#4fc3e0','#599123'];
	
	//Group of elements
	var graphs = paper.set();
	var controlButtons = paper.set();

	
	var axis = '';
	var cButtoncoord = 50;
	
	//draw the control circles.
	for (var i = 0; i<data.length; i++){
		var scratch = paper.circle(50,cButtoncoord,10).attr({fill: colours[i], opacity: '0.5'});
		scratch.id = i;
		scratch.show = false;
		controlButtons.push(scratch)
		paper.text(90,cButtoncoord,names[i]).attr({fill: colours[i]});
		cButtoncoord+=20;
	}
	
	controlButtons.click(function(){
		if (this.show == false){
			this.attr({opacity: 0.75});
			graphs[this.id].show();
			this.show = true;
			}
		else{
			this.attr({opacity: 0.5});
			graphs[this.id].hide();
			this.show=false;
		}
	})

	function grapher(){
		//Graph all the graphs, then hide them. 
		
		for (var j=0; j<data.length; j++){
			var ther = '';
			var ther1 = '';
			var datum = data[j];				
		
			for (var i=0; i<data[j].length; i+=1){
				var nextCoordx = (dimensions[0]* Math.sin(2*Math.PI*i/nAxis));
				var nextCoordy = (dimensions[1]* Math.cos(2*Math.PI*i/nAxis));
				//plot points.
				var pointx = datum[i]*nextCoordx+'';
				var pointy = datum[i]*nextCoordy+'';
	
				nextCoordx = nextCoordx+''
				nextCoordy = nextCoordy+''

				axis = axis + 'M 0 0 l' + nextCoordx + ' '+ nextCoordy;
				ther = ther + 'L' + pointx + ' '+ pointy;
				if (i ==1) //grab the first data point to close the loop. 
					{ther1 = ther;}
			}
		ther = 'M 0 0' + ther;
		graphs.push(paper.path(ther+ther1).attr({fill:colours[j]}));	
		}
	
		graphs.attr({translation:dimensionsSVG , stroke: '#ddd', 'stroke-width': 2, opacity: 0.5});
		
		//Hide the graphs
		graphs.hide();
		//Draw axis
		graphs.push(paper.path(axis).attr({stroke:'#796d5f', 'stroke-width': 1.5, translation: dimensionsSVG}));
		//Bring the clicked graph to the front. 
		graphs.click(function(){this.insertBefore(graphs[data.length]);	//the axis is always added last.
		})
	};//grapher()
	grapher();
	var info = loadData("instruments.csv");
	paper.text(250, 250, info).attr({fill: colours[1]});
}
function loadData(file){
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else // Internet Explorer 5/6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",file,false);
	xhttp.send("");
	return xhttp.responseText; 

}