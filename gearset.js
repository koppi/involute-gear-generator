/*
 * Involute spur gear builder jscad script.
 *
 * Licensed under the MIT license (http://opensource.org/licenses/mit-license.php).
 *
 * Copyright 2014 Dr. Rainer Hessmer
 * Copyright 2015 Jakob Flierl
 */

var csg       = require('./csg.js')
var OpenJSCAD = require('./openjscad.js')

var CSG = csg.CSG;
var CAG = csg.CAG;

var method = GearSet.prototype;

var GearType = {
    Regular: 0,
    Internal: 1,
    Rack: 2
};

function GearSet(gear1, gear2, showOption) {

    this.gear1 = gear1;
    gear1.connectedGear = gear2;
    this.gear2 = gear2;
    gear2.connectedGear = gear1;
    // in order for the two gears to mesh we need to turn the second one by 'half a tooth'
    //this.gear1.setAngle(0);
    this.gearRatio = this.gear1.toothCount / this.gear1.toothCount;
    
    var relativePitchRadius1 = (this.gear1.gearType == GearType.Internal) ? - this.gear1.pitchRadius : this.gear1.pitchRadius;
    var relativePitchRadius2 = (this.gear2.gearType == GearType.Internal) ? - this.gear2.pitchRadius : this.gear2.pitchRadius;
    this.gearsDistance = relativePitchRadius1 + relativePitchRadius2;
    
    this.showOption = showOption;
}

method.createShape = function() {
    var shape = new CAG();
    var msg = [];
    if ((this.showOption & 1) > 0) {
        // show gear 1
        var gear1ShapeBuild = this.gear1.getZeroedShape();
        var gear1Shape    = gear1ShapeBuild.shape;
        var gear1ShapeMsg = gear1ShapeBuild.msg;
        
        //var gear1Shape = this.gear1.createCutoutDemo();
        shape = shape.union(gear1Shape);
        msg.push({gear1: gear1ShapeMsg });
    }
    if ((this.showOption & 2) > 0) {
        // show gear 2
        var gear2ShapeBuild = this.gear2.getZeroedShape();
        var gear2Shape = gear2ShapeBuild.shape;
        var gear2ShapeMsg = gear2ShapeBuild.msg;

        msg.push({gear2: gear2ShapeMsg });

        if (this.gear2.gearType == GearType.Regular) {
            // we need an angle offset of half a tooth for the two gears to mesh
            var angle = 180 + 180 / this.gear2.toothCount;
            // apply gear rotation
            gear2Shape = gear2Shape.rotateZ(angle);
        }
        else if (this.gear2.gearType == GearType.Internal) {
            // we need an angle offset of half a tooth for the two gears to mesh
            var angle = 180; // + 180 / this.gear2.toothCount;
            // apply gear rotation
            gear2Shape = gear2Shape.rotateZ(angle);
        }
        else if (this.gear2.gearType == GearType.Rack) {
            gear2Shape = gear2Shape.rotateZ(180);
            gear2Shape = gear2Shape.translate([0, this.gear2.circularPitch / 2]);
        }

        // move to correct center
        gear2Shape = gear2Shape.translate([this.gearsDistance, 0]);

        //var gear2Shape = this.gear2.createCutoutDemo();
        shape = shape.union(gear2Shape);
    }
    
    return {
        shape: shape,
        msg:   msg
    }
}

module.exports = GearSet;
