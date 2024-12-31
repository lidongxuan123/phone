import React, { useRef, useState } from "react";
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
const Container = styled.div`
  width: 100%;
  height:100%;
  padding: 12px;
  margin:0;
  box-sizing:border-box;
`
const App = () => {

  return <Container>
    <RouterProvider router={routerFirst}></RouterProvider>
  </Container>

}
export default App