What does it even do?
===
It is a small node app that serves data read from your dualshock 3 controller, and an interface for show. It may be worth mentioning that you'll have to run the software on the machine that's connected to the controller. Other than that, use it for awesome lifehacks and positive evolution of your family and the human race as a whole.

Prerequisites
===
For the package to run, you will need to install some prerequisites. These can be installed in any order but are
required for when you want to start the application and check out our demo.

**If you have a pretty much blank system, read on or use Google to find instructions on how to install the latest and greatest on everything. If you already have Node, Bower, Gulp and Compass installed, skip to "Install script dependencies".**

On Linux/Ubuntu machines, you'll need `libudev-dev` to access the Dualshock controller through node-hid. On systems without `libusb.h`, you'll also need `libusb-1.0-0-dev`:
```
sudo apt-get install libudev-dev
sudo apt-get install libusb-1.0-0-dev
```

Stylesheets are compiled from SASS. If you want to fux with the stylesheets, you'll probably need Compass (and Ruby to run that):
```
sudo apt-get install rubygems1.8
sudo gem install compass
```

ng-dualshock examples use Angular and [btford's angular-socket-io](https://github.com/btford/angular-socket-io). You can install these easily if you have Bower installed. Also, Gulp is used to run the various build tasks. Node (and NPM) are used by Bower, Gulp and the Express server.
```
sudo apt-get install npm nodejs
sudo npm install -g bower
sudo npm install -g gulp
```

Install script dependencies
===

Connect your Dualshock controller through the mini-USB cable. It'd be nice if the LED's blinked, but they do not always have to. After you´ve installed the prerequisites, you can continue cloning/forking this project.

```
git clone git@github.com:wvbe/ng-dualshock.git
cd ng-dualshock
npm install
gulp
sudo npm start
```

The Dualshock server should now connect to the device, this may take a few seconds. After that, your terminal is probably going apeshit because of all the "motion" data that comes through when the surface your Dualshock rests on moves even the slightest. Open op your browser on [http://localhost:5556](http://localhost:5556), this page should connect to the Socket.io server (same Node instance as the Dualshock server), which forwards all Dualshock input to your browser.
