/**
 * Created by kelvinzhang on 7/1/17.
 */

var simpleActuation;
var a1Demo;
var a2Demo;
var a3Demo;
var a4Demo;

var measurementDemo;
var sensorDemo;
var motionDemo;
var mclDemo;

function initMotionDemo()
{
	const path = vanillaPath;
	const x = path[0].x;
	const y = path[0].y;
	const dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);
	const filter = new ParticleFilter(
		500,
		new OdometryModel(
			getValue('motion_a1') / 100.0,
			getValue('motion_a2') / 100.0,
			getValue('motion_a3') / 100.0,
			getValue('motion_a4') / 100.0),
		undefined,
		new RobotState(x, y, dir),
		0);
	filter.particles.forEach(function (p)
	{
		p.x = x;
		p.y = y;
		p.dir = dir;
	});
	var slider = new Slider("#motion_stride");
	slider.on("slide", function (sliderValue)
	{
		motionDemo.setStride(sliderValue);
	});

	var robot = new Robot(filter, path, 19, 0, slider.getValue());
	motionDemo = new RobotDemo('motion_canvas', 'motion_minicanvas', getMap(), robot, 10);
}

function initMCLDemo()
{
	const path = vanillaPath;
	const x = path[0].x;
	const y = path[0].y;
	const dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);
	const filter = new ParticleFilter(
		getValue('mcl_nParticles'),
		new OdometryModel(
			getValue('mcl_a1') / 100.0,
			getValue('mcl_a2') / 100.0,
			getValue('mcl_a3') / 100.0,
			getValue('mcl_a4') / 100.0),
		new BeamModel(
			getValue('mcl_sensorNoise'),
			getValue('mcl_sensorRadius'),
			getMap()),
		new RobotState(x, y, dir),
		getValue('mcl_pRatio'));
	smoothenPath(path);
	robot = new Robot(filter, path, 19, getValue('mcl_sensorRadius'), getValue('mcl_stride'));

	mclDemo = new RobotDemo('mcl_canvas', 'mcl_minicanvas', getMap(), robot, 10);
}

function simulateAllActuations()
{
	a1Demo.simulateActuation();
	a2Demo.simulateActuation();
	a3Demo.simulateActuation();
	a4Demo.simulateActuation();
}

function initActuationDemo()
{
	//Noise parameters
	const a1 = 0.02;
	const a2 = 0.02;
	const a3 = 0.02;
	const a4 = 0.02;
	simpleActuation = new ActuationDemo('simple_actuation', 1, Math.PI / 2, 1,
		a1, a2, a3, a4);
	simpleActuation.simulateActuation();

	const noise = 0.3;
	a1Demo = new ActuationDemo('actuation_a1', 1, Math.PI / 2, 1,
		noise, 0, 0, 0);
	a2Demo = new ActuationDemo('actuation_a2', 1, Math.PI / 2, 1,
		0, noise, 0, 0);
	a3Demo = new ActuationDemo('actuation_a3', 1, Math.PI / 2, 1,
		0, 0, noise, 0);
	a4Demo = new ActuationDemo('actuation_a4', 1, Math.PI / 2, 1,
		0, 0, 0, noise);
	simulateAllActuations();

	//Ignore future appear events
	$('#simple_actuation').off('appear');
}

function init()
{
	//Initialize the demo whe it appears on screen
	$('#simple_actuation').appear().on('appear', function (event, $all_appeared_elements)
	{
		initActuationDemo();
	});

	smoothenPath(vanillaPath);

	measurementDemo = new BeamModelDemo('sensor_model_demo', getMap(), 3, 0.3);
	sensorDemo = new SensorDemo('sensor_demo', 1);
	initMotionDemo();
	initMCLDemo();
}