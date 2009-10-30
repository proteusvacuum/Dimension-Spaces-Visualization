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
		controlButtons.push(paper.circle(50,cButtoncoord,10).attr({fill: colours[i], opacity: '0.5'}))
		paper.text(90,cButtoncoord,names[i]).attr({fill: colours[i]});
		cButtoncoord+=20;
	}
		
		var shown = [false, false, false, false, false];	//is the corresponding graph displayed or not. 
    		controlButtons[0].click(function(){
			if (shown[0] == false){
				this.attr({opacity: 0.75});
				graphs[0].show();
				shown[0] = true;
			}
			else{
				this.attr({opacity: 0.5});
				graphs[0].hide();
				shown[0]=false;
			}
			});
		controlButtons[1].click(function(){
			if (shown[1] == false){
				this.attr({opacity: 0.75});
				graphs[1].show();
				graphs[1].insertBefore(graphs[data.length]);
				shown[1] = true;
			}
			else{
				this.attr({opacity: 0.5});
				graphs[1].hide();
				shown[1]=false;
			}
			});
    		controlButtons[2].click(function(){
			if (shown[2] == false){
				this.attr({opacity: 0.75});
				graphs[2].show();
				graphs[2].insertBefore(graphs[data.length]);
				shown[2] = true;
			}
			else{
				this.attr({opacity: 0.5});
				graphs[2].hide();
				shown[2]=false;
			}
			});
    		controlButtons[3].click(function(){
			if (shown[3] == false){
				this.attr({opacity: 0.75});
				graphs[3].show();
				graphs[3].insertBefore(graphs[data.length]);
				shown[3] = true;
			}
			else{
				this.attr({opacity: 0.5});
				graphs[3].hide();
				shown[3]=false;
			}
			});
    		controlButtons[4].click(function(){
			if (shown[4] == false){
				this.attr({opacity: 0.75});
				graphs[4].show();
				graphs[4].insertBefore(graphs[data.length]);
				shown[4] = true;
			}
			else{
				this.attr({opacity: 0.5});
				graphs[4].hide();
				shown[4]=false;
			}
			});


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
	
		//Some fun.	
		//graphs.mouseover(function(){
		//	graphs.animate({rotation: (rot+=60)+' ' + '250 250'}, 1000, 'bounce')
		//	});
		
		//This brings the clicked graph to the front. 
		for (var i=0; i<data.length;i++){
			graphs[i].click(function(){
			//Bring graphs forwards
			this.insertBefore(graphs[data.length]);	//the axis is always added last.
			//this.hide();
			})
		}	
	};//grapher()
	grapher();

}
