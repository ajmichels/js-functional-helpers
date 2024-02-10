const fixedDate = new Date('2023-11-15T00:33:12.000Z')
jest.useFakeTimers().setSystemTime(fixedDate)

const date = require('./date')

describe('compareByProp()', () => {
    const prop = 'foo'
    const lowDate = { foo: new Date(123432) }
    const highDate = { foo: new Date(542432) }

    it('returns function', () => {
        const result = date.compareByProp(prop)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = date.compareByProp(prop)

        it('returns 0 for equal dates', () => {
            const result = func(lowDate, lowDate)
            expect(result).toBe(0)
        })

        it('returns negative integer for ', () => {
            const result = func(highDate, lowDate)
            expect(result).toBeLessThan(0)
        })

        it('returns positive integer for ', () => {
            const result = func(lowDate, highDate)
            expect(result).toBeGreaterThan(0)
        })

        describe('when second argument (asc) is TRUE', () => {
            const func = date.compareByProp(prop, true)

            it('returns 0 for equal dates', () => {
                const result = func(highDate, highDate)
                expect(result).toBe(0)
            })

            it('returns negative integer for ', () => {
                const result = func(lowDate, highDate)
                expect(result).toBeLessThan(0)
            })

            it('returns positive integer for ', () => {
                const result = func(highDate, lowDate)
                expect(result).toBeGreaterThan(0)
            })
        })
    })
})

describe('date()', () => {
    it('returns new Date object', () => {
        const result = date.date()
        expect(result).toBeInstanceOf(Date)
        expect(result).toEqual(fixedDate)
    })

    it('returns new Date with input date value', () => {
        const result = date.date('1234-01-02T03:04:05Z')
        expect(result).toBeInstanceOf(Date)
        expect(result.toISOString()).toBe('1234-01-02T03:04:05.000Z')
    })

    it('returns Date object if given Date object', () => {
        const input = new Date()
        const result = date.date(input)
        expect(result).toBe(input)
    })
})

describe('time()', () => {
    it('returns unix timestamp in milliseconds', () => {
        const result = date.time()
        expect(result).toBe(1700008392000)
    })

    it('returns ', () => {
        const result = date.time(8392000)
        expect(result).toBe(8392000)
    })
})

describe('iso()', () => {
    it('returns ISO datetime string', () => {
        const result = date.iso()
        expect(result).toBe('2023-11-15T00:33:12.000Z')
    })
})

describe('locale()', () => {
    it('returns locale date string', () => {
        const result = date.locale(null, 'en-us', { timeZone: 'America/Chicago' })
        expect(result).toBe('11/14/2023, 6:33:12 PM')
    })
})

describe('sortByProp', () => {
    const prop = 'foo'

    it('returns a function', () => {
        const result = date.sortByProp(prop)
        expect(result).toBeInstanceOf(Function)
    })

    describe('returned function', () => {
        const func = date.sortByProp(prop)
        const array = [
            { foo: new Date(53415325) },
            { foo: new Date(33415325) },
            { foo: new Date(13415325) },
            { foo: new Date(23415325) },
        ]

        it('returns new array', () => {
            const result = func(array)
            expect(result).toBeInstanceOf(Array)
            expect(result).not.toBe(array)
        })

        it('returns array sorted by date decending', () => {
            const result = func(array)
            expect(result).toStrictEqual([
                { foo: new Date(53415325) },
                { foo: new Date(33415325) },
                { foo: new Date(23415325) },
                { foo: new Date(13415325) },
            ])
        })

        describe('when second argument (asc) is TRUE', () => {
            const func = date.sortByProp(prop, true)

            it('returns array sorted by date ascending', () => {
                const result = func(array)
                expect(result).toStrictEqual([
                    { foo: new Date(13415325) },
                    { foo: new Date(23415325) },
                    { foo: new Date(33415325) },
                    { foo: new Date(53415325) },
                ])
            })
        })
    })
})
