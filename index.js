
(function ( global, util ) {

	'use strict'

	/**
	 * instantiate module with inject dependencies
	 *
	 * @param: { Array } - wrapper of module
	 * @returns: { any }
	 */
	function instantiate ( list ) {
		var creator = list.splice(-1,1)[0], key = 0;
		for ( ; key < list.length; key ++ )
			list[key] = util.require( list[key] );
		return creator.apply(null, list);
	}

	/**
	 * instantiator expected array, with last element  function of creating
	 *
	 * @param: { Array|Function }
	 * @returns: { Object }
	 */
	function toExpected ( wrap ) {
		// get dependencies from spec array
		if ( util.isArray(wrap['dependencies']) ) {
			wrap['dependencies'].push( wrap );
			wrap = wrap['dependencies'];
		}
		// get dependencies from arguments
		if ( typeof wrap == 'function' ) {
			var deeps = /^[\w\s]+\(([\w\s\,]*)\)/
				.exec(String(wrap))[1]
				.replace(/\s+/g,''); // might be empty string if without arguments
			return (deeps ? deeps.split(',') : []).concat(wrap);
		}
		if ( util.isArray(wrap) && typeof wrap[wrap.length-1] == 'function' ) return wrap
		else throw new Error('Incorrect data type for module declaration. Must be array or function');
	}

	/**
	 * declaratin for module
	 * if the identifier is not the String - make only instantiated module without saving in the storage
	 *
	 * @param: { String } - id
	 * @param: { Array|Function } - singlton wrapper of module
	 * @returns: { any }
	 */
	function declare ( id, module ) {
		// prepare id of module
		id = typeof id === 'string' ? id : null;
		// create a module
		module = instantiate( toExpected( module ) );
		// store module
		if ( id ) {
			if ( util.storage[id] ) throw new Error('Module '+id+' already exist.');
			return util.storage[id] = module;
		} else return module;
	}
	/*-------------------------------------------------
		ADDITIONAL
	---------------------------------------------------*/
	// for requiring modules outside of declarator
	declare.require = util.require;
	/**
	 * to extend a storage from outside
	 * cleaning of excess or renaming modules of declarator
	 *
	 * @param: { Function }
	 * @returns: { Object }
	 */
	declare.extendStorage = function ( extend ) {
		if ( typeof extend === 'function' ) extend.call(util.storage);
		else if ( extend && !util.isArray(extend) && typeof extend === 'object' )
			Object.assign(util.storage, extend);
	}

	/**
	 * EXPORT
	 * @public
	 */
	if ( typeof process == 'object' ) module.exports = declare;
	else global['declare'] = declare;
})(
/*-------------------------------------------------
	GLOBAL
---------------------------------------------------*/
	this, 
/*-------------------------------------------------
	UTIL of declarator
---------------------------------------------------*/
	new function Util () {
		var util = this;
		// is array
		var ts = ({}).toString;
		this.isArray = function (data) {return ts.call(data) == '[object Array]';};
		// storage
		this.storage = new function Storage () {};
		function requireFromStorage ( id ) {
			if ( util.storage[id] ) {
				return util.storage[id];
			} else throw new Error('Cannot find module'+id);
		}
		// define "require" under the system
		this.require = requireFromStorage;
		if ( typeof require == 'function' ) {
			if ( // expected it's a node with commonjs
				typeof module === 'object'
				&& typeof module.exports == 'object'
				&& typeof process
				&& ( require('path') )
			) {
				var path = require('path');
				this.require = function ( id ) {
					try { // is file path
						if ( /\.\//g.test(id) )
							return require( path.join(process.cwd(), id) );
						else return require( id );
					} catch ( err ) { return requireFromStorage( id ); }
				}
			} else { // requirejs(AMD) || commonjs without node
				this.require = function ( id ) {
					try { return require( id );
					} catch ( err ) { return requireFromStorage( id ); }
				}
			}
		}
	}
);