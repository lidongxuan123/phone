import { Button } from "antd-mobile";
import React from "react";
import styled from "styled-components";
import {redirect,useNavigate} from "react-router-dom"
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
        }
    }
    return <Container>
        <Button onClick={() => routeJump('single')} block color='primary' size='large'>单股票历史趋势</Button>
        <Button onClick={() => routeJump('multi')} block color='primary' size='large'>多股票历史趋势</Button>
    </Container>
}

export default Home