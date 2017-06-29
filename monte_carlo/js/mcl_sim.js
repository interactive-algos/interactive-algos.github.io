function MCLDemo(lid, //Main Canvas id
				 sid, //Mini Canvas id
				 map,
				 particleCount, sensorRadius, stride, sensorNoise,
				 a1, a2, a3, a4,
				 colorRes, resampleRatio)
{
	//the Large canvas elements
	this.largeCanvas = document.getElementById(lid);
	this.lctx = this.largeCanvas.getContext('2d');
	this.lview = new View(this.largeCanvas, 1);
	this.lview.setPreviewScale(map);

	//The Small canvas elements
	this.sview = new View(document.getElementById(sid), 1);
	this.sview.setPreviewScale(map);

	this.pathSelect = document.getElementById('path');

	this.robotSize = 0.2;
	this.map = map;
	this.paths = {};
	smoothenPath(vanillaPath);
	this.paths['Vanilla'] = vanillaPath;
	this.currPathName = 'Vanilla';
	this.colorRes = colorRes;
	this.particleCount = particleCount;
	this.resampleRatio = resampleRatio;

	var path = this.paths[this.currPathName];
	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

	//Robot
	this.motionModel = new OdometryModel(a1, a2, a3, a4);
	this.sensorModel = new BeamModel(sensorNoise, sensorRadius, map);
	this.robot = new Robot
	(
		new ParticleFilter
		(
			particleCount,
			this.motionModel,
			this.sensorModel,
			new RobotState(x, y, dir + TWO_PI / 2),
			resampleRatio
		),
		this.paths[this.currPathName],
		19
	);

	//Other Properties
	Robot.sensorRadius = sensorRadius;
	Robot.stride = stride;
	this.animating = false;
	this.shouldColorMap = false;

	this.tempPath = undefined;
	this.draw();
}

MCLDemo.prototype.start = function ()
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

MCLDemo.prototype.frame = function (timestamp)
{
	var fps = Math.round(1000.0 / (timestamp - this.lastFrame));
	this.lastFrame = timestamp;

	this.robot.update();

	var x = this.lview.toScreenX(this.robot.x);
	var y = this.lview.toScreenY(this.robot.y);
	this.lview.adjustToPoint(x, y);

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

MCLDemo.prototype.stop = function ()
{
	if (this.animating)
	{ //Pause
		this.animating = false;
	} else
	{ //stop
		this.largeCanvas.onmousedown = undefined;
		init();
	}
};

MCLDemo.prototype.stepForward = function ()
{
	this.animating = false;
	const self = this;
	requestAnimationFrame(function (timestamp)
	{
		self.frame(timestamp);
	});
};

MCLDemo.prototype.draw = function ()
{
	this.drawView(this.lview);
	this.drawView(this.sview);
	if (this.shouldColorMap) this.colorMap();
};

MCLDemo.prototype.colorMap = function ()
{
	this.lview.colorMap(this.colorRes, this.robot.filter.sensorModel,
		this.robot.getSensorReading(), this.robot.dir);
};

MCLDemo.prototype.drawView = function (view)
{
	clearCanvas(view.canvas);
	const ctx = view.ctx;
	ctx.drawMap(this.map);
	ctx.strokeStyle = 'green';
	ctx.strokePath(this.paths[this.currPathName]);
	this.robot.draw(ctx);
};

//Setters
MCLDemo.prototype.setA1 = function (noise)
{
	this.robot.filter.motionModel.a1 = noise;
};
MCLDemo.prototype.setA2 = function (noise)
{
	this.robot.filter.motionModel.a2 = noise;
};
MCLDemo.prototype.setA3 = function (noise)
{
	this.robot.filter.motionModel.a3 = noise;
};
MCLDemo.prototype.setA4 = function (noise)
{
	this.robot.filter.motionModel.a4 = noise;
};

MCLDemo.prototype.setParticleCount = function (n)
{
	this.particleCount = n;
	this.robot.filter = new ParticleFilter
	(
		this.particleCount,
		this.motionModel,
		this.sensorModel,
		new RobotState(this.robot.x, this.robot.y, this.robot.dir),
		this.resampleRatio
	);
};

MCLDemo.prototype.setSensorRadius = function (radius)
{
	Robot.sensorRadius = radius;
};

MCLDemo.prototype.setStride = function (stride)
{
	Robot.stride = stride;
};

MCLDemo.prototype.updateRobot = function ()
{
	var path = this.paths[this.currPathName];
	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

	//Robot
	this.robot = new Robot(
		new ParticleFilter(
			this.particleCount,
			this.motionModel,
			this.sensorModel,
			new RobotState(x, y, dir + TWO_PI / 2),
			this.resampleRatio
		),
		this.paths[this.currPathName],
		19
	);
};

//Add Path
MCLDemo.prototype.startRecordingPath = function ()
{
	animating = false;

	clearCanvas(this.largeCanvas);
	this.lview.setPreviewScale(this.map);
	this.lctx.drawMap(this.map);

	const self = this;
	this.largeCanvas.onmousedown = function (event)
	{
		self.mouseDown(event);
	};
	this.tempPath = [];
};

MCLDemo.prototype.mouseDown = function (event)
{
	var coor = getClickLoc(event);
	this.lview.toWorldCoor(coor);

	this.tempPath.push(coor);
	const self = this;
	this.largeCanvas.onmousemove = function (event)
	{
		self.mouseMotion(event);
	};
	this.largeCanvas.onmouseup = function (event)
	{
		self.mouseUp(event);
	};
	this.largeCanvas.onmouseout = function (event)
	{
		self.mouseUp(event);
	}
};

MCLDemo.prototype.mouseMotion = function (event)
{
	var coor = getClickLoc(event);
	this.lview.toWorldCoor(coor);
	var lastPoint = this.tempPath[this.tempPath.length - 1];

	var curStep = new Line(lastPoint.x, lastPoint.y, coor.x, coor.y);
	for (var i = 0; i < this.map.length; i++)
	{
		if (doIntersect(this.map[i].s, this.map[i].t, curStep.s, curStep.t))
			return;
	}

	this.lctx.strokeStyle = 'red';
	this.lctx.strokeLine(lastPoint.x, lastPoint.y, coor.x, coor.y);
	this.tempPath.push(coor);
};

MCLDemo.prototype.mouseUp = function (event)
{
	this.largeCanvas.onmousemove = undefined;
	this.largeCanvas.onmouseup = undefined;
	this.largeCanvas.onmouseout = undefined;
	this.largeCanvas.onmousedown = undefined;

	var msg = "Enter a unique name for this path, alphanumeric please:";

	while (true)
	{
		pathName = prompt(msg, "Harry Potter");

		if (pathName === null)
		{
			this.selectedIndex = 0;
			refreshSelect();
			return;
		}

		//No duplicate name!
		if (pathName in this.paths)
		{
			msg = 'Name must be unique!';
			continue;
		}

		//Must be alphanumeric
		if (pathName.match(new RegExp('^[a-zA-Z0-9]+$')))
			break;
		msg = 'Name must be alphanumeric!';
	}
	smoothenPath(this.tempPath);
	this.paths[pathName] = this.tempPath;
	printPath(this.tempPath);
	var option = document.createElement("option");
	option.text = pathName;
	customPathGroup.append(pathName, option);
	this.pathSelect.selectedIndex = this.pathSelect.length - 1;
	refreshSelect();

	this.currPathName = pathName;
	this.updateRobot();
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

MCLDemo.prototype.queryProbability = function (event)
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