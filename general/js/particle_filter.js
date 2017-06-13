/**
 * A simulation of Particle Filter --
 * A representation of nonparametric implementation of the Bayes filter
 * @constructor
 * @param {int} particleCount - The total number of particles that can present in a time.
 * @param {OdometryModel} motionModel - The motion model that is used to calculate its motion over time.
 * @param {BeamModel} sensorModel - The sensor model that is used to measure environment over time.
 * @param {RobotState} robotState - The state of the robot while creating the particle filter
 */
function ParticleFilter(particleCount, motionModel, sensorModel, robotState)
{
	this.count = particleCount;
	// Init the array that stores particles
	this.particles = new Array(particleCount);

	this.motionModel = motionModel;
	this.sensorModel = sensorModel;

	if (typeof robotState !== 'undefined')
	{
		// If current robot state is already defined
		// generate initial particles around the robot
		for (var i = particleCount - 1; i >= 0; i--)
		{
			this.particles[i] = new Particle(robotState.x + gaussian()*2, robotState.y+gaussian()*2, gaussian()*TWO_PI, 1);
		}
	} else
	{
		// generate random particles within the map
		var weight = 1.0 / particleCount;
		for (var i = particleCount - 1; i >= 0; i--)
		{
			this.particles[i] = this.newParticle();
		}
	}
}

/**
 * Draws the particles on the context
 * @function
 * @param {Context} ctx - The context that the particles will be drawn on
 */
ParticleFilter.prototype.draw = function (ctx)
{
	this.normalizeWeights();
	for (var i = this.particles.length - 1; i >= 0; i--)
	{
		this.particles[i].draw(ctx);
	}
};

/**
 * Regenerate all particles of the Particle filter
 * @function
 */
ParticleFilter.prototype.regenrateAll = function ()
{
	// generate random particles within the map
	var weight = 1.0 / this.count;
	for (var i = this.count - 1; i >= 0; i--)
	{
		this.particles[i] = this.newParticle();
	}
};

/**
 * Refill all particles of the Particle filter
 * @function
 */
ParticleFilter.prototype.refillAll = function ()
{
	// generate random particles within the map
	var weight = 1.0 / this.count;
	while (this.particles.length < this.count)
	{
		this.particles.push(this.newParticle());
	}
};

/**
 * Return a new random particle
 * @function
 * @return {Particle} newParticle - A random generated particle
 */
ParticleFilter.prototype.newParticle = function ()
{
	return new Particle(this.sensorModel.width * random(),
		this.sensorModel.height * random(), TWO_PI * random(), 1.0);
};

/**
 * Update the state of particles based on the odometry reading
 * @function
 * @param {Odometry} u - The odometry reading from the motion sensor
 * @param {float[]} z - An array of distance reading from the sensor
 */
ParticleFilter.prototype.update = function (u, z)
{
	if (typeof this.motionModel !== 'undefined')
		this.motionUpdate(u);

	if (typeof this.sensorModel !== 'undefined')
		this.sensorUpdate(z);
};

/**
 * Update the state of particles based on the odometry reading
 * @function
 * @param {Odometry} u - The odometry reading from the motion sensor
 */
ParticleFilter.prototype.motionUpdate = function (u)
{
	// Update the state of all particles base on the estimated motion
	for (var i = this.particles.length - 1; i >= 0; i--)
	{
		var p = this.particles[i];
		var state = new RobotState(p.x, p.y, p.dir);
		// Draw sample from p(x_t, u, x_t-1)
		var newState = this.motionModel.sample(u, state);
		p.setState(newState);
	}
};

/**
 * Update the probabilities of particles based on the sensor readings
 * @function
 * @param {float[]} z - An array of distance reading from the sensor
 */
ParticleFilter.prototype.sensorUpdate = function (z)
{
	// Calculate the logs of weights
	for (var i = this.particles.length - 1; i >= 0; i--)
	{
		var p = this.particles[i];
		p.w = this.sensorModel.probability(z, new RobotState(p.x, p.y, p.dir));
	}

	// To ensure the probability is in the range of (0,1)
	// this.normalizeWeights();

	// Resample the particles
	this.normalizeWeights();
	this.resample(1);
};

/**
 * Resample a part of the particles base on input
 * @function
 * @param {float} percent - The ratio of which will be resampled
 */
ParticleFilter.prototype.resample = function (percent)
{
	var z_t = new Array(this.particles.length);

	//Resample percent% of all particles, the rest 20% will be randomly generated
	const m = z_t.length * percent;

	const step = 1.0 / m;

	var cur = random() * step;

	//Running sum
	var cumulativeProbability = this.particles[0].w;
	for (var i = 0, j = 0; i < z_t.length; i++)
	{
		while (j < this.particles.length - 1 && cumulativeProbability < cur)
		{
			j++;
			cumulativeProbability += this.particles[j].w;
		}
		z_t[i] = this.particles[j].clone();
		cur += step;
	}

	// For testing, clone only
	// for (var i = 0; i < z_t.length; i++) {
	// 	z_t[i] = this.particles[i].clone();
	// }

	for (var i = m; i < z_t.length; i++)
	{
		z_t[i] = new Particle(random() * this.sensorModel.width, random() * this.sensorModel.height, random() * TWO_PI, 1);
	}
	this.particles = z_t;
};

/**
 * Normalize the weight of the particles to range (1,0)
 * @function
 */
ParticleFilter.prototype.normalizeWeights = function ()
{
	var sum = 0;
	// Convert logs back to weights
	for (var i = this.particles.length - 1; i >= 0; i--)
	{
		var p = this.particles[i];
		sum += p.w;
	}

	if (sum === 0)
	{
		// If every particle has a probability of 0,
		// just regenrate all particles
		this.regenrateAll();
	} else
	{
		// Otherwise normalize the weights
		this.particles.forEach(function (p)
		{
			p.w /= sum
		});
	}
};
