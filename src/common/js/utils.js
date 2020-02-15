/*
 * @Descripttion: 枚举值返回label
 * @Author:
 * @Date: 2019-11-19 21:09:55
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-13 16:05:49
 */
const func = {
  // baseUrl: 'http://118.24.54.72:8061/', //测试
  baseUrl: 'https://chongqing.hengshan.hk952183.com:8061/', // 生产
  transLabel: (arr, str) => {
    if (arr.length === 0) return
    for (let i in arr) {
      if (arr[i].dictionaryValue == str) {
        return arr[i].dictionaryLabel
      }
    }
    return '--'
  },
  getWeek: (src) => {
    let isDate = (date) => {
      if (date === null || date === undefined) return false
      if (isNaN(new Date(date).getTime())) return false
      if (Array.isArray(date)) return false // deal with `new Date([ new Date() ]) -> new Date()`
      return true
    }
    if (!isDate(src)) return null
    const date = new Date(src.getTime())
    date.setHours(0, 0, 0, 0)
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4)
    // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
    // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
  },
  getNowDateAndNowWeek: (time) => {
    // 选中的时间戳
    var timestamp = new Date(time).getTime()
    var serverDate = new Date(time)

    // 本周周日的的时间
    var sundayTiem = timestamp + ((7 - serverDate.getDay()) * 24 * 60 * 60 * 1000)
    var SundayData = new Date(sundayTiem)
    // 年
    var tomorrowY = SundayData.getFullYear()
    // 月
    var tomorrowM = (SundayData.getMonth() + 1 < 10 ? '0' + (SundayData.getMonth() + 1) : SundayData.getMonth() + 1)
    // 日
    var tomorrowD = SundayData.getDate() < 10 ? '0' + SundayData.getDate() : SundayData.getDate()

    // 本周周一的时间
    var mondayTime = timestamp - ((serverDate.getDay() - 1) * 24 * 60 * 60 * 1000)
    var mondayData = new Date(mondayTime)
    // 年
    var mondayY = mondayData.getFullYear()
    // 月
    var mondayM = (mondayData.getMonth() + 1 < 10 ? '0' + (mondayData.getMonth() + 1) : mondayData.getMonth() + 1)
    // 日
    var mondayD = mondayData.getDate() < 10 ? '0' + mondayData.getDate() : mondayData.getDate()
    // 输出值
    var config = {
      SunDay: tomorrowY + '-' + tomorrowM + '-' + tomorrowD + ' 00:00:00',
      Monday: mondayY + '-' + mondayM + '-' + mondayD + ' 00:00:00'
    }
    return config

    // getWeek: (dt) => {
    //   let d1 = new Date(dt)
    //   let d2 = new Date(dt)
    //   d2.setMonth(0)
    //   d2.setDate(1)
    //   let rq = d1 - d2
    //   let days = Math.ceil(rq / (24 * 60 * 60 * 1000))
    //   let num = Math.ceil(days / 7)
    //   return num
    // }
  }
}
export default func
