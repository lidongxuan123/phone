import React, { useRef, useState } from "react";
import "./App.css";
import { Button, Calendar, Dropdown, Toast } from 'antd-mobile'
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
      if (reponse.result.length == 1) {
        setBaseInfo(reponse.result[0])
      } else {
        (reponse.result as Array<any>).forEach((item: any) => {
          if (item[0] == `cn_${code}`) {
            setBaseInfo(item)
          }
        })
      }
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
      name: '股价',
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
          offset: [-60, 20],
          formatter: function (params: any) {
            return `100股：${Math.ceil(params.data.value * 100)}元`
          }
        },
      }
    ]
  }
  const handleSubmit = async () => {
    dropDownRef?.current?.close()
    getNameInfo(stockNumber as string)
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
    start: new Date(moment().subtract(4, 'years').calendar()),
    end: new Date(moment().format('ll'))
  })
  const [visible, setVisible] = useState(false)
  const dropDownRef = useRef<any>()


  return (
    <div className="App">
      <Dropdown ref={dropDownRef}>
        <Dropdown.Item key='sorter' title='股票走势'>
          <div style={{ padding: 12 }}>
            <div className="input_title">股票编号:</div>
            <Input
              placeholder="请输入股票编号"
              type="number"
              value={stockNumber}
              onChange={(val) => {
                setStockNumber(val)
              }}
            />
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
      <div className="baseInfo">
        <div className="baseInfo_card">单前价格:<b >{tempInfo.value ?? "---"}元</b></div>
        <div className="baseInfo_card">盈利:<b style={{ color: (Math.ceil((tempInfo.value ?? 0) - (firstInfo.value ?? 0)) > 0 ? 'red' : 'black') }}>{`${(Math.ceil(((tempInfo.value ?? 0) - (firstInfo.value ?? 0)) * 100))}`}元</b></div>
      </div>
    </div>
  );
}

export default App;
