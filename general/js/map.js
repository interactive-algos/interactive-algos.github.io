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

Point.prototype.distanceTo = function(v)
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


function drawMap(m, ctx)
{
    ctx.strokeStyle = 'black';
    for (var i = m.length - 1; i >= 0; i--)
    {
        var l = m[i];
        ctx.beginPath();
        ctx.moveTo(l.s.x, l.s.y);
        ctx.lineTo(l.t.x, l.t.y);
        ctx.stroke();
    }
}


//Scan map at location (x, y), with radius r.
function scan(x, y, r, map, z)
{
	var nLasers = z.length;

    //Radian between each laser
    for(var i = 0; i < nLasers; i ++)
    {
        var dir = Math.PI*2 * i / nLasers;

        var s1 = new Point(x, y);
        var t1 = new Point(x + cos(dir)*r, y + sin(dir)*r);

        //If dir is 90 degrees
        //if i = 1/nLasers or i = (3/4) * nLasers
        //cos(dir) should be 0 in these cases,
        if(i * 4 === nLasers || i * 4 === nLasers * 3)
            t1.x = x;
        else if(i * 2 === nLasers)
            t1.y = y;


        z[i] = r + 100;
        for(var j = 0; j < map.length; j ++)
        {
            if(doIntersect(s1, t1, map[j].s, map[j].t))
            {
                // z[i] = senseRadius;
                var p = intersectionPoint(s1, t1, map[j].s, map[j].t);
                var dist = p.distanceTo(new Point(x, y));
                z[i] = min(z[i], dist);
            }
        }
    }
}