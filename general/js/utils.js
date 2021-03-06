const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const atan2 = Math.atan2;
const floor = Math.floor;
const ceil = Math.ceil;
const sqrt = Math.sqrt;
const random = Math.random;
const max = Math.max;
const min = Math.min;
const round = Math.round;
const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const ROOT_TWO_PI = sqrt(TWO_PI);

const epsilon = 2.22507e-308;
gaussian.z1 = 0;
gaussian.generate = false;

function gaussian(mu = 0, sigma = 1)
{
	gaussian.generate = !gaussian.generate;

	if (!gaussian.generate)
		return gaussian.z1 * sigma + mu;

	let u1, u2;
	do
	{
		u1 = random();
		u2 = random();
	} while ( u1 <= epsilon );

	let z0;
	z0 = sqrt(-2.0 * Math.log(u1)) * cos(TWO_PI * u2);
	gaussian.z1 = sqrt(-2.0 * Math.log(u1)) * sin(TWO_PI * u2);
	return z0 * sigma + mu;
}

//Bound radian a to interval [-pi, pi]
function boundRadian(a)
{
	// return  a -= TWO_PI * Math.round(a / TWO_PI);
	a %= TWO_PI;
	if (a > Math.PI)
		a -= TWO_PI;
	else if (a < -Math.PI)
		a += TWO_PI;
	return a;
}

// Given three colinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r)
{
	return q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) &&
		q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y);
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r)
{
	// See http://www.geeksforgeeks.org/orientation-3-ordered-points/
	// for details of below formula.
	const val = (q.y - p.y) * (r.x - q.x) -
		(q.x - p.x) * (r.y - q.y);

	if (val === 0) return 0;  // colinear

	return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(l1, l2)
{
	let p1 = l1.s;
	let q1 = l1.t;

	let p2 = l2.s;
	let q2 = l2.t;

	//Broad phase check
	if (p1.x > l2.maxX && q1.x > l2.maxX)
		return false;
	if (p1.x < l2.minX && q1.x < l2.minX)
		return false;

	if (p1.y > l2.maxY && q1.y > l2.maxY)
		return false;
	if (p1.y < l2.minY && q1.y < l2.minY)
		return false;

	// Find the four orientations needed for general and
	// special cases
	const o1 = orientation(p1, q1, p2);
	const o2 = orientation(p1, q1, q2);
	const o3 = orientation(p2, q2, p1);
	const o4 = orientation(p2, q2, q1);

	// General case
	if (o1 !== o2 && o3 !== o4)
		return true;

	// Special Cases
	// p1, q1 and p2 are colinear and p2 lies on segment p1q1
	if (o1 === 0 && onSegment(p1, p2, q1)) return true;

	// p1, q1 and p2 are colinear and q2 lies on segment p1q1
	else if (o2 === 0 && onSegment(p1, q2, q1)) return true;

	// p2, q2 and p1 are colinear and p1 lies on segment p2q2
	else if (o3 === 0 && onSegment(p2, p1, q2)) return true;

	// p2, q2 and q1 are colinear and q1 lies on segment p2q2
	else if (o4 === 0 && onSegment(p2, q1, q2)) return true;

	return false; // Doesn't fall in any of the above cases
}

//Return the intersection of two LINE! (NOT LINE SEGMENTS!)
function intersectionPoint(p1, q1, p2, q2)
{
	let m1 = (q1.y - p1.y) / (q1.x - p1.x);
	let b1 = p1.y - p1.x * m1;

	let m2 = (q2.y - p2.y) / (q2.x - p2.x);
	let b2 = p2.y - p2.x * m2;

	if (p1.x === q1.x)
		return new Point(p1.x, m2 * p1.x + b2);

	if (p2.x === q2.x)
		return new Point(p2.x, m1 * p2.x + b1);

	let x = (b2 - b1) / (m1 - m2);
	let y = m1 * x + b1;
	return new Point(x, y);
}

//We are sort of treating this as a vector...
function Point(x, y)
{
	this.x = x;
	this.y = y;
}

Point.prototype.length = function ()
{
	if (!this.len)
		this.len = Math.sqrt(this.x * this.x + this.y * this.y);
	return this.len;
};

Point.prototype.normalize = function ()
{
	let l = this.length();
	return new Point(this.x / l, this.y / l);
};

Point.prototype.toString = function ()
{
	return "(" + this.x + ", " + this.y + ")";
};

Point.prototype.distanceTo = function (v)
{
	let x = this.x - v.x;
	let y = this.y - v.y;
	return sqrt(x * x + y * y);
};

function distance(x1, y1, x2, y2)
{
	let x = x2 - x1;
	let y = y2 - y1;
	return sqrt(x * x + y * y);
}

//Starting point and ending point
function Line(sx, sy, tx, ty)
{
	//Starting point
	this.s = new Point(sx, sy);
	//Ending point
	this.t = new Point(tx, ty);

	this.minX = min(sx, tx);
	this.maxX = max(sx, tx);

	this.minY = min(sy, ty);
	this.maxY = max(sy, ty);
}


//Probability of getting a from a 0 centered
//gaussian distribution with stdandard deviation b
//Same as table 5.2 on page 123 of Probabilistic Robotics
//2006
function prob_gaussian(a, b)
{
	const variance = b * b;
	return Math.exp(-0.5 * (a * a) / (variance)) / (ROOT_TWO_PI * abs(b));
}

//return log of prob_gaussian(a, b)
function prob_gaussian_log(a, b)
{
	const variance = b * b;
	return (-0.5 * (a * a) / (variance)) - Math.log(ROOT_TWO_PI * abs(b));
}

function RobotState(x, y, dir)
{
	this.x = x;
	this.y = y;
	this.dir = dir;
}

function clearCanvas(canvas)
{
	const ctx = canvas.getContext('2d');
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
}

function smoothenPath(path, windowSize = 10)
{
	let copy = path.slice();

	for (let i = windowSize; i < path.length - windowSize; i++)
	{
		let dx = 0;
		let dy = 0;

		for (let j = i - windowSize; j < i; j++)
		{
			dx += copy[j + 1].x - copy[j].x;
			dy += copy[j + 1].y - copy[j].y;
		}

		for (let j = i + 1; j < i + windowSize; j++)
		{
			dx += copy[j].x - copy[j - 1].x;
			dy += copy[j].y - copy[j - 1].y;
		}

		path[i].x = copy[i - 1].x + dx / windowSize / 2;
		path[i].y = copy[i - 1].y + dy / windowSize / 2;
	}
}

//HTML Helper Methods
function isNumber(event)
{
	return event.charCode >= 48 && event.charCode <= 57;
}

function isDecimal(event)
{
	const target = event.target || event.srcElement;
	return isNumber(event) || (!target.value.includes('.') && event.charCode === 46);
}

function getValue(id)
{
	return Number(document.getElementById(id).value);
}

function getClickLoc(event)
{
	let element = event.target;

	let offsetX = 0, offsetY = 0;

	if (element.offsetParent)
	{
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	x = event.pageX - offsetX;
	y = event.pageY - offsetY;
	return {x: x*window.devicePixelRatio, y: y*window.devicePixelRatio};
}

function refreshSelect()
{
	$('.selectpicker').selectpicker('refresh');
}
