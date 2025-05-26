import { describe, expect, it } from 'vitest'
import { addZero, isNumberString } from '../index'

describe('utils/index.ts', () => {
  it('addZero', async () => {
    expect(addZero('')).toBe('00')
    expect(addZero(1)).toBe('01')
    expect(addZero('1')).toBe('01')
    expect(addZero('12')).toBe('12')
    expect(addZero('123')).toBe('123')
    expect(addZero('123', 5)).toBe('00123')
  })

  it('isNumberString', async () => {
    expect(isNumberString('')).toBe(false)
    expect(isNumberString('0')).toBe(true)
    expect(isNumberString('+0')).toBe(true)
    expect(isNumberString('-1')).toBe(true)
    expect(isNumberString('99.9')).toBe(true)
    expect(isNumberString('9e2')).toBe(true)
  })
})
