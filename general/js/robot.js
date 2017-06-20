//Predefined params

Robot.size = 0.2;
Robot.sensorRadius = 1.5;
Robot.scanInterval = 2500;
Robot.stride = 0.01;
const EPS = 1E-5;

/**
 * A representation of a Robot
 * @constructor
 * @param {ParticleFilter} filter - The sampling filter that the robot uses to calculate bel
 * @param {Point[]} path - The predefined map that the robot will follow
 * @param {int} nLasers - The number of rays that the robot have.
 */
function Robot(filter, path, nLasers)
{
    if (typeof(dir) === 'undefined') dir = 0;
    if (typeof(nLasers) === 'undefined') nLasers = 36;

    this.x = path[0].x;		//x coordinate
    this.y = path[0].y;		//y coordinate
    this.dir = atan2(path[1].y-path[0].y, path[1].x-path[0].x);	//orientation in radians

    this.lastScan = Date.now();	//time of last sense in millis

    this.senseCircle = Robot.size;

    //For odometry records
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastDir = this.dir;

    this.filter = filter;

    //Array of points for the robot to follow
    this.path = path;

    //Index to the path array, the point the robot is currently approaching
	//The robot starts at 0th point so this is set to 1
	this.targetIndex = 1;

	this.z = new Array(nLasers);
}

/**
 * Function that used to update stride noise for the motion model
 * @function
 * @param {float} noise - The stride noise for motion model
 */
Robot.prototype.setStrideNoise = function(noise)
{
    this.filter.motionModel.a2 = noise;
};

/**
 * Function that used to update turning noise for the motion model
 * Assume the noise is the same for turning both direction.
 * @function
 * @param {float} noise - The turn noise for motion model
 */
Robot.prototype.setTurnNoise = function(noise)
{
    this.filter.motionModel.a1 = noise;
    this.filter.motionModel.a3 = noise;
};

// Robot.prototype.checkCollision = function()
// {
//     var dx = cos(this.dir);
//     var dy = sin(this.dir);
//
//     var collide = false;
//     if(this.x < Robot.size)
//     {
//         dx = abs(dx);
//         collide = true;
//     }else if(this.x+Robot.size >= width)
//     {
//         dx = -abs(dx);
//         collide = true;
//     }else if(this.y < Robot.size)
//     {
//         dy = abs(dy);
//         collide = true;
//     }else if(this.y+Robot.size >= height)
//     {
//         dy = -abs(dy);
//         collide = true;
//     }
//     if(collide)
//     {
//         this.dir = atan2(dy, dx);
//     }
// };

/**
 * Function that used to update the robot
 * @function
 */
Robot.prototype.update = function()
{
    this.updateMotion();

    this.updateParticles();

    this.updateSenseCircle();
};

/**
 * Function that used to update the motion of the robot
 * Based on the path
 * @function
 * @param {float} noise - The stride noise for motion model
 */
Robot.prototype.updateMotion = function()
{
	console.assert(typeof this.path !== 'undefined');

	var stride = Robot.stride;
	var x = this.x;
	var y = this.y;

	while(stride > 0)
	{
		var targetPoint = this.path[this.targetIndex];

		var dist = distance(x, y, targetPoint.x, targetPoint.y);
		while(dist <= EPS)
		{
			this.targetIndex++;
			this.targetIndex %= this.path.length;
			targetPoint = this.path[this.targetIndex];
			dist = distance(x, y, targetPoint.x, targetPoint.y);
		}

		var cosx = (targetPoint.x-x)/dist;
		var sinx = (targetPoint.y-y)/dist;
		dist = min(dist, stride);

		x += cosx * dist;
		y += sinx * dist;
		stride -= dist;
	}

    //Move the robot
    this.x = x;
	this.y = y;
	this.dir = atan2(targetPoint.y-y, targetPoint.x-x);
};

Robot.prototype.updateParticles = function()
{
    if(typeof this.filter === 'undefined')
        return;

    var u = new Odometry(new RobotState(this.lastX, this.lastY, this.lastDir), new RobotState(this.x, this.y, this.dir));

    if(typeof this.filter.sensorModel !== 'undefined')
    {
        var z = this.z;
        scan(this.x, this.y, this.dir, Robot.sensorRadius, this.filter.sensorModel.map, z);
        for(var i = 0; i < z.length; i ++)
		{
			z[i] += gaussian() * this.filter.sensorModel.a1;
			if(z[i] < 0) z[i] = 0;
			else if(z[i] > Robot.sensorRadius)z[i] = Robot.sensorRadius;
		}
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
    this.senseCircle += 0.04;
};

Robot.prototype.draw = function(ctx)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';

    var x = this.x;
    var y = this.y;

    ctx.drawRobot(x, y, -this.dir, Robot.size, true);

    ctx.strokeStyle = 'rgba(0, 0, 255, '+ (this.senseCircle/Robot.sensorRadius) +')';

    //draw Robot's sensing circle
    ctx.strokeCircle(x, y, this.senseCircle);

    this.filter.draw(ctx);
};

Robot.prototype.getSensorReading = function()
{
	return this.z;
};

Robot.prototype.getState = function()
{
	return new RobotState(this.x, this.y, this.dir);
};
