
'use strict';

var declare = require('../index.js');

if ( typeof window != 'undefined' ) {
	window.declare = declare;
	window.custom = declare.privat('custom');
}

/*-------------------------------------------------
	PUBLIC		
---------------------------------------------------*/
declare('test1', function ( path, http, url ) {
	// test module 1
	return {
		path: path,
		http: http,
		url: url
	};
});
require('../index.js')('test2', function ( path, http, url, test1 ) {
	// test module 1
	return {
		path: path,
		http: http,
		url: url,
		test1: test1
	};
});

/*-------------------------------------------------
	PRIVAT (inside the module)
---------------------------------------------------*/
require('../index.js').privat('custom')('test1', function ( path, http, url ) {
	// test module 1
	return {
		path: path,
		http: http,
		url: url
	};
});

require('../index.js').privat('custom')('test2',function(path,http,url){
	// test module 1
	return {
		path: path,
		http: http,
		url: url
	};
});
