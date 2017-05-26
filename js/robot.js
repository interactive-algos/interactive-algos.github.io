function Robot(x, y, dir = 0)
{
	this.x = x;		//x coordinate
	this.y = y;		//y coordinate
	this.dir = 0;	//orientation in radians
}

Robot.size = 10;
let cos = Math.cos;
let sin = Math.sin;

Robot.prototype.draw = function(ctx)
{
	ctx.strokestyle = 'black';
	ctx.beginPath();
	ctx.arc(this.x, this.y, Robot.size, 0, Math.PI * 2, true);
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x + cos(this.dir) * Robot.size, this.y + sin(this.dir) * Robot.size)
	ctx.stroke();
}