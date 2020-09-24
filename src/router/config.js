import React, {lazy} from 'react'
import { BarsOutlined, ProfileOutlined, ShopOutlined, LineChartOutlined } from '@ant-design/icons';
import BlankLayout from '../layouts/blankLayout'
import BasicLayout from '../layouts/basicLayout'
import UserLayout from '../layouts/userLayout'

const router = [
    {
        path: '/',
        component: BlankLayout,
        children: [
            {
                path: '/user',
                component: UserLayout,
                children: [
                    {
                        path: '/user/login',
                        name: '登陆',
                        component: lazy(() => import('../pages/user/login'))
                    },
                    {
                        path: '/user',
                        redirect: '/user/login',
                        hidden: true
                    },
                ]
            },
            {
                path: '/',
                component: BasicLayout,
                children: [
                    {
                        path: '/dataStatistics',
                        name: '数据统计',
                        icon: <LineChartOutlined />,
                        component: lazy(() => import('../pages/dataStatistics'))
                    },
                    {
                        path: '/configCenter',
                        name: '配置中心',
                        children: [
                            {
                                path: '/configCenter/serviceList',
                                name: '服务列表',
                                component: lazy(() => import('../pages/configCenter/service'))
                            },
                            {
                                path: '/configCenter/propGroup',
                                name: '属性分组',
                                component: lazy(() => import('../pages/configCenter/propGroup'))
                            },
                            {
                                path: '/configCenter/propKeyList',
                                name: '属性列表',
                                component: lazy(() => import('../pages/configCenter/propGroup/propKeyList')),
                                hidden: true
                            },
                            {
                                path: '/configCenter/makeConfig',
                                name: '制作配置',
                                component: lazy(() => import('../pages/configCenter/makeConfig')),
                            },
                            {
                                path: '/configCenter',
                                redirect: '/configCenter/serviceList',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/404',
                        name: '404',
                        hidden: true,
                        component: lazy(() => import('../pages/exception/pageNotFound'))
                    },
                    { path: '/', exact: true, redirect: '/dataStatistics', hidden: true},
                    { path: '*', exact: true, redirect: '/404', hidden: true },
                ]
            }
        ]
    }
]

export default router