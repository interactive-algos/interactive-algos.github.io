const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const atan2 = Math.atan2;
const floor = Math.floor;
const sqrt = Math.sqrt;
const random = Math.random;
const max = Math.max;
const min = Math.min;
const round = Math.round;

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

    return (val > 0)? 1: 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2)
{
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
	var m1 = (q1.y-p1.y)/(q1.x-p1.x);
	var b1 = p1.y - p1.x*m1;

    var m2 = (q2.y-p2.y)/(q2.x-p2.x);
    var b2 = p2.y - p2.x*m2;

    if(p1.x === q1.x)
		return new Point(p1.x, m2*p1.x + b2);

    if(p2.x === q2.x)
		return new Point(p2.x, m1*p2.x + b1);

    var x = (b2 - b1) / (m1 - m2);
    var y = m1*x + b1;
    return new Point(x, y);
}