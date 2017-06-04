
/*Costructor of robot; 
*filter for calculating bel base on measurement and control data
*path as the path that robot is going to take
*/
function Robot(filter, path)
{
    if (typeof(dir) === 'undefined') dir = 0;
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
}

Robot.size = 0.2;
Robot.sensorRadius = 1.5;
Robot.scanInterval = 2500;
Robot.stride = 0.01;
Robot.sensorNoise = 0.01;
const EPS = 1E-5;

Robot.prototype.setStrideNoise = function(noise)
{
    this.filter.motionModel.a2 = noise;
};

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

    var x = this.x;
    var y = this.y;

    ctx.drawRobot(x, y, -this.dir, Robot.size/scale);

    ctx.strokeStyle = 'rgba(0, 0, 255, '+ (1-this.senseCircle/Robot.sensorRadius) +')';

    //draw Robot's sensing circle
    ctx.strokeCircle(x, y, this.senseCircle/scale);

    this.filter.draw(ctx);
};