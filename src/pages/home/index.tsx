import { Button } from "antd-mobile";
import React, { useEffect } from "react";
import styled from "styled-components";
import { redirect, useNavigate } from "react-router-dom"
import { getTime } from "./server";
const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap:22px;
    height:100%;
`
const Home = () => {
    let navigate = useNavigate()
    const routeJump = (str: string) => {
        switch (str) {
            case 'single':
                navigate('/single')
                break;
            case 'multi':
                navigate('/multi')
                break;
            case 'landscape':
                navigate('/landscape')
                break;
            case 'dividend':
                navigate('/dividend')
                break;
            case 'dividendMoney':
                navigate('/dividendMoney')
                break;
            case 'animation':
                    navigate('/animation')
                    break;
        }
    }

    return <Container>
        <Button onClick={() => routeJump('single')} block color='primary' size='large'>手机屏幕显示股票走势</Button>
        <Button onClick={() => routeJump('landscape')} block color='primary' size='large'>月显示股票走势</Button>
        <Button onClick={() => routeJump('dividend')} block color='primary' size='large'>日显示股票走势</Button>
        <Button onClick={() => routeJump('dividendMoney')} block color='primary' size='large'>股票分红对比</Button>
        <Button onClick={() => routeJump('animation')} block color='primary' size='large'>股票动态背景展示分红</Button>
    </Container>
}

export default Home