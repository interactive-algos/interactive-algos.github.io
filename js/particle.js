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
	var x = floor(this.x);
	var y = floor(this.y);

	ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
	ctx.beginPath();
	ctx.arc(x, y, Particle.size, 0, Math.PI * 2, true);
	ctx.moveTo(x, y);
	ctx.lineTo(floor(this.x + cos(this.dir) * Particle.size), floor(this.y + sin(this.dir) * Particle.size));
	ctx.stroke();
};

//Set particle's state to state x
Particle.prototype.setState = function(robotState)
{
	this.x = robotState.x;
	this.y = robotState.y;
	this.dir = robotState.dir;
};

Particle.size = 3;