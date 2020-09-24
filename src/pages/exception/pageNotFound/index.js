import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Result } from 'antd'

const PageNotFound = () => {

    let history = useHistory()
    return (
        <Result
            status="404"
            title="404"
            subTitle="哎呀，页面没有找到呀~~"
            extra={
                <Button type="primary" onClick={() => history.push('/home')}>回到首页</Button>
            }
        />
    )
}

export default PageNotFound