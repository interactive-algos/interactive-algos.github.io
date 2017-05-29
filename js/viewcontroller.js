var canvas; //The HTML Element of the canvas
var bgCanvas; //The HTML element of the background canvas
var robot;
var requestAnimationFrame;
//actual map data
var map;
var frameCount = 0;
var lastFrame;
var fps = 0;

//memter/pixel scale
var scale = 0.02;

//dimensions of the world, in meters
var width;
var height;

function isNumber(event)
{
	return event.charCode >= 48 && event.charCode <= 57;
}

function isDecimal(event)
{
	return isNumber(event) || event.charCode === 46;
}

function getSensorRadius()
{
	return Number(document.getElementById('fogOfWar').value);
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
        ctx.fillText(fps + " FPS", 10, 20);
        robot.update();
        robot.draw(ctx);

        // drawMap(map);
    }
	requestAnimationFrame(frame);
}

function drawMap(m)
{
	var ctx = bgCanvas.getContext('2d');
	ctx.strokeStyle = 'black';
	for (var i = m.length - 1; i >= 0; i--)
	{
		var l = m[i];
		ctx.beginPath();
		ctx.moveTo(l.s.x, l.s.y);
		ctx.lineTo(l.t.x, l.t.y);
		ctx.stroke();
	}
}

function init()
{
	canvas = document.getElementById('canvas');
	width = canvas.width * scale;
	height = canvas.height * scale;

	bgCanvas = document.getElementById('background');
	map = getMapForCanvas(canvas);
	drawMap(map);
	var ctx = canvas.getContext('2d');
	Robot.sensorRadius = getSensorRadius();
	Robot.stride = getValue('goByOneStep');
	robot = new Robot(random()*width, random()*height, random() * Math.PI * 2, new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise()));
	robot.draw(ctx);
    requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;
    lastFrame = Date.now();
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

function getValue(id)
{
    return Number(document.getElementById(id).value);
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
function convertX(x)
{
    return floor(x/scale);
}

//convert y coordinate in world to y coordinate on screen
function convertY(y)
{
    return floor(canvas.height - y/scale);
}