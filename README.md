## install via npm

[![Join the chat at https://gitter.im/koppi/involute-gear-generator](https://badges.gitter.im/koppi/involute-gear-generator.svg)](https://gitter.im/koppi/involute-gear-generator?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

```bash
$ npm install -g involute-gear-generator
```

## usage

```
Usage: involute-gear-generator -o [dxf filename]

Options:
  -o, --output                save gears to dxf file                  [optional]
  --circularPitch             Circular pitch (distance from one face of a tooth
                              to the corresponding face of an adjacent tooth on
                              the same gear, measured along the pitch circle)
                                                                    [default: 8]
  --pressureAngle             Pressure Angle (common values are 14.5, 20 and 25
                              degrees)                             [default: 20]
  --clearance                 Clearance (minimal distance between the apex of a
                              tooth and the trough of the other gear; in length
                              units)                             [default: 0.05]
  --backlash                  Backlash (minimal distance between meshing gears;
                              in length units)                   [default: 0.05]
  --profileShift              Profile Shift (indicates what portion of gear one'
                              s addendum height should be shifted to gear two. E
                              .g., a value of 0.1 means the adddendum of gear
                              two is increased by a factor of 1.1 while the
                              height of the addendum of gear one is reduced to 0
                              .9 of its normal height.)             [default: 0]
  --wheel1ToothCount          Wheel 1 Tooth Count (n1 > 0: external gear; n1 = 0
                              : rack; n1 < 0: internal gear)       [default: 30]
  --wheel1CenterHoleDiamater  Wheel 1 Center Hole Diameter (0 for no hole)
                                                                    [default: 4]
  --wheel2ToothCount          Wheel 2 Tooth Count                   [default: 8]
  --wheel2CenterHoleDiamater  Wheel 2 Center Hole Diameter (0 for no hole)
                                                                    [default: 4]
  --showOption                Show                                  [default: 3]
  --qualityOption             Quality level [0, 1, 2] (better means longer waits
                              )                                     [default: 0]
```

## warning

* this is an early release
* expect errors
* do not use these gears for production

## credits

* Dr. Rainer Hessmer's blog – [Online Involute Spur Gear Builder](http://www.hessmer.org/blog/2014/01/01/online-involute-spur-gear-builder/)
