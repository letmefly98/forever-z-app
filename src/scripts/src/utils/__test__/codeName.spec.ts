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
    expect(getCodeName('magnet:?xt=urn:btih:1FCA463D025EEF66ABCBA7DE7A43EBF499524607')).toBe('')
    expect(getCodeName('magnet:?xt=urn:btih:C9783513AB69C537F8C76064987B0C2EFBCF3A06&dn=CADV-353_B.wmv')).toBe('CADV-353')
    expect(getCodeName('magnet:?xt=urn:btih:B63E2876ADB3869E7EB07EE9DF7CC5E08421A81B&dn=LAFBD-40-BD')).toBe('LAFBD-40')
    expect(getCodeName('magnet:?xt=urn:btih:68EB6035250CBD2E58CFD274C8184E96C3E19070&dn=ANJD-012')).toBe('ANJD-012')
    expect(getCodeName('magnet:?xt=urn:btih:F000FEF048CFEE0CB0D41A852EFFCF744EB63D4D&dn=av.pbd-164_4')).toBe('pbd-164')
    expect(getCodeName('magnet:?xt=urn:btih:246AB39801F1DAB9A85F8F7D1CC2FC1997793458&dn=and-178未来Mirai')).toBe('and-178')
    expect(getCodeName('magnet:?xt=urn:btih:2024E07B474C9C4917573625E4CC71C604B7DB5B&dn=1Pondo-030415_038-HD')).toBe('030415_038')
    expect(getCodeName('magnet:?xt=urn:btih:E571BABAABF8BC19BD2A9B0FB7F1CE2A296785C0&dn=Caribbean-043015-001-HD')).toBe('043015-001')
    expect(getCodeName('magnet:?xt=urn:btih:CD74BA0FE0622270BC61EE6E265BDAFF98F4FEAC&www.fulisoso.net-Carib-032916-127-FHD')).toBe('032916-127')
    expect(getCodeName('magnet:?xt=urn:btih:87b51cb32c531037bed880fc2db31230b531d26c&dn=MGMJ-014-720p')).toBe('MGMJ-014')
    expect(getCodeName('ed2k://|file|CWP-07.avi|929685640|AD7B484D231F8D91A5130CD333618474|/')).toBe('CWP-07')
  })

  it('convertCodeName', async () => {
    expect(convertCodeName('snisadd432un')).toBe('SNIS-432')
    expect(convertCodeName('SCOP-219A')).toBe('SCOP-219A')
    expect(convertCodeName('043015-001_1')).toBe('043015-001A')
    expect(convertCodeName('102017_001')).toBe('102017-001')
    expect(convertCodeName('ABC-123')).toBe('ABC-123')
    expect(convertCodeName('ABC -123')).toBe('ABC-123')
    expect(convertCodeName('CWP-07')).toBe('CWP-007')
    expect(convertCodeName('x188')).toBe('x188')
    expect(convertCodeName('HEYZO-0016')).toBe('HEYZO-0016')
    expect(convertCodeName('MKBD-S03')).toBe('MKBD-S03')
    expect(convertCodeName('FC2-1174921A')).toBe('FC2-1174921A')
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
