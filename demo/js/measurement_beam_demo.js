function BeamModelDemo(id, map, sensorRadius, sensorNoise, miniId)
{
	//Visualization stuff
	const nLasers = 19;
	const scale = 20;

	//the canvas element
	this.view = new View(document.getElementById(id), scale);
	this.view.setPreviewScale(map);
	this.worldHeight = this.view.toWorldY(0);
	this.worldWidth = this.view.toWorldX(this.view.canvas.width);

	this.miniView = new View(document.getElementById(miniId), scale);
	this.miniView.setPreviewScale(map);


	this.robotSize = 0.2;
	this.map = map;
	this.z = new Array(nLasers);
	this.tracker = new ParticleTracker();
	this.resolution = 10;
	this.shouldColor = false;
	this.isCalculating = false;
	this.viewUnlocked = true;

	//Initial robot pose
	this.x = random() * this.view.width;
	this.y = random() * this.view.height;
	this.dir = random() * TWO_PI;
	//cursor position in world
	this.curX = this.view.width / 2;
	this.curY = this.view.height / 2;

	//Math model used for likelihood calculation
	this.sensorModel = new BeamModel(sensorNoise, sensorRadius, map);
	this.sensorRadius = sensorRadius;

	//Event listeners
	const self = this;
	this.view.canvas.onmousedown = function (event)
	{
		return self.mouseDown(event)
	};
	this.view.canvas.onmousemove = function (event)
	{
		return self.trackPosition(event)
	};
	this.view.canvas.onmouseout = function (event)
	{
		return self.mouseOut(event)
	};

	this.miniView.canvas.onmousedown = function (event)
	{
		return self.zoomInArea(event)
	};

	this.miniView.canvas.onmousemove = function (event)
	{
		return self.trackZoomInArea(event)
	};
	this.miniView.canvas.onmouseout = function (event)
	{
		return self.mouseOutMini(event)
	};

	this.manager = new ColorizeManager(this.view, function (p)
	{
		const ctx = self.view.ctx;
		const barWidth = 100;
		const barHeight = 20;
		const width = self.view.canvas.width;
		const height = self.view.canvas.height;
		self.isCalculating = true;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		// ctx.strokeRect(width / 2 - barWidth - 2, height / 2 - barHeight / 2, barWidth, barHeight);
		// ctx.fillRect(width / 2 - barWidth - 2, height / 2 - barHeight / 2, barWidth * p, barHeight);
		ctx.strokeStyle = 'rgba(0,0,255,0.5)';
		ctx.strokeRect(0, height - barHeight, width, barHeight);
		ctx.fillRect(0, height - barHeight, width * p, barHeight);
		ctx.restore();
	}, function (probs, resolution)
	{
		self.isCalculating = false;
		self.draw();
		self.drawLaserLines();
		self.view.drawProbabilityGrid(probs, resolution);
	});

	this.miniView.ctx.drawMap(self.map);
	this.update();
	this.draw();
	this.drawLaserLines();
	this.drawSmall();
}

BeamModelDemo.prototype.mouseOutMini = function (event)
{
	this.drawSmall();
};

BeamModelDemo.prototype.trackZoomInArea = function (event)
{
	const h = 8;
	const w = 14;
	const self = this;
	const view = this.miniView;
	var coor = getClickLoc(event);

	// const x = view.toWorldX(coor.x);
	// const y = view.toWorldY(coor.y);
	var x = view.toWorldX(coor.x);
	var y = view.toWorldY(coor.y);

	this.drawSmall();
	view.ctx.drawRect(x - w, y - h, x + w, y + h);


};

BeamModelDemo.prototype.zoomInArea = function (event)
{
	const h = 8;
	const w = 14;
	const self = this;
	const view = this.miniView;
	var coor = getClickLoc(event);

	// const x = view.toWorldX(coor.x);
	// const y = view.toWorldY(coor.y);
	self.curX = view.toWorldX(coor.x);
	self.curY = view.toWorldY(coor.y);

	self.viewUnlocked = false;
	self.view.setScale(20);
	self.view.recenter(self.curX, self.curY);
	self.drawSmall();
	self.draw();
	self.drawLaserLines();
	self.colorMapIfShould();
};


BeamModelDemo.prototype.mouseDown = function (event)
{
	if (this.isCalculating)
		return;
	//Shorthand for this.view and this.ctx
	const view = this.view;
	var coor = getClickLoc(event);

	// const x = view.toWorldX(coor.x);
	// const y = view.toWorldY(coor.y);
	var x = view.toWorldX(coor.x);
	var y = view.toWorldY(coor.y);

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
		this.view.ctx.fillTextWithColorFont('probability: ' + w, 'black', '20px Menlo Regular', 10, 20);
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

	this.draw();
};

BeamModelDemo.prototype.trackPosition = function (event)
{
	return;
	// if (this.isCalculating || !this.viewUnlocked)
	// 	return;
	// const view = this.view;
	// const self = this;
	// const coor = getClickLoc(event);
	// const x = coor.x;
	// const y = this.view.canvas.height - coor.y;
	// self.curX = x / this.view.canvas.width * this.worldWidth;
	// self.curY = y / this.view.canvas.height * this.worldHeight;
	//
	// view.setScale(30);
	// this.view.recenter(self.curX, self.curY);
	// // view.canvas.getContext('2d').fillRect(0,0,view.canvas.width,view.canvas.height);
	// this.drawSmall();
	// this.draw();
	// this.drawLaserLines();
};

BeamModelDemo.prototype.trackDirection = function (event)
{
	if (this.isCalculating)
		return;
	const view = this.view;
	const coor = getClickLoc(event);
	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	this.dir = atan2(y - this.y, x - this.x);
	this.draw();
};

BeamModelDemo.prototype.mouseUp = function (event)
{
	if (this.isCalculating)
		return;
	const self = this;
	this.view.canvas.onmousemove = function (event)
	{
		return self.trackPosition(event);
	};
	this.view.canvas.onmouseup = undefined;
	this.tracker.clear();
	this.update();
	this.draw();
	this.drawLaserLines();
	this.colorMapIfShould();
};

BeamModelDemo.prototype.mouseOut = function (event)
{
	if (this.isCalculating || !this.viewUnlocked)
		return;

	const self = this;
	this.view.setPreviewScale(this.map);
	this.view.setOffset(0, this.view.canvas.height);
	this.draw();
	this.drawLaserLines();
	this.colorMapIfShould();
};

BeamModelDemo.prototype.draw = function ()
{
	this.drawLarge();
};

BeamModelDemo.prototype.drawSmall = function ()
{
	clearCanvas(this.miniView.canvas);
	const ctx = this.miniView.ctx;

	ctx.drawMap(this.map);
	if (this.curX !== undefined && this.curY !== undefined)
	{
		const h = 8;
		const w = 14;

		if (this.curX !== undefined && this.curY !== undefined)
		{
			ctx.fillStyle = 'rgba(180,180,180,0.5)';
			ctx.fillRect(this.curX - w, this.curY - h, 2 * w, 2 * h);
		}

		// ctx.drawRect(this.curX-w, this.curY-h, this.curX+w, this.curY+h);
	}
};

BeamModelDemo.prototype.drawLarge = function ()
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
	} else if (this.view.canvas.onmouseout)
	{
		//If user is moving its mouse, don't color the map, too expensive
		// this.view.colorMap(this.resolution, this.sensorModel, this.z, this.dir);
	}
};

BeamModelDemo.prototype.update = function ()
{
	//Only scan if location changed
	scan(this.x, this.y, this.dir, this.sensorRadius, this.map, this.z);
	for (var i = 0; i < this.z.length; i++)
	{
		if (this.z[i] < this.sensorRadius)
		{
			this.z[i] = generateGaussianNoise(this.z[i], this.sensorModel.a1);
		}
	}
};

BeamModelDemo.prototype.setNLasers = function (n)
{
	if (this.z.length === n + 1)
		return;
	this.z = new Array(n + 1);
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.setSensorRadius = function (r)
{
	if (r === this.sensorRadius)
		return;
	this.sensorRadius = r;
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.setSensorNoise = function (p)
{
	if (this.sensorModel.a1 === p)
		return;
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
	this.colorMapIfShould();
};

BeamModelDemo.prototype.setColoringResolution = function (resolution)
{
	this.resolution = resolution;
};

BeamModelDemo.prototype.colorMapIfShould = function ()
{
	if (this.shouldColor && !this.isCalculating)
		this.manager.start(this.resolution, this.sensorModel, this.z, this.dir);
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
};
