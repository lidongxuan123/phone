import instance from "../../utils/axios"

export const getDataFromSouHu = async (values: any) => {
    return instance({
        url: '/api/q.stock.sohu.com/hisHqm',
        method: 'get',
        params: values
    }).then(res => {
        return res.data
    })
}

// https://hqm.stock.sohu.com/getqjson?code=cn_000858&cb=fortune_hq_cn&_=1732931203438
// 当前接口已经废弃
// https://q.stock.sohu.com/app1/stockSearch?method=search&callback=searchBox1.output&type=all&keyword=00001&_=1732931185948
export const getName = async (code: any) => {
    return await instance({
        url: '/dapi/app1/stockSearch',
        method: 'get',
        params: {
            method: 'search',
            callback: 'searchBox.output',
            keyword: code,
            type: 'all'
        }
    }).then((res: any) => {
        let result = res.data.replaceAll('searchBox.output(', '').replaceAll(')', '');
        return JSON.parse(result)
    })
}