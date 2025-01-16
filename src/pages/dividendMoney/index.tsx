import React, { useEffect, useRef, useState } from "react";
import { Button, Calendar, Dropdown, Radio, Space, Toast } from 'antd-mobile'
import { Input } from "antd-mobile";
import ReactECharts from 'echarts-for-react';
import { getDataFromSouHu, getName, getDividend } from "./server";
import { FirstInfoType, TempInfoType } from "./interface";
import { filterData, moneyAll } from "../../utils/filterData";
import moment from 'moment'
import { AppContainer, BaseInfoCard, EchartsContaier, SingleInput } from "./styled";
import { DeleteOutline } from "antd-mobile-icons"
// 多个股票对比增长的百分比
function Multi() {
    const [seriesList, setSeriesList] = useState<any>()
    const [nameLegend, setNameLegend] = useState<any>([])
    const [dividendData, setDividendData] = useState<any>([])
    const [radio, setRadio] = useState('1')
    const [xAxis, setxAxis] = useState<any>([])
    const [max, setMax] = useState<any>(undefined)
    const [year, setYear] = useState<number>()
    const lineColor = ['#FFe119', '#e6194B', '#4363d8', '#ffffff', '#42d4f4']
    let timer = useRef()
    const handleData = (data: any) => {
        let result = moneyAll(data.reverse())
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
        // let result = await getDataFromSouHu({
        //     code: `cn_${item}`,
        //     start: moment(date.start).format("YYYYMMDD"),
        //     end: moment(date.end).format("YYYYMMDD"),
        // })
        // if (result[0] && result[0].status == 0) {
        //     return handleData(result[0].hq)
        // } else {
        //     Toast.show('解析数据存在问题')
        // }
    }

    // 根据时间获取换慢展示分红的钱
    const createCurveData = (nameInfo: any, dataInfo: any) => {
        let i = 0;
        (timer as any).current = setInterval(() => {
            if (i >= 10) {
                return
            } else {
                let tempData: any = []
                let list = dataInfo.map((item: any, index: number) => {
                    let keys = Object.keys(item)
                    setYear(item[keys[i]].year)
                    tempData.push(item[keys[i]])
                    return {
                        name: nameInfo[index][2],
                        type: 'line',
                        stack: 'Total',
                        data: keys.slice(0, i + 1).map((ele: any, k: number) => item[ele]['statistical'])
                    }
                })
                setDividendData(tempData)
                setSeriesList(list)
            }
            i++
        }, 500)
    }
    const getPercentData = (nameInfo: any, dataInfo: any) => {
        let i = 0;
        (timer as any).current = setInterval(() => {
            if (i >= 10) {
                return
            } else {
                let tempData: any = []
                let list = dataInfo.map((item: any, index: number) => {
                    let keys = Object.keys(item)
                    setYear(item[keys[i]].year)
                    tempData.push(item[keys[i]])
                    return {
                        name: nameInfo[index][2],
                        type: 'line',
                        smooth:true,
                        data: keys.slice(0, i + 1).map((ele: any, k: number) => item[ele]['percent'])
                    }
                })
                setDividendData(tempData)
                setSeriesList(list)
            }
            i++
        }, 500)
    }

    // 延迟3000秒
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const handleSubmit = async () => {
        // 获取输入的数据
        if (timer.current) { clearInterval(timer.current) };
        dropDownRef?.current?.close()
        const promiseList: any[] = []
        const stockList: any[] = []
        for (const item of stockNumberList) {
            await promiseList.push(await getNameInfo(item))
            await promiseList.push(await getDividend(item))
            await delay(1500)
        }
        // 获取输入编号的名字
        let nameInfo = promiseList.filter((item, index) => index % 2 == 0)
        setNameLegend(nameInfo)
        // 获取每日的股票价格
        let dataInfo = promiseList.filter((item, index) => index % 2 == 1)

        if (radio == '1') {
            // 求出曲线的y轴最大值
            getyXaisMax(dataInfo)
            createCurveData(nameInfo, dataInfo)
        } else {
            getPercentData(nameInfo, dataInfo)
        }
    }

    const getyXaisMax = (dataInfo: any) => {
        let max = 0
        if (radio == '1') {
            dataInfo.forEach((element: any, index: number) => {
                let totalMoney = element[Object.keys(element)[Object.keys(element).length - 1]].statistical
                if (max < totalMoney) {
                    max = totalMoney
                }
            });
            setMax(max)
        } else {
            setMax(12)
        }
    }

    useEffect(() => {
        let xAxisData: any = []
        let year = new Date().getFullYear()
        for (let i = 10; i > 0; i--) {
            xAxisData.push(year - i)
        }
        setxAxis(xAxisData)
    }, [])
    let options: any = {
        legend: {
            orient: 'vertical',
            textStyle: {
                color: 'white',
                fontSize: 16,
            },
            top: 50,
            right: 20,
        },
        tooltip: {
            show: false,
            trigger: 'axis',
            alwaysShowContent: true,
            formatter: function (params: any) {
                let result = params.map(function (item: any) {
                    console.log(item)
                    return `<span>${item.seriesName}: <span style="color: ${item.value > 0 ? 'red' : 'green'}">${item.value}</span></span>`;
                });
                return result.join('<br/>');
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: "category",
            animation: false,
            splitLine: {
                show: false
            },
            axisLine: {
                onZero: true,
                show: false   // 隐藏 x 轴的坐标线
            },
            offset: 20,
            axisTick: {
                show: false   // 隐藏 x 轴的刻度
            },
            axisLabel: {
                color: '#FFe119',  // 设置 x 轴刻度标签颜色为黄色
                verticalAlign: 'middle'  // 标签垂直居中
            },
            nameTextStyle: {
                color: '#FFe119',  // 黄色字体颜色
                fontSize: 16,      // 字体大小
                fontWeight: 'bold', // 字体加粗
            },
            boundaryGap: false,
            data: xAxis
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            animation: false,
            splitLine: {
                show: false
            },
            min: 0,
            max: Math.ceil(max * 1.2) ?? 1000,
            axisLabel: {
                color: '#FFe119'  // 设置 x 轴刻度标签颜色为黄色
            },
            nameTextStyle: {
                color: '#FFe119',  // 黄色字体颜色
                fontSize: 16,      // 字体大小
                fontWeight: 'bold' // 字体加粗
            },
            splitNumber: 4, // 设置 5 个分隔
        },
        grid: {
            top: 80,
            left: 70,
            right: 40,
            bottom: 50
        },
        series: seriesList
    }
    let option2: any = {
        legend: {
            orient: 'vertical',
            textStyle: {
                color: 'white',
                fontSize: 16,
            },
            top: 50,
            right: 20,
        },
        tooltip: {
            show: false,
            trigger: 'axis',
            alwaysShowContent: true,
            formatter: function (params: any) {
                let result = params.map(function (item: any) {
                    console.log(item)
                    return `<span>${item.seriesName}: <span style="color: ${item.value > 0 ? 'red' : 'green'}">${item.value}</span></span>`;
                });
                return result.join('<br/>');
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: "category",
            animation: false,
            splitLine: {
                show: false
            },
            axisLine: {
                onZero: true,
                show: false   // 隐藏 x 轴的坐标线
            },
            offset: 20,
            axisTick: {
                show: false   // 隐藏 x 轴的刻度
            },
            axisLabel: {
                color: '#FFe119',  // 设置 x 轴刻度标签颜色为黄色
                verticalAlign: 'middle'  // 标签垂直居中
            },
            nameTextStyle: {
                color: '#FFe119',  // 黄色字体颜色
                fontSize: 16,      // 字体大小
                fontWeight: 'bold', // 字体加粗
            },
            boundaryGap: false,
            data: xAxis
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            animation: false,
            splitLine: {
                show: false
            },
            min: 0,
            max: 10,
            axisLabel: {
                color: '#FFe119'  // 设置 x 轴刻度标签颜色为黄色
            },
            nameTextStyle: {
                color: '#FFe119',  // 黄色字体颜色
                fontSize: 16,      // 字体大小
                fontWeight: 'bold' // 字体加粗
            },
            splitNumber: 4, // 设置 5 个分隔
        },
        grid: {
            top: 80,
            left: 70,
            right: 40,
            bottom: 50
        },
        series: seriesList
    }
    console.log(seriesList)
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
    const handleRadio = (e: any) => {
        setRadio(e)
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
                        <Radio.Group value={radio} onChange={handleRadio}>
                            <Space direction='vertical'>
                                <Radio value='1'>汇总</Radio>
                                <Radio value='2'>单项</Radio>
                            </Space>
                        </Radio.Group>
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
            <EchartsContaier>
                <ReactECharts style={{ width: '100%', height: `100%` }} option={radio == '1' ? options : option2} />
                {
                    (radio == '1' && nameLegend.length > 0) && <ul>
                        <li>{year}年</li>
                        {
                            nameLegend.map((item: any, index: number) => {
                                return (
                                    <li >{item[2]}:
                                        <span>分红比：{dividendData[index]?.percent.toFixed(2)}%</span> - 总分红:
                                        <span>{dividendData[index]?.statistical.toFixed(2)}元</span>
                                    </li>
                                )
                            })
                        }
                    </ul>}
                {
                    (radio == '2' && nameLegend.length > 0) && <ul>
                        <li>{year}年</li>
                        {
                            nameLegend.map((item: any, index: number) => {
                                return (
                                    <li >{item[2]}:
                                        <span>分红比：{dividendData[index]?.percent.toFixed(2)}%</span>
                                    </li>
                                )
                            })
                        }
                    </ul>}
            </EchartsContaier>
        </AppContainer>
    );
}

export default Multi;

