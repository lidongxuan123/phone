import React, { useRef, useState } from "react";
import { Button, Calendar, Dropdown, Toast } from 'antd-mobile'
import { Input } from "antd-mobile";
import ReactECharts from 'echarts-for-react';
import { getDataFromSouHu, getName } from "./server";
import { FirstInfoType, TempInfoType } from "./interface";
import { filterData, calculatePercentage } from "../../utils/filterData";
import moment from 'moment'
import { AppContainer, SingleInput } from "./styled";
import { DeleteOutline } from "antd-mobile-icons"
// 多个股票对比增长的百分比
function Multi() {
    const [seriesList, setSeriesList] = useState<any>()
    let timer = useRef()
    const handleData = (data: any) => {
        let result = calculatePercentage(data.reverse())
        return result
    }
    // 获取股票名称
    const getNameInfo = async (code: string) => {
        let reponse = await getName(code)
        let result;
        if (reponse.status == 200) {
            if (reponse.result.length == 1) {
                console.log(reponse.result[0])
                result = reponse.result[0]
            } else {
                (reponse.result as Array<any>).forEach((item: any) => {
                    if (item[0] == `cn_${code}`) {
                        console.log(item)
                        result = item
                    }
                })
            }
            return result
        } else {
            Toast.show('未查询到相关股票')
            return null
        }
    }

    // 获取每天的数据信息
    const getStockData = async (item: string) => {
        let result = await getDataFromSouHu({
            code: `cn_${item}`,
            start: moment(date.start).format("YYYYMMDD"),
            end: moment(date.end).format("YYYYMMDD"),
        })
        if (result[0] && result[0].status == 0) {
            return handleData(result[0].hq)
        } else {
            Toast.show('解析数据存在问题')
        }
    }
    // 延迟3000秒
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const handleSubmit = async () => {
        // 获取输入的数据
        if (timer.current) { clearInterval(timer.current) };
        dropDownRef?.current?.close()
        const promiseList: any[] = []
        for (const item of stockNumberList) {
            await promiseList.push(await getNameInfo(item))
            await promiseList.push(await getStockData(item))
            await delay(1500)
        }
        let nameInfo = promiseList.filter((item, index) => index % 2 == 0)
        let dataInfo = promiseList.filter((item, index) => index % 2 == 1)
        let length = 0
        // 最长的数组,用于横坐标
        let longest: any = []
        // 获取dataInfo数据最长的作为横坐标
        dataInfo.forEach((item, index) => {
            if (item.length > length) {
                length = item.length
                longest = item
            }
        })
        // 根据返回的结果生成,echarts的series
        createCurveData(nameInfo, dataInfo, longest)
    }
    // 根据时间生成一段动态的曲线
    const createCurveData = (nameInfo: any, dataInfo: any, longest: any) => {
        let i = 0;
        let dataList: any = [];
        (timer as any).current = setInterval(() => {
            if (i > longest.length) {
                clearInterval(timer.current)
            } else {
                // 获取时间 
                if (i < 80) {
                    dataInfo.forEach((element: any, index: number) => {
                        if (!dataList[index]) {
                            dataList[index] = []
                        }
                        dataList[index].push(element[i])
                    });
                } else {
                    dataInfo.forEach((element: any, index: number) => {
                        dataList[index].shift()
                        dataList[index].push(element[i])
                    });
                }
                i = i + 1
            }
            let seriesTemp: any = []
            dataInfo.forEach((element: any, index: number) => {
                seriesTemp.push({
                    name: nameInfo[index][2],
                    type: 'line',
                    showSymbol: false,
                    smooth: true,
                    data: dataList[index],
                })
            });
            setSeriesList(seriesTemp)
        }, 100)
    }
    const options = {
        tooltip: {
            show: true,
            trigger: 'axis',
            alwaysShowContent: true,
            formatter: function (params:any) {
                let result = params.map(function (item:any) {
                    return item.seriesName + ': ' + item.value + '%';
                });
                return result.join('<br/>');
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '日期',
            nameLocation: 'middle',
            nameGap: 30,
            type: "category",
            animation: false,
            splitLine: {
                show: false
            },
            data: seriesList?.[0] ? [...seriesList[0].data.map((item: any) => item.date)] : ''
        },
        yAxis: {
            name: '百分比',
            type: 'value',
            nameGap: 20,
            nameLocation: 'middle',
            boundaryGap: [0, '100%'],
            animation: false,
            splitLine: {
                show: true
            }
        },
        grid: {
            top: 80,
        },
        series: seriesList
    }
    const [stockNumberList, setStockNumberList] = useState<string[]>([''])
    const [date, setDate] = useState({
        start: new Date(moment().subtract(4, 'years').calendar()),
        end: new Date(moment().format('ll'))
    })
    const [visible, setVisible] = useState(false)
    const dropDownRef = useRef<any>()

    const addStock = () => {
        if (stockNumberList.length > 5) {
            Toast.show('最多支持5个')
            return
        }
        stockNumberList?.push('')
        setStockNumberList([...stockNumberList])
    }
    const handleChangeStockNumber = (val: string, index: number) => {
        const result = stockNumberList.map((item, i) => {
            if (index == i) {
                return val
            }
            return item
        })
        setStockNumberList([...result])
    }
    const handleDelete = (index: number) => {
        let result = stockNumberList
        result.splice(index, 1)
        setStockNumberList([...result])
    }
    return (
        <AppContainer>
            <Dropdown ref={dropDownRef}>
                <Dropdown.Item key='sorter' title='股票走势'>
                    <div style={{ padding: 12 }}>
                        <div className="input_title">股票编号:</div>
                        {
                            stockNumberList?.map((item: string, index: number) => {
                                return (<SingleInput key={index}>
                                    <Input
                                        placeholder="请输入股票编号"
                                        type="number"
                                        value={item}
                                        onChange={(val) => {
                                            handleChangeStockNumber(val, index)
                                        }}
                                    />
                                    <Button size="mini" onClick={() => handleDelete(index)}>
                                        <DeleteOutline color='var(--adm-color-danger)' />
                                    </Button>
                                </SingleInput>)
                            })
                        }
                        <Button block size="small" color='primary' onClick={addStock}> 新增</Button>
                        <div className="input_title" onClick={() => setVisible(val => !val)}>
                            <span>选择时间:</span>
                        </div>
                        {visible && <Calendar
                            selectionMode='range'
                            value={[date.start, date.end]}
                            onChange={(val: any) => {
                                setDate({
                                    start: val[0],
                                    end: val[1]
                                })
                            }}
                        />}
                        <div style={{ marginBottom: '16px', lineHeight: '32px' }}>{moment(date.start).format("YYYY-MM-DD")} / {moment(date.end).format("YYYY-MM-DD")}</div>
                        <Button block size="middle" color='primary' onClick={handleSubmit}> 获取数据</Button>
                    </div>
                </Dropdown.Item>
            </Dropdown>
            <ReactECharts style={{ height: '500px' }} option={options} />
        </AppContainer>
    );
}

export default Multi;
