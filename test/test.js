
'use strict';
console.log('test');
console.time('test');

var declare = require('../declare.js');
var is = require('s-is');

if ( is('platform', 'browser') ) {
    window.declare = declare;
}
/*-------------------------------------------------

    TEST MUDULES

---------------------------------------------------*/
// import modules from vendors
declare.record({
    'test1': {test: 1},
    'test2': {test: 2},
    'test3': {test: 3},
    'test4': {test: 4},
    'test5': {test: 5},
    'test6': require('./load-me.js'),
});

// create first module
declare('module1', ['./test/load-me.js', function ( test ) {
    console.log('module1 module\n', arguments);
    declare.once('init', function () {
        console.log('module1 module fire event "init"');
    });
    return {module: 1};
}]);

declare('module2', function ( test1, test2, test3, test6 ) {
    console.log('module2 module\n', arguments);
    declare.once('init', function () {
        console.log('module2 module fire event "init"');
    });
    return {module: 2};
});

declare(null, function ( test1, module1, module2 ) {
    console.log('null module\n', arguments);
    declare.once('init', function () {
        console.log('null module fire event "init"');
    });
    return {test: null};
});

module.exports = declare('some', function ( test1, module1, module2 ) {
    console.log('some module\n', arguments);
    declare.once('init', function () {
        console.log('null module fire event "init"');
    });
    return {some: arguments};
});

declare.emit('init');

if(
    declare.require('some') == module.exports
    && declare.require('some') == require('./test.js')
) {
    console.log( 'Completely usability victory !!!' );
} else {
    console.log( 'Completely fail ...' );
};

console.timeEnd('test');