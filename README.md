# plPointCloud_w_LSM3030
3d point cloud design with LIDAR-Lite and LSM3030 by Adafruit

This is a crazy rough first round, about 1.5 hrs of work... many more to come, but its kinda fun!

## Installation

### Arduino
The Arduino code is in the ```/arduino``` folder. Load it normally. Because I've just cobbled this together, it requires all of these libraries:

- [https://github.com/adafruit/Adafruit_LSM303DLHC]()
- [https://github.com/adafruit/Adafruit_Sensor]()
- Wire
- I2C Master Library

Future versions will only required the I2C master libary

### Chrome
1. Go to ```chrome://extensions``` 
2. On the top right of the screen there's a checkbox for "Developer Mode", if this isn't check, check it and a few options will appear
3. Click "Load unpacked extension..." and select the folder with the dashboard in it
4. A new icon should appear at the top of the list, you can click the "Launch" link under the name to execute it

**NOTE:** You can now launch the app from ```chrome://apps``` if you prefer. 

## Usage

1. Once you've selected the serial port and you see the canvas view with the "Clear Canvas" button at the top, you should start to see black dots appear. 
2. As you move the **entire arduino board** around you'll see the dots move around the screen. 
3. Wave it around and you'll see some rudimentary cloud point mapping

## Explanation

Basically what's happening is:

- The darkness of the dot is determined by the closeness of the distance reading, an object of 13 cm will produce a darker dot than one of 113cm. 
- I'm not sure I have the axis correct or even if I'm even using the right feedback from the LSM3030 sensor, but hell it kinda did something reliably and so I haven't investigated further yet. 
