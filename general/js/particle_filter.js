/**
 * Created by kelvinzhang on 5/28/17.
 */

/**
 * A simulation of Particle Filter --
 * A representation of nonparametric implementation of the Bayes filter
 * @constructor
 * @param {int} particleCount - The total number of particles that can present in a time.
 * @param {OdometryModel} motionModel - The motion model that is used to calculate its motion over time.
 * @param {BeamModel} sensorModel - The sensor model that is used to measure environment over time.
 * @param {RobotState} robotState - The state of the robot while creating the particle filter
 */
function ParticleFilter(particleCount, motionModel, sensorModel, robotState){
    this.count = particleCount;
    // Init the array that stores particles
    this.particles = new Array(particleCount);

    this.motionModel = motionModel;
    this.sensorModel = sensorModel;

    if(typeof robotState !== 'undefined'){
        // If current robot state is already defined
        // generate initial particles around the robot
        for (var i = particleCount - 1; i >= 0; i--){
            this.particles[i] = new Particle(robotState.x, robotState.y, robotState.dir, 1);
        }
    }else{
    	// generate random particles within the map
        var weight = 1.0/particleCount;
        for (var i = particleCount - 1; i >= 0; i--){
            this.particles[i] = this.newParticle();
        }
    }
}

/**
 * Draws the particles on the context
 * @function
 * @param {Context} ctx - The context that the particles will be drawn on
 */
ParticleFilter.prototype.draw = function(ctx){
    for (var i = this.particles.length - 1; i >= 0; i--){
        this.particles[i].draw(ctx);
    }
};

/**
 * Regenerate all particles of the Particle filter
 * @function
 */
ParticleFilter.prototype.regenrateAll = function() {
    // generate random particles within the map
    var weight = 1.0/this.count;
    for (var i = this.count - 1; i >= 0; i--){
        this.particles[i] = this.newParticle();
    }
}

/**
 * Refill all particles of the Particle filter
 * @function
 */
ParticleFilter.prototype.refillAll = function() {
    // generate random particles within the map
    var weight = 1.0/this.count;
    while (this.particles.length < this.count){
        this.particles.push(this.newParticle());
    }
}

/**
 * Return a new random particle
 * @function
 */
ParticleFilter.prototype.newParticle = function() {
    return new Particle(this.sensorModel.width*random(), 
            this.sensorModel.height*random(), TWO_PI*random(), 1.0);
}

/**
 * Update the state of particles based on the odometry reading
 * @function
 * @param {Odometry} u - The odometry reading from the motion sensor
 * @param {float[]} z - An array of distance reading from the sensor
 */
ParticleFilter.prototype.update = function(u, z){
    if(typeof this.motionModel !== 'undefined')
        this.motionUpdate(u);

    if(typeof this.sensorModel !== 'undefined')
        this.sensorUpdate(z);
};

/**
 * Update the state of particles based on the odometry reading
 * @function
 * @param {Odometry} u - The odometry reading from the motion sensor
 */
ParticleFilter.prototype.motionUpdate = function(u){
    // Update the state of all particles base on the estimated motion
    for (var i = this.particles.length - 1; i >= 0; i--){
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
ParticleFilter.prototype.sensorUpdate = function(z){
    // Calculate the logs of weights
    for(var i = this.particles.length-1; i >= 0; i--){
        var p = this.particles[i];
        p.w = this.sensorModel.probability(z, new RobotState(p.x, p.y, p.dir));
    }

    // To ensure the probability is in the range of (0,1)
    // this.normalizeWeights();

    // Resample the particles
    this.normalizeWeights();
    this.resample(0.9);
};

/**
 * Resample a part of the particles base on input
 * @function
 * @param {float} percent - The ratio of which will be resampled
 */
ParticleFilter.prototype.resample = function(percent)
{
    // Initiate array for updated particles
    var z_t = new Array(this.count);

    // Resample most of all particles, the rest will be randomly generated
    const resNum = z_t.length * percent;

    const step = 1.0/resNum;

    var cur = random() * step;

    // Running sum
    var cumulativeProbability = this.particles[0].w;

    // For the first part, resample
    for(var i = 0, j = 0; i < resNum; i++){

   //      while(j < this.particles.length-1 && cumulativeProbability < cur){
			// j++;
			// cumulativeProbability += this.particles[j].w;
   //      }
        j++;
        // Elluminate low weight particles
        if (this.particles[j].w < 0.1) {
            z_t[i] = this.newParticle();
        } else {
            z_t[i] = this.particles[j];
        }
        // cur += step;
    }

    // regenerate the rest
    for (var i = resNum; i < this.count; i++) {
        z_t[i] = this.newParticle();
    }

    //Assign it to particles
    this.particles = z_t;

    // this.refillAll();
};

/**
 * Normalize the weight of the particles to range (1,0)
 * @function
 */
ParticleFilter.prototype.normalizeWeights = function ()
{
	var max = 0;
	// Convert logs back to weights
	for(var i = this.particles.length-1; i >= 0; i--)
	{
		var p = this.particles[i];
		// Normalize the logs
		// p.w -= max;

		// Exponentiation to recover relative proportion
		// p.w = Math.exp(p.w);
		// sum += p.w;

        if (max<p.w) max = p.w;
	}

	if(max === 0)
	{
	    // If every particle has a probability of 0,
        // just regenrate all particles
        this.regenrateAll();
	}else
	{
	    // Otherwise normalize the weights
		this.particles.forEach(function(p){p.w /= max});
	}
};
