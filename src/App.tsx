import React, { useEffect, useRef, useState } from "react";
import { Button, Calendar, Dropdown, Toast } from 'antd-mobile'
import { Input } from "antd-mobile";
import ReactECharts from 'echarts-for-react';
import { getDataFromSouHu, getName } from "./pages/single/server";
import { FirstInfoType, TempInfoType } from "./pages/single/interface";
import { filterData } from "./utils/filterData";
import moment from 'moment'
import { AppContainer } from "./pages/single/styled";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routerFirst } from "./route";
import styled from "styled-components";
import { getTime } from "./pages/home/server";

const Container = styled.div`
  width: 100%;
  height:100%;
  padding: 12px;
  margin:0;
  box-sizing:border-box;
`
const App = () => {
  const endTime = '20250630'
  useEffect(() => {
    Promise.resolve(getTime()).then(res => {
      const { data } = res
      if (res.status == 200) {
        if (endTime < data.sysTime1) {
          window.location.href = "http://www.baidu.com"
        }
      }
    })
  }, [])
  return <Container>
    <RouterProvider router={routerFirst}></RouterProvider>
  </Container>

}
export default App