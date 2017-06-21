//meter/pixel scale
var scale = 0.02;

var map;

function setPreview(isPreview)
{
	if (isPreview)
	{
		s1 = canvas.width / getMapScreenSize(map).x;
		s2 = canvas.height / getMapScreenSize(map).y;
		if (s1 > s2)
		{
			dspscale = s2;
		} else
		{
			dspscale = s1;
		}
		scale = 0.02 / dspscale;
	} else
	{
		scale = 0.02;
	}
}

CanvasRenderingContext2D.prototype.drawRobot = function (wx, wy, dir, wsize, isRobot, isPreview)
{
	if (isRobot)
	{
		rcOffsetX = wx;
		rcOffsetY = wy;
		if (map)
		{
			this.drawMap(map, isPreview);
		}
	}
	//The robot's main circle
	this.strokeCircle(wx, wy, wsize);

	this.beginPath();
	//draw a line to show Robot's orientation
	var x = toScreenX(wx);
	var y = toScreenY(wy);
	wsize /= scale;
	this.moveTo(x, y);
	this.lineTo(x + cos(dir) * wsize, y + sin(dir) * wsize);

	this.stroke();
};

CanvasRenderingContext2D.prototype.circle = function (wx, wy, wsize)
{
	return this.arc(toScreenX(wx), toScreenY(wy), wsize / scale, 0, Math.PI * 2);
};

CanvasRenderingContext2D.prototype.semicircle = function (wx, wy, dir, wsize)
{
	return this.arc(toScreenX(wx), toScreenY(wy), wsize / scale, dir-Math.PI/2, dir+Math.PI/2);
};

CanvasRenderingContext2D.prototype.strokeCircle = function (wx, wy, wsize)
{
	this.beginPath();
	this.circle(wx, wy, wsize);
	this.stroke();
};

CanvasRenderingContext2D.prototype.strokeSemiCircle = function (wx, wy, dir, wsize)
{
	this.beginPath();
	this.semicircle(wx, wy, dir, wsize);
	this.stroke();
};

CanvasRenderingContext2D.prototype.drawMap = function (wm)
{
	map = wm;
	for (var i = wm.length - 1; i >= 0; i--)
	{
		var l = wm[i];
		this.strokeLine(l.s.x, l.s.y, l.t.x, l.t.y);
	}

	if (typeof(robotHistory) !== 'undefined'){
		if (robotHistory.length == 0) {
			return;
		}
		for (var i = robotHistory.length-1; i >= 0; i--) {
			this.strokeCircle(robotHistory[i].x, robotHistory[i].y, scale);
		}
		if (robotHistory.length >= 200) {
			robotHistory.shift();
		}
	}
};

CanvasRenderingContext2D.prototype.strokeLine = function (wx1, wy1, wx2, wy2)
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

CanvasRenderingContext2D.prototype.strokeTextWithColorFont = function (text, color, font)
{
	this.strokeStyle = color;
	this.font = font;
	this.textAlign = 'start';
	this.strokeText(text, 10, 20);
};

CanvasRenderingContext2D.prototype.strokePath = function (wpath)
{
	this.beginPath();
	this.moveTo(toScreenX(wpath[0].x), toScreenY(wpath[0].y));
	for (var i = 1; i < wpath.length; i++)
	{
		this.lineTo(toScreenX(wpath[i].x), toScreenY(wpath[i].y));
	}
	this.stroke();
};

CanvasRenderingContext2D.prototype.drawLaserLines = function (n, wx, wy, diroff)
{
	//number of lasers for 360 degrees
	var nLasers = (n-1)*2;

	//Angle between each laser, in radians
	var rad = Math.PI * 2 / nLasers;

	//index of corresponding entry in z
	var i = (diroff + nLasers / 4 + nLasers / 2);
	i = (i + nLasers + nLasers);

	for (var index = 0; index < n; index++, i++)
	{
		//dirOffset is the direction the user's mouse
		//is point at, -n/4 to offset it by 90 degrees,
		//so that laser scan is centered at where the user
		//points to

		//get i stay in bound
		i %= nLasers;

		var dir = i * rad;
		var laserLen = senseRadius;

		//Grey color for a miss
		if (z[index] >= senseRadius)
		{
			this.strokeStyle = 'grey';
		} else
		{
			//distance reported by the laser sensor
			var dist = z[index] + gaussian() * sensorNoise;
			laserLen = min(laserLen, dist);

			//red for a hit
			this.strokeStyle = 'red';
			this.fillStyle = 'red';
			this.beginPath();
			this.circle(wx + cos(dir) * dist, wy + sin(dir) * dist, 2 * scale);
			this.fill();
		}
		this.strokeLine(wx, wy, wx + cos(dir) * laserLen, wy + sin(dir) * laserLen)
	}
};
