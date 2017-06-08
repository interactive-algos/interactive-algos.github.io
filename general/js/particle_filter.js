/**
 * Created by kelvinzhang on 5/28/17.
 */

/**
 * A simulation of Particle Filter --
 * A representation of nonparametric implementation of the Bayes filter
 * @constructor
 * @param {int} particleCount - The total number of particles that can present in a time.
 * @param {MotionModel} motionModel - The motion model that is used to calculate its motion over time.
 * @param {SensorModel} sensorModel - The sensor model that is used to measure environment over time.
 * @param {State} robotState - The state of the robot while creating the particle filter
 */
function ParticleFilter(particleCount, motionModel, sensorModel, robotState){
    this.count = particleCount;
    //Init the array that stores particles
    this.particles = new Array(particleCount);

    this.motionModel = motionModel;
    this.sensorModel = sensorModel;

    if(typeof robotState !== 'undefined'){
        //If current robot state is already defined
        //generate initial particles around the robot
        for (var i = particleCount - 1; i >= 0; i--){
            this.particles[i] = new Particle(robotState.x, robotState.y, robotState.dir, 1);
        }
    }else{
    	//generate random particles within the map
        var weight = 1.0/particleCount;
        for (var i = particleCount - 1; i >= 0; i--){
            this.particles[i] = new Particle(this.sensorModel.width*random(), this.sensorModel.height*random(), TWO_PI*random(), 1.0/particleCount);
        }
    }
}

/**
 * Draws the particle on the context
 * @function
 * @param {Context} ctx - The context that the particles will be drawn on
 */
ParticleFilter.prototype.draw = function(ctx){
    for (var i = this.particles.length - 1; i >= 0; i--){
        this.particles[i].draw(ctx);
    }
};

//Update with odometry u
ParticleFilter.prototype.motionUpdate = function(u)
{
    for (var i = this.particles.length - 1; i >= 0; i--)
    {
        var p = this.particles[i];
        var state = new RobotState(p.x, p.y, p.dir);
        //Draw sample from p(x_t, u, x_t-1)
        var newState = this.motionModel.sample(u, state);
        p.setState(newState);
    }
};


ParticleFilter.prototype.resample = function()
{
    var z_t = new Array(this.particles.length);

    //Resample 80% of all particles, the rest 20% will be randomly generated
    const m = z_t.length * 0.8

    const step = 1.0/m;

    var cur = random() * step;

    //Running sum
    var cumulativeProbability = this.particles[0].w;
    for(var i = 0, j = 0; i < m; i ++)
    {
        while(j < this.particles.length-1 && cumulativeProbability < cur)
        {
			j++;
			cumulativeProbability += this.particles[j].w;
        }
        z_t[i] = this.particles[j].clone();
        cur += step;
    }

    for(var i = m; i < z_t.length; i ++)
    {
        z_t[i] = new Particle(random()*this.sensorModel.width, random()*this.sensorModel.height, random()*TWO_PI, 0);
    }
    this.particles = z_t;
};

ParticleFilter.prototype.sensorUpdate = function(z)
{
    //Calculate the logs of weights
    for(var i = this.particles.length-1; i >= 0; i--)
    {
        var p = this.particles[i];
        p.w = this.sensorModel.probability(z, new RobotState(p.x, p.y, p.dir));
    }

    this.normalizeWeights();

    this.resample();
};

//Update with odometry u, measurement z
ParticleFilter.prototype.update = function(u, z)
{
    if(typeof this.motionModel !== 'undefined')
        this.motionUpdate(u);

    if(typeof this.sensorModel !== 'undefined')
        this.sensorUpdate(z);
};

ParticleFilter.prototype.normalizeWeights = function ()
{
	var sum = 0;
	//Convert logs back to weights
	for(var i = this.particles.length-1; i >= 0; i--)
	{
		var p = this.particles[i];
		//Normalize the logs
		// p.w -= max;

		//Exponentiation to recover relative proportion
		// p.w = Math.exp(p.w);
		sum += p.w;
	}

	if(sum === 0)
	{
	    //If every particle has a probability of 0,
        // just make a uniform distribution
		const uniform_probability = 1.0 / this.particles.length;
		this.particles.forEach(function(p){p.w = uniform_probability;});
	}else
	{
	    //Otherwise normalize the weights
		this.particles.forEach(function(p){p.w /= sum});
	}
};
