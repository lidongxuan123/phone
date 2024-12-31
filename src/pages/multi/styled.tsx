import styled from 'styled-components'
export const AppContainer = styled.div`
    padding: 12px;
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