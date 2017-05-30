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


//dimensions of the world, in meters
//Robots are using world coordinates internally
//positive y is up, positive x is right
//bottom left is the origin
var width;
var height;

function getSensorRadius()
{
	return getValue('fogOfWar');
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

function init()
{
	canvas = document.getElementById('canvas');
	width = canvas.width * scale;
	height = canvas.height * scale;

	bgCanvas = document.getElementById('background');
	map = getMapForCanvas(canvas);
    bgCanvas.getContext('2d').drawMap(map);
	var ctx = canvas.getContext('2d');
	Robot.sensorRadius = getSensorRadius();
	Robot.stride = getValue('goByOneStep');
	var motionModel = new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), getTurnNoise());

	var x = random()*width;
	var y = random()*height;
	var dir = random()*Math.PI*2;

    var filter = new ParticleFilter(getParticleCount(), motionModel, new RobotState(x, y, dir));

	robot = new Robot(x, y, dir, filter);
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