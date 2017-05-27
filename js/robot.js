function Robot(x, y, dir = 0)
{
	this.x = x;		//x coordinate
	this.y = y;		//y coordinate
	this.dir = dir;	//orientation in radians

	this.lastScan = Date.now();	//time of last sense in millis
	this.senseCircle = 10 + 5;
	this.lastMove = Date.now();	//last time change direction, in millis
	this.moveCD = Robot.randMoveCD();

	this.particles = new Array(getParticleCount());
}

Robot.size = 10;
Robot.sensorRadius = 150;
Robot.scanInterval = 2500;
Robot.stride = 1

Robot.randMoveCD = function()
{
	return 1500 + (gaussian() * 150);
}

let cos = Math.cos;
let sin = Math.sin;
let abs = Math.abs;

Robot.prototype.update = function()
{
	//Move the robot
	this.x += cos(this.dir) * Robot.stride;
	this.y += sin(this.dir) * Robot.stride;

	//Collision with a wall
	if(this.x < Robot.size || this.x+Robot.size >= canvas.width || this.y < Robot.size || this.y+Robot.size >= canvas.height)
	{
		var dx = cos(this.dir);
		var dy = sin(this.dir);
		var offset = 0;

		if(this.x < Robot.size)
		{
			dx = abs(dx);
		}else if(this.x+Robot.size >= canvas.width)
		{
			dx = -abs(dx);
			offset = Math.PI;
		}else if(this.y < Robot.size)
		{
			dy = abs(dy);
			if(dx < 0)
				offset = Math.PI;
		}else if(this.y+Robot.size >= canvas.height)
		{
			dy = -abs(dy);
			if(dx < 0)
				offset = Math.PI;
		}
		this.dir = Math.atan(dy/dx) + offset;
		this.lastMove = Date.now();
		this.moveCD = Robot.randMoveCD();
	}


	//Update robot's direction if necessary
	if(this.lastMove + this.moveCD <= Date.now())
	{
		this.dir += gaussian() * Math.PI;
		this.lastMove = Date.now();
		this.moveCD = Robot.randMoveCD();
	}

	//Update the sense circle
	if(this.senseCircle > Robot.sensorRadius)
	{
		if(Date.now() - this.lastScan >= Robot.scanInterval)
		{
			this.senseCircle %= Robot.sensorRadius;
			this.lastScan = Date.now();
		}
	}
	this.senseCircle += 1;
}

Robot.prototype.draw = function(ctx)
{
	ctx.strokeStyle = 'black';
	if(Date.now() - this.lastMove < 200)
		ctx.strokeStyle = 'red';

	ctx.beginPath();

	//The robot's main circle
	ctx.arc(this.x, this.y, Robot.size, 0, Math.PI * 2, true);
	ctx.moveTo(this.x, this.y);

	//draw a line to show Robot's orientation
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x + cos(this.dir) * Robot.size, this.y + sin(this.dir) * Robot.size)
	ctx.moveTo(this.x, this.y);

	ctx.stroke();

	ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';
	ctx.beginPath();
	//draw Robot's sensing circle
	ctx.arc(this.x, this.y, this.senseCircle, 0, Math.PI*2, false);
	ctx.stroke();
}