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

const actuationNoiseSliderFormat = {
	min: 0,
	max: 1,
	step: 0.05,
	value: 0.01,
	formatter: function (value)
	{
		return round(value * 100) + '%';
	}
};

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
	var slider = new Slider("#motion_stride");
	slider.on("slide", function (sliderValue)
	{
		motionDemo.setStride(sliderValue);
	});

	var a1Slider = new Slider('#motion_a1', actuationNoiseSliderFormat);
	var a2Slider = new Slider('#motion_a2', actuationNoiseSliderFormat);
	var a3Slider = new Slider('#motion_a3', actuationNoiseSliderFormat);
	var a4Slider = new Slider('#motion_a4', actuationNoiseSliderFormat);

	a1Slider.on('slide', function (value)
	{
		motionDemo.setA1(value)
	});
	a2Slider.on('slide', function (value)
	{
		motionDemo.setA2(value)
	});
	a3Slider.on('slide', function (value)
	{
		motionDemo.setA3(value)
	});
	a4Slider.on('slide', function (value)
	{
		motionDemo.setA4(value)
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

	var noiseSlider = new Slider('#actuation_noise', actuationNoiseSliderFormat);
	const noise = noiseSlider.getValue();
	a1Demo = new ActuationDemo('actuation_a1', 1, Math.PI / 2, 1,
		noise, 0, 0, 0);
	a2Demo = new ActuationDemo('actuation_a2', 1, Math.PI / 2, 1,
		0, noise, 0, 0);
	a3Demo = new ActuationDemo('actuation_a3', 1, Math.PI / 2, 1,
		0, 0, noise, 0);
	a4Demo = new ActuationDemo('actuation_a4', 1, Math.PI / 2, 1,
		0, 0, 0, noise);
	noiseSlider.on('slide', function (sliderValue)
	{
		a1Demo.setA1(sliderValue);
		a2Demo.setA2(sliderValue);
		a3Demo.setA3(sliderValue);
		a4Demo.setA4(sliderValue);
	});
	noiseSlider.on('slideStop', simulateAllActuations);
	simulateAllActuations();
}

function initMeasurementDemo()
{
	var map = getMap();
	compactMap(map);
	var nLasersSlider = new Slider('#nLasers', {
		min: 6,
		max: 36,
		step: 1
	});
	nLasersSlider.on('slide', function (value)
	{
		measurementDemo.setNLasers(value)
	});
	nLasersSlider.on('slideStop', function ()
	{
		measurementDemo.colorMapIfShould();
	});

	var sensorRadiusSlider = new Slider('#sensorRadius', {
		min: 1,
		max: 10,
		step: 0.5
	});
	sensorRadiusSlider.on('slide', function (value)
	{
		measurementDemo.setSensorRadius(value);
	});
	sensorRadiusSlider.on('slideStop', function ()
	{
		measurementDemo.colorMapIfShould();
	});

	var sensorNoiseSlider = new Slider('#sensorNoise', {
		min: 0,
		max: 3,
		step: 0.1
	});
	sensorNoiseSlider.on('slide', function (value)
	{
		measurementDemo.setSensorNoise(value);
	});
	sensorNoiseSlider.on('slideStop', function ()
	{
		measurementDemo.colorMapIfShould();
	});

	var colorResSlider = new Slider('#colorRes', {
		min: 1,
		max: 20,
		step: 1
	});
	colorResSlider.on('slide', function (value)
	{
		measurementDemo.setColoringResolution(value);
	});
	colorResSlider.on('slideStop', function ()
	{
		measurementDemo.colorMapIfShould();
	});

	measurementDemo = new BeamModelDemo('sensor_model_demo', map,
		sensorRadiusSlider.getValue(), sensorNoiseSlider.getValue());
}

function onFirstAppear(selector, callback)
{
	$(selector).appear().on('appear', function (event, $targets)
	{
		callback(event, $targets);
		$(selector).off('appear');
	});
}

function initSensorDemo(id)
{
	var noiseSlider = new Slider("#sensor_demo_sensorNoise", {
		min: 1,
		max: 7,
		step: 0.5,
		value: 2
	});
	sensorDemo = new SensorDemo(id, noiseSlider.getValue());
	noiseSlider.on("slideStop", function (sliderValue)
	{
		sensorDemo.setSensorNoise(sliderValue)
	});
	var repSlider = new Slider('#nSamples', {
		min: 0,
		max: 5,
		step: 0.2,
		value: 2,
		formatter: function (value)
		{
			return round(Math.pow(10, value));
		}
	});
}


function init()
{
	smoothenPath(vanillaPath);
	onFirstAppear('#simple_actuation', function (e, $t)
	{
		initActuationDemo();
	});
	onFirstAppear('#motion_canvas', function (e, $t)
	{
		initMotionDemo();
	});
	onFirstAppear('#mcl_canvas', function (e, $t)
	{
		initMCLDemo();
	});
	onFirstAppear('#sensor_model_demo', function (e, $t)
	{
		initMeasurementDemo();
	});
	onFirstAppear('#sensor_demo', function (e, $t)
	{
		initSensorDemo(e.target.id);
	});
}