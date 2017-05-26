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

function update(timestamp)
{
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	robot.draw(ctx);
	requestAnimationFrame(update);
}

function init()
{
	canvas = document.getElementById('canvas');
	// drawParticles(canvas);
	var ctx = canvas.getContext('2d');
	Robot.sensorRadius = getSensorRadius();
	robot = new Robot(getRandomInt(0, canvas.width), getRandomInt(0, canvas.height));
	robot.draw(ctx);
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	requestAnimationFrame(update);
}

function drawParticles(canvas)
{
	var nParticles;
	if(document.getElementById('nParticles').value == '')
		nParticles = 500;
	else 
		nParticles = Number(document.getElementById('nParticles').value);

	console.log(nParticles);
	if (canvas.getContext) 
	{
		var ctx = canvas.getContext('2d');
		clearCanvas(ctx);
		ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
		for(var i = 0; i < nParticles; i ++)
		{
			var x = (gaussian()/2+0.5) * canvas.width;
			var y = (gaussian()/2+0.5) * canvas.height;
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, Math.PI*2, 0);
			ctx.fill();
		}
	}
}

function clearCanvas(canvas)
{
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}