//Predefined params
Robot.size = 0.2;
Robot.scanInterval = 2500;

const EPS = 1E-5;

/**
 * A representation of a Robot
 * @constructor
 * @param {ParticleFilter} filter - The sampling filter that the robot uses to calculate bel
 * @param {Point[]} path - The predefined map that the robot will follow
 * @param {int} nLasers - The number of rays that the robot have.
 */
function Robot(filter, path, nLasers, sensorRadius, stride)
{
    if (typeof(nLasers) === 'undefined') nLasers = 19;

    this.filter = filter;

    //Array of points for the robot to follow
    this.path = path;
	this.reset();

	this.z = new Array(nLasers);
	this.sensorRadius = sensorRadius;
	this.stride = stride;
}

Robot.prototype.reset = function()
{
	const path = this.path;
	this.x = path[0].x;		//x coordinate
	this.y = path[0].y;		//y coordinate
	this.dir = atan2(path[1].y-path[0].y, path[1].x-path[0].x);	//orientation in radians

	//For odometry records
	this.lastX = this.x;
	this.lastY = this.y;
	this.lastDir = this.dir;

	//Index to the path array, the point the robot is currently approaching
	//The robot starts at 0th point so this is set to 1
	this.targetIndex = 1;
	this.filter = new ParticleFilter(this.filter.count, this.filter.motionModel, this.filter.sensorModel, this.getState(), this.filter.resampleRatio);
};

Robot.prototype.setA1 = function(noise)
{
    this.filter.motionModel.a1 = noise;
};

Robot.prototype.setA2 = function(noise)
{
	this.filter.motionModel.a2 = noise;
};

Robot.prototype.setA3 = function(noise)
{
	this.filter.motionModel.a3 = noise;
};

Robot.prototype.setA4 = function(noise)
{
	this.filter.motionModel.a4 = noise;
};

Robot.prototype.setSensorRadius = function(r)
{
	this.sensorRadius = r;
};

/**
 * Function that used to update the robot
 * @function
 */
Robot.prototype.update = function()
{
    this.updateMotion();

    this.updateParticles();
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

	var stride = this.stride;
	var x = this.x;
	var y = this.y;
	var targetPoint = this.path[this.targetIndex];

	while(stride > 0)
	{
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
		targetPoint = this.path[this.targetIndex];
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
        scan(this.x, this.y, this.dir, this.sensorRadius, this.filter.sensorModel.map, z);
        for(var i = 0; i < z.length; i ++)
		{
			z[i] += gaussian() * this.filter.sensorModel.a1;
			if(z[i] < 0) z[i] = 0;
			else if(z[i] > this.sensorRadius)z[i] = this.sensorRadius;
		}
        this.filter.update(u, z);
    }else
    {
        this.filter.motionUpdate(u);
    }

    //Odometry and Measurement
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastDir = this.dir;
};

Robot.prototype.draw = function(ctx)
{
    ctx.strokeStyle = 'black';

    var x = this.x;
    var y = this.y;

    ctx.drawRobot(x, y, this.dir, Robot.size);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.strokeSemiCircle(x, y, this.dir, this.sensorRadius);
    ctx.strokeLine(x-sin(this.dir)*this.sensorRadius, y+cos(this.dir)*this.sensorRadius,
        x+sin(this.dir)*this.sensorRadius, y-cos(this.dir)*this.sensorRadius);

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
