/**
 * A simulation of Beam Model --
 * A representation of Measurement Model
 * @constructor
 * @param {float} a1 - The noise on beam when hit
 * @param {float} sensorRadius - The sensor Radius of the robot
 * @param {Line[]} map - An array of lines that represent the world
 */
function BeamModel(a1, sensorRadius, map)
{
	this.a1 = a1;
	this.map = map;
	let size = getMapSize(map);
	this.width = size.x;
	this.height = size.y;
	this.sensorRadius = sensorRadius;
}

/**
 * The probability for the robot to get a sensor reading "z"
 * when it has a state "state"
 * @function
 * @param {float[]} z - The given reading of measurement sensor
 * @param {RobotState} state - The actual robot state
 * @returns {Number} q - The probability of getting z
 */
BeamModel.prototype.probability = function (z, state)
{
	if(state.x < 0 || state.x > this.width || state.y < 0 || state.y > this.height)
		return 0;
	return Math.exp(this.prob_log(z, state));
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
	if(state.x < 0 || state.x > this.width || state.y < 0 || state.y > this.height)
		return Number.NEGATIVE_INFINITY;
	const m = this.map;

	//Actual sensor data
	let z_true = new Array(z.length);

	//Initialization of the probability
	let q = 0;

	//Obtain the true distances
	scan(state.x, state.y, state.dir, this.sensorRadius, m, z_true);

	//Number of lasers that robot use to sense
	const nLasers = z.length;

	for (let i = 0; i < nLasers; i++)
	{
		// if(z[i] >= this.sensorRadius || z_true[i] >= this.sensorRadius)
		//     continue;
		q += prob_gaussian_log(z[i] - z_true[i], this.a1);
	}
	q /= (nLasers / 2 + 1);

	return q;
};

BeamModel.prototype.calcProbGrid = function (resolution, robotDir, z, width, height, view)
{
	let probs = new Array(Math.ceil(height / resolution));
	// let sum = 0;
	let max = 0;
	let min = 1;
	for (let i = 0; i < probs.length; i++)
	{
		probs[i] = new Array(Math.ceil(width / resolution));
		for (let j = 0; j < probs[i].length; j++)
		{
			let p = this.probability(z, new RobotState(view.toWorldX(j * resolution + resolution / 2),
				view.toWorldY(i * resolution + resolution / 2), robotDir));
			// sum += p;
			max = Math.max(p, max);
			min = Math.min(p, min);
			probs[i][j] = p;
		}
	}

	for (let i = 0; i < probs.length; i++)
	{
		for (let j = 0; j < probs[i].length; j++)
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
 * @param {number} dir0 - The facing direction
 * @param {float} r - The sensor radius
 * @param {Line[]} map - An array of Lines that represents the world
 * @param {float[]} z - The array to store the sensor reading
 */
function scan(x, y, dir0, r, map, z)
{
	dir0 -= Math.PI/2;

	let i = 0;
	for (let index = 0; index < z.length; index++, i++)
	{
		let dir = dir0 + i/(z.length-1) * Math.PI;
		//End points of the laser line
		let s1 = new Point(x, y);
		let t1 = new Point(x + cos(dir) * r, y + sin(dir) * r);

		//If dir is 90 degrees
		//if i = 1/nLasers or i = (3/4) * nLasers
		//cos(dir) should be 0 in these cases,
		if (Math.abs(dir) === HALF_PI || dir === Math.PI+HALF_PI)
			t1.x = x;
		else if (abs(dir) === Math.PI)
			t1.y = y;

		z[index] = r;

		//The laser line
		let laser = new Line(s1.x, s1.y, t1.x, t1.y);
		for (let j = 0; j < map.length; j++)
		{
			if (doIntersect(laser, map[j]))
			{
				let p = intersectionPoint(s1, t1, map[j].s, map[j].t);
				let dist = p.distanceTo(new Point(x, y));
				z[index] = min(z[index], dist);
			}
		}
	}
}
