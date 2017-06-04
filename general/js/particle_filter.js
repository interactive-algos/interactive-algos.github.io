/**
 * Created by kelvinzhang on 5/28/17.
 */

function ParticleFilter(particleCount, motionModel, sensorModel, robotState)
{
    this.particles = new Array(particleCount);

    this.motionModel = motionModel;
    this.sensorModel = sensorModel;


    if(typeof robotState !== 'undefined')
    {
        //generate initial particles
        for (var i = particleCount - 1; i >= 0; i--)
        {
            this.particles[i] = new Particle(robotState.x, robotState.y, robotState.dir, 1);
        }
    }else
    {
    	//generate random particles within the map
        var weight = 1.0/particleCount;
        for (var i = particleCount - 1; i >= 0; i--)
        {
            this.particles[i] = new Particle(this.sensorModel.width*random(), this.sensorModel.height*random(), TWO_PI*random(), 1.0/particleCount);
        }
    }
}

//Draw particle in context
ParticleFilter.prototype.draw = function(ctx)
{
    for (var i = this.particles.length - 1; i >= 0; i--)
    {
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
    const m = z_t.length * 0.8;

    const r = z_t.length - m;

    const step = 1.0/m;

    var cur = random() * step;
    for(var i = 0, j = 0; i < m; i ++)
    {
        while(j < this.particles.length-1 && this.particles[j].w < cur)
        {
            j++;
        }
        z_t[i] = this.particles[j];
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
    // var max = Number.NEGATIVE_INFINITY;
    for(var i = this.particles.length-1; i >= 0; i--)
    {
        var p = this.particles[i];
        p.w = this.sensorModel.probability(z, new RobotState(p.x, p.y, p.dir));
        // max = Math.max(max, p.w);
    }

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
        const nParticles = this.particles.length;
        this.particles.forEach(function(p){p.w = 1.0/nParticles});
    }else
    {
        //Normalize weights
        for (var i = this.particles.length - 1; i >= 0; i--)
        {
            this.particles[i].w /= sum;
        }
    }
    //Calculate CDF
    for(var i = 1; i < this.particles.length; i ++)
    {
        this.particles[i].w += this.particles[i-1].w;
    }
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