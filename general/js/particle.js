/**
 * A representation of particle robot in Particle Filter which is --
 * A representation of nonparametric implementation of the Bayes filter
 * @constructor
 * @param {int} x - the initial x coordinate of the particle robot
 * @param {int} y - the initial y coordinate of the particle robot
 * @param {float} dir - the initial direction of the particle robot
 * @param {float} weight - the initial weight (probability) of the particle
 */
function Particle(x, y, dir, weight)
{
	//coordinates
	this.x = x;
	this.y = y;

	//direction of robot
	this.dir = dir;

	//weight of this particle
	this.w = weight;
}

//Constants
Particle.size = 0.08;

/**
 * Draws the particle on the context
 * @function
 * @param {Context} ctx - The context that the particle will be drawn on
 */
Particle.prototype.draw = function (ctx)
{
	var x = round(this.x);
	var y = round(this.y);

	ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
	ctx.drawRobot(x, y, -this.dir, Particle.size);
};

/**
 * Sets the particle to a specific state
 * @function
 * @param {RobotState} robotState - The robot state that will be assigned to the particle
 */
Particle.prototype.setState = function (robotState)
{
	this.x = robotState.x;
	this.y = robotState.y;
	this.dir = robotState.dir % (TWO_PI);
};

/**
 * clone an instance of this particle
 * @function
 */
Particle.prototype.clone = function()
{
	return new Particle(this.x, this.y, this.dir, this.w);
};
