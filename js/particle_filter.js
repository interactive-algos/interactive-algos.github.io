/**
 * Created by kelvinzhang on 5/28/17.
 */

function ParticleFilter(particleCount, motionModel, robotState)
{
    //Number of particles
    this.n = particleCount;
    this.particles = new Array(particleCount);

    this.motionModel = motionModel;

    //generate initial particles
    for (var i = this.particles.length - 1; i >= 0; i--)
    {
        this.particles[i] = new Particle(robotState.x, robotState.y, robotState.dir, 1);
    }
}

ParticleFilter.prototype.draw = function(ctx)
{
    for (var i = this.particles.length - 1; i >= 0; i--)
    {
        this.particles[i].draw(ctx);
    }
};

//Update with odometry u
ParticleFilter.prototype.update = function(z)
{
    for (var i = this.particles.length - 1; i >= 0; i--)
    {
        var p = this.particles[i];
        var state = new RobotState(p.x, p.y, p.dir);
        var newState = this.motionModel.sample(z, state);
        this.particles[i] = new Particle(newState.x, newState.y, newState.dir, 1);
    }
};