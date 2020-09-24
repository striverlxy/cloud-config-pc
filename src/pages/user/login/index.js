import React, { useState, useEffect, useCallback } from 'react'
import { useHistory, Link } from "react-router-dom";
import { Tabs, Form, Input, Row, Col, Button, Checkbox, Alert, message } from 'antd';
import { LockTwoTone, MailTwoTone, MobileTwoTone, UserOutlined, AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import styles from './style.less'
import httpUtils from '../../../utils/request'
import localStorage from '../../../utils/localStorage'

const { TabPane } = Tabs;


const formRules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }]
}

const Login = () => {

    let history = useHistory();
    const [loginInfo, setLoginInfo] = useState({status: '', msg: ''})
    const [loginLoading, setLoginloading] = useState(false)

    const [form] = Form.useForm();

    const onFinish = async values => {
        const params = {
            "bizPlatform":"VIDEO",
            "authMethod":"PWD",
            "userScope":"VIDEO_SCREEN_ADMIN",
            "phone": values.username,
            "password": values.password
        }
        let res = await httpUtils.post('/auth-service/signIn', params)
        if (res) {
            localStorage.setItem(localStorage.keyMap.ACCESS_TOKEN, res.accessToken)
            history.push('/home')
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.login}>
                <Form form={form} onFinish={onFinish}>
                    <Tabs activeKey="account">
                        <TabPane tab="账户密码登录" key="account">
                            {
                                loginInfo.status == 'error' && (
                                    <Alert
                                        style={{
                                            marginBottom: 24,
                                        }}
                                        message={loginInfo.msg}
                                        type="error"
                                        showIcon
                                    />
                                )
                            }
                            <Form.Item name="username" rules={formRules.username}>
                                <Input size="large" prefix={<UserOutlined style={{color: '#1890ff'}} className={styles.prefixIcon} />} placeholder="请输入用户名" />
                            </Form.Item>
                            <Form.Item name="password" rules={formRules.password}>
                                <Input size="large" prefix={<LockTwoTone className={styles.prefixIcon} />} type='password' placeholder="请输入密码" />
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                    <Button size="large" loading={loginLoading} className={styles.submit} type="primary" htmlType="submit">登录</Button>
                </Form>
            </div>
        </div>
    )
}

export default Login