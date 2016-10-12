
'use strict'

var ts = ({}).toString;
var path = require('path');

/**
 * declaratin for module
 *
 * @param: { String } - id
 * @param: { Object } - singlton wrapper of module
 * @returns: { Object }
 */
function declare ( id, wrap ) {
	if ( id !== String(id) && id !== null ) { throw new Error('id of module must be a string. ('+String(id)+')'); }
	/*-------------------------------------------------
		get a names of dependencies
	---------------------------------------------------*/
	if ( typeof wrap == 'function' ) { // from arguments
		var deeps = /^[\w\s]+\(([\w\s\,]*)\)/
			.exec(String(wrap))[1]
			.replace(/\s+/g,'');
				// if not empty string
		wrap = (deeps ? deeps.split(',') : []).concat(wrap);
	} 

	if ( ts.call(wrap) == '[object Array]' && typeof wrap[wrap.length-1] == 'function' ) { // from array
		var creator = wrap.splice(-1,1)[0];
		for ( var key = wrap.length-1; key >= 0; key -- ) {
			wrap[key] = nodeModule( wrap[key] );
		}
		if ( id ) {
			// return stored module
			return nodeModule._localSource[id] = creator.apply(null, wrap);
		} else { // no name - no store
			return creator.apply(null, wrap);
		}
	} else { throw new Error('Incorrect data type for module declaration. Must be array or function'); }
}
/**
 * if you neeed just read files to init some code 
 *
 * @param: { Array }
 */
declare.readFiles = function ( files ) {
	for ( var file of files ) require( path.join(process.cwd(), file) );
}

/**
 * try to find module in Node.js modules
 *
 * @param: { String } - name of module
 * @returns: { Object||null }
 */
declare.require = nodeModule;
function nodeModule ( name ) {
	if ( /\.\//g.test(name) ) { // is file path
		return require( path.join(process.cwd(), name) );
	} else { // is module name
		try { return require( name );
		} catch ( err ) {
			if ( nodeModule._localSource[name] ) {
				return nodeModule._localSource[name];
			} else { throw err; }
		}
	}
}
nodeModule._localSource = {};

/**
 * EXPORT
 * @public
 */
module.exports = declare;