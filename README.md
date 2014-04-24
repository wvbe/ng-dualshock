Prerequisites
===

For the package to run, you will need to install some prerequisites. These can be installed in any order but are
required for when you want to start the application and check out our demo.

Install dependencies
---

Linux/Ubuntu:
`apt-get install libudev-dev` and possibly `apt-get install libusb-1.0-0-dev` (for systems missing `libusb.h`)

Ruby:
`sudo gem install compass`

NodeJS & NPM:
`sudo npm install -g bower`
`sudo npm install -g gulp`

Installation
===

After you´ve installed the prerequisites, you can continue cloning/forking this project.

```
git clone git@github.com:wvbe/ng-dualshock.git
cd ng-dualshock
npm install
sudo gulp
```
