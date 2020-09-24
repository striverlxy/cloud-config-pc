import React, { useState, useEffect } from 'react'
import { Card, Tree, Space, List, Button } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
                                        propValue: {}
                                    })
                                }
                            })
        } else {
            //checked == false
            propKeys = propKeys.filter(key => nodeInfo.checkedNodes.findIndex(node => node.keyId == key.id) > -1)
        }

        setChoosedPropKeys(propKeys)
        setCheckedKeys(checkedKeys);
    };

    const [code, setCode] = useState('server:\n\tport: 8080')

    const onChange = (newValue, e) => {
        console.log(newValue)
        console.log(e)
    }

    const editorDidMount = () => {

    }

    const options = {
        selectOnLineNumbers: true
    };

    return (
        <div className={styles.main}>
            <Card 
                title="属性配置"
                style={{width: '500px', flexGrow: 1}}
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
                style={{width: '500px', flexGrow: 1}}
                extra={
                    <Button type="primary" size="small">生成yaml配置</Button>
                }
            >
                <List
                    size="small"
                    itemLayout="horizontal"
                    dataSource={choosedPropKeys}
                    footer={<div></div>}
                    renderItem={item => (
                        <List.Item
                            actions={[<EditOutlined className={styles.edit_icon} />, <DeleteOutlined className={styles.delete_icon} />]}
                        >
                            {item.propKey}
                        </List.Item>
                    )}
                />
            </Card>
            <MonacoEditor
                width="500"
                height="820"
                language="yaml"
                theme="vs-dark"
                value={code}
                options={options}
                onChange={onChange}
                editorDidMount={editorDidMount}
            />
        </div>
    )
}

export default MakeConfig