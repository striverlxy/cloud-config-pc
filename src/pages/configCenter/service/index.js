import { Button, Card, Input, Space } from 'antd'
import React from 'react'

const { Search } = Input;

const gridStyle = {
    width: '20%',
    height: '200px',
    textAlign: 'center',
};

const ServiceList = () => {
    return (
        <div>
            <Card
                title="服务列表"
                extra={
                    <Space size={30}>
                        <Search placeholder="搜索服务名" onSearch={value => console.log(value)} enterButton />
                        <Button type="primary" size="middle">新增服务</Button>
                    </Space>
                }
            >
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
                <Card.Grid style={gridStyle}>Content</Card.Grid>
            </Card>
        </div>
    )
}

export default ServiceList