//meter/pixel scale
var scale = 0.02;

CanvasRenderingContext2D.prototype.drawRobot = function (x, y, dir, size)
{
    //The robot's main circle
    this.strokeCircle(x, y, size);

    this.beginPath();
    //draw a line to show Robot's orientation
    this.moveTo(toScreenX(x), toScreenY(y));
    this.lineTo(toScreenX(x) + cos(dir)*size, toScreenY(y) + sin(dir)*size);

    this.stroke();
};

CanvasRenderingContext2D.prototype.circle = function(x, y, size)
{
    return this.arc(toScreenX(x), toScreenY(y), size, 0, Math.PI*2);
};

CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, size)
{
    this.beginPath();
    this.circle(x, y, size);
    this.stroke();
};

// m is in World Coor
CanvasRenderingContext2D.prototype.drawMap = function(m)
{
    for (var i = m.length - 1; i >= 0; i--)
    {
        var l = m[i];
        this.strokeLine(l.s.x, l.s.y, l.t.x, l.t.y);
    }
};

CanvasRenderingContext2D.prototype.strokeLine = function(x1, y1, x2, y2)
{

    x1 = toScreenX(x1);
    y1 = toScreenY(y1);
    x2 = toScreenX(x2);
    y2 = toScreenY(y2);
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

CanvasRenderingContext2D.prototype.strokePath = function(path)
{
    this.beginPath();
    this.moveTo(toScreenX(path[0].x), toScreenY(path[0].y));
    for(var i = 1; i < path.length; i ++)
    {
        this.lineTo(toScreenX(path[i].x), toScreenY(path[i].y));
    }
    this.stroke();
};

CanvasRenderingContext2D.prototype.drawLaserLines = function (n, x, y, diroff)
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
            this.circle(x + cos(dir)*dist, y + sin(dir)*dist, 5);
            this.fill();
        }
        this.strokeLine(x, y, x + cos(dir)*laserLen, y + sin(dir)*laserLen)
    }
}
