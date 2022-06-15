/*
All require() calls must go here. That is the sole purpose of this file.

Every time you update this file, you must run this command in the
Windows command line (while in the project directory):
browserify entry.js -o bundle.js

You do not have to delete the old bundle.js file each time; browserify will
replace it. This file should not be referenced in the index.html file;
instead, just reference the bundle.js file that is created by Browserify.

REMEMBER: Browserify will not include a node package in the bundle file
unless that node package is referenced somewhere in entry.js with require()
For example: 

PerspT = require('perspective-transform')

Variables and functions made here should be accessible in the command line and
in all other js files. If they're not, you likely forgot to update 
bundle.js with Browserify.
*/

perspectiveJS = require('perspectivejs')
