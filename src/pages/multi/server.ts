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
        // console.log(res)
        let result = res.data.replaceAll('searchBox.output(', '').replaceAll(')', '');
        return JSON.parse(result)
    })
}


//获取名字信息

// https://hqm.stock.sohu.com/getqjson?code=cn_300760,cn_600276,cn_603259,cn_600436,cn_300015,cn_000538,cn_603392,cn_688271&cb=fortune_hq_diwei&_=1735524111201

// export const getName = async (code: any) => {
//     return await instance({
//         url: '/dapi/getqjson',
//         method: 'get',
//         params: {
//             code: 'cn_' + code,
//             cb: 'hotstocksHq'
//         },
//         headers:{
//             Cookie: "SUV=2311130958557HKD; _ga=GA1.1.1276939792.1721898007; clt=1730687579; cld=20241104103259; BAIDU_SSP_lcr=https://pos.baidu.com/; reqtype=pc; _dfp=4q/MTi+4L4EJR/wcUvpfT94gogWcBsrK12fJPFmc9Ss=; IPLOC=CN3200; _ga_DFBWYFE6Q0=GS1.1.1733980986.2.1.1733981005.41.0.0; gidinf=x099980108ee1a002b9a00053000da4bac20141472e0; t=1735524055814; BIZ_MyLBS=cn_603259%2C%u836F%u660E%u5EB7%u5FB7%7Ccn_300059%2C%u4E1C%u65B9%u8D22%u5BCC%7Ccn_000002%2C%u4E07%u79D1%uFF21%7Ccn_000858%2C%u4E94%u7CAE%u6DB2%7Ccn_600000%2C%u6D66%u53D1%u94F6%u884C",
//             "Content-Type":'text/plain'
//         }
//     }).then((res: any) => {
//         console.log(res)
//         return res
//         // let result = res.data.replaceAll('searchStock_cb(', '').replaceAll(')', '');
//         // return JSON.parse(result)
//     })
// }
// export const getName = async (code: any) => {
//     return await instance({
//         url: '/getqjson',
//         method: 'get',
//         params: {
//             list: 'sz' + code
//         },
//         headers: {
//             "Content-Type": 'text/plain'
//         }
//     }).then((res: any) => {
//         console.log(res)
//         return res
//         // let result = res.data.replaceAll('searchStock_cb(', '').replaceAll(')', '');
//         // return JSON.parse(result)
//     })
// }
// https://hq.sinajs.cn/list=sz000001
