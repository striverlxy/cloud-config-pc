import React, { useState, useEffect } from 'react'
import { Card, Tree, Space, List, Button, Modal, Table, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';
import styles from './style.less'
import httpUtil from '../../../utils/request'

const MakeConfig = () => {

    const [treeData, setTreeData] = useState([])

    useEffect(() => {
        getTreeData()
    }, [])

    const getTreeData = async () => {
        let resp = await httpUtil.get('/groups/propKeys')
        let dstData = wrapTree(resp)
        setTreeData(dstData)
    }

    const wrapTree = sourceList => {
        return sourceList.map(item => {
            return {
                key: `group-${item.group.id}`,
                title: item.group.groupName,
                children: item.keys.map(itm => {
                    return {
                        key: `key-${itm.id}`,
                        keyId: itm.id,
                        groupId: itm.groupId,
                        title: itm.propKey,
                    }
                })
            }
        })
    }

    const [choosedPropKeys, setChoosedPropKeys] = useState([])
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [showConfigCode, setShowConfigCode] = useState('')
  
    const onCheck = (checkedKeys, nodeInfo) => {

        let propKeys = choosedPropKeys.slice()
        if (nodeInfo.checked) {
            nodeInfo.checkedNodes
                            .filter(node => node.key.indexOf('group') == -1)
                            .map(node => {
                                let index = propKeys.findIndex(key => key.id == node.keyId)
                                if (index == -1) {
                                    propKeys.push({
                                        id: node.keyId,
                                        propKey: node.title,
                                        propValue: {
                                            id: '',
                                            valueName: ''
                                        }
                                    })
                                }
                            })
        } else {
            //checked == false
            propKeys = propKeys.filter(key => nodeInfo.checkedNodes.findIndex(node => node.keyId == key.id) > -1)
        }



        //准备展示数据
        makeShowConfigCode(propKeys)
        setChoosedPropKeys(propKeys)
        setCheckedKeys(checkedKeys);
    };

    const onChange = (newValue, e) => {
        console.log(newValue)
        console.log(e)
    }

    const editorDidMount = () => {

    }

    const options = {
        selectOnLineNumbers: true
    };

    const [propValueTableModalProps, setPropValueTableModalProps] = useState({
        visible: false,
        title: '',
        propKeyId: ''
    })
    const [propValueTableModalData, setPropValueTableModalData] = useState({})
    const handlePropValueTableModalOpen = async key => {
        await getPropValueList(key.id)
        setPropValueTableModalProps({
            visible: true,
            title: key.propKey,
            propKeyId: key.id
        })
        
    }

    const handlePropValueTableModalClose = () => {
        setPropValueTableModalProps({
            visible: false,
            title: '',
            propKeyId: ''
        })
        setPropValueTableModalData({})
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

    const propValueIsHasUsed = propValueInfo => {
        let keyObj = choosedPropKeys.find(key => key.id == propValueTableModalProps.propKeyId)
        if (null == keyObj) {
            return false
        } else {
            if (keyObj.propValue && keyObj.propValue.id == propValueInfo.id) {
                return true
            } else {
                return false
            }
        }
    }

    const getPropValueList = async id => {
        let resp = await httpUtil.get(`/propValue/list/${id}`)
        setPropValueTableModalData(resp)
    }

    const choosePropValue = propValueInfo => {
        let propKeys = choosedPropKeys.slice()
        let index = propKeys.findIndex(key => key.id == propValueTableModalProps.propKeyId)
        if (index == -1) {
            return ;
        }
        propKeys[index].propValue = {
            id: propValueInfo.id,
            valueName: propValueInfo.propValue
        }

        makeShowConfigCode(propKeys)
        setChoosedPropKeys(propKeys)
        handlePropValueTableModalClose()
    }

    const movePosition = (srcIndex, dstIndex) => {
        let propKeys = choosedPropKeys.slice()
        let tmp = propKeys[srcIndex]
        propKeys[srcIndex] = propKeys[dstIndex]
        propKeys[dstIndex] = tmp

        makeShowConfigCode(propKeys)
        setChoosedPropKeys(propKeys)
    }

    const makeShowConfigCode = propKeys => {
        let showString = ''
        propKeys.map(item => {
            showString += `${item.propKey}=${item.propValue.valueName}\n`
        })
        setShowConfigCode(showString)
    }

    return (
        <div className={styles.main}>
            <Card 
                title="属性配置"
                style={{width: '300px', flexGrow: 1}}
            >
                <Tree
                    checkable
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                />
            </Card>
            <Card 
                title="已选配置"
                style={{width: '600px', flexGrow: 1}}
                extra={
                    <Button type="primary" size="small">生成yaml配置</Button>
                }
            >
                <List
                    size="small"
                    itemLayout="horizontal"
                    dataSource={choosedPropKeys}
                    footer={<div></div>}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                    <Space size={1}>
                                        {index == 0 ? null : <ArrowUpOutlined className={styles.edit_icon} onClick={() => movePosition(index, index - 1)} />}
                                        {index == (choosedPropKeys.length - 1) ? null : <ArrowDownOutlined className={styles.edit_icon} onClick={() => movePosition(index, index + 1)} />}
                                    </Space>,
                                    item.propValue.id ?
                                        <Tooltip placement="bottom" title={item.propValue.valueName}>
                                            <EditOutlined className={styles.done_icon} onClick={() => handlePropValueTableModalOpen(item)} />
                                        </Tooltip> 
                                        :
                                        <EditOutlined className={styles.edit_icon} onClick={() => handlePropValueTableModalOpen(item)} />, 
                                    <DeleteOutlined className={styles.delete_icon} />
                            ]}
                        >
                            {item.propKey}
                        </List.Item>
                    )}
                />
            </Card>
            <MonacoEditor
                width="600"
                height="820"
                language="yaml"
                theme="vs-dark"
                value={showConfigCode}
                options={options}
                onChange={onChange}
                editorDidMount={editorDidMount}
            />
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
        </div>
    )
}

export default MakeConfig