import * as DBS from './dbs/index'
import * as Tables from './tables/index'

(async () => {
  console.log(Object.keys(Tables))
  Object.keys(DBS).forEach(async (key) => {
    const DB = DBS[key]
    await DB.sync({ alter: true })
  })
})()
