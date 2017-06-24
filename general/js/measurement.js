/**
 * A simulation of Beam Model --
 * A representation of Measurement Model
 * @constructor
 * @param {float} a1 - The noise on beam when hit
 * @param {float} sensorRadius - The sensor Radius of the robot
 * @param {Line[]} map - An array of lines that represent the world
 * @param {int} width - The width of the map
 * @param {int} height - The height of the map
 */
function BeamModel(a1, sensorRadius, map, width, height)
{
	this.a1 = a1;
	this.map = map;
	this.width = width;
	this.height = height;
	this.sensorRadius = sensorRadius;
}

/**
 * The probability for the robot to get a sensor reading "z"
 * when it has a state "state"
 * @function
 * @param {float[]} z - The given reading of measurement sensor
 * @param {RobotState} state - The actual robot state
 * @returns {float} q - The probability of getting z
 */
BeamModel.prototype.probability = function (z, state)
{
	if (state.x < 0 || state.y < 0 || state.x >= this.width || state.y >= this.height)
		return 0;

	const m = this.map;

	//Actual sensor data
	var z_true = new Array(z.length);

	//Initialization of the probability
	var q = 0;

	//Obtain the true distances
	scan(state.x, state.y, state.dir, this.sensorRadius, m, z_true);

	//Number of lasers that robot use to sense
	const nLasers = z.length;

	for (var i = 0; i < nLasers; i++)
	{
		// if(z[i] >= this.sensorRadius || z_true[i] >= this.sensorRadius)
		//     continue;
		console.assert(typeof z[i] !== 'undefined');
		q += Math.log(prob_gaussian(z[i] - z_true[i], this.a1));
	}
	q /= (nLasers / 2 + 1);

	return Math.exp(q);
};

/**
 * The log of probability for the robot to get a sensor reading "z"
 * when it has a state "state"
 * @function
 * @param {float[]} z - The given reading of measurement sensor
 * @param {RobotState} state - The actual robot state
 * @returns {number} q - The log of probability of getting z
 */
BeamModel.prototype.prob_log = function (z, state)
{
	if (state.x < 0 || state.y < 0 || state.x >= this.width || state.y >= this.height)
		return Number.NEGATIVE_INFINITY;

	const m = this.map;

	var z_true = new Array(z.length);

	var q = 0;

	//Obtain the true distances
	scan(state.x, state.y, state.dir, this.sensorRadius, m, z_true);

	//Number of lasers that robot use to sense
	const nLasers = z.length;

	for (var i = 0; i < nLasers; i++)
	{
		// if(z[i] > this.senseRadius || z_true[i] > this.sensorRadius)
		//     continue;
		i %= nLasers;
		q += prob_gaussian_log(z[i] - z_true[i], this.a1);
	}
	return q / (nLasers / 2 + 1);
};

BeamModel.prototype.calcProbGrid = function (resolution, robotDir, z, width, height, view)
{
	var probs = new Array(Math.ceil(height / resolution));
	// var sum = 0;
	var max = 0;
	var min = 1;
	for (var i = 0; i < probs.length; i++)
	{
		probs[i] = new Array(Math.ceil(width / resolution));
		for (var j = 0; j < probs[i].length; j++)
		{
			var p = this.probability(z, new RobotState(view.toWorldX(j * resolution + resolution / 2),
				view.toWorldY(i * resolution + resolution / 2), robotDir));
			// sum += p;
			max = Math.max(p, max);
			min = Math.min(p, min);
			probs[i][j] = p;
		}
	}

	for (var i = 0; i < probs.length; i++)
	{
		for (var j = 0; j < probs[i].length; j++)
		{
			probs[i][j] -= min;
			probs[i][j] /= (max - min);
		}
	}
	return probs;
};

/**
 * Scans the map in (x,y); with direction of dir0;
 * with sensor radius of r; And assign the result into z.
 * @function
 * @param {int} x - X Coordinate
 * @param {int} y - Y Coordinate
 * @param {float} dir0 - The facing direction
 * @param {float} r - The sensor radius
 * @param {Line[]} map - An array of Lines that represents the world
 * @param {float[]} z - The array to store the sensor reading
 */
function scan(x, y, dir0, r, map, z)
{
	var nLasers = (z.length-1)*2;
	const dirOffset = Math.round(dir0 / TWO_PI * nLasers);
	var i = (dirOffset - nLasers / 4);
	i += nLasers + nLasers;

	// for (var i = 0; i < nLasers; i++)
	for (var index = 0; index <= nLasers / 2; index++, i++)
	{
		i %= nLasers;
		var dir = TWO_PI * i / nLasers;

		//End points of the laser line
		var s1 = new Point(x, y);
		var t1 = new Point(x + cos(dir) * r, y + sin(dir) * r);

		//If dir is 90 degrees
		//if i = 1/nLasers or i = (3/4) * nLasers
		//cos(dir) should be 0 in these cases,
		if (i * 4 === nLasers || i * 4 === nLasers * 3)
			t1.x = x;
		else if (i * 2 === nLasers)
			t1.y = y;

		z[index] = r;
		for (var j = 0; j < map.length; j++)
		{
			if (doIntersect(s1, t1, map[j].s, map[j].t))
			{
				var p = intersectionPoint(s1, t1, map[j].s, map[j].t);
				var dist = p.distanceTo(new Point(x, y));
				z[index] = min(z[index], dist);
			}
		}
	}
}
