var canvas; //The HTML Element of the canvas
var bgCanvas; //The HTML element of the background canvas
var robot;
var requestAnimationFrame;
var map;
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

function frame()
{
	var ctx = canvas.getContext('2d');
	// ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	// ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	robot.update();
	robot.draw(ctx);
	// drawMap(map);
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
	bgCanvas = document.getElementById('background');
	map = getMapForCanvas(canvas);
	drawMap(map);
	var ctx = canvas.getContext('2d');
	Robot.sensorRadius = getSensorRadius();
	robot = new Robot(getRandomInt(0, canvas.width), getRandomInt(0, canvas.height), Math.random() * Math.PI * 2, new OdometryModel(getTurnNoise(), getStrideNoise(), getTurnNoise(), 0));
	robot.draw(ctx);
    requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;
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
	return Number(document.getElementById('nParticles').value);
}

function getStrideNoise()
{
	return Number(document.getElementById('robotForwardNoise').value) / 100.0;
}

function getTurnNoise()
{
	return Number(document.getElementById('robotTurnNoise').value) / 100.0;
}