function BeamModelDemo(id, map, sensorRadius, sensorNoise, miniId)
{
	//Visualization stuff
	const nLasers = 19;
	this.scale = 20;

	//the canvas element
	this.view = new View(document.getElementById(id), this.scale);
	// this.view.setPreviewScale(map);
	this.worldHeight = this.view.toWorldY(0);
	this.worldWidth = this.view.toWorldX(this.view.canvas.width);

	this.miniView = new View(document.getElementById(miniId), this.scale);
	this.miniView.setPreviewScale(map);
	this.largePreviewScale = this.view.getPreviewScale(map);
	this.miniPreviewScale = this.miniView.getPreviewScale(map);
	console.log(this.largePreviewScale);
	console.log(this.miniPreviewScale);


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
	this.view.canvas.onmousedown = (event) => {return this.largeViewMouseDown(event)};

	this.miniView.canvas.onmousedown = (event) => {return this.miniViewMouseDown(event)};

	this.miniView.canvas.onmousemove = (event) => {return this.miniViewMouseMove(event)};

	this.miniView.canvas.onmouseout = (event) => {return this.miniViewMouseOut(event)};

	this.manager = new ColorizeManager(this.view, (p) =>
	{
		const ctx = this.view.ctx;
		const barHeight = 20;
		const width = this.view.canvas.width;
		const height = this.view.canvas.height;
		this.isCalculating = true;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.strokeStyle = 'rgba(0,0,255,0.5)';
		ctx.strokeRect(0, height - barHeight, width, barHeight);
		ctx.fillRect(0, height - barHeight, width * p, barHeight);
		ctx.restore();
	}, (probs, resolution) =>
	{
		this.isCalculating = false;
		this.draw();
		this.drawLaserLines();
		this.view.drawProbabilityGrid(probs, resolution);
	});

	this.miniView.ctx.drawMap(self.map);
	this.update();
	this.draw();
	this.drawLaserLines();
	this.drawSmall();
}

BeamModelDemo.prototype.miniViewMouseOut = function (event)
{
	this.drawSmall();
};

BeamModelDemo.prototype.miniViewMouseMove = function (event)
{
	// console.log(this.scale)
	// console.log((this.miniView.height * (this.largePreviewScale / this.scale)) * this.miniPreviewScale)
	const h = this.view.height * (this.largePreviewScale / this.scale) * this.miniPreviewScale;
	const w = this.view.width * (this.largePreviewScale / this.scale) * this.miniPreviewScale;
	const view = this.miniView;
	let coor = getClickLoc(event);

	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	this.drawSmall();
	view.ctx.drawRect(x - w, y - h, x + w, y + h);
};

BeamModelDemo.prototype.miniViewMouseDown = function (event)
{
	const view = this.miniView;
	let coor = getClickLoc(event);

	this.curX = view.toWorldX(coor.x);
	this.curY = view.toWorldY(coor.y);

	this.viewUnlocked = false;
	this.view.setScale(20);
	this.view.recenter(this.curX, this.curY);
	this.drawSmall();
	this.draw();
	this.drawLaserLines();
	this.colorMapIfShould();
};


BeamModelDemo.prototype.largeViewMouseDown = function (event)
{
	if (this.isCalculating)
		return;
	//Shorthand for this.view and this.ctx
	const view = this.view;
	let coor = getClickLoc(event);

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
		return self.largeViewMouseMove(event);
	};
	this.view.canvas.onmouseup = function (event)
	{
		return self.largeViewMouseUp(event);
	};

	this.draw();
};

BeamModelDemo.prototype.largeViewMouseMove2 = function (event)
{
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

BeamModelDemo.prototype.largeViewMouseMove = function (event)
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

BeamModelDemo.prototype.largeViewMouseUp = function (event)
{
	if (this.isCalculating)
		return;
	this.view.canvas.onmousemove = undefined;
	this.view.canvas.onmouseup = undefined;
	this.view.canvas.onmouseout = undefined;
	this.tracker.clear();
	this.update();
	this.draw();
	this.drawLaserLines();
	this.colorMapIfShould();
};

BeamModelDemo.prototype.largeViewMouseOut = function (event)
{
	if (this.isCalculating || !this.viewUnlocked)
		return;

	const self = this;
	// this.view.setPreviewScale(this.map);
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
		const h = this.view.height * (this.largePreviewScale / this.scale) * this.miniPreviewScale;
		const w = this.view.width * (this.largePreviewScale / this.scale) * this.miniPreviewScale;

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
	//Only draw particles if color map is not enabled
	if (!this.shouldColor)
	{
		const resolution = this.resolution / this.view.scale;
		this.tracker.forEach(function (x, y, dir, w)
		{
			ctx.fillStyle = 'rgba(' + round(w * 255) + ', 0, ' + (255 - round(w * 255)) + ', 0.5)';
			ctx.fillRect(x - resolution / 2, y - resolution / 2, resolution, resolution);
		});
	}
};

BeamModelDemo.prototype.update = function ()
{
	//Only scan if location changed
	scan(this.x, this.y, this.dir, this.sensorRadius, this.map, this.z);
	for (let i = 0; i < this.z.length; i++)
	{
		if (this.z[i] < this.sensorRadius)
		{
			this.z[i] = gaussian(this.z[i], this.sensorModel.a1);
			if(this.z[i] < 0)this.z[i] = 0;
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
	this.view.ctx.drawLaserLines(this.z, this.x, this.y, this.dir, this.sensorRadius, true);
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
		this.particles.forEach((p) =>
			callback(p.x, p.y, p.dir, (p.w - minW) / (maxW - minW))
		);
	}
};
