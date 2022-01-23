#!/usr/bin/env nodejs
/*
 * Involute spur gear builder
 *
 * Licensed under the MIT license (http://opensource.org/licenses/mit-license.php).
 *
 * nodejs version derived from http://hessmer.org/gears/InvoluteSpurGearBuilder.html
 *
 * Copyright 2014 Dr. Rainer Hessmer
 * Copyright 2015 Jakob Flierl
 *
 */
var util = require('util');
var fs   = require('fs');

var OpenJSCAD = require('./openjscad.js')
var Gear      = require('./gear.js')
var GearSet   = require('./gearset.js')

var yargs = require('yargs')
    .usage('Usage: $0 -o [dxf filename of stdout if -o option omitted]')
    .alias('o', 'output')
    .nargs('o', 1)
    .describe('o', 'save gears to dxf file')

var pd = getParameterDefinitions()

for(var i = 0; i < pd.length;i++){
    (function(j){
        yargs = yargs.default(pd[j].name, pd[j].initial).describe(pd[j].name, pd[j].caption)
    })(i);
}

argv = yargs.argv;
// console.log(util.inspect(argv, { showHidden: true, depth: null }));

if (argv.h) {
    return yargs.showHelp()
}

var build = main(argv);

if (argv.o) {
    fs.writeFile(argv.output, build.shape.toDxf(), function(err) {
        if (err) {
            return console.log(err);
        }
    });
} else {
    process.stdout.write(build.shape.toDxf(), function(err) {
        if (err) {
            return process.stderr.write(err);
        }
    });
}

process.stderr.write("info = " + util.inspect(build.msg, { showHidden: true, depth: null }));

// console.log(util.inspect(shape, { showHidden: true, depth: null }));

function main(params)
{
    // Main entry point; here we construct our solid:
    var qualitySettings = initializeQualitySettings(params.qualityOption)
    
    var gear1 = new Gear({
    rackTeeth: params.rackTeeth,
	circularPitch: params.circularPitch,
	pressureAngle: params.pressureAngle,
	clearance: params.clearance,
	backlash: params.backlash,
	toothCount: params.wheel1ToothCount,
	centerHoleDiameter: params.wheel1CenterHoleDiamater,
	profileShift: -params.profileShift,
	qualitySettings: qualitySettings
    });
    var gear2 = new Gear({

    rackTeeth: params.rackTeeth,
	circularPitch: params.circularPitch,
	pressureAngle: params.pressureAngle,
	clearance: params.clearance,
	backlash: params.backlash,
	toothCount: params.wheel2ToothCount,
	centerHoleDiameter: params.wheel2CenterHoleDiamater,
	profileShift: params.profileShift,
	qualitySettings: qualitySettings
    });
    
    var gearSet = new GearSet(
	gear1,
	gear2,
	params.showOption);
    
    var shapeBuild = gearSet.createShape();
    // OpenJsCad.log("returning gear set shape");
    
    return {
        shape: shapeBuild.shape,
        msg: shapeBuild.msg
    }
}

function initializeQualitySettings(qualityOption) {
    // default values (draft quality)
    var resolution = 30;  // Number of segments used per 360 degrees when drawing curves
    var stepsPerToothAngle = 3; // determines the angular step size when assembling the tooth profile
    
    if (qualityOption == 1) {
	// normal quality
	resolution = 180;
	stepsPerToothAngle = 10;
    }
    else if (qualityOption == 2) {
	// high quality
	resolution = 360;
	stepsPerToothAngle = 20;
    }
    return {resolution: resolution, stepsPerToothAngle: stepsPerToothAngle};
}

function getParameterDefinitions() {
    return [
      { name: 'rackTeeth', caption: 'number of rack teeth, if n=0; will always be an odd number, i.e. 20 will result in 21 rack teeth.', type: 'int', initial: 41 },
	{ name: 'circularPitch', caption: 'Circular pitch (distance from one face of a tooth to the corresponding face of an adjacent tooth on the same gear, measured along the pitch circle)', type: 'float', initial: 8 },
	{ name: 'pressureAngle', caption: 'Pressure Angle (common values are 14.5, 20 and 25 degrees)', type: 'float', initial: 20 },
	{ name: 'clearance', caption: 'Clearance (minimal distance between the apex of a tooth and the trough of the other gear; in length units)', type: 'float', initial: 0.05 },
	{ name: 'backlash', caption: 'Backlash (minimal distance between meshing gears; in length units)', type: 'float', initial: 0.05 },
	{ name: 'profileShift', caption: 'Profile Shift (indicates what portion of gear one\'s addendum height should be shifted to gear two. E.g., a value of 0.1 means the adddendum of gear two is increased by a factor of 1.1 while the height of the addendum of gear one is reduced to 0.9 of its normal height.)', type: 'float', initial: 0.0 },
	{ name: 'wheel1ToothCount', caption: 'Wheel 1 Tooth Count (n1 > 0: external gear; n1 = 0: rack; n1 < 0: internal gear)', type: 'int', initial: 30 },
	{ name: 'wheel1CenterHoleDiamater', caption: 'Wheel 1 Center Hole Diameter (0 for no hole)', type: 'float', initial: 4 },
	{ name: 'wheel2ToothCount', caption: 'Wheel 2 Tooth Count', type: 'int', initial: 8 },
	{ name: 'wheel2CenterHoleDiamater', caption: 'Wheel 2 Center Hole Diameter (0 for no hole)', type: 'float', initial: 4 },
	{ name: 'showOption', caption: 'Show', type: 'choice', values: [3, 1, 2], initial: 3, captions: ["Wheel 1 and Wheel 2", "Wheel 1 Only", "Wheel 2 Only"]},
	{ name: 'qualityOption', caption: 'Quality level [0, 1, 2] (better means longer waits)', type: 'choice', values: [0, 1, 2], initial: 0, captions: ["Draft", "Normal", "High"]},
    ];
}
