function BeamModelDemo(id, map, sensorRadius, sensorNoise)
{
	//Visualization stuff
	const nLasers = 19;

	//the canvas element
	this.view = new View(document.getElementById(id), 1);
	this.view.setPreviewScale(map);

	this.robotSize = 0.2;
	this.map = map;
	this.z = new Array(nLasers);
	this.tracker = new ParticleTracker();

	//Initial robot pose
	this.x = random() * this.view.width;
	this.y = random() * this.view.height;
	this.dir = random() * TWO_PI;

	//Math model used for likelihood calculation
	this.sensorModel = new BeamModel(sensorNoise, sensorRadius, map);
	this.sensorRadius = sensorRadius;

	//Event listeners
	const self = this;
	this.view.canvas.onmousedown = function (event)
	{
		return self.mouseDown(event)
	};
	this.view.ctx.drawMap(map);
}

BeamModelDemo.prototype.mouseDown = function (event)
{
	cancelAnimationFrame(this.frameId);
	//Shorthand for this.view and this.ctx
	const view = this.view;

	var coor = getClickLoc(event);
	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	//update robot's location
	this.x = x;
	this.y = y;

	this.draw();
	const self = this;
	this.view.canvas.onmousemove = function (event)
	{
		return self.trackDirection(event);
	};
	this.view.canvas.onmouseup = function (event)
	{
		return self.mouseUp(event);
	};
	this.view.canvas.onmouseout = this.view.canvas.onmouseup;
};

BeamModelDemo.prototype.trackDirection = function (event)
{
	const view = this.view;
	const coor = getClickLoc(event);
	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	this.dir = atan2(y - this.y, x - this.x);
	this.draw();
};

BeamModelDemo.prototype.mouseUp = function (event)
{
	this.view.canvas.onmousemove = undefined;
	this.view.canvas.onmouseout = undefined;
	this.view.canvas.onmouseup = undefined;
	this.update();
	this.view.ctx.drawLaserLines(this.z, this.x, this.y, this.dir);
};

BeamModelDemo.prototype.draw = function ()
{
	clearCanvas(this.view.canvas);
	const ctx = this.view.ctx;
	ctx.drawMap(this.map);
	ctx.drawRobot(this.x, this.y, this.dir, this.robotSize);
};

BeamModelDemo.prototype.update = function ()
{
	//Only scan if location changed
	scan(this.x, this.y, this.dir, this.sensorRadius, this.map, this.z);
};

BeamModelDemo.prototype.setNLasers = function(n)
{
	this.z = new Array(n);
	this.update();
	this.draw();
	this.view.ctx.drawLaserLines(this.z, this.x, this.y, this.dir);
};

function ParticleTracker()
{
	this.clear();
}

ParticleTracker.prototype.clear = function ()
{
	this.maxW = Number.NEGATIVE_INFINITY;
	this.minW = Number.POSITIVE_INFINITY;
	this.particles = [];
};

ParticleTracker.prototype.addParticle = function (particle)
{
	this.particles.push(particle);
	this.maxW = max(particle.w, maxW);
	this.minW = min(particle.w, minW);
};

ParticleTracker.prototype.forEach = function (callback)
{
	const minW = this.minW;
	const maxW = this.maxW;
	{
		if (this.particles.length === 1)
		{
			callback(this.particles[0].w);
		} else if (this.particles.length)
		{
			this.particles.forEach(function (p)
			{
				callback((p.w - minW) / (maxW - minW));
			});
		}
	}
};

var canvas;

var robotX;
var robotY;

var robotSize = 0.2;
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

var view;

function update()
{
	//Only scan if location changed
	console.log(senseRadius);
	scan(robotX, robotY, robotDir, senseRadius, map, z);
	shouldColor = document.getElementById('shouldColor');
	if (shouldColor.checked)
	{
		clearCanvas(canvas);
		canvas.getContext('2d').drawMap(map);
		colorMap();
	}
	clickedParticles = [];
}

function drawParticles(ctx, particles)
{
	const resolution = getColoringResolution();
	if (particles.length === 1)
	{
		var p = particles[0];
		var w = p.w;
		ctx.fillStyle = 'rgba(' + round(w * 255) + ', 0, ' + (255 - round(w * 255)) + ', 0.5)';
		ctx.fillRect(p.x - resolution / 2, p.y - resolution / 2, resolution, resolution);
	} else
	{
		particles.forEach(function (p)
		{
			var w = (p.w - minW) / (maxW - minW);
			ctx.fillStyle = 'rgba(' + round(w * 255) + ', 0, ' + (255 - round(w * 255)) + ', 0.5)';
			ctx.fillRect(p.x - resolution / 2, p.y - resolution / 2, resolution, resolution);
		});
	}
}

function parameterChanged(event)
{
	var target = event.target || event.srcElement;

	if (target.id === 'fogOfWar')
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
		nLasers = Number(target.value) + 1;
		z = new Array(nLasers);
	}
}

function trackRobotDir(event)
{
	var coor = getClickLoc(event);
	var x = view.toWorldX(coor.x);
	var y = view.toWorldY(coor.y);

	robotDir = atan2(y - robotY, x - robotX);
	dirOffset = round(robotDir / Math.PI / 2 * (nLasers - 1) * 2);
	clearCanvas(canvas);
	canvas.getContext('2d').drawMap(map);
	canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, robotSize);
}

function mouseDown(event)
{
	var coor = getClickLoc(event);
	var x = view.toWorldX(coor.x);
	var y = view.toWorldY(coor.y);

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
		ctx.drawMap(map);
		ctx.drawRobot(robotX, robotY, robotDir, robotSize);
		ctx.drawLaserLines(z, robotX, robotY, robotDir);
		drawParticles(ctx, clickedParticles);
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
	view.canvas.getContext('2d').drawLaserLines(z, robotX, robotY, robotDir);
}

function init()
{
	canvas = document.getElementById('canvas');
	view = new View(canvas, 1);

	//Draw the map
	map = getMap();
	view.setPreviewScale(map);
	canvas.getContext('2d').drawMap(map);
	robotX = floor(random() * canvas.width);
	robotY = floor(random() * canvas.height);
	robotDir = random() * TWO_PI;
	dirOffset = round(robotDir / Math.PI / 2 * (nLasers - 1) * 2);

	update();

	sensorModel = new BeamModel(getSensorNoise(), getSensorRadius(), map);

	Particle.size = 0.2;

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
	view.colorMap(getColoringResolution(), sensorModel, z, robotDir);
}

function clearColor()
{
	clearCanvas(view.canvas);
	view.canvas.getContext('2d').drawMap(map);
	view.canvas.getContext('2d').drawRobot(robotX, robotY, robotDir, robotSize);
	view.canvas.getContext('2d').drawLaserLines(z, robotX, robotY, robotDir);
}
