
/*-------------------------------------------------
    define the declare on the platform      
---------------------------------------------------*/
if ( typeof window != 'undefined' && Object.prototype.toString.call(window) == '[object Window]' ) {

    window['declare'] = declare;
}

if ( typeof process != 'undefined' && Object.prototype.toString.call(process) == '[object process]' ) {

    module.exports = declare;
}
