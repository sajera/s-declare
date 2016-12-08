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
