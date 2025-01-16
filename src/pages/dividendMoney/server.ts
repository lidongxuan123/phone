import moment from "moment"
import instance from "../../utils/axios"
import {getDividendMoney} from "../../utils/filterData"
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

// 获取每年的分红
// https://data.eastmoney.com/yjfp/detail/000858.html
// https://datacenter-web.eastmoney.com/api/data/v1/get?callback=jQuery1123024409679314216604_1736475341413
// &sortColumns=REPORT_DATE&sortTypes=-1&pageSize=50&pageNumber=1&reportName=RPT_SHAREBONUS_DET
// &columns=ALL&quoteColumns=&js={"data":(x),"pages":(tp)}&source=WEB&client=WEB&filter=(SECURITY_CODE="000858")

export const getDividend = async (code: any) => {
    return await instance({
        url: `/eastmoney/api/data/v1/get?${encodeURI(`callback=jQuery1123024409679314216604_1736475341413 &sortColumns=REPORT_DATE&sortTypes=-1&pageSize=50&pageNumber=1&reportName=RPT_SHAREBONUS_DET&columns=ALL&quoteColumns=&js={"data":(x),"pages":(tp)}&source=WEB&client=WEB&filter=(SECURITY_CODE=${code})`)}`,
        method: 'get',
    }).then( async (res: any) => {
        const {data} = res
        let result = getDividendMoney(data.result.data)
        // console.log(result)
        // await getDataFromSouHu({
        //     code: `cn_${code}`,
        //     start: moment(res)
        // })

        // console.log(result)
        return result
    })
}