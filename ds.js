//Farid Rener
//farid.rener@mail.mcgill.ca
//MUMT 502

//TODO: Fix colours: Fill array with Raphael.getColor() for the length of data.length
//Read from the csv file. should have axis labels as the first line. 

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
       
//        var data = CSVToArray(loadData("instruments.csv"));
//        var names;
//        for (var i=1; i<data.length; i++) {names = data[i][0];}
       var colours = ['#3b14e0', '#7c9a2d', '#e89430','#744dd9', '#4fc3e0','#599123'];
	
	//Group of elements
	var graphs = paper.set();
	var controlButtons = paper.set();

	var cButtoncoord = 50;
//******************************************************************************************************
//					FUNCTION DECLARATIONS
//******************************************************************************************************
function graph(toGraph, controlID){
       //for(var i=0; i<toGraph.length; j++){
	      var firstPoint = '';
	      var point = '';
	      var datum = toGraph;
	      
	      for(var j = 0; j<datum.length; j++){
		     var nextCoordx = (dimensions[0]* Math.sin(2*Math.PI*j/nAxis));
		     var nextCoordy = (dimensions[1]* Math.cos(2*Math.PI*j/nAxis));
		     //plot points.
		     var pointx = datum[j]*nextCoordx+'';
		     var pointy = datum[j]*nextCoordy+'';
		     nextCoordx = nextCoordx+''
		     nextCoordy = nextCoordy+''
		     if (j==0) //grab the first data point to close the loop. 
			    {firstPoint = pointx + ' ' + pointy;}
		     else{
		     point = point + 'L' + pointx + ' '+ pointy;}
		     
	      }
	      point = 'M'+firstPoint + point + 'z';//'L' + firstPoint;
	      var aNewGraph = paper.path(point).attr({fill:Raphael.getColor(), translation:dimensionsSVG , stroke: '#ddd', 'stroke-width': 8, opacity: 0.5});
	      aNewGraph.id = controlID;
	      graphs.push(aNewGraph).insertBefore(graphs[0]);
	      graphs.click(function(){this.insertBefore(graphs[0])
	      });	
}
function drawAxis(){
       var axis = '';
       for (var i=0; i<nAxis; i++){
	      var nextCoordx = (dimensions[0]* Math.sin(2*Math.PI*i/nAxis));
	      var nextCoordy = (dimensions[1]* Math.cos(2*Math.PI*i/nAxis));
	      nextCoordx = nextCoordx+'';
	      nextCoordy = nextCoordy+'';
	      axis = axis + 'M 0 0 l' + nextCoordx + ' '+ nextCoordy;
       }
       graphs.push(paper.path(axis).attr({stroke:'#796d5f', 'stroke-width': 1.5, translation: dimensionsSVG}));
}
function hideGraph(indexToHide){
       for (var i=1;i<graphs.length;i++)
       {
	      if (graphs[i].id == indexToHide)
		     graphs[i].hide();
       }
}
function showGraph(indexToShow){
       for (var i=1;i<graphs.length;i++)
       {
	      if (graphs[i].id == indexToShow)
		     graphs[i].show();
       }
}
//******************************************************************************************************
//					END FUNCTION DECLARATIONS
//******************************************************************************************************


//draw the control circles.
	for (var i = 0; i<data.length; i++){
		var scratch = paper.circle(50,cButtoncoord,10).attr({fill: Raphael.getColor(), opacity: '0.5'});
		scratch.id = i;
		scratch.show = false;
		scratch.firstClick = false;
		controlButtons.push(scratch)
		paper.text(90,cButtoncoord,names[i]).attr({fill: colours[i]});
		cButtoncoord+=20;
	}

	controlButtons.click(function(){
		if (this.firstClick == false){
			    graph(data[this.id],this.id);
			    this.firstClick=true;
			    this.show = true;
			    this.attr({opacity: 0.75});   
		}
		else{
		     if (this.show == false){
			    this.attr({opacity: 0.75});
			    //graphs[this.id].show();
			    showGraph(this.id);
			    this.show = true;
			    }
		     else{
			    this.attr({opacity: 0.5});
			    hideGraph(this.id);
			    //graphs[this.id].hide();
			    this.show=false;
		     }
		}
	})
	drawAxis();
	
	
}

// function grapher(graphing){
// //Graph all the graphs, then hide them. 
// 	      var axis = '';
// 		for (var j=0; j<graphing.length; j++){
// 			var ther = '';
// 			var ther1 = '';
// 			var datum = graphing[j];
// 			for (var i=0; i<graphing[j].length; i+=1){
// 				var nextCoordx = (dimensions[0]* Math.sin(2*Math.PI*i/nAxis));
// 				var nextCoordy = (dimensions[1]* Math.cos(2*Math.PI*i/nAxis));
// 				//plot points.
// 				var pointx = datum[i]*nextCoordx+'';
// 				var pointy = datum[i]*nextCoordy+'';
// 	
// 				nextCoordx = nextCoordx+''
// 				nextCoordy = nextCoordy+''
// 
// 				axis = axis + 'M 0 0 l' + nextCoordx + ' '+ nextCoordy;
// 				ther = ther + 'L' + pointx + ' '+ pointy;
// 				if (i ==1) //grab the first data point to close the loop. 
// 					{ther1 = ther;}
// 			}
// 		ther = 'M 0 0' + ther;
// 		graphs.push(paper.path(ther+ther1).attr({fill:colours[j]}));	
// 		}
// 	
// 		graphs.attr({translation:dimensionsSVG , stroke: '#ddd', 'stroke-width': 2, opacity: 0.5});
// 		
// 		//Hide the graphs
// 		graphs.hide();
// 		//Draw axis
// 		graphs.push(paper.path(axis).attr({stroke:'#796d5f', 'stroke-width': 1.5, translation: dimensionsSVG}));
// 		//Bring the clicked graph to the front. 
// 		graphs.click(function(){this.insertBefore(graphs[data.length]);	//the axis is always added last.
// 		})
// 	};//grapher()

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

//CSVToArray Author:
// 	Ben Nadel
// 	http://www.bennadel.com/index.cfm?dax=blog:1504.view
function CSVToArray( strData, strDelimiter ){
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
		strDelimiter = (strDelimiter || ",");
  
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
  
				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
  
				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);
  
  
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];
  
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
  
  
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){
  
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];
  
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
				){
  
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );
  
			}
  
  
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){
  
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);
  
			} else {
  
				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];
  
			}
  
  
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
  
		// Return the parsed data.
		return( arrData );
	}
