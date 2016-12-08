/**
 * s-declare    
 * MIT License Copyright (c) 2016 Serhii Perekhrest <allsajera@gmail.com> ( Sajera )    
 */
(function () {'use strict';
/**
 * nothing new just isArray
 *
 * @param some: { Any }
 * @returns: { Boolean }
 */
function isArray ( some ) {
    return Object.prototype.toString.call(some) == '[object Array]';
}

/**
 * easy to use and clever Storage
 * it can
 *      return the stored module
 *      check the existence of module in storage
 * futures
 *      record the module\s from another storage       
 *      
 *
 * @constructor
 */
function Storage () {

    // define the storage of module
    Object.defineProperty(this, '_store', {
        value       : {},
        writable    : false,
        enumerable  : false,
        configurable: true,
        __proto__   : null
    });

    // define the event storage
    Object.defineProperty(this, '_events', {
        value       : {},
        writable    : false,
        enumerable  : false,
        configurable: true,
        __proto__   : null
    });

}

Storage.prototype = {
    constructor: Storage,

    /**
     * getting initialized module from storage
     *
     * @param id: { String } - id/name of module
     * @param inctance: { any } - result of instantiate a module
     * @returns: { any }
     */
    get: function ( id ) {
        if ( this.isExist(id) ) {
            return this['_store'][id];
        } else {
            throw new Error('Module '+id+' not existing.');
        }
    },

    /**
     * setting initialized module in storage
     *
     * @param id: { String } - id/name of module
     * @param inctance: { any } - result of instantiate a module
     * @returns: { any }
     */
    set: function ( id, inctance ) {
        if ( !this.isExist(id) ) {
            return this['_store'][id] = inctance;
        } else {
            throw new Error('Module '+id+' already exist.');
        }
    },

    /**
     * check the availability of the id in storage 
     *
     * @param id: { String }
     * @returns: { Boolean }
     */
    isExist: function ( id ) {
        return !!this['_store'][id];
    },
    
    /**
     * method to adding already existing modules
     *
     * @param: { Object }
     */
    record: function () {
        // 0, -1 might be the options
        var additions = Object.assign.apply(Object, [{}].concat(Array.prototype.slice.call(arguments)));
        for ( var key in additions ) {
            this.set( key, additions[key] );
        }
    }
};

// root storage for declare
var storage = new Storage;
/**
 * His Majesty "declare" declaration for module
 * execute a wrapper-function with inject module arguments
 * injected arguments - trying to find in store of declarator
 * if the identifier is not the String - make only instantiated module without saving in the storage
 *
 * @param id: { String|null } - module name
 * @param module: { Array|Function } - singlton wrapper of module
 * @returns: { any } results of execution of wrapper-function
 */
function declare ( id, wrap ) {
    // prepare id of module
    id = (typeof id === 'string' ? id : null);
    if ( id && storage.isExist(id) ) throw new Error('Module '+id+' already exist.');

    // try to get dependencies names from spec array
    if ( isArray(wrap['dependencies']) ) {
        wrap['dependencies'].push( wrap );
        wrap = wrap['dependencies'];
    // try to get dependencies names from arguments
    } else if ( typeof wrap == 'function' ) {
        var deeps = /^[\w\s]+\(([\w\s\,]*)\)/
            .exec(String(wrap))[1]
            .replace(/\s+/g,''); // might be empty string if without arguments
        wrap = (deeps ? deeps.split(',') : []).concat(wrap);
    }
    
    // make sure a wrapper-function is correct
    if ( !isArray(wrap) || typeof wrap[wrap.length-1] != 'function' )
        throw new Error('Incorrect data type for module declaration. Must be array or function');

    return id ? storage.set(id, instantiate(wrap)) : instantiate(wrap);
}

/**
 * instantiate module with inject dependencies
 * injected arguments - trying to find in storage
 *
 * @param list: { Array } - wrapper of module with last arguments wrapper-function
 * @returns: { any } results of execution of wrapper-function
 */
function instantiate ( list ) {
    var creator = list.splice(-1,1)[0], key = 0;
    for ( ; key < list.length; key ++ )
        list[key] = storage.get( list[key] );
    return creator.apply(null, list);
}
/*-------------------------------------------------
    save the origin method before rewrite to unique
---------------------------------------------------*/
var get = storage.get.bind(storage);

/*-------------------------------------------------
    logic of initialization of module is static it will not change
    but there are many nuances associated with the storage and retrieval modules
    they will be submitted for further development
---------------------------------------------------*/
declare['record'] = storage.record.bind(storage);

// implement unique get method for basic storage
storage.get = declare['require'] = (function () {

    if ( typeof process != 'undefined' && Object.prototype.toString.call(process) == '[object process]' ) {
        /**
         * emulate storing modules of node without duplication of catch
         *
         * @param id: { String }    - module name
         * @returns:                - module 
         */
        return function nodeGetModule ( id ) {
            if ( storage.isExist( id ) ) return get( id );
            else {
                if ( /\.\//g.test(id) ) // is file path
                    return require( (require('path')).join(process.cwd(), id) );
                else return require( id );
            }
        }
    }

    if ( typeof window != 'undefined' && Object.prototype.toString.call(window) == '[object Window]' ) {
        /**
         * TO DO emulation for define systems 
         * 
         *
         * @param id: { String }    - module name or absolute link
         * @returns:                - module 
         */
        return function browserGetModule ( id ) {
            return get( id );
        }
    }

})();


/*-------------------------------------------------
    fire events
    for the implementation of subscriptions
    to events within the application for modules
    It does not define any default event
---------------------------------------------------*/

/**
 * add listner on custom events 
 *
 * @param name: { String } - name of event which need to listen
 * @param listener: { Function } - handler of event
 * @returns: { Function } - remove event listner
 */
declare['on'] = function ( name, listener ) {
    var store = storage['_events'];
    // if it first listener on event - create array
    var listeners = store[name] ? store[name] : (store[name]=[]);
    // record index of listener
    var index = listeners.push(listener)-1;
    // remove listner
    return function () { listeners[index] = null; }
};

/**
 * add listner on custom events 
 * it executing only one time
 *
 * @param name: { String } - name of event which need to listen
 * @param listener: { Function } - handler of event
 */
declare['once'] = function ( name, listener ) {
    var remove = declare.on(name, function ( data ) {
        listener.call(this, data);
        remove();
    });
}

/**
 * to fire event in each listner
 *
 * @param name: { String } - event name
 * @param ctx: { Object } - context of executer of event
 * @param data: { Any } - any type and count of properties
 */
declare['emit'] = function ( name, ctx, data ) {
    data = typeof data == 'object' ? data : {};
    var listeners = storage['_events'][name];
    if ( listeners ) {
        var key = 0;
        data.stopPropagation = function () {key = listeners.length;};
        // fire events
        do { listeners[key]&&listeners[key].call(ctx, data);
        } while ( (++key)<listeners.length ) 
    }
};


/*-------------------------------------------------
    define the declare on the platform      
---------------------------------------------------*/
if ( typeof window != 'undefined' && Object.prototype.toString.call(window) == '[object Window]' ) {

    window['declare'] = declare;
}

if ( typeof process != 'undefined' && Object.prototype.toString.call(process) == '[object process]' ) {

    module.exports = declare;
}

})() 