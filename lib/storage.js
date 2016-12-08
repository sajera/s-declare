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
