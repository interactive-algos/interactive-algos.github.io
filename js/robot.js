function RobotState(x, y, dir)
{
	this.x = x;
	this.y = y;
	this.dir = dir;
}

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

	var strideNoise = getStrideNoise();
	var turnNoise = getTurnNoise();
	this.particles = new Array(getParticleCount());

	this.motionModel = new OdometryModel(turnNoise, strideNoise, turnNoise, 0);

	//generate initial particles
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

Robot.prototype.setStrideNoise = function(noise)
{
	this.motionModel.a2 = noise;
}

Robot.prototype.setTurnNoise = function(noise)
{
	this.motionModel.a1 = noise;
	this.motionModel.a3 = noise;
}

Robot.prototype.checkCollision = function()
{
	var dx = cos(this.dir);
	var dy = sin(this.dir);

	var collide = false;
	if(this.x < Robot.size)
	{
		dx = abs(dx);
		collide = true;
	}else if(this.x+Robot.size >= canvas.width)
	{
		dx = -abs(dx);
		collide = true;
	}else if(this.y < Robot.size)
	{
		dy = abs(dy);
		collide = true;
	}else if(this.y+Robot.size >= canvas.height)
	{
		dy = -abs(dy);
		collide = true;
	}
	if(collide)
	{
		this.dir = atan2(dy, dx);
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
	var strideNoise = this.strideNoise;
	var turnNoise = this.turnNoise;
	
	var u = new Odometry(new RobotState(this.lastX, this.lastY, this.lastDir), 
		new RobotState(this.x, this.y, this.dir));

	for (var i = this.particles.length - 1; i >= 0; i--) 
	{		
		var p = this.particles[i];
		var state = new RobotState(p.x, p.y, p.dir);
		var newState = this.motionModel.sample(u, state);
		this.particles[i] = new Particle(newState.x, newState.y, newState.dir, 1);
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

	var x = floor(this.x);
	var y = floor(this.y);

	//The robot's main circle
	ctx.arc(x, y, Robot.size, 0, Math.PI * 2, true);

	//draw a line to show Robot's orientation
	ctx.moveTo(x, y);
	ctx.lineTo(floor(this.x + cos(this.dir) * Robot.size), floor(this.y + sin(this.dir) * Robot.size));

	ctx.stroke();

	ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';
	ctx.beginPath();
	//draw Robot's sensing circle
	ctx.arc(x, y, this.senseCircle, 0, Math.PI*2, false);
	ctx.stroke();

	for (var i = this.particles.length - 1; i >= 0; i--) 
	{
		this.particles[i].draw(ctx);
	}
}