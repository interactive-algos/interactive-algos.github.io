let cos = Math.cos;
let sin = Math.sin;
let abs = Math.abs;
let atan = Math.atan;
let atan2 = Math.atan2;
let floor = Math.floor;
let sqrt = Math.sqrt;

function getRandomInt(min, max) 
{
	min = Math.ceil(min);
	max = floor(max);
	return floor(Math.random() * (max - min)) + min;
}

function gaussian() 
{
	return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}
