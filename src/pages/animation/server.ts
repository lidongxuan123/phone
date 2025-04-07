import instance from "../../utils/axios"
import { getDividendMoneyRealTime } from "../../utils/filterData"
export const getDataFromSouHu = async (values: any) => {
    return instance({
        url: '/api/q.stock.sohu.com/hisHqm',
        method: 'get',
        params: values
    }).then(res => {
        return res.data
    })
}
export const getDividend = async (code: any) => {
    return await instance({
        url: `/eastmoney/api/data/v1/get?${encodeURI(`callback=jQuery1123024409679314216604_1736475341413 &sortColumns=REPORT_DATE&sortTypes=-1&pageSize=50&pageNumber=1&reportName=RPT_SHAREBONUS_DET&columns=ALL&quoteColumns=&js={"data":(x),"pages":(tp)}&source=WEB&client=WEB&filter=(SECURITY_CODE=${code})`)}`,
        method: 'get',
    }).then(async (res: any) => {
        const { data } = res
        let result = getDividendMoneyRealTime(data.result.data)
        return result
    })
}