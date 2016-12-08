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
            if ( storage.isExist(id) ) return get( id );
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

