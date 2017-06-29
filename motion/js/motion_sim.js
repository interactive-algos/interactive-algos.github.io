function MotionDemo(lid, //Main Canvas id
					sid, //Mini Canvas id
					map,
					particleCount, stride,
					a1, a2, a3, a4)
{
	const scale = 50;
	//the Large canvas elements
	this.largeCanvas = document.getElementById(lid);
	this.lview = new View(this.largeCanvas, scale);
	this.lview.setPreviewScale(map);
	this.lctx = this.largeCanvas.getContext('2d');

	//The Small canvas elements
	this.scanvas = document.getElementById(sid);
	this.sview = new View(this.scanvas, scale);
	this.sview.setPreviewScale(map);
	this.sctx = this.scanvas.getContext('2d');

	this.pathSelect = document.getElementById('path');

	this.robotSize = 0.2;
	this.map = map;
	this.paths = {};
	smoothenPath(vanillaPath);
	this.paths['Vanilla'] = vanillaPath;
	this.currPathName = 'Vanilla';

	var path = this.paths[this.currPathName];
	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

	//Robot
	this.robot = new Robot(
		new ParticleFilter(particleCount, new OdometryModel(a1, a2, a3, a4),
			undefined, new RobotState(x, y, dir), 1),
		this.paths[this.currPathName], undefined
	);

	this.robot.filter.particles.forEach(function (p)
	{
		p.x = x;
		p.y = y;
		p.dir = dir;
	});

	//Other Properties
	Robot.stride = stride;
	this.animating = false;

	this.tempPath = undefined;
	this.draw();
}

MotionDemo.prototype.start = function ()
{
	if (this.animating) return;

	this.lview.setScale(50);
	this.animating = true;
	this.lastFrame = Date.now();

	const self = this;
	requestAnimationFrame(function (timestamp)
	{
		self.frame(timestamp);
	});
};

MotionDemo.prototype.frame = function (timestamp)
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

MotionDemo.prototype.stop = function ()
{
	if (this.animating)
	{ //Pause
		this.animating = false;
	} else
	{ //stop
		init();
	}
};

MotionDemo.prototype.stepForward = function ()
{
	this.animating = false;
	const self = this;
	requestAnimationFrame(function(timestamp){self.frame(timestamp);});
};

MotionDemo.prototype.draw = function ()
{
	this.drawView(this.lview);
	this.drawView(this.sview);
};

MotionDemo.prototype.drawView = function (view)
{
	clearCanvas(view.canvas);
	const ctx = view.ctx;
	ctx.drawMap(this.map);
	ctx.strokeStyle = 'green';
	ctx.strokePath(this.paths[this.currPathName]);
	this.robot.draw(ctx);
};

//Setters
MotionDemo.prototype.setA1 = function (noise)
{
	this.robot.filter.motionModel.a1 = noise;
};

MotionDemo.prototype.setA2 = function (noise)
{
	this.robot.filter.motionModel.a2 = noise;
};

MotionDemo.prototype.setA3 = function (noise)
{
	this.robot.filter.motionModel.a3 = noise;
};

MotionDemo.prototype.setA4 = function (noise)
{
	this.robot.filter.motionModel.a4 = noise;
};

MotionDemo.prototype.setParticleCount = function (n)
{
	this.robot.filter.particles = new Array(n);
	for (var i = 0; i < n; i++)
	{
		this.robot.filter.particles[i] =
			new Particle(this.robot.x, this.robot.y, this.robot.dir, 0);
	}
};

MotionDemo.prototype.setSensorRadius = function (radius)
{
	Robot.sensorRadius = radius;
};

MotionDemo.prototype.setStride = function (stride)
{
	Robot.stride = stride;
};

MotionDemo.prototype.updateRobot = function ()
{

	var path = this.paths[this.currPathName];
	var x = path[0].x;		//x coordinate
	var y = path[0].y;		//y coordinate
	var dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

	//Robot
	this.robot = new Robot(
		new ParticleFilter(
			getParticleCount(),
			new OdometryModel(getValue('a1'), getValue('a2'), getValue('a3'), getValue('a4')),
			undefined,
			new RobotState(x, y, dir + TWO_PI / 2),
			1
		),
		this.paths[this.currPathName],
		undefined
	);
};

//Add Path
MotionDemo.prototype.startRecordingPath = function ()
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

MotionDemo.prototype.mouseDown = function (event)
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

MotionDemo.prototype.mouseMotion = function (event)
{
	var coor = getClickLoc(event);
	this.lview.toWorldCoor(coor);
	var lastPoint = this.tempPath[this.tempPath.length - 1];

	var curStep = new Line(lastPoint.x, lastPoint.y, coor.x, coor.y);
	for (var i = 0; i < this.map.length; i++)
	{
		if (doIntersect(
				this.map[i].s, this.map[i].t,
				curStep.s, curStep.t
			)) return;
	}

	this.lctx.strokeStyle = 'red';
	this.lctx.strokeLine(
		lastPoint.x,
		lastPoint.y,
		coor.x,
		coor.y
	);
	this.tempPath.push(coor);
};

MotionDemo.prototype.mouseUp = function (event)
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
			this.pathSelect.selectedIndex = 0;
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
