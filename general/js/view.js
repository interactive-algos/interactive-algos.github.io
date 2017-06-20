//meter/pixel scale
var scale = 0.02;

var map;

CanvasRenderingContext2D.prototype.drawRobot = function (wx, wy, dir, wsize, isRobot)
{
    if (isRobot) {
        rcOffsetY = wy;
        rcOffsetX = wx;
        if (map) {
            this.drawMap(map);
        }
    }
    //The robot's main circle
    this.strokeCircle(wx, wy, wsize);

    this.beginPath();
    //draw a line to show Robot's orientation
    this.moveTo(toScreenX(wx), toScreenY(wy));
    this.lineTo(toScreenX(wx) + cos(dir)*wsize/scale, toScreenY(wy) + sin(dir)*wsize/scale);

    this.stroke();
};

CanvasRenderingContext2D.prototype.circle = function(wx, wy, wsize)
{
    return this.arc(toScreenX(wx), toScreenY(wy), wsize/scale, 0, Math.PI*2);
};

CanvasRenderingContext2D.prototype.strokeCircle = function(wx, wy, wsize)
{
    this.beginPath();
    this.circle(wx, wy, wsize);
    this.stroke();
};

// m is in World Coor
CanvasRenderingContext2D.prototype.drawMap = function(wm)
{
    map = wm;
    for (var i = wm.length - 1; i >= 0; i--)
    {
        var l = wm[i];
        this.strokeLine(l.s.x, l.s.y, l.t.x, l.t.y);
    }
};

CanvasRenderingContext2D.prototype.strokeLine = function(wx1, wy1, wx2, wy2)
{

    var x1 = toScreenX(wx1);
    var y1 = toScreenY(wy1);
    var x2 = toScreenX(wx2);
    var y2 = toScreenY(wy2);
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke();
};

CanvasRenderingContext2D.prototype.strokeTextWithColorFont = function(text, color, font)
{
	this.strokeStyle = color;
	this.font = font;
	this.textAlign = 'start';
	this.strokeText(text, 10, 20);
};

CanvasRenderingContext2D.prototype.strokePath = function(wpath)
{
    this.beginPath();
    this.moveTo(toScreenX(wpath[0].x), toScreenY(wpath[0].y));
    for(var i = 1; i < wpath.length; i ++)
    {
        this.lineTo(toScreenX(wpath[i].x), toScreenY(wpath[i].y));
    }
    this.stroke();
};

CanvasRenderingContext2D.prototype.drawLaserLines = function (n, wx, wy, diroff)
{
    //Angle between each laser, in radians
    var rad = Math.PI*2/n;

    //index of corresponding entry in z
    var i = (diroff + n/4 + n/2);
    i = (i+n+n);

    for(var index = 0; index <= n/2; index ++, i++)
    {
        //dirOffset is the direction the user's mouse
        //is point at, -n/4 to offset it by 90 degrees,
        //so that laser scan is centered at where the user
        //points to

        //get i stay in bound
        i %= n;

        var dir = i * rad;
        var laserLen = senseRadius;

        //Grey color for a miss
        if(z[i] >= senseRadius)
        {
            this.strokeStyle = 'grey';
        }else
        {
            //distance reported by the laser sensor
            var dist = z[i] + gaussian()*sensorNoise;
            laserLen = min(laserLen, dist);

            //red for a hit
            this.strokeStyle = 'red';
            this.fillStyle = 'red';
            this.beginPath();
            this.circle(wx + cos(dir)*dist, wy + sin(dir)*dist, 5);
            this.fill();
        }
        this.strokeLine(wx, wy, wx + cos(dir)*laserLen, wy + sin(dir)*laserLen)
    }
}
