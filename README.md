AR Drone Steam DualShock
=============
##What does it do?
If you have a Parrot AR Drone, a DualShock controller and a WebGL enabled browser, this repository can serve you a webpage with a videostream from your drone, and some info dumps on the drone itself and your dualshock controller. This repository has only just begun, the plan is to make an interface to fly your drone from the browser (or at least with DualShock).

##Prerequisites
Nodejs, Gulp, Compass, Parrot AR Drone 2.0, Dualshock 3, WebGL

##How to install stuff
Linux users may have to install a few additional libs for a dependency, node-hid (it connects to USB devices for you), to work:
```
sudo apt-get install libudev-dev
```

Ubuntu versions missing libusb.h:
```
sudo apt-get install libusb-1.0-0-dev
```

Then, after cloning this repository, you can:
```
npm install
```

Before running, you may want to connect your AR Drone to the same (wireless enabled) network your PC is on, instead of connecting your computer to the drone's hotspot. Your network needs to be public! Connect a wifi enabled device to the drone for now, telnet to your drone (something like ```telnet 192.168.1.1```) and type into BusyBox:
```
echo iwconfig ath0 mode managed essid NAME_OF_YOUR_NETWORK > /data/ap.sh
echo ifconfig ath0 192.168.1.1 netmask 255.255.255.0 up >> /data/ap.sh
echo route add default gw 192.168.1.254 >> /data/ap.sh
chmod 755 /data/ap.sh
```

AFter this, and every time your drone reboots, run on the drone:
```
/data/ap.sh
```
The device you used to initially connect to the drone's hotspot will now lose it's connection because the drone is connecting to an existing network.

##How to run stuff

Gulp tasks do most of the stuff

```gulp server``` - Runs the Dualshock, AR Drone, Dronestream and Express servers

```gulp watch``` - Runs the LiveReload server (use in combination with Chrome extension) and watch for SASS/Jade changes

```gulp once``` - Compile all SASS and Jade once

```gulp``` - Default, run all of the above

Now, once you have gulp (```gulp server``` at minimum) running, browse your ass to http://localhost:5555. There is a socket.io server on port 8082, Express on 5556 (for static files) and dronestream on port 5555 (also serves the index.html)

Note: You may require root privileges to access the DualShock controller through USB, if so, run ```sudo gulp```

##Tested with
* Parrot AR 2.0 Drone
* Dualshock 3 controller (CECHZC2E)
