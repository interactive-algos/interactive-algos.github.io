const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const atan2 = Math.atan2;
const floor = Math.floor;
const sqrt = Math.sqrt;

function randint(min, max)
{
	min = Math.ceil(min);
	max = floor(max);
	return floor(Math.random() * (max - min)) + min;
}

//return a gaussian distributed random number
function gaussian()
{
	var sum = 0;
	for(var i = 0; i < 12; i ++)
	{
		sum += Math.random();
	}
	return sum - 6;
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