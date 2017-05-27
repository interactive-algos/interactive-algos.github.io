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
	ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
	ctx.beginPath();
	ctx.arc(this.x, this.y, Particle.size, 0, Math.PI * 2, true);
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x + cos(this.dir) * Particle.size, this.y + sin(this.dir) * Particle.size)
	ctx.stroke();
}

Particle.size = 6;