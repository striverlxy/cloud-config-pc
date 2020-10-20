import { Button, Card, Input, Space, Modal, Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './style.less'
import httpUtil from '../../../utils/request'

const { Search } = Input;

const ServiceList = () => {

    const [serviceList, setServiceList] = useState([])

    useEffect(() => {
        getServiceList()
    }, [])

    const getServiceList = async () => {
        let resp = await httpUtil.get('/project/list')
        setServiceList(resp)
    }

    const [serviceInfoModalProps, setServiceInfoModalProps] = useState({
        visible: false,
        title: '新增服务'
    })
    const [serviceInfoModalData, setServiceInfoModalData] = useState({})
    const [serviceInfoModalLoading, setServiceInfoModalLoading] = useState(false)
    const handleServiceInfoModalOpen = (data = {}) => {
        setServiceInfoModalProps({
            visible: true,
            title: data.id ? '更新服务信息' : '新增服务信息'
        })
        if (data.id) {
            setServiceInfoModalData(data)
        }
    }

    const handleServiceInfoModalOk = async () => {
        setServiceInfoModalLoading(true)
        await httpUtil.post(serviceInfoModalData.id ? '/project/update' : '/project/add', serviceInfoModalData)
        message.success(serviceInfoModalData.id ? '更新成功' : '添加成功')
        await getServiceList()
        handleServiceInfoModalClose()
    }

    const handleServiceInfoModalClose = () => {
        setServiceInfoModalProps({
            visible: false,
            title: '新增服务信息'
        })
        setServiceInfoModalLoading(false)
        setServiceInfoModalData({})
    }

    const gotoProperties = () => {

    }

    const setServiceInfoModalDataValue = (e, valueName) => {
        const { value } = e.target
        setServiceInfoModalData({
            ...serviceInfoModalData,
            [valueName]: value
        })
    }

    return (
        <div>
            <Card
                title="服务列表"
                extra={
                    <Space size={30}>
                        <Search placeholder="搜索服务名" onSearch={value => console.log(value)} enterButton />
                        <Button type="primary" size="middle" onClick={handleServiceInfoModalOpen}>新增服务</Button>
                    </Space>
                }
            >
                {
                    serviceList.map((item, index) => {
                        return (
                            <Card.Grid className={styles.card_grid} key={index}>
                                <Space className={styles.container} direction="vertical" size={20}>
                                    <Space>
                                        <Space direction="vertical">
                                            <span className={styles.serviceName}>{item.applicationName}</span>
                                            <span className={styles.intro}>{item.projectName}</span>
                                        </Space>
                                    </Space>
                                    <Space size={50}>
                                        <Button type="link" size="middle" onClick={() => handleServiceInfoModalOpen(item)}>详情管理</Button>
                                        <Button type="link" size="middle" onClick={() => gotoProperties()}>配置管理</Button>
                                    </Space>
                                </Space>
                            </Card.Grid>
                        )
                    })
                }
            </Card>
            <Modal
                destroyOnClose
                title={serviceInfoModalProps.title}
                visible={serviceInfoModalProps.visible}
                onOk={handleServiceInfoModalOk}
                confirmLoading={serviceInfoModalLoading}
                onCancel={handleServiceInfoModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="服务名称"
                    >
                        <Input value={serviceInfoModalData.projectName} size="large" onChange={e => setServiceInfoModalDataValue(e, 'projectName')}  placeholder="eg: 用户中心"></Input>
                    </Form.Item>
                    <Form.Item
                        label="应用名称"
                    >
                        <Input value={serviceInfoModalData.applicationName} size="large" onChange={e => setServiceInfoModalDataValue(e, 'applicationName')}  placeholder="eg: user-center"></Input>
                    </Form.Item>
                    <Form.Item
                        label="服务描述"
                    >
                        <Input value={serviceInfoModalData.intro} size="large" onChange={e => setServiceInfoModalDataValue(e, 'intro')}  placeholder="请输入服务描述"></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ServiceList