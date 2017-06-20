var canvas; //The HTML Element of the canvas
var bgCanvas; //The HTML element of the background canvas
var robot;

//actual map data
var map;
var frameCount = 0;
var lastFrame;
var fps = 0;

var requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;

var animating = false;
var shouldColorMap = false;

//dimensions of the world, in meters
//Robots are using world coordinates internally
//positive y is up, positive x is right
//bottom left is the origin
var width;
var height;

//Path that is currently recording
var path = [];

//All known path
var knownPath = {};

//HTML element of the select path
var pathSelect;

//HTML element of the custom select group
var customPathGroup;

var alphanumericRE = new RegExp('^[a-zA-Z0-9]+$');

function frame(timestamp)
{
	frameCount++;
	if (frameCount % 2 === 0)
	{
		fps = Math.round(1000.0 / (timestamp - lastFrame));
		lastFrame = timestamp;

		var ctx = canvas.getContext('2d');
		/*
		 ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		 ctx.fillRect(0, 0, canvas.width, canvas.height);
		 */
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeTextWithColorFont(fps + " FPS", 'black', '10px Menlo');

		robot.update();
		robot.draw(ctx);

		if (shouldColorMap)
		{
			colorMap(ctx, getValue('colorRes'));
		}
	}
	if (animating)
		requestAnimationFrame(frame);
}

function colorMap(ctx, resolution)
{
	var probabilityGrid = robot.filter.sensorModel.calcProbGrid(resolution,
		robot.dir, robot.getSensorReading(), canvas.width, canvas.height);

	for (var i = 0; i < probabilityGrid.length; i++)
	{
		for (var j = 0; j < probabilityGrid[i].length; j++)
		{
			var p = probabilityGrid[i][j];
			ctx.fillStyle = 'rgba(' + round(p * 255) + ', 0, ' + (255 - round(p * 255)) + ', 0.5)';
			ctx.fillRect(toScreenX(j * resolution), toScreenY(i * resolution), resolution / scale, resolution / scale);
		}
	}
}

function selectPath(event)
{
	var selectedOption = event.target.selectedOptions[0];
	if (selectedOption.id === 'addPath')
	{
		startRecordingPath();
	} else
	{
		var selectedPath = selectedOption.value;
		clearCanvas(canvas);
		var ctx = canvas.getContext('2d');
		ctx.strokeStyle = 'green';
		ctx.strokePath(knownPath[selectedPath]);
	}
}

function mouseMotion(event)
{
	var coor = getClickLoc(event);
	var ctx = canvas.getContext('2d');
	var lastPoint = path[path.length - 1];

	var m = getMapForCanvas(canvas);
	var untkingPath = new Line(toScreenX(lastPoint.x), toScreenY(lastPoint.y), coor.x, coor.y);

	for (var i = 0; i < m.length; i++)
	{
		var map_line = m[i];

		if (doIntersect(map_line.s, map_line.t, getWorldCoor(untkingPath.s), getWorldCoor(untkingPath.t)))
		{
			return;
		}
	}

	ctx.strokeStyle = 'red';
	ctx.strokeLine(lastPoint.x, lastPoint.y, toWorldX(coor.x), toWorldY(coor.y));
	toWorldCoor(coor);
	path.push(coor);
}

function mouseDown(event)
{
	var coor = getClickLoc(event);
	toWorldCoor(coor);

	path.push(coor);
	bgCanvas.onmousemove = mouseMotion;
	bgCanvas.onmouseup = mouseUp;
	bgCanvas.onmouseout = mouseUp;
	clearCanvas(canvas);
}

function mouseUp(event)
{
	bgCanvas.onmousemove = undefined;
	bgCanvas.onmouseup = undefined;
	bgCanvas.onmouseout = undefined;
	bgCanvas.onmousedown = undefined;

	clearCanvas(canvas);

	var pathName;
	var coor = getClickLoc(event);
	toWorldCoor(coor);
	path.push(coor);

	var msg = "Enter a unique name for this path, alphanumeric please:";

	while (true)
	{
		pathName = prompt(msg, "Harry Potter");

		if (pathName === null)
		{
			pathSelect.selectedIndex = 0;
			refreshSelect();
			return;
		}

		//No duplicate name!
		if (pathName in knownPath)
		{
			msg = 'Name must be unique!';
			continue;
		}

		//Must be alphanumeric
		if (pathName.match(alphanumericRE))
			break;
		msg = 'Name must be alphanumeric!';
	}
	smoothenPath(path);
	knownPath[pathName] = path;
	printPath(path);
	var option = document.createElement("option");
	option.text = pathName;
	customPathGroup.append(pathName, option);
	pathSelect.selectedIndex = pathSelect.length - 1;
	refreshSelect();
}

function startRecordingPath()
{
	clearCanvas(bgCanvas);
	width = canvas.width * scale;
	height = canvas.height * scale;
	rcOffsetX = width / 2;
	rcOffsetY = height / 2;
	map = getMapForCanvas(canvas);

	console.log(rcOffsetX + " " + rcOffsetY);
	bgCanvas.getContext('2d').drawMap(map);

	console.log("start recording...");
	animating = false;
	clearCanvas(canvas);
	var ctx = canvas.getContext('2d');
	ctx.font = '15px Menlo';
	ctx.strokeStyle = 'black';
	ctx.textAlign = 'center';
	ctx.strokeText('Start drawing a path here', canvas.width / 2, canvas.height / 2);
	bgCanvas.onmousedown = mouseDown;
	path = [];
}

function init()
{
	canvas = document.getElementById('canvas');
	pathSelect = document.getElementById('path');
	bgCanvas = document.getElementById('background');
	customPathGroup = document.getElementById('customPathGroup');

	map = getMapForCanvas(canvas);
	console.log(rcOffsetX + " " + rcOffsetY);

	setPreview(true);

	width = canvas.width * scale;
	height = canvas.height * scale;
	rcOffsetX = width / 2;
	rcOffsetY = height / 2;
	bgCanvas.getContext('2d').drawMap(map);
	bgCanvas.onmousedown = queryProbability;

	smoothenPath(vanillaPath);

	// for(var i = 0; i < vanillaPath.length; i ++)
	// {
	// 	vanillaPath[i].x = toWorldX(vanillaPath[i].x);
	// 	vanillaPath[i].y = toWorldY(vanillaPath[i].y);
	// }

	knownPath['Vanilla'] = vanillaPath;

	var selectedPath = pathSelect.value;
	clearCanvas(canvas);
	var ctx = canvas.getContext('2d');
	ctx.strokeStyle = 'green';
	ctx.strokePath(knownPath[selectedPath]);

	Robot.sensorRadius = getSensorRadius();
	Robot.stride = getValue('goByOneStep');
}

function stop()
{
	animating = !animating;
	if (animating)
	{
		requestAnimationFrame(frame);
	}
}

function stepForward()
{
	animating = false;
	frameCount = -1;
	requestAnimationFrame(frame);
}

function toggleColoring(event)
{
	var target = event.target || event.srcElement;
	shouldColorMap = target.checked;
}

function parameterChanged(event)
{
	var target = event.target;
	var value = Number(event.target.value);
	if (target.id === 'robotForwardNoise')
	{
		robot.setStrideNoise(value / 100.0);
	} else if (target.id === 'robotTurnNoise')
	{
		robot.setTurnNoise(value);
	} else if (target.id === 'goByOneStep')
	{
		Robot.stride = value;
	} else if (target.id === 'robotSenseNoise')
	{
		robot.filter.sensorModel.a1 = value;
	} else if (target.id === 'pRatio')
	{
		robot.filter.resampleRatio = value;
	} else if (target.id === 'fogOfWar')
	{
		Robot.sensorRadius = value;
	}
}

function printPath(path)
{
	var str = '{\n';
	str += "[x: " + path[0].x + ", y:" + path[0].y + "}";
	for (var i = 1; i < path.length; i++)
	{
		str += ",\n{x: " + path[i].x + ", y:" + path[i].y + "}";
	}

	str += '\n]';
	console.log(str);
}

function queryProbability(event)
{
	var coor = getClickLoc(event);
	var x = coor.x;
	var y = coor.y;

	if (event.altKey)
	{
		var probability = robot.filter.sensorModel.probability(
			robot.getSensorReading(),
			new RobotState(toWorldX(x), toWorldY(y), robot.dir));

		document.getElementById('probability').innerHTML = "Probability: " + probability;
		console.log('(' + x + ', ' + y + '): ' + probability);
	}
}

// Robot.prototype.draw = function(ctx)
// {
//     ctx.strokeStyle = 'black';

//     var x = toScreenX(this.x);
//     var y = toScreenY(this.y);

//     ctx.drawRobot(x, y, -this.dir, Robot.size/scale);

//     ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';

//     //draw Robot's sensing circle
//     ctx.strokeCircle(x, y, this.senseCircle/scale);

//     this.filter.draw(ctx);
// };

// Particle.prototype.draw = function(ctx)
// {
//     var x = toScreenX(this.x);
//     var y = toScreenY(this.y);

//     // ctx.strokeStyle = 'rgba('+ 255-this.w*255 +','+ 255-this.w*255 +', 255, 1)';

//     ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
//     ctx.drawRobot(x, y, -this.dir, Particle.size/scale);
// };
