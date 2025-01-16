import styled from 'styled-components'
export const AppContainer = styled.div`
    padding: 12px;
    background:rgb(45, 39, 54);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    .input_title {
    height: 40px;
    line-height: 40px;
}
.baseInfo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    padding: 12px;
    gap:22px;
    box-shadow: 0px 0px 4px #DFDFDF;
}
.baseInfo_card {
    flex: 1;
}
`

export const SingleInput = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-start;
    gap:6px;
    margin-bottom:12px;
    margin-top:12px;
`

export const BaseInfoCard = styled.div`
    /* padding:12px; */
    box-sizing:border-box;
    box-shadow:0 0 4px #333;
    .baseInfoList{
        border-radius:8px;
        .baseInfoList_single {
            display:flex;
            align-items:flex-start;
            justify-content:flex-start;
            border-bottom:1px solid #DFDFDF;
            padding:12px;
            section{
                flex-grow:1 
            }
        }
    }
`
export const EchartsContaier = styled.div`
    position:relative;
    /* width: 800px; */
    height: 450px;
    /* margin: 100px auto; */
    border: 1px solid;
    ul{
        position:absolute;
        z-index:10;
        list-style:none;
        padding: 8px;
        margin: 0;
        top: 80px;
        left: 50%;
        border-radius: 4px;
        background-color: white;
        transform: translate(-50%,0%);
        li {
            display: block;
            color:#4E5969
        }
    }
`