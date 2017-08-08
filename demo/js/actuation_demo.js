/**
 * Created by kelvinzhang on 6/24/17.
 */


function ActuationDemo(id, dist1, turn, dist2, a1, a2, a3, a4)
{
	const scale = 50*pixelRatio;
	//the canvas element
	this.canvas = document.getElementById(id);
	this.view = new View(this.canvas, scale);
	this.ctx = this.canvas.getContext('2d');
	this.robotSize = 0.2;

	//Distance of first forward movement
	this.firstMove = dist1;
	//Angle of first turn
	this.turn = turn;
	//Distance of second forward movement
	this.secondMove = dist2;

	//Noise parameters
	this.motionModel = new OdometryModel(a1, a2, a3, a4);

	//world size information
	this.width = this.canvas.width / scale;
	this.height = this.canvas.height / scale;

	//place the robot on a random spot
	this.x = this.robotSize;
	this.y = this.robotSize;
	this.dir = Math.PI / 18;

	this.draw();
}

ActuationDemo.prototype.draw = function ()
{
	clearCanvas(this.canvas);
	this.ctx.strokeStyle = 'black';
	this.ctx.drawRobot(this.x, this.y, this.dir, this.robotSize);

	this.ctx.strokeStyle = 'blue';
	//location after first move
	const x1 = this.x + cos(this.dir) * this.firstMove;
	const y1 = this.y + sin(this.dir) * this.firstMove;
	this.ctx.strokeLine(this.x, this.y, x1, y1);

	//direction after first turn
	const dir = this.dir + this.turn;

	//location after the second move
	var x2 = x1 + cos(dir) * this.secondMove;
	var y2 = y1 + sin(dir) * this.secondMove;
	this.ctx.strokeLine(x1, y1, x2, y2);

	if (typeof this.path !== 'undefined')
	{
		this.ctx.strokeStyle = 'red';
		this.ctx.strokePath(this.path);
		// this.ctx.strokeLine(this.x, this.y, this.p1.x, this.p1.y);
		// this.ctx.strokeLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
		if (typeof this.curX !== 'undefined')
		{
			this.ctx.drawRobot(this.curX, this.curY, this.curDir, this.robotSize);
		}
	}
};

ActuationDemo.prototype.simulateActuation = function ()
{
	cancelAnimationFrame(this.frameId);
	//planned location after first move
	const x1 = this.x + cos(this.dir) * this.firstMove;
	const y1 = this.y + sin(this.dir) * this.firstMove;

	//direction after first turn
	const dir = this.dir + this.turn;

	//planned location after the second move
	const x2 = x1 + cos(dir) * this.secondMove;
	const y2 = y1 + sin(dir) * this.secondMove;

	const u1 = new Odometry(this,
		new RobotState(x1, y1, dir));
	const u2 = new Odometry(new RobotState(x1, y1, dir),
		new RobotState(x2, y2, dir));

	//actual location after first move
	const p1 = this.motionModel.sample(u1, this);
	//actual location after the second move
	const p2 = this.motionModel.sample(u2, p1);

	this.path = [new Point(this.x, this.y), p1, p2];
	this.startAnimation();
};

ActuationDemo.prototype.startAnimation = function ()
{
	this.lastFrame = Date.now();
	const self = this;
	this.targetIndex = 0;
	this.curX = this.x;
	this.curY = this.y;
	this.frameId = requestAnimationFrame(function (timestamp)
	{
		self.frame(timestamp);
	});
};

ActuationDemo.prototype.frame = function (timestamp)
{
	this.fps = 60 / (timestamp - this.lastFrame);
	this.lastFrame = timestamp;
	var stride = 0.04;
	var x = this.curX;
	var y = this.curY;
	const EPS = 1E-6;
	while (stride > 0)
	{
		var targetPoint = this.path[this.targetIndex];

		var dist = distance(x, y, targetPoint.x, targetPoint.y);
		while (dist <= EPS)
		{
			this.targetIndex++;
			if (this.targetIndex >= this.path.length)
			{
				this.curX = this.curY = this.curDir = undefined;
				return;
			}
			targetPoint = this.path[this.targetIndex];
			dist = distance(x, y, targetPoint.x, targetPoint.y);
		}

		var cosx = (targetPoint.x - x) / dist;
		var sinx = (targetPoint.y - y) / dist;
		dist = min(dist, stride);

		x += cosx * dist;
		y += sinx * dist;
		stride -= dist;
	}

	//Move the robot
	this.curX = x;
	this.curY = y;
	this.curDir = atan2(targetPoint.y - y, targetPoint.x - x);
	this.draw();

	const self = this;
	this.frameId = requestAnimationFrame(function (timestamp)
	{
		self.frame(timestamp);
	});
};

ActuationDemo.prototype.setDist1 = function (dist1)
{
	this.firstMove = dist1;
};

ActuationDemo.prototype.setTurnAngle = function (turn)
{
	this.turn = turn;
};

ActuationDemo.prototype.setDist2 = function (dist2)
{
	this.secondMove = dist2;
};

ActuationDemo.prototype.setA1 = function (noise)
{
	this.motionModel.a1 = noise;
};

ActuationDemo.prototype.setA2 = function (noise)
{
	this.motionModel.a2 = noise;
};

ActuationDemo.prototype.setA3 = function (noise)
{
	this.motionModel.a3 = noise;
};

ActuationDemo.prototype.setA4 = function (noise)
{
	this.motionModel.a4 = noise;
};