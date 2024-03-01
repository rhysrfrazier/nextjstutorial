import { expect, test } from 'vitest'
import { generatePagination } from '../utils'

test('generatePagination', () => {
    expect(generatePagination(1, 6)).toStrictEqual([1,2,3,4,5,6])
    expect(generatePagination(2, 10)).toStrictEqual([1,2,3,'...',9,10])
})

test('amongLast3', () => {
    expect(generatePagination(8, 10)).toStrictEqual([1,2,'...',8,9,10])
})