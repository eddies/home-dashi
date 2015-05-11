# home-dashi [![Build Status](https://travis-ci.org/eddies/home-dashi.svg?branch=master)](https://travis-ci.org/eddies/home-dashi)
A data dashboard for [HOME](http://home.org.sg/).

## Prerequisites

 * [npm](https://www.npmjs.com/)
 * [bower](http://bower.io/)
 * [grunt](http://gruntjs.com/)
 
The only tricky bit is getting npm installed. npm is installed as part of Node.js. However, instructions for installing Node vary by operating system. 

For example, most Mac or Windows users will probably want to install Node via one of the installers from [nodejs.org](https://nodejs.org/).

Most Linux users will probably want to use their system's own package manager to install Node. Have a look at [Installing Node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager). As of this writing (2015-05-04), the current version of Node.js is 0.12.2. 

Once npm is installed, installing grunt and bower is just:

```bash
npm install -g bower grunt-cli
```

## Installation
### Install  dependencies:
```bash
npm install
bower install
```

### Add data:
home-dashi expects two data files, `app/data/domestic.csv` and `app/data/non-domestic.csv`. 
These files are not included in the GitHub repo, for data privacy reasons.

You're done!

## Next steps 
Run a live-reloading server:
```bash
grunt serve
```

Or, build home-dashi to the `dist/` directory, which you can then point your browser to:
```bash
grunt
```

If you want to edit your copy of the dashboard, you'll probably want to have a look at `app/index.html` and `app/scripts/main.js`