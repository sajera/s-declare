
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