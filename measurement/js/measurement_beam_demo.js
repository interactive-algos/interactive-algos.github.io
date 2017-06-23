var canvas;

var robotX;
var robotY;

var robotSize = 10 * scale;
var senseRadius = 3;

var nLasers = 19;

var robotDir = 0;
var dirOffset = 0;

var sensorNoise = 0.0;

//Results of laser scan
var z = new Array(nLasers);

var sensorModel;

var map;

var clickedParticles = [];
var maxW = Number.NEGATIVE_INFINITY;
var minW = Number.POSITIVE_INFINITY;

var shouldColor;


function update()
{
	//Only scan if location changed
	console.log(senseRadius);
	scan(robotX, robotY, robotDir, senseRadius, map, z);
	shouldColor = document.getElementById('shouldColor');
	if(shouldColor.checked)
	{
		clearCanvas(canvas);
		canvas.getContext('2d').drawMap(map);
		colorMap();
	}
	clickedParticles = [];
}

function drawParticles(ctx, particles)
{
	if(particles.length === 1)
	{
		var p = particles[0];
		var w = p.w;
		ctx.fillStyle = 'rgba(' + round(w * 255) + ', 0, ' + (255 - round(w * 255)) + ', 0.5)';
		ctx.fillRect(toScreenX(p.x), toScreenY(p.y), getColoringResolution(), getColoringResolution());
	}else
	{
		particles.forEach(function(p)
		{
			var w = (p.w - minW)/(maxW-minW);
			ctx.fillStyle = 'rgba(' + round(w * 255) + ', 0, ' + (255 - round(w * 255)) + ', 0.5)';
			ctx.fillRect(toScreenX(p.x), toScreenY(p.y), getColoringResolution(), getColoringResolution());
		});
	}
}

function parameterChanged(event)
{
	var target = event.target || event.srcElement;

	if (target.id === 'sensorRadius')
	{
		senseRadius = Number(target.value);
	}
	else if (target.id === 'sensorNoise')
	{
		sensorNoise = Number(target.value);
		sensorModel.a1 = sensorNoise;
	}
	else if (target.id === 'nLasers')
	{
		nLasers = Number(target.value)+1;
		z = new Array(nLasers);
	}
}

function trackRobotDir(event)
{
	var coor = getClickLoc(event);
	var x = toWorldX(coor.x);
	var y = toWorldY(coor.y);

	robotDir = atan2(y - robotY, x - robotX);
	dirOffset = round(robotDir / Math.PI / 2 * (nLasers-1)*2);
	clearCanvas(canvas);
	canvas.getContext('2d').drawMap(map);
	canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, robotSize);
}

function mouseDown(event)
{
	var coor = getClickLoc(event);
	var x = toWorldX(coor.x);
	var y = toWorldY(coor.y);

	//Do nothing if it is not a left button event
	if (event.altKey && !shouldColor.checked)
	{
		var probability = sensorModel.probability(z, new RobotState(x, y, robotDir));
		document.getElementById('probability').innerHTML = probability;
		clickedParticles.push(new Particle(x, y, robotDir, probability));
		maxW = max(maxW, probability);
		minW = min(minW, probability);
		clearCanvas(canvas);
		var ctx = canvas.getContext('2d');
		drawParticles(ctx, clickedParticles);
		ctx.drawRobot(robotX, robotY, robotDir, robotSize);
		ctx.drawLaserLines(nLasers, robotX, robotY, dirOffset);
		return;
	}

	robotX = x;
	robotY = y;
	clearCanvas(canvas);
	canvas.getContext('2d').drawMap(map);
	canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, robotSize);
	canvas.onmousemove = trackRobotDir;
	canvas.onmouseout = mouseUp;
	canvas.onmouseup = mouseUp;
}

function mouseUp()
{
	canvas.onmousemove = undefined;
	canvas.onmouseout = undefined;
	canvas.onmouseup = undefined;
	update();
	canvas.getContext('2d').drawLaserLines(nLasers, robotX, robotY, dirOffset);
}

function init()
{
	canvas = document.getElementById('canvas');

	//Draw the map
	map = getMapForCanvas(canvas);
	setPreview(true);
	width = canvas.width * scale;
	height = canvas.height * scale;
	rcOffsetX = width / 2;
	rcOffsetY = height / 2;
	canvas.getContext('2d').drawMap(map);
	robotX = floor(random() * canvas.width);
	robotY = floor(random() * canvas.height);
	robotDir = random() * TWO_PI;
	dirOffset = round(robotDir / Math.PI / 2 * (nLasers-1)*2);

	update();

	sensorModel = new BeamModel(getSensorNoise(), getSensorRadius(), map,
		canvas.width * scale, canvas.height * scale);

	Particle.size = 0.2 / scale;

	//Listen to mouse click events
	canvas.onmousedown = mouseDown;
	senseRadius = getSensorRadius();
	sensorNoise = getSensorNoise();
}

function toggleColoring(event)
{
	var target = event.target || event.srcElement;
	if (target.checked)
	{
		colorMap();
	} else
	{
		clearColor();
	}
}

function colorMap()
{
	var ctx = canvas.getContext('2d');
	var resolution = getColoringResolution();
	var probabilityGrid = sensorModel.calcProbGrid(resolution, robotDir, z, canvas.width, canvas.height);

	for (var i = 0; i < probabilityGrid.length; i++)
	{
		for (var j = 0; j < probabilityGrid[i].length; j++)
		{
			var p = probabilityGrid[i][j];
			ctx.fillStyle = 'rgba(' + round(p * 255) + ', 0, ' + (255 - round(p * 255)) + ', 0.5)';
			ctx.fillRect(j * resolution, i * resolution, resolution, resolution);
		}
	}
}

function clearColor()
{
	clearCanvas(canvas);
	canvas.getContext('2d').drawMap(map);
}
