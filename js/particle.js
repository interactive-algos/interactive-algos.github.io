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
	var x = Math.floor(this.x);
	var y = Math.floor(this.y);

	ctx.strokeStyle = 'rgba(0, 0, 255, 0.05)';
	ctx.beginPath();
	ctx.arc(x, y, Particle.size, 0, Math.PI * 2, true);
	ctx.moveTo(x, y);
	ctx.lineTo(Math.floor(this.x + cos(this.dir) * Particle.size), Math.floor(this.y + sin(this.dir) * Particle.size));
	ctx.stroke();
}

Particle.size = 3;