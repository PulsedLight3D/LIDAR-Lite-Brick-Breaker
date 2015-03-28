# LIDAR-Lite Brick Breaker

Play the exciting Atari classic as a Chrome standalone app with a wave of your hand via LIDAR-Lite and Arduino. [See a quick video of it in action!](https://youtu.be/7yKE1Mw-p8E)


Very much a hack for Arduino Day 2015, its not as well commented as would be desireable. That said, PulsedLight has more Chrome App experiments planned and we'll be using this basic setup with better commenting in the future. 

If anyone tries this out and decides to make a video of it, we'd love to see it!

Enjoy!

## Credits

Big thanks to [Jack Palevich](https://github.com/jackpal/jackshacks/tree/gh-pages/brickbreak) for the original Brick-Break JS. 

Also, the font used throughout this app is <a href="http://www.fontsquirrel.com/fonts/Silkscreen">Silkscreen by Jason Kottke</a>. A favorite!

And always, thank you to the Chrome and DSS Circuits team for the amazing libraries!

## Setup

![LIDAR-Lite Brick Breaker Diagram](http://pulsedlight3d.net/assets.pl3d//LIDARLite-BrickBreakerDiagram.png)

<iframe width="960" height="720" src="https://www.youtube.com/embed/7yKE1Mw-p8E" frameborder="0" allowfullscreen></iframe>

Connect the LIDAR-Lite to the Arduino according to the diagram below. Then plug the Arduino into the computer with the LIDAR-Lite on the left side of the computer. 

## Arduino Setup

![arduino-screenshot](http://pulsedlight3d.net/assets.pl3d/arduino-setup.png)

### LIDARLite I2C Connection Setup
LIDARLite Cable | Arduino Pins
:---|:---
5V | 5V
PWR EN | _(Unused)_
MODE | _(Unused)_
SCL | SCL (topmost pin on the right hand side of Arduino)
SDA | SDA (second pin from the top on the right hand side of Arduino)
GND | GND

## Installation

### Arduino
The Arduino code is in the ```/arduino``` folder. Load it normally. 

It requires the'Arduino I2C Master Library' from DSS Circuits: [http://www.dsscircuits.com/index.php/articles/66-arduino-i2c-master-library](). 

Information about installing libraries can be found: [http://arduino.cc/en/Guide/Libraries]()

### Chrome
1. Go to ```chrome://extensions``` 
2. On the top right of the screen there's a checkbox for "Developer Mode", if this isn't check, check it and a few options will appear
3. Click "Load unpacked extension..." and select the folder with the dashboard in it
4. A new icon should appear at the top of the list, you can click the "Launch" link under the name to execute it

**NOTE:** You can now launch the app from ```chrome://apps``` if you prefer. 

## Usage

After installation, placed the LIDAR-Lite on the left side of the computer and launch the Chrome app. Follow the directions in the app. 
