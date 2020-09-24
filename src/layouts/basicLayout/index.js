import React, { useState, useEffect, useMemo } from 'react'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { Layout, Breadcrumb, Space, Avatar, Badge, Menu, Dropdown, Modal } from 'antd'
import { Link, useLocation, useHistory } from 'react-router-dom'
import styles from './style.less'
import localStorage from '../../utils/localStorage'


const { Sider, Header, Content } = Layout

const renderMenuItem = (routes) => {
    if (!Array.isArray(routes)) {
        return null;
    }

    return routes
            .filter(r => r.hidden !== true)
            .map((item, index) => {
                if (item.children && item.children.length > 0) {
                    return <Menu.SubMenu key={item.path} icon={item.icon} title={item.name}>{ renderMenuItem(item.children) }</Menu.SubMenu>
                } else {
                    return <Menu.Item key={item.path} icon={item.icon}><Link to={item.path}>{item.name}</Link></Menu.Item>
                }
            })
}

const BasicLayout = ({route, children}) => {

    const [collapsed, setCollapsed] = useState(false)

    const { pathname } = useLocation()
    const [openKeys, setOpenKeys] = useState([]);
    const [bremList, setBremList] = useState([])

    const history = useHistory()
    history.listen(() => {
        setBreadcrumbList(history.location.pathname)
    })

    useEffect(() => {
        setBreadcrumbList(pathname)
    }, []);

    const setBreadcrumbList = pathName => {
        const list = pathName.split('/').splice(1);
        let selectedKeys = list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`)
        let itemList = route.children.slice()
        let bList = []
        for (let i = 0; i < selectedKeys.length; i++) {
            let menu = itemList.find(m => m.path == selectedKeys[i])
            if (!menu) {
                break;
            }
            bList.push({
                path: menu.path,
                title: menu.name,
            })
            itemList = menu.children
        }
        setOpenKeys(selectedKeys);
        if (pathName === '/home') {
            bList = []
        }
        setBremList(bList)
    }

    const getSelectedKeys = useMemo(() => {
        const list = pathname.split('/').splice(1);
        return list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`);
    }, [pathname]);

    const changeCollapsed = () => {
        console.log("openKeys", openKeys)
        setCollapsed(!collapsed)
    }

    const openChange = openKeys => {
        if (collapsed) {
            return false;
        }
        console.log('openChange', openKeys)
        setOpenKeys(openKeys)
    }

    const avatarMenu = () => {
        return (
            <Menu>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link to="/account/settings">
                        个人信息
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                    key="2" 
                    icon={<LogoutOutlined />}
                    onClick={() => {
                        Modal.confirm({
                            title: '操作确认',
                            icon: <ExclamationCircleOutlined />,
                            content: '现在退出登录吗？',
                            okText: '确认',
                            onOk() {
                                localStorage.removeItem('accessToken')
                                history.push('/user/login')
                            },
                            cancelText: '取消',
                          });
                    }}
                >
                    退出登录
                </Menu.Item>
            </Menu>
        )
    }

    let defaultOpenKeys = collapsed ? {} : { openKeys };
    return (
        <Layout className={styles.customer_component_layout}>
            <Sider trigger={null} collapsible collapsed={collapsed} className={styles.sider}>
                <div className={styles.logo} />
                <Menu 
                    theme="dark" 
                    mode="inline"
                    {...defaultOpenKeys}
                    selectedKeys={getSelectedKeys}
                    onOpenChange={openKeys => openChange(openKeys)}
                >
                    {renderMenuItem(route.children)}
                </Menu>
            </Sider>
            <Layout 
                className={styles.right_main_layout}
                style={{
                    marginLeft: !collapsed ? 200 : 80,
                }}
            >
                <Header className={styles.header}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {
                            React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: styles.trigger,
                                onClick: changeCollapsed,
                            })
                        }
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/home">首页</Link>
                            </Breadcrumb.Item>
                            {
                                bremList.map((item, index) => {
                                    return (
                                        <Breadcrumb.Item key={index}>
                                            {
                                                index == bremList.length - 1 ? <Link to={item.path}>{item.title}</Link> : item.title
                                            }
                                        </Breadcrumb.Item>
                                    )
                                })
                            }
                        </Breadcrumb>
                    </div>
                    <Space size='large' align="center">
                        <Badge dot={true}>
                            <BellOutlined style={{fontSize: 23, cursor: 'pointer'}} />
                        </Badge>
                        <Dropdown overlay={avatarMenu} placement="bottomLeft" arrow>
                            <Space style={{cursor: 'pointer'}}>
                                <Avatar shape="circle" icon={<UserOutlined />} />
                                <span>木子李</span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content className={styles.content}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default BasicLayout