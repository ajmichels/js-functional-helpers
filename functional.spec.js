const functional = require('./functional')

afterEach(jest.clearAllMocks)

describe('adjust(index, func, array)', () => {
    const index = 1
    const func = () => 'foo'
    const array = [ 1, 2, 3 ]

    it('returns a new array', () => {
        const result = functional.adjust(index, func, array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns array with item at index modified by func', () => {
        const result = functional.adjust(index, func, array)
        expect(result).toStrictEqual([ 1, 'foo', 3 ])
    })
})

describe('batch(size, array)', () => {
    const size = 2
    const array = [ 1, 2, 3, 4, 5 ]

    it('returns an array', () => {
        const result = functional.batch(size, array)
        expect(result).not.toBe(array)
    })

    it('returns an array of arrays containing at most `size` items', () => {
        const result = functional.batch(size, array)
        expect(result).toStrictEqual([ [ 1, 2 ], [ 3, 4], [ 5 ] ])
    })
})

describe('compose(...funcs)', () => {
    const func1 = jest.fn(arg => arg + 1)
    const func2 = jest.fn(arg => arg + 2)
    const func3 = jest.fn(arg => arg + 3)

    it('returns a function', () => {
        const result = functional.compose(func1, func2, func3)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.compose(func1, func2, func3)
        const value = 'foo'

        it('executes each of ...funcs in reverse order', () => {
            const result = func(value)
            expect(result).toBe('foo321')
            expect(func1).toHaveBeenCalledWith('foo32')
            expect(func2).toHaveBeenCalledWith('foo3')
            expect(func3).toHaveBeenCalledWith('foo')
        })
    })
})

describe('composeAsync(...funcs)', () => {
    const func1 = jest.fn(async arg => arg + 1)
    const func2 = jest.fn(async arg => arg + 2)
    const func3 = jest.fn(async arg => arg + 3)

    it('returns a function', () => {
        const result = functional.composeAsync(func1, func2, func3)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.composeAsync(func1, func2, func3)
        const value = 'foo'

        it('executes each of ...funcs in reverse order', async () => {
            const result = await func(value)
            expect(result).toBe('foo321')
            expect(func1).toHaveBeenCalledWith('foo32')
            expect(func2).toHaveBeenCalledWith('foo3')
            expect(func3).toHaveBeenCalledWith('foo')
        })
    })
})

describe('curry(func)', () => {
    const func = (arg1, arg2) => arg1 + arg2

    it('returns a new function', () => {
        const result = functional.curry(func)
        expect(result).not.toBe(func)
    })

    describe('returned function', () => {
        const curriedFunc = functional.curry(func)
        const nextFunc = curriedFunc('foo')

        it('executes with curried arguments', () => {
            const result = curriedFunc('foo', 'bar')
            expect(result).toBe('foobar')
        })

        it('executes with curried arguments', () => {
            const result = nextFunc('bar')
            expect(result).toBe('foobar')
        })
    })
})

describe('defaultTo(dfault, value)', () => {
    const dfault = 'bar'
    const value = 'foo'

    it('returns dfault if value is NULL', () => {
        const result = functional.defaultTo(dfault, null)
        expect(result).toBe(dfault)
    })

    it('returns dfault if value is undefined', () => {
        const result = functional.defaultTo(dfault, undefined)
        expect(result).toBe(dfault)
    })

    it('returns dfault if value is NaN', () => {
        const result = functional.defaultTo(dfault, NaN)
        expect(result).toBe(dfault)
    })

    it('returns value', () => {
        const result = functional.defaultTo(dfault, value)
        expect(result).toBe(value)
    })
})

describe('entries(object)', () => {
    const object = { foo: 'bar', biz: 'baz', buz: true, luz: 1 }

    it('returns entries', () => {
        const result = functional.entries(object)
        expect(result).toStrictEqual([
            [ 'foo', 'bar' ],
            [ 'biz', 'baz' ],
            [ 'buz', true ],
            [ 'luz', 1 ],
        ])
    })
})

describe('equalBy(predicate, value1, ...values)', () => {
    const predicate = object => object.id
    const value1 = { id: 'foo1' }
    const value2 = { id: 'foo1' }
    const value3 = { id: 'foo2' }

    it('returns FALSE if result of passing values to predicate are not equal', () => {
        const result = functional.equalBy(predicate, value1, value3)
        expect(result).toBe(false)
    })

    it('returns TRUE if result of passing values to predicate are equal', () => {
        const result = functional.equalBy(predicate, value1, value2)
        expect(result).toBe(true)
    })
})

describe('equals(value1, value2)', () => {
    const array = []
    const object = {}
    const equalValue = [
        ['foo', 'foo'],
        [123, 123],
        [object, object],
        [array, array],
    ]

    it.each(equalValue)('returns TRUE for equal values: %p', (value1, value2) => {
        const result = functional.equals(value1, value2)
        expect(result).toBe(true)
    })

    const unequalValue = [
        ['foo', 'bar'],
        [123, 321],
        [true, false],
        [object, {}],
        [array, []],
    ]

    it.each(unequalValue)('returns FALSE for non-equal values: %p', (value1, value2) => {
        const result = functional.equals(value1, value2)
        expect(result).toBe(false)
    })

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
})

describe('excludes(array, value)', () => {
    const array = [ 1, 2, 3 ]

    it('returns FALSE if value is in array', () => {
        const result = functional.excludes(array, 2)
        expect(result).toBe(false)
    })

    it('returns TRUE if value is not in array', () => {
        const result = functional.excludes(array, 5)
        expect(result).toBe(true)
    })
})

describe('filter(predicate, array)', () => {
    const predicate = value => value % 2 === 0
    const array = [ 1, 2, 3, 4 ]

    it('returns new array', () => {
        const result = functional.filter(predicate, array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns array filtered by predicate', () => {
        const result = functional.filter(predicate, array)
        expect(result).toStrictEqual([ 2, 4 ])
    })
})

describe('filterByInclusionIn(array)', () => {
    const array = [ 3, 7, 8 ]

    it('returns a function', () => {
        const result = functional.filterByInclusionIn(array)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.filterByInclusionIn(array)
        const input = [ 1, 2, 7, 3, 9 ]

        it('returns a new array', () => {
            const result = func(input)
            expect(result).toBeInstanceOf(Array)
            expect(result).not.toBe(input)
            expect(result).not.toBe(array)
        })

        it('returns array containing values given array that are also in reference array', () => {
            const result = func(input)
            expect(result).toStrictEqual([ 7, 3 ])
        })
    })
})

describe('filterByExclusionFrom(array)', () => {
    const array = [ 3, 7, 8 ]

    it('returns a function', () => {
        const result = functional.filterByExclusionFrom(array)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.filterByExclusionFrom(array)
        const input = [ 1, 2, 7, 3, 9 ]

        it('returns a new array', () => {
            const result = func(input)
            expect(result).toBeInstanceOf(Array)
            expect(result).not.toBe(input)
            expect(result).not.toBe(array)
        })

        it('returns array containing values given array that are also in reference array', () => {
            const result = func(input)
            expect(result).toStrictEqual([ 1, 2, 9 ])
        })
    })
})

describe('find(predicate, array)', () => {
    const predicate = value => value % 2 === 0
    const array = [ 1, 3, 23, 14, 52, 33, 28 ]

    it('returns first item from array that predicate returns true for', () => {
        const result = functional.find(predicate, array)
        expect(result).toBe(14)
    })
})

describe('findIndex(predicate, array)', () => {
    const predicate = value => value % 2 === 0
    const array = [ 1, 3, 23, 14, 52, 33, 28 ]

    it('returns first item from array that predicate returns true for', () => {
        const result = functional.findIndex(predicate, array)
        expect(result).toBe(3)
    })
})

describe('forEach(func, array)', () => {
    const func = jest.fn()
    const array = [ 1, 2, 3 ]

    it('returns original array', () => {
        const result = functional.forEach(func, array)
        expect(result).toBe(array)
    })

    it('executes function for each item', () => {
        functional.forEach(func, array)
        expect(func).toHaveBeenCalledTimes(3)
        expect(func).toHaveBeenNthCalledWith(1, 1, 0, array)
        expect(func).toHaveBeenNthCalledWith(2, 2, 1, array)
        expect(func).toHaveBeenNthCalledWith(3, 3, 2, array)
    })
})

describe('fromEntries(entries)', () => {
    const entries = [
        [ 'foo', 'bar' ],
        [ 'biz', 'baz' ],
        [ 'buz', true ],
        [ 'luz', 1 ],
    ]

    it('returns new object with entries', () => {
        const result = functional.fromEntries(entries)
        expect(result).toStrictEqual({ foo: 'bar', biz: 'baz', buz: true, luz: 1 })
    })
})

describe('identity(value)', () => {
    const value = { foo: 'bar' }

    it('returns function', () => {
        const result = functional.identity(value)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.identity(value)

        it('returns value', () => {
            const result = func()
            expect(result).toBe(value)
        })
    })
})

describe('ifElse(predicate, onTrue, onFalse)', () => {
    const predicate = jest.fn()
    const onTrue = jest.fn()
    const onFalse = jest.fn()

    beforeEach(() => {
        onTrue.mockReturnValue('ontrue')
        onFalse.mockReturnValue('onfalse')
    })

    it('returns a function', () => {
        const result = functional.ifElse(predicate, onTrue, onFalse)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.ifElse(predicate, onTrue, onFalse)
        const arg1 = 'foo'
        const arg2 = 'bar'

        it('passes arguments to predicate function', () => {
            func(arg1, arg2)
            expect(predicate).toHaveBeenCalledWith(arg1, arg2)
        })

        describe('when predicate returns FALSE', () => {
            beforeEach(() => predicate.mockReturnValue(false))

            it('passes arguments to onFalse', () => {
                func(arg1, arg2)
                expect(onFalse).toHaveBeenCalledWith(arg1, arg2)
            })

            it('returns result of onFalse function', () => {
                const result = func(arg1, arg2)
                expect(result).toBe('onfalse')
            })

            it('does not call onTrue function', () => {
                func(arg1, arg2)
                expect(onTrue).not.toHaveBeenCalled()
            })
        })

        describe('when predicate returns TRUE', () => {
            beforeEach(() => predicate.mockReturnValue(true))

            it('passes arguments to onTrue', () => {
                func(arg1, arg2)
                expect(onTrue).toHaveBeenCalledWith(arg1, arg2)
            })

            it('returns result of onTrue function', () => {
                const result = func(arg1, arg2)
                expect(result).toBe('ontrue')
            })

            it('does not call onFalse function', () => {
                func(arg1, arg2)
                expect(onFalse).not.toHaveBeenCalled()
            })
        })
    })
})

describe('ifElseAsync(predicate, onTrue, onFalse)', () => {
    const predicate = jest.fn()
    const onTrue = jest.fn()
    const onFalse = jest.fn()

    beforeEach(() => {
        onTrue.mockReturnValue('ontrue')
        onFalse.mockReturnValue('onfalse')
    })

    it('returns a function', () => {
        const result = functional.ifElseAsync(predicate, onTrue, onFalse)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.ifElseAsync(predicate, onTrue, onFalse)
        const arg1 = 'foo'
        const arg2 = 'bar'

        it('passes arguments to predicate function', async () => {
            await func(arg1, arg2)
            expect(predicate).toHaveBeenCalledWith(arg1, arg2)
        })

        describe('when predicate returns FALSE', () => {
            beforeEach(() => predicate.mockResolvedValue(false))

            it('passes arguments to onFalse', async () => {
                await func(arg1, arg2)
                expect(onFalse).toHaveBeenCalledWith(arg1, arg2)
            })

            it('returns result of onFalse function', async () => {
                const result = await func(arg1, arg2)
                expect(result).toBe('onfalse')
            })

            it('does not call onTrue function', async () => {
                await func(arg1, arg2)
                expect(onTrue).not.toHaveBeenCalled()
            })
        })

        describe('when predicate returns TRUE', () => {
            beforeEach(() => predicate.mockResolvedValue(true))

            it('passes arguments to onTrue', async () => {
                await func(arg1, arg2)
                expect(onTrue).toHaveBeenCalledWith(arg1, arg2)
            })

            it('returns result of onTrue function', async () => {
                const result = await func(arg1, arg2)
                expect(result).toBe('ontrue')
            })

            it('does not call onFalse function', async () => {
                await func(arg1, arg2)
                expect(onFalse).not.toHaveBeenCalled()
            })
        })
    })
})

describe('includes(array, value)', () => {
    const array = [ 1, 2, 3 ]

    it('returns FALSE if value is not in array', () => {
        const value = 5
        const result = functional.includes(array, value)
        expect(result).toBe(false)
    })

    it('returns TRUE if value is not in array', () => {
        const value = 2
        const result = functional.includes(array, value)
        expect(result).toBe(true)
    })
})

describe('isEmpty(value)', () => {
    it('returns TRUE if value is empty array', () => {
        const result = functional.isEmpty([])
        expect(result).toBe(true)
    })

    it('returns TRUE if value is NULL', () => {
        const result = functional.isEmpty(null)
        expect(result).toBe(true)
    })

    it('returns TRUE if value is undefined', () => {
        const result = functional.isEmpty(undefined)
        expect(result).toBe(true)
    })

    it('returns TRUE if value is empty string', () => {
        const result = functional.isEmpty('')
        expect(result).toBe(true)
    })

    it('returns TRUE if value is string with only white space', () => {
        const result = functional.isEmpty('     ')
        expect(result).toBe(true)
    })
})

describe('isNil(value)', () => {
    it('returns TRUE if value is NULL', () => {
        const result = functional.isNil(null)
        expect(result).toBe(true)
    })

    it('returns TRUE if value is undefined', () => {
        const result = functional.isNil(undefined)
        expect(result).toBe(true)
    })

    it('returns FALSE', () => {
        const result = functional.isNil('foo')
        expect(result).toBe(false)
    })
})

describe('isNull(value)', () => {
    it('returns TRUE if value is NULL', () => {
        const result = functional.isNull(null)
        expect(result).toBe(true)
    })

    it('returns FALSE', () => {
        const result = functional.isNull('foo')
        expect(result).toBe(false)
    })
})

describe('keys(object)', () => {
    const object = { foo: 'bar', baz: 'biz' }

    it('returns object keys', () => {
        const result = functional.keys(object)
        expect(result).toStrictEqual([ 'foo', 'baz' ])
    })
})

describe('map(func, array)', () => {
    const func = value => value * 2
    const array = [ 1, 2, 3, 4, 5 ]

    it('returns new array', () => {
        const result = functional.map(func, array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns array of mapped values', () => {
        const result = functional.map(func, array)
        expect(result).toStrictEqual([ 2, 4, 6, 8, 10 ])
    })
})

describe('mapToProp(name)', () => {
    const name = 'foo'
    const array = [
        { foo: 'bar1', biz: 'baz1' },
        { foo: 'bar2', biz: 'baz2' },
        { foo: 'bar3', biz: 'baz3' },
    ]

    it('returns function', () => {
        const result = functional.mapToProp(name)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.mapToProp(name)

        it('returns new array', () => {
            const result = func(array)
            expect(result).toBeInstanceOf(Array)
            expect(result).not.toBe(array)
        })

        it('returns array of values for property with name', () => {
            const result = func(array)
            expect(result).toStrictEqual([ 'bar1', 'bar2', 'bar3' ])
        })
    })
})

describe('not(value)', () => {
    it('returns FALSE if given TRUE', () => {
        const result = functional.not(true)
        expect(result).toBe(false)
    })

    it('returns TRUE if given FALSE', () => {
        const result = functional.not(false)
        expect(result).toBe(true)
    })

    it('returns new function when given function', () => {
        const result = functional.not(() => {})
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        it('returns FALSE if given original function returns TRUE', () => {
            const func = functional.not(() => true)
            const result = func()
            expect(result).toBe(false)
        })

        it('returns TRUE if given original function returns FALSE', () => {
            const func = functional.not(() => false)
            const result = func()
            expect(result).toBe(true)
        })
    })
})

describe('omitBy(object, predicate)', () => {
    const object = { foo: 'bar', baz: 'biz', buz: 'fuz' }
    const predicate = (key, value) => key.includes('z')

    it('returns new object', () => {
        const result = functional.omitBy(object, predicate)
        expect(result).toBeInstanceOf(Object)
        expect(result).not.toBe(object)
    })

    it('returns object excluding properties matched by predicate', () => {
        const result = functional.omitBy(object, predicate)
        expect(result).toStrictEqual({ foo: 'bar' })
    })
})

describe('once(func)', () => {
    const func = jest.fn()

    it('returns new function', () => {
        const result = functional.once(func)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const value = 'foo'

        let funcOnce
        beforeEach(() => {
            func.mockReturnValue(value)
            funcOnce = functional.once(func)
        })

        it('only calls original function once', () => {
            funcOnce()
            funcOnce()
            funcOnce()
            expect(func).toHaveBeenCalledTimes(1)
        })

        it('returns the same value each time its called', () => {
            expect(funcOnce()).toBe(value)
            expect(funcOnce()).toBe(value)
            expect(funcOnce()).toBe(value)
        })
    })
    /**
     * Create a new function from the given function that will only execute one
     * time. Subsequent executions of the returned function will return undefined.
     *
     * @param Function func
     * @return Function
     */
    function once(func) {
        let hasRun = false
        return (...args) => hasRun ? undefined : (hasRun = true, func(...args))
    }
})

describe('partial(func, ...args)', () => {
    const func = (arg1, arg2) => arg1 + arg2

    it('returns new function', () => {
        const result = functional.partial(func, 'foo')
        expect(result).not.toBe(func)
    })

    describe('returned function', () => {
        const newFunc = functional.partial(func, 'foo')

        it('returns function result with both arguments', () => {
            const result = newFunc('bar')
            expect(result).toBe('foobar')
        })
    })
})

describe('pick(props, object)', () => {
    const object = { foo: 'bar', biz: 'baz', buz: 'fuz' }
    const props = [ 'buz', 'biz' ]

    it('returns new object', () => {
        const result = functional.pick(props, object)
        expect(result).not.toBe(object)
    })

    it('returns object with only props', () => {
        const result = functional.pick(props, object)
        expect(result).toStrictEqual({ buz: 'fuz', biz: 'baz' })
    })
})

describe('pickBy(predicate, object)', () => {
    const predicate = key => key.includes('b')
    const object = { foo: 'bar', biz: 'baz', buz: 'fuz' }

    it('returns new object', () => {
        const result = functional.pickBy(predicate, object)
        expect(result).toBeInstanceOf(Object)
        expect(result).not.toBe(object)
    })

    it('returns new object with properties passing predicate', () => {
        const result = functional.pickBy(predicate, object)
        expect(result).toStrictEqual({ biz: 'baz', buz: 'fuz' })
    })
})

describe('pipe(func1, ...funcs)', () => {
    const func1 = jest.fn(arg => arg + 1)
    const func2 = jest.fn(arg => arg + 2)
    const func3 = jest.fn(arg => arg + 3)

    it('returns a function', () => {
        const result = functional.pipe(func1, func2, func3)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.pipe(func1, func2, func3)
        const value = 'foo'

        it('executes each of ...funcs', () => {
            const result = func(value)
            expect(result).toBe('foo123')
            expect(func1).toHaveBeenCalledWith('foo')
            expect(func2).toHaveBeenCalledWith('foo1')
            expect(func3).toHaveBeenCalledWith('foo12')
        })
    })
})

describe('pipeAsync(func1, ...funcs)', () => {
    const func1 = jest.fn(async arg => arg + 1)
    const func2 = jest.fn(async arg => arg + 2)
    const func3 = jest.fn(async arg => arg + 3)

    it('returns a function', () => {
        const result = functional.pipeAsync(func1, func2, func3)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = functional.pipeAsync(func1, func2, func3)
        const value = 'foo'

        it('executes each of ...funcs', async () => {
            const result = await func(value)
            expect(result).toBe('foo123')
            expect(func1).toHaveBeenCalledWith('foo')
            expect(func2).toHaveBeenCalledWith('foo1')
            expect(func3).toHaveBeenCalledWith('foo12')
        })
    })
})

describe('project(props, array)', () => {
    const props = [ 'foo' ]
    const array = [
        { foo: 'bar1', biz: 'baz1', buz: 'fuz1' },
        { foo: 'bar2', biz: 'baz2', buz: 'fuz2' },
        { foo: 'bar3', biz: 'baz3', buz: 'fuz3' },
    ]

    it('returns new array', () => {
        const result = functional.project(props, array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns array of objects containing only props', () => {
        const result = functional.project(props, array)
        expect(result).toStrictEqual([
            { foo: 'bar1' },
            { foo: 'bar2' },
            { foo: 'bar3' },
        ])
    })
})

describe('prop(name, object)', () => {
    const object = { foo: 'bar' }

    it('returns value of property with name from object', () => {
        const result = functional.prop('foo', object)
        expect(result).toBe('bar')
    })
})

describe('sort(func, array)', () => {
    const func = (a, b) => a.name.localeCompare(b.name)
    const array = [
        { name: 'xaa' },
        { name: 'cba' },
        { name: 'abc' },
        { name: 'efs' },
    ]

    it('returns new array', () => {
        const result = functional.sort(func, array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns array sorted by func', () => {
        const result = functional.sort(func, array)
        expect(result).toStrictEqual([
            { name: 'abc' },
            { name: 'cba' },
            { name: 'efs' },
            { name: 'xaa' },
        ])
    })
})

describe('uniq(array)', () => {
    const object = { foo: 'bar' }
    const array = [ object, 123, true, 'biz', 123, object, 'biz' ]

    it('returns a new array', () => {
        const result = functional.uniq(array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns an array with duplicate values removed', () => {
        const result = functional.uniq(array)
        expect(result).toStrictEqual([ object, 123, true, 'biz' ])
    })
})

describe('uniqBy(func, array)', () => {
    const func = (objectA, objectB) => objectA.name === objectB.name
    const array = [
        { name: 'foo' },
        { name: 'bar' },
        { name: 'foo' },
    ]

    it('returns new array', () => {
        const result = functional.uniqBy(func, array)
        expect(result).toBeInstanceOf(Array)
        expect(result).not.toBe(array)
    })

    it('returns array containing items unique by func', () => {
        const result = functional.uniqBy(func, array)
        expect(result).toStrictEqual([ array[0], array[1] ])
    })

    /**
     * Returns a copy of the given array with all duplicates, as determined by the
     * given function, are removed.
     *
     * @param Function func
     * @param Array array
     * @return Array
     */
    function uniqBy(func, array) {
        return array.filter((value, index) => index === array.findIndex((...args) => func(value, ...args)))
    }
})

describe('values(object)', () => {
    const object = { foo: 'bar', biz: 'baz' }

    it('returns object values', () => {
        const result = functional.values(object)
        expect(result).toStrictEqual([ 'bar', 'baz' ])
    })
})
