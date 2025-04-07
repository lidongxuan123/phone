export const calculateComparativeData = (promiseList: any[], date: any) => {
    const [nameInfo, { summarize, native }, priceList] = promiseList
    let start = new Date(date.start)
    let end = new Date(date.end)
    // 获取开始和结束时间段的数据
    let filterDividedData: any = []
    Object.keys(summarize).forEach((item: any, index: number) => {
        let time = new Date(summarize[item].time)
        if (time >= start && time <= end) {
            filterDividedData.push(summarize[item])
        }
    })
    const initPrice = priceList[0]
    // 过滤出Notice在时间范围内容的数据
    let filterNativeDividedData: any = []

    let devidedMoneyLog = {
        noResub: 0,
        resub:0
    }
    filterNativeDividedData = native.filter((item: any, index: number) => {
        return start <= new Date(item.EX_DIVIDEND_DATE) && end >= new Date(item.EX_DIVIDEND_DATE)
    }).reverse()

    let initData = getStock(1000000, Number(initPrice.price), 0, 0, 0)
    let tempData = Object.assign({}, initData)
    let result: any = []

    result.push({
        time: start,
        year: start.getFullYear(),
        stockNum: tempData.stockNum,
        price: initPrice,
        remainMoney: tempData.remainMoney,
        precent: summarize[start.getFullYear()].percent,
        statistical: 1000000
    })
    let tempReslut = []
    console.log(filterNativeDividedData)
    result = filterNativeDividedData.map((item: any, index: number) => {
        const year = new Date(item.REPORT_DATE).getFullYear()
        let singleData = priceList.find((ele: any, i: number) => {
            return item.EX_DIVIDEND_DATE.indexOf(ele.date) > -1
        })
        tempData = getStock(tempData.stockNum / 10 * item.PRETAX_BONUS_RMB, Number(singleData.price), tempData.remainMoney, tempData.stockNum,initData.stockNum)
        let singleResult = {
            time: item.EX_DIVIDEND_DATE,
            year: new Date(item.REPORT_DATE).getFullYear(),
            stockNum: tempData.stockNum,
            price: singleData.price,
            remainMoney: (tempData.remainMoney).toFixed(2),
            yearPrecent: (summarize[year].percent).toFixed(2),
            precent: (item.PRETAX_BONUS_RMB / 10 / singleData.price).toFixed(2),
            statistical: (tempData.stockNum * singleData.price + tempData.stockNum).toFixed(2),
            noStockNum: initData.stockNum,
            noStatistical: (initData.stockNum * singleData.price + initData.remainMoney).toFixed(2),
            noResub: (devidedMoneyLog.noResub+ initData.stockNum*  item.PRETAX_BONUS_RMB / 10 ).toFixed(2),
            resub:(devidedMoneyLog.resub+ tempData.stockNum * item.PRETAX_BONUS_RMB / 10).toFixed(2),
        }
        devidedMoneyLog = {
            noResub: Number((devidedMoneyLog.noResub+ initData.stockNum*  item.PRETAX_BONUS_RMB / 10).toFixed(2)),
            resub:Number((devidedMoneyLog.resub+ tempData.stockNum * item.PRETAX_BONUS_RMB / 10).toFixed(2)),
        }
        tempReslut.push(singleResult)
        return singleResult
    })
    return result
}

// 计算所买的股票和剩余的钱
const getStock = (money: number, price: number, remainMoney: number, stockNumber: number, noresubStockNum:number) => {
    console.log(money, price, remainMoney, stockNumber)
    // 买的总数
    const num = Math.floor((money + remainMoney) / price)

    // 由于股票都是100手开始，需要去除num中的各位和十位

    const realNum = Math.floor(num / 100) * 100

    const curRemainMoney = (money + remainMoney) - realNum * price

    const curStockNum = stockNumber + realNum

    return {
        stockNum: curStockNum,
        remainMoney: curRemainMoney,
    }
}

