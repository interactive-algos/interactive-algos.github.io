/**
 * Created by kelvinzhang on 6/24/17.
 */


function ActuationDemo(id)
{
	this.scale = 50;
	//the canvas element
	this.canvas = document.getElementById(id);
	this.view = new View(this.canvas, this.scale);
	this.ctx = this.canvas.getContext('2d');

	//Distance of first forward movement
	this.firstMove = 1;
	//Angle of first turn
	this.turn = Math.PI/6;
	//Distance of second forward movement
	this.secondMove = 1;

	this.motionModel = new OdometryModel(0.05, 0.05, 0.05, 0.05);

	//world size information
	this.width = this.canvas.width/this.scale;
	this.height = this.canvas.height/this.scale;

	//place the robot on a random spot
	this.x = random()*this.width;
	this.y = random()*this.height;
	this.dir = random()*TWO_PI;

	this.render();

	const self = this;
	this.canvas.onmousedown = function(event){return self.mouseDown(event)};
}

ActuationDemo.prototype.render = function()
{
	clearCanvas(this.canvas);
	this.ctx.strokeStyle = 'black';
	this.ctx.drawRobot(this.x, this.y, this.dir, 0.2);

	this.ctx.strokeStyle = 'blue';
	//location after first move
	const x1 = this.x + cos(this.dir)*this.firstMove;
	const y1 = this.y + sin(this.dir)*this.firstMove;
	this.ctx.strokeLine(this.x, this.y, x1, y1);

	//direction after first turn
	const dir = this.dir + this.turn;

	//location after the second move
	var x2 = x1 + cos(dir)*this.secondMove;
	var y2 = y1 + sin(dir)*this.secondMove;
	this.ctx.strokeLine(x1, y1, x2, y2);
};

ActuationDemo.prototype.mouseDown = function(event)
{
	//Shorthand for this.view and this.ctx
	const view = this.view;

	var coor = getClickLoc(event);
	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	this.x = x;
	this.y = y;

	this.render();
	const self = this;
	this.canvas.onmousemove = function(event){return self.trackDirection(event);};
	this.canvas.onmouseup = function(event){return self.mouseUp(event);};
};

ActuationDemo.prototype.trackDirection = function(event)
{
	const view = this.view;
	const coor = getClickLoc(event);
	const x = view.toWorldX(coor.x);
	const y = view.toWorldY(coor.y);

	this.dir = atan2(y - this.y, x - this.x);
	this.render();
};

ActuationDemo.prototype.mouseUp = function(event)
{
	this.canvas.onmousemove = undefined;
	const self = this;

	//planned location after first move
	const x1 = this.x + cos(this.dir)*this.firstMove;
	const y1 = this.y + sin(this.dir)*this.firstMove;

	//direction after first turn
	const dir = this.dir + this.turn;

	//planned location after the second move
	const x2 = x1 + cos(dir)*this.secondMove;
	const y2 = y1 + sin(dir)*this.secondMove;

	this.u1 = new Odometry(new RobotState(this.x, this.y, this.dir),
		new RobotState(x1, y1, dir));
	this.u2 = new Odometry(new RobotState(x1, y1, dir),
		new RobotState(x2, y2, dir));

	//actual location after first move
	this.p1 = this.motionModel.sample(this.u1, new RobotState(this.x, this.y, this.dir));
	//actual location after the second move
	this.p2 = this.motionModel.sample(this.u2, this.p1);

	this.ctx.strokeStyle = 'red';
	this.ctx.strokeLine(this.x, this.y, this.p1.x, this.p1.y);
	this.ctx.strokeLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
	// this.lastFrame = Date.now();
	// requestAnimationFrame(function(timestamp){self.frame(timestamp);});
};

ActuationDemo.prototype.frame = function(timestamp)
{
	this.fps = 60/(timestamp-this.lastFrame);
	this.lastFrame = timestamp;
};