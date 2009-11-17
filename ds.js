//Farid Rener
//farid.rener@mail.mcgill.ca
//MUMT 502

//TODO: Link cossim'd list and full list. Add 'Clear All' button

window.onload = function() {
      var paper = new Raphael(document.getElementById('canvas_container'), 1000, 1000);
	
	var dimensions = [250, 250];
	var dimensionsSVG = dimensions[0]+' '+dimensions[1]+'';	//To centre the graph
	
	
	var similarityTable = document.getElementById('similarities');
	var controlTable = document.getElementById('control');

	var colours = new Array();
	var names = new Array();
	var axisnames = new Array();
	var data = new Array();
	var userInput = new Array(-1,-1,-1);
	var cossim = new Array();
	
	//Data loading etc.
	var csv = loadData("instruments.csv");
	var inputFile = CSVToArray(csv);
	var nAxis = inputFile[0].length - 1;
  	var nData = inputFile.length;
  	var nPoints = 5;	//This is the scaling value, i.e. if the maximum value used in Dimension Spaces anaysis was 5, this value would be 5. 
	
	//Display
	var graphs = {};
	var ticks = new Array();
		for (var i = 0; i<nAxis; i++){ticks[i] = new Array();}

	//Misc
	var ticksClicked=0;	//This allows only 1 tick per axis to be clicked.
	var firstComparison = true;	//Allows more than one cossim to be done without refreshing the page
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
	      var aNewGraph = paper.path(point).attr({fill:colours[controlID], translation:dimensionsSVG , stroke: '#ddd', 'stroke-width': 2, opacity: 0.5});
	      aNewGraph.id = controlID;
	      aNewGraph.mouseover(function(){tooltip.show(names[this.id],200);})
	      aNewGraph.mouseout(function(){tooltip.hide();})
	      graphs[controlID]=aNewGraph.insertBefore(graphs[0]).click(function(){this.insertBefore(graphs[0]);})
}
function drawTicks(){
	// There are 5 ticks per axis + origin... which we will ignore for now. 
	var scratch
	for(var j = 0; j<nAxis; j++){
		var nextCoordx = (dimensions[0]* Math.sin(2*Math.PI*j/nAxis));
		var nextCoordy = (dimensions[1]* Math.cos(2*Math.PI*j/nAxis));
		for(var i=1; i<6; i++){
			scratch = paper.circle(nextCoordx*i/5,nextCoordy*i/5,4).attr({fill: '#ddd', opacity: '0.5', translation: dimensionsSVG});
			scratch.axis = j;	//the axis the tick is on
			scratch.coord = i;	//the coordinate point

			ticks[j][i-1] = scratch.click(function(){
				if(userInput[this.axis] != -1)
				{
					ticks[this.axis][userInput[this.axis]*5-1].attr({opacity:0.5});	
					if(!firstComparison){ticksClicked++}
				}
				else {
					ticksClicked++
				}
				this.attr({opacity: 1});
				userInput[this.axis] = this.coord/nPoints;
				//once all the user input is no longer -1,
				if(ticksClicked >=3){
				//do the cosine similarity between the coordinates given and the dataset.
				for (var i=1;i<data.length-1;i++){
					cossim[i-1] = cosineSim(data[i],userInput)			
					//var x = similarityTable.insertRow(i)
					//var y = x.insertCell(0);
					//y.id = i
					//y.innerHTML = cossim[i-1];		
				}		
				var maxVals = new Array();
				var i = 1;
				maxVals[0] = cossim.max();
				cossim[maxVals[0][1]] = -1;
				while(cossim.max()[0] == maxVals[0][0]){
					maxVals[i] = cossim.max();
					cossim[maxVals[i][1]]=-1;										
					i++;
				}
				//document.write(maxVals);
				//display the names of the instruments that you want:
				for (var i=0; i<maxVals.length; i++){
					graph(data[maxVals[i][1]+1],maxVals[i][1]+1);			
					var x = similarityTable.insertRow(i)
					var y = x.insertCell(0);
					y.id = i
					y.innerHTML = "<font color = \"" + colours[maxVals[i][1]+1] +"\">" + names[maxVals[i][1]+1]+ "</font color>";		
					//paper.text(400,400+10*i,names[maxVals[i][1]+1]).attr({fill: '#ddd'});
				}
				ticksClicked = 0;
				firstComparison = false;}
			});
		}
	}
}

function drawAxis(){
      var axis = '';
      for (var i=0; i<nAxis; i++){
	      var nextCoordx = (dimensions[0]* Math.sin(2*Math.PI*i/nAxis));
	      var nextCoordy = (dimensions[1]* Math.cos(2*Math.PI*i/nAxis));
	      paper.text(nextCoordx+2,nextCoordy+2,axisnames[i]).attr({fill:'#796d5f', translation: dimensionsSVG});
	      nextCoordx = nextCoordx+'';
	      nextCoordy = nextCoordy+'';
	      axis = axis + 'M 0 0 l' + nextCoordx + ' '+ nextCoordy;
      }
      graphs[0] = paper.path(axis).attr({stroke:'#796d5f', 'stroke-width': 1.5, translation: dimensionsSVG});
}
function hideGraph(indexToHide){
      graphs[indexToHide].hide();
}
function showGraph(indexToShow){
      graphs[indexToShow].show();
}
function insertAtTop(indexToPlace){
	graphs[indexToPlace].insertBefore(graphs[0]);
}
function sortNumber(a, b)
{
//For the sorting algorithm:
//Gives highest to lowest. 
	return b-a;
}

//******************************************************************************************************
//					END FUNCTION DECLARATIONS
//******************************************************************************************************
//Fill colour array 
for (var i=1; i<inputFile.length; i++) {colours[i] = Raphael.getColor();}
//Fill Names array
      for (var i=1; i<inputFile.length; i++) 
      		{names[i] = inputFile[i][0];}
//Axis names
       for (var i=0; i<3; i++)
       		{axisnames[i] = inputFile[0][i+1]}
//Fill data array
	for (var i=1; i<inputFile.length; i++){
	var dataScratch= new Array();
	    for (var j=1; j<inputFile[0].length; j++){
		  dataScratch[j-1] = inputFile[i][j]/nPoints;  
	    }
	    data[i] = dataScratch;
	    //paper.text(400,280+10*i,data[i][1]).attr({fill: colours[i]});
	}

//Display the names of the graphs, with control
//We want to be able to click each name so that the graph is shown, click again to hide it. 
	for (var i = 1; i<inputFile.length-1; i++){
		var x = controlTable.insertRow(i)
		var y = x.insertCell(0);
		y.id = i
		y.show = false;
		y.firstClick = false;
		y.onclick = 
		(function(){
			if (this.firstClick == false){
				graph(data[this.id],this.id);
				this.firstClick=true;
				this.show = true;			
				}
			else{
				if (this.show == false){
				showGraph(this.id);
				this.show = true;
				insertAtTop(this.id);
				}
				else{
				hideGraph(this.id);
				this.show=false;
				}
			}
		})
		//on mouseover, show more information... 
//		y.onmouseover = function(){
//		}
//		y.onmouseout = function(){tooltip.hide();}
		y.innerHTML = "<font color = \"" + colours[i] +"\">" + names[i]+ "</font color>";
	}
	drawAxis();
	drawTicks();

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
	xhttp.overrideMimeType("text/csv");
	xhttp.send("");
	return xhttp.responseText; 
}

function dotproduct(a,b) {
	var n = 0;
	var lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += a[i] * b[i];

	return n;
}
function magnitude(a){
	//(sqrt(a[1]^2 + a[2]^2 +... + a[n]^2)
	var b = 0;
	for (var i=0;i<a.length;i++){
		b += a[i]*a[i];
	}
	return Math.sqrt(b);
}

function cosineSim(c,d){
	var cossim = dotproduct(c,d)/(magnitude(c)*magnitude(d))
	return (cossim);
}

Array.prototype.max = function() {
	var max = new Array();
	max[0] = this[0];
	max[1] = 0;	//this is the id of the maximum number in the array
	var len = this.length;
	for (var i = 1; i < len; i++) 
		if (this[i] > max[0]) {
			max[0] = this[i];
			max[1] = i;
		}
return max;
}


//Tooltip function by http://www.leigeber.com/author/michael/
var tooltip=function(){
	var id = 'tt';
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	var ie = document.all ? true : false;
	return{
		show:function(v,w){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
			}
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = w ? w + 'px' : 'auto';
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			tt.style.top = (u - h) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();


//CSVToArray 
//	Author:
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
