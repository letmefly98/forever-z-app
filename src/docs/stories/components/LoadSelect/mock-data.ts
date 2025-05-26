import { isPlainObject } from 'lodash-es'

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

// 创建 string[] 格式数据
export function createStringData() {
  const data = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'].reduce((re: string[], name) => {
    const tmp = Array.from({ length: 10 }).fill(undefined).map((_, i) => `${name}${i}`)
    return re.concat(tmp)
  }, [])
  return data
}

// 创建 { id: number, name: string }[] 格式数据
export function createObjectData() {
  const data = createStringData()
  return data.map((name, i) => ({ id: i + 1, name }))
}

// 返回获取分页数据的函数
function getPagedData(data: any[]) {
  return ({ pageNo = 1, pageSize = 10, words = '' }) => {
    const startNo = (pageNo - 1) * pageSize
    const filter = data.filter(e => (isPlainObject(e) ? e.name : e).includes(words))
    const result = filter.slice(startNo, startNo + pageSize)
    const total = data.length
    return { total, records: result }
  }
}

// 返回异步获取数据的函数
export function mockGetData(createMethod: any) {
  const mockData = createMethod()
  const getData = getPagedData(mockData)
  return async ({ pageNo = 1, pageSize = 10, words = '' }) => {
    const data = getData({ pageNo, pageSize, words })
    await sleep(1000)
    return data
  }
}
