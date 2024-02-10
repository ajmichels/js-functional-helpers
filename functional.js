module.exports = {
    adjust: curry(adjust),
    batch: curry(batch),
    compose,
    composeAsync,
    curry,
    defaultTo: curry(defaultTo),
    entries,
    eqBy: curry(equalBy),
    equalBy,
    equals: curry(equals),
    excludes: curry(excludes),
    filter: curry(filter),
    filterByExclusionFrom,
    filterByInclusionIn,
    find: curry(find),
    findIndex: curry(findIndex),
    forEach: curry(forEach),
    fromEntries,
    identity,
    ifElse: curry(ifElse),
    ifElseAsync: curry(ifElseAsync),
    includes: curry(includes),
    isEmpty,
    isNil,
    isNull,
    keys,
    map: curry(map),
    mapToProp,
    not,
    omitBy: curry(omitBy),
    once,
    partial,
    pick: curry(pick),
    pickBy: curry(pickBy),
    pipe,
    pipeAsync,
    project: curry(project),
    prop: curry(prop),
    sort: curry(sort),
    uniq,
    uniqBy: curry(uniqBy),
    values,
}

/**
 * Modify the value of a specific item within an array using the given
 * function.
 *
 * @param {Number} index  The index of the item to be modified.
 * @param {Function} func  The function used to modify the item.
 * @param {Array} array  The array to be modified.
 * @return {Array}  A new array with the modified value.
 */
function adjust(index, func, array) {
    return array.map((value, i) => i !== index ? value : func(value))
}

/**
 * Create an array of arrays with lengths less than or equal to the given size
 * and spread the items from the given array into those nested arrays.
 *
 * @param Integer size
 * @param Array array
 * @return Array
 */
function batch(size, array) {
    const sizeInt = parseInt(size)
    const batchCount = Math.ceil(array.length / sizeInt)
    const toBatch = (_, i) => array.slice(parseInt(i * sizeInt), parseInt((i * sizeInt) + sizeInt))
    return Array(batchCount).fill([]).map(toBatch)
}


/**
 * Create a new function that will execute all given functions from right to
 * left, passing the output of each function as the input to the next. The
 * first argument can accept multiple arguments.
 *
 * @param Array<Function> ...funcs
 * @return Function
 */
function compose(...funcs) {
    return pipe(...funcs.reverse())
}

/**
 * Same as compose() but for functions which return a promise. The result of
 * the generated function will always be a promise.
 *
 * @param Array<Function> ...funcs
 * @return Function
 */
function composeAsync(...funcs) {
    return pipeAsync(...funcs.reverse())
}

/**
 * Returns a curried version of the given function.
 *
 * @param Function func
 * @return Function
 */
function curry(func) {
    return function curried(...args) {
        if (args.length >= func.length) return func.apply(this, args)
        return (...args2) => curried.apply(this, args.concat(args2))
    }
}

/**
 * Returns second argument if it is not nil, otherwise returns first argument
 *
 * @param mixed dfault
 * @param mixed value
 * @return mixed
 */
function defaultTo(dfault, value) {
    return (isNil(value) || Number.isNaN(value)) ? dfault : value
}

/**
 * A wrapper for Object.entries()
 *
 * @param Object object
 * @return Array
 */
function entries(object) {
    return Object.entries(object)
}

/**
 * Use the given function to evaluate if the rest of the given arguments are
 * absolutely equivalant.
 *
 * @param Function predicate  Function used to check equality
 * @param Mixed value1  First value to check
 * @param Mixed ...values  All other values to check
 * @return Boolean
 */
function equalBy(predicate, value1, ...values) {
    const value = predicate(value1)
    const compareReducer = (equal, arg) => equal && value === predicate(arg)
    return values.reduce(compareReducer, values.length && true)
}

/**
 * Returns true if its arguments are equivalent, false otherwise. Handles
 * cyclical data structures.
 *
 * @param Mixed value1
 * @param Mixed value2
 * @return Boolean
 */
function equals(value1, value2) {
    return value1 === value2
}

/**
 * Curried function that determines if the given array does not contain the
 * given value
 *
 * @param Array array
 * @return Function
 */
function excludes(array, value) {
    return !array.includes(value)
}

/**
 * Wrapper for Array.prototype.filter()
 *
 * @param Function predicate
 * @param Array array
 * @return Array
 */
function filter(predicate, array) {
    return array.filter(predicate)
}

/**
 * Returns a function that filters the an array by inclusion in the given array
 *
 * @param Array array
 * @return Function
 */
function filterByInclusionIn(array) {
    return partial(filter, partial(includes, array))
}

/**
 * Returns a function that filters the an array by exclusion from the given array
 *
 * @param Array array
 * @return Function
 */
function filterByExclusionFrom(array) {
    return partial(filter, partial(excludes, array))
}

/**
 * Wrapper for Array.prototyp.find()
 *
 * @param Function predicate
 * @param Array array
 * @return mixed
 */
function find(predicate, array) {
    return array.find(predicate)
}

/**
 * Wrapper for Array.prototyp.findIndex()
 *
 * @param Function predicate
 * @param Array array
 * @return Integer
 */
function findIndex(predicate, array) {
    return array.findIndex(predicate)
}

/**
 * Wrapper for Array.prototype.forEach() but returns original array
 *
 * @param Function func
 * @param Array array
 * @return Array
 */
function forEach(func, array) {
    return (array.forEach(func), array)
}

/**
 * A wrapper for Object.fromEntries()
 *
 * @param Array entries
 * @return Object
 */
function fromEntries(entries) {
    return Object.fromEntries(entries)
}

/**
 * Return a function which returns the given value
 *
 * @param Mixed value
 * @return Function
 */
function identity(value) {
    return () => value
}

/**
 * Creates a function that will process either the onTrue or the onFalse
 * function depending upon the result of the predicate.
 *
 * @param Function predicate
 * @param Function onTrue
 * @param Function onFalse
 * @return Function
 */
function ifElse(predicate, onTrue, onFalse) {
    return (...args) => predicate(...args) ? onTrue(...args) : onFalse(...args)
}

/**
 * Creates a function that will process either the onTrue or the onFalse
 * function depending upon the result of the predicate. It is assumed
 * the predicate function will return a Promise. The returned function will
 * return a Promise.
 *
 * @param Function predicate
 * @param Function onTrue
 * @param Function onFalse
 * @return Function
 */
function ifElseAsync(predicate, onTrue, onFalse) {
    return async (...args) => await predicate(...args) ? onTrue(...args) : onFalse(...args)
}

/**
 * Curried function that determines if the given array contains a given value.
 *
 * @param Array array
 * @return Boolean
 */
function includes(array, value) {
    return array.includes(value)
}

/**
 * Return TRUE if the value is Nil or empty array or empty string
 *
 * @param Mixed value
 * @return Boolean
 */
function isEmpty(value) {
    if (value instanceof Array) return value.length === 0
    return isNil(value)
        || value.toString().trim() === ''
}

/**
 * Return TRUE if the given value is NULL or undefined
 *
 * @param Mixed value
 * @return Boolean
 */
function isNil(value) {
    return isNull(value) || undefined === value
}

/**
 * Return TRUE if the given value is NULL
 *
 * @param Mixed value
 * @return Boolean
 */
function isNull(value) {
    return null === value
}

/**
 * A wrapper around Object.keys()
 *
 * @param Object object
 * @return Array
 */
function keys(object) {
    return Object.keys(object)
}

/**
 * A wrapper around Array.prototype.map()
 *
 * @param Function func
 * @param Array
 * @return Array
 */
function map(func, array) {
    return array.map(func)
}

/**
 * Creates a mapper function for use in Array.prototype.map() which extracts
 * the specified property from each array item.
 *
 * @param String name
 * @return Function
 */
function mapToProp(name) {
    return partial(map, curry(prop)(name))
}

/**
 * Return the Boolean inverse of the given value
 *
 * @param Boolean|Function  Either a boolean value or a function that returns a
 *                          boolean value
 * @return Boolean
 */
function not(value) {
    if (value instanceof Function) return (...args) => !value(...args)
    return !(value)
}

/**
 * Test each property value from the given Object and return a new object with
 * only properties that do not pass the predicate.
 *
 * @param Object object
 * @param Function predicate
 * @return Object
 */
function omitBy(object, predicate) {
    return Object.fromEntries(Object.entries(object).filter(([p, v]) => !predicate(v, p)))
}


/**
 * Create a new function from the given function that will only execute one
 * time. Subsequent executions of the returned function will return undefined.
 *
 * @param Function func
 * @return Function
 */
function once(func) {
    let hasRun = false
    let value
    return (...args) => hasRun ? value : (hasRun = true, value = func(...args))
}

/**
 * Partially apply the given arguments to the given function then return a new
 * function that expects the remaining arguments, if any.
 *
 * @param Function func
 * @param Mixed ...args
 * @return Function
 */
function partial(func, ...args) {
    return func.bind(null, ...args)
}

/**
 * Return object containing only given properties within given object.
 *
 * @param Array props  Array of property names to extract from object
 * @param Object object
 * @return Object
 */
function pick(props, object) {
    return fromEntries(entries(object).filter(([ prop ]) => props.includes(prop)))
}

/**
 * Returns a partial copy of an object containing only the keys that satisfy
 * the supplied predicate.
 *
 * @param Function predicate
 * @param Object object
 * @return Object
 */
function pickBy(predicate, object) {
    return fromEntries(entries(object).filter(([ prop ]) => predicate(prop)))
}

/**
 * Create a new function that will execute all given functions in order, passing
 * the output of each function as the input to the next. The first argument
 * can accept multiple arguments.
 *
 * @param Function func1
 * @param Function ...funcs
 * @return Function
 */
function pipe(func1, ...funcs) {
    return (...args) => funcs.reduce((arg, func) => func(arg), func1(...args))
}

/**
 * Same as pipe() but for functions which return a promise. The result of
 * the generated function will always be a promise.
 *
 * @param Function func1
 * @param Function ...funcs
 * @return Function
 */
function pipeAsync(func1, ...funcs) {
    const reducer = async (arg, func) => func(await arg)
    return (...args) => funcs.reduce(reducer, func1(...args))
}

/**
 * Applies pick() as a mapper to all of the items within the given array.
 *
 * @param Array props
 * @param Array<Object> array
 * @return Array
 */
function project(props, array) {
    return map(partial(pick, props), array)
}

/**
 * @param String name  The property name
 * @param Object object  The object the property exists in
 * @return mixed
 */
function prop(name, object) {
    return object[name]
}

/**
 * Wrapper for Array.prototype.toSorted() or Array.prototype.sort(), but the
 * latter will return a new array
 *
 * @param Function func
 * @param Array array
 * @return Array
 */
function sort(func, array) {
    return array?.toSorted ? array.toSorted(func) : [...array].sort(func)
}

/**
 * Returns a copy of the given array with all duplicate values removed.
 *
 * @param Array array
 * @return Array
 */
function uniq(array) {
    return array.filter((value, index) => index === array.indexOf(value))
}

/**
 * Returns a copy of the given array with all duplicates, as determined by the
 * given function, are removed.
 *
 * @param Function predicate
 * @param Array array
 * @return Array
 */
function uniqBy(predicate, array) {
    return array.filter((value, index) => index === array.findIndex((...args) => predicate(value, ...args)))
}

/**
 * A wrapper for Object.values()
 *
 * @param Object object
 * @return Array
 */
function values(object) {
    return Object.values(object)
}
