//meter/pixel scale

const requestAnimationFrame = window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame;

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const pixelRatio = window.devicePixelRatio;

function View(canvas, scale)
{
	this.canvas = canvas;
	const actualWidth = this.canvas.clientWidth * pixelRatio;
	const actualHeight = this.canvas.clientHeight * pixelRatio;

	this.canvas.width = actualWidth;
	this.canvas.height = actualHeight;
	this.canvas.style.width = actualWidth / pixelRatio;
	this.canvas.style.height = actualHeight / pixelRatio;
	this.width = canvas.width / scale;
	this.height = canvas.height / scale;

	this.ctx = canvas.getContext('2d');

	this.scale = scale;
	this.offsetX = 0;
	this.offsetY = this.canvas.height;

	this.updateTransform();
	this.ctx.lineWidth = pixelRatio / scale;

	const self = this;
	this.isPreview = true;
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
	this.scale = scale * pixelRatio;
	this.updateTransform();
	this.ctx.lineWidth = 1 / scale;
	this.isPreview = false;
};

View.prototype.setPreviewScale = function (map)
{
	this.setScale(this.getPreviewScale(map));
	this.setOffset(0, this.canvas.height);
	this.isPreview = true;
};

View.prototype.getPreviewScale = function (map)
{
	let size = getMapSize(map);
	let s1 = this.canvas.clientWidth / size.x;
	let s2 = this.canvas.clientHeight / size.y;
	let dspscale = 1;
	if (s1 > s2)
	{
		dspscale = s2;
	} else
	{
		dspscale = s1;
	}
	return dspscale;
};

View.prototype.adjustToPoint = function (x, y, lockRatio)
{
	if (typeof lockRatio === 'undefined')
		lockRatio = 0.4;
	x = this.toScreenX(x);
	y = this.toScreenY(y);
	const canvas = this.canvas;

	let dx = 0;
	let dy = 0;
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

View.prototype.recenter = function (x, y)
{
	this.setOffset(0, 0);
	let screenX = this.toScreenX(x);
	let screenY = this.toScreenY(y);
	this.setOffset(-screenX + this.canvas.width / 2, -screenY + this.canvas.height / 2);
};

function getMapSize(map)
{
	let w = 0;
	let h = 0;
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
}

View.prototype.colorMap = function (resolution, sensorModel, z, robotDir)
{
	let probabilityGrid = sensorModel.calcProbGrid(resolution, robotDir, z,
		this.canvas.width, this.canvas.height, this);
	this.drawProbabilityGrid(probabilityGrid, resolution);
};

View.prototype.drawProbabilityGrid = function (probabilityGrid, resolution)
{
	const ctx = this.ctx;
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	for (let i = 0; i < probabilityGrid.length; i++)
	{
		for (let j = 0; j < probabilityGrid[i].length; j++)
		{
			let p = probabilityGrid[i][j];
			ctx.fillStyle = 'rgba(' + round(p * 255) + ', 0, ' + (255 - round(p * 255)) + ', 0.5)';
			ctx.fillRect(j * resolution, i * resolution, resolution, resolution);
		}
	}
	ctx.restore();
};

View.prototype.drawGrid = function ()
{
	if (this.isPreview) return;
	const ctx = this.canvas.getContext('2d');
	const w = ceil(this.toWorldX(this.canvas.width));
	const h = ceil(this.toWorldY(0));
	ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
	for (let j = floor(this.toWorldX(0)); j < w; j++)
	{
		for (let i = floor(this.toWorldY(this.canvas.height)); i < h; i++)
		{
			ctx.fillCircle(j, i, 0.05);
		}
	}
};

function ColorizeManager(view, progressCallback, finishCallback)
{
	this.view = view;
	this.progressCallback = progressCallback;
	this.finishCallback = finishCallback;
}

ColorizeManager.prototype.start = function (resolution, sensorModel, z, dir)
{
	this.i = 0;
	this.j = 0;
	this.max = 0;
	this.min = 1;

	this.sensorModel = sensorModel;
	this.resolution = resolution;
	this.z = z;
	this.dir = dir;
	this.probs = new Array(Math.ceil(this.view.canvas.height / resolution));
	for (let i = 0; i < this.probs.length; i++)
	{
		this.probs[i] = new Array(Math.ceil(this.view.canvas.width / resolution));
	}
	const self = this;
	requestAnimationFrame(function (timestamp)
	{
		self.tick(timestamp)
	});
};

ColorizeManager.prototype.tick = function (timestamp)
{
	const view = this.view;
	const probs = this.probs;
	const resolution = this.resolution;
	const z = this.z;
	let shouldSave = false;

	for (let i = this.i; i < probs.length; i++)
	{
		for (let j = this.j; j < probs[i].length; j++)
		{
			if (shouldSave)
			{
				this.i = i;
				this.j = j;

				let total = probs.length * probs[0].length;
				this.progressCallback((i * j) / total);

				const self = this;
				requestAnimationFrame(function (timestamp)
				{
					self.tick(timestamp)
				});
				return;
			}
			let p = this.sensorModel.probability(z, new RobotState(view.toWorldX(j * resolution + resolution / 2),
				view.toWorldY(i * resolution + resolution / 2), this.dir));

			this.max = Math.max(p, this.max);
			this.min = Math.min(p, this.min);
			probs[i][j] = p;
			shouldSave = Date.now() - timestamp > 1000.0 / 30.0;
		}
		this.j = 0;
	}

	for (i = 0; i < probs.length; i++)
	{
		for (j = 0; j < probs[i].length; j++)
		{
			probs[i][j] -= this.min;
			probs[i][j] /= (this.max - this.min);
			// console.assert(!isNaN(probs[i][j]));
		}
	}
	this.progressCallback(1);
	this.finishCallback(probs, resolution);
};

CanvasRenderingContext2D.prototype.drawRobot = function (wx, wy, dir, wsize)
{
	//The robot's main circle
	this.strokeCircle(wx, wy, wsize);

	this.beginPath();
	//draw a line to show Robot's orientation
	this.moveTo(wx, wy);
	this.lineTo(wx + cos(dir) * wsize * 2, wy + sin(dir) * wsize * 2);
	this.stroke();
};

CanvasRenderingContext2D.prototype.drawRect = function (x1, y1, x2, y2)
{
	this.strokeLine(x1, y1, x2, y1);
	this.strokeLine(x1, y1, x1, y2);
	this.strokeLine(x2, y2, x2, y1);
	this.strokeLine(x2, y2, x1, y2);
};

CanvasRenderingContext2D.prototype.circle = function (wx, wy, wsize)
{
	return this.arc(wx, wy, wsize, 0, Math.PI * 2);
};

CanvasRenderingContext2D.prototype.semicircle = function (wx, wy, dir, wsize)
{
	return this.arc(wx, wy, wsize, dir - Math.PI / 2, dir + Math.PI / 2);
};

CanvasRenderingContext2D.prototype.fillCircle = function (wx, wy, wsize)
{
	this.beginPath();
	this.circle(wx, wy, wsize);
	this.fill();
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
	this.strokeStyle = 'black';
	for (let i = wm.length - 1; i >= 0; i--)
	{
		let l = wm[i];
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

CanvasRenderingContext2D.prototype.fillTextWithColorFont = function (text, color, font, x, y)
{
	this.save();
	this.setTransform(1, 0, 0, 1, 0, 0);
	this.lineWidth = 1;
	this.fillStyle = color;
	this.font = font;
	this.textAlign = 'start';
	this.fillText(text, x, y);
	this.restore();
};

CanvasRenderingContext2D.prototype.strokePath = function (wpath)
{
	this.beginPath();
	this.moveTo(wpath[0].x, wpath[0].y);
	for (let i = 1; i < wpath.length; i++)
	{
		this.lineTo(wpath[i].x, wpath[i].y);
	}
	this.stroke();
};

CanvasRenderingContext2D.prototype.forEachLaser = function (z, dir, sensorRadius, callback)
{
	const n = z.length;

	//Angle between each laser, in radians
	const rad = Math.PI / (n - 1);

	//First laser is 90 degrees before
	dir -= Math.PI / 2;

	for (let i = 0; i < n; i++, dir += rad)
	{
		let laserLen = sensorRadius;

		//Grey color for a miss
		if (z[i] === sensorRadius)
		{
			this.fillStyle = this.strokeStyle = 'grey';
			callback(dir, laserLen, false);
		} else
		{
			//distance reported by the laser sensor
			let dist = z[i];
			laserLen = min(laserLen, dist);

			//red for a hit
			this.fillStyle = this.strokeStyle = 'red';
			callback(dir, laserLen, true);
		}
	}
};

CanvasRenderingContext2D.prototype.drawLaserLines = function (z, wx, wy, dir, sensorRadius, showMiss = false)
{
	const self = this;
	this.forEachLaser(z, dir, sensorRadius, (laserDir, laserLen, isHit) =>
	{
		if(!isHit && !showMiss)return;
		self.strokeLine(wx, wy, wx + cos(laserDir) * laserLen, wy + sin(laserDir) * laserLen);
	});
};

CanvasRenderingContext2D.prototype.drawLaserDots = function (z, wx, wy, dir, sensorRadius, showMiss = false)
{
	const self = this;
	this.forEachLaser(z, dir, sensorRadius, (laserDir, laserLen, isHit) =>
	{
		if(!isHit && !showMiss)return;
		self.fillCircle(wx + cos(laserDir)*laserLen, wy + sin(laserDir)*laserLen, 0.05);
	});
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
