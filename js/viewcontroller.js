var canvas; //The HTML Element of the canvas
var robot;
var requestAnimationFrame;
function isNumber(event)
{
	return event.charCode >= 48 && event.charCode <= 57;
}

function isDecimal(event)
{
	return isNumber(event) || event.charCode == 46;
}

function getSensorRadius()
{
	return Number(document.getElementById('fogOfWar').value);
}

function frame(timestamp)
{
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	robot.update()
	robot.draw(ctx);
	requestAnimationFrame(frame);
}

function init()
{
	canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	Robot.sensorRadius = getSensorRadius();
	robot = new Robot(getRandomInt(0, canvas.width), getRandomInt(0, canvas.height), Math.random() * Math.PI * 2);
	robot.draw(ctx);
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	requestAnimationFrame(frame);
}

function parameterChanged(event)
{
	console.log(event);
	var target = event.target;
	let value = Number(event.target.value);
	if(target.id == 'robotForwardNoise')
	{
		robot.setStrideNoise(value);
	}else if(target.id = 'robotTurnNoise')
	{
		robot.setTurnNoise(value);
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

function clearCanvas(canvas)
{
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}