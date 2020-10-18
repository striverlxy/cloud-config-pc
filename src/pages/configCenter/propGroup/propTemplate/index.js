import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Modal, Form, Radio, message, Card, Tooltip, List, Transfer } from 'antd';
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import httpUtil from '../../../../utils/request'
import styles from './style.less'
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';
import YAML from 'json2yaml'

const { Option } = Select;
const { RangePicker } = DatePicker;

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


const PropTemplate = () => {

    const { state } = useLocation()
    const [data, setData] = useState([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getPropTemplateList()
        getPropKeyList()
    }, [])

    const getPropTemplateList = async () => {
        setLoading(true)
        let resp = await httpUtil.get('/template/list', {groupId: state.groupId})
        setData(resp)
        setLoading(false)
    }

    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '模版名称',
            dataIndex: 'tplName',
            align: 'center',
        },
        {
            title: '模版类型',
            dataIndex: 'tplType',
            align: 'center',
            render: gender => gender == 1 ? '组件模版': '项目模版',
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'intro',
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle" onClick={() => handlePropTemplateModalOpen(record)}>查看详情</Button>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle" onClick={() => handleLinkTemplatePropModalOpen(record)}>模版属性</Button>
                    <Button style={{borderRadius: '4px'}} type="primary" danger size="middle">删除</Button>
                </Space>
            )
        }
    ];

    const [propTemplateModalProps, setPropTemplateModalProps] = useState({
        visible: false,
        title: '新增属性模版'
    })
    const [propTemplateModalData, setPropTemplateModalData] = useState({})
    const [propTemplateModalLoading, setPropTemplateModalLoading] = useState(false)

    const handlePropTemplateModalOpen = (data = {}) => {
        setPropTemplateModalProps({
            visible: true, 
            title: data.id ? '更新属性模版' : '新增属性模版'
        })
        if (data.id) {
            setPropTemplateModalData(data)
        }
    }

    const handlePropTemplateModalOk = async () => {
        let data = propTemplateModalData;
        if (!propTemplateModalData.id) {
            data.groupId = state.groupId
        }
        setPropTemplateModalLoading(true)
        await httpUtil.post(propTemplateModalData.id ? '/template/update' : '/template/add', data)
        message.success(propTemplateModalData.id ? '更新完成': '添加成功')
        handlePropTemplateModalClose()
        getPropTemplateList()
    }

    const handlePropTemplateModalClose = () => {
        setPropTemplateModalProps({
            visible: false, 
            title: '新增属性模版'
        })
        setPropTemplateModalData({})
        setPropTemplateModalLoading(false)
    }

    const setPropTemplateModalDataValue = (e, valueName) => {
        const { value } = e.target
        setPropTemplateModalData({
            ...propTemplateModalData,
            [valueName]: value
        })
    }

    const setTplType = e => {
        setPropTemplateModalData({
            ...propTemplateModalData,
            tplType: e.target.value
        })
    }



//======================================设置模版属性弹框===============================================================

    const [linkTemplatePropModalProps, setLinkTemplatePropModalProps] = useState({
        visible: false,
        title: '',
        tplId: ''
    })

    const [linkTemplatePropModalData, setLinkTemplatePropModalData] = useState([])

    const handleLinkTemplatePropModalOpen = async template => {
        console.log(template)
        setLinkTemplatePropModalProps({
            visible: true,
            title: template.tplName,
            tplId: template.id
        })
        await getTemplatePropsList(template.id)
    }

    const handleLinkTemplatePropModalClose = () => {
        setLinkTemplatePropModalProps({
            visible: false,
            title: '',
            tplId: ''
        })
    }

    const [showConfigCode, setShowConfigCode] = useState('')

    const [propValueTableModalProps, setPropValueTableModalProps] = useState({
        visible: false,
        title: '',
        propKeyId: ''
    })
    const [propValueTableModalData, setPropValueTableModalData] = useState([])
    const handlePropValueTableModalOpen = async key => {
        await getPropValueList(key.propKeyId)
        setPropValueTableModalProps({
            visible: true,
            title: key.propKey,
            propKeyId: key.propKeyId
        })
        
    }

    const handlePropValueTableModalClose = () => {
        setPropValueTableModalProps({
            visible: false,
            title: '',
            propKeyId: ''
        })
        setPropValueTableModalData([])
    }

    const propValueColumns = [
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
                    <Button style={{borderRadius: '4px'}} type="primary" disabled={propValueIsHasUsed(record)} size="middle" onClick={() => choosePropValue(record)}>{propValueIsHasUsed(record) ? '已选择' : '选择'}</Button>
                </Space>
            )
        }
    ]

    const propValueIsHasUsed = record => {
        let index = linkTemplatePropModalData.findIndex(prop => record.propKeyId == prop.propKeyId)
        if (index > -1) {
            return linkTemplatePropModalData[index].propValueId == record.id
        }   
        return false
    }

    const choosePropValue = async record => {
        let linkPropList = linkTemplatePropModalData.slice()
        let index = linkTemplatePropModalData.findIndex(prop => record.propKeyId == prop.propKeyId)
        if (index > -1) {
            if (linkPropList[index].propValueId != record.id) {
                linkPropList[index].propValueId = record.id
                await updateTemplateProps(linkPropList[index])
            }
        }
        handlePropValueTableModalClose()
    }

    const updateTemplateProps = async templateProp => {
        let data = {
            id: templateProp.id,
            tplId: templateProp.tplId,
            propValueId: templateProp.propValueId
        }
        let resp = await httpUtil.post('/update/template/prop', data)
        await getTemplatePropsList(linkTemplatePropModalProps.tplId)
    }

    const getPropValueList = async id => {
        let resp = await httpUtil.get(`/propValue/list/${id}`)
        setPropValueTableModalData(resp)
    }

    const createYAMLConfig = () => {
        let jsonConfig = {}
        linkTemplatePropModalData.map(item => {
            let splitPropKeyArr = item.propKey.split('.')
            jsonConfig = wrapJSON(splitPropKeyArr, jsonConfig, item.propValue)
        })

        let yamlStr = YAML.stringify(jsonConfig)
        setShowConfigCode(yamlStr)
    }
    const wrapJSON = (arr, jsonData, valueName) => {
        if (arr.length == 0) {
            return {};
        }

        let objectKey = arr[0]
        arr.splice(0, 1)

        if (arr.length == 0) {
            jsonData[objectKey] = valueName
        } else {
            if (!jsonData.hasOwnProperty(objectKey)) {
                jsonData[objectKey] = {}
            } 
            jsonData[objectKey] = wrapJSON(arr, jsonData[objectKey], valueName)
        }

        return jsonData
    }

    const removePropKey = () => {
        
    }

    const [choosePropModalProps, setChoosePropModalProps] = useState({
        visible: false
    })
    const [choosePropModalData, setChoosePropModalData] = useState([])

    const [groupAllPropList, setGroupAllPropList] = useState([])

    const handleChoosePropModalOpen = () => {
        setChoosePropModalProps({
            visible: true
        })
    }

    const handleChoosePropModalClose = () => {
        setChoosePropModalProps({
            visible: false
        })
    }

    const getPropKeyList = async () => {
        let resp = await httpUtil.get('/propKey/list', {groupId: state.groupId})
        setGroupAllPropList(resp.map(item => {
            return {
                key: item.id,
                title: item.propKey
            }
        }))
    }

    const [targetKeys, setTargetKeys] = useState([])
    const [selectedKeys, setSelectedKeys] = useState([])
    const handleChange = async (nextTargetKeys, direction, moveKeys) => {
        console.log(moveKeys)
        setTargetKeys(nextTargetKeys)
        await linkProps(moveKeys)
        await getTemplatePropsList(linkTemplatePropModalProps.tplId)
    }

    const linkProps = async keys => {
        let data = {
            tplId: linkTemplatePropModalProps.tplId,
            pairs: keys.map(item => {
                return {
                    propKeyId: item,
                    propValueId: ''
                }
            })
        }

        let resp = await httpUtil.post('/link/template/props', data)
        message.success('添加成功')
    }

    const getTemplatePropsList = async tplId => {
        let resp = await httpUtil.get(`/template/${tplId}/props`)
        setLinkTemplatePropModalData(resp)
        setTargetKeys(resp.map(item => item.propKeyId))
        makeShowConfigCode(resp)
    }

    const makeShowConfigCode = propKeys => {
        let showString = ''
        propKeys.map(item => {
            showString += `${item.propKey}=${item.propValue}\n`
        })
        setShowConfigCode(showString)
    }

    return (
        <div>
            {/* <Card title="数据检索" extra={
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<SearchOutlined />}>
                            搜索
                    </Button>
                </Space>
            }>
                <Space>
                    <Input style={inputStyle} size="middle" placeholder="姓名" allowClear defaultValue="" />
                    <Input style={inputStyle} size="middle" placeholder="手机号" allowClear defaultValue="" />
                    <Select
                        size="middle"
                        style={borderRadius}
                        placeholder="请选择用户"
                        allowClear 
                        onChange={() => handleChange}
                    >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                            Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <RangePicker style={borderRadius} size="middle" showTime={false} />
                </Space>
            </Card> */}
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={handlePropTemplateModalOpen}>
                        新增模版
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
                title={propTemplateModalProps.title}
                visible={propTemplateModalProps.visible}
                onOk={handlePropTemplateModalOk}
                confirmLoading={propTemplateModalLoading}
                onCancel={handlePropTemplateModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="模版名称"
                    >
                        <Input value={propTemplateModalData.tplName} size="large" onChange={e => setPropTemplateModalDataValue(e, 'tplName')}  placeholder="请输入模版名称"></Input>
                    </Form.Item>
                    <Form.Item
                        label="模版类型"
                    >
                        <Radio.Group buttonStyle="solid" value={propTemplateModalData.tplType} onChange={setTplType}>
                            <Radio.Button value={1}>组件模板</Radio.Button>
                            <Radio.Button value={2}>项目模板</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="模版描述"
                    >
                        <Input value={propTemplateModalData.intro} size="large" onChange={e => setPropTemplateModalDataValue(e, 'intro')}  placeholder="请输入模版描述"></Input>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                destroyOnClose
                width={1200}
                title={linkTemplatePropModalProps.title}
                visible={linkTemplatePropModalProps.visible}
                onCancel={handleLinkTemplatePropModalClose}
                footer={null}
            >
                <div className={styles.modal_main}>
                    <Card 
                        title="已选配置"
                        style={{width: '500px', flexGrow: 1}}
                        extra={
                            <Space>
                                <Button type="primary" size="small" onClick={handleChoosePropModalOpen}>添加属性</Button>
                                <Button type="primary" size="small" onClick={createYAMLConfig}>生成yaml配置</Button>
                            </Space>
                        }
                    >
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={linkTemplatePropModalData}
                            footer={<div></div>}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[
                                            // <div>
                                            //     {index == 0 ? null : <ArrowUpOutlined className={styles.edit_icon} onClick={() => movePosition(index, index - 1)} />}
                                            //     {index == (choosedPropKeys.length - 1) ? null : <ArrowDownOutlined className={styles.edit_icon} onClick={() => movePosition(index, index + 1)} />}
                                            // </div>,
                                            item.propValue ?
                                                <Tooltip placement="bottom" title={item.propValue}>
                                                    <EditOutlined className={styles.done_icon} onClick={() => handlePropValueTableModalOpen(item)} />
                                                </Tooltip> 
                                                :
                                                <EditOutlined className={styles.edit_icon} onClick={() => handlePropValueTableModalOpen(item)} />, 
                                            <DeleteOutlined className={styles.delete_icon} onClick={() => removePropKey(index)} />
                                    ]}
                                >
                                    {item.propKey}
                                </List.Item>
                            )}
                        />
                    </Card>
                    <MonacoEditor
                        width="600"
                        height="600"
                        language="yaml"
                        theme="vs-dark"
                        value={showConfigCode}
                        options={
                            {
                                selectOnLineNumbers: true
                            }
                        }
                    />
                </div>
            </Modal>
            <Modal
                width={1000}
                destroyOnClose
                title={`选择【 ${propValueTableModalProps.title} 】的属性值`}
                visible={propValueTableModalProps.visible}
                onCancel={handlePropValueTableModalClose}
                footer={null}
            >
                <Table
                    bordered
                    style={{marginTop: 12}}
                    columns={propValueColumns}
                    rowKey={record => record.id}
                    dataSource={propValueTableModalData}
                    pagination={false}
                />
            </Modal>
            <Modal
                width={700}
                destroyOnClose
                title={`选择属性`}
                visible={choosePropModalProps.visible}
                onCancel={handleChoosePropModalClose}
                footer={null}
            >
                <Transfer
                    listStyle={{
                        width: 300,
                        height: 300,
                    }}
                    dataSource={groupAllPropList}
                    titles={['待选属性', '已选属性']}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={item => item.title}
                    style={{ marginBottom: 16 }}
                    oneWay
                />
            </Modal>
        </div>
    )
}

export default PropTemplate