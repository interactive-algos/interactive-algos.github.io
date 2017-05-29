
function Robot(x, y, dir, motionModel)
{
    if (typeof(dir)==='undefined') dir = 10;
	this.x = x;		//x coordinate
	this.y = y;		//y coordinate
	this.dir = dir;	//orientation in radians

	this.lastScan = Date.now();	//time of last sense in millis

	this.senseCircle = Robot.size;
	this.lastMove = Date.now();	//last time change direction, in millis
	this.lastX = this.x;
	this.lastY = this.y;
	this.lastDir = this.dir;
	this.moveCD = Robot.randMoveCD();

	this.filter = new ParticleFilter(getParticleCount(), motionModel, new RobotState(x, y, dir));
}

Robot.size = 0.2;
Robot.sensorRadius = 1.5;
Robot.scanInterval = 2500;
Robot.stride = 0.01;

Robot.randMoveCD = function()
{
	return 1500 + (gaussian() * 150);
};

Robot.prototype.setStrideNoise = function(noise)
{
	this.filter.motionModel.a2 = noise;
};

Robot.prototype.setTurnNoise = function(noise)
{
	this.filter.motionModel.a1 = noise;
	this.filter.motionModel.a3 = noise;
};

Robot.prototype.checkCollision = function()
{
	var dx = cos(this.dir);
	var dy = sin(this.dir);

	var collide = false;
	if(this.x < Robot.size)
	{
		dx = abs(dx);
		collide = true;
	}else if(this.x+Robot.size >= width)
	{
		dx = -abs(dx);
		collide = true;
	}else if(this.y < Robot.size)
	{
		dy = abs(dy);
		collide = true;
	}else if(this.y+Robot.size >= height)
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
};

Robot.prototype.updateMotion = function()
{
    //Move the robot
    this.x += cos(this.dir) * Robot.stride;
    this.y += sin(this.dir) * Robot.stride;

    //Update robot's direction if necessary
    if(this.lastMove + this.moveCD <= Date.now())
    {
        this.dir += gaussian() * Math.PI;
        this.lastMove = Date.now();
        this.moveCD = Robot.randMoveCD();
    }
};


Robot.prototype.update = function()
{

	this.updateMotion();

	this.updateParticles();

	//Collision with a wall
	this.checkCollision();

	//Update the sense circle
	this.updateSenseCircle();
};

Robot.prototype.updateSenseCircle = function()
{
    if(this.senseCircle > Robot.sensorRadius)
    {
        if(Date.now() - this.lastScan >= Robot.scanInterval)
        {
            this.senseCircle = Robot.size;
            this.lastScan = Date.now();
        }
    }
    this.senseCircle += 0.1;
};

Robot.prototype.updateParticles = function()
{
	var u = new Odometry(new RobotState(this.lastX, this.lastY, this.lastDir), new RobotState(this.x, this.y, this.dir));

	//only odometry, no measurement
	this.filter.update(u);

	this.lastX = this.x;
	this.lastY = this.y;
	this.lastDir = this.dir;
};

Robot.prototype.draw = function(ctx)
{
	ctx.strokeStyle = 'black';
	if(Date.now() - this.lastMove < 200)
		ctx.strokeStyle = 'red';

	ctx.beginPath();

	var x = convertX(this.x);
	var y = convertY(this.y);

	//The robot's main circle
	ctx.arc(x, y, Robot.size/scale, 0, Math.PI * 2, true);

	//draw a line to show Robot's orientation
	ctx.moveTo(x, y);
	ctx.lineTo(convertX(this.x + cos(this.dir) * Robot.size), convertY(this.y + sin(this.dir) * Robot.size));

	ctx.stroke();

	ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';
	ctx.beginPath();

	//draw Robot's sensing circle
	ctx.arc(x, y, this.senseCircle/scale, 0, Math.PI*2, false);
	ctx.stroke();

	this.filter.draw(ctx);
};