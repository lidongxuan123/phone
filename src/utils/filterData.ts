export const filterData = (data:any) => {
    let klines = data
    let list = klines.map((item:any, index: number) => {
        return {
            date: item[0],
            value: item[2]
        }
    })
    return list
}