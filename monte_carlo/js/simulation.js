const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const atan2 = Math.atan2;
const floor = Math.floor;
const sqrt = Math.sqrt;
const random = Math.random;

function randint(min, max)
{
	min = Math.ceil(min);
	max = floor(max);
	return floor(Math.random() * (max - min)) + min;
}

//return a gaussian distributed random number
function gaussian()
{
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

//Bound radian a to interval [-pi, pi]
function boundRadian(a)
{
	a %= Math.PI*2;
	if(a > Math.PI)
		a -= 2*Math.PI;
	else if(a < -Math.PI)
		a += 2*Math.PI;
	return a;
}


//convert x coordinate in world to x coordinate on screen
function convertX(x)
{
    return floor(x/scale);
}

//convert y coordinate in world to y coordinate on screen
function convertY(y)
{
    return floor(canvas.height - y/scale);
}