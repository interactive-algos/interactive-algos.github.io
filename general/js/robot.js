
function Robot(x, y, dir, filter)
{
    if (typeof(dir)==='undefined') dir = 0;
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

    this.filter = filter;
}

Robot.size = 0.2;
Robot.sensorRadius = 1.5;
Robot.scanInterval = 2500;
Robot.stride = 0.01;
Robot.sensorNoise = 0.01;

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
    //Collision with a wall
    this.checkCollision();

    //Move the robot
    this.x += cos(this.dir) * Robot.stride;
    this.y += sin(this.dir) * Robot.stride;

    //Update robot's direction if necessary
    if(this.lastMove + this.moveCD <= Date.now())
    {
        this.dir += gaussian() * Math.PI;
        this.dir %= TWO_PI;
        this.lastMove = Date.now();
        this.moveCD = Robot.randMoveCD();
    }
};

Robot.prototype.update = function()
{
    this.updateMotion();

    this.updateParticles();

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
    if(typeof this.filter === 'undefined')
        return;

    var u = new Odometry(new RobotState(this.lastX, this.lastY, this.lastDir), new RobotState(this.x, this.y, this.dir));

    if(typeof this.filter.sensorModel !== 'undefined')
    {
        var z = new Array(36);
        scan(this.x, this.y, Robot.sensorRadius, this.filter.sensorModel.map, z);
        this.filter.update(u, z);
    }else
    {
        this.filter.motionUpdate(u);
    }


    // for(var i = 0; i < z.length; i ++)
    // {
    // 	z[i] += gaussian() * z[i] * Robot.sensorNoise;
    // }

    //Odometry and Measurement


    this.lastX = this.x;
    this.lastY = this.y;
    this.lastDir = this.dir;
};

Robot.prototype.draw = function(ctx)
{
    ctx.strokeStyle = 'black';
    if(Date.now() - this.lastMove < 200)
        ctx.strokeStyle = 'red';

    var x = toScreenX(this.x);
    var y = toScreenY(this.y);

    ctx.drawRobot(x, y, -this.dir, Robot.size/scale);

    ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';

    //draw Robot's sensing circle
    ctx.strokeCircle(x, y, this.senseCircle/scale);

    this.filter.draw(ctx);
};