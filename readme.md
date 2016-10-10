s-declare
===============
An easy way to create named modules within the application.

```shell
npm i s-declare --save
```

Declaration for named module
--------------
Arguments it's a modules (your or from Node.js require) which be applied to function for your creating module. Of course, we can use the standard way.

```javascript

module.exports = require('s-declare')('test', function ( path, http, url ) {
	// code of module
	return {}; // stored like a module 'test'
});

```
**Note:**	With this declaration, you can overwrite a third-party module

>**Keep in mind:** Keep in mind - it will still be available by means of a native call (require)

	
Creating npm package
--------------
When we create a separate module, and do not want to be part of the grid. Declaring a private repository for modules.

```javascript

module.exports = require('s-declare').privat('hash-for-unique-store')('test', function ( path, http, url ) {
	// code of module
	return {}; // stored like a module 'test' in 'hash-for-unique-store'
});

```

**Note:** Each declarator has a public list of its modules.
```javascript
require('s-declare').privat('hash-for-unique-store').store
```

Minimization ?
--------------

```javascript

module.exports = require('s-declare')('test', [path, http, url, function ( path, http, url ) {
	// code of module
	return {}; // stored like a module 'test' in 'hash-for-unique-store'
}]);

```