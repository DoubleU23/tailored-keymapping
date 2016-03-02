#!/usr/bin/env node
'use strict';
const path = require('path');

require('babel-register')({
	ignore: new RegExp(path.resolve(__dirname, '../node_modules'))
});
require('babel-polyfill');

const TailoredKeyMapping = require('./TailoredKeymapping.js');
module.exports.default = TailoredKeyMapping;
