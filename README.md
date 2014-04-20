Prerequisites
=============
Nodejs, Gulp, Compass

How to install
=============

node-hid, a dependency somewhere along the chain (it connects to USB devices for you), may need a few libs on Linux
```
sudo apt-get install libudev-dev
```

And for some Ubuntu versions missing libusb.h
```
sudo apt-get install libusb-1.0-0-dev
```

Now you can
```
npm install
```

First, you may want to connect your AR Drone to the same (wireless enabled) network your PC is on, instead of connecting your computer to the drone's hotspot. Telnet to your drone and type into BusyBox:
```
echo iwconfig ath0 mode managed essid NAME_OF_YOUR_NETWORK > /data/ap.sh
echo ifconfig ath0 192.168.1.1 netmask 255.255.255.0 up >> /data/ap.sh
echo route add default gw 192.168.1.254 >> /data/ap.sh
chmod 755 /data/ap.sh
```

Now every time your drone reboots, telnet to the drone again and run:
```
/data/ap.sj
```

How to boot up
===============
Gulp tasks do most of the stuff

```gulp server``` - Runs the Dualshock, AR Drone, Dronestream and Express servers

```gulp watch``` - Runs the LiveReload server (use in combination with Chrome extension) and watch for SASS/Jade changes

```gulp once``` - Compile all SASS and Jade once

```gulp``` - Default, run all of the above
