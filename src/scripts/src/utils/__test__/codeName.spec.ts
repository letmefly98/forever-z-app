import { describe, expect, it } from 'vitest'
import {
  convertCodeName,
  getCodeName,
  isContinuousCodes,
  removeCodeNamePart,
} from '../codeName'

describe('utils/codeName.ts', () => {
  it('getCodeName', async () => {
    expect(getCodeName('FC2PPV 4172579 ★特典で無修正と膣内カメラ ♀92 初撮り★2023年最後は美乳美BODY、透き通る白さのピュアな素人との中出..')).toBe('FC2PPV 4172579')
    expect(getCodeName('VKO-2464 working woman 私のお尻は魅力的なんです')).toBe('VKO-2464')
    expect(getCodeName('adn-522-uncensored-leak')).toBe('adn-522')
    expect(getCodeName('magnet:?xt=urn:btih:98712CBA53F4CB331CE9A746C2610F2625F5F7E1&dn=EBOD-455')).toBe('EBOD-455')
    expect(getCodeName('dn=and-178未来Mirai')).toBe('and-178')
    expect(getCodeName('dn=av.pbd-164_1')).toBe('pbd-164')
    expect(getCodeName('dn=YRH-008.1080P')).toBe('YRH-008')
    expect(getCodeName('&080409_640百度')).toBe('080409_640')
    expect(getCodeName('fulisoso.me_Caribbean-031417-392-HD')).toBe('031417-392')
    expect(getCodeName('fulisoso.me_102017_001-caribpr-1080p')).toBe('102017_001')
  })

  it('convertCodeName', async () => {
    expect(convertCodeName('snisadd432un')).toBe('SNIS-432')
    expect(convertCodeName('102017_001')).toBe('102017-001')
  })

  it('removeCodeNamePart', async () => {
    expect(removeCodeNamePart('SNIS-432')).toBe('SNIS-432')
    expect(removeCodeNamePart('SNIS-432A')).toBe('SNIS-432')
  })

  it('isContinuousCodes', async () => {
    expect(isContinuousCodes(['SNIS-432A', 'SNIS-432B'])).toBe(true)
    expect(isContinuousCodes([])).toBe(true)
    expect(isContinuousCodes(['SNIS-432A'])).toBe(true)
    expect(isContinuousCodes(['SNIS-432'])).toBe(false)
    expect(isContinuousCodes(['SNIS-432A', 'SNIS-432C'])).toBe(false)
  })
})
