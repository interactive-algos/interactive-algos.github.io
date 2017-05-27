function Robot(x, y, dir = 0)
{
	this.x = x;		//x coordinate
	this.y = y;		//y coordinate
	this.dir = dir;	//orientation in radians

	this.lastScan = Date.now();	//time of last sense in millis

	this.senseCircle = 10 + 5;
	this.lastMove = Date.now();	//last time change direction, in millis
	this.lastX = this.x;
	this.lastY = this.y;
	this.lastDir = this.dir;
	this.moveCD = Robot.randMoveCD();

	this.particles = new Array(getParticleCount());

	for (var i = this.particles.length - 1; i >= 0; i--) 
	{
		this.particles[i] = new Particle(this.x, this.y, this.dir, 1);
	}
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

Robot.prototype.checkCollision = function()
{
	var dx = cos(this.dir);
	var dy = sin(this.dir);
	var offset = 0;

	var collide = false;
	if(this.x < Robot.size)
	{
		dx = abs(dx);
		collide = true;
	}else if(this.x+Robot.size >= canvas.width)
	{
		dx = -abs(dx);
		offset = Math.PI;
		collide = true;
	}else if(this.y < Robot.size)
	{
		dy = abs(dy);
		if(dx < 0)
			offset = Math.PI;
		collide = true;
	}else if(this.y+Robot.size >= canvas.height)
	{
		dy = -abs(dy);
		if(dx < 0)
			offset = Math.PI;
		collide = true;
	}
	if(collide)
	{
		this.dir = Math.atan(dy/dx) + offset;
		this.lastMove = Date.now();
		this.moveCD = Robot.randMoveCD();
	}
}

Robot.prototype.update = function()
{
	//Move the robot
	this.x += cos(this.dir) * Robot.stride;
	this.y += sin(this.dir) * Robot.stride;

	this.updateParticles();

	//Collision with a wall
	this.checkCollision();

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

Robot.prototype.updateParticles = function()
{
	//This is how we simulate odometry....
	var dx = this.x - this.lastX;
	var dy = this.y - this.lastY;
	var dd = Math.sqrt(dx*dx + dy*dy);
	var da = this.dir - this.lastDir;

	//get noise parameters
	var strideNoise = getStrideNoise();
	var turnNoise = getTurnNoise();
	
	for (var i = this.particles.length - 1; i >= 0; i--) 
	{
		var dist = dd + dd * gaussian() * strideNoise;
		var newDir = this.particles[i].dir + da + gaussian() * da * turnNoise
		this.particles[i].x += dist * cos(newDir);
		this.particles[i].y += dist * sin(newDir)
		this.particles[i].dir = newDir;
	}

	this.lastX = this.x;
	this.lastY = this.y;
	this.lastDir = this.dir;
}

Robot.prototype.draw = function(ctx)
{
	ctx.strokeStyle = 'black';
	if(Date.now() - this.lastMove < 200)
		ctx.strokeStyle = 'red';

	ctx.beginPath();

	var x = Math.floor(this.x);
	var y = Math.floor(this.y);

	//The robot's main circle
	ctx.arc(x, y, Robot.size, 0, Math.PI * 2, true);

	//draw a line to show Robot's orientation
	ctx.moveTo(x, y);
	ctx.lineTo(Math.floor(this.x + cos(this.dir) * Robot.size), Math.floor(this.y + sin(this.dir) * Robot.size));

	ctx.stroke();

	ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';
	ctx.beginPath();
	//draw Robot's sensing circle
	ctx.arc(x, y, this.senseCircle, 0, Math.PI*2, false);
	ctx.stroke();

	for (var i = this.particles.length - 1; i >= 0; i--) 
	{
		var p = this.particles[i];
		p.draw(ctx);
	}
}