
'use strict'

//
var ts = ({}).toString;
function isArray ( data ) { return ts.call(data) == '[object Array]'; };

/**
 * S-declare
 * make module and record
 * @public
 * @param: { String } - id/name of module for declaration
 * @param: { Function|Array } - Function wich return module
 */
var store = {};
module.exports = declare.bind(store);
// store for public (maybe it's a bad idea)
module.exports['store'] = store;
/*-------------------------------------------------
	With this declaration, you can overwrite a third-party module
	Keep in mind - it will still be available by means of a native call (require)
---------------------------------------------------*/
function declare ( name, moduleWrap ) {
	/*-------------------------------------------------
		make an error if try to rewrite existing module
	---------------------------------------------------*/
	if ( this[name] ) { // already exist module
		throw new Error('Module '+name+' already exist. Module skipped.');
	}

	var modules;
	/*-------------------------------------------------
		get a module names
	---------------------------------------------------*/
	if ( isArray(moduleWrap) ) { // from array
		modules = moduleWrap.slice(0,-1);
		moduleWrap = moduleWrap[moduleWrap.length-1];
	} else if ( typeof moduleWrap == 'function' ) { // from arguments
		modules = /^[\w\s]+\(([\w\s\,]*)\)/
			.exec(String(moduleWrap))[1]
			.replace(/\s+/g,'');
		// if not empty string
		modules = modules ? modules.split(',') : [];
	} else {
		throw new Error('Incorrect data type for module declaration, '+name+' module skipped.');
	}
	/*-------------------------------------------------
		get a modules by names
	---------------------------------------------------*/
	if ( modules.length ) {
		for ( var key = 0, module; key < modules.length; key ++ ) {
			modules[key] = this[modules[key]]||require(modules[key]);
		}
		// make and record new module
		this[name] = moduleWrap.apply(null, modules);
	} else {
		this[name] = moduleWrap();
	}

	return this[name];
}


/**
 * customize for making npm modules
 *
 * @param: { Object } - store to context binding
 * @returns: { Function } - declarator
 */
module.exports['privat'] = privat.bind({});
/*-------------------------------------------------
	to exclude privat modules from global modules
	you may create store with id
---------------------------------------------------*/
function privat ( id ) {
	if ( this[id] ) {
		return this[id];
	} else {
		var store = {};
		// make a new method with context for stored data
		var declarator = declare.bind(store);
		// store for public (maybe it's a bad idea)
		declarator['store'] = store;
		return this[id] = declarator;
	}
}