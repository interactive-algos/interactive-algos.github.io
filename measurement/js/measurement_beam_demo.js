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
	this.resolution = 10;
	this.shouldColor = false;

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
	//Shorthand for this.view and this.ctx
	const view = this.view;
	var coor = getClickLoc(event);

	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);
	if (event.altKey)
	{
		if (this.shouldColor)
			return;
		const resolution = this.resolution / this.view.scale;
		const w = this.sensorModel.probability(this.z,
			new RobotState(x - resolution / 2, y - resolution / 2, this.dir));
		this.tracker.addParticle(new Particle(x, y, this.dir, w));
		this.draw();
		this.drawLaserLines();
		this.view.ctx.strokeTextWithColorFont('probability: ' + w, 'black', '12 Menlo Regular');
		return;
	}

	cancelAnimationFrame(this.frameId);

	//update robot's location
	this.x = x;
	this.y = y;

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

	this.draw();
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
	this.tracker.clear();
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.draw = function ()
{
	clearCanvas(this.view.canvas);
	const ctx = this.view.ctx;
	ctx.drawMap(this.map);
	ctx.drawRobot(this.x, this.y, this.dir, this.robotSize);
	if (!this.shouldColor)
	{
		const resolution = this.resolution / this.view.scale;
		this.tracker.forEach(function (x, y, dir, w)
		{
			ctx.fillStyle = 'rgba(' + round(w * 255) + ', 0, ' + (255 - round(w * 255)) + ', 0.5)';
			ctx.fillRect(x - resolution / 2, y - resolution / 2, resolution, resolution);
		});
	} else
	{
		//If user is moving its mouse, don't color the map, too expensive
		if (this.view.canvas.onmousemove)
			return;
		this.view.colorMap(this.resolution, this.sensorModel, this.z, this.dir);
	}
};

BeamModelDemo.prototype.update = function ()
{
	//Only scan if location changed
	scan(this.x, this.y, this.dir, this.sensorRadius, this.map, this.z);
	for (var i = 0; i < this.z.length; i++)
	{
		this.z[i] += gaussian() * this.sensorModel.a1;
	}
};

BeamModelDemo.prototype.setNLasers = function (n)
{
	this.z = new Array(n);
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.setSensorRadius = function (r)
{
	this.sensorRadius = r;
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.setSensorNoise = function (p)
{
	this.sensorModel.a1 = p;
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.drawLaserLines = function ()
{
	this.view.ctx.drawLaserLines(this.z, this.x, this.y, this.dir, this.sensorRadius);
};

BeamModelDemo.prototype.setColoring = function (shouldColor)
{
	this.shouldColor = shouldColor;
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.setColoringResolution = function (resolution)
{
	this.resolution = resolution;
	this.draw();
	this.drawLaserLines();
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
	this.maxW = max(particle.w, this.maxW);
	this.minW = min(particle.w, this.minW);
};

ParticleTracker.prototype.forEach = function (callback)
{
	const minW = this.minW;
	const maxW = this.maxW;
	{
		if (this.particles.length === 1)
		{
			const p = this.particles[0];
			callback(p.x, p.y, p.dir, p.w);
		} else if (this.particles.length)
		{
			this.particles.forEach(function (p)
			{
				callback(p.x, p.y, p.dir, (p.w - minW) / (maxW - minW));
			});
		}
	}
};