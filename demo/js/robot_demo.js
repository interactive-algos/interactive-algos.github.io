/**
 * Created by kelvinzhang on 6/29/17.
 */

//Compatibility fix...
if(typeof(DOMTokenList.prototype.replace) === 'undefined')
{
	DOMTokenList.prototype.replace = function(oldToken, newToken)
	{
		this.remove(oldToken);
		this.add(newToken);
	}
}

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
	// this.lview.setPreviewScale(map);
	this.lview.setScale(50);

	//The Small canvas elements
	if (document.getElementById(sid) !== null)
	{
		this.sview = new View(document.getElementById(sid), 1);
		this.sview.setPreviewScale(map);
	}

	this.map = map;
	this.colorRes = colorRes;

	const self = this;
	this.manager = new ColorizeManager(this, function (p)
	{
		//Progress callback, 0% <= p < 100%
		const ctx = self.lview.ctx;
		const barWidth = 100;
		const barHeight = 20;
		const width = self.canvas.width;
		const height = self.canvas.height;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.strokeRect(width / 2 - barWidth - 2, height / 2 - barHeight / 2, barWidth, barHeight);
		ctx.fillRect(width / 2 - barWidth - 2, height / 2 - barHeight / 2, barWidth * p, barHeight);
		ctx.restore();
	}, function (probs, resolution)
	{
		//Completion callback
		self.draw();
		self.lview.drawProbabilityGrid(probs, resolution);
	});

	//Robot
	this.robot = robot;
	this.lview.adjustToPoint(this.robot.x, this.robot.y);

	//Other Properties
	this.animating = false;
	this.shouldColorMap = false;

	this.tempPath = undefined;
	this.draw();
}

RobotDemo.prototype.start = function (event)
{
	if (this.animating)
	{
		//If the animation is running... pause it
		this.animating = false;

		//set the button to play
		//icon is a child element of the button
		let buttons = event.target.getElementsByClassName("glyphicon");

		//No child element means the user clicked on icon directly
		if(buttons.length === 0) buttons = [event.target];
		for(let i = 0; i < buttons.length; i ++)
		{
			buttons[i].classList.replace("glyphicon-pause", "glyphicon-play");
		}
		return;
	}
	//Other wise resume/start the animation

	this.animating = true;
	this.lview.adjustToPoint(this.robot.x, this.robot.y);
	this.lview.setScale(50);

	//set the button to pause
	let buttons = event.target.getElementsByClassName("glyphicon");
	if(buttons.length === 0) buttons = [event.target];
	for(let i = 0; i < buttons.length; i ++)
	{
		buttons[i].classList.replace("glyphicon-play", "glyphicon-pause");
	}

	// this.largeCanvas.onmousedown = function (event)
	// {
	// 	self.queryProbability(event);
	// };

	this.lastFrame = Date.now();
	requestAnimationFrame((timestamp) => this.frame(timestamp));
};

RobotDemo.prototype.frame = function (timestamp)
{
	let fps = Math.round(1000.0 / (timestamp - this.lastFrame));
	this.lastFrame = timestamp;

	this.robot.update();

	this.lview.adjustToPoint(this.robot.x, this.robot.y);

	this.draw();

	this.lctx.fillTextWithColorFont(fps + "\tFPS", 'black', '20px Menlo', 10, 20);
	if (this.animating)
	{
		requestAnimationFrame((timestamp) => this.frame(timestamp));
	}
};

RobotDemo.prototype.stop = function (event)
{
	this.animating = false;
	this.largeCanvas.onmousedown = undefined;
	this.robot.reset();
	this.lview.adjustToPoint(this.robot.x, this.robot.y);
	this.draw();

	let buttons = event.target.parentElement.parentElement.getElementsByClassName("glyphicon-pause");
	for(let i = 0; i < buttons.length; i ++)
	{
		buttons[i].classList.replace("glyphicon-pause", "glyphicon-play");
	}
};

RobotDemo.prototype.stepForward = function (event)
{
	this.animating = false;
	let buttons = event.target.parentElement.parentElement.getElementsByClassName("glyphicon-pause");
	for(let i = 0; i < buttons.length; i ++)
	{
		buttons[i].classList.replace("glyphicon-pause", "glyphicon-play");
	}
	requestAnimationFrame((timestamp) => this.frame(timestamp));
};

RobotDemo.prototype.draw = function ()
{
	this.drawView(this.lview, true);
	if(typeof this.robot.filter.sensorModel !== "undefined")
	{
		this.lview.ctx.drawLaserLines(robot.getSensorReading(),
			robot.x, robot.y, robot.dir, robot.sensorRadius);
		this.lview.ctx.drawLaserDots(robot.getSensorReading(),
			robot.x, robot.y, robot.dir, robot.sensorRadius);
	}
	if (typeof this.sview !== 'undefined')
	{
		this.drawView(this.sview, false);
	}
	if (this.shouldColorMap) this.colorMap();
};

RobotDemo.prototype.colorMap = function ()
{
	this.lview.colorMap(this.colorRes, this.robot.filter.sensorModel,
		this.robot.getSensorReading(), this.robot.dir);
};

RobotDemo.prototype.drawView = function (view, showParticles)
{
	clearCanvas(view.canvas);
	view.drawGrid();
	const ctx = view.ctx;
	ctx.drawMap(this.map);
	ctx.strokeStyle = 'green';
	ctx.strokePath(this.robot.path);
	this.robot.draw(ctx, showParticles);
};

Object.defineProperties(RobotDemo.prototype, {
	'a1': {
		get: function() {return this.robot.filter.motionModel.a1;},
		set: function(noise) {this.robot.filter.motionModel.a1 = noise;}
	},
	'a2': {
		get: function() {return this.robot.filter.motionModel.a2;},
		set: function(noise) {this.robot.filter.motionModel.a2 = noise;}
	},
	'a3': {
		get: function() {return this.robot.filter.motionModel.a3;},
		set: function(noise) {this.robot.filter.motionModel.a3 = noise;}
	},
	'a4': {
		get: function() {return this.robot.filter.motionModel.a4;},
		set: function(noise) {this.robot.filter.motionModel.a4 = noise;}
	}
});

//Setters
// RobotDemo.prototype.setA1 = function (noise)
// {
// 	this.robot.filter.motionModel.a1 = noise;
// };
// RobotDemo.prototype.setA2 = function (noise)
// {
// 	this.robot.filter.motionModel.a2 = noise;
// };
// RobotDemo.prototype.setA3 = function (noise)
// {
// 	this.robot.filter.motionModel.a3 = noise;
// };
// RobotDemo.prototype.setA4 = function (noise)
// {
// 	this.robot.filter.motionModel.a4 = noise;
// };

RobotDemo.prototype.setColoringResolution = function (res)
{
	this.colorRes = res;
};

RobotDemo.prototype.setColoring = function (bool)
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

RobotDemo.prototype.setSensorRadius = function (r)
{
	this.robot.setSensorRadius(r);
};

RobotDemo.prototype.setSensorNoise = function (r)
{
	this.robot.filter.sensorModel.a1 = r;
};

RobotDemo.prototype.updateRobot = function ()
{
	let path = this.paths[this.currPathName];
	let x = path[0].x;		//x coordinate
	let y = path[0].y;		//y coordinate
	let dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);	//orientation in radians

	//Robot
	this.robot = new Robot(
		new ParticleFilter(
			this.robot.filter.particles.len,
			this.robot.filter.motionModel,
			this.robot.filter.sensorModel,
			new RobotState(x, y, dir),
			this.robot.filter.resampleRatio
		),
		this.paths[this.currPathName],
		this.robot.z.length,
		this.robot.sensorRadius,
		this.robot.stride
	);
};

//Add Path
RobotDemo.prototype.startRecordingPath = function ()
{
	this.animating = false;

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

RobotDemo.prototype.mouseDown = function (event)
{
	let coor = getClickLoc(event);
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

RobotDemo.prototype.mouseMotion = function (event)
{
	let coor = getClickLoc(event);
	this.lview.toWorldCoor(coor);
	let lastPoint = this.tempPath[this.tempPath.length - 1];

	let curStep = new Line(lastPoint.x, lastPoint.y, coor.x, coor.y);
	for (let i = 0; i < this.map.length; i++)
	{
		if (doIntersect(this.map[i], curStep))
			return;
	}

	this.lctx.strokeStyle = 'red';
	this.lctx.strokeLine(lastPoint.x, lastPoint.y, coor.x, coor.y);
	this.tempPath.push(coor);
};

RobotDemo.prototype.mouseUp = function (event)
{
	this.largeCanvas.onmousemove = undefined;
	this.largeCanvas.onmouseup = undefined;
	this.largeCanvas.onmouseout = undefined;
	this.largeCanvas.onmousedown = undefined;

	let msg = "Enter a unique name for this path, alphanumeric please:";
	let pathName;
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
	let option = document.createElement("option");
	option.text = pathName;
	customPathGroup.append(pathName, option);
	this.pathSelect.selectedIndex = this.pathSelect.length - 1;
	refreshSelect();

	this.currPathName = pathName;
	this.updateRobot();
};

function printPath(path)
{
	let str = '{\n';
	str += "[x: " + path[0].x + ", y:" + path[0].y + "}";
	for (let i = 1; i < path.length; i++)
	{
		str += ",\n{x: " + path[i].x + ", y:" + path[i].y + "}";
	}

	str += '\n]';
	console.log(str);
}

RobotDemo.prototype.queryProbability = function (event)
{
	let coor = getClickLoc(event);
	let x = coor.x;
	let y = coor.y;

	if (event.altKey)
	{
		let probability = this.robot.filter.sensorModel.probability
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
