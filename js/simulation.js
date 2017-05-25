function getRandomInt(min, max) 
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}


function draw(event) 
{
	var canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// ctx.fillStyle = ctx.strokeStyle = 'rgba('+getRandomInt(0, 256) + ', ' + getRandomInt(0, 256) + ', ' + getRandomInt(0, 256)+', ' + (Math.random()/2+0.5) + ')';
		// ctx.fillRect(10, 10, 50, 50);

		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(event.x, event.y);
		ctx.stroke();
		// ctx.fillStyle = 'rgba('+getRandomInt(0, 256) + ', ' + getRandomInt(0, 256) + ', ' + getRandomInt(0, 256)+', ' + (Math.random()/2+0.5) + ')';
		// ctx.fillRect(30, 30, 50, 50);
	}
}

function clearCanvas(canvas)
{
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gaussian() 
{
	return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function drawParticles()
{
	var canvas = document.getElementById('canvas');
	var nParticles;
	if(document.getElementById('nParticles').value == '')
		nParticles = 500;
	else 
		nParticles = Number(document.getElementById('nParticles').value);

	console.log(nParticles);
	if (canvas.getContext) 
	{
		clearCanvas(canvas);
		var ctx = canvas.getContext('2d');
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

function isNumber(event)
{
	return event.charCode >= 48 && event.charCode <= 57;
}

function isDecimal(event)
{
	return isNumber(event) || event.charCode == 46;
}

function init()
{
	drawParticles();
}

