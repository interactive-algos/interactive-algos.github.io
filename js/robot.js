function Robot(x, y, dir = 0)
{
	this.x = x;		//x coordinate
	this.y = y;		//y coordinate
	this.dir = dir;	//orientation in radians

	this.lastScan = Date.now();
	this.senseCircle = 10 + 5;
}

Robot.size = 10;
Robot.sensorRadius = 100;
Robot.scanInterval = 2000;

let cos = Math.cos;
let sin = Math.sin;

Robot.prototype.draw = function(ctx)
{
	ctx.strokeStyle = 'black';
	ctx.beginPath();

	//The robot's main circle
	ctx.arc(this.x, this.y, Robot.size, 0, Math.PI * 2, true);
	ctx.moveTo(this.x, this.y);

	//draw a line to show Robot's orientation
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x + cos(this.dir) * Robot.size, this.y + sin(this.dir) * Robot.size)
	ctx.moveTo(this.x, this.y);

	ctx.stroke();

	if(this.senseCircle > Robot.sensorRadius)
	{
		if(Date.now() - this.lastScan < Robot.scanInterval)
			return;
		this.senseCircle %= Robot.sensorRadius;
		this.lastScan = Date.now();
	}

	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	//draw Robot's sensing circle
	ctx.arc(this.x, this.y, this.senseCircle, 0, Math.PI*2, false);
	ctx.stroke();


	this.senseCircle += 2;
}