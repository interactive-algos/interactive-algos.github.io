/**
 * Created by kelvinzhang on 6/29/17.
 */
function RobotDemo(lid, //Main Canvas id
				   sid, //Mini Canvas id
				   map,
				   robot,
				   colorRes)
{
	//the Large canvas elements
	this.largeCanvas = document.getElementById(lid);
	this.lctx = this.largeCanvas.getContext('2d');
	this.lview = new View(this.largeCanvas, 1);
	this.lview.setPreviewScale(map);

	//The Small canvas elements
	this.sview = new View(document.getElementById(sid), 1);
	this.sview.setPreviewScale(map);

	this.map = map;
	this.colorRes = colorRes;

	const self = this;
	this.manager = new ColorizeManager(this, function(p)
	{
		const ctx = self.lview.ctx;
		const barWidth = 100;
		const barHeight = 20;
		const width = self.canvas.width;
		const height = self.canvas.height;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.strokeRect(width/2 - barWidth-2, height/2 - barHeight/2, barWidth, barHeight);
		ctx.fillRect(width/2 - barWidth-2, height/2 - barHeight/2, barWidth*p, barHeight);
		ctx.restore();
	}, function(probs, resolution)
	{
		self.draw();
		self.lview.drawProbabilityGrid(probs, resolution);
	});

	//Robot
	this.robot = robot;

	//Other Properties
	this.animating = false;
	this.shouldColorMap = false;

	this.draw();
}

RobotDemo.prototype.start = function ()
{
	if (this.animating) return;

	this.animating = true;
	this.lview.setScale(50);
	const self = this;

	this.largeCanvas.onmousedown = function (event)
	{
		self.queryProbability(event);
	};

	this.lastFrame = Date.now();
	requestAnimationFrame(function (timestamp)
	{
		self.frame(timestamp);
	});
};

RobotDemo.prototype.frame = function (timestamp)
{
	var fps = Math.round(1000.0 / (timestamp - this.lastFrame));
	this.lastFrame = timestamp;

	this.robot.update();

	this.lview.adjustToPoint(this.robot.x, this.robot.y);

	this.draw();

	this.lctx.strokeTextWithColorFont(fps + "\tFPS", 'black', '10px Menlo', 10, 20);
	if (this.animating)
	{
		const self = this;
		requestAnimationFrame(function (timestamp)
		{
			self.frame(timestamp);
		});
	}
};

RobotDemo.prototype.stop = function ()
{
	if (this.animating)
	{ //Pause
		this.animating = false;
	} else
	{ //stop
		this.largeCanvas.onmousedown = undefined;
		this.lview.setPreviewScale(this.map);
		this.robot.reset();
		this.draw();
	}
};

RobotDemo.prototype.stepForward = function ()
{
	this.animating = false;
	const self = this;
	requestAnimationFrame(function (timestamp)
	{
		self.frame(timestamp);
	});
};

RobotDemo.prototype.draw = function ()
{
	this.drawView(this.lview);
	this.drawView(this.sview);
	if (this.shouldColorMap) this.colorMap();
};

RobotDemo.prototype.colorMap = function ()
{
	this.lview.colorMap(this.colorRes, this.robot.filter.sensorModel,
		this.robot.getSensorReading(), this.robot.dir);
};

RobotDemo.prototype.drawView = function (view)
{
	clearCanvas(view.canvas);
	const ctx = view.ctx;
	ctx.drawMap(this.map);
	ctx.strokeStyle = 'green';
	ctx.strokePath(this.robot.path);
	this.robot.draw(ctx);
};

//Setters
RobotDemo.prototype.setA1 = function (noise)
{
	this.robot.filter.motionModel.a1 = noise;
};
RobotDemo.prototype.setA2 = function (noise)
{
	this.robot.filter.motionModel.a2 = noise;
};
RobotDemo.prototype.setA3 = function (noise)
{
	this.robot.filter.motionModel.a3 = noise;
};
RobotDemo.prototype.setA4 = function (noise)
{
	this.robot.filter.motionModel.a4 = noise;
};

RobotDemo.prototype.setColoringResolution = function(res)
{
	this.colorRes = res;
};

RobotDemo.prototype.setColoring = function(bool)
{
	this.shouldColorMap = bool;
};

RobotDemo.prototype.setParticleCount = function (n)
{
	this.robot.filter = new ParticleFilter(n,
		this.robot.filter.motionModel,
		this.robot.filter.sensorModel,
		this.robot.getState(),
		this.robot.filter.resampleRatio);
};

RobotDemo.prototype.setStride = function (stride)
{
	this.robot.stride = stride;
};

RobotDemo.prototype.setSensorRadius = function(r)
{
	this.robot.setSensorRadius(r);
};

RobotDemo.prototype.setSensorNoise = function(r)
{
	this.robot.filter.sensorModel.a1 = r;
};

function printPath(path)
{
	var str = '{\n';
	str += "[x: " + path[0].x + ", y:" + path[0].y + "}";
	for (var i = 1; i < path.length; i++)
	{
		str += ",\n{x: " + path[i].x + ", y:" + path[i].y + "}";
	}

	str += '\n]';
	console.log(str);
}

RobotDemo.prototype.queryProbability = function (event)
{
	var coor = getClickLoc(event);
	var x = coor.x;
	var y = coor.y;

	if (event.altKey)
	{
		var probability = this.robot.filter.sensorModel.probability
		(
			this.robot.getSensorReading(),
			new RobotState
			(
				this.lview.toWorldX(x),
				this.lview.toWorldY(y),
				this.robot.dir
			)
		);

		document.getElementById('probability').innerHTML = "Probability: " + probability;
	}
};