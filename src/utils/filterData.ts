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
    console.log(data)
    let list = klines.map((item: any, index: number) => {
        console.log()
        return {
            date: item[0],
            value: (((parseFloat(item[2]) - parseFloat(data[0][2])) / parseFloat(data[0][2])) * 100).toFixed(2)
        }
    })
    console.log(list)
    return list
}