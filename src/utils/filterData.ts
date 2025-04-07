import moment from "moment"
// 单个股票,过滤出价格,展示价格和时间的关系

export const filterData = (data: any) => {
    let klines = data
    let list = klines.map((item: any, index: number) => {
        return {
            date: item[0],
            value: item[2]
        }
    })
    return list
}

export const calculatePercentage = (data: any) => {
    let klines = data
    let list = klines.map((item: any, index: number) => {
        console.log()
        return {
            date: item[0],
            price: item[2],
            value: (((parseFloat(item[2]) - parseFloat(data[0][2])) / parseFloat(data[0][2])) * 100).toFixed(2)
        }
    })
    console.log(list)
    return list
}
//展示100万的金额
export const moneyAll = (data: any) => {
    let klines = data
    let list = klines.map((item: any, index: number) => {
        return {
            date: item[0],
            price: item[2],
            value: Math.ceil((parseFloat(item[2]) / parseFloat(data[0][2])) * 1000000)
        }
    })
    return list
}

// 已月份的形式进行展示
export const monthData = (data: any) => {
    let klines = data
    let list = klines.map((item: any, index: number) => {
        return {
            name: new Date(item[0]).toString(),
            value: [
                [new Date(item[0]).getFullYear(), new Date(item[0]).getMonth() + 1, new Date(item[0]).getDate()].join('/'),
                Math.ceil((parseFloat(item[2]) / parseFloat(data[0][2])) * 1000000)
            ]
        }
    })
    return list
}

// 根据时间计算分红的钱数
export const getDividendMoney = (data: any) => {
    let devidendObject = {}
    const cyear = new Date().getFullYear()
    data.reduce((result: any, current: any, self: any) => {
        const year = new Date(current.PUBLISH_DATE).getFullYear()
        if (year >= cyear - 10) {
            if (result[year]) {
                result[year]['money'] = result[year]['money'] += current.PRETAX_BONUS_RMB
                result[year]['percent'] = result[year]['percent'] += current.DIVIDENT_RATIO * 100
                result[year]['millenMoney'] = result[year]['millenMoney'] += (current.DIVIDENT_RATIO * 1000000)

            } else {
                result[year] = {
                    year: year,
                    millenMoney: 1000000 * current.DIVIDENT_RATIO,
                    money: current.PRETAX_BONUS_RMB,
                    percent: current.DIVIDENT_RATIO * 100,
                }
            }
        }
        return result
    }, devidendObject)
    return statisticalDivident(devidendObject)
}

// 分红后的数据还需要再进行处理
const statisticalDivident = (data: any) => {
    let keys = Object.keys(data)
    let total = 0
    keys.forEach((key) => {
        total = total + data[key].millenMoney
        data[key]['statistical'] = total
    });
    return data
}


// 计算分红的钱
export const getDividendMoneyRealTime = (data: any) => {
    let devidendObject = {}
    const cyear = new Date().getFullYear()
    data.reduce((result: any, current: any, self: any) => {
        const year = new Date(current.PUBLISH_DATE).getFullYear()
        if (year >= cyear - 10) {
            if (result[year]) {
                result[year]['money'] = result[year]['money'] += current.PRETAX_BONUS_RMB
                result[year]['percent'] = result[year]['percent'] += current.DIVIDENT_RATIO * 100
                result[year]['millenMoney'] = result[year]['millenMoney'] += (current.DIVIDENT_RATIO * 1000000)
            } else {
                result[year] = {
                    year: year,
                    millenMoney: 1000000 * current.DIVIDENT_RATIO,
                    money: current.PRETAX_BONUS_RMB,
                    percent: current.DIVIDENT_RATIO * 100,
                }
            }
        }
        return result
    }, devidendObject)
    return {
        summarize:statisticalDivident(devidendObject),
        native: data
    }
}