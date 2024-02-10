const { partial, sort } = require('./functional')

module.exports = {
    compareByProp,
    date,
    iso,
    locale,
    sortByProp,
    time,
}

/**
 * Return a function that compares the given property within two objects.
 *
 * @param {String} prop
 * @param {boolean} asc  If TRUE compare the dates in ascending order
 * @returns {Integer}
 */
function compareByProp(prop, asc = false) {
    return ({ [prop]:a }, { [prop]:b }) => asc ? time(a)-time(b) : time(b)-time(a)
}

/**
 * Wrapper for the Date constructor
 *
 * @param {String|Integer|Date} value
 * @returns {Date}
 */
function date(value) {
    return (value instanceof Date ) ? value : value ? new Date(value) : new Date()
}

/**
 * Creates a Date instance from the given value then returns its ISO value
 *
 * @param {String|Integer|Date}
 * @returns {String}
 */
function iso(value) {
    return date(value).toISOString()
}

/**
 * Creates a Date instance from the given value then returns its localized
 * string equivalent.
 *
 * @param {String|Integer|Date}
 * @returns {String}
 */
function locale(value, ...args) {
    return date(value).toLocaleString(...args)
}

/**
 * Return an array sorting cuntion function that compares the given property
 * within each array item.
 *
 * @param {String} prop
 * @param {boolean} asc  If TRUE compare the dates in ascending order
 * @returns {Array}
 */
function sortByProp(prop, asc = false) {
    return partial(sort, compareByProp(prop, asc))
}

/**
 * Creates a Date instance from the given value then returns its Unix timestamp
 * value
 *
 * @param {String|Integer|Date}
 * @returns {Integer}
 */
function time(value) {
    return date(value).getTime()
}
