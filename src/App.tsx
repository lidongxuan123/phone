import React, { useRef, useState } from "react";
import "./App.css";
import { Button, Calendar, Toast } from 'antd-mobile'
import { Input } from "antd-mobile";
import ReactECharts from 'echarts-for-react';
import { getDataFromSouHu, getName } from "./server";
import { FirstInfoType, TempInfoType } from "./interface";
import { filterData } from "./utils/filterData";
import moment from 'moment'
function App() {
  const [echartData, setEchartData] = useState<TempInfoType[]>([])
  const [tempInfo, setTempInfo] = useState<TempInfoType>({
    date: '',
    value: 0
  })
  const [firstInfo, setFirstInfo] = useState<FirstInfoType>({
    date: '',
    value: 0
  })
  const [baseInfo, setBaseInfo] = useState(['股票编号', 0, "股票名称"])
  let timer = useRef()

  const handleData = (data: any) => {
    let result = filterData(data)
    let i = 0;
    let list = result.reverse()
    setFirstInfo(list[0])
    if (timer.current) clearInterval(timer.current)
    let copyEchartData: any[] = [];
    (timer as any).current = setInterval(() => {
      if (i >= list.length) {
        clearInterval(timer.current)
      } else {
        if (copyEchartData.length < 80) {
          copyEchartData.push(list[i])
          setTempInfo(list[i])
        } else {
          copyEchartData.shift()
          copyEchartData.push(list[i])
          setTempInfo(list[i])
        }
        let sliceData = [...copyEchartData]
        setEchartData(sliceData)
        i = i + 1
      }
    }, 100)
  }
  const getNameInfo = async (code: string) => {
    let reponse = await getName(code)
    if (reponse.status == 200) {
      setBaseInfo(reponse.result[0])
    } else {
      Toast.show('未查询到相关股票')
    }
  }
  const options = {
    title: {
      text: `${baseInfo[2]}-${baseInfo[0]}`
    },
    tooltip: {
      trigger: 'axis',
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
      data: [...echartData.map(item => item.date)]
    },
    yAxis: {
      name: '单股价格',
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
    series: [
      {
        name: '股价',
        type: 'line',
        showSymbol: false,
        data: echartData,
        smooth: true,
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return `100股：${Math.ceil(params.data.value * 100)}元`
          }
        },
      }
    ]
  }
  const handleSubmit = async () => {
    let result: any = await getDataFromSouHu({
      code: `cn_${stockNumber}`,
      start: moment(date.start).format("YYYYMMDD"),
      end: moment(date.end).format("YYYYMMDD"),
    })
    console.log(result)
    if (result[0] && result[0].status == 0) {
      console.log(result)
      handleData(result[0].hq)
    } else {
      Toast.show('获取数据失败')
    }
  }

  const [stockNumber, setStockNumber] = useState<string>()
  const [date, setDate] = useState({
    start: '',
    end: ''
  })
  const [visible, setVisible] = useState(false)



  return (
    <div className="App">
      <div className="input_title">股票编号:</div>
      <Input
        placeholder="请输入股票编号"
        type="number"
        value={stockNumber}
        onChange={(val) => {
          setStockNumber(val)
        }}
      />
      <div className="input_title" onClick={() => setVisible(val => !val)}>选择时间:</div>
      {visible && <Calendar
        selectionMode='range'
        onChange={(val: any) => {
          setDate({
            start: val[0],
            end: val[1]
            // start: moment(val[0]).format("YYYYMMDD"),
            // end: moment(val[1]).format("YYYYMMDD")
          })
        }}
      />}
      <div>{moment(date.start).format("YYYY-MM-DD")}-{moment(date.end).format("YYYY-MM-DD")}</div>
      <Button style={{ color: '#333' }} onClick={handleSubmit}> 获取数据</Button>
      <ReactECharts style={{ height: '600px' }} option={options} />
    </div>
  );
}

export default App;
