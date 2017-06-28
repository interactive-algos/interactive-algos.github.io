//meter/pixel scale

const requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

window.onerror = function (message, url, lineNo){
	alert('Error: ' + message + '\n' + 'Line Number: ' + lineNo);
    console.log('Error: ' + message + '\n' + 'Line Number: ' + lineNo);
    return true;
};

function View(canvas, scale)
{
	this.canvas = canvas;
	const actualWidth = this.canvas.clientWidth;
	const actualHeight = this.canvas.clientHeight;

	this.canvas.width = actualWidth;
	this.canvas.height = actualHeight;
	this.width = canvas.clientWidth / scale;
	this.height = canvas.clientHeight / scale;

	this.ctx = canvas.getContext('2d');

	this.scale = scale;
	this.offsetX = 0;
	this.offsetY = canvas.clientHeight;

	this.updateTransform();
	this.ctx.lineWidth = 1 / scale;
	this.lockRatio = 0.4;
}

View.prototype.updateTransform = function ()
{
	this.ctx.setTransform(this.scale, 0, 0, -this.scale, this.offsetX, this.offsetY);
};

View.prototype.setOffset = function (x, y)
{
	this.offsetX = x;
	this.offsetY = y;
	this.updateTransform();
};

View.prototype.addOffset = function (dx, dy)
{
	this.offsetX += dx;
	this.offsetY += dy;
	this.updateTransform();
};

View.prototype.setScale = function (scale)
{
	this.scale = scale;
	this.updateTransform();
	this.ctx.lineWidth = 1 / scale;
};

View.prototype.setPreviewScale = function (map)
{
	var size = this.getMapSize(map);
	var s1 = this.canvas.width / size.x;
	var s2 = this.canvas.height / size.y;
	var dspscale = 1;
	if (s1 > s2)
	{
		dspscale = s2;
	} else
	{
		dspscale = s1;
	}
	this.setScale(dspscale);
};

View.prototype.adjustToPoint = function (x, y)
{
	const canvas = this.canvas;
	const lockRatio = this.lockRatio;

	var dx = 0;
	var dy = 0;
	if (x < canvas.width * lockRatio)
	{
		dx = canvas.width * lockRatio - x;
	} else if (x > canvas.width * (1 - lockRatio))
	{
		dx = canvas.width * (1 - lockRatio) - x;
	}
	if (y < canvas.height * lockRatio)
	{
		dy = canvas.height * lockRatio - y;
	} else if (y > canvas.height * (1 - lockRatio))
	{
		dy = canvas.height * (1 - lockRatio) - y;
	}
	this.addOffset(dx, dy);
};


View.prototype.getMapSize = function (map)
{
	var w = 0;
	var h = 0;
	for (i = 0; i < map.length; i++)
	{
		if (map[i].s.x > w)
		{
			w = map[i].s.x;
		}
		if (map[i].s.y > h)
		{
			h = map[i].s.y;
		}
		if (map[i].t.x > w)
		{
			w = map[i].t.x;
		}
		if (map[i].t.y > h)
		{
			h = map[i].t.y;
		}
	}
	return new Point(w, h);
};

View.prototype.colorMap = function (resolution, sensorModel, z, robotDir)
{
	const ctx = this.ctx;
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	var probabilityGrid = sensorModel.calcProbGrid(resolution, robotDir, z,
		this.canvas.width, this.canvas.height, this);

	for (var i = 0; i < probabilityGrid.length; i++)
	{
		for (var j = 0; j < probabilityGrid[i].length; j++)
		{
			var p = probabilityGrid[i][j];
			ctx.fillStyle = 'rgba(' + round(p * 255) + ', 0, ' + (255 - round(p * 255)) + ', 0.5)';
			ctx.fillRect(j * resolution, i * resolution, resolution, resolution);
		}
	}
	ctx.restore();
};

CanvasRenderingContext2D.prototype.drawRobot = function (wx, wy, dir, wsize)
{
	//The robot's main circle
	this.strokeCircle(wx, wy, wsize);

	this.beginPath();
	//draw a line to show Robot's orientation
	this.moveTo(wx, wy);
	this.lineTo(wx + cos(dir) * wsize, wy + sin(dir) * wsize);
	this.stroke();
};

CanvasRenderingContext2D.prototype.circle = function (wx, wy, wsize)
{
	return this.arc(wx, wy, wsize, 0, Math.PI * 2);
};

CanvasRenderingContext2D.prototype.semicircle = function (wx, wy, dir, wsize)
{
	return this.arc(wx, wy, wsize, dir - Math.PI / 2, dir + Math.PI / 2);
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
	this.strokeStyle = 'rgba(0,0,0,1)';
	for (var i = wm.length - 1; i >= 0; i--)
	{
		var l = wm[i];
		this.strokeLine(l.s.x, l.s.y, l.t.x, l.t.y);
	}
};

CanvasRenderingContext2D.prototype.strokeLine = function (x1, y1, x2, y2)
{
	this.beginPath();
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.stroke();
};

CanvasRenderingContext2D.prototype.strokeTextWithColorFont = function (text, color, font, x, y)
{
	this.save();
	this.setTransform(1, 0, 0, 1, 0, 0);
	this.lineWidth = 1;
	this.strokeStyle = color;
	this.font = font;
	this.textAlign = 'start';
	this.strokeText(text, x, y);
	this.restore();
};

CanvasRenderingContext2D.prototype.strokePath = function (wpath)
{
	this.beginPath();
	this.moveTo(wpath[0].x, wpath[0].y);
	for (var i = 1; i < wpath.length; i++)
	{
		this.lineTo(wpath[i].x, wpath[i].y);
	}
	this.stroke();
};

CanvasRenderingContext2D.prototype.drawLaserLines = function (z, wx, wy, dir, sensorRadius)
{
	const n = z.length;

	//number of lasers for 360 degrees
	const nLasers = (n - 1) * 2;

	//Angle between each laser, in radians
	const rad = Math.PI * 2 / nLasers;

	var dirOffset = round(dir / Math.PI / 2 * nLasers);

	//index of corresponding entry in z
	var i = (dirOffset + nLasers / 4 + nLasers / 2);
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
		var laserLen = sensorRadius;

		//Grey color for a miss
		if (z[index] >= sensorRadius)
		{
			this.strokeStyle = 'grey';
		} else
		{
			//distance reported by the laser sensor
			var dist = z[index];
			laserLen = min(laserLen, dist);

			//red for a hit
			this.strokeStyle = 'red';
			this.fillStyle = 'red';
			this.beginPath();
			this.circle(wx + cos(dir) * dist, wy + sin(dir) * dist, 0.02);
			this.fill();
		}
		this.strokeLine(wx, wy, wx + cos(dir) * laserLen, wy + sin(dir) * laserLen)
	}
};

//coordinate converter

//convert x coordinate in world to x coordinate on screen
View.prototype.toScreenX = function (x)
{
	return x * this.scale + this.offsetX;
};

//convert x coordinate on screen to x coordinate in world
View.prototype.toWorldX = function toWorldX(x)
{
	return (x - this.offsetX) / this.scale;
};

//convert y coordinate in world to y coordinate on screen
View.prototype.toScreenY = function (y)
{
	return -y * this.scale + this.offsetY;
};

//convert y coordinate on screen to y coordinate in world
View.prototype.toWorldY = function (y)
{
	// return (canvas.height - y) * scale;
	return -(y - this.offsetY) / this.scale;
};

View.prototype.toWorldCoor = function (coor)
{
	coor.x = this.toWorldX(coor.x);
	coor.y = this.toWorldY(coor.y);
};

View.prototype.toScreenCoor = function (coor)
{
	coor.x = this.toScreenX(coor.x);
	coor.y = this.toScreenY(coor.y);
};

//Functional API, return a new point.
View.prototype.getWorldCoor = function (coor)
{
	return new Point(this.toWorldX(coor.x), this.toWorldY(coor.y));
};

// function getScreenCoor(coor)
// {
// 	return new Point(toScreenX(coor.x), toScreenY(coor.y));
// }
//
// //Functional API, return a new line.
// function getWorldLine(l)
// {
// 	return new Line(toWorldX(l.s.x), toWorldY(l.s.y), toWorldX(l.t.x), toWorldY(l.t.y));
// }
//
// function getScreenLine(l)
// {
// 	return new Line(toScreenX(l.s.x), toScreenY(l.s.y), toScreenX(l.t.x), toScreenY(l.t.y));
// }
