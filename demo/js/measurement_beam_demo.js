function BeamModelDemo(id, map, sensorRadius, sensorNoise, miniId)
{
	//Visualization stuff
	const nLasers = 19;
	this.scale = 50;

	//the canvas element
	this.view = new View(document.getElementById(id), this.scale);

	this.miniView = new View(document.getElementById(miniId), this.scale);
	this.miniView.setPreviewScale(map);

	this.robotSize = 0.2;
	this.map = map;
	this.z = new Array(nLasers);
	this.tracker = new ParticleTracker();
	this.resolution = 10;
	this.shouldColor = false;
	this.isCalculating = false;

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
	this.updateRender();
	this.drawSmall();
}

Object.defineProperties(BeamModelDemo.prototype, {
	"sensorRadius":{
		get: function(){return this.sensorModel.sensorRadius},
		set: function(r){
			if (r === this.sensorRadius)
				return;
			this.sensorModel.sensorRadius = r;
			this.updateRender();
		}
	},
	"sensorNoise":{
		get: function () {return this.sensorModel.a1},
		set: function(p) {
			if (this.sensorModel.a1 === p)
				return;
			this.sensorModel.a1 = p;
			this.updateRender();
		}
	}
});

BeamModelDemo.prototype.miniViewMouseOut = function (event)
{
	this.drawSmall();
};

BeamModelDemo.prototype.miniViewMouseMove = function (event)
{
	const w = this.view.width;
	const h = this.view.height;
	const view = this.miniView;
	let coor = getClickLoc(event);

	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	this.drawSmall();
	view.ctx.drawRect(x - w/2, y - h/2, x + w/2, y + h/2);
};

BeamModelDemo.prototype.miniViewMouseDown = function (event)
{
	const view = this.miniView;
	let coor = getClickLoc(event);

	this.curX = view.toWorldX(coor.x);
	this.curY = view.toWorldY(coor.y);

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

	this.view.canvas.onmousemove = (event) => {return this.largeViewMouseMove(event)};
	this.view.canvas.onmouseup = (event) => {return this.largeViewMouseUp(event)};
	this.view.canvas.onmouseout = this.view.canvas.onmouseup;

	this.draw();
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
	this.updateRender();
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
	const w = this.view.width;
	const h = this.view.height;

	ctx.fillStyle = 'rgba(180,180,180,0.5)';
	ctx.fillRect(this.curX - w / 2, this.curY - h / 2, w, h);
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
	scan(this.x, this.y, this.dir, this.sensorModel.sensorRadius, this.map, this.z);
	for (let i = 0; i < this.z.length; i++)
	{
		if (this.z[i] < this.sensorModel.sensorRadius)
		{
			this.z[i] = gaussian(this.z[i], this.sensorModel.a1);
			if (this.z[i] < 0) this.z[i] = 0;
		}
	}
};

BeamModelDemo.prototype.setNLasers = function (n)
{
	if (this.z.length === n + 1)
		return;
	this.z = new Array(n + 1);
	this.updateRender();
};

BeamModelDemo.prototype.updateRender = function()
{
	this.update();
	this.draw();
	this.drawLaserLines();
};

BeamModelDemo.prototype.drawLaserLines = function ()
{
	this.view.ctx.drawLaserLines(this.z, this.x, this.y, this.dir, this.sensorModel.sensorRadius, true);
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
