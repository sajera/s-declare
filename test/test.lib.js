
'use strict'

console.log('test.lib');

var declare = require('../index.js');

module.exports = declare('testLib', function ( http ) {
	// console.log('testLib arguments', arguments);
	return { test: 'lib', http: http };
});