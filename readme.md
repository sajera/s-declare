
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

s-declare
===============
An easy way to create named modules within the application.

### installation
```shell
npm i s-declare --save
```

Declaration of module
--------------

Arguments it's a modules which be applied to function for creating module. Of course, we can use the standard way.

```javascript
var declare = require('s-declare');
// write like node module and declaration module
module.exports = declare('test', function ( path, http, url ) {
	// code of module
	return {}; // stored like a module 'test'
});

// got it
declare.require('test') // => stored module 'test'
```




	
More complicated
--------------

When we create a separate module, create a declaration of files related to this module.

```javascript
var declare = require('s-declare');

// then create module
module.exports = declare('myModule', ['path', 'http', 'url', './test/test.lib.js',
    function ( path, http, url, test ) {
    	// code of module
    	return {}; // stored like a module
    }]);
    
if( declare.require('myModule') == module.exports ) {
	console.log( 'Completely usability victory !!!' );
} else {
	console.log( 'Completely fail ...' );
};
```

No store
--------------

When we create a module for NPM no need stored parts of module in declarator.This is not just pointless and even harmful. We can only use the declarator for file management. To create a user-friendly module supplier.

```javascript
var declare = require('s-declare');

// with name null, a declarator isn't stored module
module.exports = declare(null, [
    'http', './lib/part-1.js', './lib/part-2.js', './lib/part-3.js', './lib/part-4.js',
    function ( http, part1, part2 ,part3, part4 ) {
    	// code prepering/wrapping
    	return { // stored like a module
    	    util: part1 ? part2 : part3,
    	    provider: function () {
    	        return Object.assign({}, part4);
    	    }
    	};
    }]);
```


[npm-image]: https://badge.fury.io/js/s-declare.svg
[npm-url]: https://npmjs.org/package/s-declare
[license-image]: http://img.shields.io/npm/l/s-declare.svg
[license-url]: LICENSE
