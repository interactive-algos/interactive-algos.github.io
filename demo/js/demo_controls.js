/**
 * Created by kelvinzhang on 7/1/17.
 */

window.onerror = function (msg, url, lineNo, columnNo, error)
{
	var message = [
		'Message: ' + msg,
		'URL: ' + url,
		'Line: ' + lineNo,
		'Column: ' + columnNo,
		'Error object: ' + JSON.stringify(error)
	].join(' - ');

	alert(message);
	return false;
};

var simpleActuation;
var a1Demo;
var a2Demo;
var a3Demo;
var a4Demo;

var measurementDemo;
var sensorDemo;

var motionDemo;
var a1MDemo;
var a2MDemo;
var a3MDemo;
var a4MDemo;

var mclDemo;

const actuationNoiseSliderFormat = {
	min: 0,
	max: 0.5,
	step: 0.01,
	value: 0.01
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


	//Individual Simulations
	const s_path = simPath;
	const st_path = straightPath;
	const s_x = s_path[0].x;
	const s_y = s_path[0].y;
	const s_dir = atan2(s_path[1].y - s_path[0].y, s_path[1].x - s_path[0].x);
	const st_x = st_path[0].x;
	const st_y = st_path[0].y;
	const st_dir = atan2(st_path[1].y - st_path[0].y, st_path[1].x - st_path[0].x);
	const exaggerateFilterNoise = 0.3;
	const smallParticleCount = 100;
	const filterA1 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(
			exaggerateFilterNoise,
			0,
			0,
			0
		),
		undefined,
		new RobotState(s_x, s_y, s_dir),
		0);
	const filterA2 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(
			0,
			exaggerateFilterNoise,
			0,
			0
		),
		undefined,
		new RobotState(st_x, st_y, st_dir),
		0);
	const filterA3 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(
			0,
			0,
			exaggerateFilterNoise,
			0
		),
		undefined,
		new RobotState(st_x, st_y, st_dir),
		0);
	const filterA4 = new ParticleFilter(
		smallParticleCount,
		new OdometryModel(
			0,
			0,
			0,
			exaggerateFilterNoise
		),
		undefined,
		new RobotState(s_x, s_y, s_dir),
		0);


	slider.on("slide", function (sliderValue)
	{
		motionDemo.setStride(sliderValue);
		a1MDemo.setStride(sliderValue/10000.0);
		a2MDemo.setStride(sliderValue);
		a3MDemo.setStride(sliderValue);
		a4MDemo.setStride(sliderValue/10000.0);
	});

	var a1Slider = new Slider('#motion_a1', actuationNoiseSliderFormat);
	var a2Slider = new Slider('#motion_a2', actuationNoiseSliderFormat);
	var a3Slider = new Slider('#motion_a3', actuationNoiseSliderFormat);
	var a4Slider = new Slider('#motion_a4', actuationNoiseSliderFormat);

	a1Slider.on('slide', function (value)
	{
		motionDemo.setA1(value);
		a1MDemo.setA1(value);
	});
	a2Slider.on('slide', function (value)
	{
		motionDemo.setA2(value);
		a2MDemo.setA2(value);
	});
	a3Slider.on('slide', function (value)
	{
		motionDemo.setA3(value);
		a3MDemo.setA3(value);
	});
	a4Slider.on('slide', function (value)
	{
		motionDemo.setA4(value);
		a4MDemo.setA4(value);
	});

	var robot = new Robot(filter, path, 0, 0, slider.getValue());
	var robotA1 = new Robot(filterA1, s_path, 0, 0, slider.getValue()/10000.0);
	var robotA2 = new Robot(filterA2, st_path, 0, 0, slider.getValue());
	var robotA3 = new Robot(filterA3, st_path, 0, 0, slider.getValue());
	var robotA4 = new Robot(filterA4, s_path, 0, 0, slider.getValue()/10000.0);
	motionDemo = new RobotDemo('motion_canvas', 'motion_minicanvas', getMap(), robot, 10);
	a1MDemo = new RobotDemo('motion_a1_demo', '', getSimMap(), robotA1, 10);
	a2MDemo = new RobotDemo('motion_a2_demo', '', getSimMap(), robotA2, 10);
	a3MDemo = new RobotDemo('motion_a3_demo', '', getSimMap(), robotA3, 10);
	a4MDemo = new RobotDemo('motion_a4_demo', '', getSimMap(), robotA4, 10);
}

function initMCLDemo()
{
	var slider = new Slider("#mcl_stride", {
		min: 0.01,
		max: 0.2,
		step: 0.01,
		value: 0.04
	});
	slider.on("slide", function (sliderValue)
	{
		mclDemo.setStride(sliderValue);
	});

	var a1Slider = new Slider('#mcl_a1', actuationNoiseSliderFormat);
	var a2Slider = new Slider('#mcl_a2', actuationNoiseSliderFormat);
	var a3Slider = new Slider('#mcl_a3', actuationNoiseSliderFormat);
	var a4Slider = new Slider('#mcl_a4', actuationNoiseSliderFormat);

	a1Slider.on('slide', function (value)
	{
		mclDemo.setA1(value)
	});
	a2Slider.on('slide', function (value)
	{
		mclDemo.setA2(value)
	});
	a3Slider.on('slide', function (value)
	{
		mclDemo.setA3(value)
	});
	a4Slider.on('slide', function (value)
	{
		mclDemo.setA4(value)
	});

	var sensorRadiusSlider = new Slider('#mcl_sensorRadius', {
		min: 1,
		max: 10,
		step: 0.5
	});
	sensorRadiusSlider.on('slide', function (value)
	{
		mclDemo.setSensorRadius(value);
	});

	var sensorNoiseSlider = new Slider('#mcl_sensorNoise', {
		min: 0,
		max: 3,
		step: 0.1
	});
	sensorNoiseSlider.on('slide', function (value)
	{
		mclDemo.setSensorNoise(value);
	});

	var colorResSlider = new Slider('#mcl_colorRes', {
		min: 1,
		max: 20,
		step: 1
	});
	colorResSlider.on('slide', function (value)
	{
		measurementDemo.setColoringResolution(value);
	});

	var pRatioSlider = new Slider('#mcl_pRatio', {
		min: 0,
		max: 1,
		step: 0.01,
		formatter: function (value)
		{
			return round(value * 100) + "%";
		}
	});
	pRatioSlider.on('slide', function (value)
	{
		mclDemo.robot.filter.resampleRatio = value;
	});


	const path = vanillaPath;
	const x = path[0].x;
	const y = path[0].y;
	const dir = atan2(path[1].y - path[0].y, path[1].x - path[0].x);
	const filter = new ParticleFilter(
		getValue('mcl_nParticles'),
		new OdometryModel(
			a1Slider.getValue(),
			a2Slider.getValue(),
			a3Slider.getValue(),
			a4Slider.getValue()),
		new BeamModel(
			sensorNoiseSlider.getValue(),
			sensorRadiusSlider.getValue(),
			getMap()),
		new RobotState(x, y, dir),
		pRatioSlider.getValue());
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

	const firstMove = 2;
	const turn = Math.PI / 6;
	const secondMove = 2;

	simpleActuation = new ActuationDemo('simple_actuation', firstMove, turn, secondMove,
		a1, a2, a3, a4);
	simpleActuation.simulateActuation();

	var noiseSlider = document.getElementById('actuation_noise');
	const noise = Number(noiseSlider.value);
	a1Demo = new ActuationDemo('actuation_a1', firstMove, turn, secondMove,
		noise, 0, 0, 0);
	a2Demo = new ActuationDemo('actuation_a2', firstMove, turn, secondMove,
		0, noise, 0, 0);
	a3Demo = new ActuationDemo('actuation_a3', firstMove, turn, secondMove,
		0, 0, noise, 0);
	a4Demo = new ActuationDemo('actuation_a4', firstMove, turn, secondMove,
		0, 0, 0, noise);
	noiseSlider.addEventListener('input', function(event)
	{
		const sliderValue = Number(event.target.value);
		a1Demo.setA1(sliderValue);
		a2Demo.setA2(sliderValue);
		a3Demo.setA3(sliderValue);
		a4Demo.setA4(sliderValue);
	});
	noiseSlider.addEventListener('change', simulateAllActuations);
	simulateAllActuations();
}

function initMeasurementDemo()
{
	var map = getMap();
	// compactMap(map);
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
		sensorRadiusSlider.getValue(), sensorNoiseSlider.getValue(), 'sensor_model_mini');
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

(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space



function init()
{
	smoothenPath(vanillaPath);
	// onFirstAppear('#simple_actuation', function (e, $t)
	// {
		initActuationDemo();
	// });
	// onFirstAppear('#motion_a1_demo', function (e, $t)
	// {
		initMotionDemo();
	// });
	// onFirstAppear('#mcl_canvas', function (e, $t)
	// {
		initMCLDemo();
	// });
	// onFirstAppear('#sensor_model_demo', function (e, $t)
	// {
		initMeasurementDemo();
	// });
	onFirstAppear('#sensor_demo', function (e, $t)
	{
		initSensorDemo(e.target.id);
	});
}
