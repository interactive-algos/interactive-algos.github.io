function Particle(x, y, dir, weight)
{
	//coordinates
	this.x = x;
	this.y = y;			

	//direction of robot
	this.dir = dir;

	//weight of this particle
	this.w = weight;
}

Particle.prototype.draw = function(ctx)
{
    var x = round(this.x);
    var y = round(this.y);

	ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.drawRobot(x, y, -this.dir, Particle.size);
};

//Set particle's state to state x
Particle.prototype.setState = function(robotState)
{
	this.x = robotState.x;
	this.y = robotState.y;
	this.dir = robotState.dir % (TWO_PI);
};

Particle.size = 0.08;