/**
 * A simulation of Particle Filter --
 * A representation of nonparametric implementation of the Bayes filter
 * @constructor
 * @param {int} particleCount - The total number of particles that can present in a time.
 * @param {OdometryModel} motionModel - The motion model that is used to calculate its motion over time.
 * @param {BeamModel} sensorModel - The sensor model that is used to measure environment over time.
 * @param {RobotState} robotState - The state of the robot while creating the particle filter
 * @param {number} resampleRatio - The percentage of the particles that will be resampled
 */
function ParticleFilter(particleCount, motionModel, sensorModel, robotState, resampleRatio)
{
	this.count = particleCount;
	// Init the array that stores particles
	this.particles = new Array(particleCount);

	this.motionModel = motionModel;
	this.sensorModel = sensorModel;
	this.resampleRatio = resampleRatio;

	if (typeof sensorModel !== 'undefined')
	{
		// If there is sensor mode, add noise
		for (let i = particleCount - 1; i >= 0; i--)
		{
			this.particles[i] = new Particle(gaussian(robotState.x, 1),
				gaussian(robotState.y, 1),
				gaussian(robotState.dir, Math.PI/4), 0);
		}
	} else
	{
		for (let i = particleCount - 1; i >= 0; i--)
		{
			this.particles[i] = new Particle(robotState.x, robotState.y, robotState.dir, 0);
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
	this.particles.forEach((p) => p.draw(ctx));
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
 * Regenerate all particles of the Particle filter
 * @function
 */
ParticleFilter.prototype.regenrateAll = function ()
{
	// generate random particles within the map
	let weight = 1.0 / this.count;
	for (let i = this.count - 1; i >= 0; i--)
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
	let weight = 1.0 / this.count;
	while (this.particles.length < this.count)
	{
		this.particles.push(this.newParticle());
	}
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
	for (let i = this.particles.length - 1; i >= 0; i--)
	{
		let p = this.particles[i];
		// let state = new RobotState(p.x, p.y, p.dir);
		// Draw sample from p(x_t, u, x_t-1)
		let newState = this.motionModel.sample(u, p);
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
	for (let i = this.particles.length - 1; i >= 0; i--)
	{
		let p = this.particles[i];
		p.w = this.sensorModel.probability(z, p);
	}

	// To ensure the probability is in the range of (0,1)
	// this.normalizeWeights();

	// Resample the particles
	this.normalizeWeights();
	this.resample();
};

/**
 * Resample a part of the particles base on input
 * @function
 */
ParticleFilter.prototype.resample = function ()
{
	let z_t = new Array(this.particles.length);

	//Resample percent% of all particles, the rest will be randomly generated
	const m = z_t.length * this.resampleRatio;

	const step = 1.0 / m;

	let cur = random() * step;

	//Running sum
	let cumulativeProbability = this.particles[0].w;
	for (let i = 0, j = 0; i < m; i++)
	{
		while (j < this.particles.length - 1 && cumulativeProbability < cur)
		{
			j++;
			cumulativeProbability += this.particles[j].w;
		}
		z_t[i] = this.particles[j].clone();
		cur += step;
	}

	for (let i = m; i < z_t.length; i++)
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
	let sum = 0;
	// Convert logs back to weights
	this.particles.forEach((p) => sum += p.w);

	if (sum === 0)
	{
		// If every particle has a probability of 0,
		// just regenrate all particles
		this.regenrateAll();
	} else
	{
		// Otherwise normalize the weights
		this.particles.forEach((p) => p.w /= sum);
	}
};
