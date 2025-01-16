// https://quan.suning.com/getSysTime.do
import instance from "../../utils/axios"

export const getTime = async()=> {
   return await  instance({
        url: '/time/getSysTime.do',
        method: 'get'
    }).then(res=> {
        return res
    })
}
