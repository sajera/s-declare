/**
 * nothing new just isArray
 *
 * @param some: { Any }
 * @returns: { Boolean }
 */
function isArray ( some ) {
    return Object.prototype.toString.call(some) == '[object Array]';
}
