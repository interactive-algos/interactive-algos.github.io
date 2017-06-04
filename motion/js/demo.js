/**
 * Created by kelvinzhang on 5/30/17.
 */
var canvas; //The HTML Element of the canvas
var bgCanvas; //The HTML element of the background canvas
var robot;
var requestAnimationFrame;
//actual map data
var map;
var frameCount = 0;
var lastFrame;
var fps = 0;

//meter/pixel scale
var scale = 0.02;

var animating = false;

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

function getSensorRadius()
{
    return getValue('fogOfWar');
}

function refreshSelect()
{
    $('.selectpicker').selectpicker('refresh');
}

function frame(timestamp)
{
    frameCount++;
    if(frameCount % 2 === 0)
    {
        fps = Math.round(1000.0/(timestamp-lastFrame));
        lastFrame = timestamp;

        var ctx = canvas.getContext('2d');
        /*
         ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '10px Menlo';
        ctx.textAlign = 'start';
        ctx.fillText(fps + " FPS", 10, 20);
        robot.update();
        robot.draw(ctx);
    }
    if(animating)
        requestAnimationFrame(frame);
}

function selectPath(event)
{
    var selectedOption = event.target.selectedOptions[0];
    if(selectedOption.id === 'addPath')
    {
        startRecordingPath();
    }else
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
    var lastPoint = path[path.length-1];
    ctx.strokeStyle = 'red';
    ctx.strokeLine(toScreenX(lastPoint.x), toScreenY(lastPoint.y), coor.x, coor.y);
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

    while(true)
    {
        pathName = prompt(msg, "Harry Potter");

        if(pathName === null)
        {
            pathSelect.selectedIndex = 0;
            refreshSelect();
            return;
        }

        //No duplicate name!
        if(pathName in knownPath)
        {
            msg = 'Name must be unique!';
            continue;
        }

        //Must be alphanumeric
        if(pathName.match(alphanumericRE))
            break;
        msg = 'Name must be alphanumeric!';
    }
	smoothenPath(path);
    knownPath[pathName] = path;
    printPath(path);
    var option = document.createElement("option");
    option.text = pathName;
    customPathGroup.append(pathName, option);
    pathSelect.selectedIndex = pathSelect.length-1;
    refreshSelect();
}

function startRecordingPath()
{
    animating = false;
    clearCanvas(canvas);
    var ctx = canvas.getContext('2d');
    ctx.font = '15px Menlo';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.strokeText('Start drawing a path here', canvas.width/2, canvas.height/2);
    bgCanvas.onmousedown = mouseDown;
    path = [];
}

function init()
{
    canvas = document.getElementById('canvas');
    pathSelect = document.getElementById('path');
    bgCanvas = document.getElementById('background');
    customPathGroup = document.getElementById('customPathGroup');

    width = canvas.width * scale;
    height = canvas.height * scale;
    map = getMapForCanvas(canvas);
    bgCanvas.getContext('2d').drawMap(map);

	smoothenPath(vanillaPath);

    for(var i = 0; i < vanillaPath.length; i ++)
	{
		vanillaPath[i].x = toWorldX(vanillaPath[i].x);
		vanillaPath[i].y = toWorldY(vanillaPath[i].y);
	}

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
	if(animating)
	{
		requestAnimationFrame(frame);
	}
}

function stepForward()
{
	animating = false;
	requestAnimationFrame(frame);
}

function parameterChanged(event)
{
    console.log(event);
    var target = event.target;
    var value = Number(event.target.value);
    if(target.id === 'robotForwardNoise')
    {
        robot.setStrideNoise(value/100.0);
    }else if(target.id === 'robotTurnNoise')
    {
        robot.setTurnNoise(value/100.0);
    }else if(target.id === 'goByOneStep')
    {
        Robot.stride = value;
    }
}

function printPath(path)
{
    var str = '{\n';
    str += "[x: " + path[0].x + ", y:" + path[0].y + "}";
    for(var i = 1; i < path.length; i ++)
    {
        str += ",\n{x: " + path[i].x + ", y:" + path[i].y + "}";
    }

    str += '\n]';
    console.log(str);
}

function getParticleCount()
{
    return getValue('nParticles');
}

function getStrideNoise()
{
    return getValue('robotForwardNoise') / 100.0;
}

function getTurnNoise()
{
    return getValue('robotTurnNoise') / 100.0;
}


//convert x coordinate in world to x coordinate on screen
function toScreenX(x)
{
    return round(x/scale);
}

//convert x coordinate on screen to x coordinate in world
function toWorldX(x)
{
    return x*scale;
}

//convert y coordinate in world to y coordinate on screen
function toScreenY(y)
{
    return round(canvas.height - y/scale);
}

//convert y coordinate on screen to y coordinate in world
function toWorldY(y)
{
    return (canvas.height - y)*scale;
}

function toWorldCoor(coor)
{
	coor.x = toWorldX(coor.x);
	coor.y = toWorldY(coor.y);
}

Robot.prototype.draw = function(ctx)
{
    ctx.strokeStyle = 'black';

    var x = toScreenX(this.x);
    var y = toScreenY(this.y);

    ctx.drawRobot(x, y, -this.dir, Robot.size/scale);

    ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';

    //draw Robot's sensing circle
    ctx.strokeCircle(x, y, this.senseCircle/scale);

    this.filter.draw(ctx);
};

Particle.prototype.draw = function(ctx)
{
    var x = toScreenX(this.x);
    var y = toScreenY(this.y);

    ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.drawRobot(x, y, -this.dir, Particle.size/scale);
};


CanvasRenderingContext2D.prototype.strokePath = function(path)
{
	this.beginPath();
	this.moveTo(toScreenX(path[0].x), toScreenY(path[0].y));
	for(var i = 1; i < path.length; i ++)
	{
		this.lineTo(toScreenX(path[i].x), toScreenY(path[i].y));
	}
	this.stroke();
};