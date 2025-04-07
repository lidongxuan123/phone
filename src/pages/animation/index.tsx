import React, { useEffect, useRef, useState } from "react";
import LetterGlitch from './letterGlitch';
import Hyperspeed from './hyperspeed';
import styled from 'styled-components';
import { Button, Calendar, Dropdown, Radio, Space, Toast } from 'antd-mobile'
import { Input } from "antd-mobile";
import moment from 'moment'
import { AppContainer, BaseInfoCard, EchartsContaier, SingleInput } from "../dividendMoney/styled";
import { DeleteOutline } from "antd-mobile-icons"
import { Col, Row, Statistic, Divider, } from 'antd';
import { delay } from "../../utils/tools";
import { getName } from "../dividendMoney/server";
import { getDividend } from "./server"
import { getDataFromSouHu } from "./server";
import { filterData, moneyAll } from "../../utils/filterData";
import { calculateComparativeData } from "./util";
import 'animate.css';
const Container = styled.div`
    width:100%;
    height:100%;
    position:relative;
    background:#060606;
    .content {
      background-color:white;
      font-size: 20px;
      font-weight: bolder;
      color:white;
      color:black;
      width: 600px;
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 0 4px white;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      z-index:1;
      .content_top {
        margin-bottom:20px;
      }
    }
`
const colors = [
  '#2b4539', '#61dca3', '#61b3dc'
]
const Animation = () => {
  const [seriesList, setSeriesList] = useState<any>()
  const [nameLegend, setNameLegend] = useState<any>([])
  const [dividendData, setDividendData] = useState<any>([])
  const [radio, setRadio] = useState('1')
  const [xAxis, setxAxis] = useState<any>([])
  const [max, setMax] = useState<any>(undefined)
  const [year, setYear] = useState<number>()
  const [stockData, setStockData] = useState<any>({})

  let timer: any = useRef()
  const [stockNumber, setStockNumber] = useState<string>('')
  const [date, setDate] = useState({
    start: new Date(moment().subtract(4, 'years').calendar()),
    end: new Date(moment().format('ll'))
  })
  const [visible, setVisible] = useState(false)
  const dropDownRef = useRef<any>()
  const handleChangeStockNumber = (val: string,) => {
    setStockNumber(val)
  }
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
  const handleData = (data: any) => {
    let result = moneyAll(data.reverse())
    console.log(result)
    return result
  }
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
  const handleSubmit = async () => {
    // 获取输入的数据
    if (timer.current) { clearInterval(timer.current) };
    dropDownRef?.current?.close()
    const promiseList: any[] = []
    const stockList: any[] = []
    await promiseList.push(await getNameInfo(stockNumber))
    await promiseList.push(await getDividend(stockNumber))
    await promiseList.push(await getStockData(stockNumber))
    await delay(1500)
    // 获取输入编号的名字
    let nameInfo = promiseList[0]
    // 获取每日的股票价格
    let devided = promiseList[1]
    let price = promiseList[2]
    // 将上面的三组数据进行调整拼接
    const result = calculateComparativeData(promiseList, date)
    console.log(result)
    let i = 0;
    timer.current = setInterval(() => {
      if (i > result.length - 1) {
        i = 0
        clearInterval(timer.current)
      } else {
        setNameLegend(nameInfo)
        setStockData(result[i])
      }
      console.log(i)
      i++
    }, 3000)
  }
  return <Container>
    <Dropdown ref={dropDownRef}>
      <Dropdown.Item key='sorter' title='股票走势'>
        <div style={{ padding: 12 }}>
          <div className="input_title">股票编号:</div>
          <SingleInput>
            <Input
              placeholder="请输入股票编号"
              type="number"
              value={stockNumber}
              onChange={(val) => {
                handleChangeStockNumber(val)
              }}
            />
          </SingleInput>
          <div className="input_title" onClick={() => setVisible(val => !val)}>
            <span>选择时间:{stockData.year ?? 0}</span>
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
    <Hyperspeed
      effectOptions={{
        onSpeedUp: () => { },
        onSlowDown: () => { },
        distortion: 'turbulentDistortion',
        length: 400,
        roadWidth: 10,
        islandWidth: 2,
        lanesPerRoad: 4,
        fov: 90,
        fovSpeedUp: 150,
        speedUp: 2,
        carLightsFade: 0.4,
        totalSideLightSticks: 20,
        lightPairsPerRoadWay: 40,
        shoulderLinesWidthPercentage: 0.05,
        brokenLinesWidthPercentage: 0.1,
        brokenLinesLengthPercentage: 0.5,
        lightStickWidth: [0.12, 0.5],
        lightStickHeight: [1.3, 1.7],
        movingAwaySpeed: [60, 80],
        movingCloserSpeed: [-120, -160],
        carLightsLength: [400 * 0.03, 400 * 0.2],
        carLightsRadius: [0.05, 0.14],
        carWidthPercentage: [0.3, 0.5],
        carShiftX: [-0.8, 0.8],
        carFloorSeparation: [0, 5],
        colors: {
          roadColor: 0x080808,
          islandColor: 0x0a0a0a,
          background: 0x000000,
          shoulderLines: 0xFFFFFF,
          brokenLines: 0xFFFFFF,
          leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
          rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
          sticks: 0x03B3C3,
        }
      }}
    />
    <div className='content'>
      <div className="content_top">
        <Row gutter={16}>
          <Col span={6}>
            股票名称：{nameLegend[2]}
          </Col>
          <Col span={6}>
            初始时间：{new Date(date.start).getFullYear()}
          </Col>
          <Col span={6}>
            分红时间：{stockData['year']}
          </Col>
          <Col span={6}>
            本年分红：{`${stockData['yearPrecent']??0}%`}
          </Col>
        </Row>
      </div>
      <Divider variant="dotted" style={{ borderColor: '#7cb305' }}>分红未复投 </Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="持仓" value={`${stockData.noStockNum ?? 0}股`} />
        </Col>
        <Col span={8}>
          <Statistic title="市值" value={`${stockData.noStatistical ?? 0}元`} precision={2} />
        </Col>
        <Col span={8}>
          <Statistic title="分红金额" value={`${stockData.noResub ?? 0}元`} />
        </Col>
      </Row>
      <Divider variant="dotted" style={{ borderColor: '#7cb305' }}>分红复投</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="持仓" value={`${stockData.stockNum ?? 0}股`} />
        </Col>
        <Col span={8}>
          <Statistic title="市值" value={`${stockData.statistical ?? 0}元`} precision={2} />
        </Col>
        <Col span={8}>
          <Statistic title="分红金额" value={`${stockData.resub ?? 0}元`} />
        </Col>
      </Row>
    </div>
  </Container>
}
export default Animation