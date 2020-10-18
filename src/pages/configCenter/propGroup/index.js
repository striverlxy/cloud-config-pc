import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Space, message, Avatar, Modal, Form } from 'antd'
import styles from './style.less'
import { useHistory } from 'react-router-dom';
import PicturesWall from '../../../components/picturesWall/index'
import httpUtils from '../../../utils/request'

const { Search } = Input;

const PropGroup = () => {

    const history = useHistory()

    const gotoPropList = groupId => {
        history.push('/configCenter/propKeyList', {
            groupId: groupId
        })
    }

    const gotoPropTemplate = groupId => {
        history.push('/configCenter/propTemplate', {
            groupId: groupId
        })
    }

    const [propGroupList, setPropGroupList] = useState([])
    useEffect(() => {
        getPropGroupList()
    }, [])

    const getPropGroupList = async () => {
        let resp = await httpUtils.get('/propGroup/list');
        if (resp) {
            setPropGroupList(resp)
        }
    }

    const [propGroupModalProps, setPropGroupModalProps] = useState({
        visible: false,
        title: '新增属性分组'
    })
    const [propGroupModalLoading, setPropGroupModalLoading] = useState(false)
    const [propGroupModalData, setPropGroupModalData] = useState({})

    const handlePropGroupModalOpen = (data = {}) => {
        setPropGroupModalProps({
            visible: true,
            title: data.id ? '更新属性分组': '新增属性分组'
        })
        if (data.id) {
            setPropGroupModalData(data)
        }
    }

    const handlePropGroupModalOk = async () => {
        setPropGroupModalLoading(true)
        await httpUtils.post(propGroupModalData.id ? '/propGroup/Update' : '/propGroup/create', propGroupModalData);
        message.success(propGroupModalData.id ? '更新完成' : '创建成功')
        handlePropGroupModalClose()
        getPropGroupList()
    }

    const handlePropGroupModalClose = () => {
        setPropGroupModalProps({
            visible: false,
            title: '新增属性分组'
        })
        setPropGroupModalData({})
        setPropGroupModalLoading(false)
    }

    const setPropGroupModalValue = (e, valueName) => {
        const { value } = e.target;
        setPropGroupModalData({
            ...propGroupModalData,
            [valueName]: value
        })
    }

    const setIconUrl = urls => {
        setPropGroupModalData({
            ...propGroupModalData,
            iconUrl: urls.length > 0 ? urls[0]: ''
        })
    }

    return (
        <div>
            <Card
                title="属性分组"
                extra={
                    <Space size={30}>
                        <Search placeholder="搜索分组名" onSearch={value => console.log(value)} enterButton />
                        <Button type="primary" size="middle" onClick={handlePropGroupModalOpen}>新增属性分组</Button>
                    </Space>
                }
            >
                {
                    propGroupList.map((item, index) => {
                        return (
                            <Card.Grid className={styles.card_grid} key={index}>
                                <Space className={styles.container} direction="vertical" size={20}>
                                    <Space>
                                        <Avatar size={90} src={item.iconUrl} />
                                        <Space direction="vertical">
                                            <span className={styles.propName}>{item.groupName}</span>
                                            <span className={styles.intro}>{item.intro}</span>
                                        </Space>
                                    </Space>
                                    <Space size={50}>
                                        <Button type="link" size="middle" onClick={() => gotoPropList(item.id)}>属性管理</Button>
                                        <Button type="link" size="middle" onClick={() => gotoPropTemplate(item.id)}>模版管理</Button>
                                    </Space>
                                </Space>
                            </Card.Grid> 
                        )
                    })
                }
            </Card>
            <Modal
                destroyOnClose
                title={propGroupModalProps.title}
                visible={propGroupModalProps.visible}
                onOk={handlePropGroupModalOk}
                confirmLoading={propGroupModalLoading}
                onCancel={handlePropGroupModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="属性分组名称"
                    >
                        <Input value={propGroupModalData.groupName} size="large" onChange={e => setPropGroupModalValue(e, 'groupName')}  placeholder="请输入属性分组名称"></Input>
                    </Form.Item>
                    <Form.Item
                        label="属性分组描述"
                    >
                        <Input value={propGroupModalData.intro} size="large" onChange={e => setPropGroupModalValue(e, 'intro')}  placeholder="请输入属性分组描述"></Input>
                    </Form.Item>
                    <Form.Item
                        label="属性分组icon"
                    >
                        <PicturesWall maxCount={1} saveFileList={setIconUrl} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default PropGroup