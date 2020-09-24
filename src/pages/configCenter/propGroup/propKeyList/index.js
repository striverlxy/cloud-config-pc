import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Modal, Form, message, Drawer } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import httpUtil from '../../../../utils/request'

const borderRadius = { borderRadius: 4 }
const inputStyle = { width: 160, borderRadius: 4 }
const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const layout = {
    labelCol: { span: 5 }
};

const PropKeyList = () => {

    const { state } = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getPropKeyList()
    }, [])

    const getPropKeyList = async () => {
        setLoading(true)
        let resp = await httpUtil.get('/propKey/list', {groupId: state.groupId})
        setData(resp)
        setLoading(false)
    }

    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            align: 'center'
        },
        {
            title: '属性字段',
            dataIndex: 'propKey',
            align: 'left'
        },
        {
            title: '属性描述',
            dataIndex: 'intro',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: '200px',
            render: (text, record) => (
                <Space>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle" onClick={() => handlePropKeyModalOpen(record)}>查看详情</Button>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle" onClick={() => handlePropValueDrawerOpen(record)}>键值列表</Button>
                </Space>
            )
        }
    ];

    const [propKeyModalProps, setPropKeyModalProps] = useState({
        visible: false,
        title: '新增属性键名'
    })
    const [propKeyModalData, setPropKeyModalData] = useState({})
    const [propKeyModalLoading, stepropKeyModalLoading] = useState(false)
    
    const handlePropKeyModalOpen = (data = {}) => {
        setPropKeyModalProps({
            visible: true,
            title: data.id ? '更新属性键名' : '新增属性键'
        })
        if (data.id) {
            setPropKeyModalData(data)
        }
    }

    const handlePropKeyModalOk = async () => {
        let data = {
            groupId: state.groupId,
            propKey: propKeyModalData.propKey,
            intro: propKeyModalData.intro
        }
        if (propKeyModalData.id) {
            data.id = propKeyModalData.id
        }

        await httpUtil.post(propKeyModalData.id ? '/propKey/update' : '/propKey/create', data)
        message.success(propKeyModalData.id ? '更新成功' : '添加成功')
        handlePropKeyModalClose()
        getPropKeyList()
    }

    const handlePropKeyModalClose = () => {
        setPropKeyModalProps({
            visible: false,
            title: '新增属性键名'
        })
        setPropKeyModalData({})
        stepropKeyModalLoading(false)
    }

    const setPropKeyModalValue = (e, valueName) => {
        const { value } = e.target
        setPropKeyModalData({
            ...propKeyModalData,
            [valueName]: value
        })
    }

    const [propValueDrawerProps, setPropValueDrawerProps] = useState({
        visible: false,
        title: '',
        basePropKeyId: ''
    })
    const propValueDrawerTableColumns = [
        {
            title: '属性值',
            dataIndex: 'propValue',
            align: 'center'
        },
        {
            title: '属性描述',
            dataIndex: 'intro',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: '100px',
            render: (text, record) => (
                <Space>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle" onClick={() => handlePropValueDrawerModalOpen(record)}>修改</Button>
                </Space>
            )
        }
    ]
    const [propValueDrawerTableData, setPropValueDrawerTableData] = useState([])
    const [propValueDrawerTableLoading, setPropValueDrawerTableLoading] = useState(false)

    const handlePropValueDrawerOpen = async record => {
        setPropValueDrawerProps({
            visible: true,
            title: record.propKey,
            basePropKeyId: record.id
        })
        getPropValueList(record.id)
    }
    const getPropValueList = async id => {
        setPropValueDrawerTableLoading(true)
        let resp = await httpUtil.get(`/propValue/list/${id}`)
        setPropValueDrawerTableData(resp)
        setPropValueDrawerTableLoading(false)
    }

    const handlePropValueDrawerClose = () => {
        setPropValueDrawerProps({
            visible: false,
            title: '新增属性值',
            basePropKeyId: ''
        })
    }

    const [propValueDrawerModalProps, setPropvalueDrawermodalProps] = useState({
        visible: false,
        title: '新增属性值'
    })
    const [propValueDrawerModalData, setPropValueDrawerModalData] = useState({})
    const [propValueDrawerModalLoading, setPropValueDrawerModalLoading] = useState(false)
    const handlePropValueDrawerModalOpen = (data = {}) => {
        setPropvalueDrawermodalProps({
            visible: true,
            title: data.id ? '更新属性值' : '新增属性值'
        })
        if (data.id) {
            setPropValueDrawerModalData(data)
        }
    }
    const handlePropValueDrawerModalOk = async () => {
        let data = {
            basePropKeyId: propValueDrawerProps.basePropKeyId,
            propValue: propValueDrawerModalData.propValue,
            intro: propValueDrawerModalData.intro
        }
        if (propValueDrawerModalData.id) {
            data.id = propValueDrawerModalData.id
        }
        setPropValueDrawerModalLoading(true)
        await httpUtil.post(propValueDrawerModalData.id ? '/propValue/update' : '/propValue/add', data)
        message.success(propValueDrawerModalData.id ? '更新成功': '添加成功')
        handlePropValueDrawerModalClose()
        getPropValueList(propValueDrawerProps.basePropKeyId)
    }
    const handlePropValueDrawerModalClose = () => {
        setPropvalueDrawermodalProps({
            visible: false,
            title: '新增属性值'
        })
        setPropValueDrawerModalData({})
        setPropValueDrawerModalLoading(false)
    }

    const setPropValueDrawerModalValue = (e, valueName) => {
        const { value } = e.target
        setPropValueDrawerModalData({
            ...propValueDrawerModalData,
            [valueName]: value
        })
    }

    return (
        <div>
            <Card title="数据检索" extra={
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<SearchOutlined />}>
                            搜索
                    </Button>
                </Space>
            }>
                <Space>
                    <Input style={inputStyle} size="middle" placeholder="属性名称" allowClear defaultValue="" />
                </Space>
            </Card>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={handlePropKeyModalOpen}>
                        添加属性
                    </Button>
                </Space>
                <Table
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={false}
                    loading={loading}
                />
            </div>
            <Modal
                destroyOnClose
                title={propKeyModalProps.title}
                visible={propKeyModalProps.visible}
                onOk={handlePropKeyModalOk}
                confirmLoading={propKeyModalLoading}
                onCancel={handlePropKeyModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="属性分组名称"
                    >
                        <Input value={propKeyModalData.propKey} size="large" onChange={e => setPropKeyModalValue(e, 'propKey')}  placeholder="请输入属性键名"></Input>
                    </Form.Item>
                    <Form.Item
                        label="属性分组描述"
                    >
                        <Input value={propKeyModalData.intro} size="large" onChange={e => setPropKeyModalValue(e, 'intro')}  placeholder="请输入属性键名描述"></Input>
                    </Form.Item>
                </Form>
            </Modal>
            <Drawer
                width={1000}
                title={`【${propValueDrawerProps.title}】属性值列表`}
                placement="right"
                onClose={handlePropValueDrawerClose}
                visible={propValueDrawerProps.visible}
            >
                <Space>
                    <Button style={borderRadius} onClick={handlePropValueDrawerModalOpen} type="primary" size="middle" icon={<PlusOutlined />}>
                        新增属性值
                    </Button>
                </Space>
                <Table
                    bordered
                    style={{marginTop: 12}}
                    columns={propValueDrawerTableColumns}
                    rowKey={record => record.id}
                    dataSource={propValueDrawerTableData}
                    pagination={false}
                    loading={propValueDrawerTableLoading}
                />
            </Drawer>
            <Modal
                destroyOnClose
                title={propValueDrawerModalProps.title}
                visible={propValueDrawerModalProps.visible}
                onOk={handlePropValueDrawerModalOk}
                confirmLoading={propValueDrawerModalLoading}
                onCancel={handlePropValueDrawerModalClose}
            >
                <Form {...layout} size="large">
                    <Form.Item
                        label="属性值"
                    >
                        <Input value={propValueDrawerModalData.propValue} size="large" onChange={e => setPropValueDrawerModalValue(e, 'propValue')}  placeholder="请输入属性值"></Input>
                    </Form.Item>
                    <Form.Item
                        label="属性值描述"
                    >
                        <Input value={propValueDrawerModalData.intro} size="large" onChange={e => setPropValueDrawerModalValue(e, 'intro')}  placeholder="请输入属性值描述"></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default PropKeyList