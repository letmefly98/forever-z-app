import { normalize } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDeepFiles } from '../findDeep'

describe('utils/findDeep.ts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getDeepFiles', async () => {
    /**
     * 创造出以下文件结构
     * - test 文件夹
     *  - a 文件夹
     *   - b 文件
     *  - c 文件
     *  - d 文件夹
     */
    vi.mock('node:fs', async (importOriginal) => {
      const original: any = await importOriginal()
      return {
        ...original,
        statSync: vi.fn(uri => ({ isDirectory: () => uri === normalize('test/a') || uri === normalize('test/d') })),
        readdirSync: vi.fn(uri => ({ test: ['a', 'c', 'd'], [normalize('test/a')]: ['b'], [normalize('test/d')]: [] })[uri]),
      }
    })
    expect(getDeepFiles('test')).toMatchObject([normalize('test/a/b'), normalize('test/c')])
  })
})
