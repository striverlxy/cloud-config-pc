import React, { useState } from 'react'
import { Card, Tree, Space, List, Button } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';
import styles from './style.less'

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0',
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1',
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2',
          },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
];

const MakeConfig = () => {

    const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
    const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
  
    const onExpand = (expandedKeys) => {
      console.log('onExpand', expandedKeys); 
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(false);
    };
  
    const onCheck = (checkedKeys) => {
      console.log('onCheck', checkedKeys);
      setCheckedKeys(checkedKeys);
    };
  
    const onSelect = (selectedKeys, info) => {
      console.log('onSelect', info);
      setSelectedKeys(selectedKeys);
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
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
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
                    dataSource={data}
                    footer={<div></div>}
                    renderItem={item => (
                        <List.Item
                            actions={[<EditOutlined className={styles.edit_icon} />, <DeleteOutlined className={styles.delete_icon} />]}
                        >
                            {item.title}
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