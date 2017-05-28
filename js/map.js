//We are sort of treating this as a vector...
function Point(x, y)
{
	this.x = x;
	this.y = y;
}

Point.prototype.length = function()
{
	if(!this.len)
		this.len = Math.sqrt(this.x*this.x + this.y*this.y);
	return this.len;
};

Point.prototype.normalize = function()
{
	var l = this.length();
	return new Point(this.x/l, this.y/l);
};

Point.prototype.toString = function()
{
	return "(" + this.x + ", " + this.y + ")";
};

Point.prototype.distance = function(v)
{
	var x = this.x - v.x;
	var y = this.y - v.y;
	return Math.sqrt(x * x + y * y);
};

Point.distance = function(pt1, pt2)
{
	var x = pt1.x - pt2.x;
	var y = pt1.y - pt2.y;
	return Math.sqrt(x*x + y*y);
};

//Starting point and ending point
function Line(sx, sy, tx, ty)
{
	//Starting point
	this.s = new Point(sx, sy);
	//Ending point
	this.t = new Point(tx, ty);
}