
'use strict';
console.log('test');
console.time('test');

var declare = require('../index.js');

if ( typeof window != 'undefined' ) {
	window.declare = declare;
}

/*-------------------------------------------------

		TEST MUDULES

---------------------------------------------------*/
declare.readFiles(['./test/test.lib.js']);

declare('test1', ['./test/test.js', './index.js', function ( test, declare ) {
	// console.log('test1 arguments', arguments);
	return {test: 1};
}]);

declare('test2', function ( test1 ) {
	// console.log('test2 arguments', arguments);
	return {test: 2};
});

module.exports = declare('test3', function ( test1, test2, testLib ) {
	// console.log('test3 arguments', arguments);
	return {test: 3};
});

declare(null, function ( test1, test2, testLib ) {
	// console.log('null arguments', arguments);
	return {test: null};
});


if( declare.require('test3') == module.exports ) {
	console.log( 'Completely usability victory !!!' );
} else {
	console.log( 'Completely fail ...' );
};

console.timeEnd('test');